<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="--background: #0f172a; --color: white;">
        <ion-buttons slot="start">
          <ion-button @click="router.back()" style="color: white;">
            <ion-icon :icon="arrowBackIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title style="font-family: 'Georgia', serif; color: white; font-size: 1.1rem;">
          Detail Order
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background: #f1f5f9;">

      <!-- Loading -->
      <div v-if="loading" style="text-align: center; padding: 80px 0;">
        <ion-spinner name="crescent" style="color: #0f172a;"></ion-spinner>
        <div style="color: #94a3b8; margin-top: 12px;">Memuat detail...</div>
      </div>

      <div v-else-if="order">

        <!-- Order Header -->
        <div style="background: #0f172a; padding: 20px; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Nomor Meja</div>
              <div style="color: white; font-size: 2rem; font-weight: 800; font-family: 'Georgia', serif;">{{ order.nomor_meja }}</div>
            </div>
            <div style="text-align: right;">
              <div style="color: #94a3b8; font-size: 0.75rem;">Order #{{ order.id }}</div>
              <span :style="{
                display: 'inline-block',
                marginTop: '6px',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: getStatusBg(order.status),
                color: getStatusTextColor(order.status),
              }">{{ getStatusLabel(order.status) }}</span>
            </div>
          </div>
          <div style="color: #64748b; font-size: 0.82rem; margin-top: 10px;">
            🕐 {{ formatDateTime(order.created_at) }}
          </div>
        </div>

        <!-- Order Items -->
        <div style="margin: 16px; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="padding: 16px 18px; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1rem;">🧾 Item Pesanan</div>
          </div>

          <div v-for="(item, idx) in order.items" :key="item.id">
            <div style="padding: 14px 18px; display: flex; justify-content: space-between; align-items: flex-start;"
                 :style="{ borderBottom: (Number(idx) < order.items.length - 1) ? '1px solid #f8fafc' : 'none' }">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem;">{{ item.nama_menu }}</div>
                <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 2px;">
                  Rp {{ formatPrice(item.harga) }} × {{ item.jumlah }}
                </div>
                <div v-if="item.catatan" style="color: #f59e0b; font-size: 0.78rem; margin-top: 4px; font-style: italic;">
                  📝 {{ item.catatan }}
                </div>
              </div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem; margin-left: 12px;">
                Rp {{ formatPrice(item.harga * item.jumlah) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Price Summary -->
        <div style="margin: 0 16px 16px; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="padding: 16px 18px; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1rem;">💵 Rincian Harga</div>
          </div>
          <div style="padding: 16px 18px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #64748b; font-size: 0.9rem;">Subtotal</span>
              <span style="color: #1e293b; font-weight: 500;">Rp {{ formatPrice(subtotal) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #64748b; font-size: 0.9rem;">Pajak (10%)</span>
              <span style="color: #1e293b; font-weight: 500;">Rp {{ formatPrice(tax) }}</span>
            </div>
            <div style="height: 1px; background: #f1f5f9; margin: 12px 0;"></div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #0f172a; font-weight: 700; font-size: 1rem;">Total</span>
              <span style="color: #0f172a; font-weight: 800; font-size: 1.15rem;">Rp {{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Section (only if status is 'ready' or 'confirmed') -->
        <div v-if="order.status === 'ready' || order.status === 'confirmed'"
             style="margin: 0 16px 16px; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <div style="padding: 16px 18px; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1rem;">💳 Metode Pembayaran</div>
          </div>
          <div style="padding: 16px 18px;">

            <!-- Payment Method Toggle -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
              <button
                @click="paymentMethod = 'cash'"
                :style="{
                  padding: '14px',
                  borderRadius: '12px',
                  border: paymentMethod === 'cash' ? '2px solid #0f172a' : '2px solid #e2e8f0',
                  background: paymentMethod === 'cash' ? '#0f172a' : 'white',
                  color: paymentMethod === 'cash' ? 'white' : '#64748b',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }"
              >
                💵 Cash
              </button>
              <button
                @click="paymentMethod = 'qris'"
                :style="{
                  padding: '14px',
                  borderRadius: '12px',
                  border: paymentMethod === 'qris' ? '2px solid #0f172a' : '2px solid #e2e8f0',
                  background: paymentMethod === 'qris' ? '#0f172a' : 'white',
                  color: paymentMethod === 'qris' ? 'white' : '#64748b',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }"
              >
                📱 QRIS
              </button>
            </div>

            <!-- Cash Input -->
            <div v-if="paymentMethod === 'cash'">
              <div style="color: #374151; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">
                Uang Diterima
              </div>
              <div style="position: relative; margin-bottom: 12px;">
                <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #64748b; font-weight: 600; font-size: 0.9rem;">Rp</span>
                <input
                  v-model.number="cashReceived"
                  type="number"
                  placeholder="0"
                  style="
                    width: 100%;
                    padding: 13px 14px 13px 40px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #0f172a;
                    outline: none;
                    box-sizing: border-box;
                    background: #f8fafc;
                  "
                  @focus="e => (e.target as HTMLElement).style.borderColor = '#0f172a'"
                  @blur="e => (e.target as HTMLElement).style.borderColor = '#e2e8f0'"
                />
              </div>

              <!-- Quick Amount Buttons -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px;">
                <button
                  v-for="amount in quickAmounts"
                  :key="amount"
                  @click="cashReceived = amount"
                  style="
                    padding: 8px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #f8fafc;
                    color: #374151;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                  "
                >
                  {{ formatPrice(amount) }}
                </button>
              </div>

              <!-- Kembalian -->
              <div v-if="cashReceived > 0" :style="{
                padding: '14px',
                borderRadius: '10px',
                background: change >= 0 ? '#d1fae5' : '#fee2e2',
                border: `1px solid ${change >= 0 ? '#6ee7b7' : '#fca5a5'}`
              }">
                <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
                  <span :style="{ fontWeight: '600', color: change >= 0 ? '#065f46' : '#991b1b', fontSize: '0.9rem' }">
                    {{ change >= 0 ? '✅ Kembalian' : '❌ Kurang' }}
                  </span>
                  <span :style="{ fontWeight: '800', fontSize: '1.05rem', color: change >= 0 ? '#065f46' : '#991b1b' }">
                    Rp {{ formatPrice(Math.abs(change)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- QRIS Info -->
            <div v-if="paymentMethod === 'qris'"
                 style="background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; border: 2px dashed #e2e8f0;">
              <div style="font-size: 2.5rem; margin-bottom: 8px;">📱</div>
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">QRIS / E-Wallet</div>
              <div style="color: #64748b; font-size: 0.85rem;">Arahkan pelanggan untuk scan QR code</div>
              <div style="margin-top: 12px; padding: 10px 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div style="color: #0f172a; font-weight: 800; font-size: 1.1rem;">Rp {{ formatPrice(total) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Payment Button -->
        <div v-if="order.status === 'ready' || order.status === 'confirmed'"
             style="margin: 0 16px 32px;">
          <button
            @click="processPayment"
            :disabled="processingPayment || (paymentMethod === 'cash' && (cashReceived < total))"
            :style="{
              width: '100%',
              padding: '18px',
              background: canPay ? '#0f172a' : '#e2e8f0',
              color: canPay ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: canPay ? 'pointer' : 'not-allowed',
              letterSpacing: '0.02em',
              transition: 'all 0.2s',
              boxShadow: canPay ? '0 4px 16px rgba(15,23,42,0.3)' : 'none'
            }"
          >
            <span v-if="processingPayment">⏳ Memproses...</span>
            <span v-else>✅ Proses Pembayaran · Rp {{ formatPrice(total) }}</span>
          </button>
        </div>

        <!-- Already Paid -->
        <div v-if="order.status === 'paid'"
             style="margin: 0 16px 32px; padding: 20px; background: #d1fae5; border-radius: 14px; text-align: center; border: 2px solid #6ee7b7;">
          <div style="font-size: 2rem; margin-bottom: 8px;">✅</div>
          <div style="font-weight: 700; color: #065f46; font-size: 1rem;">Pembayaran Lunas</div>
          <div style="color: #059669; font-size: 0.85rem; margin-top: 4px;">Order ini sudah selesai</div>
        </div>

        <!-- Cancelled -->
        <div v-if="order.status === 'cancelled'"
             style="margin: 0 16px 32px; padding: 20px; background: #fee2e2; border-radius: 14px; text-align: center; border: 2px solid #fca5a5;">
          <div style="font-size: 2rem; margin-bottom: 8px;">❌</div>
          <div style="font-weight: 700; color: #991b1b; font-size: 1rem;">Order Dibatalkan</div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonSpinner,
  toastController, alertController
} from '@ionic/vue';
import { arrowBack as arrowBackIcon } from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();

const orderId = route.params.id;
const order = ref<any>(null);
const loading = ref(false);
const processingPayment = ref(false);
const paymentMethod = ref<'cash' | 'qris'>('cash');
const cashReceived = ref(0);

const subtotal = computed(() => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce((sum: number, item: any) => sum + (item.harga * item.jumlah), 0);
});

const tax = computed(() => Math.round(subtotal.value * 0.1));
const total = computed(() => subtotal.value + tax.value);
const change = computed(() => cashReceived.value - total.value);

const canPay = computed(() => {
  if (processingPayment.value) return false;
  if (paymentMethod.value === 'cash') return cashReceived.value >= total.value;
  return true; // QRIS always enabled
});

// Quick amount suggestions based on total
const quickAmounts = computed(() => {
  const t = total.value;
  const round = (n: number) => Math.ceil(n / 1000) * 1000;
  return [
    round(t),
    round(t / 1000) * 1000 + 10000,
    round(t / 1000) * 1000 + 50000,
  ].filter((v, i, arr) => arr.indexOf(v) === i);
});

const getStatusBg = (status: string) => {
  const map: Record<string, string> = {
    ready: '#d1fae5', confirmed: '#fef3c7', paid: '#e0e7ff', cancelled: '#fee2e2',
  };
  return map[status] || '#f1f5f9';
};

const getStatusTextColor = (status: string) => {
  const map: Record<string, string> = {
    ready: '#065f46', confirmed: '#92400e', paid: '#3730a3', cancelled: '#991b1b',
  };
  return map[status] || '#374151';
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    ready: 'Siap Bayar', confirmed: 'Diproses', paid: 'Lunas', cancelled: 'Dibatalkan',
  };
  return map[status] || status;
};

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const fetchOrder = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/kasir/orders/${orderId}`);
    order.value = response.data;
  } catch (error) {
    console.error('Failed to fetch order', error);
  } finally {
    loading.value = false;
  }
};

const processPayment = async () => {
  const alert = await alertController.create({
    header: 'Konfirmasi Pembayaran',
    message: `Total: Rp ${formatPrice(total.value)}\nMetode: ${paymentMethod.value === 'cash' ? 'Cash' : 'QRIS'}`,
    buttons: [
      { text: 'Batal', role: 'cancel' },
      {
        text: 'Konfirmasi',
        handler: async () => {
          processingPayment.value = true;
          try {
            await api.post(`/kasir/orders/${orderId}/payment`, {
              metode_pembayaran: paymentMethod.value,
              jumlah_bayar: paymentMethod.value === 'cash' ? cashReceived.value : total.value,
              total_harga: total.value,
              kembalian: paymentMethod.value === 'cash' ? change.value : 0,
            });

            const toast = await toastController.create({
              message: '✅ Pembayaran berhasil diproses!',
              duration: 2500,
              color: 'success',
              position: 'top'
            });
            await toast.present();

            // Refresh order data
            await fetchOrder();
          } catch (error: any) {
            const toast = await toastController.create({
              message: error.response?.data?.message || 'Gagal memproses pembayaran',
              duration: 3000,
              color: 'danger',
              position: 'top'
            });
            await toast.present();
          } finally {
            processingPayment.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
};

onMounted(() => {
  fetchOrder();
});
</script>