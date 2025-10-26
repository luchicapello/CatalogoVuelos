import { useEffect, useState } from "react";
import Field from "../components/Field";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // leemos los estados del redux.
  const { isAuthenticated, loading, error } = useSelector(state => state.auth)

  // despachador de acciones
  const dispatch = useDispatch();
  // navigate para redireccionar
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Fake auth for demo
    if (email && password.length >= 8) {
      const credentials = { email, password }
      dispatch(loginUser(credentials))
    } else {
      setMsg("Debe completar todos los campos, y la contraseña debe tener al menos 8 carácteres.");
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setMsg('Usuario Logueado exitosamente, redireccionado..')
      const timer = setTimeout(() => {
        navigate('/home')
      }, 2000);

      return () => {
        clearTimeout(timer);
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <main className="max-w-md mx-auto px-4 py-10 flex items-center justify-center flex-col h-lvh">
      <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded-2xl p-6 bg-white w-lg"
      >
        <Field label="Email">
          <label htmlFor="">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field label="Contraseña">
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        {
          loading
            ?
            <p>Cargando..</p>
            :
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gray-900 text-white"
            >
              Entrar
            </button>

        }

        {error && <p className="text-sm text-center text-red-700">{error}</p>}
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}

        <p>No estás registrado? <Link to="/signup" className="text-blue-600 hover:text-blue-300">Registrate</Link></p>

      </form>
    </main>
  );
}
