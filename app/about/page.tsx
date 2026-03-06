import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* ปุ่มกลับ */}
      <Link
        href="/home"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← กลับหน้าแรก
      </Link>

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow border">

        {/* หัวข้อ */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          เกี่ยวกับ Baan Gas
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Baan Gas คือระบบจัดการร้านค้า (POS System)
          ที่ช่วยให้ร้านค้าสามารถจัดการสินค้า การขาย
          และประวัติการชำระเงินได้อย่างสะดวก รวดเร็ว
          และลดความผิดพลาดในการทำงาน
        </p>

        {/* เส้นแบ่ง */}
        <div className="border-t my-6"></div>

        {/* จุดเด่น */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          ความสามารถของระบบ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">
              จัดการสินค้า
            </h3>
            <p className="text-gray-600 text-sm">
              เพิ่ม แก้ไข และดูจำนวนสินค้าในสต็อกได้ง่าย
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">
              ระบบขายสินค้า
            </h3>
            <p className="text-gray-600 text-sm">
              เลือกสินค้าและทำรายการขายได้อย่างรวดเร็ว
              เหมือนระบบ POS จริง
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">
              ประวัติการขาย
            </h3>
            <p className="text-gray-600 text-sm">
              ตรวจสอบรายการขายย้อนหลังได้ตลอดเวลา
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">
              ใช้งานง่าย
            </h3>
            <p className="text-gray-600 text-sm">
              ออกแบบมาให้ใช้งานง่าย เหมาะกับร้านค้าทั่วไป
            </p>
          </div>

        </div>

        {/* เส้นแบ่ง */}
        <div className="border-t my-8"></div>

        {/* footer */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Baan Gas POS System
        </div>

      </div>

    </div>
  );
}