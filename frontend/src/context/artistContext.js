import React, { createContext, useContext, useState } from 'react';

const ArtistContext = createContext();

export const useArtist = () => {
  return useContext(ArtistContext);
};

export const ArtistProvider = ({ children }) => {
  const [artist, setArtist] = useState(null);

  return (
    <ArtistContext.Provider value={{ artist, setArtist }}>
      {children}
    </ArtistContext.Provider>
  );
};
