import { DashboardLayout } from "@/components/dashboard-layout"
import { OrderManagement } from "@/components/order-management"

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrderManagement />
    </DashboardLayout>
  )
}
