import React, { createContext, useContext, useState } from 'react';
import { themes } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(1); // default theme
  const currentTheme = themes[currentThemeId];

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
