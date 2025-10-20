import { useEffect, useMemo, useState } from "react";
import Field from "../components/Field";
import { PAISES } from "../constants/airports";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";

export default function Signup() {
  const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


  // leemos los estados del redux.
  const { registerSuccess, loading, error } = useSelector(state => state.auth)
  // despachador de acciones
  const dispatch = useDispatch();
  // navigate para redireccionar
  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    email: "",
    nacionalidad: "",
    telefono: "",
    password: "",
    passwordConfirm: "",
    rol: "interno",
    terms: false,
  });

  const paisesOptions = useMemo(
    () =>
      PAISES.map((element) => ({
        value: element,
        label: `${element}`,
      })),
    []
  );

  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.nacionalidad || form.password.length < 8 || !form.terms) {
      setMsg("Completá todos los campos requeridos y aceptá los términos.");
      return;
    } else if (!EMAIL_REGEX.test(form.email)) {
      setMsg("El formato del correo debe ser correcto.");
      return;
    }
    else if (form.password != form.passwordConfirm) {
      setMsg("Las contraseñas deben coincidir.");
      return;
    }
    dispatch(registerUser(form))
  }


  useEffect(() => {
    if (registerSuccess) {
      setMsg('Usuario registrado exitosamente, redireccionado..')
      const timer = setTimeout(() => {
        navigate('/')
      }, 1000);

      return () => {
        clearTimeout(timer);
      }
    }
  }, [registerSuccess])


  return (
    <main className="max-w-md mx-auto px-4 py-10 flex items-center justify-center flex-col  min-h-lvh">
      <h1 className="text-2xl font-semibold mb-6">Crear cuenta</h1>
      <form
        onSubmit={submit}
        className="space-y-4 border rounded-2xl p-6 bg-white w-lg"
      >
        <Field>
          <label htmlFor="inputNombre">Nombre Completo</label>
          <input
            id="inputNombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Tu nombre"
            className="h-9 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field>
          <label htmlFor="inputEmail">Email</label>
          <input
            id="inputEmail"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="tu@email.com"
            className="h-9 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field>
          <label htmlFor="inputNacionalidad">Nacionalidad</label>
          <Select
            id="inputNacionalidad"
            value={
              form.nacionalidad
                ? paisesOptions.find((o) => o.value === form.nacionalidad)
                : null
            }
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                nacionalidad: e.value
              }))
            }
            options={paisesOptions}
            placeholder="Escribe para buscar o selecciona una opción..."
          />
        </Field>
        <Field>
          <label htmlFor="inputTelefono">Teléfono (opcional)</label>
          <input
            id="inputTelefono"
            value={form.telefono}
            onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            placeholder="+911 555 4343"
            className="h-9 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field>
          <label htmlFor="inputPassword">Contraseña</label>
          <input
            id="inputPassword"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            placeholder="Mínimo 8 carácteres"
            className="h-9 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field>
          <label htmlFor="inputPasswordConfirm">Confirmar contraseña</label>
          <input
            id="inputPasswordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, passwordConfirm: e.target.value }))
            }
            placeholder="Confirme su contraseña"
            className="h-9 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) =>
              setForm((f) => ({ ...f, terms: e.target.checked }))
            }
          />
          Acepto los términos y condiciones
        </label>
        {
          loading
            ?
            <p className="w-full h-9 rounded-xl bg-gray-900 text-white">Cargando..</p>
            :
            <button
              type="submit"
              className="w-full h-9 rounded-xl bg-gray-900 text-white"
            >
              Crear cuenta
            </button>

        }

        {error && <p className="text-sm text-center text-red-700">{error}</p>}
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
        <p>Ya estás registrado? <Link to="/" className="text-blue-600 hover:text-blue-300">Ingresa</Link></p>

      </form>
    </main>
  );
}
