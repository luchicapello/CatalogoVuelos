import axios from "axios";

const instance = axios.create({
    // la URL BASE DEL BACKEND
    baseURL: 'https://grupo5-usuarios.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Configurar que cada petición mande el token (si lo hay).


export default instance;
