import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🏪 เกี่ยวกับร้าน</h1>
      <p>ร้านของเราเปิดมาแล้ว 5 ปี ขายสินค้าคุณภาพดี</p>

      <Link href="/">
        <button>กลับหน้าแรก</button>
      </Link>
    </div>
  );
}