import { StyleSheet } from "react-native";
import Constants from "expo-constants"; //Captura info do celular como por ex.: o tamanho da barra superior do celular
import colors from "../../services/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },

  title: {
    paddingHorizontal: 16,
    fontSize: 30,
    marginTop: 10,
    color: colors.primaryFontColor,
    fontWeight: "bold",
  },

  descricao: {
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 32,
    color: colors.secondaryFontColor,
  },

  incidentList: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginRight: 10,
  },

  incident: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    marginRight: 16,
    width: 200,
    height: 320,
  },

  incidentProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
  },

  incidentDesc: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    width: "100%",
    marginBottom: 15,
    marginTop: 15,
    color: colors.primaryFontColor,
  },

  incidentValue: {
    fontSize: 12,
    color: colors.secondaryFontColor,
  },

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
    //        alignContent:"center",
    //      alignItems:"center",
    alignSelf: "center",
    //    justifyContent:"center",
    marginTop: 10,
  },

  detailsButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  vwimgproduto: {
    height: 150,
    width: 200,
  },
  addSacolaButton: {
    // backgroundColor: "#eee",
    // borderColor: "#333",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRadius: 14,
    // padding: 4,
    //    marginTop: 10,
    //    width: "100%",
    alignSelf: "center",
    position: "absolute",
    right: 5,
    bottom: 5,
  },

  //****************  CONFIGURAÇÃO DO OBJETO MODAL DE PESQUISA */
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
  openButton: {
    backgroundColor: "#0c4a90",
    borderRadius: 20,
    padding: 10,
    width: "50%",
    marginLeft: "22%",
    marginTop: 10,
    //        alignItems:"center",
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
  },
  txtmodaldetalhepro: {
    color: colors.secondaryFontColor,
    textAlign: "justify",
    marginBottom: 8,
  },
});
