<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleLogout">
            Logout
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="user">
        <h2>Hello, {{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Status</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            Anda berhasil login.
          </ion-card-content>
        </ion-card>
      </div>
      <div v-else>
        <p>Loading user data...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/vue';
import { getMe, logout } from '@/services/auth';

const user = ref<any>(null);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await getMe();
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user', error);
    // If failed to get user (e.g. 401), redirect to login
    router.replace('/login');
  }
});

const handleLogout = async () => {
  await logout();
  router.replace('/login');
};
</script>
