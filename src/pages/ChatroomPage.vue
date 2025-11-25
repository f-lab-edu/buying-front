<template>
  <div class="chatroom-page">
    <!-- 헤더 -->
    <div class="chat-header">
      <button class="back-button" @click="goBack" aria-label="뒤로 가기">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="seller-info">
        <div class="seller-name-row">
          <span class="seller-name">{{ sellerName }}</span>
          <span v-if="sellerTemperature" class="temperature-badge">{{ sellerTemperature }}°C</span>
        </div>
        <span v-if="responseTime" class="response-time">{{ responseTime }}</span>
      </div>
      <div class="header-actions">
        <button class="icon-button" aria-label="전화하기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
        <button class="icon-button" aria-label="더보기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 상품 정보 -->
    <div v-if="post" class="product-info-box">
      <img :src="productImage" alt="상품 이미지" class="product-thumbnail" />
      <div class="product-details">
        <div class="product-status-row">
          <span v-if="isCompleted" class="status-badge">거래완료</span>
          <span class="product-title">{{ post.title }}</span>
        </div>
        <span class="product-price">{{ formattedPrice }}</span>
      </div>
    </div>

    <!-- 당근페이 안내 -->
    <div v-if="showPaymentInfo" class="payment-info-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 4H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
      <span>{{ sellerName }}님은 당근페이 사용자예요. 채팅방에서 바로 송금하거나 안심결제를 요청해 보세요. <a href="#" class="link">자세히 보기</a></span>
    </div>

    <!-- 채팅 메시지 영역 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="msg.id || index" class="message-wrapper">
        <!-- 날짜 표시 -->
        <div v-if="shouldShowDate(msg, index)" class="date-divider">
          {{ formatDate(msg.timestamp) }}
        </div>
        
        <!-- 메시지 -->
        <div :class="['message-bubble', msg.isMine ? 'sent' : 'received']">
          <div v-if="!msg.isMine && shouldShowAvatar(msg, index)" class="message-avatar">
            <img :src="sellerAvatar" alt="판매자" />
          </div>
          <div class="message-content">
            <div class="message-text">{{ msg.message }}</div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 메시지 입력 영역 -->
    <div class="message-input-area">
      <button class="attach-button" aria-label="첨부">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <input
        v-model="newMessage"
        type="text"
        placeholder="메시지 보내기"
        class="message-input"
        @keyup.enter="sendMessage"
      />
      <button class="emoji-button" aria-label="이모지">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </button>
      <button
        v-if="newMessage.trim()"
        class="send-button"
        @click="sendMessage"
        aria-label="전송"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getPostDetail } from "@/services/productService";
import { getChatHistory } from "@/services/chatService";
import { formatPrice } from "@/utils/format";
import api from "@/utils/api";
import profileImg from "@/assets/profile.png";
import "@/styles/pages/ChatroomPage.css";

