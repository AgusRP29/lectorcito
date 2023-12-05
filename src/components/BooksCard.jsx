import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { collection, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from '../utils/connection';
import { getAuth } from "firebase/auth";
import { COLORS } from '../utils/colors';

export default function BooksCard({ book, index, type }) {
    const { navigate } = useNavigation(); //hook para navegar entre pantallas
    const URL_IMAGE = "https://covers.openlibrary.org/b/id/";   //URL de las imagenes de los libros
    const user = getAuth().currentUser; //usuario logueado

    const addFavorites = async (keyBook) => {
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("id", "==", user.uid));
            const querySnapshot = await getDocs(q);

            let docRef = null;

            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                docRef = doc;  // Utiliza la referencia directa en lugar del ID
                console.log(docRef);
            });

            // Agregar un libro al arreglo de favoritos
            if (docRef.ref) {
                const userDocRef = doc(db, "users", docRef.ref.id);
                const payload = {
                    books: [...docRef.data().books, keyBook]
                };
                await updateDoc(userDocRef, payload);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFavorites = async (keyBook) => {
        console.log(keyBook);
    }

    return (
        //contenedor de cada libro, para hacer el efecto de 2 columnas
        <View style={index % 2 === 0 ? styles.cardContainerEven : styles.cardContainerOdd}>
            {/* contenedor de cada libro */}
            <View style={styles.card}>
                {/* imagen del libro */}
                <TouchableOpacity onPress={() => { navigate("BooksDetails", { book }); }}>
                    <Image source={{ uri: URL_IMAGE + book.cover + ".jpg" }} style={styles.image} />
                </TouchableOpacity>
                {/* titulo y autor del libro */}
                <Text style={styles.bookTitle}>{book.title}</Text>
                {type && <Text>{book.authors[0].name}</Text>}
                {
                    type ?
                        <TouchableOpacity onPress={() => addFavorites(book.key)}>
                            <Text style={styles.buttonFav}>Add to Favorities</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => deleteFavorites(book.key)} >
                            <Text style={[styles.buttonFav,styles.buttonDel]} >Delete</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainerEven: {
        width: '48%',
        marginBottom: 20,
    },
    cardContainerOdd: {
        width: '48%',
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        textAlign: 'center',
        height: "auto",
    },
    bookTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 135,
        height: 210,
        resizeMode: 'cover',
        borderRadius: 4,
        marginBottom: 8,
    },
    buttonFav: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginRight: 20,
        color: COLORS.white,
        marginLeft: 21,
        marginTop: 15,
    },
    buttonDel: {
        backgroundColor: COLORS.red,
        paddingHorizontal: 25,
    },
})