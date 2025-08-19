"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StockTransaction } from '@/types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface RecentTransactionsProps {
  transactions: StockTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'in':
        return { label: '입고', variant: 'default' as const }
      case 'out':
        return { label: '출고', variant: 'secondary' as const }
      case 'adjustment':
        return { label: '조정', variant: 'outline' as const }
      case 'return':
        return { label: '반품', variant: 'destructive' as const }
      default:
        return { label: '기타', variant: 'outline' as const }
    }
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return '📥'
      case 'out':
        return '📤'
      case 'adjustment':
        return '⚖️'
      case 'return':
        return '↩️'
      default:
        return '❓'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MM/dd HH:mm', { locale: ko })
    } catch {
      return '날짜 오류'
    }
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 거래 내역</CardTitle>
          <CardDescription>아직 거래 내역이 없습니다.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 거래 내역</CardTitle>
        <CardDescription>최근 10건의 재고 거래 내역입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((transaction) => {
            const typeInfo = getTransactionTypeLabel(transaction.transaction_type)
            const icon = getTransactionTypeIcon(transaction.transaction_type)
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className="font-medium">
                      {transaction.products?.name || '상품명 없음'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.products?.sku || 'SKU 없음'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium">
                      {transaction.quantity.toLocaleString()} {transaction.products?.unit || '개'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₩{transaction.unit_price.toLocaleString()}
                    </div>
                  </div>
                  
                  <Badge variant={typeInfo.variant}>
                    {typeInfo.label}
                  </Badge>
                  
                  <div className="text-sm text-muted-foreground min-w-[60px]">
                    {formatDate(transaction.created_at)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {transactions.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              총 {transactions.length}건의 거래 내역이 있습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
