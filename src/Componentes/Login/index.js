import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import api from "../../services/api";
import * as Crypto from "expo-crypto";

export const LoginContext = createContext();

function LoginProvider({ children }) {
  const [users, setUsers] = useState([]);
  const empresaPadrao = "1";

  function logoff() {
    Alert.alert(
      "Logoff",
      "Deseja sair da sua conta ?",
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            setUsers([]);
          },
        },
      ],
      { cancelable: false }
    );
  }

  function logoffSemConfirmacao() {
    setUsers([]);
  }

  async function logar(email, senha, empresa) {
    if (!email) {
      Alert.alert("Informe o email");
      return;
    }
    if (!senha) {
      Alert.alert("Informe a senha");
      return;
    }

    const senhaCrypto = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      senha
    );

    const response = await api.post("logarmobile", {
      Email: email,
      Senha: senhaCrypto,
      Empresa: empresa,
    });

    setUsers(response.data);

    if (!response.data.length) {
      Alert.alert(
        "Login inválido",
        "Verifique se o email e senha foram digitados corretamente."
      );
    }
  }

  const dadosLogin = {
    logar,
    logoff,
    logoffSemConfirmacao,
    users,
    empresaPadrao,
  };

  return (
    <LoginContext.Provider value={dadosLogin}>{children}</LoginContext.Provider>
  );
}

export default LoginProvider;
