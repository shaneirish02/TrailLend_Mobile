import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ReportDamage() {
  const navigation = useNavigation();
  const [damageImage, setDamageImage] = useState(null);
  const [damageLocation, setDamageLocation] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);

  const pickFromCamera = async () => {
    setShowPickerModal(false);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setDamageImage(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    setShowPickerModal(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setDamageImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!damageImage || !damageLocation || !damageDescription) {
      Alert.alert('Incomplete', 'Please fill all fields and choose an image.');
      return;
    }
    Alert.alert('Success', 'Damage report submitted (mock)');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={16} color="#f8c200" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Damage</Text>
      </View>

      {/* Upload Image Section */}
      <Text style={styles.label}>Upload Damage Image</Text>
      <View style={styles.fileRow}>
        <TouchableOpacity style={styles.chooseFileButton} onPress={() => setShowPickerModal(true)}>
          <Text style={styles.chooseFileText}>Choose File</Text>
        </TouchableOpacity>
        <Text style={styles.fileNameText}>
          {damageImage ? damageImage.fileName || damageImage.uri.split('/').pop() : 'No file chosen'}
        </Text>
      </View>

      {/* Where is the damage? */}
      <Text style={styles.label}>Where is the damage?</Text>
      <TextInput
        placeholder="e.g. Front Camera..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={damageLocation}
        onChangeText={setDamageLocation}
      />

      {/* Describe the damage */}
      <Text style={styles.label}>Describe the damage</Text>
      <TextInput
        placeholder="Enter details here..."
        placeholderTextColor="#aaa"
        style={[styles.input, { height: 100 }]}
        multiline
        value={damageDescription}
        onChangeText={setDamageDescription}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal
        visible={showPickerModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Source</Text>

            <View style={styles.optionRow}>
              <Pressable style={styles.optionBox} onPress={pickFromCamera}>
                <Ionicons name="camera-outline" size={30} color="#1a1a6b" />
                <Text style={styles.optionLabel}>Camera</Text>
              </Pressable>

              <Pressable style={styles.optionBox} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={30} color="#1a1a6b" />
                <Text style={styles.optionLabel}>Gallery</Text>
              </Pressable>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPickerModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a6b',
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    borderColor: '#f8c200',
    borderWidth: 2,
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 30,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 25,
    fontWeight: 'bold',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chooseFileButton: {
    backgroundColor: '#ccc',
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  chooseFileText: {
    color: '#000',
    fontWeight: 'bold',
  },
  fileNameText: {
    color: '#ccc',
    flexShrink: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    color: '#000',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#f8c200',
    paddingVertical: 16,
    marginTop: 20,
    borderRadius: 6,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a6b',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  optionBox: {
    alignItems: 'center',
    width: '40%',
  },
  optionLabel: {
    marginTop: 8,
    color: '#1a1a6b',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f8c200',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
