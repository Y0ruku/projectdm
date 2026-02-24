import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="p-10">

      <Link
        href="/home"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline"
      >
        ← กลับหน้าแรก
      </Link>

      <h1 className="text-2xl font-bold mb-4">รายการสินค้า</h1>

      {/* รายการสินค้า */}
    </div>
  );
}