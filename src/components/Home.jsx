import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../utils/colors'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import BooksCard from './BooksCard';

export default function Home() {
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
                setOffset(0);
                setSubject(subjectSearch);
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
                    <BooksCard key={item.key} book={item} index={index} type={true} />
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
    },
});