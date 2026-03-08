"use client";

import { useState, useTransition } from "react";

type Props = {
  product: {
    id: number;
    product_name: string;
    stock: number;
  };
  actionType: "increase" | "decrease";
  serverAction: (formData: FormData) => void;
};

export default function StockModal({
  product,
  actionType,
  serverAction,
}: Props) {

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(1);
  const [isPending, startTransition] = useTransition();

  const isIncrease = actionType === "increase";
  const isOutOfStock = product.stock <= 0;

  const handleSubmit = (formData: FormData) => {
    setOpen(false);

    startTransition(() => {
      serverAction(formData);
    });
  };

  const handleAmountChange = (value: number) => {
    if (value < 1) value = 1;

    if (!isIncrease && value > product.stock) {
      value = product.stock;
    }

    setAmount(value);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => {
          if (!isIncrease && isOutOfStock) return;
          setOpen(true);
        }}
        disabled={!isIncrease && isOutOfStock}
        className={`w-9 h-9 flex items-center justify-center rounded-lg text-white font-bold shadow transition
        ${
          isIncrease
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-500 hover:bg-red-600"
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isIncrease ? "+" : "-"}
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white w-96 rounded-2xl shadow-2xl p-6 animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">
                {isIncrease ? "เพิ่มสินค้า" : "ลดสินค้า"}
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

            </div>

            {/* PRODUCT INFO */}
            <div className="text-center mb-6">

              <p className="font-medium text-lg">
                {product.product_name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                คงเหลือ {product.stock} ชิ้น
              </p>

            </div>

            {/* INPUT */}
            <div className="mb-5">

              <label className="text-sm text-gray-600 mb-1 block">
                จำนวน
              </label>

              <input
                type="number"
                min="1"
                max={!isIncrease ? product.stock : undefined}
                value={amount}
                onChange={(e) =>
                  handleAmountChange(Number(e.target.value))
                }
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {!isIncrease && amount > product.stock && (
                <p className="text-red-500 text-xs mt-2">
                  จำนวนเกินสินค้าคงเหลือ
                </p>
              )}

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">

              {/* CANCEL */}
              <button
                onClick={() => setOpen(false)}
                className="w-full border rounded-lg py-2 hover:bg-gray-100 transition"
              >
                ยกเลิก
              </button>

              {/* CONFIRM */}
              <form action={handleSubmit} className="w-full">

                <input
                  type="hidden"
                  name="productId"
                  value={product.id}
                />

                <input
                  type="hidden"
                  name="amount"
                  value={amount}
                />

                <input
                  type="hidden"
                  name="type"
                  value={actionType}
                />

                <button
                  type="submit"
                  disabled={
                    isPending ||
                    amount < 1 ||
                    (!isIncrease && amount > product.stock)
                  }
                  className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isPending ? "กำลังบันทึก..." : "ยืนยัน"}
                </button>

              </form>

            </div>

          </div>

        </div>
      )}
    </>
  );
}