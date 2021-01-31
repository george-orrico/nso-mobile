import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Cabecalho from "../../Componentes/Cabecalho";
import { useCart } from "../../Componentes/Cart";
import { LoginContext } from "../../Componentes/Login";
import api from "../../services/api";

import styles from "./styles";

export default function Sacola() {
  const navigation = useNavigation();
  const [modalQtdeVisible, setModalQtdeVisible] = useState(false);
  const [qtdeDigitada, setQtdeDigitada] = useState(0);
  const [sacola2, setSacola2] = useState({});
  const [vlrFrete, setVlrFrete] = useState(0);

  const {
    cart,
    limparCart,
    limparCartSemConfirmacao,
    addQtdeSacola,
    diminuiQtdeSacola,
    addQtdeDigitada,
    totalValue,
  } = useCart();

  const { users, empresaPadrao } = useContext(LoginContext);

  function currencyFormat(num) {
    return "R$ " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  function validarQtdeDigitada() {
    if (!qtdeDigitada) {
      Alert.alert(
        "Informar Quantidade",
        "A quantidade não pode estar em branco."
      );
      return;
    }

    if (qtdeDigitada == 0) {
      Alert.alert("informar Quantidade", "A quantidade não pode ser 0.");
      return;
    }

    addQtdeDigitada(sacola2, qtdeDigitada);
    setQtdeDigitada(0);
    setModalQtdeVisible(false);
  }

  async function confirmarPedido() {
    if (!cart.length) {
      Alert.alert("Sacola vazia", "Não existem itens na sacola.");
      return;
    }

    if (!users.length) {
      Alert.alert(
        "Fazer Login",
        "Para fazer o pedido é necessário estar logado. Deseja fazer o login agora ?",
        [
          {
            text: "Não",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              navigation.navigate("Sua Conta");
            },
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      const frete = await api.post("cidadeatendida", {
        cid_emp: empresaPadrao,
        cid_desc: users[0].cli_cidade,
      });
      //SE NAO ACHAR A CIDADE, INFORMA QUE NÃO TEM ENTREGA PARA ESSA REGIÃO
      if (frete.data.length == 0) {
        Alert.alert(
          "Região não atendida",
          "Ainda não atendemos sua região, deseja gravar o pedido mesmo assim ?",
          [
            {
              text: "Não",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: () => {
                gravarPedido(0);
              },
            },
          ],
          { cancelable: false }
        );
        return;
      } else {
        //SE FRETE = 0, NÃO COBRA FRETE
        if (frete.data[0].cid_frete == 0) {
          Alert.alert(
            "Confirmação",
            "Confirma a inclusão do pedido ?",
            [
              {
                text: "Não",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Sim",
                onPress: () => {
                  gravarPedido(0);
                },
              },
            ],
            { cancelable: false }
          );
          return;
          // VALOR MINIMO = 0 SEMPRE COBRARÁ O FRETE
        } else if (frete.data[0].cid_vlr_minimo == 0) {
          Alert.alert(
            "Taxa de entrega",
            "Para sua região será cobrado uma taxa de entrega de " +
              currencyFormat(frete.data[0].cid_frete) +
              " - Deseja Continuar ?",
            [
              {
                text: "Não",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Sim",
                onPress: () => {
                  gravarPedido(frete.data[0].cid_frete);
                },
              },
            ],
            { cancelable: false }
          );
          return;
          //SE VALOR MINIMO > 0 VERIFICA VALOR DA COMPRA
        } else if (frete.data[0].cid_vlr_minimo > 0) {
          //SE VALOR DA COMPRA < VALOR MININO COBRA O FRETE
          if (totalValue < frete.data[0].cid_vlr_minimo) {
            Alert.alert(
              "Taxa de entrega",
              "Será cobrado uma taxa de entrega de " +
                currencyFormat(frete.data[0].cid_frete) +
                " - Deseja Continuar ?",
              [
                {
                  text: "Não",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: () => {
                    gravarPedido(frete.data[0].cid_frete);
                  },
                },
              ],
              { cancelable: false }
            );
            return;
            //SE VALOR DA COMPRA > VALOR MININO NAO COBRA FRETE
          } else {
            Alert.alert(
              "Confirmação",
              "Confirma a inclusão do pedido ?",
              [
                {
                  text: "Não",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: () => {
                    gravarPedido();
                  },
                },
              ],
              { cancelable: false }
            );
          }
        }
      }
    }
  }

  async function gravarPedido(vfrete) {
    todo: "Se der erro na inclusão do IFat, excluir automaticamente o CFat";
    todo: "Verificar como tratar a forma pgto";

    try {
      const idCFat = await api.post("incluircfat", {
        cfat_emp: empresaPadrao,
        cfat_cli: users[0].cli_id,
        cfat_qtde: cart.length,
        cfat_vlrtotal: totalValue,
        cfat_frete: vfrete,
        cfat_status: "Pendente",
      });

      Promise.all(
        cart.map(async (item) => {
          await api.post("incluirifat", {
            ifat_cfat: parseInt(idCFat.data),
            ifat_emp: parseInt(empresaPadrao),
            ifat_cli: parseInt(users[0].cli_id),
            ifat_pro: parseInt(item.pro_id),
            ifat_qtde: parseInt(item.qtde_sacola),
            ifat_vlrunit:
              item.pro_promo == "S"
                ? item.pro_vlrpromo.toFixed(2)
                : item.pro_valor.toFixed(2),
            ifat_vlrtotal: item.valor_total_item,
          });
        })
      );
    } catch (error) {
      Alert.alert(error + ", ao incluir pedido no banco (cfat)");
      return;
    }

    limparCartSemConfirmacao();

    Alert.alert(
      "Pedido incluído",
      "Você pode acompanhar seus pedidos em [Sua Conta -> PEDIDOS]"
    );
  }

  return (
    <View style={styles.viewContainer}>
      <Cabecalho exibeBtnLogin={true} />

      {!cart.length && (
        <View
          style={{
            height: "30%",
            backgroundColor: "#eee",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Sua sacola esta vazia !!
          </Text>
          <AntDesign
            style={{ alignSelf: "center" }}
            name="shoppingcart"
            color={"#333"}
            size={40}
          />
        </View>
      )}

      <FlatList
        data={cart}
        keyExtractor={(sacola) => String(sacola.pro_id)}
        renderItem={({ index, item: sacola }) => (
          <View style={styles.viewSacola}>
            <View style={styles.viewImgProdSacola}>
              <Image
                style={styles.imgProdSacola}
                resizeMode="contain"
                source={{ uri: `${sacola.pro_img}` }}
              />
            </View>

            <View style={styles.viewTextosSacola}>
              <Text style={styles.txtItensSacola}>{sacola.pro_desc}</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {sacola.pro_promo !== "S" && (
                  <Text style={styles.txtItensSacola}>
                    Unit.: {currencyFormat(sacola.pro_valor)}
                  </Text>
                )}

                {sacola.pro_promo == "S" && (
                  <Text style={[styles.txtItensSacola, { color: "red" }]}>
                    Unit.: {currencyFormat(sacola.pro_vlrpromo)}
                  </Text>
                )}

                {sacola.pro_promo == "S" && (
                  <Text style={[styles.txtItensSacola, { color: "red" }]}>
                    {currencyFormat(
                      (sacola.valor_total_item =
                        sacola.pro_vlrpromo * sacola.qtde_sacola)
                    )}
                  </Text>
                )}

                {sacola.pro_promo !== "S" && (
                  <Text style={styles.txtItensSacola}>
                    {currencyFormat(
                      (sacola.valor_total_item =
                        sacola.pro_valor * sacola.qtde_sacola)
                    )}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.viewIconesSacola}>
              <TouchableOpacity
                onPress={() => {
                  addQtdeSacola(sacola);
                }}
              >
                <AntDesign
                  style={{ textAlign: "center", marginTop: 5 }}
                  name="caretup"
                  size={32}
                  color="#ce4e53"
                />
              </TouchableOpacity>

              <Text
                onPress={() => {
                  setSacola2(sacola);
                  setModalQtdeVisible(true);
                }}
                style={{ textAlign: "center", fontSize: 12 }}
              >
                {sacola.qtde_sacola}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  diminuiQtdeSacola(index, sacola);
                }}
              >
                <AntDesign
                  style={{ textAlign: "center", marginTop: 5 }}
                  name="caretdown"
                  size={32}
                  color="#ce4e53"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      ></FlatList>

      <View style={styles.viewRodapeSacola}>
        <View style={styles.viewRodapeSacolaValorTotal}>
          <Text style={{ textAlign: "center", fontSize: 12 }}>Total</Text>
          <Text style={{ textAlign: "center", fontSize: 12, marginTop: 5 }}>
            {currencyFormat(totalValue + 0)}
          </Text>
        </View>

        <View style={styles.viewRodapeSacolaConfirmarPedido}>
          <TouchableOpacity
            onPress={() => {
              limparCart();
            }}
            style={styles.touchableBotoesSacola}
          >
            <Text style={styles.textBotoesSacola}>Esvaziar{"\n"}Sacola</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              confirmarPedido();
            }}
            style={styles.touchableBotoesSacola}
          >
            <Text style={styles.textBotoesSacola}>Confirmar{"\n"}Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* -------------------------------------------------------------------------*/}
      {/* ----------------- MODAL DIGITAR QUANTIDADE DE ITENS ---------------------*/}
      {/* -------------------------------------------------------------------------*/}
      <Modal
        animationType="fade" //animação que irá carregar a tela/pagina modal
        transparent={true} //deixa o restante da view transparente para exibir apenas o conteudo
        visible={modalQtdeVisible}
        onRequestClose={() => {
          setModalQtdeVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Text>Digite a Quantidade Desejada:</Text>
          <TextInput
            autoFocus={true}
            keyboardType="numeric"
            onChangeText={(texto) => {
              setQtdeDigitada(texto);
            }}
            style={{
              backgroundColor: "#fff",
              color: "#555",
              fontSize: 16,
              margin: 8,
              borderRadius: 5,
              borderWidth: 0.5,
              width: "30%",
              padding: 5,
              textAlign: "center",
              marginVertical: 16,
            }}
          />

          <View style={styles.viewBotoesModal}>
            <TouchableOpacity
              style={styles.botoesModal}
              onPress={() => {
                validarQtdeDigitada();
              }}
            >
              <Text style={styles.textBotaoModal}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botoesModal}
              onPress={() => {
                setModalQtdeVisible(false);
              }}
            >
              <Text style={styles.textBotaoModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
