import api from '@/utils/api'

/**
 * 채팅방 생성 또는 조회
 * @param {number} postId - 게시물 ID
 * @param {number} buyerId - 구매자(채팅 요청한 사용자) ID
 * @returns {Promise} 채팅방 정보 (roomId 포함)
 */
export const getOrCreateChatRoom = async (postId, buyerId) => {
  try {
    // API baseURL이 /api이므로 /api/chat/room으로 요청
    // 프록시가 /api를 제거하므로 백엔드에서는 /chat/room으로 받음
    // 백엔드 요구사항: { postId, buyerId }
    const response = await api.post(`/chat/room`, { 
      postId: Number(postId), 
      buyerId: Number(buyerId) 
    })
    // 백엔드 응답: { roomId: Long }
    return response.data
  } catch (error) {
    console.error('채팅방 생성/조회 오류:', error)
    throw error
  }
}

/**
 * 채팅 내역 조회
 * @param {number} roomId - 채팅방 ID
 * @returns {Promise} 채팅 메시지 목록
 */
export const getChatHistory = async (roomId) => {
  try {
    const response = await api.get(`/chat/messages/${roomId}`)
    // 응답 형식: { messages: [...] }
    return response.data?.messages || []
  } catch (error) {
    console.error('채팅 내역 조회 오류:', error)
    throw error
  }
}

/**
 * 채팅방 읽음 처리
 * @param {number} roomId - 채팅방 ID
 * @returns {Promise}
 */
export const markAsRead = async (roomId) => {
  try {
    const response = await api.post(`/chat/room/${roomId}/read`)
    return response.data
  } catch (error) {
    console.error('읽음 처리 오류:', error)
    throw error
  }
}


