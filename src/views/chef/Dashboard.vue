<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #111827; --color: white;">
        <ion-title style="font-family: 'Georgia', serif; color: white; font-size: 1.2rem;">
          👨‍🍳 Dapur
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout" style="color: #9ca3af;">
            <ion-icon :icon="logOutIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #0f172a;">

      <!-- Tab Navigation -->
      <div style="display: flex; background: #1e293b; border-bottom: 1px solid #334155;">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :style="{
            flex: 1,
            padding: '14px 8px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === tab.id ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === tab.id ? '#f97316' : '#64748b',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.03em'
          }"
        >
          {{ tab.icon }} {{ tab.name }}
          <span v-if="tab.id === 'orders' && pendingOrdersCount > 0"
            style="margin-left: 6px; background: #ef4444; color: white; padding: 2px 7px; border-radius: 10px; font-size: 0.75rem;">
            {{ pendingOrdersCount }}
          </span>
        </button>
      </div>

      <!-- ─── TAB: STOK HARIAN ─────────────────────────── -->
      <div v-if="activeTab === 'stok'" style="padding: 16px;">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="color: white; font-size: 1.1rem; font-weight: 700;">Stok Hari Ini</div>
            <div style="color: #64748b; font-size: 0.8rem; margin-top: 2px;">{{ todayDate }}</div>
          </div>
          <button
            @click="saveAllStock"
            :disabled="savingStock"
            style="background: #f97316; color: white; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.875rem; cursor: pointer;"
          >
            {{ savingStock ? 'Menyimpan...' : '💾 Simpan Semua' }}
          </button>
        </div>

        <div v-if="loadingMenus" style="text-align: center; padding: 60px 0;">
          <ion-spinner style="color: #f97316;"></ion-spinner>
          <div style="color: #64748b; margin-top: 12px; font-size: 0.875rem;">Memuat menu...</div>
        </div>

        <div v-else>
          <div v-for="kategori in menuKategori" :key="kategori.id" style="margin-bottom: 24px;">
            <div style="color: #f97316; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; padding-left: 4px;">
              {{ kategori.nama_kategori }}
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div
                v-for="menu in kategori.menus"
                :key="menu.id"
                style="background: #1e293b; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;"
              >
                <div style="flex: 1;">
                  <div style="color: white; font-weight: 600; font-size: 0.95rem;">{{ menu.nama_menu }}</div>
                  <div style="color: #64748b; font-size: 0.8rem; margin-top: 2px;">Rp {{ formatPrice(menu.harga) }}</div>
                </div>

                <!-- Stock Counter -->
                <div style="display: flex; align-items: center; gap: 10px;">
                  <button
                    @click="decrementStock(menu)"
                    style="width: 32px; height: 32px; border-radius: 8px; background: #334155; color: white; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                  >−</button>
                  <span style="color: white; font-weight: 800; font-size: 1.2rem; min-width: 32px; text-align: center;">
                    {{ stockDraft[menu.id] ?? 0 }}
                  </span>
                  <button
                    @click="incrementStock(menu)"
                    style="width: 32px; height: 32px; border-radius: 8px; background: #f97316; color: white; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── TAB: ANTRIAN ORDER ──────────────────────── -->
      <div v-if="activeTab === 'orders'" style="padding: 16px;">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="color: white; font-size: 1.1rem; font-weight: 700;">Antrian Masak</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div :style="{
              width: '8px', height: '8px', borderRadius: '50%',
              background: isPolling ? '#34d399' : '#64748b',
              boxShadow: isPolling ? '0 0 6px #34d399' : 'none'
            }"></div>
            <span style="color: #64748b; font-size: 0.78rem;">Live</span>
          </div>
        </div>

        <div v-if="loadingOrders" style="text-align: center; padding: 60px 0;">
          <ion-spinner style="color: #f97316;"></ion-spinner>
          <div style="color: #64748b; margin-top: 12px; font-size: 0.875rem;">Memuat order...</div>
        </div>

        <div v-else-if="orders.length === 0" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">✅</div>
          <div style="color: white; font-weight: 600;">Semua order selesai!</div>
          <div style="color: #64748b; font-size: 0.875rem; margin-top: 6px;">Tidak ada antrian saat ini</div>
        </div>

        <div v-else style="display: flex; flex-direction: column; gap: 14px;">
          <div
            v-for="order in orders"
            :key="order.id"
            style="background: #1e293b; border-radius: 14px; overflow: hidden; border: 1px solid #334155;"
          >
            <!-- Order Header -->
            <div :style="{
              padding: '12px 16px',
              background: getStatusBg(order.status),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }">
              <div>
                <span style="font-weight: 800; font-size: 1rem; color: white;">
                  Meja {{ order.nomor_meja }}
                </span>
                <span style="color: rgba(255,255,255,0.7); font-size: 0.8rem; margin-left: 10px;">
                  #{{ order.id }}
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: rgba(0,0,0,0.25); color: white; padding: 3px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700;">
                  {{ getStatusLabel(order.status) }}
                </span>
                <span style="color: rgba(255,255,255,0.6); font-size: 0.75rem;">
                  {{ formatTime(order.waktu_pesan) }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div style="padding: 12px 16px;">
              <div
                v-for="item in order.items"
                :key="item.id"
                style="display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid #0f172a;"
              >
                <div>
                  <span style="color: white; font-weight: 600; font-size: 0.9rem;">{{ item.nama_menu }}</span>
                  <div v-if="item.catatan" style="color: #f59e0b; font-size: 0.78rem; margin-top: 2px; font-style: italic;">
                    📝 {{ item.catatan }}
                  </div>
                </div>
                <span style="background: #334155; color: #e2e8f0; padding: 2px 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; margin-left: 12px;">
                  ×{{ item.jumlah }}
                </span>
              </div>
            </div>

            <!-- Action Button -->
            <div style="padding: 12px 16px; padding-top: 4px;">
              <button
                v-if="order.status === 'confirmed'"
                @click="updateStatus(order.id, 'preparing')"
                :disabled="updatingId === order.id"
                style="width: 100%; padding: 12px; background: #f97316; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer;"
              >
                {{ updatingId === order.id ? '⏳ Memproses...' : '🔥 Mulai Masak' }}
              </button>
              <button
                v-else-if="order.status === 'preparing'"
                @click="updateStatus(order.id, 'ready')"
                :disabled="updatingId === order.id"
                style="width: 100%; padding: 12px; background: #22c55e; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer;"
              >
                {{ updatingId === order.id ? '⏳ Memproses...' : '✅ Selesai Dimasak' }}
              </button>
              <div
                v-else-if="order.status === 'ready'"
                style="text-align: center; color: #34d399; font-weight: 700; font-size: 0.875rem; padding: 8px;"
              >
                ✅ Siap disajikan — menunggu kasir
              </div>
            </div>
          </div>
        </div>
      </div>

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
  IonRefresher, IonRefresherContent,
  toastController
} from '@ionic/vue';
import { logOut as logOutIcon } from 'ionicons/icons';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { logout as authLogout } from '@/services/auth';

