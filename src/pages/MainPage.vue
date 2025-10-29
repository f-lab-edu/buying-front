<template>
  <div class="main-page">
    <!-- 상품 목록 -->
    <div class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img
            :src="product.imageUrl || '/placeholder-image.png'"
            :alt="product.title"
            class="product-img"
          />
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.title }}</h3>
          <div class="product-status">{{ product.status }}</div>
          <div class="product-price-row">
            <span class="product-price"
              >{{ formatPrice(product.price) }}원</span
            >
            <span class="product-quantity">수량: {{ product.quantity }}개</span>
          </div>
        </div>
        <button class="close-btn" @click="removeProduct(product.id)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 플로팅 액션 버튼 -->
    <button class="fab" @click="createProduct">
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

export default {
  name: "MainPage",
  setup() {
    const router = useRouter();
    const products = ref([]);

    // 임시 데이터 (실제로는 백엔드에서 가져올 예정)
    const mockProducts = [
      {
        id: 1,
        title: "맥북 에어 m2 13인치 팝니다",
        status: "3일째 판매중",
        price: 840000,
        quantity: 1,
        imageUrl: null,
      },
      {
        id: 2,
        title: "맥북 에어 m2 13인치 팝니다",
        status: "예약 중",
        price: 840000,
        quantity: 1,
        imageUrl: null,
      },
      {
        id: 3,
        title: "맥북 에어 m2 13인치 팝니다",
        status: "예약 중",
        price: 840000,
        quantity: 1,
        imageUrl: null,
      },
    ];

    const formatPrice = (price) => {
      return price.toLocaleString();
    };

    const removeProduct = (productId) => {
      products.value = products.value.filter((p) => p.id !== productId);
    };

    const createProduct = () => {
      // 로그인 체크
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      // 상품 등록 페이지로 이동 (추후 구현)
      alert("상품 등록 기능은 추후 구현 예정입니다.");
    };

    const fetchProducts = async () => {
      try {
        // 실제 백엔드 API 호출 (추후 구현)
        // const response = await api.get('/products')
        // products.value = response.data

        // 임시로 목 데이터 사용
        products.value = mockProducts;
      } catch (error) {
        console.error("상품 목록 조회 오류:", error);
        // 에러 시에도 목 데이터 표시
        products.value = mockProducts;
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      formatPrice,
      removeProduct,
      createProduct,
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

.product-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 16px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.product-status {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.product-quantity {
  font-size: 14px;
  color: #666;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #666;
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

/* 반응형 디자인 */
@media (max-width: 480px) {
  .main-page {
    padding: 16px 12px 100px 12px;
  }

  .product-card {
    padding: 12px;
    gap: 12px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .product-title {
    font-size: 14px;
  }

  .product-price {
    font-size: 14px;
  }

  .fab {
    bottom: 90px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
