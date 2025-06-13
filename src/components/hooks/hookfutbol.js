import {
  getFutbol,
  createFutbol,
  updateFutbol,
  deleteFutbol,
} from "../../request/futbol";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFutbol = () => {
  return useQuery({
    queryKey: ["futbol"],
    queryFn: getFutbol,
  });
};

export const useCrearFutbol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFutbol,
    onSuccess: () => {
      // Refresca automáticamente la lista de eventos
      queryClient.invalidateQueries(["futbol"]);
    },
  });
};

export const useActualizarFutbol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFutbol,
    onSuccess: () => {
      queryClient.invalidateQueries(["futbol"]);
    },
  });
};

export const useEliminarFutbol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFutbol,
    onSuccess: () => {
      queryClient.invalidateQueries(["futbol"]);
    },
  });
};
