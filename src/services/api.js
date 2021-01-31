import axios from "axios"; //faz a conexão com o banco

const api = axios.create({
  baseURL: "https://nso-backend.herokuapp.com/",
});

export default api;
