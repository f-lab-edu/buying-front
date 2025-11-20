<template>
  <div class="product-card" @click="$emit('select', product.id)">
    <div class="product-image">
      <img :src="thumbnail" :alt="product.title" class="product-img" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <p v-if="writer" class="product-writer">{{ writer }}</p>
      <div class="product-meta">
        <span v-if="statusLabel" class="status-badge">{{ statusLabel }}</span>
        <span class="product-price">{{ formattedPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/format'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image'

export default {
  name: 'ProductCard',
  emits: ['select'],
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedPrice() {
      const price = Number(this.product.price) || 0
      return `${formatPrice(price)}원`
    },
    thumbnail() {
      return this.product.thumbnailUrl || PLACEHOLDER_IMAGE
    },
    writer() {
      const nickname = this.product.member?.nickname
      return nickname ? `글쓴이 ${nickname}` : ''
    },
    statusLabel() {
      if (!this.product.status) return ''
      const status = this.product.status.toUpperCase()
      if (status === 'RESERVED') return '예약중'
      return ''
    },
  },
}
</script>

<style scoped>
.product-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 16px;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
}

.product-image {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f1f5f9;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.product-writer {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.product-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  background: #e0f2fe;
}

.product-price {
  font-weight: 700;
  color: #0f172a;
}
</style>
