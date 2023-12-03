import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import { COLORS } from '../utils/colors';

export default function Profile() {
  return (
    <View>
      <Text>Profile</Text>
      <Logout />
    </View>
  )

  //funcion que regresa la vista de usuario logueado
  function Logout(params) {

    function logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }

    return (
      <>
        <TouchableOpacity onPress={logout} style={styles.button_logout}>
          <Text style={{ color: "#fff" }}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button_logout: {
    marginTop: 20,
    padding: 10,
    width: "30%",
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 5,
  },
})