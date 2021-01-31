import React, { useState, useEffect } from "react";
import { View, Linking, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles";
import Cabecalho from "../../Componentes/Cabecalho";

export default function Sobre() {
  const [telzap1, setTelZap1] = useState("");
  const [msgzap1, setMsgZap1] = useState("");

  function sendWhatsapp() {
    Linking.canOpenURL("whatsapp://send?text=oi").then((supported) => {
      //Verifica se o whatsapp esta instalado, tentando mandar um "oi"
      if (supported) {
        //se tiver o zap manda a mensagem especificada
        return Linking.openURL(
          `whatsapp://send?phone=${telzap1}&text=${msgzap1}`
        );
      } else {
        // se nao tiver o zap, carrega a pagina web abaixo
        return Linking.openURL(
          `https://api.whatsapp.com/send?phone=${telzap1}&text=${msgzap1}`
        );
      }
    });
  }

  useEffect(() => {
    pegarConfig();
  }, []);

  async function pegarConfig() {
    setTelZap1(await AsyncStorage.getItem("@zap1"));
    setMsgZap1(await AsyncStorage.getItem("@msgzap1"));
  }

  function policy() {
    Linking.canOpenURL(
      "https://blog.goodbarber.com/docs/Privacypolicy/PrivacyPolicy.pdf"
    ).then((supported) => {
      if (supported) {
        return Linking.openURL(
          "https://blog.goodbarber.com/docs/Privacypolicy/PrivacyPolicy.pdf"
        );
      }
    });
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={true} />

      <Text style={styles.descricao}></Text>

      <Text style={styles.title}>Sobre: </Text>
      <Text style={styles.descricao}>
        Exiba seus produtos na palma da mão de quem mais interessa: Seus
        Clientes.{" "}
      </Text>
      <Text style={styles.descricao}></Text>

      <Text style={styles.title}>Contato: </Text>
      <Text style={styles.descricao}>George Orrico</Text>
      <Text style={styles.descricao}>(73)99133-6562</Text>

      <Text style={styles.descricao}></Text>
      <Text style={styles.descricao}></Text>
      <TouchableOpacity onPress={policy}>
        <Text style={styles.textoSublinhado}>
          Política de Privacidade - Versão 3.0
        </Text>
      </TouchableOpacity>

      <View style={styles.viewzap}>
        <TouchableOpacity style={styles.botaozap} onPress={sendWhatsapp}>
          <FontAwesome name="whatsapp" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
