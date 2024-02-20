import React, { createContext, useLayoutEffect, useState } from "react";
export const APIContext = createContext();
export function APICall({ children }) {
  const [data, setData] = useState([]);
  
  const fetchData = async () => {
    //Calls the API and await for the response.json to save it in 'data'
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error(error);
    //If the API call fail for X reason, the fetch is called again every 10k ms
      setInterval(() => {
        fetchData()
      }, 10000);

    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);
  //returns the Context Provider with the values of the fetched response within data, so it's children's can inherit those values 
  return <APIContext.Provider value={data}>{children}</APIContext.Provider>;
}
