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
    <div className="bg-gray-900 min-h-screen">
      <main className="max-w-md mx-auto px-4 py-10 flex items-center justify-center flex-col min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-white">Iniciar sesión</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-gray-700 rounded-2xl p-6 bg-gray-800 shadow-2xl w-full"
        >
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </Field>
        {
          loading
            ?
            <p className="text-gray-300">Cargando..</p>
            :
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition font-medium"
            >
              Entrar
            </button>

        }

        {error && <p className="text-sm text-center text-red-400">{error}</p>}
        {msg && <p className="text-sm text-center text-gray-300">{msg}</p>}

        <p className="text-gray-300">No estás registrado? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Registrate</Link></p>

      </form>
      </main>
    </div>
  );
}
