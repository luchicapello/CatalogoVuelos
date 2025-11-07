import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutesAdmin = () => {
    // obtener los estados globales de autenticación y carga.
    const { isAuthenticated, loading, user } = useSelector(state => state.auth)

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
    } else if (user.rol != 'admin') {
        return <Navigate to='/home' replace />
    }

    // Si está autenticado y es ADMIN, renderizamos la ruta.
    return <Outlet />
}
