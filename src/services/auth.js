import axios from './axios'; // importamos la intancia que creamos.

export const peticionLoginUsuario = (credentials) => axios.post('auth/login', credentials)
export const peticionRegistroUsuario = (userData) => axios.post('usuarios', userData)