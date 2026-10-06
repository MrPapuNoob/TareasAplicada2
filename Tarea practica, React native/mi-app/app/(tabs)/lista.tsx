import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';

type Cancion = {
  id: string;
  titulo: string;
  artista: string;
  duracion: string;
};

const CANCIONES: Cancion[] = [
  { id: '1', titulo: 'Value', artista: 'Ado', duracion: '3:05' },
  { id: '2', titulo: 'Unlasting', artista: 'LiSA', duracion: '4:55' },
  { id: '3', titulo: 'Odoru Ponpokorin', artista: 'Ado', duracion: '3:10' },
  { id: '4', titulo: 'One of the girls', artista: 'The Weeknd', duracion: '4:04' },
  { id: '5', titulo: 'If The Sun Burns Out Tonight', artista: 'Grabbitz, Oli Sykes, Courtney LaPlante, Valorant', duracion: '3:46' },
  { id: '6', titulo: 'What is Love?', artista: 'Twice', duracion: '3:28' },
];

export default function ListaScreen() {
  const irAHome = () => {
    router.push('/');
  };

  const renderItem = ({ item }: { item: Cancion }) => (
    <View style={stylesList.item}>
      <View style={stylesList.itemHeader}>
        <Text style={stylesList.titulo}>{item.titulo}</Text>
        <Text style={stylesList.duracion}>{item.duracion}</Text>
      </View>
      <Text style={stylesList.artista}>{item.artista}</Text>
    </View>
  );

  return (
    <View style={stylesList.container}>
      <Text style={stylesList.tituloPantalla}>Mis Canciones Favoritas</Text>
      <Text style={stylesList.subtitulo}>
        Lista hardcodeada - {CANCIONES.length} elementos
      </Text>

      <FlatList
        data={CANCIONES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={stylesList.lista}
        ItemSeparatorComponent={() => <View style={stylesList.separador} />}
      />

      <Pressable style={stylesList.boton} onPress={irAHome}>
        <Text style={stylesList.botonTexto}>Ir a Home</Text>
      </Pressable>
    </View>
  );
}

const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tituloPantalla: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  lista: {
    paddingBottom: 12,
  },
  item: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
    color: '#000',
  },
  artista: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  duracion: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  separador: {
    height: 10,
  },
  boton: {
    backgroundColor: '#2f7be6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});