export default {
  name: "ChatroomPage",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const messages = ref([]);
    const newMessage = ref("");
    const stompClient = ref(null);
    const subscription = ref(null);

    const post = ref(null);
    const roomId = ref(null);
    const postId = ref(null);
    const currentUserId = ref(null);
    const sellerId = ref(null);
    const messagesContainer = ref(null);

    const sellerName = computed(() => post.value?.member?.nickname || "판매자");
    
    const sellerTemperature = computed(() => {
      // TODO: 실제 온도 데이터 연동
      return '38.6';
    });

    const responseTime = computed(() => {
      // TODO: 실제 응답 시간 데이터 연동
      return '보통 10분 이내 응답';
    });

    const productImage = computed(() => {
      return post.value?.images?.[0] || "https://via.placeholder.com/100";
    });

    const formattedPrice = computed(
      () => `${formatPrice(post.value?.price || 0)}원`
    );

    const isCompleted = computed(() => {
      return post.value?.status?.toUpperCase() === 'SOLD' || post.value?.status?.toUpperCase() === 'COMPLETED'
    });

    const showPaymentInfo = computed(() => {
      // TODO: 실제 당근페이 사용 여부 확인
      return true
    });

    const sellerAvatar = computed(() => profileImg);

    const loadPost = async () => {
      if (!postId.value) {
        console.error("postId가 없습니다.");
        return;
      }
      const data = await getPostDetail(postId.value);
      post.value = data;
      sellerId.value = data?.member?.id;
    };

    const loadChatHistory = async () => {
      const history = await getChatHistory(roomId.value, currentUserId.value);

      messages.value = history
        .map((msg) => ({
          id: msg.id,
          roomId: msg.roomId,
          senderId: msg.writerId,
          message: msg.content,
          messageType: msg.messageType,
          isMine: Number(msg.writerId) === Number(currentUserId.value),
          timestamp: msg.createdAt || new Date(),
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      scrollToBottom();
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      });
    };

    // ⭐⭐⭐ 수정된 WebSocket 연결 + SUBSCRIBE 로직 ⭐⭐⭐
    const connectWebSocket = () => {
      if (stompClient.value && stompClient.value.connected) return;

      const socket = new SockJS("http://localhost:8080/chat");
      stompClient.value = Stomp.over(socket);

      stompClient.value.connect(
        {},
        () => {
          // 🔥 SUBSCRIBE 시 Authorization 헤더 추가
          subscription.value = stompClient.value.subscribe(
            `/topic/${roomId.value}`,
            (message) => {
              try {
                const parsed = JSON.parse(message.body);
                messages.value.push({
                  id: parsed.id,
                  roomId: parsed.roomId,
                  senderId: parsed.writerId,
                  message: parsed.content,
                  isMine:
                    Number(parsed.writerId) === Number(currentUserId.value),
                  timestamp: parsed.createdAt || new Date(),
                });
                scrollToBottom();
              } catch (e) {
                console.error("메시지 파싱 실패:", e);
              }
            },
            {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ⭐ Bearer 추가
            }
          );

          console.log("STOMP SUBSCRIBE 완료:", roomId.value);
        },
        (err) => {
          console.error("WebSocket 연결 실패:", err);
        }
      );
    };

    const sendMessage = () => {
      const msg = newMessage.value.trim();
      if (!msg || !stompClient.value?.connected) return;

      const payload = {
        writerId: Number(currentUserId.value),
        content: msg,
      };

      stompClient.value.send(
        `/publish/send/${roomId.value}`,
        {},
        JSON.stringify(payload)
      );

      newMessage.value = "";
    };

    const disconnectWebSocket = async () => {
      try {
        await api.post(`/chat/room/${roomId.value}/read`);
      } catch (e) {
        console.error("읽음 처리 실패:", e);
      }

      if (subscription.value) {
        subscription.value.unsubscribe();
        subscription.value = null;
      }

      if (stompClient.value) {
        stompClient.value.disconnect();
        stompClient.value = null;
      }
    };

    // 페이지 진입 시 실행
    onMounted(async () => {
      roomId.value = route.params.roomId;
      postId.value = route.query.postId; // ⭐ params가 아니라 query에서 가져오기
      const memberId = localStorage.getItem("memberId");
      currentUserId.value = memberId ? Number(memberId) : null; // ⭐ Number 변환

      // 필수 값 검증
      if (!roomId.value || !postId.value) {
        alert("잘못된 접근입니다.");
        router.back();
        return;
      }

      if (!currentUserId.value) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      try {
        await loadPost();
        await loadChatHistory();
        connectWebSocket();
        
        // 채팅방 목록 업데이트를 위한 이벤트 발생 (SSE가 있으면 자동으로 갱신됨)
        window.dispatchEvent(new CustomEvent('chat-room-entered'));
      } catch (error) {
        console.error("초기화 오류:", error);
        alert("채팅방을 불러오는 중 오류가 발생했습니다.");
      }
    });

    // 페이지 이탈 시 WebSocket 종료
    onBeforeUnmount(() => {
      disconnectWebSocket();
    });

    return {
      messages,
      newMessage,
      post,
      productImage,
      formattedPrice,
      sellerName,
      sellerTemperature,
      responseTime,
      messagesContainer,
      sendMessage,
      goBack: () => router.back(),
      formatDate: (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}년 ${month}월 ${day}일`;
      },
      formatTime: (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${period} ${displayHours}:${String(minutes).padStart(2, '0')}`;
      },
      shouldShowDate: (msg, index) => {
        if (index === 0) return true;
        const currentDate = new Date(msg.timestamp).toDateString();
        const prevDate = new Date(messages.value[index - 1].timestamp).toDateString();
        return currentDate !== prevDate;
      },
      shouldShowAvatar: (msg, index) => {
        if (index === 0) return true;
        const prevMsg = messages.value[index - 1];
        return prevMsg.isMine || prevMsg.senderId !== msg.senderId;
      },
      isCompleted,
      showPaymentInfo,
      sellerAvatar,
    };
  },
};
</script>
