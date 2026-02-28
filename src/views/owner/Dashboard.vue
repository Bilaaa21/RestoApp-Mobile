<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="owner-toolbar">
        <ion-title style="font-family: 'Georgia', serif; font-size: 1.25rem; color: white;">Owner Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            <ion-icon :icon="logOutIcon" style="color: white;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Tabs -->
      <div style="display: flex; border-bottom: 2px solid #e5e7eb; background: white;">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :style="{
            flex: 1,
            padding: '16px',
            background: activeTab === tab.id ? '#7c3aed' : 'white',
            color: activeTab === tab.id ? '#ffffff' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === tab.id ? '3px solid #5b21b6' : 'none',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Menu Management Tab -->
      <div v-if="activeTab === 'menus'" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">Manage Menus</h2>
          <button
            @click="openMenuModal()"
            style="
              background: linear-gradient(to right, #7c3aed, #a855f7);
              color: #ffffff;
              padding: 10px 20px;
              border-radius: 8px;
              border: none;
              font-weight: 600;
              cursor: pointer;
              font-size: 0.9rem;
              box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
            "
          >
            + Add Menu
          </button>
        </div>

        <div v-if="loadingMenus" style="text-align: center; padding: 40px;">
          <ion-spinner></ion-spinner>
        </div>

        <table v-else style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <thead style="background: #7c3aed;">
            <tr>
              <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: #ffffff; font-size: 0.875rem;">Name</th>
              <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: #ffffff; font-size: 0.875rem;">Category</th>
              <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: #ffffff; font-size: 0.875rem;">Price</th>
              <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: #ffffff; font-size: 0.875rem;">Status</th>
              <th style="padding: 14px 12px; text-align: center; font-weight: 600; color: #ffffff; font-size: 0.875rem;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menu in menus" :key="menu.id" style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 13px 12px; color: #1f2937; font-weight: 500;">{{ menu.nama_menu }}</td>
              <td style="padding: 13px 12px; color: #4b5563;">{{ menu.kategori_nama }}</td>
              <td style="padding: 13px 12px; color: #1f2937; font-weight: 500;">Rp {{ formatPrice(menu.harga) }}</td>
              <td style="padding: 13px 12px;">
                <span :style="{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  background: menu.aktif ? '#065f46' : '#991b1b',
                  color: '#ffffff',
                  display: 'inline-block'
                }">
                  {{ menu.aktif ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td style="padding: 13px 12px; text-align: center;">
                <button
                  @click="openMenuModal(menu)"
                  style="margin: 0 4px; padding: 6px 14px; background: #7c3aed; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;"
                >
                  Edit
                </button>
                <button
                  @click="deleteMenu(menu.id)"
                  style="margin: 0 4px; padding: 6px 14px; background: #dc2626; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Categories Management Tab -->
      <div v-if="activeTab === 'categories'" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">Manage Categories</h2>
          <button
            @click="openCategoryModal()"
            style="
              background: linear-gradient(to right, #7c3aed, #a855f7);
              color: #ffffff;
              padding: 10px 20px;
              border-radius: 8px;
              border: none;
              font-weight: 600;
              cursor: pointer;
              font-size: 0.9rem;
              box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
            "
          >
            + Add Category
          </button>
        </div>

        <div v-if="loadingCategories" style="text-align: center; padding: 40px;">
          <ion-spinner></ion-spinner>
        </div>

        <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
          <div
            v-for="cat in categories"
            :key="cat.id"
            style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #7c3aed;"
          >
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 14px; color: #1f2937;">{{ cat.nama_kategori }}</h3>
            <div style="display: flex; gap: 8px;">
              <button
                @click="openCategoryModal(cat)"
                style="flex: 1; padding: 8px; background: #7c3aed; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.875rem;"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(cat.id)"
                style="flex: 1; padding: 8px; background: #dc2626; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.875rem;"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Modal -->
      <ion-modal :is-open="showMenuModal" @did-dismiss="showMenuModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingMenu ? 'Edit Menu' : 'Add Menu' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showMenuModal = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Menu Name</ion-label>
            <ion-input v-model="menuForm.nama_menu" placeholder="Enter menu name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Category</ion-label>
            <ion-select v-model="menuForm.kategori_id" placeholder="Select category">
              <ion-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.nama_kategori }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Price (Rp)</ion-label>
            <ion-input v-model.number="menuForm.harga" type="number" placeholder="0"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Active</ion-label>
            <ion-toggle v-model="menuForm.aktif"></ion-toggle>
          </ion-item>

          <ion-button expand="block" @click="saveMenu" style="margin-top: 20px;">
            {{ editingMenu ? 'Update' : 'Save' }} Menu
          </ion-button>
        </ion-content>
      </ion-modal>

      <!-- Category Modal -->
      <ion-modal :is-open="showCategoryModal" @did-dismiss="showCategoryModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingCategory ? 'Edit Category' : 'Add Category' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCategoryModal = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Category Name</ion-label>
            <ion-input v-model="categoryForm.nama_kategori" placeholder="Enter category name"></ion-input>
          </ion-item>

          <ion-button expand="block" @click="saveCategory" style="margin-top: 20px;">
            {{ editingCategory ? 'Update' : 'Save' }} Category
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonSpinner, IonModal, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonToggle, alertController, toastController
} from '@ionic/vue';
import { logOut as logOutIcon } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { logout as authLogout } from '@/services/auth';

const router = useRouter();

const activeTab = ref('menus');
const tabs = [
  { id: 'menus', name: 'Menus' },
  { id: 'categories', name: 'Categories' }
];

// Menus
const menus = ref<any[]>([]);
const loadingMenus = ref(false);
const showMenuModal = ref(false);
const editingMenu = ref<any>(null);
const menuForm = ref({
  nama_menu: '',
  kategori_id: null,
  harga: 0,
  aktif: true
});

// Categories
const categories = ref<any[]>([]);
const loadingCategories = ref(false);
const showCategoryModal = ref(false);
const editingCategory = ref<any>(null);
const categoryForm = ref({
  nama_kategori: ''
});

const fetchMenus = async () => {
  loadingMenus.value = true;
  try {
    const response = await api.get('/admin/menus');
    menus.value = response.data;
  } catch (error) {
    console.error('Failed to fetch menus', error);
  } finally {
    loadingMenus.value = false;
  }
};

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const response = await api.get('/admin/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch categories', error);
  } finally {
    loadingCategories.value = false;
  }
};

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

