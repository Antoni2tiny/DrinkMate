import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function UploadDrinkScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tu galería de fotos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  const handlePublish = async () => {
    // Validaciones
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del trago.');
      return;
    }
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Por favor ingresa los ingredientes.');
      return;
    }
    if (!steps.trim()) {
      Alert.alert('Error', 'Por favor ingresa los pasos de preparación.');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar en Firebase
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Éxito', 
        'Tu trago se ha publicado correctamente!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar el formulario
              setName('');
              setIngredients('');
              setSteps('');
              setImage(null);
              // Navegar a la tab de Inicio
              navigation.navigate('Inicio');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al publicar tu trago. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Subí tu trago</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Ingredientes" style={styles.input} value={ingredients} onChangeText={setIngredients} multiline />
      <TextInput placeholder="Pasos" style={styles.input} value={steps} onChangeText={setSteps} multiline />
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Elegir foto</Text>
      </Pressable>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <Pressable 
        style={[styles.button, styles.primary, isLoading && styles.disabled]} 
        onPress={handlePublish}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>
          {isLoading ? 'Publicando...' : 'Publicar'}
        </Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  button: { 
    paddingVertical: 14, 
    alignItems: 'center', 
    borderRadius: 8, 
    backgroundColor: '#f0f0f0', 
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  primary: { backgroundColor: '#007AFF' },
  disabled: { backgroundColor: '#999', opacity: 0.6 },
  buttonText: { fontWeight: '600', fontSize: 16 },
  imagePreview: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    marginTop: 16,
    resizeMode: 'cover'
  },
});


