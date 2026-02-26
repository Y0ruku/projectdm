"use client";

import { useState } from "react";
import Image from "next/image";

export default function ConfirmPaymentButton() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"cash" | "qr" | null>(null);
  const [cashReceived, setCashReceived] = useState<string>("");
  const [error, setError] = useState<string>("");

  const total = 0;

  const change =
    cashReceived !== "" ? Number(cashReceived) - total : 0;

  const isCashValid =
    method === "cash"
      ? cashReceived !== "" && Number(cashReceived) >= total
      : true;

  function checkHasProductSelected() {
    const quantityInputs = document.querySelectorAll(
      'input[name="quantity"]'
    );

    for (let input of quantityInputs) {
      const value = Number((input as HTMLInputElement).value);
      if (value > 0) return true;
    }

    return false;
  }

  function handleOpen() {
    const hasProduct = checkHasProductSelected();

    if (!hasProduct) {
      setError("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }

    setError("");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setMethod(null);
    setCashReceived("");
  }

  return (
    <>
      {/* แสดง error ถ้าไม่มีสินค้า */}
      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      {/* ปุ่มเปิด popup */}
      <button
        type="button"
        onClick={handleOpen}
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
      >
        ยืนยันการชำระเงิน
      </button>

      {/* POPUP */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-[420px] rounded-xl shadow-2xl p-6">

            <h2 className="text-xl font-semibold text-center mb-4">
              เลือกวิธีชำระเงิน
            </h2>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`flex-1 py-2 rounded-lg border ${
                  method === "cash"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white"
                }`}
              >
                เงินสด
              </button>

              <button
                type="button"
                onClick={() => setMethod("qr")}
                className={`flex-1 py-2 rounded-lg border ${
                  method === "qr"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white"
                }`}
              >
                สแกน QR
              </button>
            </div>

            {method === "cash" && (
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-600">
                  รับเงินมา (บาท)
                </label>

                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="กรอกจำนวนเงิน"
                  className="w-full border rounded p-2 mb-3"
                />

                <div className="text-sm text-gray-700">
                  เงินทอน:{" "}
                  <span className="font-semibold text-green-600">
                    {change > 0 ? change : 0} บาท
                  </span>
                </div>

                {cashReceived !== "" &&
                  Number(cashReceived) < total && (
                    <div className="text-sm text-red-500 mt-2">
                      จำนวนเงินไม่เพียงพอ
                    </div>
                  )}
              </div>
            )}

            {method === "qr" && (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  สแกนเพื่อชำระเงินผ่านพร้อมเพย์
                </p>

                <div className="flex justify-center">
                  <Image
                    src="/qr.jpg"
                    alt="QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={!method || !isCashValid}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                ยืนยันชำระเงิน
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}