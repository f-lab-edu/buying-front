<template>
  <div class="product-card">
    <div class="product-image">
      <img
        :src="product.imageUrl || '/placeholder-image.png'"
        :alt="product.title"
        class="product-img"
      />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-status">{{ product.status }}</div>
      <div class="product-price-row">
        <span class="product-price">{{ formatPrice(product.price) }}원</span>
        <span class="product-quantity">수량: {{ product.quantity }}개</span>
      </div>
    </div>
    <button class="close-btn" @click="$emit('remove', product.id)">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/format";

export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatPrice,
  },
};
</script>

<style>
@import "@/styles/components/ProductCard.css";
</style>
