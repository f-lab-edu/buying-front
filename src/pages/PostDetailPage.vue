<template>
  <div class="detail-page">
    <CommonModal
      v-model="showLoginModal"
      title="알림"
      message="로그인이 필요합니다!"
      :show-actions="false"
      :auto-close-ms="2000"
      @close="redirectToLogin"
    />

    <div v-if="!isLoading && post" class="post-detail">
      <div class="hero">
        <img :src="currentImage" alt="상품 이미지" class="hero-image" />
        <div class="hero-actions">
          <button class="icon-button" @click="goBack" aria-label="뒤로 가기">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div class="hero-right">
            <button class="icon-button" @click="goHome" aria-label="홈으로">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M3 9.5L12 4l9 5.5" />
                <path d="M5 11v9h5v-5h4v5h5v-9" />
              </svg>
            </button>
            <button
              class="icon-button"
              @click="sharePost"
              aria-label="공유하기"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <button
              class="icon-button"
              @click="moreOptions"
              aria-label="더보기"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
        <button
          v-if="images.length > 1"
          class="carousel-btn prev"
          @click="prevImage"
          aria-label="이전 사진"
        >
          ‹
        </button>
        <button
          v-if="images.length > 1"
          class="carousel-btn next"
          @click="nextImage"
          aria-label="다음 사진"
        >
          ›
        </button>
        <div v-if="images.length > 1" class="image-indicator">
          <span
            v-for="(img, index) in images"
            :key="index"
            :class="['indicator-dot', { active: index === currentIndex }]"
          />
        </div>
      </div>

      <section class="seller-section">
        <div class="seller-profile">
          <img :src="sellerAvatar" alt="판매자" class="seller-avatar" />
          <div>
            <p class="seller-name">
              {{ post.member?.nickname || "알 수 없음" }}
            </p>
            <p class="seller-location">성북구 돈암동</p>
          </div>
        </div>
      </section>

      <section class="post-body">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span>디지털기기</span>
          <span class="dot">·</span>
          <span>방금 전</span>
        </div>
        <div class="price-row">
          <span class="post-price">{{ formattedPrice }}</span>
          <span v-if="statusLabel" class="status-pill">{{ statusLabel }}</span>
        </div>
        <p v-if="displayQuantity" class="post-quantity">
          수량 {{ displayQuantity }}개
        </p>
        <p class="post-description">{{ post.content }}</p>
      </section>

      <section class="post-stats">
        <span>채팅 0</span>
        <span>관심 0</span>
        <span>조회 0</span>
      </section>

      <footer class="action-bar">
        <button class="wish-button" aria-label="관심 등록">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21.3l7.8-7.9 1-1a5.5 5.5 0 0 0 0-7.8z"
            />
          </svg>
        </button>
        <button class="secondary-button" @click="handlePay">결제하기</button>
        <button class="primary-button" @click="handleChat">
          {{ isMyPost ? "채팅방 목록보기" : "채팅하기" }}
        </button>
      </footer>
    </div>

    <div v-else-if="isLoading" class="loading-state">불러오는 중입니다...</div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatPrice } from "@/utils/format";
import { getPostDetail } from "@/services/productService";
import { getOrCreateChatRoom } from "@/services/chatService";
import CommonModal from "@/components/modal/CommonModal.vue";
import profileImg from "@/assets/profile.png";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/800x600?text=No+Image";

