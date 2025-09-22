import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff8c00',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
})

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        contentStyle: styles.content,
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Home Screen Test',
        }}
      />
      <Stack.Screen
        name='notes'
        options={{
          headerTitle: 'Notes Screen',
        }}
      />
    </Stack>
  )
}
