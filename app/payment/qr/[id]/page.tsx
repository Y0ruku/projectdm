import { db } from "@/lib/db";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import Link from "next/link";

export default async function QRPage({
  params,
}: {
  params: { id: string };
}) {

  const [rows]: any = await db.execute(
    "SELECT total FROM payments WHERE id = ?",
    [params.id]
  );

  const payment = rows[0];

  if (!payment) {
    return <div className="p-10">ไม่พบรายการ</div>;
  }

  // 🔥 สร้าง PromptPay Payload
  const payload = generatePayload("0812345678", {
    amount: payment.total,
  });

  // 🔥 สร้าง QR
  const qr = await QRCode.toDataURL(payload);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[380px]">

        <h1 className="text-xl font-bold mb-4">
          สแกน QR เพื่อชำระเงิน
        </h1>

        <img
          src={qr}
          alt="PromptPay QR"
          className="mx-auto w-64"
        />

        <p className="mt-6 text-2xl font-bold text-green-600">
          {payment.total} บาท
        </p>

        <div className="mt-6">
          <Link
            href="/payment"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
          >
            กลับ
          </Link>
        </div>

      </div>

    </div>
  );
}