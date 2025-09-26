// components/AddImageModal.jsx
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import galleryService from '../services/galleryService'

const AddImageModal = ({ modalVisible, setModalVisible, onAddImage }) => {
  const [imageUri, setImageUri] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const data = await galleryService.testConnection()
      console.log('test connection data------------>', data)
    }
    getData()
    return () => {}
  }, [])

  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera roll is required!'
      )
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    // Request camera permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Permission to access camera is required!'
      )
      return
    }

    try {
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
      }
    } catch (error) {
      console.log('Camera error:', error)
      Alert.alert(
        'Camera Unavailable',
        'Camera is not available on simulator. Please use a real device or select from gallery.'
      )
    }
  }

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first')
      return
    }

    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption')
      return
    }

    setLoading(true)

    try {
      console.log('Starting image upload to Appwrite...')

      // Upload image to Appwrite Storage first
      const uploadResult = await galleryService.uploadImage(imageUri)

      console.log('Upload result:', uploadResult)

      // Check if uploadResult exists and handle different response types
      if (!uploadResult) {
        Alert.alert('Upload Error', 'No response from upload service')
        return
      }

      if (uploadResult.error) {
        Alert.alert('Upload Error', uploadResult.error)
        return
      }

      if (!uploadResult.success) {
        Alert.alert('Upload Error', 'Upload failed - no success response')
        return
      }

      // Call the parent function with the uploaded file info
      await onAddImage({
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        caption: caption.trim(),
        size: uploadResult.size,
      })

      // Reset form and close modal
      setImageUri(null)
      setCaption('')
      setModalVisible(false)

      Alert.alert('Success', 'Image uploaded successfully!')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      Alert.alert('Error', 'Failed to upload image: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setImageUri(null)
    setCaption('')
    setModalVisible(false)
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Image</Text>

          {/* Image Preview */}
          {imageUri ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.changeImageBtn}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          {/* Image Selection Buttons */}
          {!imageUri && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.imageBtnText}>📱 Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
                <Text style={styles.imageBtnText}>📸 Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Caption Input */}
          <TextInput
            style={styles.input}
            placeholder='Add a caption...'
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
          />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Uploading...' : 'Add Image'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  changeImageBtn: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
  changeImageText: {
    color: '#007bff',
    fontSize: 14,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  imageBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  imageBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
})

export default AddImageModal
