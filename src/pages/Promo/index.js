import React, { useState, useEffect, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  FlatList,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
// Linking=> Essa função possibilita abrir qualquer outro aplicativo do celular por dentro do nosso app.
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../services/api";

import styles from "./styles";
import Cabecalho from "../../Componentes/Cabecalho";
import BotaoZap from "../../Componentes/BotaoZap";
import { useCart } from "../../Componentes/Cart";
import { LoginContext } from "../../Componentes/Login";

export default function Promo() {
  const { empresaPadrao } = useContext(LoginContext);
  const [incidents, setIncidents] = useState([]);
  const [modalDetalheVisible, setModalDetalheVisible] = useState(false);
  const [telzap1, setTelZap1] = useState("");
  const [msgzap1, setMsgZap1] = useState("");
  const [vDetalhe, setvDetalhe] = useState(" ");
  const { add } = useCart();

  useEffect(() => {
    loadIncidents(); //buscar os dados na tabela incidents
  }, []);

  async function loadIncidents() {
    const response = await api.get(`prodpromo/${empresaPadrao}`);
    setIncidents(response.data); //Seta a variavel setIncidents com o resultado da consulta
  }

  function currencyFormat(num) {
    return "R$ " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={true} />

      <Text style={styles.title}>Promoções </Text>
      <Text style={styles.descricao}>
        Selecione um item para mais detalhes :
      </Text>

      <FlatList
        horizontal //Para deixar o flatlist na horizontal
        data={incidents}
        refreshing={loadIncidents}
        style={styles.incidentList}
        keyExtractor={(incident) => String(incident.pro_id)}
        showsVerticalScrollIndicator={false} //oculta a barra
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <TouchableOpacity
              onPress={() => {
                setvDetalhe(incident.pro_detalhe);
                setModalDetalheVisible(true);
              }}
            >
              <View style={styles.vwimgproduto}>
                <Image
                  style={{ width: 170, height: 145, alignContent: "center" }}
                  resizeMode="contain"
                  source={{ uri: `${incident.pro_img}` }}
                />
              </View>

              <Text style={styles.incidentDesc}>{incident.pro_desc}</Text>

              <Text style={styles.incidentValue}>
                Marca: {incident.pro_marca}
              </Text>

              <Text
                style={[
                  styles.incidentValue,
                  { textDecorationLine: "line-through" },
                ]}
              >
                De: {currencyFormat(incident.pro_valor)}
              </Text>
              <Text style={{ fontSize: 14, color: "red" }}>
                Por: {currencyFormat(incident.pro_vlrpromo)}
              </Text>

              {/* <Text style={styles.incidentValue}>Detalhe: {incident.pro_detalhe}</Text> */}

              {/* <Text style={styles.incidentProperty}>Pronta entrega:</Text>
                            <Text style={styles.incidentValue}>{incident.pro_entrega}</Text> */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addSacolaButton}
              onPress={() => {
                add(incident);
              }}
            >
              <MaterialCommunityIcons
                name="cart-arrow-down"
                size={30}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <BotaoZap />

      {/**************************************************************************************************/}
      {/********************** INICIO DA CHAMADA DO MODAL DE DETALHE DO PRODUTO **************************/}
      {/**************************************************************************************************/}
      <View>
        <Modal
          animationType="slide" //animação que irá carregar a tela/pagina modal
          transparent={true} //deixa o restante da pagina transparente para exibir apenas o conteudo
          visible={modalDetalheVisible}
          onRequestClose={() => {
            setModalDetalheVisible(false);
          }}
          // onRequestClose={() => {//Ação ao tentar fechar sem ser pelo botão
          // Alert.alert("Modal precisa ser fechado."); //mensagem ao clicar no botão voltar do celular, forçado que o modal seja fechado por dentro do programa
          // }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>DETALHES DO PRODUTO:</Text>
            <Text style={styles.txtmodaldetalhepro}>{vDetalhe}</Text>

            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                setModalDetalheVisible(false);
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
}
