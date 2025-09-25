import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function UploadDrinkScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [hasAlcohol, setHasAlcohol] = useState(true); // true = con alcohol, false = sin alcohol
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Subí tu trago</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Ingredientes" style={styles.input} value={ingredients} onChangeText={setIngredients} multiline />
      <TextInput placeholder="Instrucciones" style={styles.input} value={steps} onChangeText={setSteps} multiline />
      
      <View style={styles.toggleContainer}>
  <Pressable
    style={[styles.toggleButton, hasAlcohol && styles.activeToggle]}
    onPress={() => setHasAlcohol(true)}
  >
    <Text style={[styles.toggleText, hasAlcohol && styles.activeToggleText]}>
      Con alcohol
    </Text>
  </Pressable>

  <Pressable
    style={[styles.toggleButton, !hasAlcohol && styles.activeToggle]}
    onPress={() => setHasAlcohol(false)}
  >
    <Text style={[styles.toggleText, !hasAlcohol && styles.activeToggleText]}>
      Sin alcohol
    </Text>
  </Pressable>
</View>

      <Pressable style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Elegir foto</Text></Pressable>
      {image && <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 8 }} />}
      <Pressable style={[styles.button, styles.primary]} onPress={() => {}}>
        <Text style={[styles.buttonText, { color: 'white' }]}>Publicar</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.primary]} onPress={() => {}}>
        <Text style={[styles.buttonText, { color: 'white' }]}>Cancelar</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginTop: 10 },
  button: { paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: '#eee', marginTop: 12 },
  primary: { backgroundColor: '#111' },
  buttonText: { fontWeight: '600' },


  toggleContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 16,
},

toggleButton: {
  flex: 1,
  paddingVertical: 12,
  marginHorizontal: 4,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  alignItems: 'center',
},

activeToggle: {
  backgroundColor: '#007AFF', 
  borderColor: '#007AFF',
},

toggleText: {
  fontSize: 16,
  color: '#333',
},

activeToggleText: {
  color: 'white',
  fontWeight: '600',
},

});


