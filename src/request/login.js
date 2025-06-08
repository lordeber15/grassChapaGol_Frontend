import axios from "axios";

const loginApi = axios.create({
  baseURL:
    "https://grass-hacienda-grass-hacienda-sq1c0u-0533db-31-97-28-201.traefik.me/",
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
