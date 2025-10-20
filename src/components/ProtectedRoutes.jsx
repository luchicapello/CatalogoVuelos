import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


export const ProtectedRoutes = () => {

    // obtener los estados globales de autenticación y carga.
    const { isAuthenticated, loading } = useSelector(state => state.auth)

    // Si la app está cargando mostramos un spinner de carga.
    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h3>Cargando sesión..</h3>
            </div>
        )
    }

    // si termino de cargar, entonces, verificamos si el usuario no está autenticado
    if (!isAuthenticated) {
        return <Navigate to='/' replace />
    }

    // Si está autenticado, renderizamos la ruta.
    return <Outlet />
}
