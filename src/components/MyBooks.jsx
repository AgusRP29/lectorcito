import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/connection';
import { getAuth } from 'firebase/auth';
import BooksCard from './BooksCard';
import { COLORS } from '../utils/colors';

export default function MyBooks() {
  const user = getAuth().currentUser;
  const [data, setData] = useState(null);
  const [books, setBooks] = useState(null);
  const URL_IMAGE = "https://covers.openlibrary.org/b/id/";  //URL de las imagenes de los libros
  const URL_BOOK = "https://openlibrary.org";   //URL de la API

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

  useEffect(() => {
    const fetchData = async () => {
      if (data && data.length > 0 && data[0].books) {
        const bookList = data[0].books.map(async (book) => {
          const res = await fetch(URL_BOOK + book + ".json");
          const json = await res.json();
          const details = {
            key: json.key,
            title: json.title,
            cover: json.covers[0],
          };
          return details;
        });
        const resolvedBooks = await Promise.all(bookList);
        setBooks(resolvedBooks);
      }
    };
    fetchData();
  }, [data]);

  return (
    <ScrollView>
      <View style={styles.row}>
        { books && books.length > 0 ?
            books.map((book, index) => (
              <BooksCard key={index} book={book} index={index} type={false} />
            ))
            :
            <View style={styles.cont}>
              <Text style={styles.text}>No books in your favorites books list</Text>
            </View>
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.red,
  }
})