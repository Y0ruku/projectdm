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

  // ป้องกันกรอกเกิน stock ตอนลด
  const handleAmountChange = (value: number) => {
    if (value < 1) value = 1;

    if (!isIncrease && value > product.stock) {
      value = product.stock;
    }

    setAmount(value);
  };

  return (
    <>
      {/* ปุ่มเปิด Modal */}
      <button
        onClick={() => {
          if (!isIncrease && isOutOfStock) return;
          setOpen(true);
        }}
        disabled={!isIncrease && isOutOfStock}
        className={`px-3 py-1 rounded text-white font-semibold transition
        ${
          isIncrease
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-500 hover:bg-red-600"
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isIncrease ? "+" : "-"}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-lg font-bold mb-2 text-center">
              {isIncrease ? "เพิ่มสินค้า" : "ลดสินค้า"}
            </h2>

            <p className="text-sm text-center mb-1">
              {product.product_name}
            </p>

            <p className="text-xs text-gray-500 text-center mb-4">
              คงเหลือ: {product.stock} ชิ้น
            </p>

            <input
              type="number"
              min="1"
              max={!isIncrease ? product.stock : undefined}
              value={amount}
              onChange={(e) =>
                handleAmountChange(Number(e.target.value))
              }
              className="w-full border p-2 rounded mb-4"
            />

            {!isIncrease && amount > product.stock && (
              <p className="text-red-500 text-xs mb-2 text-center">
                จำนวนเกินสินค้าคงเหลือ
              </p>
            )}

            <div className="flex justify-between gap-3">
              {/* ยกเลิก */}
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-gray-300 rounded py-2"
              >
                ยกเลิก
              </button>

              {/* ยืนยัน */}
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
                  className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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