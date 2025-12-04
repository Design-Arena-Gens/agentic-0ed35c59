"use client";

import { useMemo, useState } from "react";
import type { Phone, SortOption } from "@/lib/data";
import {
  brands as allBrands,
  filterByPriceRange,
  getPriceMetrics,
  sortPhones,
} from "@/lib/data";
import { PhoneCard } from "./PhoneCard";

interface PhoneExplorerProps {
  phones: Phone[];
}

const sortLabels: Record<SortOption, string> = {
  "best-price": "کمترین قیمت",
  "price-spread": "بیشترین اختلاف",
  newest: "جدیدترین",
  brand: "مرتب‌سازی برند",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PhoneExplorer({ phones }: PhoneExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("best-price");
  const [minInput, setMinInput] = useState<string>("");
  const [maxInput, setMaxInput] = useState<string>("");

  const priceBounds = useMemo(() => {
    if (!phones.length) {
      return { min: 0, max: 0 };
    }
    const min = Math.min(...phones.map((phone) => getPriceMetrics(phone).lowest.price));
    const max = Math.max(...phones.map((phone) => getPriceMetrics(phone).highest.price));
    return { min, max };
  }, [phones]);

  const filteredPhones = useMemo(() => {
    const minValue = minInput ? Number(minInput) : null;
    const maxValue = maxInput ? Number(maxInput) : null;

    const normalizedMin = Number.isFinite(minValue ?? NaN) ? minValue : null;
    const normalizedMax = Number.isFinite(maxValue ?? NaN) ? maxValue : null;

    let scoped = filterByPriceRange(phones, normalizedMin, normalizedMax);

    if (selectedBrand !== "all") {
      scoped = scoped.filter((phone) => phone.brand === selectedBrand);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      scoped = scoped.filter((phone) => {
        const haystack = [
          phone.name,
          phone.brand,
          phone.highlight,
          phone.specs.display,
          phone.specs.storage,
          phone.specs.camera,
          phone.specs.battery,
          phone.specs.chipset,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    return sortPhones(scoped, sort);
  }, [phones, maxInput, minInput, searchTerm, selectedBrand, sort]);

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">جستجوی سریع</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="نام دستگاه، برند یا ویژگی را وارد کنید..."
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">انتخاب برند</span>
            <select
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">همه برندها</option>
              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              حداقل قیمت (ریال)
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={priceBounds.min.toString()}
              value={minInput}
              onChange={(event) => setMinInput(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              حداکثر قیمت (ریال)
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={priceBounds.max.toString()}
              value={maxInput}
              onChange={(event) => setMaxInput(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            {filteredPhones.length} مدل مطابق با فیلترهای انتخابی
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">مرتب‌سازی:</span>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {Object.entries(sortLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSort(value as SortOption)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    sort === value
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            ارزان‌ترین مدل فعلی:{" "}
            <strong className="text-slate-700">
              {formatCurrency(priceBounds.min)}
            </strong>
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            گران‌ترین مدل موجود:{" "}
            <strong className="text-slate-700">
              {formatCurrency(priceBounds.max)}
            </strong>
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPhones.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            مدلی با فیلترهای فعلی یافت نشد. فیلترها را تغییر دهید یا عبارت جستجو را
            ساده‌تر کنید.
          </div>
        ) : (
          filteredPhones.map((phone) => <PhoneCard key={phone.id} phone={phone} />)
        )}
      </div>
    </section>
  );
}
