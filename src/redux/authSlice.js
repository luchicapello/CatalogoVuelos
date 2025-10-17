import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { peticionLoginUsuario, peticionRegistroUsuario } from "../services/auth"

// Estado Inicial
const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    registerSuccess: false,
}

// Thunk para el login 

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await peticionLoginUsuario(credentials)
            console.log(response);

            const token = response.data.data.token;
            const user = response.data.data.user;

            const fakeToken = 'asdasdasdasdasd'
            // Guardar el token en el LocalStorage
            localStorage.setItem('authToken', token)
            localStorage.setItem('user', JSON.stringify(user))

            return { token, user }

        } catch (error) {
            console.log('Error: ', error);

            const message = (error.response && error.response.data && error.response.data.message) || error.message || 'Error al intentar logear el usuario'
            return rejectWithValue(message)
        }
    }
)

// Thunk para el registro

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {

            const response = await peticionRegistroUsuario(userData)
            console.log(response);
            return true; // si es éxitoso.

        } catch (error) {
            console.log('Error: ', error);

            const message = (error.response && error.response.data && error.response.data.message) || error.message || 'Error al intentar logear el usuario'
            return rejectWithValue(message)
        }
    }
)


// Implementación del slice

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // acciones

        setAuthStatus: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
        },

        logout: (state) => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = false;
            state.loading = false;
        },

        authCheckComplete: (state) => {
            state.loading = false;
        }
    },

    // Thunks Asíncronos (Manejo del ciclo de vida de las funciones asíncronas pending, fulfilled, rejected)
    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token,
                    state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload || 'Fallo al iniciar sesión';
                state.token = null;
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')

            })

            // REGISTRO
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.registerSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Fallo al registrar usuario';
                state.registerSuccess = false;
            })
    },
})

// acciones sincronicas
export const { logout, setAuthStatus, authCheckComplete } = authSlice.actions;

// exportamos el reducer.
export default authSlice.reducer;
