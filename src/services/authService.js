import api from "@/utils/api";
import { saveToken } from "@/utils/auth";

export const login = async (email, password) => {
  const response = await api.post("/member/login", { email, password });
  const responseData = response.data?.data || response.data;

  if (!responseData?.accessToken) {
    throw new Error("로그인 응답 데이터가 올바르지 않습니다.");
  }

  saveToken(responseData.accessToken, responseData.memberId);
  return responseData;
};

export const signup = async (email, password, nickname) => {
  const response = await api.post("/member/create", {
    email,
    password,
    nickname,
  });
  return response.data;
};

