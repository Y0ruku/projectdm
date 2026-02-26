"use client";

import { useState } from "react";

interface Props {
  name: string;
  max: number;
  price: number;
}

export default function QuantityInput({ name, max, price }: Props) {
  const [value, setValue] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // อนุญาตให้ว่างได้ชั่วคราว
    if (inputValue === "") {
      setValue("");
      setError("");
      return;
    }

    // 🔥 ตัดเลข 0 ด้านหน้าออก (กัน 05, 003)
    inputValue = inputValue.replace(/^0+(\d)/, "$1");

    let numberValue = Number(inputValue);

    if (numberValue < 0) numberValue = 0;

    if (numberValue > max) {
      numberValue = max;
      setError(`จำนวนสินค้าเกินจำนวนคงเหลือ (${max})`);
    } else {
      setError("");
    }

    setValue(String(numberValue));
  };

  const handleBlur = () => {
    // ถ้าออกจากช่องแล้วว่าง → กลับเป็น 0
    if (value === "") {
      setValue("0");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // ถ้าเป็น 0 แล้วคลิก → เลือกทั้งหมด
    if (value === "0") {
      e.target.select();
    }
  };

  return (
    <div className="flex flex-col items-end">
      <input
        type="number"
        name={name}
        value={value}
        min={0}
        max={max}
        data-price={price}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-20 border rounded-lg px-3 py-2 text-center outline-none
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}