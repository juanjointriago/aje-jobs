# Configuración Backend Django para Firebase

## Instalación de dependencias

```bash
pip install firebase-admin
```

## Configuración básica

### 1. Service Account Key

1. Ve a Firebase Console > Project Settings > Service Accounts
2. Haz clic en "Generate new private key"
3. Descarga el archivo JSON y guárdalo de forma segura
4. No commitees este archivo a git (agrégalo a .gitignore)

### 2. Configuración en Django

```python
# settings.py
import os
from pathlib import Path

# Path al Service Account Key
FIREBASE_CREDENTIALS_PATH = os.path.join(BASE_DIR, 'firebase-service-account.json')

# O usando variables de entorno (más seguro)
FIREBASE_CREDENTIALS = {
    "type": os.getenv('FIREBASE_TYPE'),
    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
    "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
    "auth_uri": os.getenv('FIREBASE_AUTH_URI'),
    "token_uri": os.getenv('FIREBASE_TOKEN_URI'),
    "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
    "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL')
}
```

### 3. Inicialización de Firebase

```python
# firebase_config.py
import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
import os

def initialize_firebase():
    """Inicializar Firebase Admin SDK"""
    if not firebase_admin._apps:
        try:
            # Opción 1: Usar archivo JSON
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            
            # Opción 2: Usar variables de entorno
            else:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
            
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK inicializado correctamente")
        except Exception as e:
            print(f"❌ Error inicializando Firebase: {e}")
            raise e

def get_firestore_client():
    """Obtener cliente de Firestore"""
    initialize_firebase()
    return firestore.client()
```

### 4. Models y Servicios

```python
# models.py
from django.db import models
import uuid

class User(models.Model):
    uid = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=255, blank=True)
    position = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def to_firestore_dict(self):
        """Convertir a diccionario para Firestore"""
        return {
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'position': self.position,
            'bio': self.bio,
            'avatar': self.avatar,
            'contact': {
                'email': self.email,
                'phone': self.phone,
                'website': self.website
            },
            'socials': {
                'linkedin': self.linkedin,
                'twitter': self.twitter,
                'instagram': self.instagram
            },
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
```

```python
# services.py
from .firebase_config import get_firestore_client
from .models import User

class FirestoreService:
    def __init__(self):
        self.db = get_firestore_client()
    
    def create_user(self, user_data, uid=None):
        """Crear usuario en Firestore"""
        try:
            if uid is None:
                uid = user_data.get('uid') or str(uuid.uuid4())
            
            doc_ref = self.db.collection('users').document(uid)
            doc_ref.set(user_data)
            return uid
        except Exception as e:
            print(f"Error creando usuario en Firestore: {e}")
            raise e
    
    def update_user(self, uid, user_data):
        """Actualizar usuario en Firestore"""
        try:
            doc_ref = self.db.collection('users').document(uid)
            doc_ref.update(user_data)
            return True
        except Exception as e:
            print(f"Error actualizando usuario en Firestore: {e}")
            raise e
    
    def delete_user(self, uid):
        """Eliminar usuario de Firestore"""
        try:
            doc_ref = self.db.collection('users').document(uid)
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error eliminando usuario de Firestore: {e}")
            raise e
    
    def sync_user_to_firestore(self, user_instance):
        """Sincronizar usuario de Django a Firestore"""
        try:
            firestore_data = user_instance.to_firestore_dict()
            return self.create_user(firestore_data, user_instance.uid)
        except Exception as e:
            print(f"Error sincronizando usuario a Firestore: {e}")
            raise e
```

