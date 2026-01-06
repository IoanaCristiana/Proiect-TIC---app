import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    itemsCount: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price, 0)
  },
  actions: {
    addToCart(product) {
      this.items.push(product)
    },
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    emptyCart() {
      this.items = []
    }
  }
})