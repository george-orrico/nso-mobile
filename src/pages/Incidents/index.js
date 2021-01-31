import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  BackHandler,
  View,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import api from "../../services/api";
import Cabecalho from "../../Componentes/Cabecalho";
import BotaoZap from "../../Componentes/BotaoZap";
import { useCart } from "../../Componentes/Cart";
import { LoginContext } from "../../Componentes/Login";
import styles from "./styles";

export default function Incidents() {
  const { empresaPadrao } = useContext(LoginContext);

  const [exibirBotaoCateg, setExibirBotaoCateg] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [p_desc, setPDesc] = useState("");
  const [vDetalhe, setvDetalhe] = useState(" ");
  const [isLoading, setIsLoading] = useState(false);
  const [modalDetalheVisible, setModalDetalheVisible] = useState(false);
  const [varCategNome, setVarCategNome] = useState("");

  const [uefct, setEfect] = useState(true);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageDesc, setPageDesc] = useState(1);
  const [pageCateg, setPageCateg] = useState(1);

  const navigation = useNavigation();
  const { add } = useCart();

  useEffect(() => {
    //Pede confirmação para encerrar o app (Antes de sair volta pra pagina inicial, para sempre abrir nela)
    BackHandler.addEventListener("hardwareBackPress", backPressed);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backPressed);
    };
  }, []);

  backPressed = () => {
    Alert.alert(
      "Sair",
      "Deseja sair do aplicativo ?",
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            navigation.navigate("início"), BackHandler.exitApp();
          },
        },
      ],
      { cancelable: false }
    );
    return true;
  };

  useEffect(() => {
    //executa sempre que houver modificação na variavel uefct
    loadIncidents();

    return () => {
      AsyncStorage.removeItem("@codFiltroCateg");
      AsyncStorage.removeItem("@descFiltroCateg");
      setExibirBotaoCateg(false); //remove o botao categoria (filtro)
      setPage(1);
      setPageDesc(1);
      setPageCateg(1);
      setTotal(0);
      setIncidents([]); //reseta o array de incidents
    };
  }, [uefct]);

  async function limpaCateg() {
    try {
      //reseta os filtros e reprocessa o useEffect
      await AsyncStorage.removeItem("@codFiltroCateg");
      await AsyncStorage.removeItem("@descFiltroCateg");
      setExibirBotaoCateg(false); //remove o botao categoria (filtro)
      setPage(1);
      setPageDesc(1);
      setPageCateg(1);
      setTotal(0);
      setIncidents([]); //reseta o array de incidents
      uefct ? setEfect(false) : setEfect(true); //chama o useEffect
    } catch (error) {
      alert("limpaCateg: " + error);
    }
  }

  async function loadIncidents() {
    if (isLoading) {
      //se ja tiver processando o flatlist cancela
      return;
    }

    if (total > 0 && incidents.length == total) {
      //Verifica se ja carregou todos os registros e cancela a query
      return;
    }

    const varCateg = await AsyncStorage.getItem("@codFiltroCateg");
    setVarCategNome(await AsyncStorage.getItem("@descFiltroCateg"));

    if (varCateg) {
      try {
        setExibirBotaoCateg(true); //Exibir/Ocultar botãr 'limpar categoria'
        setIsLoading(true); //controla o refresh na flatlist
        Keyboard.dismiss(); //ocultar teclado antes da pesquisa

        const response = await api.get(
          `prodmobilecateg/${empresaPadrao}/${varCateg}`,
          {
            params: { pageCateg },
          }
        );

        setIncidents([...incidents, ...response.data]); //Seta a variavel setIncidents com o resultado da consulta
        setTotal(response.headers["x-total-count"]);
        setPageCateg(pageCateg + 1);
        setIsLoading(false); //controla o refresh na flatlist
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      try {
        await AsyncStorage.removeItem("@codFiltroCateg"); //Remove o filtro categoria ao executar a query padrao
        setExibirBotaoCateg(false); //Oculta o botao 'limpar filtro'
        setIsLoading(true); //controla o refresh na flatlist
        Keyboard.dismiss(); //ocultar teclado antes da pesquisa

        if (p_desc === "") {
          const response = await api.get(`prodmobileemp/${empresaPadrao}`, {
            params: { page },
          });

          setIncidents([...incidents, ...response.data]); //Seta a variavel setIncidents com o resultado da consulta
          setTotal(response.headers["x-total-count"]);

          setPage(page + 1);
          setIsLoading(false); //controla o refresh na flatlist
        } else {
          //buscar pela descrição
          const response = await api.get(
            `prodmobiledesc/${p_desc}/${empresaPadrao}`,
            {
              params: { pageDesc },
            }
          );

          setIncidents([...incidents, ...response.data]); //Seta a variavel setIncidents com o resultado da consulta
          setTotal(response.headers["x-total-count"]);

          setPageDesc(pageDesc + 1);
          setIsLoading(false); //controla o refresh na flatlist
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    }
  }

  function currencyFormat(num) {
    return "R$ " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={true} />

      <View style={styles.viewheader2}>
        <TextInput
          placeholder="Pesquise o produto desejado"
          style={styles.inputsearchpro}
          onChangeText={(text) => setPDesc(text.toUpperCase())}
          onEndEditing={limpaCateg} //ao perder o foco do textinput
        />
        <TouchableOpacity style={styles.botaosearchpro} onPress={limpaCateg}>
          <AntDesign name="search1" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.descricao}>Clique no item para mais detalhes :</Text>

      {/* Exibe o botao 'limpar filtro' de acordo com a variavel exibirBotaoCateg */}
      {exibirBotaoCateg && (
        <TouchableOpacity style={styles.botaolimpacateg} onPress={limpaCateg}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#eee" }}>
            Filtro : {varCategNome} ({total})
          </Text>
          <AntDesign name="closecircle" size={20} color="#eee" />
        </TouchableOpacity>
      )}

      <FlatList // *** LISTA DOS PRODUTOS FILTRADOS
        data={incidents}
        refreshing={isLoading}
        onRefresh={loadIncidents}
        onEndReached={loadIncidents} //carregar itens parcialmente (paginação)
        onEndReachedThreshold={0.2} //carregar mais itens antes do final da 'pagina'
        style={styles.incidentList}
        keyExtractor={(incident) => String(incident.pro_id)}
        showsVerticalScrollIndicator={false} //oculta a barra
        renderItem={({ index, item: incident }) => (
          <View style={styles.incident}>
            <TouchableOpacity
              onPress={() => {
                setvDetalhe(incident.pro_detalhe);
                setModalDetalheVisible(true);
              }}
            >
              <View style={styles.vwimgproduto}>
                <Animatable.Image
                  animation="bounceIn"
                  duration={1500}
                  style={(styles.improduto, { width: 270, height: 245 })}
                  resizeMode="contain"
                  source={{ uri: `${incident.pro_img}` }}
                />
              </View>

              <Text style={styles.incidentDesc}>{incident.pro_desc}</Text>
              <Text style={styles.incidentValue}>
                Marca: {incident.pro_marca}
              </Text>
              {/*Se não esta em promoção exibe o valor normalmente*/}
              {incident.pro_promo !== "S" && (
                <Text style={styles.incidentValue}>
                  Preço: {currencyFormat(incident.pro_valor)}
                </Text>
              )}
              {/*Se estiver em promoção exibe "De/Por"*/}
              {incident.pro_promo == "S" && (
                <View>
                  <Text
                    style={
                      (styles.incidentValue,
                      { textDecorationLine: "line-through" })
                    }
                  >
                    De: {currencyFormat(incident.pro_valor)}
                  </Text>
                  <Text style={(styles.incidentValue, { color: "red" })}>
                    Por: {currencyFormat(incident.pro_vlrpromo)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addSacolaButton}
              onPress={() => {
                add(incident);
              }}
            >
              <Text style={styles.addSacolaText}> Adicionar a Sacola</Text>
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
          transparent={true} //deixa o restante da view transparente para exibir apenas o conteudo
          visible={modalDetalheVisible}
          onRequestClose={() => {
            setModalDetalheVisible(false);
          }}
        >
          <Animatable.View
            animation="jello"
            duration={2000}
            style={styles.modalView}
          >
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
          </Animatable.View>
        </Modal>
      </View>
    </View>
  );
}
