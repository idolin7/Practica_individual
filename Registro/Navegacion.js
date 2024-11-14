import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Registro from './Registro';
import ListarRegistro from './ListarResgistro';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Grafico from './Grafico';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Registro" 
        component={Registro} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-register" size={24} color="black" />
          ),
        }}
      />

        <Tab.Screen 
        name="ListarRegistro" 
        component={ListarRegistro} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-circle-sharp" size={24} color="black" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Grafico" 
        component={Grafico} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="clipboard-list" size={24} color="black" />
          ),
        }}
      />


    </Tab.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
