import React from 'react';
import Screens from './screens/Screens';
import SessionProvider from './components/SessionProvider';
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function App(props) {

  return (
    <SessionProvider>
      <Screens {...props} />
    </SessionProvider>
  );
}