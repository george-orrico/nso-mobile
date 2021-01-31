import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  titulo: {
    fontSize: 14,
    //  paddingHorizontal: 10,
    marginTop: 12,
    fontWeight: "bold",
  },

  texto: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 10,
    backgroundColor: "#ddd",
    borderRadius: 3,
  },

  textInputAlteraDados: {
    backgroundColor: "white",
    fontSize: 16,
    lineHeight: 22,
    //    marginLeft: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    //    width: "94%",
    borderColor: "#bbb",
    borderWidth: 0.5,
  },
  textInputLogin: {
    width: "80%",
    padding: 5,
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 16,
    margin: 8,
    borderRadius: 5,
    borderWidth: 0.5,
  },

  viewBotoes: {
    width: "80%",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  botoesLogin: {
    borderWidth: 0.5,
    borderRadius: 5,
    width: "48%",
    backgroundColor: "#737380",
    elevation: 5,
  },

  textBotaoLogin: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#fff",
    fontWeight: "bold",
  },
});
