import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { FavoriteDrink } from '../../../../utils/firebaseFavorites';
import FavoriteDrinkItem from './FavoriteDrinkItem';
import { colors } from '../../../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteDrinksListProps {
  favorites: FavoriteDrink[];
  onDeleteFavorite: (drinkId: string) => void;
}

const FavoriteDrinksList: React.FC<FavoriteDrinksListProps> = ({ favorites, onDeleteFavorite }) => {
  const renderItem = useCallback(
    ({ item }: { item: FavoriteDrink }) => (
      <FavoriteDrinkItem item={item} onDelete={onDeleteFavorite} />
    ),
    [onDeleteFavorite]
  );

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.idDrink}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={(
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={colors.muted} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            Aún no tienes tragos favoritos.
            Agrega tus bebidas preferidas desde la vista de detalle.
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyIcon: {
    marginBottom: 10,
  },
});

export default FavoriteDrinksList;