### 5. Views y APIs

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from .serializers import UserSerializer
from .services import FirestoreService

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.firestore_service = FirestoreService()
    
    def create(self, request, *args, **kwargs):
        """Crear usuario en Django y Firestore"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Guardar en Django
            user = serializer.save()
            
            # Sincronizar a Firestore
            try:
                self.firestore_service.sync_user_to_firestore(user)
            except Exception as e:
                # Si falla Firestore, eliminar de Django
                user.delete()
                return Response(
                    {'error': f'Error sincronizando con Firestore: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Actualizar usuario en Django y Firestore"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Actualizar en Firestore
            try:
                firestore_data = user.to_firestore_dict()
                self.firestore_service.update_user(user.uid, firestore_data)
            except Exception as e:
                return Response(
                    {'error': f'Error actualizando en Firestore: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar usuario de Django y Firestore"""
        instance = self.get_object()
        uid = instance.uid
        
        # Eliminar de Firestore primero
        try:
            self.firestore_service.delete_user(uid)
        except Exception as e:
            return Response(
                {'error': f'Error eliminando de Firestore: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Eliminar de Django
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def sync_to_firestore(self, request, pk=None):
        """Sincronizar usuario específico a Firestore"""
        user = self.get_object()
        try:
            self.firestore_service.sync_user_to_firestore(user)
            return Response({'message': 'Usuario sincronizado correctamente'})
        except Exception as e:
            return Response(
                {'error': f'Error sincronizando: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### 6. Signals para sincronización automática

```python
# signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import User
from .services import FirestoreService

@receiver(post_save, sender=User)
def sync_user_to_firestore_on_save(sender, instance, created, **kwargs):
    """Sincronizar usuario a Firestore cuando se crea o actualiza"""
    try:
        firestore_service = FirestoreService()
        firestore_service.sync_user_to_firestore(instance)
        print(f"✅ Usuario {instance.uid} sincronizado a Firestore")
    except Exception as e:
        print(f"❌ Error sincronizando usuario {instance.uid}: {e}")

@receiver(post_delete, sender=User)
def delete_user_from_firestore_on_delete(sender, instance, **kwargs):
    """Eliminar usuario de Firestore cuando se elimina de Django"""
    try:
        firestore_service = FirestoreService()
        firestore_service.delete_user(instance.uid)
        print(f"✅ Usuario {instance.uid} eliminado de Firestore")
    except Exception as e:
        print(f"❌ Error eliminando usuario {instance.uid} de Firestore: {e}")
```

### 7. Apps.py

```python
# apps.py
from django.apps import AppConfig

class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'your_app'
    
    def ready(self):
        import your_app.signals  # Importar signals
        from .firebase_config import initialize_firebase
        
        # Inicializar Firebase al arrancar Django
        try:
            initialize_firebase()
        except Exception as e:
            print(f"❌ Error inicializando Firebase en startup: {e}")
```

## Variables de entorno (.env)

```env
# Firebase Service Account (más seguro que archivo JSON)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

## Testing

```python
# tests.py
from django.test import TestCase
from .models import User
from .services import FirestoreService
import uuid

class FirestoreIntegrationTest(TestCase):
    def setUp(self):
        self.firestore_service = FirestoreService()
        self.test_uid = str(uuid.uuid4())
    
    def test_create_user_in_firestore(self):
        """Test crear usuario en Firestore"""
        user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+1234567890'
        }
        
        uid = self.firestore_service.create_user(user_data, self.test_uid)
        self.assertEqual(uid, self.test_uid)
    
    def test_django_to_firestore_sync(self):
        """Test sincronización Django -> Firestore"""
        user = User.objects.create(
            uid=self.test_uid,
            name='Test User',
            email='test@example.com'
        )
        
        # La sincronización debería ocurrir automáticamente por signals
        # Verificar manualmente si es necesario
        result = self.firestore_service.sync_user_to_firestore(user)
        self.assertEqual(result, self.test_uid)
    
    def tearDown(self):
        """Limpiar datos de prueba"""
        try:
            self.firestore_service.delete_user(self.test_uid)
        except:
            pass
```

## Comandos de gestión

```python
# management/commands/sync_all_users.py
from django.core.management.base import BaseCommand
from your_app.models import User
from your_app.services import FirestoreService

class Command(BaseCommand):
    help = 'Sincronizar todos los usuarios de Django a Firestore'
    
    def handle(self, *args, **options):
        firestore_service = FirestoreService()
        users = User.objects.all()
        
        for user in users:
            try:
                firestore_service.sync_user_to_firestore(user)
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Usuario {user.uid} sincronizado')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error con usuario {user.uid}: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Proceso completado. {users.count()} usuarios procesados.')
        )
```

## Uso

```bash
# Sincronizar todos los usuarios
python manage.py sync_all_users

# Ejecutar tests
python manage.py test your_app.tests.FirestoreIntegrationTest
```
