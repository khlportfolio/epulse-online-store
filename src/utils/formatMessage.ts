export interface CartItemData {
  id: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    imageUrl: string
  }
  size?: {
    id: string
    name: string
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount)
}

export const formatWhatsAppMessage = (
  username: string,
  cartItems: CartItemData[],
  totalPrice: number
): string => {
  let message = `*Order Summary*\n\n`
  message += `👤 *Username:* ${username}\n\n`

  cartItems.forEach((item) => {
    const sizeInfo = item.size?.name ? ` (Size: ${item.size?.name})` : ''
    message += `🛒 *${item.product.title}* - ${item.quantity} x ${formatCurrency(item.product.price)}${sizeInfo}\n`
  })

  message += `\n💰 *Total:* ${formatCurrency(totalPrice)}\n\n`
  message += `*Thank you for shopping with us!*`

  return encodeURIComponent(message)
}
