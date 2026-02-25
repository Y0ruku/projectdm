import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, amount, type } = await req.json();

    if (type === "increase") {
      await db.execute(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [amount, id]
      );
    } else {
      await db.execute(
        "UPDATE products SET stock = GREATEST(stock - ?,0) WHERE id = ?",
        [amount, id]
      );
    }

    const [rows]: any = await db.execute(
      "SELECT stock FROM products WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      newStock: rows[0].stock,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}