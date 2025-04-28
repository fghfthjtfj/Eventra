import React, { createContext, useContext, useState } from 'react';
import citiesData from "../cities/cities.js"; // Переименуйте сюда

const CitiesContext = createContext();

export const useCities = () => {
  return useContext(CitiesContext);
};

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState(citiesData); // Используйте citiesData здесь

  return (
    <CitiesContext.Provider value={{ cities, setCities }}>
      {children}
    </CitiesContext.Provider>
  );
};
