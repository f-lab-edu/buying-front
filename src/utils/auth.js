export const saveToken = (accessToken, memberId) => {
  localStorage.setItem("accessToken", accessToken);
  if (memberId) {
    localStorage.setItem("memberId", memberId.toString());
  }
  localStorage.setItem("user", JSON.stringify({ accessToken, memberId }));
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("memberId");
  localStorage.removeItem("user");
};

