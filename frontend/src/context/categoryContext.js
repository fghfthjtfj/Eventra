import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const useCategories = () => {
  return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
