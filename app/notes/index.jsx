import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AddNoteModal from '../../components/AddNoteModal'
import NoteList from '../../components/NoteList'
import noteService from '../../services/noteService'

const NoteScreen = () => {
  const [notes, setNotes] = useState([])
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState(null)

  useEffect(() => {
    fetchNotes()
    return () => {}
  }, [])

  const fetchNotes = async () => {
    try {
      setloading(true)
      const response = await noteService.getNotes()

      if (response.error) {
        seterror(response.error)
        Alert.alert('Error', response.error) // Fixed Alert usage
      } else {
        setNotes(response.data || response) // Handle different response formats
        seterror(null)
      }
    } catch (error) {
      console.error('Error in fetchNotes:', error)
      seterror(error.message)
      Alert.alert('Error', 'Failed to fetch notes')
    } finally {
      setloading(false) // Always set loading to false
    }
  }

  const [modalVisible, setModalVisible] = useState(false)
  const [newNote, setNewNote] = useState('')

  console.log('Notes array:', notes)

  // ADD NEW NOTE:
  async function addNote() {
    if (newNote.trim() === '') return

    // setNotes((prevNotes) => [...prevNotes, { id: Date.now(), text: newNote }])

    const response = await noteService.addNote(newNote)

    if (response.error) {
      Alert.alert('Error', response.error)
    } else {
      setNotes([...notes, response.data])
    }

    setNewNote('')
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {/* Note list  */}
      <NoteList notes={notes} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+New Note</Text>
      </TouchableOpacity>

      {/* Modal */}
      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
})

export default NoteScreen
