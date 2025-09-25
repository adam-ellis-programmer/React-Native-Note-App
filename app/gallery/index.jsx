// app/gallery/index.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function Gallery() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Image Gallery</Text>
      
      <View style={styles.imageGrid}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/react-logo.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>React Logo</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/post-it.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>Post-it Note</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>App Icon</Text>
        </View>
      </View>
    </ScrollView>
  );
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
  },
  imageCaption: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});