import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as Crypto from "expo-crypto";
import api from "../../../services/api";
import { LoginContext } from "../../../Componentes/Login";
import Cabecalho from "../../../Componentes/Cabecalho";
import viacep from "../../../services/viacep";
import { validate } from "gerador-validador-cpf";
import styles from "./styles";

export default function Dados() {
  const refNome = useRef(null);
  const refCPF = useRef(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [nome, setNome] = useState("");
  const [emailLogado, setEmailLogado] = useState("");
  const [cpf, setCPF] = useState("");
  const [fone, setFone] = useState("");
  const [cep, setCEP] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUF] = useState("");
  const [end, setEnd] = useState("");
  const [num, setNum] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [exibeAlteraDados, setExibeAlteraDados] = useState(false);
  const [novoCadastro, setNovoCadastro] = useState(false);
  const {
    logar,
    logoff,
    logoffSemConfirmacao,
    users,
    empresaPadrao,
  } = useContext(LoginContext);

  useEffect(() => {
    setSenha("");
    setNome(users.length ? users[0].cli_nome : "");
    setEmailLogado(users.length ? users[0].cli_email : "");
    setCPF(users.length ? users[0].cli_cpf : "");
    setFone(users.length ? users[0].cli_fone : "");
    setCEP(users.length ? users[0].cli_cep : "");
    setCidade(users.length ? users[0].cli_cidade : "");
    setUF(users.length ? users[0].cli_uf : "");
    setEnd(users.length ? users[0].cli_end : "");
    setNum(users.length ? users[0].cli_num : "");
    setBairro(users.length ? users[0].cli_bairro : "");
    setComplemento(users.length ? users[0].cli_complemento : "");
  }, [users]);

  todo: "adicionar opção de alterar a senha";

  async function buscaCep() {
    if (!cep || cep.length < 8) return;

    try {
      const resultadoCep = await viacep.get(`${cep}/json`);

      setCidade(resultadoCep.data.erro ? "" : resultadoCep.data.localidade);
      setBairro(resultadoCep.data.erro ? "" : resultadoCep.data.bairro);
      setEnd(resultadoCep.data.erro ? "" : resultadoCep.data.logradouro);
      setUF(resultadoCep.data.erro ? "" : resultadoCep.data.uf);
    } catch (error) {
      Alert.alert("Erro buscaCep", error + ", ao localizar o cep.");
    }
  }

  function validarCamposCliente() {
    if (!nome || nome.length < 3) {
      Alert.alert("Campo Obrigatório", "Informe o seu nome");
      refNome.current.focus();
      return;
    }

    if (!emailLogado || emailLogado.length < 7) {
      Alert.alert("Campo Obrigatório", "Informe o seu email");
      return;
    }

    if (!cpf || cpf.length < 11) {
      Alert.alert("Campo Obrigatório", "Informe o seu cpf");
      return;
    }

    if (!fone || fone.length < 11) {
      Alert.alert("Campo Obrigatório", "Informe o telefone com DDD");
      return;
    }

    if (!cep || cep.length < 8) {
      Alert.alert("Campo Obrigatório", "Informe o seu cep");
      return;
    }

    if (!cidade || cidade.length < 3) {
      Alert.alert("Campo Obrigatório", "Informe a cidade");
      return;
    }

    if (!uf || uf.length != 2) {
      Alert.alert("Campo Obrigatório", "Informe o estado");
      return;
    }

    if (!end || end.length < 3) {
      Alert.alert("Campo Obrigatório", "Informe o seu endereço");
      return;
    }

    if (!num) {
      Alert.alert("Campo Obrigatório", "Informe o número da residência");
      return;
    }

    if (!bairro || bairro.length < 3) {
      Alert.alert("Campo Obrigatório", "Informe o seu bairro");
      return;
    }

    return true;
  }

  function validarSenha() {
    if (!senha) {
      Alert.alert("Campo Obrigatório", "Informe a senha");
      return false;
    }

    if (!repetirSenha) {
      Alert.alert("Campo Obrigatório", "Repita a senha para validar");
      return false;
    }

    if (senha !== repetirSenha) {
      Alert.alert(
        "Dados não conferem",
        "A Senha e a Confirmação estão diferentes. Tente novamente!"
      );
      return false;
    }

    if (senha.length < 4) {
      Alert.alert(
        "Senha muito curta",
        "A senha deve ter pelo menos 4 digítos."
      );
      return false;
    }

    return true;
  }

  function validarCPF() {
    if (!cpf) {
      return;
    }
    const response = validate(cpf);
    if (!response) {
      Alert.alert("CPF inválido", "Verifique se o CPF está correto");
      refCPF.current.focus();
    }
  }

  async function cadastrarNovoCliente() {
    if (!validarCamposCliente()) {
      return;
    }

    if (!validarSenha()) {
      return;
    }

    try {
      const response = await api.post("verificaemail", {
        Email: emailLogado,
        Empresa: empresaPadrao,
      });

      if (response.data.length != 0) {
        Alert.alert(
          "Email já cadastrado",
          "O email informado já existe em nossa base de dados!"
        );
      } else {
        try {
          const senhaCrypto = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            senha
          );

          await api.post("incluircliente", {
            cli_emp: empresaPadrao,
            cli_nome: nome,
            cli_senha: senhaCrypto,
            cli_cpf: cpf,
            cli_cep: cep,
            cli_end: end,
            cli_num: num,
            cli_bairro: bairro,
            cli_cidade: cidade,
            cli_fone: fone,
            cli_email: emailLogado,
            cli_uf: uf,
            cli_complemento: complemento,
          });
          setNovoCadastro(false);
          setSenha("");
          setRepetirSenha("");
          Alert.alert(
            "Cadastro efetuado",
            "Entre com seus dados para fazer pedidos de compra."
          );
        } catch (error) {
          Alert.alert("Erro", error + ", ao incluir novo cliente.");
        }
      }
    } catch (error) {
      Alert.alert("Erro", error + ", ao verificar email");
    }
  }

  async function gravarAlteracoesCliente() {
    if (!validarCamposCliente()) {
      return;
    }

    try {
      await api.put("updatecli", {
        cli_id: users[0].cli_id,
        cli_emp: empresaPadrao,
        cli_nome: nome,
        cli_cpf: cpf,
        cli_cep: cep,
        cli_end: end,
        cli_num: num,
        cli_bairro: bairro,
        cli_cidade: cidade,
        cli_fone: fone,
        cli_email: emailLogado,
        cli_uf: uf,
        cli_complemento: complemento,
      });
      Alert.alert(
        "Cadastro atualizado !!",
        "Faça o login novamente para atualizar as informações."
      );
      setExibeAlteraDados(false);
      logoffSemConfirmacao();
    } catch (error) {
      Alert.alert("Erro", error + ", ao alterar dados do cliente");
    }
  }

  return (
    <View style={styles.container}>
      <Cabecalho exibeBtnLogin={false} />

      {/* Se ñ tiver logado... */}
      {/* Tela Login */}
      {!users.length && !novoCadastro && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textAlign: "center", padding: 7, color: "#555" }}>
            Entre com seus dados ou{"\n"}Crie uma conta para fazer pedidos
          </Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="rgba(255,0,0,0.2)"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInputLogin}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="rgba(255,0,0,0.2)"
            maxLength={8}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.textInputLogin}
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
            }}
          />

          <View style={styles.viewBotoes}>
            <TouchableOpacity
              style={styles.botoesLogin}
              onPress={() => logar(email, senha, empresaPadrao)}
            >
              <Text style={styles.textBotaoLogin}>Acessar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setNovoCadastro(true)}
              style={styles.botoesLogin}
            >
              <Text style={styles.textBotaoLogin}>Criar uma conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cadastrar novo usuário */}
      {!users.length && !!novoCadastro && (
        <ScrollView style={{ top: 20, paddingHorizontal: 12 }}>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            :: CADASTRAR USUÁRIO ::
          </Text>
          <TextInput
            placeholder="Informe seu nome"
            ref={refNome}
            value={nome}
            onChangeText={(texto) => {
              setNome(texto);
            }}
            style={[styles.textInputAlteraDados, { height: 40, marginTop: 18 }]}
          />

          <TextInput
            placeholder="E-mail"
            value={emailLogado}
            onChangeText={(texto) => {
              setEmailLogado(texto);
            }}
            autoCapitalize="none"
            style={[styles.textInputAlteraDados, { height: 40, marginTop: 18 }]}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <TextInput
                placeholder="Senha"
                value={senha}
                maxLength={8}
                onChangeText={(texto) => {
                  setSenha(texto);
                }}
                secureTextEntry={true}
                autoCapitalize="none"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>

            <View style={{ width: "48%" }}>
              <TextInput
                placeholder="Confirmar Senha"
                value={repetirSenha}
                maxLength={8}
                onChangeText={(texto) => {
                  setRepetirSenha(texto);
                }}
                secureTextEntry={true}
                autoCapitalize="none"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <TextInput
                placeholder="CPF"
                value={cpf}
                ref={refCPF}
                onChangeText={(texto) => {
                  setCPF(texto);
                }}
                onEndEditing={() => {
                  validarCPF();
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={11}
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>

            <View style={{ width: "48%" }}>
              <TextInput
                placeholder="DDD + Telefone"
                value={fone}
                onChangeText={(texto) => {
                  setFone(texto);
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={11}
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>
          </View>

          <TextInput
            placeholder="CEP"
            value={cep}
            onEndEditing={() => {
              buscaCep();
            }}
            onChangeText={(texto) => {
              setCEP(texto);
            }}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={8}
            style={[styles.textInputAlteraDados, { height: 40, marginTop: 18 }]}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "80%" }}>
              <TextInput
                placeholder="Cidade"
                value={cidade}
                onChangeText={(texto) => {
                  setCidade(texto);
                }}
                autoCapitalize="none"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>

            <View style={{ width: "16%" }}>
              <TextInput
                placeholder="UF"
                value={uf}
                maxLength={2}
                onChangeText={(texto) => {
                  setUF(texto);
                }}
                autoCapitalize="none"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "80%" }}>
              <TextInput
                placeholder="Endereço"
                value={end}
                onChangeText={(texto) => {
                  setEnd(texto);
                }}
                autoCapitalize="none"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>

            <View style={{ width: "16%" }}>
              <TextInput
                placeholder="Num."
                value={num}
                onChangeText={(texto) => {
                  setNum(texto);
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                style={[
                  styles.textInputAlteraDados,
                  { height: 40, marginTop: 18 },
                ]}
              />
            </View>
          </View>

          <TextInput
            placeholder="Bairro"
            value={bairro}
            onChangeText={(texto) => {
              setBairro(texto);
            }}
            autoCapitalize="none"
            style={[styles.textInputAlteraDados, { height: 40, marginTop: 18 }]}
          />

          <TextInput
            placeholder="Complemento"
            value={complemento}
            onChangeText={(texto) => {
              setComplemento(texto);
            }}
            multiline={true}
            autoCapitalize="none"
            style={[styles.textInputAlteraDados, { height: 40, marginTop: 18 }]}
          />

          <View
            style={[
              styles.viewBotoes,
              { width: "100%", paddingHorizontal: 10, marginTop: 20 },
            ]}
          >
            <TouchableOpacity
              style={[styles.botoesLogin, { marginBottom: 60 }]}
              onPress={() => {
                cadastrarNovoCliente();
              }}
            >
              <Text style={styles.textBotaoLogin}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botoesLogin, { marginBottom: 60 }]}
              onPress={() => {
                setNovoCadastro(false), setSenha(""), setRepetirSenha("");
              }}
            >
              <Text style={styles.textBotaoLogin}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Se tiver logado e alteradados for false... */}
      {/* Ao logar: Exibe Dados do Cliente */}
      {!!users.length && !exibeAlteraDados && (
        <ScrollView style={{ top: 20, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            :: USUÁRIO LOGADO ::
          </Text>

          <Text style={styles.titulo}>NOME:</Text>
          <Text style={styles.texto}>{users[0].cli_nome}</Text>

          <Text style={styles.titulo}>E-MAIL:</Text>
          <Text style={styles.texto}>{users[0].cli_email}</Text>

          <Text style={styles.titulo}>CPF:</Text>
          <Text style={styles.texto}>{users[0].cli_cpf}</Text>

          <Text style={styles.titulo}>FONE:</Text>
          <Text style={styles.texto}>{users[0].cli_fone}</Text>

          <Text style={styles.titulo}>CIDADE / CEP:</Text>
          <Text style={styles.texto}>
            {users[0].cli_cidade} - {users[0].cli_uf} / {users[0].cli_cep}
          </Text>

          <Text style={styles.titulo}>ENDEREÇO / BAIRRO:</Text>
          <Text style={styles.texto}>
            {users[0].cli_end}, número: {users[0].cli_num} /{" "}
            {users[0].cli_bairro}
          </Text>

          <Text style={styles.titulo}>COMPLEMENTO:</Text>
          <Text style={styles.texto}>{users[0].cli_complemento}</Text>

          <View
            style={[
              styles.viewBotoes,
              {
                width: "100%",
                paddingHorizontal: 10,
                marginTop: 20,
                marginBottom: 60,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.botoesLogin}
              onPress={() => {
                setExibeAlteraDados(true);
              }}
            >
              <Text style={styles.textBotaoLogin}>Alterar Dados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botoesLogin}
              onPress={() => logoff()}
            >
              <Text style={styles.textBotaoLogin}>Fazer Logoff</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Se tiver logado e alteradados for true... */}
      {/* Tela de Alteração do cadastro */}
      {!!users.length && !!exibeAlteraDados && (
        <ScrollView style={{ top: 20, paddingHorizontal: 12 }}>
          <Text style={styles.titulo}>NOME:</Text>
          <TextInput
            value={nome}
            onChangeText={(texto) => {
              setNome(texto);
            }}
            autoCapitalize="none"
            style={styles.textInputAlteraDados}
          />

          <Text style={styles.titulo}>E-MAIL:</Text>
          <TextInput
            value={emailLogado}
            onChangeText={(texto) => {
              setEmailLogado(texto);
            }}
            autoCapitalize="none"
            style={styles.textInputAlteraDados}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "45%" }}>
              <Text style={styles.titulo}>CPF:</Text>
              <TextInput
                value={cpf}
                onChangeText={(texto) => {
                  setCPF(texto);
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={11}
                style={styles.textInputAlteraDados}
              />
            </View>

            <View style={{ width: "45%" }}>
              <Text style={styles.titulo}>FONE:</Text>
              <TextInput
                value={fone}
                onChangeText={(texto) => {
                  setFone(texto);
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={11}
                style={styles.textInputAlteraDados}
              />
            </View>
          </View>

          <Text style={styles.titulo}>CEP:</Text>
          <TextInput
            value={cep}
            onEndEditing={() => buscaCep()}
            onChangeText={(texto) => {
              setCEP(texto);
            }}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={8}
            style={styles.textInputAlteraDados}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "80%" }}>
              <Text style={styles.titulo}>CIDADE:</Text>
              <TextInput
                value={cidade}
                onChangeText={(texto) => {
                  setCidade(texto);
                }}
                autoCapitalize="none"
                style={styles.textInputAlteraDados}
              />
            </View>

            <View style={{ width: "16%" }}>
              <Text style={styles.titulo}>UF:</Text>
              <TextInput
                value={uf}
                maxLength={2}
                onChangeText={(texto) => {
                  setUF(texto);
                }}
                autoCapitalize="none"
                style={styles.textInputAlteraDados}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "80%" }}>
              <Text style={styles.titulo}>ENDEREÇO:</Text>
              <TextInput
                value={end}
                onChangeText={(texto) => {
                  setEnd(texto);
                }}
                autoCapitalize="none"
                style={styles.textInputAlteraDados}
              />
            </View>

            <View style={{ width: "16%" }}>
              <Text style={styles.titulo}>NUM.:</Text>
              <TextInput
                value={num}
                onChangeText={(texto) => {
                  setNum(texto);
                }}
                autoCapitalize="none"
                keyboardType="numeric"
                style={styles.textInputAlteraDados}
              />
            </View>
          </View>

          <Text style={styles.titulo}>BAIRRO:</Text>
          <TextInput
            value={bairro}
            onChangeText={(texto) => {
              setBairro(texto);
            }}
            autoCapitalize="none"
            style={styles.textInputAlteraDados}
          />

          <Text style={styles.titulo}>COMPLEMENTO:</Text>
          <TextInput
            value={complemento}
            onChangeText={(texto) => {
              setComplemento(texto);
            }}
            multiline={true}
            autoCapitalize="none"
            style={[styles.textInputAlteraDados, { lineHeight: 22 }]}
          />

          <View
            style={[
              styles.viewBotoes,
              {
                width: "100%",
                paddingHorizontal: 10,
                marginTop: 20,
                marginBottom: 40,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                gravarAlteracoesCliente();
              }}
              style={styles.botoesLogin}
            >
              <Text style={styles.textBotaoLogin}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botoesLogin}
              onPress={() => {
                setExibeAlteraDados(false);
              }}
            >
              <Text style={styles.textBotaoLogin}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
