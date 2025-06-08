import { getReservas, createReservas, updateReservas, deleteReservas } from "../../request/reservas";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useReservas = () => {
  return useQuery({
    queryKey: ["reservas"],
    queryFn: getReservas
  });
};

export const useCrearReservas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservas,
    onSuccess: () => {
      // Refresca automáticamente la lista de eventos
      queryClient.invalidateQueries(["reservas"]);
    },
  });
};

export const useActualizarReserva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReservas,
    onSuccess: () => {
      queryClient.invalidateQueries(["reservas"]);
    },
  });
};

export const useEliminarReserva = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReservas,
    onSuccess: () => {
      queryClient.invalidateQueries(["reservas"]);
    },
  });
};