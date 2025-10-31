import { colors } from "./colors";
import { sizes } from "./sizes";
import { firebaseApp } from "./initFirebase";
import { 
  registerForPushNotificationsAsync, 
  sendTestNotification, 
  cancelAllNotifications 
} from "./notifications";

// Servicios de Firebase
export { FirestoreCuponService, FirestoreEmpresaService, FirestoreUserService } from './firebaseServices';
export { FirebaseAuthService } from './firebaseAuth';
export { FirebaseEmpresaAuthService } from './firebaseEmpresaAuth';
export { FirebasePushService } from './firebasePushNotifications';

export {
  colors, 
  sizes, 
  firebaseApp,
  registerForPushNotificationsAsync,
  sendTestNotification,
  cancelAllNotifications
}