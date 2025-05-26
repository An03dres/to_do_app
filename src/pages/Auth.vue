<template>
    <div class="auth-bg">
        <div class="auth-glass">
            <h1>{{ isLogin ? 'LOGIN' : 'SIGN UP' }}</h1>
            <form v-if="!userStore.user" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="email">Username or e-mail:</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  placeholder="Your username or e-mail address"
                />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  :required="isLogin"
                  placeholder="Password"
                />
              </div>
              <div v-if="isLogin" class="info-msg">
                If the password is empty, we will send an e-mail with the magic link (passwordless login)
              </div>
              <div v-if="!isLogin" class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit">{{ isLogin ? 'LOGIN' : 'SIGN UP' }}</button>
            </form>
            <p v-if="!userStore.user" class="switch-auth">
              {{ isLogin ? "DON'T HAVE AN ACCOUNT?" : 'ALREADY HAVE AN ACCOUNT?' }}
              <a href="#" @click.prevent="toggleAuthMode">
                {{ isLogin ? 'SIGN UP' : 'LOGIN' }}
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
import Swal from 'sweetalert2';

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
      const { error } = await userStore.signIn(form.value.email, form.value.password);
      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful.',
        background: 'rgba(20,30,40,0.90)',
        color: '#fff',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'swal2-glass'
        }
      });
    } else {
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
    if (error.message !== 'Auth session missing!') {
      console.error('Error fetching user:', error.message);
    }
  }
});
</script>

<style scoped>
.auth-bg {
    min-height: 100vh;
    width: 100vw;
    background: url('../assets/signin.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-glass {
    background: rgba(20, 30, 40, 0.75);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 18px;
    padding: 2.5rem 2rem 2rem 2rem;
    max-width: 400px;
    width: 100%;
    color: #fff;
    text-align: center;
    backdrop-filter: blur(8px);
}

h1 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    letter-spacing: 2px;
}

.form-group {
    margin-bottom: 1.2rem;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    color: #fff;
    font-size: 1rem;
}

input {
    width: 100%;
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 8px;
    background: rgba(255,255,255,0.13);
    color: #fff;
    font-size: 1rem;
    margin-bottom: 0.2rem;
    outline: none;
    transition: background 0.2s;
}

input::placeholder {
    color: #cfd8dc;
    opacity: 1;
}

input:focus {
    background: rgba(255,255,255,0.22);
}

.info-msg {
    font-size: 0.95rem;
    color: #b0bec5;
    margin-bottom: 1.2rem;
    text-align: left;
}

button {
    width: 100%;
    padding: 0.9rem 0;
    background: linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%);
    color: #fff;
    border: none;
    border-radius: 22px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

button:hover {
    background: linear-gradient(90deg, #1976d2 0%, #4fc3f7 100%);
}

.switch-auth {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: #b0bec5;
    letter-spacing: 1px;
}

a {
    color: #4fc3f7;
    text-decoration: none;
    font-weight: 700;
    margin-left: 0.3rem;
}

a:hover {
    text-decoration: underline;
}
</style>