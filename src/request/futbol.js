import axios from "axios";

const futbolApi = axios.create({
  baseURL:
    //"https://grass-hacienda-grass-hacienda-sq1c0u-0533db-31-97-28-201.traefik.me/",
    "http://localhost:3000",
});
export const getFutbol = async () => {
  const res = await futbolApi.get("/futbol");
  return res.data;
};

export const createFutbol = (servicios) => {
  return futbolApi.post("/futbol", servicios);
};

export const updateFutbol = (servicios) => {
  const serviciosCopy = { ...servicios };
  delete serviciosCopy.id;
  return futbolApi.put(`/futbol/${servicios.id}`, serviciosCopy);
};

export const deleteFutbol = (id) => {
  return futbolApi.delete(`/futbol/${id}`);
};
