export const saveToken = (accessToken, memberId) => {
  localStorage.setItem("accessToken", accessToken);
  if (memberId) {
    localStorage.setItem("memberId", memberId.toString());
  }
  localStorage.setItem("user", JSON.stringify({ accessToken, memberId }));
  
  // 로그인 성공 시 SSE 연결을 위한 이벤트 발생
  window.dispatchEvent(new CustomEvent('user-logged-in', { 
    detail: { memberId: memberId?.toString() } 
  }));
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("memberId");
  localStorage.removeItem("user");
  
  // 로그아웃 시 SSE 연결 해제를 위한 이벤트 발생
  window.dispatchEvent(new CustomEvent('user-logged-out'));
};

