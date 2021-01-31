import { StyleSheet } from "react-native";
import Constants from "expo-constants"; //Captura info do celular como por ex.: o tamanho da barra superior do celular
import colors from "../../services/colors";

export default StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  viewSacola: {
    width: "100%",
    //    borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryFontColor,
    //    borderBottomColor: "red",
    flexDirection: "row",
  },

  viewImgProdSacola: {
    width: "25%",
    //    borderWidth: 2,
    //    backgroundColor: "red",
    justifyContent: "center",
  },

  imgProdSacola: {
    marginVertical: 3,
    width: "100%",
    height: 90,
  },

  viewTextosSacola: {
    //    borderWidth: 1,
    backgroundColor: "#eee",
    borderColor: "red",
    width: "65%",
    justifyContent: "center",
  },

  txtItensSacola: {
    padding: 3,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 12,
    //    borderWidth: 1,
  },

  viewIconesSacola: {
    width: "10%",
    backgroundColor: "#eee",
    justifyContent: "center",
    paddingRight: 5,
  },
  viewRodapeSacola: {
    height: 60,
    flexDirection: "row",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  viewRodapeSacolaValorTotal: {
    flex: 1,
    backgroundColor: "#ddd",
    justifyContent: "center",
  },
  viewRodapeSacolaConfirmarPedido: {
    flex: 2,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  touchableBotoesSacola: {
    //    height: 38,
    marginRight: 5,
    justifyContent: "center",
    backgroundColor: "#737380",
    borderRadius: 8,
    elevation: 5,
  },
  textBotoesSacola: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 22,
    paddingVertical: 4,
  },
  modalView: {
    alignSelf: "center",
    alignContent: "center",
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#333",
    padding: 15,
    width: "85%",
  },

  viewBotoesModal: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },

  botoesModal: {
    borderWidth: 0.5,
    borderRadius: 5,
    width: "48%",
    backgroundColor: "#737380",
    elevation: 5,
  },

  textBotaoModal: {
    textAlign: "center",
    paddingVertical: 8,
    color: "#fff",
    fontWeight: "bold",
  },
});
