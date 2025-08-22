import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { themes } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to theme 1
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    const savedThemeId = localStorage.getItem('currentThemeId');
    if (savedThemeId) {
      return parseInt(savedThemeId);
    }
    // Default to theme 1 on first load (no random)
    return 1;
  });

  const currentTheme = themes[currentThemeId];

  // Change theme immediately when website is reopened after being closed for more than 30 seconds
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Mark that the page is being closed
      localStorage.setItem('pageClosed', Date.now().toString());
    };

    const handleLoad = () => {
      // Check if the page was previously closed
      const pageClosedTime = localStorage.getItem('pageClosed');
      
      if (pageClosedTime) {
        const timeSinceClose = Date.now() - parseInt(pageClosedTime);
        
        // Clear the flag
        localStorage.removeItem('pageClosed');
        
        // Only trigger if the page was closed for more than 30 seconds
        if (timeSinceClose > 5 * 1000) {
          // Website reopened after being closed for more than 30 seconds - change theme immediately
          // Get current theme ID from localStorage to ensure we have the latest value
          const currentThemeFromStorage = parseInt(localStorage.getItem('currentThemeId')) || 1;
          const themeIds = Object.keys(themes).map(Number);
          // Filter out the current theme to ensure we get a different theme
          const availableThemes = themeIds.filter(id => id !== currentThemeFromStorage);
          const randomThemeId = availableThemes[Math.floor(Math.random() * availableThemes.length)];
          
          setCurrentThemeId(randomThemeId);
          localStorage.setItem('currentThemeId', randomThemeId.toString());
        }
        // If closed for less than 30 seconds, keep the same theme (do nothing)
      }
    };

    // Set up the event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [currentThemeId]); // Add currentThemeId to dependencies

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentThemeId, currentThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
