import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // ใส่รหัสผ่าน mysql ของคุณ
  database: "projectdm", // ชื่อ database ที่สร้างไว้
});