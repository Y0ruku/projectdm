import Link from "next/link";
import { db } from "@/lib/db";

export default async function ReceiptPage({ params }: any) {

  const paymentId = params.id;

  const [paymentRows]: any = await db.execute(
    "SELECT * FROM payments WHERE id = ?",
    [paymentId]
  );

  const payment = paymentRows[0];

  const [items]: any = await db.execute(
    `SELECT pi.quantity, pi.price, p.product_name
     FROM payment_items pi
     JOIN products p ON pi.product_id = p.id
     WHERE pi.payment_id = ?`,
    [paymentId]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white p-8 shadow rounded-lg">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          ใบเสร็จ
        </h2>

        <p>เลขที่บิล: {payment.id}</p>
        <p>วันที่: {new Date(payment.created_at).toLocaleString()}</p>

        <hr className="my-4" />

        {items.map((item: any, index: number) => (
          <div key={index} className="flex justify-between mb-2">
            <span>
              {item.product_name} x {item.quantity}
            </span>
            <span>
              {item.quantity * item.price} บาท
            </span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>รวมทั้งหมด</span>
          <span>{payment.total} บาท</span>
        </div>

        <Link
          href="/home"
          className="block mt-6 text-center bg-green-600 text-white py-2 rounded-lg"
        >
          กลับหน้า Dashboard
        </Link>
      </div>
    </div>
  );
}