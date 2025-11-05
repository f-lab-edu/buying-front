const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "맥북 에어 m2 13인치 팝니다",
    status: "3일째 판매중",
    price: 840000,
    quantity: 1,
    imageUrl: null,
  },
  {
    id: 2,
    title: "맥북 에어 m2 13인치 팝니다",
    status: "예약 중",
    price: 840000,
    quantity: 1,
    imageUrl: null,
  },
  {
    id: 3,
    title: "맥북 에어 m2 13인치 팝니다",
    status: "예약 중",
    price: 840000,
    quantity: 1,
    imageUrl: null,
  },
];

export const fetchProducts = async () => {
  try {
    // TODO: 실제 백엔드 API 호출
    // const response = await api.get('/products')
    // return response.data
    
    return MOCK_PRODUCTS;
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    return MOCK_PRODUCTS;
  }
};

