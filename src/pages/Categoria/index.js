import React, { useState, useEffect, useContext } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";

import api from "../../services/api";
import styles from "./styles";
import Cabecalho from "../../Componentes/Cabecalho";
import { LoginContext } from "../../Componentes/Login";

export default function Categoria() {
  const { empresaPadrao } = useContext(LoginContext);

  const [categs, setCategs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); //usado para controlar o refresh do flatlist
  const navigation = useNavigation();

  useEffect(() => {
    loadCategs();
  }, []);

  async function SelecionaCateg(codCateg, descCateg) {
    try {
      await AsyncStorage.setItem("@codFiltroCateg", "" + codCateg); //Grava o codigo da categoria para usar como filtro na HomeScreen
      await AsyncStorage.setItem("@descFiltroCateg", "" + descCateg); //Grava a descrição da categoria para exibir na HomeScreen
      navigation.navigate("início"); //Carrega a HomeScreen
    } catch (error) {
      console.log(error.message);
    }
  }

  async function loadCategs() {
    setIsLoading(true);
    const response = await api.get(`list-allCateg-mob/${empresaPadrao}`);
    setCategs(response.data); //Seta a variavel categs com o resultado da consulta
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={true} />

      <FlatList
        data={categs}
        refreshing={isLoading}
        onRefresh={loadCategs}
        style={styles.categList}
        keyExtractor={(categ) => String(categ.categ_id)}
        showsVerticalScrollIndicator={false} //oculta a barra
        renderItem={({ item: categ }) => (
          <View style={styles.viewCateg}>
            <TouchableOpacity
              style={styles.touchCateg}
              onPress={() => {
                SelecionaCateg(categ.categ_id, categ.categ_desc);
              }}
            >
              <AntDesign name="caretleft" size={14} color="#aaaaaa" />
              <Animatable.Text
                animation="zoomIn"
                duration={1000}
                style={styles.txtCategDesc}
              >
                {categ.categ_desc}
              </Animatable.Text>
              <AntDesign name="caretright" size={14} color="#aaaaaa" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
