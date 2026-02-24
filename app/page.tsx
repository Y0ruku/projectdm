import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-800">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-semibold text-gray-900">Baan Gas</h1>
        <div className="space-x-6 text-gray-600">
          <Link href="/products" className="hover:text-black transition">
            สินค้า
          </Link>
          <Link href="/about" className="hover:text-black transition">
            เกี่ยวกับเรา
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          ช้อปง่าย ได้ของไว
        </h2>

        <p className="text-lg text-gray-500 mb-8 max-w-xl">
          พบกับสินค้าคุณภาพดี ราคาคุ้มค่า พร้อมโปรโมชั่นพิเศษทุกวัน
        </p>

        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
        >
          เริ่มช้อปเลย
        </Link>
      </section>

      {/* Feature Section */}
      <section className="flex-grow border-t border-gray-200 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          
          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">จัดส่งรวดเร็ว</h3>
            <p className="text-gray-500 text-sm">
              ส่งสินค้าทั่วประเทศ ภายใน 1-3 วันทำการ
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">ชำระเงินปลอดภัย</h3>
            <p className="text-gray-500 text-sm">
              รองรับหลายช่องทางการชำระเงิน ปลอดภัย 100%
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">สินค้าคุณภาพ</h3>
            <p className="text-gray-500 text-sm">
              คัดสรรสินค้าอย่างดี พร้อมรับประกันความพึงพอใจ
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 text-center py-6 text-gray-400 text-sm">
        © 2026 Baan Gas. All rights reserved.
      </footer>

    </main>
  );
}