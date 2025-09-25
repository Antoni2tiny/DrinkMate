import React from 'react';
import { View, Text, Image, StyleSheet,Pressable, Linking } from 'react-native';

interface BebidaCardProps {
  nombre: string;
  nota: string;
  foto: { uri: string };
  receta: { uri: string };
}

const BebidaCard = ({ nombre, nota, foto, receta }: BebidaCardProps) => (
  <Pressable style={styles.card}
  //onPress={() => receta?.uri && Linking.openURL(receta.uri)} 
  >
    <Image source={foto} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{nombre}</Text>
    <Text style={styles.cardNote}>{nota}</Text>
    <Text style={styles.cardLink}>Ver receta</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,                
    margin: 4,             
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardNote: {
    fontSize: 12,
    color: '#333',
  },
  cardLink: { fontSize: 12, color: '#007BFF' },
});

export default BebidaCard;
