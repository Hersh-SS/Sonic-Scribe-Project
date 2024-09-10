import "./src/styles/global.css"
import React from 'react';
import { UserProvider } from './src/contexts/user';

export const wrapRootElement = ({ element }) => {
  return <UserProvider>{element}</UserProvider>;
};