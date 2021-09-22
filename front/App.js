import React from 'react';
import Screens from './screens/Screens';
import SessionProvider from './components/SessionProvider';

export default function App(props) {

  return (
    <SessionProvider>
      <Screens {...props} />
    </SessionProvider>
  );
}