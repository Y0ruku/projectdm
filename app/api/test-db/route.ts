import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.query("SELECT 1");
    return NextResponse.json({ message: "Connected" });
  } catch (error: any) {
    console.error("DB ERROR:", error); // 👈 ดูที่ terminal
    return NextResponse.json(
      { message: "Error", error: error},
      { status: 500 }
    );
  }
}

