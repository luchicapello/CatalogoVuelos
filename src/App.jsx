import { AltaVuelo } from "./pages/AltaVuelo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetalleVuelo from "./pages/DetalleVuelo";
import { useDispatch } from "react-redux";
import { authCheckComplete, setAuthStatus } from "./redux/authSlice";
import { useEffect } from "react";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { ProtectedRoutesAdmin } from "./components/ProtectedRoutesAdmin";


// Función para verificar si el usuario está logueado.
const checkAuthStatus = (dispatch) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'))
  if (token) {
    dispatch(setAuthStatus({ token, user }))
  } else {
    dispatch(authCheckComplete());
  }
}

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus(dispatch)
  }, [dispatch])

  return (
    <BrowserRouter>

      <Routes>
        { /* Rutas publicas */}
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />


        { /* Rutas protegidas Normales */}
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/vuelos/:id"
            element={<DetalleVuelo />}
          />
        </Route>

        { /* Rutas protegidas Normales */}

        <Route element={<ProtectedRoutesAdmin />}>
          <Route
            path="/vuelos/nuevo"
            element={<AltaVuelo />}
          />
        </Route>


      </Routes>

    </BrowserRouter>
  );
}
