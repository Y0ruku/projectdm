"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  product: {
    id: number;
    product_name: string;
    stock: number;
  };
  actionType: "increase" | "decrease";
  serverAction: (formData: FormData) => void;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "กำลังอัปเดต..." : "ยืนยัน"}
    </button>
  );
}

export default function StockModal({
  product,
  actionType,
  serverAction,
}: Props) {
  const [open, setOpen] = useState(false);

  const isIncrease = actionType === "increase";
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      {/* ปุ่มหลัก */}
      <button
        onClick={() => {
          if (!isIncrease && isOutOfStock) return;
          setOpen(true);
        }}
        disabled={!isIncrease && isOutOfStock}
        className={`px-4 py-1.5 rounded-lg text-white font-medium transition
        ${
          isIncrease
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-500 hover:bg-red-600"
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isIncrease ? "เพิ่ม" : "ลด"}
      </button>

      {/* POPUP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              {isIncrease ? "เพิ่มสินค้า" : "ลดสินค้า"}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              สินค้า: {product.product_name}
              <br />
              คงเหลือปัจจุบัน: {product.stock} ชิ้น
            </p>

            <form
              action={serverAction}
              onSubmit={() => setOpen(false)}
              className="space-y-4"
            >
              <input
                type="hidden"
                name="productId"
                value={product.id}
              />
              <input
                type="hidden"
                name="type"
                value={actionType}
              />

              <div>
                <label className="block text-sm mb-1">
                  จำนวน
                </label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  max={!isIncrease ? product.stock : undefined}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  ยกเลิก
                </button>

                <SubmitButton disabled={!isIncrease && isOutOfStock} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}