import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Themed';

export default function HomeScreen() {
  const [texto, setTexto] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState('');

  const handleMostrarTexto = () => {
    if (!texto.trim()) {
      Alert.alert('Texto vacío', 'Por favor escribe algo antes de continuar.');
      return;
    }
    Alert.alert('Texto ingresado', texto);
    setMostrarResultado(texto);
  };

  const irALista = () => {
    router.push('/lista');
  };

  return (
    <View style={stylesHome.container}>
      <Text style={stylesHome.titulo}>Pantalla Home</Text>

      <View style={stylesHome.card}>
        <Text style={stylesHome.etiqueta}>Nombre</Text>
        <Text style={stylesHome.valor}>David Brito</Text>

        <Text style={stylesHome.etiqueta}>Carnet</Text>
        <Text style={stylesHome.valor}>4357</Text>
      </View>

      <Text style={stylesHome.subtitulo}>Formulario</Text>

      <TextInput
        style={stylesHome.input}
        placeholder="Escribe algo aquí..."
        placeholderTextColor="#999"
        value={texto}
        onChangeText={setTexto}
      />

      <Pressable style={stylesHome.botonPrimario} onPress={handleMostrarTexto}>
        <Text style={stylesHome.botonTexto}>Mostrar texto</Text>
      </Pressable>

      {mostrarResultado !== '' && (
        <View style={stylesHome.resultadoBox}>
          <Text style={stylesHome.resultadoLabel}>Resultado:</Text>
          <Text style={stylesHome.resultadoTexto}>{mostrarResultado}</Text>
        </View>
      )}

      <Pressable style={stylesHome.botonSecundario} onPress={irALista}>
        <Text style={stylesHome.botonTexto}>Ir a Lista</Text>
      </Pressable>
    </View>
  );
}

const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'stretch',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 24,
  },
  etiqueta: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  valor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#061c50',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  botonPrimario: {
    backgroundColor: '#2f7be6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  botonSecundario: {
    backgroundColor: '#444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultadoBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e8f4ff',
  },
  resultadoLabel: {
    fontSize: 12,
    color: '#2f7be6',
    fontWeight: '600',
  },
  resultadoTexto: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
  },
});