const router = useRouter();
const activeTab = ref('orders');

const tabs = [
  { id: 'orders', name: 'Antrian', icon: '🍳' },
  { id: 'stok',   name: 'Stok Hari Ini', icon: '📦' },
];

// ─── STOK ────────────────────────────────────────────────
const menuKategori = ref<any[]>([]);
const stockDraft = ref<Record<number, number>>({});
const loadingMenus = ref(false);
const savingStock = ref(false);

const todayDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

const fetchMenusWithStock = async () => {
  loadingMenus.value = true;
  try {
    const response = await api.get('/chef/menus-stock');
    menuKategori.value = response.data;

    // Populate draft dari stok yang sudah ada
    response.data.forEach((kategori: any) => {
      kategori.menus.forEach((menu: any) => {
        stockDraft.value[menu.id] = menu.stok_hari_ini ?? 0;
      });
    });
  } catch (error) {
    console.error('Failed to fetch menus', error);
  } finally {
    loadingMenus.value = false;
  }
};

const incrementStock = (menu: any) => {
  stockDraft.value[menu.id] = (stockDraft.value[menu.id] ?? 0) + 1;
};

const decrementStock = (menu: any) => {
  if ((stockDraft.value[menu.id] ?? 0) > 0) {
    stockDraft.value[menu.id]--;
  }
};

const saveAllStock = async () => {
  savingStock.value = true;
  try {
    const payload = Object.entries(stockDraft.value).map(([menu_id, stok]) => ({
      menu_id: Number(menu_id),
      stok: Number(stok)
    }));

    await api.post('/chef/stock/bulk', { items: payload });

    const toast = await toastController.create({
      message: '✅ Stok berhasil disimpan!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Gagal menyimpan stok',
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  } finally {
    savingStock.value = false;
  }
};

// ─── ORDERS ──────────────────────────────────────────────
const orders = ref<any[]>([]);
const loadingOrders = ref(false);
const updatingId = ref<number | null>(null);
const isPolling = ref(false);

const pendingOrdersCount = computed(() =>
  orders.value.filter(o => o.status === 'confirmed' || o.status === 'preparing').length
);

const fetchOrders = async () => {
  isPolling.value = true;
  try {
    const response = await api.get('/chef/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Failed to fetch orders', error);
  } finally {
    loadingOrders.value = false;
    isPolling.value = false;
  }
};

const updateStatus = async (orderId: number, status: string) => {
  updatingId.value = orderId;
  try {
    await api.patch(`/chef/orders/${orderId}/status`, { status });
    await fetchOrders();

    const label = status === 'preparing' ? '🔥 Mulai dimasak!' : '✅ Order siap disajikan!';
    const toast = await toastController.create({
      message: label,
      duration: 2000,
      color: status === 'ready' ? 'success' : 'warning',
      position: 'top'
    });
    await toast.present();
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Gagal update status',
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  } finally {
    updatingId.value = null;
  }
};

// ─── HELPERS ─────────────────────────────────────────────
const getStatusBg = (status: string) => {
  const map: Record<string, string> = {
    confirmed: '#b45309',
    preparing: '#b45309',
    ready:     '#15803d',
  };
  return map[status] || '#334155';
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    confirmed: 'Baru Masuk',
    preparing: 'Sedang Dimasak',
    ready:     'Siap Saji',
  };
  return map[status] || status;
};

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const handleRefresh = async (event: any) => {
  await Promise.all([fetchOrders(), fetchMenusWithStock()]);
  event.target.complete();
};

const logout = async () => {
  await authLogout();
  router.replace('/login');
};

// Polling setiap 10 detik
let pollInterval: ReturnType<typeof setInterval>;
onMounted(() => {
  loadingOrders.value = true;
  fetchOrders();
  fetchMenusWithStock();
  pollInterval = setInterval(fetchOrders, 10000);
});
onUnmounted(() => clearInterval(pollInterval));
</script>