import axios from "axios"; //faz a conexão com o banco

const viacep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});

export default viacep;
