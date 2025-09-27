import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bars, setBars] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Consulta a Overpass API para obtener bares cercanos
      const query = `
        [out:json];
        node
          [amenity=bar]
          (around:1500, ${latitude}, ${longitude});
        out;
      `;

      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
        });
        const data = await response.json();

        const parsedBars = data.elements.map((bar: any) => ({
          name: bar.tags?.name || 'Bar sin nombre',
          latitude: bar.lat,
          longitude: bar.lon,
        }));

        setBars(parsedBars);
      } catch (error) {
        setErrorMsg('Error al consultar bares cercanos');
      }
    })();
  }, []);

  if (!region) {
    return (
      <SafeAreaView style={styles.center}>
        {errorMsg ? <Text>{errorMsg}</Text> : <ActivityIndicator />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Estás aquí" />
        {bars.map((bar, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: bar.latitude, longitude: bar.longitude }}
            title={bar.name}
            pinColor="purple"
          />
        ))}
      </MapView>
      <Pressable style={styles.homeBtn} onPress={() => navigation.navigate('Inicio')}>
        <Text style={styles.homeBtnText}>Volver a inicio</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  homeBtn: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#111', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#fff', fontWeight: '700' },
});
