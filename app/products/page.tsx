// import Link from "next/link";
// import { db } from "@/lib/db";

// interface Props {
//   searchParams: { category?: string };
// }

// export default async function ProductsPage({ searchParams }: Props) {
//   const categoryId = searchParams.category;

//   if (!categoryId) {
//     return (
//       <div className="p-10">
//         <Link
//           href="/home"
//           className="inline-block mb-6 text-sm text-blue-600 hover:underline"
//         >
//           ← กลับหน้าแรก
//         </Link>
//         <h1 className="text-2xl font-bold mb-6">รายการสินค้า</h1>
//         <p className="text-gray-500">กรุณาเลือกหมวดสินค้า</p>
//       </div>
//     );
//   }

//   // ดึงเฉพาะหมวดที่เลือก พร้อมชื่อหมวด
//   const [rows] = await db.execute(
//     `
//     SELECT p.*, c.category_name
//     FROM products p
//     JOIN categories c ON p.category_id = c.id
//     WHERE p.category_id = ?
//     `,
//     [categoryId]
//   );

//   const products = rows as any[];

//   return (
//     <div className="p-10">
//       <Link
//         href="/home"
//         className="inline-block mb-6 text-sm text-blue-600 hover:underline"
//       >
//         ← กลับหน้าแรก
//       </Link>

//       <h1 className="text-2xl font-bold mb-6">
//         หมวด: {products[0]?.category_name}
//       </h1>

//       {products.length === 0 && (
//         <p className="text-gray-500">ไม่มีสินค้าในหมวดนี้</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {products.map((product) => (
//           <div key={product.id} className="border rounded-lg p-4 shadow-sm">
//             <h2 className="font-semibold text-lg">
//               {product.product_name}
//             </h2>
//             <p className="text-gray-600 mt-2">
//               ราคา: {product.price} บาท
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }