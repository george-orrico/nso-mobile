import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../../services/colors";
import { LoginContext } from "../../Componentes/Login";

import api from "../../services/api";

export default function BotaoZap() {
  const [telzap1, setTelZap1] = useState("");
  const [msgzap1, setMsgZap1] = useState("");
  const { empresaPadrao } = useContext(LoginContext);

  useEffect(() => {
    //Pega o numero do zap cadastrado no banco
    pegarDadosZap();
  }, []);

  async function pegarDadosZap() {
    try {
      const response = await api.get(`empconfig/${empresaPadrao}`);

      if (response.data["emp_zap"] == "") {
        return;
      }

      setTelZap1(response.data["emp_zap"]);
      setMsgZap1(response.data["emp_zap_msg"]);
    } catch (error) {
      Alert.alert("Falha enviar zap", error + ", ao enviar zap.");
    }
  }

  function sendWhatsapp() {
    if (!telzap1) {
      Alert.alert("Info", "Zap indisponível no momento.");
      return;
    }
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

  return (
    <View style={styles.viewzap}>
      <TouchableOpacity style={styles.botaozap} onPress={sendWhatsapp}>
        <FontAwesome name="whatsapp" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewzap: {
    backgroundColor: colors.primaryZap,
    borderWidth: 1,
    borderColor: colors.secondaryZap,
    width: 48,
    height: 48,
    borderRadius: 60,
    position: "absolute",
    bottom: 15,
    right: 22,
  },

  botaozap: {
    alignSelf: "center",
    marginTop: 10,
  },
});
