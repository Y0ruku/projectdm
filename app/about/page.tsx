import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen p-10 bg-gray-100">

      {/* ปุ่มกลับหน้าแรก */}
      <Link
        href="/home"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← กลับหน้าแรก
      </Link>

      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">เกี่ยวกับเรา</h1>

        <p className="text-gray-600">
          Baan Gas คือระบบจัดการร้านค้าออนไลน์
          ที่ออกแบบมาให้ใช้งานง่าย สะดวก และรวดเร็ว
        </p>
      </div>

    </div>
  );
}