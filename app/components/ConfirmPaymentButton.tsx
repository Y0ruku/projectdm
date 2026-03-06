"use client";

import { useState } from "react";

export default function ConfirmPaymentButton() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"cash" | "qr" | null>(null);
  const [cashReceived, setCashReceived] = useState("");
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  function calculateTotal() {
    const quantityInputs = document.querySelectorAll(
      'input[name*="[quantity]"]'
    );

    let sum = 0;

    quantityInputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const qty = Number(element.value);
      const price = Number(element.dataset.price || 0);

      if (qty > 0 && price > 0) {
        sum += qty * price;
      }
    });

    setTotal(sum);
    return sum;
  }

  function handleOpen() {
    const sum = calculateTotal();

    if (sum <= 0) {
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

  const change =
    cashReceived !== "" ? Number(cashReceived) - total : 0;

  const isCashValid =
    method === "cash"
      ? cashReceived !== "" && Number(cashReceived) >= total
      : true;

  return (
    <>
      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleOpen}
        className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition"
      >
        ยืนยันการชำระเงิน
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

            <h2 className="text-2xl font-semibold text-center mb-6">
              ชำระเงิน
            </h2>

            <div className="bg-gray-100 rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-green-600">
                  {total.toLocaleString()} บาท
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`py-3 rounded-xl border transition ${
                  method === "cash"
                    ? "bg-green-600 text-white border-green-600 shadow"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                เงินสด
              </button>

              <button
                type="button"
                onClick={() => setMethod("qr")}
                className={`py-3 rounded-xl border transition ${
                  method === "qr"
                    ? "bg-green-600 text-white border-green-600 shadow"
                    : "bg-white hover:bg-gray-50"
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
                  className="w-full border rounded-lg p-3 mb-3"
                  placeholder="กรอกจำนวนเงิน"
                />

                <div className="flex justify-between text-sm">
                  <span>เงินทอน</span>
                  <span className="font-semibold text-green-600">
                    {change > 0 ? change.toLocaleString() : 0} บาท
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
              <div className="mb-6 flex flex-col items-center">

                <button
                  type="button"
                  onClick={() => {
                    if (total > 0) {
                      window.location.href = `/payment/qr/${total}`;
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
                >
                  สร้าง QR PromptPay
                </button>

                <p className="text-sm text-gray-500 mt-3">
                  QR จะสร้างตามยอดเงิน {total.toLocaleString()} บาท
                </p>

              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-lg bg-gray-200"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={!method || !isCashValid || total <= 0}
                className="px-5 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-400"
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