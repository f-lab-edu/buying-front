<template>
  <div class="chat-list-page">
    <!-- 헤더 -->
    <div class="chat-header">
      <h1 class="header-title">채팅</h1>
      <div class="header-actions">
        <button class="icon-button" aria-label="필터">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle cx="8" cy="6" r="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="16" cy="12" r="2" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="18" r="2" />
          </svg>
        </button>
        <button class="icon-button" aria-label="알림">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <circle cx="18" cy="8" r="4" fill="#ff7a00" />
          </svg>
        </button>
        <button class="icon-button" aria-label="북마크">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 필터 탭 -->
    <div class="filter-tabs">
      <button
        :class="['tab', { active: activeTab === 'all' }]"
        @click="activeTab = 'all'"
      >
        전체
      </button>
      <button
        :class="['tab', { active: activeTab === 'sales' }]"
        @click="activeTab = 'sales'"
      >
        판매
      </button>
      <button
        :class="['tab', { active: activeTab === 'purchases' }]"
        @click="activeTab = 'purchases'"
      >
        구매
      </button>
      <button
        :class="['tab', { active: activeTab === 'unread' }]"
        @click="activeTab = 'unread'"
      >
        안 읽은 채팅방
      </button>
    </div>

    <!-- 알림 배너 -->
    <div class="notification-banner">
      <span class="banner-text">
        알림을 켜주세요 중요한 메시지를 놓칠 수 있어요. OS 설정에서 알림을
        켜주세요.
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>

    <!-- 채팅방 목록 -->
    <div class="chat-list">
      <div
        v-for="room in filteredRooms"
        :key="room.roomId"
        class="chat-item"
        @click="goToChatroom(room)"
      >
        <div class="chat-avatar">
          <img :src="getAvatarUrl()" alt="프로필" />
        </div>
        <div class="chat-content">
          <div class="chat-header-row">
            <span class="chat-name">{{ room.opponentName }}</span>
            <span class="chat-time">{{
              formatTime(room.lastTime)
            }}</span>
          </div>
          <div class="chat-message-row">
            <div class="chat-message">{{ room.lastContent || room.lastMessage || "메시지가 없습니다" }}</div>
            <span v-if="(room.unread || room.unreadCount || 0) > 0" class="unread-badge">
              {{ (room.unread || room.unreadCount || 0) > 99 ? "99+" : (room.unread || room.unreadCount || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">불러오는 중...</div>
    <div v-if="!isLoading && filteredRooms.length === 0" class="empty-state">
      채팅방이 없습니다.
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { getChatRooms } from "@/services/chatService";
import profileImg from "@/assets/profile.png";

export default {
  name: "ChatListPage",
  setup() {
    const router = useRouter();
    const rooms = ref([]);
    const activeTab = ref("all");
    const isLoading = ref(false);

    const filteredRooms = computed(() => {
      if (activeTab.value === "all") {
        return rooms.value;
      }
      // TODO: 판매/구매/안 읽은 채팅방 필터링 로직 추가
      return rooms.value;
    });

    const loadChatRooms = async () => {
      isLoading.value = true;
      try {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
          router.push("/login");
          return;
        }
        const chatRooms = await getChatRooms(Number(memberId));
        console.log('📥 채팅방 목록 원본 데이터:', chatRooms);
        
        // 최신 메시지가 있는 채팅방을 위로 정렬
        const sortedRooms = [...chatRooms].sort((a, b) => {
          const timeA = new Date(a.lastTime || 0).getTime();
          const timeB = new Date(b.lastTime || 0).getTime();
          return timeB - timeA; // 최신순
        });
        
        // 각 채팅방 데이터 확인
        sortedRooms.forEach((room, index) => {
          console.log(`채팅방 ${index + 1}:`, {
            roomId: room.roomId,
            opponentName: room.opponentName,
            lastContent: room.lastContent,
            lastTime: room.lastTime,
            unread: room.unread,
            전체데이터: room
          });
        });
        
        rooms.value = sortedRooms;
        console.log('✅ 채팅방 목록 로드 완료:', sortedRooms.length, '개');
      } catch (error) {
        console.error("❌ 채팅방 목록 불러오기 오류:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // SSE 이벤트로 채팅방 리스트 갱신
    const handleChatListUpdate = (event) => {
      console.log('📬 chat-list-updated 이벤트 수신:', event.detail);
      if (event.detail?.rooms) {
        // 최신 메시지가 있는 채팅방을 위로 정렬
        const sortedRooms = [...event.detail.rooms].sort((a, b) => {
          const timeA = new Date(a.lastTime || 0).getTime();
          const timeB = new Date(b.lastTime || 0).getTime();
          return timeB - timeA; // 최신순
        });
        rooms.value = sortedRooms;
        console.log('✅ 채팅방 목록 업데이트 완료:', sortedRooms.length, '개');
      } else {
        // 이벤트에 rooms가 없으면 API 다시 호출
        console.log('⚠️ 이벤트에 rooms가 없어 API를 다시 호출합니다.');
        loadChatRooms();
      }
    };

    const goToChatroom = (room) => {
      router.push({
        name: "Chatroom",
        params: { roomId: room.roomId },
        query: { postId: room.postId },
      });
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) return `${years}년 전`;
      if (months > 0) return `${months}달 전`;
      if (days > 0) return `${days}일 전`;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours > 0) return `${hours}시간 전`;

      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes > 0) return `${minutes}분 전`;

      return "방금 전";
    };

    const getAvatarUrl = () => {
      // TODO: 실제 프로필 이미지 URL 가져오기
      return profileImg;
    };

    onMounted(() => {
      loadChatRooms();

      // 전역 이벤트 리스너 (App 레벨 SSE에서 발생한 이벤트 수신)
      window.addEventListener("chat-list-updated", handleChatListUpdate);
      
      // 채팅방 입장 시 목록 갱신
      const handleChatRoomEntered = () => {
        console.log('🔄 채팅방 입장 이벤트 수신 - 목록 갱신');
        loadChatRooms();
      };
      window.addEventListener("chat-room-entered", handleChatRoomEntered);
      
      // 컴포넌트 언마운트 시 리스너 제거를 위해 저장
      window._chatRoomEnteredHandler = handleChatRoomEntered;
    });

    onBeforeUnmount(() => {
      window.removeEventListener("chat-list-updated", handleChatListUpdate);
      if (window._chatRoomEnteredHandler) {
        window.removeEventListener("chat-room-entered", window._chatRoomEnteredHandler);
        delete window._chatRoomEnteredHandler;
      }
    });

    return {
      rooms,
      activeTab,
      isLoading,
      filteredRooms,
      goToChatroom,
      formatTime,
      getAvatarUrl,
    };
  },
};
</script>

<style scoped>
.chat-list-page {
  min-height: 100vh;
  background: #ffffff;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #f1f5f9;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #111827;
}

.filter-tabs {
  display: flex;
  gap: 0;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  overflow-x: auto;
}

.tab {
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: #111827;
  font-weight: 600;
  border-bottom-color: #111827;
}

.notification-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff4e6;
  margin: 0 20px;
  margin-top: 12px;
  border-radius: 8px;
  gap: 12px;
}

.banner-text {
  flex: 1;
  font-size: 13px;
  color: #92400e;
  line-height: 1.4;
}

.chat-list {
  padding: 8px 0;
}

.chat-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.chat-item:hover {
  background: #f8f9fa;
}

.chat-item:active {
  background: #f1f5f9;
}

.chat-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e5e7eb;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.chat-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

.chat-message-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-message {
  font-size: 14px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ff7a00;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 10px;
  flex-shrink: 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
