import { reactive } from 'vue';

export const orderStore = reactive({
    tableId: 1,
    orderType: 'dine_in' as 'dine_in' | 'take_away',
    numberOfGuests: 1,
    cart: [] as Array<{
        menu_id: number;
        nama: string;
        harga: number;
        qty: number;
        notes: string;
    }>,

    setTable(id: number) {
        this.tableId = id;
    },

    setOrderType(type: 'dine_in' | 'take_away') {
        this.orderType = type;
    },

    setGuests(guests: number) {
        this.numberOfGuests = guests;
    },

    addToCart(item: any) {
        const existing = this.cart.find(i => i.menu_id === item.id);
        if (existing) {
            existing.qty++;
        } else {
            this.cart.push({
                menu_id: item.id,
                nama: item.nama,
                harga: Number(item.harga),
                qty: 1,
                notes: ''
            });
        }
    },

    removeFromCart(index: number) {
        this.cart.splice(index, 1);
    },

    clearCart() {
        this.cart = [];
    },

    get total() {
        return this.cart.reduce((sum: number, item: any) => sum + (item.harga * item.qty), 0);
    }
});