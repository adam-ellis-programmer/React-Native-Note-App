// services/galleryService.js
import { ID } from 'react-native-appwrite'
import { appwriteConfig, storage } from './appwrite'

const galleryService = {
  //==============================================
  // KEEP FOR TESTING CONNECTION!
  //==============================================
  async testConnection() {
    try {
      console.log('Testing Appwrite connection...')

      // Test if we can list files (should work even if empty)
      const files = await storage.listFiles(appwriteConfig.storageBucketId)
      console.log('Storage connection test:', files)
      return { success: true, files }
    } catch (error) {
      console.error('Storage connection test failed:', error)
      return { error: error.message }
    }
  },

  // Upload image to Appwrite Storage
  async uploadImage(imageUri, fileName = null) {
    try {
      console.log('=== Gallery Service Debug v0.15.0 ===')
      console.log('Image URI:', imageUri)

      // Generate unique filename if not provided
      const finalFileName = fileName || `image_${Date.now()}.jpg`
      console.log('Final filename:', finalFileName)

      // First, let's try to get file info to understand the file better
      let fileSize
      try {
        const fileInfo = await fetch(imageUri)
        const blob = await fileInfo.blob()
        fileSize = blob.size
        console.log('File size detected:', fileSize)
      } catch (e) {
        console.log('Could not determine file size:', e.message)
        fileSize = undefined
      }

      // For React Native Appwrite, try different file object formats
      console.log('Attempting Method 1: Standard file object')
      
      // Method 1: Try the standard approach first
      let file = {
        name: finalFileName,
        type: 'image/jpeg',
        uri: imageUri,
      }

      if (fileSize) {
        file.size = fileSize
      }

      console.log('File object Method 1:', file)
      console.log('Attempting upload to bucket:', appwriteConfig.storageBucketId)

      let response = await storage.createFile(
        appwriteConfig.storageBucketId,
        ID.unique(),
        file
      )

      console.log('Method 1 Response:', response)

      // If Method 1 fails, try Method 2
      if (!response) {
        console.log('Method 1 failed, trying Method 2: File as FormData-like object')
        
        file = {
          name: finalFileName,
          type: 'image/jpeg',
          uri: imageUri,
          size: fileSize || 0,
        }

        response = await storage.createFile(
          appwriteConfig.storageBucketId,
          ID.unique(),
          file
        )

        console.log('Method 2 Response:', response)
      }

      // If Method 2 fails, try Method 3 with fetch blob
      if (!response && fileSize) {
        console.log('Method 2 failed, trying Method 3: Blob conversion')
        
        try {
          const fileResponse = await fetch(imageUri)
          const blob = await fileResponse.blob()
          
          // Create a File-like object for Appwrite
          const fileForUpload = new File([blob], finalFileName, {
            type: 'image/jpeg',
          })

          response = await storage.createFile(
            appwriteConfig.storageBucketId,
            ID.unique(),
            fileForUpload
          )

          console.log('Method 3 Response:', response)
        } catch (blobError) {
          console.log('Method 3 (blob) failed:', blobError.message)
        }
      }

      console.log('Final response:', response)
      console.log('Response type:', typeof response)
      
      if (response) {
        console.log('Response keys:', Object.keys(response))
      }

      // Check various possible response formats
      if (response) {
        const fileId = response.$id || response.id || response.fileId
        const fileName = response.name || response.fileName || finalFileName
        const size = response.sizeOriginal || response.size || fileSize || 0

        if (fileId) {
          console.log('Success! File ID:', fileId)
          return {
            success: true,
            fileId: fileId,
            fileName: fileName,
            size: size,
            fullResponse: response, // Include full response for debugging
          }
        } else {
          console.log('Response exists but missing expected properties')
          console.log('Full response object:', JSON.stringify(response, null, 2))
        }
      }

      throw new Error(`Upload failed - all methods returned undefined response`)
    } catch (error) {
      console.error('=== Upload Error Details ===')
      console.log('ERROR OBJ--> ', error)
      console.error('Error message:', error.message)
      console.error('Error type:', error.constructor.name)
      console.error('Error stack:', error.stack)

      if (error.code) {
        console.error('Appwrite error code:', error.code)
      }
      if (error.type) {
        console.error('Appwrite error type:', error.type)
      }

      return {
        error: error.message || 'Failed to upload image',
      }
    }
  },

  // Test basic storage operations
  async testStorageConnection() {
    try {
      console.log('Testing storage connection...')
      const result = await storage.listFiles(appwriteConfig.storageBucketId)
      console.log('List files result:', result)

      return {
        success: true,
        message: 'Storage connection working',
        fileCount: result.total || 0,
      }
    } catch (error) {
      console.error('Storage test failed:', error)
      return {
        error: `Storage test failed: ${error.message}`,
      }
    }
  },

  // Get image URL from Appwrite Storage
  getImageUrl(fileId) {
    try {
      if (!fileId) {
        console.error('No fileId provided to getImageUrl')
        return null
      }

      const url = storage.getFileView(appwriteConfig.storageBucketId, fileId)
      console.log('Generated image URL:', url)
      return url
    } catch (error) {
      console.error('Error getting image URL:', error)
      return null
    }
  },

  // Other methods...
  getImageDownloadUrl(fileId) {
    try {
      return storage.getFileDownload(appwriteConfig.storageBucketId, fileId)
    } catch (error) {
      console.error('Error getting download URL:', error)
      return null
    }
  },

  async deleteImage(fileId) {
    try {
      await storage.deleteFile(appwriteConfig.storageBucketId, fileId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return {
        error: error.message || 'Failed to delete image',
      }
    }
  },

  getImagePreview(
    fileId,
    width = 400,
    height = 400,
    gravity = 'center',
    quality = 80
  ) {
    try {
      return storage.getFilePreview(
        appwriteConfig.storageBucketId,
        fileId,
        width,
        height,
        gravity,
        quality
      )
    } catch (error) {
      console.error('Error getting image preview:', error)
      return null
    }
  },
}

export default galleryService