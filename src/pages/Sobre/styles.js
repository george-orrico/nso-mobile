import { StyleSheet } from "react-native";
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

  textoSublinhado: {
    paddingHorizontal: 16,
    fontSize: 12,
    lineHeight: 32,
    color: colors.secondaryFontColor,
    textDecorationLine: "underline",
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
});
