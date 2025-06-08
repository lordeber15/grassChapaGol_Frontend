import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import style from "./calendar.module.css";
import esLocale from "@fullcalendar/core/locales/es";
import { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import {
  useReservas,
  useCrearReservas,
  useActualizarReserva,
  useEliminarReserva,
} from "../hooks/hookreservas";

export default function Calendar() {
  const calendarRef = useRef(null);
  const [value, setValue] = useState(dayjs(new Date()));
  const [open, setOpen] = useState(false);
  const [horas, setHoras] = useState(1);
  const [eventoEditando, setEventoEditando] = useState(null); // evento que se edita
  const [modoEdicion, setModoEdicion] = useState(false); // true si se edita
  const [dialogEliminarAbierto, setDialogEliminarAbierto] = useState(false);
  const [deporte, setDeporte] = useState("Vóley");
  const [userData, setUserData] = useState(null);

  const now = new Date();
  const validRange = {
    start: now.toISOString(), // Fecha actual en formato ISO string
  };
  const { data: reservas = [] } = useReservas();
  const { mutate: crearReserva } = useCrearReservas();
  const { mutate: actualizarReserva } = useActualizarReserva();
  const { mutate: eliminarReserva } = useEliminarReserva();

  const getInitialView = () => {
    return window.matchMedia("(max-width: 767px)").matches
      ? "timeGridDay"
      : "timeGridWeek";
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  const esAdmin = userData?.cargo === "Administrador";

  const handleClickOpen = (info) => {
    setOpen(true);
    const fechaHoraInicio = info.date;
    const fechaHoraFin = new Date(fechaHoraInicio);
    fechaHoraFin.setHours(fechaHoraFin.getHours() + horas);
    setValue(dayjs(fechaHoraInicio));
  };

  const handleClose = () => {
    setOpen(false);
    setHoras(1);
    setValue(dayjs());
    setEventoEditando(null);
    setModoEdicion(false);
    setDeporte("Vóley");
  };
  // const handleReset = () => {
  //   handleClose();
  //   setHoras(1);
  // };
  const renderEventContent = (eventInfo) => {
    const start = eventInfo.event.start;
    const end = eventInfo.event.end;
    const durationHoras = (end - start) / (1000 * 60 * 60); // duración en horas
    return (
      <div className={style.containerEvent}>
        <strong className={style.titleEvent}>{eventInfo.event.title}</strong>
        {durationHoras > 1 && (
          <strong className={style.titleEvent}>{eventInfo.timeText}</strong>
        )}
      </div>
    );
  };
  const handleDateClick = (e) => {
    e.preventDefault();

    const fechaHoraInicio = value.toDate();
    const fechaHoraFin = new Date(fechaHoraInicio);
    fechaHoraFin.setHours(fechaHoraFin.getHours() + parseInt(horas));

    const eventosExistente = calendarRef.current.getApi().getEvents();
    const eventoSuperpuesto = eventosExistente.find((evento) => {
      if (modoEdicion && evento.id === eventoEditando.id) return false;
      return (
        (fechaHoraInicio >= evento.start && fechaHoraInicio < evento.end) ||
        (fechaHoraFin > evento.start && fechaHoraFin <= evento.end) ||
        (fechaHoraInicio <= evento.start && fechaHoraFin >= evento.end)
      );
    });

    if (eventoSuperpuesto) {
      handleClose();
      alert(
        "La nueva fecha y hora se cruza con un evento existente. Elije otra hora."
      );
      return;
    }

    if (modoEdicion) {
      eventoEditando.setStart(fechaHoraInicio);
      eventoEditando.setEnd(fechaHoraFin);
      eventoEditando.setProp("title", deporte);
      // Aquí puedes usar el hook para actualizar en base de datos
      actualizarReserva({
        id: eventoEditando.id,
        datos: {
          start: fechaHoraInicio,
          end: fechaHoraFin,
          title: deporte,
          backgroundColor: "#0E6655",
          borderColor: "#0E6655",
          textColor: "#F2F3F4",
        },
      });
    } else {
      const nuevoEvento = {
        title: deporte,
        start: fechaHoraInicio,
        end: fechaHoraFin,
        backgroundColor: "#0E6655",
        borderColor: "#0E6655",
        textColor: "#F2F3F4",
      };

      crearReserva(nuevoEvento);
    }

    handleClose();
  };

  const handleEliminarReserva = () => {
    if (eventoEditando) {
      eventoEditando.remove(); // quita del calendario
      eliminarReserva(eventoEditando.id); // elimina de la base de datos
      handleClose();
      setDialogEliminarAbierto(false);
    }
  };

  return (
    <div className={style.containerDate}>
      <FullCalendar
        ref={calendarRef}
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={getInitialView()}
        slotDuration="01:00:00" // Establece la duración de cada ranura en 1 hora
        slotMinTime="08:00:00" // La hora mínima que se mostrará (en este caso, 8:00 AM)
        slotMaxTime="24:00:00"
        allDaySlot={false}
        selectable={false}
        events={reservas}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
        }}
        contentHeight="auto"
        validRange={validRange}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "",
        }}
        eventContent={renderEventContent}
        eventOverlap={false}
        dateClick={esAdmin ? handleClickOpen : undefined}
        editable={esAdmin}
        eventClick={(info) => {
          const evento = info.event;
          setEventoEditando(evento); // Guardamos el evento
          setValue(dayjs(evento.start)); // Cargamos la fecha
          setHoras(dayjs(evento.end).diff(dayjs(evento.start), "hour")); // duración
          setModoEdicion(true);
          setOpen(
            userData && userData.cargo === "Administrador" ? true : false
          );
          setDeporte(evento.title);
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Realizar Reserva</DialogTitle>
        <Box component="form" onSubmit={handleDateClick}>
          <DialogContent>
            <TextField
              select
              label="Tipo de Reserva"
              value={deporte}
              onChange={(e) => setDeporte(e.target.value)}
              sx={{ width: "95%", marginTop: 2 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Fútbol">Fútbol</option>
              <option value="Vóley">Vóley</option>
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem label="Fecha de la Reservas">
                <DesktopDatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  format="DD/MM/YY"
                  required
                  sx={{ width: "95%" }}
                />
              </DemoItem>
              <DemoItem label="Hora de la Resera">
                <StaticTimePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoItem>
            </LocalizationProvider>
            <TextField
              autoFocus
              margin="dense"
              id="horas"
              label="Horas"
              value={horas}
              minLength="0"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              onChange={(e) => {
                setHoras(e.target.value);
              }}
              type="number"
              sx={{ width: "95%" }}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">
              {modoEdicion ? "Actualizar" : "Guardar"}
            </Button>
            {modoEdicion && (
              <Button
                color="error"
                onClick={() => setDialogEliminarAbierto(true)}
              >
                Eliminar
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={dialogEliminarAbierto}
        onClose={() => setDialogEliminarAbierto(false)}
      >
        <DialogTitle>¿Seguro que deseas eliminar esta reserva?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDialogEliminarAbierto(false)}>
            Cancelar
          </Button>
          <Button color="error" onClick={handleEliminarReserva}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
