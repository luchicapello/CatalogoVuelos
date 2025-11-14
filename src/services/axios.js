import axios from "axios";

const instance = axios.create({
    // la URL BASE DEL BACKEND
    baseURL: 'https://backendcatalogo-production.up.railway.app',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Configurar que cada petición mande el token (si lo hay).


export default instance;
