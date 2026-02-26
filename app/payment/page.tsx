import Link from "next/link";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ConfirmPaymentButton from "../components/ConfirmPaymentButton";
import QuantityInput from "../components/QuantityInput";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {

  // ===============================
  // SERVER ACTION
  // ===============================
  async function handlePayment(formData: FormData) {
    "use server";

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {

      let total = 0;
      const items: any[] = [];

      const quantityEntries = Array.from(formData.entries())
        .filter(([key]) => key.includes("[quantity]"));

      for (const [key, value] of quantityEntries) {

        const match = key.match(/items\[(.*?)\]/);
        if (!match) continue;

        const indexKey = match[1];

        const productId = Number(
          formData.get(`items[${indexKey}][productId]`)
        );

        const qty = Number(value);

        if (!productId || !qty || qty <= 0) continue;

        const [rows]: any = await connection.execute(
          "SELECT id, product_name, price, stock FROM products WHERE id = ? FOR UPDATE",
          [productId]
        );

        const product = rows[0];
        if (!product) continue;

        if (product.stock < qty) {
          throw new Error(`สินค้า ${product.product_name} ไม่พอ`);
        }

        total += product.price * qty;

        items.push({
          productId,
          qty,
          price: product.price,
        });
      }

      if (items.length === 0) {
        throw new Error("ไม่มีสินค้าในรายการ");
      }

      const [paymentResult]: any = await connection.execute(
        "INSERT INTO payments (total) VALUES (?)",
        [total]
      );

      const paymentId = paymentResult.insertId;

      for (const item of items) {

        await connection.execute(
          "INSERT INTO payment_items (payment_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [paymentId, item.productId, item.qty, item.price]
        );

        await connection.execute(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.qty, item.productId]
        );
      }

      await connection.commit();
      connection.release();

      redirect(`/receipt/${paymentId}`);

    } catch (error) {
      await connection.rollback();
      connection.release();
      redirect("/payment");
    }
  }

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const [rows] = await db.execute(`
    SELECT 
      p.id,
      p.product_name,
      p.price,
      p.stock,
      c.id AS category_id,
      c.category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.stock > 0
    ORDER BY c.id, p.product_name
  `);

  const products = rows as any[];

  const groupedProducts = products.reduce((acc: any, product) => {
    if (!acc[product.category_id]) {
      acc[product.category_id] = {
        category_name: product.category_name,
        items: [],
      };
    }
    acc[product.category_id].items.push(product);
    return acc;
  }, {});

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-10">Bann Gas</h1>

        <Link
          href="/home"
          className="block mb-5 hover:text-blue-600 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/payment"
          className="block font-semibold text-green-600"
        >
          จ่ายเงิน
        </Link>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-12">
        <h2 className="text-3xl font-bold mb-10">
          ระบบขายสินค้า
        </h2>

        <form action={handlePayment} className="space-y-8">

          {Object.values(groupedProducts).map((group: any, index) => (
            <details
              key={index}
              className="bg-white rounded-2xl shadow-md border overflow-hidden"
            >
              <summary className="cursor-pointer px-8 py-5 font-semibold text-xl bg-gray-100 hover:bg-gray-200 transition">
                {group.category_name}
              </summary>

              <div className="p-8 space-y-6">
                {group.items.map((product: any) => {

                  const indexKey = product.id;

                  return (
                    <div
                      key={product.id}
                      className="flex justify-between items-center border-b pb-5"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          ราคา {product.price.toLocaleString()} บาท
                          <span className="mx-3">|</span>
                          คงเหลือ {product.stock}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">

                        <input
                          type="hidden"
                          name={`items[${indexKey}][productId]`}
                          value={product.id}
                        />

                        <QuantityInput
                          name={`items[${indexKey}][quantity]`}
                          max={product.stock}
                          price={product.price}   // ✅ สำคัญมาก
                        />

                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}

          <div className="pt-8">
            <ConfirmPaymentButton />
          </div>

        </form>
      </div>
    </div>
  );
}