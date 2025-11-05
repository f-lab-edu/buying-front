const BACKEND_URL = process.env.VUE_APP_BACKEND_URL || "http://localhost:8080";

const fetchOAuthCallback = async () => {
  const allParams = new URLSearchParams(window.location.search);
  const oauthCallbackUrl = `${BACKEND_URL}/login/oauth2/code/google?${allParams.toString()}`;

  const response = await fetch(oauthCallbackUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  return response;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const fetchPossibleEndpoints = async (endpoints) => {
  for (const endpoint of endpoints) {
    try {
      const fullUrl = `${BACKEND_URL}${endpoint}`;
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await parseResponse(response);
        if (data) {
          return data;
        }
      }
    } catch (error) {
      continue;
    }
  }
  return null;
};

export const getOAuthToken = async (urlParams) => {
  const token = urlParams.get("token") || urlParams.get("accessToken");
  const memberId = urlParams.get("memberId");

  if (token && memberId) {
    return { accessToken: token, memberId: parseInt(memberId, 10) };
  }

  const state = urlParams.get("state");
  const code = urlParams.get("code");

  if (state && code) {
    try {
      const response = await fetchOAuthCallback();
      if (response.ok) {
        const data = await parseResponse(response);
        if (data?.accessToken && data?.memberId) {
          return { accessToken: data.accessToken, memberId: data.memberId };
        }
      }
    } catch (error) {
      console.error("OAuth2 콜백 호출 실패:", error);
    }
  }

  const possibleEndpoints = [
    "/login/oauth2/code/google",
    "/oauth/google/redirect",
    "/api/oauth/google/redirect",
    "/api/oauth2/success",
    "/api/oauth2/token",
    "/api/member/google/token",
    "/api/oauth/google/success",
  ];

  const data = await fetchPossibleEndpoints(possibleEndpoints);
  if (data?.accessToken && data?.memberId) {
    return { accessToken: data.accessToken, memberId: data.memberId };
  }

  throw new Error("토큰을 받지 못했습니다. 백엔드 응답을 확인하세요.");
};

