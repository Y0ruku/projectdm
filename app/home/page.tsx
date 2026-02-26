import Link from "next/link";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import StockModal from "../components/StockModal";
import SettingsDropdown from "../components/SettingsDropdown";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search || "";

  // ======================
  // UPDATE STOCK
  // ======================
  async function updateStock(formData: FormData) {
    "use server";

    const productId = Number(formData.get("productId"));
    const amount = Number(formData.get("amount"));
    const type = formData.get("type");

    if (!productId || !amount || amount <= 0) {
      redirect("/home");
    }

    if (type === "increase") {
      await db.execute(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [amount, productId]
      );
    } else {
      await db.execute(
        `UPDATE products 
         SET stock = GREATEST(stock - ?, 0)
         WHERE id = ?`,
        [amount, productId]
      );
    }

    redirect("/home");
  }

  // ======================
  // LOGOUT
  // ======================
  async function logout() {
    "use server";

    const cookieStore = await cookies();
    cookieStore.delete("token");

    redirect("/");
  }

  // ======================
  // CATEGORIES
  // ======================
  const [catRows] = await db.execute("SELECT * FROM categories");
  const categories = catRows as any[];

  // ======================
  // PRODUCTS
  // ======================
  let productQuery = "SELECT * FROM products";
  let values: any[] = [];

  if (search) {
    productQuery += " WHERE product_name LIKE ?";
    values.push(`%${search}%`);
  }

  const [productRows] = await db.execute(productQuery, values);
  const products = productRows as any[];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-semibold">Bann Gas</h1>
          <p className="text-xs text-gray-400">
            Management System
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          {/* Dashboard */}
          <Link
            href="/home"
            className="block px-4 py-2 rounded-lg bg-gray-200 font-medium"
          >
            Dashboard
          </Link>

          {/* เพิ่มหน้าจ่ายเงิน */}
          <Link
            href="/payment"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            จ่ายเงิน
          </Link>

          <div className="mt-4">
            <p className="px-4 text-xs text-gray-400 uppercase mb-2">
              สินค้า
            </p>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.id}`}
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {cat.category_name}
              </Link>
            ))}
          </div>

          <Link
            href="/about"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            เกี่ยวกับเรา
          </Link>
        </nav>

        <div className="px-6 py-4 border-t text-sm text-gray-500">
          Logged in as Admin
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b shadow-sm px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Dashboard</h2>
          <SettingsDropdown logoutAction={logout} />
        </header>

        {/* MAIN */}
        <main className="flex-1 p-10">

          {/* ปุ่มไปหน้าจ่ายเงิน */}
          <div className="mb-6 flex justify-end">
            <Link
              href="/payment"
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              + ไปหน้าจ่ายเงิน
            </Link>
          </div>

          {/* SEARCH */}
          <form className="mb-8">
            <input
              type="text"
              name="search"
              placeholder="ค้นหาสินค้า..."
              defaultValue={search}
              className="w-full md:w-1/2 p-3 border rounded-lg"
            />
          </form>

          <h3 className="text-xl font-semibold mb-6">
            {search
              ? `ผลการค้นหา: "${search}"`
              : "สินค้าทั้งหมด"}
          </h3>

          {products.length === 0 && (
            <p className="text-gray-500">
              ไม่พบสินค้า
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-xl shadow-sm border"
              >
                <h4 className="font-semibold text-lg">
                  {product.product_name}
                </h4>

                <p className="text-gray-500 mt-2">
                  ราคา: {product.price} บาท
                </p>

                <p
                  className={`mt-2 font-medium ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  คงเหลือ: {product.stock} ชิ้น
                </p>

                <div className="flex gap-3 mt-4">
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
        </main>

        <footer className="bg-white border-t text-center py-4 text-gray-400 text-sm">
          © 2026 Baan Gas. All rights reserved.
        </footer>
      </div>
    </div>
  );
}