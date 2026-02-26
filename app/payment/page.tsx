import Link from "next/link";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ConfirmPaymentButton from "../components/ConfirmPaymentButton";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {

  // ============================================
  // SERVER ACTION: ระบบขายแบบใช้ TRANSACTION
  // ============================================
  async function handlePayment(formData: FormData) {
    "use server";

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const productIds = formData.getAll("productId");
      const quantities = formData.getAll("quantity");

      let total = 0;
      const items: any[] = [];

      for (let i = 0; i < productIds.length; i++) {
        const productId = Number(productIds[i]);
        const qty = Number(quantities[i]);

        if (!productId || !qty || qty <= 0) continue;

        // 🔒 ล็อกแถวสินค้า ป้องกัน stock ติดลบ
        const [rows]: any = await connection.execute(
          "SELECT id, product_name, price, stock FROM products WHERE id = ? FOR UPDATE",
          [productId]
        );

        const product = rows[0];
        if (!product) continue;

        if (product.stock < qty) {
          throw new Error(`สินค้า ${product.product_name} ไม่พอ`);
        }

        const subtotal = product.price * qty;
        total += subtotal;

        items.push({
          productId,
          qty,
          price: product.price,
          name: product.product_name,
        });
      }

      if (items.length === 0) {
        throw new Error("ไม่มีสินค้าในรายการ");
      }

      // =============================
      // 1️⃣ บันทึก payments
      // =============================
      const [paymentResult]: any = await connection.execute(
        "INSERT INTO payments (total) VALUES (?)",
        [total]
      );

      const paymentId = paymentResult.insertId;

      // =============================
      // 2️⃣ บันทึก payment_items
      // =============================
      for (const item of items) {

        await connection.execute(
          "INSERT INTO payment_items (payment_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [paymentId, item.productId, item.qty, item.price]
        );

        // ตัด stock
        await connection.execute(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.qty, item.productId]
        );
      }

      await connection.commit();
      connection.release();

      // ไปหน้าใบเสร็จ
      redirect(`/receipt/${paymentId}`);

    } catch (error) {
      await connection.rollback();
      connection.release();
      redirect("/payment");
    }
  }

  // =============================
  // โหลดสินค้า
  // =============================
  const [rows] = await db.execute(
    "SELECT id, product_name, price, stock FROM products WHERE stock > 0"
  );

  const products = rows as any[];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-6">Bann Gas</h1>

        <Link href="/home" className="block mb-3 hover:text-blue-600">
          Dashboard
        </Link>

        <Link
          href="/payment"
          className="block font-medium text-green-600"
        >
          จ่ายเงิน
        </Link>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          ระบบขายสินค้า (PRO)
        </h2>

        <form action={handlePayment} className="space-y-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-lg shadow border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ราคา {product.price} บาท | คงเหลือ {product.stock}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="hidden"
                    name="productId"
                    value={product.id}
                  />

                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    max={product.stock}
                    defaultValue="0"
                    className="w-20 border rounded p-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* ✅ ใช้ปุ่มแบบ Popup แทน submit ปกติ */}
          <ConfirmPaymentButton />

        </form>
      </div>
    </div>
  );
}