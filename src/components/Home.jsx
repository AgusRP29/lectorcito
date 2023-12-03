import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/colors'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';

export default function Home() {
    const { navigate } = useNavigation(); //hook para navegar entre pantallas
    const URL_IMAGE = "https://covers.openlibrary.org/b/id/";   //URL de las imagenes de los libros
    const URL = "https://openlibrary.org/subjects/"; //URL de la API
    const [data, setData] = useState(null); //arreglo de libros
    const [search, setSearch] = useState("action"); //estado para la busqueda
    const [subject, setSubject] = useState("action");   //estado para la categoria actual
    const [offset, setOffset] = useState(0);    //estado para la paginacion
    //estado para habilitar o deshabilitar los botones de paginacion
    const [enablePagination, setEnablePagination] = useState(
        { left: true, right: false }
    );

    //funcion para obtener los libros de la categoria actual
    useEffect(() => {
        const fetchData = async () => {
            try {
                //obtiene los libros de la categoria, el offset es para la paginacion
                const res = await fetch(URL + subject + ".json?offset=" + (offset * 20) + "&limit=20");
                const json = await res.json();
                //mapea los libros para obtener los datos necesarios
                const books = json.works.map((item) => {
                    return {
                        key: item.key,
                        title: item.title,
                        cover: item.cover_id,
                        authors: item.authors,
                    };
                });
                //actualiza el estado de los libros
                setData(books);
                //habilita o deshabilita los botones de paginacion
                if (offset <= 0) {
                    setEnablePagination({ left: true, right: false });
                }
                else {
                    setEnablePagination({ left: false, right: false });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [offset, subject]);

    //funcion para comprobar si la busqueda es valida
    const funcSearch = async () => {
        let subjectSearch = search.toLowerCase();
        try {
            const res = await fetch(URL + subjectSearch + ".json?offset=0&limit=20");
            const json = await res.json();
            if (json.works.length === 0) {
                //no encontro la busqueda
                Alert.alert("No search found");
                setSearch(subject);
            } else {
                //actualiza el estado de la categoria y el offset si la busqueda es valida
                setSubject(subjectSearch);
                setOffset(0);
            }
        } catch (error) {
            Alert.alert("No search found");
        }
    };

    return (
        <ScrollView>
            {/* Contenedor de la busqueda */}
            <View style={styles.inputContainer}>
                {/* Input de la busqueda */}
                <TextInput onChange={(e) => setSearch(e.nativeEvent.text)}
                    placeholder="Categorie name"
                    style={styles.input}
                />
                {/* Boton de la busqueda */}
                <TouchableOpacity
                    onPress={() => funcSearch()}
                    style={styles.touchable}
                >
                    <Image source={require('../../assets/lupa.png')} style={styles.image_pagination} />
                </TouchableOpacity>
            </View>

            {/* Titulo de la categoria */}
            <Text style={styles.title}>
                {subject.toUpperCase()}
            </Text>

            {/* Contenedor de los libros */}
            <View style={styles.row}>
                {data && data.map((item, index) => (
                    <Book key={item.key} book={item} index={index} URL_IMAGE={URL_IMAGE} navigate={navigate} />
                ))}
            </View>

            {/* Contenedor de la paginacion */}
            <Pagination
                setOffset={setOffset}
                enablePagination={enablePagination}
                offset={offset}
            />
        </ScrollView>
    );
}

//componente para mostrar los libros
function Book({ book, index, URL_IMAGE, navigate }) {
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
                <Text>{book.authors[0].name}</Text>
            </View>
        </View>
    );
}

//componente para la paginacion
function Pagination({ setOffset, enablePagination, offset }) {
    return (
        //contenedor de la paginacion
        <View style={styles.cont_pagination}>
            {/* boton izquierdo de la paginacion */}
            <TouchableOpacity
                disabled={enablePagination.left}
                onPress={() => setOffset(offset - 1)}
            >
                <Image
                    source={require('../../assets/flecha-izquierda.png')}
                    style={styles.image_pagination}
                />
            </TouchableOpacity>
            {/* numero de la pagina actual */}
            <Text>{offset}</Text>
            {/* boton derecho de la paginacion */}
            <TouchableOpacity
                disabled={enablePagination.right}
                onPress={() => setOffset(offset + 1)}
            >
                <Image
                    source={require('../../assets/flecha-derecha.png')}
                    style={styles.image_pagination}
                />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
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
        height: "auto",
    },
    bookTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 135,
        height: 210,
        resizeMode: 'cover',
        borderRadius: 4,
        marginBottom: 8,
    },
    inputContainer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        height: 45,
        borderColor: COLORS.gray,
        borderWidth: 2,
        borderRadius: 50,
        paddingHorizontal: 10,
        width: '75%',
        marginRight: 7,
        fontSize: 16,
        color: COLORS.black,
        backgroundColor: COLORS.white,
    },
    touchable: {
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 50,
        borderColor: COLORS.gray,
        borderWidth: 2,
        alignItems: 'center',
        marginRight: 20,
    },
    image_pagination: {
        width: 20,
        height: 20,
        marginHorizontal: 20,
    },
    cont_pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 20,
    }
});