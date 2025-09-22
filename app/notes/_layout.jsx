// must return a stack

import { Stack } from 'expo-router'

const noteLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
export default noteLayout
