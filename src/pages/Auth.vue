<template>
    <div class="auth-page">
        <div class="auth-container">
            <h1>{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
            <form v-if="!userStore.user" @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        v-model="form.email"
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        v-model="form.password"
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div v-if="!isLogin" class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
            </form>
            <p v-if="!userStore.user">
                {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
                <a href="#" @click.prevent="toggleAuthMode">
                    {{ isLogin ? 'Sign Up' : 'Login' }}
                </a>
            </p>
            <div v-else>
                <h2>Welcome, {{ userStore.user.email }}</h2>
                <button @click="logout">Logout</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/user';

// Inicializar el store de usuario
const userStore = useUserStore();

// Estado reactivo
const isLogin = ref(true);
const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
});

// Función para alternar entre Login y Sign Up
const toggleAuthMode = () => {
    isLogin.value = !isLogin.value;
    resetForm();
};

// Función para resetear el formulario
const resetForm = () => {
    form.value.email = '';
    form.value.password = '';
    form.value.confirmPassword = '';
};

// Función para manejar el envío del formulario
const handleSubmit = async () => {
    if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        if (isLogin.value) {
            // Lógica para iniciar sesión
            const { error } = await userStore.signIn(form.value.email, form.value.password);
            if (error) throw error;
            alert('Logged in successfully!');
        } else {
            // Lógica para registrarse
            const { error } = await userStore.signUp(form.value.email, form.value.password);
            if (error) throw error;
            alert('Signed up successfully!');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred: ' + error.message);
    }
};

// Función para cerrar sesión
const logout = async () => {
    try {
        await userStore.signOut();
        alert('Logged out successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred: ' + error.message);
    }
};

// Verificar si el usuario está logueado al cargar el componente
onMounted(async () => {
    try {
        await userStore.fetchUser();
        if (userStore.user) {
            console.log('Welcome back, ' + userStore.user.email);
        }
    } catch (error) {
        // Solo muestra el error si no es por sesión faltante
        if (error.message !== 'Auth session missing!') {
            console.error('Error fetching user:', error.message);
        }
    }
});
</script>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url('../assets/signin.jpg') no-repeat center center fixed;
}

.auth-container {
    background: rgba(255, 255, 255, 0.53);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(8px);
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background-color: #0056b3;
}

p {
    text-align: center;
    margin-top: 1rem;
}

a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

a:hover {
    text-decoration: underline;
}
</style>