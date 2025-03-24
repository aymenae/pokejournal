import { Image } from 'react-native';
import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

const pokedex = 'https://img.icons8.com/ios/50/pokedex.png';
const pokedexFilled = 'https://img.icons8.com/?size=100&id=15566&format=png&color=000000';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF7F50',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#FF7F50',
        tabBarStyle: {
          backgroundColor: '#25292e',
          shadowOpacity: 0,
          
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="pokedex"
        options={{
          title: 'Pokédex',
          tabBarIcon: ({ color, focused }) => ( 
            <Image source={{ uri: focused ?  pokedexFilled : pokedex }} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
    </Tabs>
  );
}
