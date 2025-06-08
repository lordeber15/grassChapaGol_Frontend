import axios from "axios";

const reservasApi = axios.create({
  baseURL:
    "https://grass-hacienda-grass-hacienda-sq1c0u-0533db-31-97-28-201.traefik.me/",
});
export const getReservas = async () => {
  const res = await reservasApi.get("/reservas");
  return res.data;
};

export const createReservas = (servicios) => {
  return reservasApi.post("/reservas", servicios);
};

export const updateReservas = (servicios) => {
  const serviciosCopy = { ...servicios };
  delete serviciosCopy.id;
  return reservasApi.put(`/reservas/${servicios.id}`, serviciosCopy);
};

export const deleteReservas = (id) => {
  return reservasApi.delete(`/reservas/${id}`);
};
