import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useCart } from "./Componentes/Cart";

import {
  setCustomText,
  setCustomTouchableOpacity,
  setCustomTextInput,
} from "react-native-global-props";
import * as Font from "expo-font";

const Tab = createBottomTabNavigator();
const TabConta = createMaterialTopTabNavigator();

import Incidents from "./pages/Incidents"; // Importa as paginas criadas para colocar na ferramenta de navegação
import Categoria from "./pages/Categoria"; // Importa as paginas criadas para colocar na ferramenta de navegação
import Promo from "./pages/Promo"; // Importa as paginas criadas para colocar na ferramenta de navegação
import Sacola from "./pages/Sacola"; // Importa as paginas criadas para colocar na ferramenta de navegação
import Dados from "./pages/Conta/Dados"; // Importa as paginas criadas para colocar na ferramenta de navegação
import Pedidos from "./pages/Conta/Pedidos"; // Importa as paginas criadas para colocar na ferramenta de navegação

//Definir Fonte padrão do sistema (localmente)
Font.loadAsync({
  "Samsung-Regular": require("../src/assets/fonts/SamsungSans-Regular.ttf"),
  "Samsung-Bold": require("../src/assets/fonts/SamsungSans-Bold.ttf"),
  "Samsung-Medium": require("../src/assets/fonts/SamsungSans-Medium.ttf"),
})
  .then(() => {
    const samsungMedium = {
      style: {
        fontFamily: "Samsung-Medium",
      },
    };

    const samsungRegular = {
      style: {
        fontFamily: "Samsung-Regular",
      },
    };
    const samsungbold = {
      style: {
        fontFamily: "Samsung-Bold",
      },
    };

    setCustomText(samsungMedium);
    setCustomTouchableOpacity(samsungMedium);
    setCustomTextInput(samsungRegular);
  })
  .catch(function (err) {
    console.log(err);
  });

function MyTabs() {
  return (
    <TabConta.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        labelStyle: { color: "#fff" },
        style: { backgroundColor: "#444" },
      }}
    >
      <TabConta.Screen name="Dados" component={Dados} />
      <TabConta.Screen name="Pedidos" component={Pedidos} />
    </TabConta.Navigator>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: "#555",
    // primary: 'rgb(255, 45, 85)',
    // background: 'rgb(242, 242, 242)',
    // card: 'rgb(255, 255, 255)',
    // text: 'rgb(28, 28, 30)',
    // border: 'rgb(199, 199, 204)',
  },
};

export default function Routes() {
  const { cart } = useCart();

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        tabBarOptions={{
          inactiveBackgroundColor: "#fff",
          keyboardHidesTabBar: true,
        }}
      >
        <Tab.Screen
          name="início"
          component={Incidents}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Categorias"
          component={Categoria}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="bars" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Promoções"
          component={Promo}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="tago" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Sacola"
          component={Sacola}
          options={{
            tabBarBadge: cart.length,
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="shoppingcart" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Sua Conta"
          component={MyTabs}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
