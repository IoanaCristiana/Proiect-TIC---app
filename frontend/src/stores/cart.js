import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const itemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  function addToCart(product) {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      
      if (existingItem.quantity < product.stoc) {
        existingItem.quantity++
      } else {
        alert(`Nu poți adăuga mai mult! Doar ${product.stoc} bucăți disponibile.`)
      }
    } else {
   
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function updateQuantity(id, change) {
    const item = items.value.find(i => i.id === id)
    if (item) {
   
      if (change > 0) {
        if (item.quantity < item.stoc) {
          item.quantity++
        } else {
          alert("Stoc maxim atins pentru acest produs!")
        }
      } 
      else {
        item.quantity += change
        if (item.quantity <= 0) {
          removeFromCart(id)
        }
      }
    }
  }

  function removeFromCart(id) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  return { items, itemsCount, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart }
})