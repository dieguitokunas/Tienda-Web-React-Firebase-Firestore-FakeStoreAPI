import React, { createContext, useLayoutEffect, useState } from "react";
export const APIContext = createContext();
export function APICall({ children }) {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error(error);
    
      setInterval(() => {
        fetchData()
      }, 10000);

    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);
  return <APIContext.Provider value={data}>{children}</APIContext.Provider>;
}
