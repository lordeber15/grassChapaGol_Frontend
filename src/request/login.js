import axios from "axios";

const loginApi = axios.create({
  baseURL: "https://chapagol-chapagol-5npmwv-32bfef-31-97-28-201.traefik.me/",
  //  "http://localhost:3000",
});
export const getLogin = async () => {
  const res = await loginApi.get("/login");
  return res.data;
};

export const createLogin = (login) => {
  return loginApi.post("/login", login);
};

export const updateLogin = (login) => {
  const loginCopy = { ...login };
  delete loginCopy.id;
  return loginApi.put(`/login/${login.id}`, loginCopy);
};

export const deleteLogin = (id) => {
  return loginApi.delete(`/login/${id}`);
};
