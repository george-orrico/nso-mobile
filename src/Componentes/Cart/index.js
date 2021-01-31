import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { WSnackBar } from "react-native-smart-tip";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [totalValue, setTotalValue] = useState();
  const [uefct, setEfect] = useState(true);

  useEffect(() => {
    //totalizar os itens da sacola (Valor)
    let value = 0;
    cart.map((item) => {
      value = value + item.valor_total_item;
    });
    setTotalValue(value);
  }, [cart, uefct]);

  async function add(item) {
    //condição se o item esta em promoção ou nao p/pegar o valor correto
    if (item.pro_promo == "S") {
      var newItem = {
        ...item,
        qtde_sacola: 1,
        valor_total_item: item.pro_vlrpromo,
      };
    } else {
      var newItem = {
        ...item,
        qtde_sacola: 1,
        valor_total_item: item.pro_valor,
      };
    }

    //verifica se o item ja consta na sacola
    const findItem = cart.find((item) => newItem.pro_id === item.pro_id);
    //Se ainda não tiver na sacola, adiciona-o
    if (!findItem) {
      const newCart = cart;
      newCart.push(newItem);

      setCart([...newCart]);

      WSnackBar.show({
        data: "✅  Item Adicionado a Sacola ",
        backgroundColor: "#333",
        duration: 900,
        height: 50,
      });
    } else {
      //Se o item ja existir na sacola, apenas adiciona +1 na qtde e atualiza o total do item
      findItem.qtde_sacola = findItem.qtde_sacola + 1;
      if (findItem.pro_promo == "S") {
        findItem.valor_total_item =
          findItem.qtde_sacola * findItem.pro_vlrpromo;
      } else {
        findItem.valor_total_item = findItem.qtde_sacola * findItem.pro_valor;
      }
      uefct ? setEfect(false) : setEfect(true);

      WSnackBar.show({
        data: "✅  Item Adicionado a Sacola",
        backgroundColor: "#333",
        duration: 900,
        height: 50,
      });
    }
  }

  function removeItemCart(index) {
    let newCart = cart.filter((item, i) => i !== index);
    setCart([...newCart]);
  }

  function addQtdeSacola(sacola) {
    sacola.qtde_sacola = sacola.qtde_sacola + 1;
    uefct ? setEfect(false) : setEfect(true);
  }

  function addQtdeDigitada(sacola, qtde) {
    sacola.qtde_sacola = parseInt(qtde);
    uefct ? setEfect(false) : setEfect(true);
  }

  function diminuiQtdeSacola(index, sacola) {
    if (sacola.qtde_sacola > 1) {
      sacola.qtde_sacola = sacola.qtde_sacola - 1;
      uefct ? setEfect(false) : setEfect(true);
    } else {
      excluirItem(index);
    }
  }

  function excluirItem(index) {
    Alert.alert(
      "Remover",
      "Deseja remover o item da sacola ?",
      [
        {
          text: "Não",
          onPress: () => console.log("Não Remover"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            removeItemCart(index);
            uefct ? setEfect(false) : setEfect(true);
          },
        },
      ],
      { cancelable: false }
    );
  }

  function limparCartSemConfirmacao() {
    setCart([]);
  }

  function limparCart() {
    if (cart.length === 0) {
      return;
    }
    Alert.alert(
      "Esvaziar sacola",
      "Deseja remover todos os itens da sacola ?",
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            setCart([]);
          },
        },
      ],
      { cancelable: false }
    );
  }

  const store = {
    add,
    limparCart,
    limparCartSemConfirmacao,
    addQtdeSacola,
    diminuiQtdeSacola,
    addQtdeDigitada,
    cart,
    totalValue,
  };

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  const {
    add,
    limparCart,
    limparCartSemConfirmacao,
    addQtdeSacola,
    diminuiQtdeSacola,
    addQtdeDigitada,
    cart,
    totalValue,
  } = context;

  return {
    add,
    limparCart,
    limparCartSemConfirmacao,
    addQtdeSacola,
    diminuiQtdeSacola,
    addQtdeDigitada,
    cart,
    totalValue,
  };
}
