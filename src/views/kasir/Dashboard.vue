<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #0f172a; --color: white;">
        <ion-title style="font-family: 'Georgia', serif; font-size: 1.2rem; color: white;">
          💰 Kasir
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout" style="color: white;">
            <ion-icon :icon="logOutIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f1f5f9;">

      <!-- Header Stats -->
      <div style="background: #0f172a; padding: 16px 20px 28px; margin-bottom: -16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
          <div style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Menunggu Bayar</div>
            <div style="color: #f59e0b; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{{ pendingOrders.length }}</div>
          </div>
          <div style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Siap Dibayar</div>
            <div style="color: #34d399; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{{ readyOrders.length }}</div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div style="padding: 24px 16px 16px;">

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 18px; overflow-x: auto; padding-bottom: 4px;">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="activeFilter = f.value"
            :style="{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeFilter === f.value ? '#0f172a' : 'white',
              color: activeFilter === f.value ? 'white' : '#64748b',
              boxShadow: activeFilter === f.value ? '0 2px 8px rgba(15,23,42,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
              transition: 'all 0.2s'
            }"
          >
            {{ f.label }}
            <span :style="{
              marginLeft: '6px',
              background: activeFilter === f.value ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              color: activeFilter === f.value ? 'white' : '#64748b',
              padding: '1px 7px',
              borderRadius: '10px',
              fontSize: '0.75rem'
            }">{{ getCountByFilter(f.value) }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" style="text-align: center; padding: 60px 0;">
          <ion-spinner name="crescent" style="color: #0f172a;"></ion-spinner>
          <div style="color: #94a3b8; margin-top: 12px; font-size: 0.9rem;">Memuat order...</div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
          <div style="color: #374151; font-weight: 600; font-size: 1rem;">Tidak ada order</div>
          <div style="color: #9ca3af; font-size: 0.875rem; margin-top: 6px;">Semua sudah diproses!</div>
        </div>

        <!-- Order Cards -->
        <div v-else style="display: flex; flex-direction: column; gap: 12px;">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            @click="goToDetail(order.id)"
            style="background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;"
            @mousedown="e => (e.currentTarget as HTMLElement).style.transform='scale(0.98)'"
            @mouseup="e => (e.currentTarget as HTMLElement).style.transform='scale(1)'"
          >
            <!-- Card Top Bar -->
            <div :style="{
              height: '4px',
              background: getStatusColor(order.status)
            }"></div>

            <div style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">
                    Meja {{ order.nomor_meja }}
                  </div>
                  <div style="color: #94a3b8; font-size: 0.78rem; margin-top: 2px;">
                    #{{ order.id }} · {{ formatTime(order.created_at) }}
                  </div>
                </div>
                <span :style="{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background: getStatusBg(order.status),
                  color: getStatusTextColor(order.status),
                }">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #f1f5f9;">
                <div style="color: #64748b; font-size: 0.85rem;">
                  {{ order.items_count || '?' }} item
                </div>
                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">
                  Rp {{ formatPrice(order.total_harga) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pull to refresh -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonSpinner,
  IonRefresher, IonRefresherContent
} from '@ionic/vue';
import { logOut as logOutIcon } from 'ionicons/icons';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { logout as authLogout } from '@/services/auth';

const router = useRouter();
const orders = ref<any[]>([]);
const loading = ref(false);
const activeFilter = ref('all');

const filters = [
  { label: 'Semua', value: 'all' },
  { label: '✅ Siap Bayar', value: 'ready' },
  { label: '⏳ Confirmed', value: 'confirmed' },
];

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'confirmed'));
const readyOrders = computed(() => orders.value.filter(o => o.status === 'ready'));

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value;
  return orders.value.filter(o => o.status === activeFilter.value);
});

const getCountByFilter = (filter: string) => {
  if (filter === 'all') return orders.value.length;
  return orders.value.filter(o => o.status === filter).length;
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    ready: '#34d399',
    confirmed: '#f59e0b',
    paid: '#6366f1',
    cancelled: '#ef4444',
  };
  return map[status] || '#94a3b8';
};

const getStatusBg = (status: string) => {
  const map: Record<string, string> = {
    ready: '#d1fae5',
    confirmed: '#fef3c7',
    paid: '#e0e7ff',
    cancelled: '#fee2e2',
  };
  return map[status] || '#f1f5f9';
};

const getStatusTextColor = (status: string) => {
  const map: Record<string, string> = {
    ready: '#065f46',
    confirmed: '#92400e',
    paid: '#3730a3',
    cancelled: '#991b1b',
  };
  return map[status] || '#374151';
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    ready: 'Siap Bayar',
    confirmed: 'Diproses',
    paid: 'Lunas',
    cancelled: 'Dibatalkan',
  };
  return map[status] || status;
};

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/kasir/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Failed to fetch orders', error);
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async (event: any) => {
  await fetchOrders();
  event.target.complete();
};

const goToDetail = (id: number) => {
  router.push(`/kasir/orders/${id}`);
};

const logout = async () => {
  await authLogout();
  router.replace('/login');
};

// Auto-refresh setiap 15 detik
let refreshInterval: ReturnType<typeof setInterval>;
onMounted(() => {
  fetchOrders();
  refreshInterval = setInterval(fetchOrders, 15000);
});
onUnmounted(() => {
  clearInterval(refreshInterval);
});
</script>