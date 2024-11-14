import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../Firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const Registro = () => {
  const [destino, setDestino] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [imagenURL, setImagenURL] = useState(null);
  const [fechasalida, setFechaSalida] = useState(new Date());
  const [fecharetorno, setFechaRetorno] = useState(new Date());
  const [showFechaSalida, setShowFechaSalida] = useState(false);
  const [showFechaRetorno, setShowFechaRetorno] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const guardarRegistro = async () => {
    if (!destino || !precio || !descripcion || !pais || !ciudad || !imagenURL) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const registroRef = collection(db, "registro");

      await addDoc(registroRef, {
        destino,
        precio,
        descripcion,
        pais,
        ciudad,
        imagenURL,
        fechasalida: fechasalida.toISOString(),
        fecharetorno: fecharetorno.toISOString(),
      });

      Alert.alert("Registro guardado con éxito!");

      // Limpiar campos
      setDestino('');
      setPrecio('');
      setDescripcion('');
      setPais('');
      setCiudad('');
      setImagenURL(null);
      setFechaSalida(new Date());
      setFechaRetorno(new Date());

    } catch (error) {
      console.error("Error al guardar el registro:", error);
      Alert.alert("Hubo un error al guardar el registro.");
    }
  };

  const seleccionarFoto = async (source) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Se necesita permiso para acceder a la galería.");
      return;
    }

    let result;
    if (source === 'camera') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert("Se necesita permiso para acceder a la cámara.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    }

    if (!result.canceled && result.assets.length > 0) {
      setImagenURL(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.fotoContainer}>
        {imagenURL && <Image source={{ uri: imagenURL }} style={styles.fotoPerfil} />}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.selectPhotoButton}>
          <Text style={styles.selectPhotoText}>Seleccionar Foto del Registro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nombre del registro:</Text>
      <TextInput style={styles.input} value={destino} onChangeText={setDestino} placeholder="Destino del registro" />

      <Text style={styles.label}>Precio:</Text>
      <TextInput style={styles.input} value={precio} onChangeText={setPrecio} placeholder="Precio" keyboardType="numeric" />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción del registro" multiline />

      <Text style={styles.label}>País:</Text>
      <TextInput style={styles.input} value={pais} onChangeText={setPais} placeholder="País" />

      <Text style={styles.label}>Ciudad:</Text>
      <TextInput style={styles.input} value={ciudad} onChangeText={setCiudad} placeholder="Ciudad" />

      <Text style={styles.label}>Fecha de Salida:</Text>
      <Button title="Seleccionar Fecha de Salida" onPress={() => setShowFechaSalida(true)} />
      {showFechaSalida && (
        <DateTimePicker
          value={fechasalida}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowFechaSalida(false);
            selectedDate && setFechaSalida(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Fecha de Retorno:</Text>
      <Button title="Seleccionar Fecha de Retorno" onPress={() => setShowFechaRetorno(true)} />
      {showFechaRetorno && (
        <DateTimePicker
          value={fecharetorno}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowFechaRetorno(false);
            selectedDate && setFechaRetorno(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={guardarRegistro}>
        <Text style={styles.buttonText}>Guardar Registro</Text>
      </TouchableOpacity>

      {/* Modal para seleccionar imagen */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Seleccionar foto de referencia</Text>
            <TouchableOpacity onPress={() => seleccionarFoto('camera')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seleccionarFoto('gallery')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  selectPhotoButton: {
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  selectPhotoText: {
    color: '	#008080',
    fontSize: 16,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#20B2AA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#20B2AA',
  },
});

export default Registro;