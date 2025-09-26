// services/appwrite.js
import { Platform } from 'react-native'
import { Account, Client, Databases, Storage } from 'react-native-appwrite'

// THIS IS THE SDK CODE
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: 'com.yourcompany.notesapp',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  notesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
  storageBucketId: 'note-app-bucket', // Add your bucket ID
}

const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)

switch (Platform.OS) {
  case 'ios':
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID)
    break
  case 'android':
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME)
    break
  default:
    break
}

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)