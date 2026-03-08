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
        className="bg-green-600 text-white px-8 py-3 rounded-xl shadow hover:bg-green-700 transition font-semibold"
      >
        ยืนยันการชำระเงิน
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-green-600 text-white p-5 text-center">
              <h2 className="text-xl font-semibold">
                ระบบชำระเงิน
              </h2>
              <p className="text-sm opacity-80">
                Payment Confirmation
              </p>
            </div>

            <div className="p-8">

              {/* TOTAL */}
              <div className="bg-gray-100 rounded-xl p-5 mb-6">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    ยอดรวมที่ต้องชำระ
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {total.toLocaleString()} บาท
                  </p>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                <button
                  type="button"
                  onClick={() => setMethod("cash")}
                  className={`p-4 rounded-xl border text-center transition ${
                    method === "cash"
                      ? "bg-green-600 text-white border-green-600 shadow"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-1">💵</div>
                  เงินสด
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("qr")}
                  className={`p-4 rounded-xl border text-center transition ${
                    method === "qr"
                      ? "bg-green-600 text-white border-green-600 shadow"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-1">📱</div>
                  QR Payment
                </button>

              </div>

              {/* CASH */}
              {method === "cash" && (
                <div className="mb-6">

                  <label className="block mb-2 text-sm text-gray-600">
                    รับเงินจากลูกค้า
                  </label>

                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                    placeholder="กรอกจำนวนเงิน"
                  />

                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">

                    <span className="text-gray-600">
                      เงินทอน
                    </span>

                    <span className="text-xl font-bold text-green-600">
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

              {/* QR */}
              {method === "qr" && (
                <div className="mb-6 flex flex-col items-center">

                  <div className="border rounded-xl p-4 shadow-sm">
                    <img
                      src="/qr.jpg"
                      alt="QR PromptPay"
                      className="w-56 h-56 object-contain"
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-3 text-center">
                    สแกน QR เพื่อชำระเงิน
                  </p>

                </div>
              )}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={!method || !isCashValid || total <= 0}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                >
                  ยืนยันการชำระเงิน
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}