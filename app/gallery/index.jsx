// app/gallery/index.jsx
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import AddImageModal from '../../components/AddImageModal'

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

  const handleAddImage = async (newImage) => {
    const imageData = {
      id: Date.now().toString(),
      uri: newImage.uri,
      caption: newImage.caption,
      isAsset: false,
    }

    setImages((prevImages) => [...prevImages, imageData])
    console.log('Image added:', imageData)
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
})
