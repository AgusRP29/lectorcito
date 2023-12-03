import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { validateEmail } from '../utils/validations'
import { app } from '../utils/connection'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { COLORS } from '../utils/colors';

export default function RegisterForm() {

    const [formData, setFormData] = useState(initialsValus())
    const [formError, setFormError] = useState({})

    const register = () => {
        let errors = {};
        if (!formData.email || !formData.password || !formData.repeatPassword) {
            if (!formData.email) errors.email = true;
            if (!formData.password) errors.password = true;
            if (!formData.repeatPassword) errors.repeatPassword = true;
        } else if (!validateEmail(formData.email)) {
            errors.email = true;
        } else if (formData.password.length < 6) {
            errors.password = true;
            errors.repeatPassword = true;
        } else if (formData.password !== formData.repeatPassword) {
            errors.password = true;
            errors.repeatPassword = true;
        } else {
            const auth = getAuth(app);
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setFormError({ email: true, password: true, repeatPassword: true });
                });
        }
        setFormError(errors);
    }

    function initialsValus() {
        return { email: '', password: '', repeatPassword: '' }
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.title}>Ingresa tus datos</Text>
            <TextInput
                style={[styles.input, formError.email && styles.inputError]}
                placeholder='Email'
                onChange={(e) => setFormData({ ...formData, email: e.nativeEvent.text })}
            />
            {formError.email && <Text style={styles.textError}>error</Text>}
            <TextInput
                style={[styles.input, formError.password && styles.inputError]}
                placeholder='Contraseña'
                secureTextEntry={true}
                onChange={(e) => setFormData({ ...formData, password: e.nativeEvent.text })}
            />
            {formError.password && <Text style={styles.textError}>error</Text>}
            <TextInput
                style={[styles.input, formError.repeatPassword && styles.inputError]}
                placeholder='Repetir Contraseña'
                secureTextEntry={true}
                onChange={(e) => setFormData({ ...formData, repeatPassword: e.nativeEvent.text })}
            />
            {formError.repeatPassword && <Text style={styles.textError}>error</Text>}
            <TouchableOpacity style={styles.btnRegister} onPress={register}>
                <Text style={styles.btnText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },

    input: {
        height: 45,
        color: COLORS.black,
        width: 250,
        marginBottom: 40,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontSize: 18,
        borderWidth: 1,
        borderColor: COLORS.white,
    },

    inputError: {
        borderColor: COLORS.red
    },
    textError: {
        color: COLORS.red,
        marginTop: -38,
        marginBottom: 20,
        marginLeft: 15,
    },

    contenedor: {
        marginTop: 50,
        backgroundColor: COLORS.gray,
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 30,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: .25,
        shadowRadius: 1,
        elevation: 2,
    },

    btnRegister: {
        backgroundColor: COLORS.primary,
        padding: 13,
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'flex-end'
    },

    btnText: {
        color: '#fff',
        fontSize: 18
    }
})