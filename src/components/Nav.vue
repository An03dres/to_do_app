<template>
  <nav class="navbar">
    <div class="nav-left">
      <span class="nav-logo">MiApp</span>
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/auth">Auth</router-link>
    </div>
    <div class="nav-right">
      <template v-if="userStore.user">
        <span class="user-name">{{ userStore.user.name || userStore.user.email }}</span>
        <button class="nav-btn" @click="logout">Logout</button>
      </template>
      <router-link v-else to="/auth">
        <button class="nav-btn">Login / Sign Up</button>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const logout = async () => {
  await userStore.signOut()
  router.push('/auth')
}
</script>

<style scoped>
.navbar {
  width: 100%;
  background: linear-gradient(90deg, #3a8dde 0%, #6ec6ff 100%);
  padding: 0.7rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(24,136,255,0.08);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 2rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.nav-link {
  color: #e3f2fd;
  font-size: 1.08rem;
  font-weight: 500;
  margin-right: 1.2rem;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover {
  color: #fff;
  text-decoration: underline;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 2rem;
}

.user-name {
  color: #fff;
  font-weight: 500;
  margin-right: 0.7rem;
  font-size: 1.08rem;
}

.nav-btn {
  background: linear-gradient(90deg, #3a8dde 0%, #6ec6ff 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.5rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(58,141,222,0.12);
  transition: background 0.2s, transform 0.1s;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:hover {
  background: linear-gradient(90deg, #357ab8 0%, #5bb6e6 100%);
  transform: translateY(-2px) scale(1.03);
}
</style>