import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoriteDrink } from '../../../../utils/firebaseFavorites';
import { colors } from '../../../../utils/colors';
import { useNavigation } from '@react-navigation/native';

interface FavoriteDrinkItemProps {
  item: FavoriteDrink;
  onDelete: (drinkId: string) => void;
}

const FavoriteDrinkItem: React.FC<FavoriteDrinkItemProps> = ({ item, onDelete }) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('DetalleReceta', { idDrink: item.idDrink });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Image source={{ uri: item.strDrinkThumb }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.strDrink}</Text>
        {item.strCategory && <Text style={styles.cardCategory}>{item.strCategory}</Text>}
        {item.strAlcoholic && <Text style={styles.cardCategory}>{item.strAlcoholic}</Text>}
      </View>
      <Pressable style={styles.deleteButton} onPress={() => onDelete(item.idDrink)}>
        <Ionicons name="trash" size={20} color={colors.background} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: colors.muted,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
});

export default FavoriteDrinkItem;
