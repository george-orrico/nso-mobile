import React, { useContext, useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cabecalho from "../../../Componentes/Cabecalho";
import { LoginContext } from "../../../Componentes/Login";
import api from "../../../services/api";

function currencyFormat(num) {
  return "R$ " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default function Pedidos() {
  const { users, empresaPadrao } = useContext(LoginContext);
  const [cfat, setCFat] = useState([]);
  const [ifat, setIFat] = useState([]);
  const [isModalIFatVisible, setIsModalIFatVisible] = useState(false);

  useEffect(() => {
    listarCFat();
  }, [users]);

  async function listarCFat() {
    if (users.length == 0) {
      return;
    }

    try {
      const resultCFat = await api.post("listarcfat", {
        cfat_emp: empresaPadrao,
        cfat_cli: users[0].cli_id,
      });

      setCFat(resultCFat.data);
    } catch (error) {
      Alert.alert("Erro", error + ", ao listar pedidos(Cfat)");
    }
  }

  async function listarIFat(itemCFat) {
    try {
      const resultIFat = await api.post("listarifat", {
        cfat_id: itemCFat,
        ifat_emp: empresaPadrao,
        ifat_cli: users[0].cli_id,
      });

      if (resultIFat.data.length > 0) {
        setIFat(resultIFat.data);
        setIsModalIFatVisible(true);
      } else {
        Alert.alert("Info", "Não foram encontrados itens para esse pedido");
      }
    } catch (error) {
      Alert.alert("Erro", error + ", ao listar pedidos(IFat)");
    }
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={false} />

      {!users.length && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Faça o Login para ver seus pedidos !</Text>
        </View>
      )}

      {!!users.length && (
        <View style={{ marginBottom: 130 }}>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                margin: 10,
                color: "#333",
              }}
            >
              :: SEUS PEDIDOS ::
            </Text>
          </View>

          <FlatList
            data={cfat}
            keyExtractor={(itemCFat) => String(itemCFat.cfat_id)}
            renderItem={({ index, item: itemCFat }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    listarIFat(itemCFat.cfat_id);
                  }}
                  style={{
                    margin: 6,
                    padding: 10,
                    backgroundColor: "#fff",
                    elevation: 5,
                    borderRadius: 3,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      backgroundColor: "#ddd",
                      padding: 2,
                      borderRadius: 2,
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: "#333",
                    }}
                  >
                    Número do Pedido : {itemCFat.cfat_id}
                  </Text>
                  <Text>Qtde Itens: {itemCFat.cfat_qtde}</Text>
                  {itemCFat.cfat_frete > 0 ? (
                    <Text>
                      Valor : {currencyFormat(itemCFat.cfat_vlrtotal)} +{" "}
                      {currencyFormat(itemCFat.cfat_frete)}
                    </Text>
                  ) : (
                    <Text>
                      Valor : {currencyFormat(itemCFat.cfat_vlrtotal)}
                    </Text>
                  )}
                  <Text style={{ textAlign: "right" }}>
                    Status: {itemCFat.cfat_status}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          ></FlatList>
        </View>
      )}

      {/* -------------------------------------------------------------------------*/}
      {/* ---------------------- MODAL DETALHES DO PEDIDO -------------------------*/}
      {/* -------------------------------------------------------------------------*/}

      <Modal
        animationType="fade" //animação que irá carregar a tela/pagina modal
        //        transparent={true} //deixa o restante da view transparente para exibir apenas o conteudo
        visible={isModalIFatVisible}
        onRequestClose={() => {
          setIsModalIFatVisible(false);
        }}
      >
        <Cabecalho exibeBtnLogin={false} />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", padding: 5 }}>
            Detalhes do Pedido
          </Text>
          <View
            style={{
              width: "100%",
              height: "80%",
              //top: 80,
              backgroundColor: "#eee",
              borderWidth: 0.5,
              borderColor: "#aaa",
              borderRadius: 2,
              padding: 4,
              elevation: 5,
            }}
          >
            <FlatList
              data={ifat}
              keyExtractor={(item) => String(item.ifat_id)}
              renderItem={({ index, item: item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#888",
                  }}
                >
                  <View style={styles.viewImgProdPedido}>
                    <Image
                      style={styles.imgProdPedido}
                      resizeMode="contain"
                      source={{ uri: `${item.pro_img}` }}
                    />
                  </View>

                  <View style={styles.viewTextosPedido}>
                    <Text style={styles.txtItensPedido}>{item.pro_desc}</Text>
                    <Text style={styles.txtItensPedido}>
                      Qtde: {item.ifat_qtde}
                    </Text>
                    <Text style={styles.txtItensPedido}>
                      Unit: {currencyFormat(item.ifat_vlrunit)}
                    </Text>
                    <Text
                      style={[styles.txtItensPedido, { textAlign: "right" }]}
                    >
                      Total : {currencyFormat(item.ifat_vlrtotal)}
                    </Text>
                  </View>
                </View>
              )}
            ></FlatList>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: "#333",
                paddingHorizontal: 12,
                borderRadius: 3,
              }}
              onPress={() => setIsModalIFatVisible(false)}
            >
              <Ionicons name="md-arrow-round-back" size={24} color="#fff" />
              <Text
                style={{
                  padding: 15,

                  color: "#fff",
                  borderRadius: 3,
                  fontWeight: "bold",
                }}
              >
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewImgProdPedido: {
    width: "25%",
    //    borderWidth: 2,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  imgProdPedido: {
    marginVertical: 3,
    width: "100%",
    height: 90,
  },
  viewTextosPedido: {
    //    borderWidth: 1,
    backgroundColor: "#eee",
    borderColor: "red",
    width: "74%",
    justifyContent: "center",
  },

  txtItensPedido: {
    padding: 3,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 12,
    //    borderWidth: 1,
  },
});
