<template>
  <ion-page>
    <ion-content fullscreen style="--background: #fafafa;">

      <div style="min-height: 100vh; background: linear-gradient(135deg, #fce7f3 0%, #fff1f2 50%, #fafafa 100%); display: flex; align-items: center; justify-content: center; padding: 24px 16px;">

        <div style="width: 100%; max-width: 420px;">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="font-size: 3rem; margin-bottom: 8px;">🌸</div>
            <h1 style="font-family: 'Georgia', serif; font-size: 2.2rem; font-weight: 700; color: #be123c; margin: 0 0 6px;">
              Sakura Tea House
            </h1>
            <p style="color: #9f1239; font-family: 'Georgia', serif; font-size: 0.95rem; letter-spacing: 0.04em; margin: 0;">
              ☕ Sweets, Tea & Comfort Food
            </p>
          </div>

          <!-- Card -->
          <div style="background: white; border-radius: 24px; box-shadow: 0 8px 32px rgba(236, 72, 153, 0.12); padding: 28px 24px; border: 1px solid #fce7f3;">

            <h2 style="font-family: 'Georgia', serif; font-size: 1.3rem; font-weight: 600; color: #1f2937; text-align: center; margin: 0 0 24px;">
              Selamat Datang! 👋
            </h2>

            <!-- Table Number -->
            <div style="margin-bottom: 22px;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">
                Nomor Meja
              </label>
              <div style="display: flex; align-items: center; justify-content: center; gap: 16px; background: #fff1f2; border: 2px solid #fecdd3; border-radius: 16px; padding: 14px;">
                <button
                  @click="tableId > 1 ? tableId-- : null"
                  style="width: 36px; height: 36px; border-radius: 50%; background: white; border: 2px solid #fecdd3; color: #e11d48; font-size: 1.3rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(236,72,153,0.15);"
                >−</button>
                <span style="font-size: 2.5rem; font-weight: 800; color: #be123c; min-width: 60px; text-align: center; font-family: 'Georgia', serif;">
                  {{ tableId }}
                </span>
                <button
                  @click="tableId < 10 ? tableId++ : null"
                  style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(to right, #ec4899, #f43f5e); border: none; color: white; font-size: 1.3rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(236,72,153,0.3);"
                >+</button>
              </div>
            </div>

            <!-- Order Type -->
            <div style="margin-bottom: 22px;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">
                Tipe Pesanan
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button
                  @click="selectType('dine_in')"
                  :style="{
                    padding: '16px 12px',
                    borderRadius: '14px',
                    border: orderType === 'dine_in' ? 'none' : '2px solid #e5e7eb',
                    background: orderType === 'dine_in' ? 'linear-gradient(to bottom right, #ec4899, #f43f5e)' : 'white',
                    color: orderType === 'dine_in' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: orderType === 'dine_in' ? '0 4px 16px rgba(236,72,153,0.35)' : 'none',
                    textAlign: 'center'
                  }"
                >
                  <div style="font-size: 2rem; margin-bottom: 6px;">🍽️</div>
                  <div style="font-weight: 700; font-size: 0.9rem;">Dine In</div>
                </button>

                <button
                  @click="selectType('take_away')"
                  :style="{
                    padding: '16px 12px',
                    borderRadius: '14px',
                    border: orderType === 'take_away' ? 'none' : '2px solid #e5e7eb',
                    background: orderType === 'take_away' ? 'linear-gradient(to bottom right, #ec4899, #f43f5e)' : 'white',
                    color: orderType === 'take_away' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: orderType === 'take_away' ? '0 4px 16px rgba(236,72,153,0.35)' : 'none',
                    textAlign: 'center'
                  }"
                >
                  <div style="font-size: 2rem; margin-bottom: 6px;">🛍️</div>
                  <div style="font-weight: 700; font-size: 0.9rem;">Take Away</div>
                </button>
              </div>
            </div>

            <!-- Guests -->
            <div v-if="orderType === 'dine_in'" style="margin-bottom: 22px;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;">
                Jumlah Tamu
              </label>
              <div style="display: flex; align-items: center; justify-content: center; gap: 20px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 14px; padding: 12px;">
                <button
                  @click="decrementGuests"
                  style="width: 36px; height: 36px; border-radius: 50%; background: white; border: 2px solid #e5e7eb; color: #374151; font-size: 1.2rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                >−</button>
                <span style="font-size: 2rem; font-weight: 800; color: #1f2937; min-width: 40px; text-align: center;">
                  {{ numberOfGuests }}
                </span>
                <button
                  @click="incrementGuests"
                  style="width: 36px; height: 36px; border-radius: 50%; background: #fce7f3; border: none; color: #e11d48; font-size: 1.2rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                >+</button>
              </div>
            </div>

            <!-- Start Button -->
            <button
              @click="startOrdering"
              style="
                width: 100%;
                padding: 16px;
                border-radius: 14px;
                background: linear-gradient(to right, #ec4899, #f43f5e);
                color: white;
                font-weight: 700;
                font-size: 1.05rem;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
                letter-spacing: 0.02em;
              "
            >
              Mulai Pesan →
            </button>
          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { orderStore } from '@/store/order';

const router = useRouter();
const tableId = ref(1);
const orderType = ref<'dine_in' | 'take_away'>('dine_in');
const numberOfGuests = ref(2);

const selectType = (type: 'dine_in' | 'take_away') => {
  orderType.value = type;
};

const incrementGuests = () => {
  if (numberOfGuests.value < 10) numberOfGuests.value++;
};

const decrementGuests = () => {
  if (numberOfGuests.value > 1) numberOfGuests.value--;
};

const startOrdering = () => {
  orderStore.setTable(tableId.value);
  orderStore.setOrderType(orderType.value);
  orderStore.setGuests(numberOfGuests.value);
  router.push('/guest/menu');
};
</script>

<style scoped>
ion-content {
  --background: transparent;
}
</style>