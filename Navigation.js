import React from "react";
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
//Pantallas que usa la navegacion
import Home from "./src/components/Home";
import Profile from "./src/components/Profile";
import MyBooks from "./src/components/MyBooks";
import BooksDetails from "./src/components/BooksDetails";

//Stack Navigator Section (Modal) para ver los detalles de los libros
const Stack = createStackNavigator();

function StackGroup() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MyTabs" component={MyTabs} 
                options={{
                    headerShown: false
                }} 
            />
            <Stack.Screen name="BooksDetails" component={BooksDetails} 
                options={{
                    presentation: "modal",
                    headerTitleAlign: "center",
                }}
            />
        </Stack.Navigator>
    );
}


//Bottom Tab Navigator Section (Tabs) para navegar entre las pantallas principales
const Tab = createBottomTabNavigator();

function MyTabs() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({ color, focused }) => {
                    let iconName;
                    switch (route.name) {
                        case "Categories":
                            iconName = "home";
                            break;
                        case "My Books":
                            iconName = "book";
                            break;
                        case "Profile":
                            iconName = "user";
                            break;
                    }
                    return <AntDesign name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Categories" component={Home} />
            <Tab.Screen name="My Books" component={MyBooks} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

//Navigation Container
export default function Navigation() {
    return (
        <NavigationContainer>
            <StackGroup />
        </NavigationContainer>
    );
}