<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login Resto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <h2>Selamat Datang</h2>
        <p>Silakan login untuk melanjutkan</p>

        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" type="email" placeholder="email@example.com" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input v-model="password" type="password" placeholder="******" required></ion-input>
          </ion-item>

          <div class="ion-padding-top">
            <ion-button expand="block" type="submit" :disabled="loading">
              {{ loading ? 'Loading...' : 'Login' }}
            </ion-button>
          </div>
        </form>
      </div>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
        @didDismiss="showToast = false"
        :color="toastColor"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonToast 
} from '@ionic/vue';
import { login } from '@/services/auth';
import api from '@/services/api';

const email = ref('');
const password = ref('');
const loading = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('danger');

const router = useRouter();

const roleRedirectMap: Record<string, string> = {
  owner:     '/owner/dashboard',
  kasir:     '/kasir/dashboard',
  chef:      '/chef/dashboard',
  pramusaji: '/pramusaji/dashboard',
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toastMessage.value = 'Mohon isi email dan password';
    showToast.value = true;
    return;
  }

  loading.value = true;
  try {
    await login(email.value, password.value);
    
    const userResponse = await api.get('/me');
    const role: string = userResponse.data.role;
    
    toastMessage.value = 'Login berhasil!';
    toastColor.value = 'success';
    showToast.value = true;

    const destination = roleRedirectMap[role] ?? '/dashboard';

    setTimeout(() => {
      router.replace(destination);
    }, 1000);

  } catch (error: any) {
    console.error('Login error:', error);
    toastColor.value = 'danger';
    toastMessage.value = error.response?.data?.message || 'Login gagal. Periksa koneksi atau kredensial Anda.';
    showToast.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding-top: 50px;
  text-align: center;
}
</style>