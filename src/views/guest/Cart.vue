<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar style="--background: linear-gradient(to right, #ec4899, #f43f5e);">
        <ion-buttons slot="start">
          <ion-button @click="goBack" style="color: white; font-weight: 600;">
            ← Menu
          </ion-button>
        </ion-buttons>
        <ion-title style="font-family: 'Georgia', serif; font-size: 1.2rem; color: white; font-weight: 600;">
          Pesananmu
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" style="--background: #fafafa;">

      <!-- Empty State -->
      <div v-if="orderStore.cart.length === 0"
           style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; text-align: center; padding: 24px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🛒</div>
        <h2 style="font-family: 'Georgia', serif; font-size: 1.4rem; font-weight: 700; color: #1f2937; margin: 0 0 8px;">
          Keranjang kosong
        </h2>
        <p style="color: #9ca3af; font-size: 0.9rem; margin: 0 0 24px;">
          Belum ada yang ditambahkan ke pesanan
        </p>
        <button
          @click="goBack"
          style="padding: 12px 28px; background: linear-gradient(to right, #ec4899, #f43f5e); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 12px rgba(236,72,153,0.3);"
        >
          Lihat Menu
        </button>
      </div>

      <div v-else style="padding: 16px 16px 140px;">

        <!-- Order Info Banner -->
        <div style="background: linear-gradient(to right, #fff1f2, #fce7f3); border: 1px solid #fecdd3; border-radius: 14px; padding: 14px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #9f1239; text-transform: uppercase; letter-spacing: 0.06em;">Meja</div>
            <div style="font-family: 'Georgia', serif; font-size: 1.4rem; font-weight: 800; color: #be123c;">#{{ orderStore.tableId }}</div>
          </div>
          <div style="width: 1px; height: 36px; background: #fecdd3;"></div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #9f1239; text-transform: uppercase; letter-spacing: 0.06em;">Tipe</div>
            <div style="font-weight: 700; color: #be123c; font-size: 0.95rem;">
              {{ orderStore.orderType === 'dine_in' ? '🍽️ Dine In' : '🛍️ Take Away' }}
            </div>
          </div>
        </div>

        <!-- Cart Items -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          <div
            v-for="(item, index) in orderStore.cart"
            :key="index"
            style="background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;"
          >
            <!-- Pink top accent -->
            <div style="height: 3px; background: linear-gradient(to right, #ec4899, #f43f5e);"></div>

            <div style="padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">

                <!-- Item Info -->
                <div style="flex: 1;">
                  <h3 style="font-weight: 700; color: #1f2937; font-size: 1rem; margin: 0 0 4px;">
                    {{ item.nama }}
                  </h3>
                  <p style="color: #ec4899; font-weight: 700; font-size: 0.9rem; margin: 0 0 10px;">
                    Rp {{ formatPrice(item.harga) }} / item
                  </p>
                  <!-- Notes Input -->
                  <input
                    v-model="item.notes"
                    placeholder="Catatan (misal: less sugar)..."
                    style="
                      width: 100%;
                      font-size: 0.82rem;
                      background: #fafafa;
                      border: 1px solid #e5e7eb;
                      border-radius: 8px;
                      padding: 8px 10px;
                      outline: none;
                      color: #374151;
                      box-sizing: border-box;
                    "
                    @focus="(e) => (e.target as HTMLInputElement).style.borderColor = '#ec4899'"
                    @blur="(e) => (e.target as HTMLInputElement).style.borderColor = '#e5e7eb'"
                  />
                </div>

                <!-- Qty Controls -->
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; background: #f9fafb; border-radius: 10px; padding: 4px 8px; border: 1px solid #e5e7eb;">
                    <button
                      @click="decrement(index)"
                      style="width: 28px; height: 28px; border-radius: 6px; background: white; border: 1px solid #e5e7eb; color: #374151; font-weight: 700; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;"
                    >−</button>
                    <span style="font-weight: 800; color: #1f2937; font-size: 1rem; min-width: 20px; text-align: center;">
                      {{ item.qty }}
                    </span>
                    <button
                      @click="increment(index)"
                      style="width: 28px; height: 28px; border-radius: 6px; background: linear-gradient(to right, #ec4899, #f43f5e); border: none; color: white; font-weight: 700; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;"
                    >+</button>
                  </div>
                  <div style="font-weight: 800; color: #1f2937; font-size: 0.95rem;">
                    Rp {{ formatPrice(item.harga * item.qty) }}
                  </div>
                  <button
                    @click="remove(index)"
                    style="font-size: 0.75rem; color: #f43f5e; background: none; border: none; cursor: pointer; font-weight: 600; padding: 0;"
                  >
                    🗑 Hapus
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Price Summary -->
        <div style="background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <div style="height: 3px; background: linear-gradient(to right, #ec4899, #f43f5e);"></div>
          <div style="padding: 16px 18px;">
            <div style="font-family: 'Georgia', serif; font-weight: 700; color: #1f2937; font-size: 1rem; margin-bottom: 14px;">
              Rincian Harga
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 0.9rem;">Subtotal ({{ totalItems }} item)</span>
              <span style="color: #1f2937; font-weight: 500;">Rp {{ formatPrice(orderStore.total) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 0.9rem;">Service Charge</span>
              <span style="color: #1f2937; font-weight: 500;">Rp 0</span>
            </div>
            <div style="height: 1px; background: #f3f4f6; margin-bottom: 12px;"></div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 700; color: #1f2937; font-size: 1rem;">Total</span>
              <span style="font-weight: 800; color: #ec4899; font-size: 1.15rem;">Rp {{ formatPrice(orderStore.total) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Place Order Button -->
      <div
        v-if="orderStore.cart.length > 0"
        style="position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: white; border-top: 1px solid #f3f4f6; box-shadow: 0 -4px 16px rgba(0,0,0,0.08); z-index: 20;"
      >
        <button
          @click="placeOrder"
          :disabled="submitting"
          :style="{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            background: submitting ? '#e5e7eb' : 'linear-gradient(to right, #ec4899, #f43f5e)',
            color: submitting ? '#9ca3af' : 'white',
            border: 'none',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: submitting ? 'none' : '0 4px 16px rgba(236,72,153,0.35)',
            transition: 'all 0.2s'
          }"
        >
          <span v-if="!submitting">🛒 Pesan Sekarang · Rp {{ formatPrice(orderStore.total) }}</span>
          <span v-else>⏳ Memproses...</span>
        </button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, toastController, alertController
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { orderStore } from '@/store/order';
import api from '@/services/api';

const router = useRouter();
const submitting = ref(false);

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);
const goBack = () => router.back();

const totalItems = computed(() =>
  orderStore.cart.reduce((sum, item) => sum + item.qty, 0)
);

const increment = (index: number) => {
  orderStore.cart[index].qty++;
};

const decrement = (index: number) => {
  if (orderStore.cart[index].qty > 1) {
    orderStore.cart[index].qty--;
  } else {
    remove(index);
  }
};

const remove = async (index: number) => {
  const alert = await alertController.create({
    header: 'Hapus item?',
    message: 'Yakin ingin menghapus item ini?',
    buttons: [
      { text: 'Batal', role: 'cancel' },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: () => orderStore.removeFromCart(index)
      }
    ]
  });
  await alert.present();
};

const placeOrder = async () => {
  if (orderStore.cart.length === 0) return;

  submitting.value = true;
  try {
    const mejaResponse = await api.get(`/meja/by-nomor/${orderStore.tableId}`);
    const mejaId = mejaResponse.data.id;

    const payload = {
      meja_id: mejaId,
      jenis_pesanan: orderStore.orderType,
      items: orderStore.cart.map(item => ({
        menu_id: item.menu_id,
        qty: item.qty,
        notes: item.notes
      }))
    };

    const response = await api.post('/orders', payload);

    const toast = await toastController.create({
      message: `✅ Pesanan berhasil! Silakan tunggu ya 😊`,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();

    orderStore.clearCart();
    router.push('/guest/welcome');
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.',
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  } finally {
    submitting.value = false;
  }
};
</script>