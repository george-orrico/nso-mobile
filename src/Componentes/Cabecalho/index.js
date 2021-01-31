import React, { useContext } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { LoginContext } from "../Login";

import logoimg from "../../assets/logo.png";

export default function Cabecalho(props) {
  const { users, logoff } = useContext(LoginContext);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Image style={styles.headerlogo} resizeMode="contain" source={logoimg} />

      {!users.length && props.exibeBtnLogin && (
        <TouchableOpacity
          style={styles.botaoLogin}
          onPress={() => {
            navigation.navigate("Sua Conta");
          }}
        >
          <Entypo name="login" color={"#8ad6f8"} size={20} />
          <Text style={{ color: "#ddd", fontSize: 10, textAlign: "center" }}>
            Login
          </Text>
        </TouchableOpacity>
      )}

      {!!users.length && (
        <TouchableOpacity
          style={styles.botaoLogin}
          onPress={() => {
            logoff();
          }}
        >
          <Entypo name="log-out" color={"#fa6363"} size={20} />
          <Text style={{ color: "#ddd", fontSize: 10, textAlign: "center" }}>
            Logoff
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row", //coloca os itens um ao lado do outro ao inves de um abaixo do outro
    justifyContent: "space-evenly", //coloca cada item de um lado da tela do celular
    alignItems: "center", //Centraliza os itens horizontalmente
    backgroundColor: "#222",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerlogo: {
    width: 210,
    height: 40,
  },
  botaoLogin: {
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
