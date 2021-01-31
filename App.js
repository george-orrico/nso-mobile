//arquivo principal do react-native
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import Routes from "./src/routes"; //importa o arquivo de rotas
import CartProvider from "./src/Componentes/Cart";
import LoginProvider from "./src/Componentes/Login";

export default function App(props) {
  return (
    <>
      <StatusBar backgroundColor="#222" />
      <LoginProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </LoginProvider>
    </>
  );
}
