import logo from "../../assets/hacienda.png";
import style from "./navBar.module.css";
import { Link } from "react-router";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [userData, setUserData] = useState(null);
  const [admin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (userData && userData.cargo === "Administrador") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [userData]);
  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.reload();
  };
  return (
    <div className={style.container}>
      <div className={style.containerLogo}>
        <img src={logo} className={style.logo} />
        <p className={style.title}>Grass Hacienda</p>
      </div>
      {admin == false ? (
        <div className={style.links}>
          <Link to={"/login"}>Iniciar Sesion</Link>
        </div>
      ) : (
        <div className={style.avatar}>
          <div className={style.links}>
            {/* <Link>Reserva</Link>
            <Link to="/">Venta</Link> */}
            <Link
              onClick={() => {
                setIsAdmin(false);
                handleLogout();
              }}
            >
              <Avatar>L</Avatar>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
