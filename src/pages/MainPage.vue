<template>
  <div class="main-page">
    <div class="product-list">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @remove="removeProduct"
      />
    </div>
    <button class="fab" @click="handleCreateProduct">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/product/ProductCard.vue";
import { fetchProducts } from "@/services/productService";
import { isAuthenticated } from "@/utils/navigation";

export default {
  name: "MainPage",
  components: { ProductCard },
  setup() {
    const router = useRouter();
    const products = ref([]);

    const removeProduct = (productId) => {
      products.value = products.value.filter((p) => p.id !== productId);
    };

    const handleCreateProduct = () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }
      alert("상품 등록 기능은 추후 구현 예정입니다.");
    };

    const loadProducts = async () => {
      products.value = await fetchProducts();
    };

    onMounted(() => {
      loadProducts();
    });

    return {
      products,
      removeProduct,
      handleCreateProduct,
    };
  },
};
</script>

<style scoped>
.main-page {
  padding: 20px 16px 100px 16px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fab {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: #ff6b9d;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
  transition: all 0.2s;
  z-index: 1000;
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 107, 157, 0.5);
}

.fab:active {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .main-page {
    padding: 16px 12px 100px 12px;
  }

  .fab {
    bottom: 90px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
