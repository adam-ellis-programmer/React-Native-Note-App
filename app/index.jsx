import PostImage from '@/assets/images/post-it.png'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Image source={PostImage} style={styles.image} />
      <Text style={styles.title}>Welcome to notes app.</Text>
      <Text style={styles.subTitle}>
        capture your thoughts anytime anywhere{' '}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/notes`)}
      >
        <Text style={styles.buttonText}>Get Started!</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainter: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
})
