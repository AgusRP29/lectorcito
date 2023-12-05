import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { app } from '../utils/connection'
import { db } from '../utils/connection';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { validateEmail } from '../utils/validations'
import { COLORS } from '../utils/colors';

export default function RegisterForm() {

    const [formData, setFormData] = useState(initialsValus())
    const [formError, setFormError] = useState({})

    const register = () => {
        let errors = {};
        if (!formData.email || !formData.password || !formData.repeatPassword || !formData.name || !formData.lastname || !formData.nickname) {
            if (!formData.email) errors.email = true;
            if (!formData.password) errors.password = true;
            if (!formData.repeatPassword) errors.repeatPassword = true;
            if (!formData.name) errors.name = true;
            if (!formData.lastname) errors.lastname = true;
            if (!formData.nickname) errors.nickname = true;
        } else if (formData.name.length < 3) {
            errors.name = true;
        } else if (formData.lastname.length < 3) {
            errors.lastname = true;
        } else if (formData.nickname.length < 3) {
            errors.nickname = true;
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
                    const user = userCredential.user;
                    addDoc(collection(db, "users"), {
                        id: user.uid,
                        email: user.email,
                        name: formData.name,
                        lastname: formData.lastname,
                        nickname: formData.nickname,
                        books: []
                    })
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });

                })
                .catch((error) => {
                    setFormError({ email: true, password: true, repeatPassword: true });
                });
        }
        setFormError(errors);
    }

    function initialsValus() {
        return { email: '', password: '', repeatPassword: '', name: '', lastname: "", nickname: '' }
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.title}>Ingresa tus datos</Text>
            {/* nombre */}
            <TextInput
                style={[styles.input, formError.name && styles.inputError]}
                placeholder='Nombre'
                onChange={(e) => setFormData({ ...formData, name: e.nativeEvent.text })}
            />
            {/* lastname */}
            <TextInput
                style={[styles.input, formError.lastname && styles.inputError]}
                placeholder='Apellido'
                onChange={(e) => setFormData({ ...formData, lastname: e.nativeEvent.text })}
            />
            {/* nickname */}
            <TextInput
                style={[styles.input, formError.nickname && styles.inputError]}
                placeholder='Nickname'
                onChange={(e) => setFormData({ ...formData, nickname: e.nativeEvent.text })}
            />
            {/* email */}
            <TextInput
                style={[styles.input, formError.email && styles.inputError]}
                placeholder='Email'
                onChange={(e) => setFormData({ ...formData, email: e.nativeEvent.text })}
            />
            {/* password */}
            <TextInput
                style={[styles.input, formError.password && styles.inputError]}
                placeholder='Contraseña'
                secureTextEntry={true}
                onChange={(e) => setFormData({ ...formData, password: e.nativeEvent.text })}
            />
            {/* repeat password */}
            <TextInput
                style={[styles.input, formError.repeatPassword && styles.inputError]}
                placeholder='Repetir Contraseña'
                secureTextEntry={true}
                onChange={(e) => setFormData({ ...formData, repeatPassword: e.nativeEvent.text })}
            />

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
        marginBottom: 20,
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