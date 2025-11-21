import { getFirestore, collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Para obtener el usuario actual
import { firebaseApp } from './initFirebase'; // Tu aplicación Firebase inicializada

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp); // Obtener la instancia de Auth


// Tipo para una bebida favorita, basado en DrinkType pero con un timestamp
export interface FavoriteDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  timestamp: any; // Usaremos serverTimestamp
}

/**
 * Añade una bebida a la colección de favoritos del usuario actual.
 */
export async function addFavorite(drink: FavoriteDrink): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    console.error('No hay usuario autenticado para añadir favoritos.');
    return false;
  }

  try {
    const favoriteRef = doc(db, 'usuarios', user.uid, 'favoritos', drink.idDrink);
    await setDoc(favoriteRef, {
      ...drink,
      timestamp: serverTimestamp(), // Guarda la marca de tiempo del servidor
    });
    console.log(`Bebida "${drink.strDrink}" añadida a favoritos.`);
    return true;
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    return false;
  }
}

/**
 * Elimina una bebida de la colección de favoritos del usuario actual.
 */
export async function removeFavorite(drinkId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    console.error('No hay usuario autenticado para eliminar favoritos.');
    return false;
  }

  try {
    const favoriteRef = doc(db, 'usuarios', user.uid, 'favoritos', drinkId);
    await deleteDoc(favoriteRef);
    console.log(`Bebida con ID "${drinkId}" eliminada de favoritos.`);
    return true;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return false;
  }
}

/**
 * Verifica si una bebida está en la colección de favoritos del usuario actual.
 */
export async function isFavorite(drinkId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    return false; // Si no hay usuario, no puede ser favorita
  }

  try {
    const favoriteRef = doc(db, 'usuarios', user.uid, 'favoritos', drinkId);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
}

/**
 * Obtiene todas las bebidas favoritas del usuario actual.
 */
export async function getFavorites(): Promise<FavoriteDrink[]> {
  const user = auth.currentUser;
  if (!user) {
    console.error('No hay usuario autenticado para obtener favoritos.');
    return [];
  }

  try {
    const favoritesCollectionRef = collection(db, 'usuarios', user.uid, 'favoritos');
    const q = query(favoritesCollectionRef); // Puedes añadir .orderBy('timestamp', 'desc') si quieres ordenarlos
    const querySnapshot = await getDocs(q);
    const favorites: FavoriteDrink[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(doc.data() as FavoriteDrink);
    });
    return favorites;
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
}
