import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { validateEmail } from '../utils/validations'
import { app } from '../utils/connection'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { COLORS } from '../utils/colors';

export default function LoginForm() {
    const [formData, setFormData] = useState(initialsValus())
    const [formError, setFormError] = useState({})

    const login = () => {
        let errors = {};
        if (!formData.email || !formData.password) {
            if (!formData.email) errors.email = true;
            if (!formData.password) errors.password = true;
        } else if (!validateEmail(formData.email)) {
            errors.email = true;
        }
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setFormError({ email: true, password: true });
            });
    }

    function initialsValus() {
        return { email: '', password: '' }
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.title}>Iniciar Sesion</Text>
            <TextInput
                placeholder='Correo'
                style={[styles.input, formError.email && styles.inputError]}
                onChange={(e) => setFormData({ ...formData, email: e.nativeEvent.text })}
            />
            {formError.email && <Text style={styles.textError}>error</Text>}
            <TextInput
                placeholder='Contraseña'
                style={[styles.input, formError.password && styles.inputError]}
                secureTextEntry={true}
                onChange={(e) => setFormData({ ...formData, password: e.nativeEvent.text })}
            />
            {formError.password && <Text style={styles.textError}>error</Text>}
            <TouchableOpacity style={styles.btnRegister} onPress={login}>
                <Text style={styles.btnText}>Iniciar Sesion</Text>
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
        marginBottom: 20,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontSize: 18,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },

    inputError: {
        borderColor: COLORS.red,
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
        color: COLORS.white,
        fontSize: 18
    }
})