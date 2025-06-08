import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import style from "./login.module.css";
import logohacienda from "../../assets/hacienda.png";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getLogin } from "../../request/login";
import { useEffect, useState } from "react";

function Login() {
  const {
    //isLoading,
    data: dataUser,
    //isError,
    //error,
  } = useQuery({
    queryKey: ["login"],
    queryFn: getLogin,
  });

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPasword] = useState("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handledusuario = (e) => {
    setUsuario(e.target.value);
  };
  const handledPassword = (e) => {
    setPasword(e.target.value);
  };

  const handleIngresar = () => {
    if (dataUser) {
      const user = dataUser.find(
        (user) => usuario === user.usuario && password === user.password
      );
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
        navigate("/");
      } else {
        console.log("No puedes ingresar");
      }
    } else {
      console.log("Datos de usuario no disponibles aún");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.login}>
        <img src={logohacienda} alt="Logo Hacienda" />
        <h1 className={style.titulo}>Iniciar Sesion</h1>
        <TextField
          id="usuario"
          value={usuario}
          onChange={handledusuario}
          label="Usuario"
          variant="standard"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handledPassword}
          variant="standard"
        />
        <Button variant="contained" onClick={handleIngresar}>
          Ingresar
        </Button>
      </div>
    </div>
  );
}

export default Login;
