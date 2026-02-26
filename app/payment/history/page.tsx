// app/payment/history/page.tsx

import { prisma } from "@/lib/prisma";

export default async function PaymentHistoryPage() {
  const payments = await prisma.payments.findMany({
    orderBy: { created_at: "desc" },
    include: {
      payment_items: {
        include: {
          products: true,
        },
      },
    },
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">ประวัติการจ่ายเงิน</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">วันที่</th>
              <th className="border p-2">ชื่อสินค้า</th>
              <th className="border p-2">จำนวน</th>
              <th className="border p-2">วิธีชำระเงิน</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}

            {payments.map((payment) =>
              payment.payment_items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    {new Date(payment.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {item.products?.name}
                  </td>
                  <td className="border p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border p-2 text-center">
                    {payment.method}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}