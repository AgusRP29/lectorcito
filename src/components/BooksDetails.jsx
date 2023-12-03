import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState, useLayoutEffect } from 'react'

export default function BooksDetails() {
    const navigation = useNavigation(); //hook para navegar entre pantallas
    //hook para obtener los parametros de la pantalla anterior
    const {
        params: { book },
    } = useRoute();
    const URL_IMAGE = "https://covers.openlibrary.org/b/id/";  //URL de las imagenes de los libros
    const URL_BOOK = "https://openlibrary.org";   //URL de la API
    const [bookDetails, setBookDetails] = useState(null) //estado para los detalles del libro

    //funcion para colocar el titulo del libro en el encabezado
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `Read: ${book.title}`,
        });
    }, []);

    //funcion para obtener los detalles del libro
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(URL_BOOK + book.key + ".json");
                const json = await res.json();
                const details = {
                    description: json.description.value,
                    subjects: json.subjects,
                    created: json.created,
                };
                setBookDetails(details);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: URL_IMAGE + book.cover + ".jpg" }} style={styles.image} />
            <Text style={styles.description}>{bookDetails && bookDetails.description}</Text>
            <Text style={styles.created}>{bookDetails && bookDetails.created.value}</Text>
            <Text style={styles.subjects}>{bookDetails && bookDetails.subjects}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    description: {
      fontSize: 18,
      paddingHorizontal: 8,
      marginBottom: 12,
      color: '#333',
      lineHeight: 24,
    },
    created: {
      fontSize: 14,
      color: '#888',
      marginBottom: 8,
    },
    subjects: {
      fontSize: 14,
      color: '#555',
      fontStyle: 'italic',
    },
  });
  