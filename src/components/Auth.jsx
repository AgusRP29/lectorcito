import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { COLORS } from '../utils/colors'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container} >
      {/* Si isLogin es true, muestra el componente LoginForm, si es false, muestra el componente RegisterForm */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.button}
        >

          <Image
            source={isLogin ? require('../../assets/login.png') : require('../../assets/register.png')}
            style={styles.img}
          />

          <Text style={{ marginLeft: 10, fontSize: 23 }}>
            {isLogin ? 'Registrate' : 'Iniciar Sesion'}
          </Text>

        </TouchableOpacity>
      </ScrollView>
    </View >
  );
};

export default Auth

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },

  img: {
    width: 30,
    height: 30,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
})