<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar style="--background: linear-gradient(to right, #ec4899, #f43f5e);">
        <ion-title style="font-family: 'Georgia', serif; font-size: 1.25rem; font-weight: 600;">
          Menu
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="goToCart" style="position: relative;">
            <ion-icon :icon="cartIcon" style="font-size: 1.5rem;"></ion-icon>
            <ion-badge 
              v-if="cartCount > 0" 
              color="danger" 
              style="position: absolute; top: 8px; right: 8px; min-width: 18px; height: 18px; font-size: 0.75rem;"
            >
              {{ cartCount }}
            </ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" style="--background: #fafafa;">
      <div v-if="loading" class="flex justify-center items-center" style="height: 100vh;">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
      </div>

      <div v-else style="padding-bottom: 100px;">
        <!-- Categories Tabs -->
        <div style="position: sticky; top: 0; z-index: 10; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow-x: auto; white-space: nowrap; padding: 16px 12px;">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="scrollToCategory(cat.id)"
            :style="{
              padding: '10px 20px',
              margin: '0 6px',
              borderRadius: '20px',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: 'system-ui, -apple-system',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeCategory === cat.id ? 'linear-gradient(to right, #ec4899, #f43f5e)' : '#f3f4f6',
              color: activeCategory === cat.id ? 'white' : '#6b7280',
              boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none'
            }"
          >
            {{ cat.nama }}
          </button>
        </div>

        <!-- Menu Items -->
        <div style="padding: 20px 16px;">
          <div v-for="cat in categories" :key="cat.id" :id="'cat-' + cat.id" style="margin-bottom: 40px;">
            <h2 style="font-size: 1.75rem; font-weight: 700; color: #1f2937; margin-bottom: 20px; font-family: 'Georgia', serif;">
              {{ cat.nama }}
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
              <div 
                v-for="menu in cat.menus" 
                :key="menu.id" 
                style="background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;"
                @mouseover="($event.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; ($event.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';"
                @mouseleave="($event.currentTarget as HTMLElement).style.transform = 'translateY(0)'; ($event.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';"
              >
                <div style="height: 160px; background: linear-gradient(135deg, #fce7f3, #fbcfe8); position: relative; overflow: hidden;">
                   <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
                     🍰
                   </div>
                   <div 
                     v-if="!menu.tersedia" 
                     style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;"
                   >
                     <span style="color: white; font-weight: 700; transform: rotate(-12deg); border: 3px solid white; padding: 6px 16px; font-size: 1.1rem; letter-spacing: 0.05em;">
                       SOLD OUT
                     </span>
                   </div>
                </div>
                <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: #1f2937; margin-bottom: 8px; font-family: system-ui;">
                      {{ menu.nama }}
                    </h3>
                    <p style="color: #ec4899; font-weight: 700; font-size: 1.15rem;">
                      Rp {{ formatPrice(menu.harga) }}
                    </p>
                    <p v-if="menu.tersedia" style="color: #10b981; font-size: 0.85rem; margin-top: 6px;">
                      ✓ Available ({{ menu.stok }} left)
                    </p>
                  </div>
                  <button 
                    @click="addToCart(menu)"
                    :disabled="!menu.tersedia"
                    :style="{
                      marginTop: '16px',
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: menu.tersedia ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      background: menu.tersedia ? 'linear-gradient(to right, #ec4899, #f43f5e)' : '#e5e7eb',
                      color: menu.tersedia ? 'white' : '#9ca3af',
                      boxShadow: menu.tersedia ? '0 4px 12px rgba(236, 72, 153, 0.25)' : 'none'
                    }"
                  >
                    {{ menu.tersedia ? 'Add to Cart +' : 'Unavailable' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Cart FAB -->
      <div 
        v-if="cartCount > 0" 
        style="position: fixed; bottom: 20px; left: 16px; right: 16px; z-index: 20;"
      >
        <button 
          @click="goToCart" 
          style="
            width: 100%;
            background: linear-gradient(to right, #ec4899, #f43f5e);
            color: white;
            padding: 18px 24px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.15rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
          "
          @mouseover="($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; ($event.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(236, 72, 153, 0.5)';"
          @mouseleave="($event.currentTarget as HTMLElement).style.transform = 'translateY(0)'; ($event.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(236, 72, 153, 0.4)';"
        >
          <span>🛒 {{ cartCount }} Items</span>
          <span>View Cart →</span>
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBadge, IonSpinner } from '@ionic/vue';
import { cart as cartIcon } from 'ionicons/icons';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { orderStore } from '@/store/order';

const router = useRouter();
const categories = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref<number | null>(null);

const cartCount = computed(() => {
  return orderStore.cart.reduce((sum: number, item: any) => sum + item.qty, 0);
});

const fetchMenu = async () => {
  try {
    const response = await api.get('/menu');
    categories.value = response.data;
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id;
    }
  } catch (error) {
    console.error('Failed to fetch menu', error);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const addToCart = (menu: any) => {
  orderStore.addToCart(menu);
};

const goToCart = () => {
  router.push('/guest/cart');
};

const scrollToCategory = (id: number) => {
  activeCategory.value = id;
  const element = document.getElementById('cat-' + id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  fetchMenu();
});
</script>