import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#909090",
    //        paddingHorizontal:16, //cria um limite nos dois lados do container(esq. e dir.)
    //        paddingTop:Constants.statusBarHeight , //Adiciona uma margem superior igual ao tamanho da statusBar + 10 pixels
    //        marginTop: Constants.statusBarHeight, //coloca um margemtop do tamanho exato da statusbar p/ evitar ficar por cima dela
  },

  viewCateg: {
    marginTop: 4,
    height: 45,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#aaa",
  },

  touchCateg: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },

  txtCategDesc: {
    fontSize: 14,
    color: "#555",
    //    fontWeight:'bold'
  },
});
