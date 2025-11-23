import { ParamListBase } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  AuthLoadingScreen: undefined;
  Home: undefined;
  AuthOptions: undefined;
  WelcomeHome: undefined;
  Login: undefined;
  Register: undefined;
  UserTypeSelection: undefined;
  GuestTabs: undefined;
  UserTabs: undefined;
  EmpresaTabs: undefined;
  Main: undefined;
  DetalleReceta: { recipeId: string };
  AuthManager: undefined;
  EmpresaAuthManager: undefined;
  RegistroEmpresa: undefined;
  Subir: undefined; // Asegurarse de que 'Subir' esté aquí
};

export type UserTabParamList = {
  Inicio: undefined;
  Explorar: undefined;
  Trivia: undefined;
  Cupones: undefined;
  Mapa: undefined;
  Favoritos: undefined;
  Subir: undefined;
};

// Para usar con useNavigation en componentes anidados
export type UserTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Favoritos'>,
  NativeStackScreenProps<RootStackParamList>
>;
