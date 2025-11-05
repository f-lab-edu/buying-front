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

<style>
@import "@/styles/pages/MainPage.css";
</style>
