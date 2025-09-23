import { StyleSheet, Text, View } from 'react-native'

const NoteItem = ({ note }) => {
  return (
    <View style={styles.noteItem}>
      <Text style={styles.noteText}>{note.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
   
  noteItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  noteText: {
    fontSize: 18,
    fontWeight: '600',
  },
})
export default NoteItem
