## Usuario ADMIN

catalogo@gmail.com
uade1234

## ENDPOINT BASE
    https://grupo5-usuarios.vercel.app/


## REGISTRO
    URL: /api/usuarios
    Método: POST

## Estructura de cuerpo de la petición:
    {
    "nombre_completo": "string",     // Requerido
    "email": "string",              // Requerido (formato email)
    "password": "string",           // Requerido (mínimo 8 caracteres)
    "rol": "string",                // Opcional - enum: ["admin", "interno", "usuario"]
    "nacionalidad": "string",       // Requerido
    "telefono": "string"            // Opcional
    }

    Respuestas posibles:
    201 Created: Usuario creado exitosamente
    400 Bad Request: Error de validación o datos inválidos
    409 Conflict: El email ya está en uso

## Desarrollo:

    - Vista register (después te paso los campos que hay que poner)
    - ⁠Vista login
    - ⁠Mantener la sesión iniciada usando redu



    

    
https://grupo5-usuarios.vercel.app/api/auth/login
Login
 Así tenes que pasarlo desde el Front
mati
6:52 p.m.
Estructura de cuerpo de la petición:
{
  "nombre_completo": "string",     // Requerido
  "email": "string",              // Requerido (formato email)
  "password": "string",           // Requerido (mínimo 8 caracteres)
  "rol": "string",                // Opcional - enum: ["admin", "interno", "usuario"]
  "nacionalidad": "string",       // Requerido
  "telefono": "string"            // Opcional
}                          
URL: /api/usuarios
Método: POST
 Y esto para registra


 ### Modificar horarios

    - Cuando se demora el vuelo se le suma esa demora a la fecha y hora original (aterrizajeLocal, despegue)