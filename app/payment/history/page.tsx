import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaymentHistoryPage() {

  // ======================
  // ดึงข้อมูลประวัติ
  // ======================
  const [rows] = await db.execute(`
    SELECT 
      payments.id AS payment_id,
      payments.total,
      payments.created_at,
      products.product_name,
      payment_items.quantity,
      payment_items.price
    FROM payments
    JOIN payment_items 
      ON payments.id = payment_items.payment_id
    JOIN products 
      ON payment_items.product_id = products.id
    ORDER BY payments.created_at DESC
  `);

  const history = rows as any[];

  // ======================
  // คำนวณยอดขาย
  // ======================
  const totalSales = history.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const today = new Date().toDateString();

  const todaySales = history
    .filter((item) => new Date(item.created_at).toDateString() === today)
    .reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

  const totalBills = new Set(history.map((i) => i.payment_id)).size;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* ปุ่มกลับ */}
      <div className="mb-6">
        <Link
          href="/home"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ← กลับหน้า Dashboard
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        ประวัติการขาย (POS)
      </h1>

      {/* ======================
          SUMMARY BOX
      ====================== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">ยอดขายทั้งหมด</p>
          <h2 className="text-2xl font-bold text-green-600">
            {totalSales.toLocaleString()} บาท
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">ยอดขายวันนี้</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {todaySales.toLocaleString()} บาท
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">จำนวนบิล</p>
          <h2 className="text-2xl font-bold">
            {totalBills} บิล
          </h2>
        </div>

      </div>

      {/* ======================
          TABLE
      ====================== */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">บิล</th>
              <th className="p-3 text-left">วันที่</th>
              <th className="p-3 text-left">สินค้า</th>
              <th className="p-3 text-center">จำนวน</th>
              <th className="p-3 text-center">ราคา</th>
              <th className="p-3 text-center">รวม</th>
              <th className="p-3 text-center">ยอดบิล</th>
            </tr>
          </thead>

          <tbody>

            {history.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  ไม่มีข้อมูลการขาย
                </td>
              </tr>
            )}

            {history.map((item, index) => {

              const total = item.price * item.quantity;

              return (
                <tr key={index} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-semibold">
                    #{item.payment_id}
                  </td>

                  <td className="p-3 text-gray-600">
                    {new Date(item.created_at).toLocaleString()}
                  </td>

                  <td className="p-3">
                    {item.product_name}
                  </td>

                  <td className="p-3 text-center">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-center">
                    {Number(item.price).toLocaleString()} บาท
                  </td>

                  <td className="p-3 text-center">
                    {total.toLocaleString()} บาท
                  </td>

                  <td className="p-3 text-center font-semibold text-green-600">
                    {Number(item.total).toLocaleString()} บาท
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}