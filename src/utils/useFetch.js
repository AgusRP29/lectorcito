import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [response, setResponse] = useState(null);
  const KEY = 'AIzaSyAbIidH0ZKogy_cW-2VNOB5rqBvtjO305s'
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url + KEY);
        const json = await res.json();
        setResponse(json);
        
        // const previewData = async () => {
        //     const data = await fetch(json.preview_url);
        //     const json = await data.json();
        //     setResponse(json);
        // }

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  
  return response;
}