const openMenuModal = (menu?: any) => {
  if (menu) {
    editingMenu.value = menu;
    menuForm.value = {
      nama_menu: menu.nama_menu,
      kategori_id: menu.kategori_id,
      harga: menu.harga,
      aktif: menu.aktif
    };
  } else {
    editingMenu.value = null;
    menuForm.value = {
      nama_menu: '',
      kategori_id: null,
      harga: 0,
      aktif: true
    };
  }
  showMenuModal.value = true;
};

const saveMenu = async () => {
  try {
    if (editingMenu.value) {
      await api.put(`/admin/menus/${editingMenu.value.id}`, menuForm.value);
    } else {
      await api.post('/admin/menus', menuForm.value);
    }
    
    const toast = await toastController.create({
      message: editingMenu.value ? 'Menu updated!' : 'Menu created!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    
    showMenuModal.value = false;
    fetchMenus();
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Failed to save menu',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
};

const deleteMenu = async (id: number) => {
  const alert = await alertController.create({
    header: 'Delete Menu?',
    message: 'This action cannot be undone.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
          try {
            await api.delete(`/admin/menus/${id}`);
            const toast = await toastController.create({
              message: 'Menu deleted!',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            fetchMenus();
          } catch (error: any) {
            const toast = await toastController.create({
              message: error.response?.data?.message || 'Failed to delete menu',
              duration: 3000,
              color: 'danger'
            });
            await toast.present();
          }
        }
      }
    ]
  });
  await alert.present();
};

const openCategoryModal = (category?: any) => {
  if (category) {
    editingCategory.value = category;
    categoryForm.value = { nama_kategori: category.nama_kategori };
  } else {
    editingCategory.value = null;
    categoryForm.value = { nama_kategori: '' };
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await api.put(`/admin/categories/${editingCategory.value.id}`, categoryForm.value);
    } else {
      await api.post('/admin/categories', categoryForm.value);
    }
    
    const toast = await toastController.create({
      message: editingCategory.value ? 'Category updated!' : 'Category created!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    
    showCategoryModal.value = false;
    fetchCategories();
  } catch (error: any) {
    const toast = await toastController.create({
      message: error.response?.data?.message || 'Failed to save category',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
};

const deleteCategory = async (id: number) => {
  const alert = await alertController.create({
    header: 'Delete Category?',
    message: 'This action cannot be undone.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
          try {
            await api.delete(`/admin/categories/${id}`);
            const toast = await toastController.create({
              message: 'Category deleted!',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            fetchCategories();
          } catch (error: any) {
            const toast = await toastController.create({
              message: error.response?.data?.message || 'Failed to delete category',
              duration: 3000,
              color: 'danger'
            });
            await toast.present();
          }
        }
      }
    ]
  });
  await alert.present();
};

const logout = async () => {
  await authLogout();
  router.replace('/login');
};

onMounted(() => {
  fetchMenus();
  fetchCategories();
});
</script>