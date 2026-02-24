import Link from "next/link";

export default function ProductsPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 สินค้าของเรา</h1>

      <ul>
        <li>เสื้อยืด - 199 บาท</li>
        <li>กางเกง - 399 บาท</li>
        <li>รองเท้า - 899 บาท</li>
      </ul>

      <Link href="/">
        <button>กลับหน้าแรก</button>
      </Link>
    </div>
  );
}