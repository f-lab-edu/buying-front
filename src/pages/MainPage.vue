<template>
  <div class="main-page">
    <div class="product-list">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @remove="removeProduct"
        @select="openDetail"
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
    <CommonModal
      v-model="showLoginModal"
      title="알림"
      message="로그인이 필요합니다!"
      :show-actions="false"
      :auto-close-ms="2000"
      @close="redirectToLogin"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/product/ProductCard.vue";
import CommonModal from "@/components/modal/CommonModal.vue";
import { fetchProducts } from "@/services/productService";
import { isAuthenticated } from "@/utils/navigation";

export default {
  name: "MainPage",
  components: { ProductCard, CommonModal },
  setup() {
    const router = useRouter();
    const products = ref([]);
    const showLoginModal = ref(false);
    let timerId = null;

    const clearTimer = () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    const removeProduct = (productId) => {
      products.value = products.value.filter((p) => p.id !== productId);
    };

    const openDetail = (productId) => {
      router.push(`/posts/${productId}`);
    };

    const redirectToLogin = () => {
      clearTimer();
      showLoginModal.value = false;
      router.push("/login");
    };

    const handleCreateProduct = () => {
      if (!isAuthenticated()) {
        showLoginModal.value = true;
        clearTimer();
        timerId = setTimeout(() => {
          redirectToLogin();
        }, 2000);
        return;
      }
      router.push('/posts/create');
    };

    const loadProducts = async () => {
      products.value = await fetchProducts();
    };

    onMounted(() => {
      loadProducts();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return {
      products,
      showLoginModal,
      removeProduct,
      handleCreateProduct,
      openDetail,
      redirectToLogin,
    };
  },
};
</script>

<style scoped>
.main-page {
  position: relative;
  padding: 20px 16px 120px 16px;
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
  bottom: 96px;
  right: max(20px, calc((100vw - 430px) / 2 + 20px));
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
    padding: 16px 12px 140px 12px;
  }

  .fab {
    bottom: 96px;
    right: 20px;
    width: 48px;
    height: 48px;
  }
}
</style>
