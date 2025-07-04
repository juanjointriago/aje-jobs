# Configuración Backend Django para Firebase

> **📋 Estructura de Datos Sincronizada**  
> Esta documentación está sincronizada con la interfaz `UserData` del frontend React. 
> Todos los modelos, serializers y ejemplos reflejan la estructura exacta utilizada en el frontend.

## Resumen de la estructura UserData

```typescript
interface UserData {
  Nombres: string;
  Apellidos: string;
  Cargo: string;
  CreatedAt: string;
  Email: string;
  Empresa: string;
  FechaNac: string;
  IsActive: string;
  LinkedInUrl: string;
  NroCelular: string;
  PhotoUrl: string;
  City?: string;
  TipoSangre: string;
  WebSyte: string;
}
```

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
from datetime import datetime

class User(models.Model):
    uid = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    # Campos principales (se corresponden con la interfaz UserData del frontend)
    nombres = models.CharField(max_length=255, verbose_name="Nombres")
    apellidos = models.CharField(max_length=255, verbose_name="Apellidos")
    cargo = models.CharField(max_length=255, blank=True, verbose_name="Cargo")
    email = models.EmailField(verbose_name="Email")
    empresa = models.CharField(max_length=255, blank=True, verbose_name="Empresa")
    nro_celular = models.CharField(max_length=20, blank=True, verbose_name="Número Celular")
    
    # Fechas y datos adicionales
    fecha_nac = models.CharField(max_length=50, blank=True, verbose_name="Fecha de Nacimiento")
    created_at = models.BigIntegerField(verbose_name="Fecha de Creación (Unix timestamp)")
    is_active = models.CharField(max_length=10, default="true", verbose_name="Activo")
    
    # URLs y enlaces
    photo_url = models.URLField(blank=True, verbose_name="URL de Foto")
    linkedin_url = models.URLField(blank=True, verbose_name="URL de LinkedIn")
    web_syte = models.URLField(blank=True, verbose_name="Sitio Web")
    
    # Información adicional
    city = models.CharField(max_length=255, blank=True, verbose_name="Ciudad")
    tipo_sangre = models.CharField(max_length=10, blank=True, verbose_name="Tipo de Sangre")
    
    # Campos de control de Django
    created_at_django = models.DateTimeField(auto_now_add=True)
    updated_at_django = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        
    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
    
    def save(self, *args, **kwargs):
        # Generar timestamp Unix para created_at si no existe
        if not self.created_at:
            self.created_at = int(datetime.now().timestamp())
        super().save(*args, **kwargs)

    def to_firestore_dict(self):
        """Convertir a diccionario compatible con la interfaz UserData del frontend"""
        return {
            'Nombres': self.nombres,
            'Apellidos': self.apellidos,
            'Cargo': self.cargo,
            'CreatedAt': str(self.created_at),  # Como string para compatibilidad
            'Email': self.email,
            'Empresa': self.empresa,
            'FechaNac': self.fecha_nac,
            'IsActive': self.is_active,
            'LinkedInUrl': self.linkedin_url,
            'NroCelular': self.nro_celular,
            'PhotoUrl': self.photo_url,
            'City': self.city,
            'TipoSangre': self.tipo_sangre,
            'WebSyte': self.web_syte
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

### 4.1. Serializers

```python
# serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    # Campos de solo lectura calculados
    created_at_formatted = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'uid', 'nombres', 'apellidos', 'cargo', 'email', 'empresa',
            'nro_celular', 'fecha_nac', 'created_at', 'is_active',
            'photo_url', 'linkedin_url', 'web_syte', 'city', 'tipo_sangre',
            'created_at_django', 'updated_at_django',
            # Campos calculados
            'created_at_formatted', 'full_name'
        ]
        read_only_fields = ['uid', 'created_at_django', 'updated_at_django']
    
    def get_created_at_formatted(self, obj):
        """Formatear fecha de creación desde Unix timestamp"""
        try:
            from datetime import datetime
            timestamp = int(obj.created_at)
            date = datetime.fromtimestamp(timestamp)
            return date.strftime("%B %Y")  # Ej: "Enero 2020"
        except (ValueError, TypeError):
            return "Fecha no disponible"
    
    def get_full_name(self, obj):
        """Nombre completo"""
        return f"{obj.nombres} {obj.apellidos}".strip()

class UserFirestoreSerializer(serializers.ModelSerializer):
    """Serializer específico para estructura Firestore/Frontend"""
    Nombres = serializers.CharField(source='nombres')
    Apellidos = serializers.CharField(source='apellidos')
    Cargo = serializers.CharField(source='cargo')
    CreatedAt = serializers.CharField(source='created_at')
    Email = serializers.EmailField(source='email')
    Empresa = serializers.CharField(source='empresa')
    FechaNac = serializers.CharField(source='fecha_nac')
    IsActive = serializers.CharField(source='is_active')
    LinkedInUrl = serializers.URLField(source='linkedin_url')
    NroCelular = serializers.CharField(source='nro_celular')
    PhotoUrl = serializers.URLField(source='photo_url')
    City = serializers.CharField(source='city')
    TipoSangre = serializers.CharField(source='tipo_sangre')
    WebSyte = serializers.URLField(source='web_syte')
    
    class Meta:
        model = User
        fields = [
            'Nombres', 'Apellidos', 'Cargo', 'CreatedAt', 'Email', 'Empresa',
            'FechaNac', 'IsActive', 'LinkedInUrl', 'NroCelular', 'PhotoUrl',
            'City', 'TipoSangre', 'WebSyte'
        ]
```

### 5. Views y APIs

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from .serializers import UserSerializer, UserFirestoreSerializer
from .services import FirestoreService

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.firestore_service = FirestoreService()
    
    def get_serializer_class(self):
        """Usar serializer específico según la acción"""
        if self.action in ['firestore_format']:
            return UserFirestoreSerializer
        return UserSerializer
    
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
    
    @action(detail=True, methods=['get'])
    def firestore_format(self, request, pk=None):
        """Obtener usuario en formato compatible con frontend (UserData)"""
        user = self.get_object()
        serializer = UserFirestoreSerializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def export_firestore_format(self, request):
        """Exportar todos los usuarios en formato Firestore"""
        users = self.get_queryset()
        serializer = UserFirestoreSerializer(users, many=True)
        return Response({
            'count': users.count(),
            'users': serializer.data
        })
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
from datetime import datetime

class FirestoreIntegrationTest(TestCase):
    def setUp(self):
        self.firestore_service = FirestoreService()
        self.test_uid = str(uuid.uuid4())
    
    def test_create_user_in_firestore(self):
        """Test crear usuario en Firestore con estructura UserData"""
        user_data = {
            'Nombres': 'Juan Carlos',
            'Apellidos': 'Pérez González',
            'Cargo': 'Director Ejecutivo',
            'Email': 'juan.perez@ajejobs.com',
            'Empresa': 'AJE JOBS',
            'NroCelular': '+593987654321',
            'FechaNac': '15 de Marzo',
            'IsActive': 'true',
            'LinkedInUrl': 'https://linkedin.com/in/juan-perez',
            'PhotoUrl': 'https://firebasestorage.googleapis.com/...',
            'City': 'Quito',
            'TipoSangre': 'O+',
            'WebSyte': 'https://www.ajejobs.com',
            'CreatedAt': str(int(datetime.now().timestamp()))
        }
        
        uid = self.firestore_service.create_user(user_data, self.test_uid)
        self.assertEqual(uid, self.test_uid)
    
    def test_django_to_firestore_sync(self):
        """Test sincronización Django -> Firestore con campos actualizados"""
        user = User.objects.create(
            uid=self.test_uid,
            nombres='María Elena',
            apellidos='García López',
            cargo='Gerente de Recursos Humanos',
            email='maria.garcia@ajejobs.com',
            empresa='AJE JOBS',
            nro_celular='+593998765432',
            fecha_nac='22 de Julio',
            linkedin_url='https://linkedin.com/in/maria-garcia',
            city='Guayaquil',
            tipo_sangre='A+',
            web_syte='https://www.ajejobs.com'
        )
        
        # La sincronización debería ocurrir automáticamente por signals
        result = self.firestore_service.sync_user_to_firestore(user)
        self.assertEqual(result, self.test_uid)
    
    def test_firestore_dict_structure(self):
        """Test que to_firestore_dict() genere estructura correcta"""
        user = User(
            nombres='Pedro',
            apellidos='Rodríguez',
            cargo='Desarrollador Senior',
            email='pedro@example.com',
            empresa='Tech Corp',
            nro_celular='+593912345678',
            created_at=1640995200  # 1 de enero 2022
        )
        
        firestore_dict = user.to_firestore_dict()
        
        # Verificar que tenga todos los campos esperados
        expected_fields = [
            'Nombres', 'Apellidos', 'Cargo', 'CreatedAt', 'Email', 'Empresa',
            'FechaNac', 'IsActive', 'LinkedInUrl', 'NroCelular', 'PhotoUrl',
            'City', 'TipoSangre', 'WebSyte'
        ]
        
        for field in expected_fields:
            self.assertIn(field, firestore_dict)
        
        # Verificar valores específicos
        self.assertEqual(firestore_dict['Nombres'], 'Pedro')
        self.assertEqual(firestore_dict['Apellidos'], 'Rodríguez')
        self.assertEqual(firestore_dict['CreatedAt'], '1640995200')
    
    def test_unix_timestamp_creation(self):
        """Test que se genere timestamp Unix automáticamente"""
        user = User.objects.create(
            nombres='Ana',
            apellidos='Martínez',
            email='ana@example.com'
        )
        
        # Verificar que created_at se generó automáticamente
        self.assertIsNotNone(user.created_at)
        self.assertIsInstance(user.created_at, int)
        
        # Verificar que es un timestamp válido (aproximadamente actual)
        current_timestamp = int(datetime.now().timestamp())
        self.assertAlmostEqual(user.created_at, current_timestamp, delta=60)  # Diferencia máxima de 1 minuto
    
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

## Ejemplos de uso de la API

### Crear usuario con estructura UserData

```python
# POST /api/users/
{
    "nombres": "Juan Carlos",
    "apellidos": "Pérez González",
    "cargo": "Director Ejecutivo",
    "email": "juan.perez@ajejobs.com",
    "empresa": "AJE JOBS",
    "nro_celular": "+593987654321",
    "fecha_nac": "15 de Marzo",
    "linkedin_url": "https://linkedin.com/in/juan-perez",
    "photo_url": "https://firebasestorage.googleapis.com/v0/b/card-unity.firebasestorage.app/o/unity_credentials%2Fquality%3D100%20(3).png?alt=media&token=30a1f93f-2325-4bbd-a21f-04ff24efd94f",
    "city": "Quito",
    "tipo_sangre": "O+",
    "web_syte": "https://www.ajejobs.com"
}
```

### Obtener usuario en formato Firestore (compatible con frontend)

```python
# GET /api/users/{id}/firestore_format/
{
    "Nombres": "Juan Carlos",
    "Apellidos": "Pérez González", 
    "Cargo": "Director Ejecutivo",
    "CreatedAt": "1640995200",
    "Email": "juan.perez@ajejobs.com",
    "Empresa": "AJE JOBS",
    "FechaNac": "15 de Marzo",
    "IsActive": "true",
    "LinkedInUrl": "https://linkedin.com/in/juan-perez",
    "NroCelular": "+593987654321",
    "PhotoUrl": "https://firebasestorage.googleapis.com/...",
    "City": "Quito",
    "TipoSangre": "O+",
    "WebSyte": "https://www.ajejobs.com"
}
```

### Exportar todos los usuarios en formato Firestore

```python
# GET /api/users/export_firestore_format/
{
    "count": 25,
    "users": [
        {
            "Nombres": "Juan Carlos",
            "Apellidos": "Pérez González",
            // ... resto de campos
        },
        {
            "Nombres": "María Elena", 
            "Apellidos": "García López",
            // ... resto de campos
        }
    ]
}
```

## Migración de datos existentes

Si ya tienes datos con estructura antigua, aquí tienes un script de migración:

```python
# management/commands/migrate_user_data.py
from django.core.management.base import BaseCommand
from your_app.models import User
from datetime import datetime

class Command(BaseCommand):
    help = 'Migrar datos de usuarios a nueva estructura UserData'
    
    def handle(self, *args, **options):
        users = User.objects.all()
        
        for user in users:
            updated = False
            
            # Migrar campos antiguos a nuevos
            if hasattr(user, 'name') and not user.nombres:
                name_parts = user.name.split(' ', 1)
                user.nombres = name_parts[0]
                user.apellidos = name_parts[1] if len(name_parts) > 1 else ''
                updated = True
            
            if hasattr(user, 'position') and not user.cargo:
                user.cargo = user.position
                updated = True
                
            if hasattr(user, 'company') and not user.empresa:
                user.empresa = user.company
                updated = True
                
            if hasattr(user, 'phone') and not user.nro_celular:
                user.nro_celular = user.phone
                updated = True
                
            if hasattr(user, 'linkedin') and not user.linkedin_url:
                user.linkedin_url = user.linkedin
                updated = True
                
            if hasattr(user, 'avatar') and not user.photo_url:
                user.photo_url = user.avatar
                updated = True
                
            if hasattr(user, 'website') and not user.web_syte:
                user.web_syte = user.website
                updated = True
            
            # Generar timestamp Unix si no existe
            if not user.created_at:
                if hasattr(user, 'created_at_django') and user.created_at_django:
                    user.created_at = int(user.created_at_django.timestamp())
                else:
                    user.created_at = int(datetime.now().timestamp())
                updated = True
            
            if updated:
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Usuario {user.uid} migrado')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Migración completada. {users.count()} usuarios procesados.')
        )
```

```bash
# Ejecutar migración
python manage.py migrate_user_data
```

## Validación de sincronización Frontend-Backend

Para asegurar que la estructura de datos esté siempre sincronizada, puedes usar estos comandos:

### Script de validación de estructura

```python
# management/commands/validate_structure.py
from django.core.management.base import BaseCommand
from your_app.models import User
import json

class Command(BaseCommand):
    help = 'Validar que la estructura Django esté sincronizada con UserData del frontend'
    
    def handle(self, *args, **options):
        # Estructura esperada del frontend
        expected_fields = [
            'Nombres', 'Apellidos', 'Cargo', 'CreatedAt', 'Email', 'Empresa',
            'FechaNac', 'IsActive', 'LinkedInUrl', 'NroCelular', 'PhotoUrl',
            'City', 'TipoSangre', 'WebSyte'
        ]
        
        # Crear usuario de prueba
        test_user = User(
            nombres='Test',
            apellidos='User',
            email='test@example.com',
            created_at=1640995200
        )
        
        # Obtener estructura generada
        firestore_dict = test_user.to_firestore_dict()
        
        # Validar campos
        missing_fields = []
        for field in expected_fields:
            if field not in firestore_dict:
                missing_fields.append(field)
        
        extra_fields = []
        for field in firestore_dict.keys():
            if field not in expected_fields:
                extra_fields.append(field)
        
        # Mostrar resultados
        if not missing_fields and not extra_fields:
            self.stdout.write(
                self.style.SUCCESS('✅ Estructura sincronizada correctamente con frontend')
            )
        else:
            if missing_fields:
                self.stdout.write(
                    self.style.ERROR(f'❌ Campos faltantes: {missing_fields}')
                )
            if extra_fields:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ Campos extra: {extra_fields}')
                )
        
        # Mostrar estructura actual
        self.stdout.write('\n📋 Estructura actual:')
        self.stdout.write(json.dumps(firestore_dict, indent=2, ensure_ascii=False))
```

```bash
# Ejecutar validación
python manage.py validate_structure
```

### Checklist de sincronización

Antes de hacer cambios en la estructura de datos, verifica:

- [ ] La interfaz `UserData` en `src/interfaces/user.interface.ts`
- [ ] El modelo `User` en Django tiene todos los campos correspondientes
- [ ] El método `to_firestore_dict()` mapea todos los campos correctamente
- [ ] Los serializers `UserFirestoreSerializer` incluyen todos los campos
- [ ] Los tests validan la nueva estructura
- [ ] La documentación está actualizada

### Comandos útiles para desarrollo

```bash
# Sincronizar todos los usuarios a Firestore
python manage.py sync_all_users

# Validar estructura de datos
python manage.py validate_structure

# Migrar datos antiguos
python manage.py migrate_user_data

# Ejecutar tests de integración con Firestore
python manage.py test your_app.tests.FirestoreIntegrationTest
```

---

**📝 Nota**: Esta documentación se actualiza automáticamente cuando se modifica la interfaz `UserData` del frontend. Asegúrate de mantener ambas estructuras sincronizadas.
