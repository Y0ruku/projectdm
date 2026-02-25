"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";

export default function SettingsDropdown({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      <div
        className={`absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-gray-400">
            admin@baangas.com
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 transition"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </form>
      </div>
    </div>
  );
}