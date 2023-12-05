import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { COLORS } from '../utils/colors';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/connection';

export default function Profile() {
  const user = getAuth().currentUser;
  const [data, setData] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where("id", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setData(users);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.cont}>
      <Image source={require('../../assets/default_user.png')} style={styles.image_user} />
      <Text style={styles.name}>{data && data[0].name} {data && data[0].lastname} </Text>
      <Text style={styles.text}>{data && data[0].nickname}</Text>
      <Text style={styles.text}>{data && data[0].email}</Text>
      <Logout />
    </View>
  )

  //funcion que regresa la vista de usuario logueado
  function Logout(params) {

    function logout() {
      const auth = getAuth();
      console.log(auth)
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
  cont:{
    flex:1,
    alignItems:'center'
  },
  image_user: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginTop: 50,
  },
  button_logout: {
    marginTop: 20,
    padding: 10,
    width: "30%",
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 5,
    marginTop: 90,
  },
  text: {
    color: COLORS.black,
    fontSize: 19,
    marginTop: 10,
  },
  name: {
    color: COLORS.black,
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
})