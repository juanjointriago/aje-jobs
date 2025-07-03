import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Script para probar las reglas de Firestore
 * Este script debería fallar al intentar escribir desde React
 */
export const testFirestoreRules = async () => {
  console.log('🧪 Probando reglas de Firestore...');
  
  // Test 1: Intentar crear un documento con setDoc
  try {
    console.log('📝 Test 1: Intentando escribir con setDoc...');
    await setDoc(doc(db, 'users', 'test-react'), {
      name: 'Test desde React',
      email: 'test@react.com',
      createdBy: 'React Frontend'
    });
    console.log('❌ ERROR: React pudo escribir con setDoc (las reglas están mal configuradas)');
    return false;
  } catch (error: unknown) {
    console.log('✅ Correcto: React no puede escribir con setDoc');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
  }

  // Test 2: Intentar crear un documento con addDoc
  try {
    console.log('📝 Test 2: Intentando escribir con addDoc...');
    await addDoc(collection(db, 'users'), {
      name: 'Test desde React 2',
      email: 'test2@react.com',
      createdBy: 'React Frontend'
    });
    console.log('❌ ERROR: React pudo escribir con addDoc (las reglas están mal configuradas)');
    return false;
  } catch (error: unknown) {
    console.log('✅ Correcto: React no puede escribir con addDoc');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
  }

  // Test 3: Intentar escribir en otra colección
  try {
    console.log('📝 Test 3: Intentando escribir en otra colección...');
    await setDoc(doc(db, 'other_collection', 'test'), {
      data: 'test'
    });
    console.log('❌ ERROR: React pudo escribir en otra colección (las reglas están mal configuradas)');
    return false;
  } catch (error: unknown) {
    console.log('✅ Correcto: React no puede escribir en otras colecciones');
    console.log('   Error:', error instanceof Error ? error.message : String(error));
  }

  console.log('🎉 Todas las pruebas pasaron! Las reglas de Firestore están correctamente configuradas.');
  return true;
};

// Función para probar solo en development
export const runFirestoreTests = () => {
  if (import.meta.env.DEV) {
    testFirestoreRules();
  }
};
