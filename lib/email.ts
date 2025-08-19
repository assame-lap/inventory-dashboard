// 이메일 알림 기능을 위한 유틸리티 함수들
// 실제 구현에서는 SendGrid, AWS SES, 또는 다른 이메일 서비스를 사용할 수 있습니다

export interface EmailData {
  to: string
  subject: string
  body: string
  html?: string
}

export interface LowStockAlertEmail {
  to: string
  subject: string
  product: string
  currentStock: number
  minStock: number
}

export interface OrderNotificationEmail {
  to: string
  subject: string
  orderId: string
  supplierName: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
  }>
}

export const sendLowStockAlert = async (emailData: LowStockAlertEmail): Promise<{ success: boolean; error?: string }> => {
  try {
    // 실제 이메일 서비스 연동 로직
    console.log('Sending low stock alert email:', emailData)
    
    // 여기서 실제 이메일 전송 API를 호출합니다
    // 예: SendGrid, AWS SES, Nodemailer 등
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send low stock alert email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const sendOrderNotification = async (emailData: OrderNotificationEmail): Promise<{ success: boolean; error?: string }> => {
  try {
    // 실제 이메일 서비스 연동 로직
    console.log('Sending order notification email:', emailData)
    
    // 여기서 실제 이메일 전송 API를 호출합니다
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send order notification email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const sendSystemNotification = async (emailData: EmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    // 실제 이메일 서비스 연동 로직
    console.log('Sending system notification email:', emailData)
    
    // 여기서 실제 이메일 전송 API를 호출합니다
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send system notification email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export const sendBulkEmail = async (emails: EmailData[]): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> => {
  const results = await Promise.allSettled(
    emails.map(email => sendSystemNotification(email))
  )
  
  const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
  const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length
  const errors = results
    .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
    .map(r => r.status === 'rejected' ? r.reason : r.value.error)
    .filter(Boolean) as string[]
  
  return { success: failed === 0, sent, failed, errors }
}

// 이메일 템플릿 함수들
export const createLowStockEmailTemplate = (product: string, currentStock: number, minStock: number): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">재고 부족 알림</h2>
      <p>안녕하세요,</p>
      <p>다음 상품의 재고가 부족합니다:</p>
      <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${product}</h3>
        <p style="margin: 5px 0;"><strong>현재 재고:</strong> ${currentStock}</p>
        <p style="margin: 5px 0;"><strong>최소 재고:</strong> ${minStock}</p>
      </div>
      <p>재고를 보충하거나 발주를 진행해주세요.</p>
      <p>감사합니다.</p>
    </div>
  `
}

export const createOrderNotificationEmailTemplate = (orderId: string, supplierName: string, items: Array<{ name: string; quantity: number; unitPrice: number }>): string => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.unitPrice.toLocaleString()}원</td>
    </tr>
  `).join('')
  
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">발주 완료 알림</h2>
      <p>안녕하세요,</p>
      <p>다음 발주가 완료되었습니다:</p>
      <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>발주 번호:</strong> ${orderId}</p>
        <p style="margin: 5px 0;"><strong>공급업체:</strong> ${supplierName}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">상품명</th>
            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: center;">수량</th>
            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">단가</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="background-color: #f5f5f5;">
            <td colspan="2" style="padding: 8px; border-top: 2px solid #ddd; text-align: right;"><strong>총 금액:</strong></td>
            <td style="padding: 8px; border-top: 2px solid #ddd; text-align: right;"><strong>${totalAmount.toLocaleString()}원</strong></td>
          </tr>
        </tfoot>
      </table>
      <p>감사합니다.</p>
    </div>
  `
}
