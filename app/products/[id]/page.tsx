import { db } from "@/lib/db";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import StockModal from "./StockModal";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!categoryId || isNaN(categoryId)) {
    return <div className="p-10">ไม่พบหมวดสินค้า</div>;
  }

  // Server Action ตัวเดียวจบ
  async function updateStock(formData: FormData) {
    "use server";

    const productId = Number(formData.get("productId"));
    const amount = Number(formData.get("amount"));
    const type = formData.get("type");

    if (!productId || !amount || amount <= 0) return;

    if (type === "increase") {
      await db.execute(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [amount, productId]
      );
    } else {
      await db.execute(
        `
        UPDATE products
        SET stock = CASE
          WHEN stock >= ? THEN stock - ?
          ELSE 0
        END
        WHERE id = ?
        `,
        [amount, amount, productId]
      );
    }

    revalidatePath(`/products/${categoryId}`);
  }

  const [rows] = await db.execute(
    `
    SELECT p.*, c.category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
    `,
    [categoryId]
  );

  const products = rows as any[];

  return (
    <div className="p-10">
      <Link href="/home" className="text-blue-600">
        ← กลับหน้าแรก
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">
        หมวด: {products[0]?.category_name || "ไม่มีข้อมูล"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-semibold text-lg">
              {product.product_name}
            </h2>

            <p>ราคา: {product.price} บาท</p>

            <p className="mt-2 text-blue-600 font-semibold">
              คงเหลือ: {product.stock} ชิ้น
            </p>

            <div className="flex gap-3 mt-3">
              <StockModal
                product={product}
                actionType="decrease"
                serverAction={updateStock}
              />

              <StockModal
                product={product}
                actionType="increase"
                serverAction={updateStock}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}