import { ID } from 'react-native-appwrite'
import databaseService from './databaseService'

// Appwrite database and collection id
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const noteService = {
  // Get Notes
  async getNotes() {
    const response = await databaseService.listDocuments(dbId, colId)
    if (response.error) {
      return { error: response.error }
    }

    return { data: response }
  },
  // Add New Note
  async addNote(text) {
    if (!text) {
      return { error: 'Note text cannot be empty' }
    }

    const data = {
      text: text,
      createdAt: new Date().toISOString(),
    }

    const response = await databaseService.createDocument(
      dbId,
      colId,
      data,
      ID.unique()
    )

    if (response?.error) {
      return { error: response.error }
    }

    return { data: response }
  },
  // Update Note
  async updateNote(id, text) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    })

    if (response?.error) {
      return { error: response.error }
    }

    return { data: response }
  },
  // Delete Note
  async deleteNote(id) {
    const response = await databaseService.deleteDocument(dbId, colId, id)
    if (response?.error) {
      return { error: response.error }
    }

    return { success: true }
  },
}

export default noteService
