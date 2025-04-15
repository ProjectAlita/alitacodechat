import { configureStore } from '@reduxjs/toolkit';
import SettingsReducer, { name as settingsReducerName } from "./slices/settings.js";

const Store = configureStore({
  reducer: {
    [settingsReducerName]: SettingsReducer,
  },
})

export default Store
