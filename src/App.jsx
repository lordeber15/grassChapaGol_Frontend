import NavBar from "./components/navBar/navBar";
import Calendar from "./components/Calendar/calendar";
import Login from "./components/page/login";
import Ventas from "./components/Ventas/ventas";
import { Routes, Route, useLocation, Navigate } from "react-router";
import ProtectedRoutes from "./components/protectedRoutes/protectedRoutes";

function App() {
  const locationNow = useLocation();
  return (
    <div>
      {locationNow.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Calendar />} />
        <Route
          path="/ventas"
          element={
            <ProtectedRoutes>
              <Ventas />
            </ProtectedRoutes>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to="/login" replace>
              <Ventas />
            </Navigate>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
