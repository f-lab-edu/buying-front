<template>
  <div class="post-create-page">
    <header class="top-bar">
      <button class="icon-button" @click="goBack" aria-label="닫기">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <h1 class="title">내 물건 팔기</h1>
      <button class="link-button" type="button" @click="handleDraft">
        임시저장
      </button>
    </header>

    <main class="content-area">
      <section class="image-section">
        <div class="section-header">
          <h2>사진 등록</h2>
          <span class="counter">{{ images.length }}/5</span>
        </div>
        <div class="image-list">
          <label
            v-if="images.length < maxImages"
            class="image-card upload-card"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              @change="onImageChange"
              :disabled="images.length >= maxImages"
            />
            <div class="upload-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <span>사진 추가</span>
          </label>
          <div
            v-for="(image, index) in images"
            :key="image.id"
            class="image-card"
          >
            <img :src="image.preview" alt="상품 이미지" />
            <button
              class="delete-button"
              type="button"
              @click="removeImage(index)"
              aria-label="삭제"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <span v-if="index === 0" class="badge">대표 사진</span>
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="form-group">
          <label>제목</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="예) 맥북 에어 13인치 판매"
          />
        </div>

        <div class="form-group">
          <label>카테고리</label>
          <div class="chip-group">
            <button
              v-for="category in categories"
              :key="category.value"
              type="button"
              class="chip"
              :class="{ active: form.category === category.value }"
              @click="selectCategory(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>자세한 설명</label>
          <textarea
            v-model="form.content"
            rows="5"
            placeholder="상품 상태, 거래 지역 등 상세 정보를 입력해주세요"
          />
          <button class="secondary-button" type="button" @click="handlePhrase">
            자주 쓰는 문구
          </button>
        </div>

        <div class="form-row">
          <div class="form-group price-group">
            <label>가격</label>
            <div class="amount-input">
              <span class="currency">₩</span>
              <input
                v-model="displayPrice"
                type="text"
                inputmode="numeric"
                placeholder="0"
                @input="onPriceInput"
              />
            </div>
          </div>
          <div class="form-group quantity-group">
            <label>수량</label>
            <div class="quantity-control">
              <button
                type="button"
                @click="decrementQuantity"
                :disabled="form.quantity <= 1"
              >
                -
              </button>
              <input type="number" min="1" v-model.number="form.quantity" />
              <button type="button" @click="incrementQuantity">+</button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bottom-area">
      <button
        class="submit-button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        {{ isSubmitting ? "등록 중..." : "작성 완료" }}
      </button>
    </footer>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { createPost } from "@/services/postService";

export default {
  name: "PostCreatePage",
  setup() {
    const router = useRouter();
    const maxImages = 5;
    const images = ref([]);
    const isSubmitting = ref(false);

    const categories = [
      { label: "반려동물용품", value: "PET_SUPPLIES" },
      { label: "여성의류", value: "WOMEN_CLOTHING" },
      { label: "유아동", value: "KIDS" },
    ];

    const form = reactive({
      title: "",
      content: "",
      price: 0,
      quantity: 1,
      category: categories[0].value,
    });

    const displayPrice = ref("");

    const goBack = () => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.replace("/");
      }
    };

    const handleDraft = () => {
      alert("임시저장 기능은 준비 중입니다.");
    };

    const handlePhrase = () => {
      alert("자주 쓰는 문구 기능은 준비 중입니다.");
    };

    const selectCategory = (value) => {
      form.category = value;
    };

    const onPriceInput = (event) => {
      const numeric = event.target.value.replace(/[^0-9]/g, "");
      form.price = numeric ? parseInt(numeric, 10) : 0;
      displayPrice.value = form.price ? form.price.toLocaleString() : "";
    };

    const incrementQuantity = () => {
      form.quantity += 1;
    };

    const decrementQuantity = () => {
      if (form.quantity > 1) {
        form.quantity -= 1;
      }
    };

    const onImageChange = async (event) => {
      const files = Array.from(event.target.files);
      if (!files.length) return;

      const availableSlots = maxImages - images.value.length;
      const selected = files.slice(0, availableSlots);

      for (const file of selected) {
        const preview = await toBase64(file);
        images.value.push({ id: `${file.name}-${Date.now()}`, file, preview });
      }

      event.target.value = "";
    };

    const removeImage = (index) => {
      images.value.splice(index, 1);
    };

    const toBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const validateForm = () => {
      if (!form.title.trim()) {
        alert("제목을 입력해주세요.");
        return false;
      }
      if (!form.content.trim()) {
        alert("자세한 설명을 입력해주세요.");
        return false;
      }
      if (!form.price || form.price <= 0) {
        alert("가격을 입력해주세요.");
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
      if (isSubmitting.value) return;
      if (!validateForm()) return;

      try {
        isSubmitting.value = true;
        const payload = {
          title: form.title.trim(),
          content: form.content.trim(),
          price: form.price,
          quantity: form.quantity,
          category: form.category,
          images: images.value.length
            ? images.value.map((img) => img.preview)
            : ["https://via.placeholder.com/600x600?text=No+Image"],
        };
        const response = await createPost(payload);
        alert(response?.message || "게시물이 등록되었습니다.");
        router.replace("/");
      } catch (error) {
        console.error("게시물 등록 오류:", error);
        alert(error.response?.data?.message || "게시물 등록에 실패했습니다.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      images,
      maxImages,
      categories,
      isSubmitting,
      displayPrice,
      goBack,
      handleDraft,
      handlePhrase,
      selectCategory,
      onPriceInput,
      incrementQuantity,
      decrementQuantity,
      onImageChange,
      removeImage,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.post-create-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #111827;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  overflow: hidden;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
}

.icon-button svg {
  stroke: currentColor;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
}

.link-button {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 14px;
  cursor: pointer;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 100px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-section,
.form-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: inset 0 0 0 1px #eef2f6;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.counter {
  font-size: 13px;
  color: #64748b;
}

.image-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.image-card {
  position: relative;
  width: 88px;
  height: 88px;
  background-color: #f3f4f6;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.upload-card {
  border: 1px dashed #cbd5f5;
  color: #64748b;
  background: #f8fafc;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.upload-card input {
  display: none;
}

.delete-button {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.55);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.badge {
  position: absolute;
  left: 6px;
  bottom: 6px;
  background: rgba(15, 23, 42, 0.7);
  color: #fff;
  padding: 3px 7px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 14px;
  color: #475569;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  padding: 14px;
  color: #111827;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #6366f1;
  outline: none;
}

.chip-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip.active {
  background: #6366f1;
  color: #ffffff;
  border-color: #6366f1;
}

.secondary-button {
  align-self: flex-start;
  background: #eef2ff;
  color: #4f46e5;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
}

.form-row {
  display: flex;
  gap: 16px;
}

.price-group {
  flex: 1;
}

.amount-input {
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.currency {
  color: #94a3b8;
  margin-right: 8px;
}

.amount-input input {
  background: transparent;
  border: none;
  color: #111827;
  font-size: 16px;
  width: 100%;
  outline: none;
}

.quantity-group {
  width: 140px;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  overflow: hidden;
}

.quantity-control button {
  background: none;
  border: none;
  color: #111827;
  font-size: 18px;
  width: 38px;
  height: 44px;
  cursor: pointer;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  background: transparent;
  border: none;
  color: #111827;
  font-size: 16px;
}

.bottom-area {
  padding: 16px 20px 24px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.submit-button {
  width: 100%;
  background: #ff7a45;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .post-create-page {
    margin: 0;
    border-radius: 0;
  }
}
</style>
