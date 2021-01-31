import { StyleSheet } from "react-native";
import Constants from "expo-constants"; //Captura info do celular como por ex.: o tamanho da barra superior do celular
import colors from "../../services/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },

  viewheader2: {
    height: 65,
    backgroundColor: "#fff",
    marginTop: -20,
    zIndex: -1,
    flexDirection: "row", //coloca os itens um ao lado do outro ao inves de um abaixo do outro
    justifyContent: "center", //coloca cada item de um lado da tela do celular
    alignItems: "flex-end", //Centraliza os itens horizontalmente
    padding: 6,
  },

  inputsearchpro: {
    color: colors.secondaryFontColor,
    fontSize: 16,
    width: "80%",
    height: 35,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "#fff",
  },

  botaosearchpro: {
    height: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  botaolimpacateg: {
    backgroundColor: colors.secondaryFontColor,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
  },

  title: {
    paddingHorizontal: 16,
    fontSize: 30,
    marginTop: 10,
    color: "#101010",
    fontWeight: "bold",
  },

  descricao: {
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 32,
    color: colors.primaryFontColor,
    //    fontWeight: "bold",
    marginTop: 5,
  },

  incidentList: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  incident: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },

  incidentProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
  },

  incidentDesc: {
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
    width: "100%",
    textAlign: "justify",
    marginBottom: 15,
    color: colors.primaryFontColor,
  },

  incidentValue: {
    fontSize: 15,
    color: colors.secondaryFontColor,
  },

  detailsButton: {
    //        flexDirection:'row',
    justifyContent: "space-between",
    alignItems: "center",
  },

  // detailsButtonText: {
  //   color: "#e02041",
  //   fontSize: 15,
  //   fontWeight: "bold",
  //   marginTop: 20,
  // },

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

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  botaozap: {
    alignSelf: "center",
    marginTop: 10,
  },

  vwimgproduto: {
    height: 250,
    width: 300,
    alignSelf: "center",
  },
  addSacolaButton: {
    backgroundColor: colors.secondaryFontColor,
    marginTop: 15,
    borderRadius: 14,
    padding: 6,
    alignItems: "center",
    //    marginTop: 15,
    width: "100%",
    alignSelf: "center",
    elevation: 5,
  },
  addSacolaText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    height: 23,
  },

  //****************  CONFIGURAÇÃO DO OBJETO MODAL DETALHES */

  modalView: {
    margin: 40,
    marginTop: 120,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    //        alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  txtInputModal: {
    height: 40,
    width: 200,
    marginBottom: 16,
    borderColor: "gray",
    borderRadius: 8,
    borderWidth: 1,
  },
  openButton: {
    backgroundColor: "#0c4a90",
    borderRadius: 20,
    padding: 10,
    width: "50%",
    marginLeft: "22%",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.primaryFontColor,
  },
  txtmodaldetalhepro: {
    color: colors.secondaryFontColor,
    textAlign: "justify",
    marginBottom: 8,
  },
  // labelBotaoModal: {
  //   fontSize: 12,
  //   color: "gray",
  // },
});
