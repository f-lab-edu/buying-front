import { ref, onUnmounted } from 'vue'
import { getChatRooms } from '@/services/chatService'

let eventSource = null
let refreshCallback = null

/**
 * SSE 연결 관리 composable
 * 로그인 후 채팅방 목록 실시간 업데이트를 위해 사용
 */
export function useSSE() {
  const isConnected = ref(false)

  /**
   * SSE 연결 시작
   * @param {number} memberId - 회원 ID
   * @param {Function} onRefresh - 채팅방 리스트 갱신 콜백 함수
   */
  const connectSSE = (memberId, onRefresh) => {
    if (eventSource) {
      // 이미 연결되어 있으면 기존 연결 종료
      eventSource.close()
    }

    if (!memberId) {
      console.warn('SSE 연결 실패: memberId가 없습니다.')
      return
    }

    // 토큰 확인
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.warn('SSE 연결 실패: accessToken이 없습니다.')
      return
    }

    refreshCallback = onRefresh

    // SSE 연결 (토큰을 쿼리 파라미터로 전달)
    const sseUrl = `/api/chat/subscribe/${memberId}?token=${encodeURIComponent(token)}`
    eventSource = new EventSource(sseUrl)

    eventSource.onopen = () => {
      isConnected.value = true
      console.log('SSE 연결 성공:', sseUrl)
    }

    // new-message 이벤트 수신 처리
    eventSource.addEventListener('new-message', (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('SSE new-message 이벤트 수신:', data)
        
        // 채팅방 리스트 갱신
        if (refreshCallback) {
          refreshCallback()
        }
      } catch (error) {
        console.error('SSE 이벤트 파싱 오류:', error)
      }
    })

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error)
      isConnected.value = false
      
      // 연결이 끊어졌을 때 재연결 시도 (3초 후)
      setTimeout(() => {
        if (memberId && localStorage.getItem('accessToken')) {
          connectSSE(memberId, refreshCallback)
        }
      }, 3000)
    }
  }

  /**
   * SSE 연결 종료
   */
  const disconnectSSE = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
      refreshCallback = null
      isConnected.value = false
      console.log('SSE 연결 종료')
    }
  }

  onUnmounted(() => {
    disconnectSSE()
  })

  return {
    isConnected,
    connectSSE,
    disconnectSSE
  }
}

// 전역 SSE 인스턴스
let globalEventSource = null
let globalRefreshCallback = null

/**
 * 전역 SSE 연결 관리 (App 레벨에서 사용)
 * 로그인 후 자동으로 SSE 연결
 */
export function initGlobalSSE() {
  const memberId = localStorage.getItem('memberId')
  const token = localStorage.getItem('accessToken')

  if (!token || !memberId) {
    return null
  }

  // 이미 연결되어 있으면 종료
  if (globalEventSource) {
    globalEventSource.close()
  }

  // 채팅방 리스트 갱신 함수
  const refreshChatList = async () => {
    try {
      const currentMemberId = localStorage.getItem('memberId')
      if (!currentMemberId) {
        console.warn('⚠️ memberId가 없어 채팅방 목록을 갱신할 수 없습니다.')
        return
      }
      
      console.log('📥 채팅방 목록 API 호출 시작...')
      const rooms = await getChatRooms(Number(currentMemberId))
      console.log('✅ 채팅방 목록 갱신 완료:', rooms.length, '개')
      
      // 전역 이벤트를 통해 ChatListPage에 알림
      window.dispatchEvent(new CustomEvent('chat-list-updated', { detail: { rooms } }))
    } catch (error) {
      console.error('❌ 채팅방 리스트 갱신 오류:', error)
    }
  }

  globalRefreshCallback = refreshChatList

  // SSE 연결 (토큰을 쿼리 파라미터로 전달)
  const sseUrl = `/api/chat/subscribe/${memberId}?token=${encodeURIComponent(token)}`
  console.log('🔌 SSE 연결 시도:', sseUrl)
  globalEventSource = new EventSource(sseUrl)

  globalEventSource.onopen = () => {
    console.log('✅ 전역 SSE 연결 성공:', sseUrl)
  }

  // new-message 이벤트 수신 처리
  globalEventSource.addEventListener('new-message', (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('📨 전역 SSE new-message 이벤트 수신:', data)
      console.log('📨 roomId:', data.roomId)
      
      // 채팅방 리스트 갱신 (백엔드에서 최신 unread count와 마지막 메시지 포함)
      if (globalRefreshCallback) {
        console.log('🔄 채팅방 목록 갱신 시작...')
        globalRefreshCallback()
      }
    } catch (error) {
      console.error('❌ SSE 이벤트 파싱 오류:', error)
      console.error('❌ 원본 데이터:', event.data)
    }
  })

  globalEventSource.onerror = (error) => {
    console.error('전역 SSE 연결 오류:', error)
    
    // 연결이 끊어졌을 때 재연결 시도 (3초 후)
    setTimeout(() => {
      const currentToken = localStorage.getItem('accessToken')
      const currentMemberId = localStorage.getItem('memberId')
      if (currentToken && currentMemberId) {
        initGlobalSSE()
      }
    }, 3000)
  }

  // 연결 종료 함수 반환
  return () => {
    if (globalEventSource) {
      globalEventSource.close()
      globalEventSource = null
      globalRefreshCallback = null
      console.log('전역 SSE 연결 종료')
    }
  }
}

