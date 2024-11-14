import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { db } from '../Firebase/FirebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ListarRegistro = () => {
  const [registro, setRegistro] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [registroEdit, setRegistroEdit] = useState(null);

  useEffect(() => {
    obtenerRegistro();
  }, []);

  const obtenerRegistro = async () => {
    try {
      const registroRef = collection(db, "registro");
      const snapshot = await getDocs(registroRef);
      const registroData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRegistro(resgistroData);
    } catch (error) {
      console.error("Error al obtener el Registro:", error);
      Alert.alert("Error", "Hubo un problema al cargar el registro.");
    }
  };

  const eliminarRegistro = async (id) => {
    try {
      await deleteDoc(doc(db, "registro", id));
      Alert.alert("Registro eliminado con éxito.");
      obtenerRegistro();
    } catch (error) {
      console.error("Error al eliminar registro:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el registro.");
    }
  };

  const abrirEditarRegistro = (registro) => {
    setRegistroEdit(registro);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!registroEdit.destino || !registroEdit.precio || !resgistroDataEdit.descripcion ) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const registroRef = doc(db, "registro", registroEdit.id);
      await updateDoc(registroRef, {
        destino: registroEdit.destino,
        precio: registroEdit.precio,
        descripcion: registroEdit.descripcion,
        imagenURL: resgistroEdit.imagenURL,
      });
      Alert.alert("Registro actualizado con éxito.");
      setModalVisible(false);
      obtenerRegistro();
    } catch (error) {
      console.error("Error al actualizar registro:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el registro.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagenURL ? (
        <Image source={{ uri: item.imagenURL }} style={styles.imagen} />
      ) : (
        <Text style={styles.noImagen}>Sin Imagen</Text>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.destino}>{item.destino}</Text>
        <Text style={styles.precio}>{item.precio}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => abrirEditarRegistro(item)} style={styles.editButton}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarRegistro(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={registro}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Registro</Text>
            <TextInput
              style={styles.input}
              value={registroEdit?.destino}
              onChangeText={(text) => setRegistroEdit({ ...registroEdit, destino: text })}
              placeholder="Destino del registro"
            />
            <TextInput
              style={styles.input}
              value={registroEdit?.precio}
              onChangeText={(text) => setRegistroEdit({ ...registroEdit, precio: text })}
              placeholder="Precio"
            />
            <TextInput
              style={styles.input}
              value={registroEdit?.descripcion}
              onChangeText={(text) => setRegistroEdit({ ...registroEdit, descripcion: text })}
              placeholder="Descripción"
              multiline
            />
            <Button title="Guardar Cambios" onPress={guardarEdicion} />
            <Button title="Cancelar" color="green" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e0f7fa', // Fondo azul claro para un ambiente fresco
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagen: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#0288d1', // Borde azul para resaltar imágenes
  },
  noImagen: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#b0bec5', // Fondo gris suave para imágenes faltantes
    color: '#fff',
    textAlign: 'center',
    lineHeight: 90,
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b', // Verde azulado para destacar el nombre
  },
  categoria: {
    fontSize: 16,
    color: '#004d40', // Verde oscuro para categorías
    marginVertical: 5,
    fontStyle: 'italic',
  },
  descripcion: {
    fontSize: 14,
    color: '#37474f', // Gris oscuro para descripciones
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#29b6f6', // Azul claro para botón de edición
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef5350', // Rojo suave para botón de eliminación
    padding: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro translúcido para modal
  },
  modalContent: {
    width: 320,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00695c', // Verde oscuro para título de modal
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#b0bec5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#eceff1', // Fondo gris claro para el input
  },
});

export default ListarRegistro;