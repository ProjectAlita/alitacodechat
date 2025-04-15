import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import useAlitaTheme from "@/useAlitaTheme.js";
import { Provider } from "react-redux";
import Store from "@/store.js";

const RootComponent = () => {
  const { globalTheme } = useAlitaTheme();

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store}>
      <RootComponent />
    </Provider>
  </React.StrictMode>
);
