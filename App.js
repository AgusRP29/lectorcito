import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from './src/utils/connection';
import Navigation from './Navigation';
import Auth from './src/components/Auth';
import Header from './src/components/Header';
import { COLORS } from './src/utils/colors';

//Funcion principal
export default function App() {
  //Estado para saber si el usuario esta logueado o no
  const [userAuth, setUserAuth] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserAuth(true);
      } else {
        console.log(user);
        setUserAuth(false);
      }
    });
  }, [userAuth]);

  //Si el usuario esta logueado se muestra la navegacion, sino se muestra el login
  return (
    <>
      <Header />
      {userAuth ? <Navigation /> : <Auth />}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
  },
});
