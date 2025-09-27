import React from 'react';
import { View,Text, FlatList,StyleSheet } from 'react-native';
import BebidaCard from './TragoItem';


export interface Bebida {
  id: string;
  nombre: string;
  nota: string;
  foto: { uri: string } | null;
  receta: { uri: string } | null;
}

interface TragoListProps {
  data: Bebida[];
  emptyText: string;
}

const TragoList = ({ data, emptyText }: TragoListProps) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer]}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  const dataWithPlaceholder = [...data];
  if (dataWithPlaceholder.length % 2 !== 0) {
    dataWithPlaceholder.push({ id: 'empty', nombre: '', nota: '', foto: null, receta: null });
  }

  const renderItem = ({ item }: any) => {
    if (item.id === 'empty') {
      return <View style={[styles.card, { backgroundColor: 'transparent', elevation: 0 }]} />;
    }
    return <BebidaCard nombre={item.nombre} nota={item.nota} foto={item.foto} receta={item.receta} />;
  };

  return (
    <View >
      <FlatList
        data={dataWithPlaceholder}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {

    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
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
});

export default TragoList;
