import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils';

export default function WeatherSuggestionsScreen(){
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/home-bg.jpg')} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.overlay} />
        <View style={styles.centerBox}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Under_construction_icon-yellow.svg/240px-Under_construction_icon-yellow.svg.png' }} style={styles.icon} />
          <Text style={styles.title}>Sugerencias por clima</Text>
          <Text style={styles.subtitle}>Página en construcción</Text>
          <Text style={styles.helper}>Pronto te recomendaremos tragos perfectos para el clima de hoy ☀️🌧️</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { width: 120, height: 120, marginBottom: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#fff', marginTop: 6, fontWeight: '600' },
  helper: { color: '#fff', marginTop: 8, textAlign: 'center' },
});


