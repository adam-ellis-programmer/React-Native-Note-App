// app/gallery/index.jsx
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import AddImageModal from '../../components/AddImageModal'
import galleryService from '../../services/galleryService'

export default function Gallery() {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [images, setImages] = useState([
    {
      id: '1',
      uri: require('../../assets/images/react-logo.png'),
      caption: 'React Logo',
      isAsset: true,
    },
    {
      id: '2',
      uri: require('../../assets/images/post-it.png'),
      caption: 'Post-it Note',
      isAsset: true,
    },
    {
      id: '3',
      uri: require('../../assets/images/icon.png'),
      caption: 'App Icon',
      isAsset: true,
    },
  ])

  // Load uploaded images from Appwrite on component mount
  useEffect(() => {
    loadUploadedImages()
  }, [])

  const loadUploadedImages = async () => {
    try {
      const result = await galleryService.testConnection()
      console.log('Connection test result:', result)

      if (result.success && result.files && result.files.files) {
        const uploadedImages = result.files.files.map((file) => ({
          id: file.$id,
          fileId: file.$id,
          uri: galleryService.getImageUrl(file.$id),
          caption: file.name || 'Uploaded Image',
          isAsset: false,
        }))

        // Add uploaded images to the existing static images
        setImages((prevImages) => [
          ...prevImages.filter((img) => img.isAsset), // Keep static assets
          ...uploadedImages, // Add uploaded images
        ])
      }
    } catch (error) {
      console.error('Error loading uploaded images:', error)
    }
  }

  const handleAddImage = async (newImageData) => {
    console.log('Received new image data:', newImageData)

    // Create image object for display
    const imageData = {
      id: newImageData.fileId,
      fileId: newImageData.fileId,
      uri: galleryService.getImageUrl(newImageData.fileId),
      caption: newImageData.caption,
      isAsset: false,
    }

    // Add to images state
    setImages((prevImages) => [...prevImages, imageData])
    console.log('Image added to gallery:', imageData)
  }

  const handleDeleteImage = async (imageId, isAsset) => {
    if (isAsset) {
      // Don't delete asset images
      return
    }

    try {
      const result = await galleryService.deleteImage(imageId)
      if (result.success) {
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        )
        console.log('Image deleted successfully')
      } else {
        console.error('Failed to delete image:', result.error)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Image Gallery</Text>

      <TouchableOpacity
        style={styles.addImgBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addImgText}>+ Add New Image</Text>
      </TouchableOpacity>

      <View style={styles.imageGrid}>
        {images.map((item) => (
          <View key={item.id} style={styles.imageContainer}>
            <Image
              source={item.isAsset ? item.uri : { uri: item.uri }}
              style={styles.image}
              resizeMode='cover'
            />
            <Text style={styles.imageCaption}>{item.caption}</Text>

            {/* Show delete button only for uploaded images */}
            {!item.isAsset && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteImage(item.id, item.isAsset)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <AddImageModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onAddImage={handleAddImage}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageGrid: {
    gap: 20,
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageCaption: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  addImgBtn: {
    marginBottom: 20,
  },
  addImgText: {
    backgroundColor: '#0F88F2',
    color: '#fff',
    textAlign: 'center',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
})
