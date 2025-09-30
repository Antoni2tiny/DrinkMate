import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [bares, setBares] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      buscarBares(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  const buscarBares = async (lat: number, lng: number) => {
    const query = `
      [out:json][timeout:25];
      (
        node(around:1000,${lat},${lng})[amenity=bar];
        way(around:1000,${lat},${lng})[amenity=bar];
        relation(around:1000,${lat},${lng})[amenity=bar];
      );
      out center;
    `;
    try {
      const response = await axios.get('https://overpass-api.de/api/interpreter', {
        params: { data: query },
      });
      const resultados = response.data.elements.map((bar: any) => ({
        id: bar.id,
        name: bar.tags?.name || 'Bar sin nombre',
        lat: bar.lat || bar.center?.lat,
        lng: bar.lon || bar.center?.lon,
      })).filter(bar => bar.lat && bar.lng);
      setBares(resultados);
    } catch (error) {
      console.error('Error al buscar bares con Overpass:', error);
    }
  };

  if (!location) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {bares.map((bar) => (
          <Marker
            key={bar.id}
            coordinate={{ latitude: bar.lat, longitude: bar.lng }}
            title={bar.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
