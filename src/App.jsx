import { AltaVuelo } from "./pages/AltaVuelo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetalleVuelo from "./pages/DetalleVuelo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/vuelos/nuevo"
          element={<AltaVuelo />}
        />
        <Route
          path="/vuelos/:id"
          element={<DetalleVuelo />}
        />
      </Routes>
    </BrowserRouter>
  );
}
