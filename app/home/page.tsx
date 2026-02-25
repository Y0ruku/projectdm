import Link from "next/link";
import { db } from "@/lib/db";

export default async function HomePage() {
  const [rows] = await db.execute("SELECT * FROM categories");
  const categories = rows as any[];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Bann Gas
          </h1>
          <p className="text-xs text-gray-400">Management System</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          {/* ✅ กลับไปหน้า home */}
          <Link
            href="/home"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>

          <div className="mt-4">
            <p className="px-4 text-xs text-gray-400 uppercase mb-2">
              สินค้า
            </p>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
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

        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
          Logged in as Admin
        </div>
      </aside>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 flex flex-col">

        {/* ================= TOPBAR ================= */}
        <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-4 flex justify-between items-center">

          <h2 className="text-lg font-medium text-gray-900">
            Dashboard
          </h2>

          {/* SETTINGS DROPDOWN */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.983 5.5a1.5 1.5 0 012.034 0l.567.567a1.5 1.5 0 001.06.44h.802a1.5 1.5 0 011.5 1.5v.802a1.5 1.5 0 00.44 1.06l.567.567a1.5 1.5 0 010 2.034l-.567.567a1.5 1.5 0 00-.44 1.06v.802a1.5 1.5 0 01-1.5 1.5h-.802a1.5 1.5 0 00-1.06.44l-.567.567a1.5 1.5 0 01-2.034 0l-.567-.567a1.5 1.5 0 00-1.06-.44h-.802a1.5 1.5 0 01-1.5-1.5v-.802a1.5 1.5 0 00-.44-1.06l-.567-.567a1.5 1.5 0 010-2.034l.567-.567a1.5 1.5 0 00.44-1.06v-.802a1.5 1.5 0 011.5-1.5h.802a1.5 1.5 0 001.06-.44l.567-.567z"
                />
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
              </svg>
            </button>

            {/* ✅ เหลือแค่ออกจากระบบ */}
            <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

              <Link
                href="/"
                className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                ออกจากระบบ
              </Link>

            </div>
          </div>

        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ช้อปง่าย ได้ของไว
            </h2>

            <p className="text-gray-500 mb-6 max-w-xl mx-auto">
              พบกับสินค้าคุณภาพดี ราคาคุ้มค่า พร้อมโปรโมชั่นพิเศษทุกวัน
            </p>

            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              เริ่มช้อปเลย
            </Link>
          </div>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="bg-white border-t border-gray-200 text-center py-4 text-gray-400 text-sm">
          © 2026 Baan Gas. All rights reserved.
        </footer>

      </div>
    </div>
  );
}