import { createTheme } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import getDesignTokens from "./MainTheme.js";
import { blue01 } from './lightPalette.js';

export default function useAlitaTheme() {
  const isDarkMode = useSelector(state => state.settings.mode === 'dark');
  const globalTheme = useMemo(() => {
    return createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light'));
  }, [isDarkMode]);

  const localGridTheme = useMemo(() => {
    return createTheme(globalTheme, !isDarkMode ? {
      palette: {
        mode: 'light',
        background: {
          default: blue01,
        },
      },
    } : {});
  }, [globalTheme, isDarkMode]);

  return {
    globalTheme,
    localGridTheme,
    isDarkMode
  }
}