export default {
  name: "PostDetailPage",
  components: { CommonModal },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const post = ref(null);
    const images = ref([]);
    const currentIndex = ref(0);
    const isLoading = ref(true);
    const showLoginModal = ref(false);

    const hasToken = () => !!localStorage.getItem("accessToken");

    const loadPost = async () => {
      currentIndex.value = 0;
      post.value = null;
      images.value = [];
      isLoading.value = true;

      if (!hasToken()) {
        showLoginModal.value = true;
        setTimeout(() => {
          redirectToLogin();
        }, 2000);
        isLoading.value = false;
        return;
      }

      try {
        const data = await getPostDetail(route.params.id);
        post.value = data;
        const rawImages =
          Array.isArray(data?.images) && data.images.length
            ? data.images
            : [PLACEHOLDER_IMAGE];
        images.value = rawImages;
      } catch (error) {
        console.error("게시물 상세 불러오기 오류:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const currentImage = computed(
      () => images.value[currentIndex.value] || PLACEHOLDER_IMAGE
    );
    const formattedPrice = computed(() => {
      if (!post.value) return "";
      return `${formatPrice(Number(post.value.price) || 0)}원`;
    });

    const displayQuantity = computed(() => {
      if (!post.value) return "";
      const qty = Number(post.value.quantity);
      if (!Number.isFinite(qty) || qty <= 0) return "";
      return qty;
    });

    const statusLabel = computed(() => {
      const status = post.value?.status?.toUpperCase();
      if (status === "RESERVED") return "예약중";
      return "";
    });

    const sellerAvatar = computed(() => profileImg);

    const isMyPost = computed(() => {
      if (!post.value || !post.value.member) return false;
      const currentUserId = localStorage.getItem("memberId");
      if (!currentUserId) return false;
      return Number(post.value.member.id) === Number(currentUserId);
    });

    const prevImage = () => {
      if (images.value.length <= 1) return;
      currentIndex.value =
        (currentIndex.value - 1 + images.value.length) % images.value.length;
    };

    const nextImage = () => {
      if (images.value.length <= 1) return;
      currentIndex.value = (currentIndex.value + 1) % images.value.length;
    };

    const goBack = () => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.replace("/");
      }
    };

    const goHome = () => {
      router.push("/");
    };

    const sharePost = () => {
      if (navigator.share && post.value) {
        navigator
          .share({
            title: post.value.title,
            text: post.value.content,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        alert("공유 기능을 지원하지 않는 환경입니다.");
      }
    };

    const moreOptions = () => {
      alert("추가 기능은 준비 중입니다.");
    };

    const handleChat = async () => {
      if (!hasToken()) {
        showLoginModal.value = true;
        setTimeout(() => {
          redirectToLogin();
        }, 2000);
        return;
      }

      // 내 게시글인 경우 채팅방 목록으로 이동
      if (isMyPost.value) {
        router.push({ name: "ChatList" });
        return;
      }

      try {
        // 현재 사용자 ID 가져오기 (buyerId)
        const buyerId = localStorage.getItem("memberId");
        if (!buyerId) {
          alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
          redirectToLogin();
          return;
        }

        // 백엔드 요구사항: { postId, buyerId }
        const chatRoom = await getOrCreateChatRoom(route.params.id, buyerId);
        // 백엔드 응답: { roomId: Long }
        const roomId = chatRoom?.roomId;

        if (!roomId) {
          throw new Error("채팅방 ID를 받지 못했습니다.");
        }

        router.push({
          name: "Chatroom",
          params: { roomId },
          query: { postId: route.params.id },
        });
      } catch (error) {
        console.error("채팅방 생성 오류:", error);
        alert("채팅방을 생성하는 중 오류가 발생했습니다.");
      }
    };

    const handlePay = () => {
      alert("결제 기능은 준비 중입니다.");
    };

    const redirectToLogin = () => {
      router.push("/login");
    };

    onMounted(loadPost);

    watch(
      () => route.params.id,
      () => {
        loadPost();
      }
    );

    return {
      post,
      images,
      currentIndex,
      currentImage,
      formattedPrice,
      displayQuantity,
      statusLabel,
      sellerAvatar,
      isMyPost,
      prevImage,
      nextImage,
      goBack,
      goHome,
      sharePost,
      moreOptions,
      handleChat,
      handlePay,
      isLoading,
      showLoginModal,
      redirectToLogin,
    };
  },
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.post-detail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #ffffff;
}

.hero {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: #f1f5f9;
}

.hero-image {
  user-select: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-actions {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-right {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.image-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.indicator-dot.active {
  width: 16px;
  border-radius: 8px;
  background: #ffffff;
}

.seller-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px;
}

.seller-profile {
  display: flex;
  gap: 12px;
  align-items: center;
}

.seller-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.seller-location {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}

.seller-temperature {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-weight: 600;
  color: #f97316;
}

.temperature-value {
  font-size: 16px;
}

.temperature-label {
  font-size: 13px;
  color: #f97316;
}

.post-body {
  padding: 0 20px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.post-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.dot {
  font-size: 10px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}

.post-price {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
}

.post-quantity {
  margin: 0 0 12px;
  font-size: 14px;
  color: #4b5563;
}

.post-description {
  margin: 0;
  font-size: 15px;
  color: #1f2937;
  line-height: 1.6;
  white-space: pre-line;
}

.post-stats {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  font-size: 13px;
  color: #94a3b8;
}

.action-bar {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 24px;
  border-top: 1px solid #f1f5f9;
  background: #ffffff;
}

.wish-button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.secondary-button,
.primary-button {
  flex: 1;
  border: none;
  border-radius: 12px;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.secondary-button {
  background: #f1f5f9;
  color: #0f172a;
}

.primary-button {
  background: #ff7a00;
  color: white;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 16px;
  color: #6b7280;
}

@media (max-width: 480px) {
  .seller-section,
  .post-body,
  .post-stats,
  .action-bar {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #111827;
  cursor: pointer;
  backdrop-filter: blur(6px);
}

.carousel-btn.prev {
  left: 12px;
}

.carousel-btn.next {
  right: 12px;
}
</style>
