"use client";

import { useState } from "react";
import type { Phone, PricePoint } from "@/lib/data";
import { getPriceMetrics } from "@/lib/data";

interface PhoneCardProps {
  phone: Phone;
}

const priceStatusLabel: Record<PricePoint["stock"], string> = {
  "in-stock": "موجود",
  "low-stock": "موجودی محدود",
  "out-of-stock": "ناموجود",
};

const stockPillStyles: Record<PricePoint["stock"], string> = {
  "in-stock": "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
  "low-stock": "bg-amber-100 text-amber-700 ring-amber-500/20",
  "out-of-stock": "bg-rose-100 text-rose-700 ring-rose-500/20",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - Date.parse(iso);
  const minutes = Math.round(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.round(hours / 24);
  return `${days} روز پیش`;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const [expanded, setExpanded] = useState(false);
  const metrics = getPriceMetrics(phone);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr] md:gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={phone.image}
              alt={phone.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="grid w-full grid-cols-2 gap-2 text-center text-sm text-slate-500">
            <div className="rounded-xl border border-slate-200/60 bg-slate-50 py-2">
              <p className="text-xs text-slate-400">کمترین قیمت</p>
              <p className="font-semibold text-slate-800">
                {formatCurrency(metrics.lowest.price)}
              </p>
              <p className="text-xs text-emerald-600">{metrics.lowest.store}</p>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-slate-50 py-2">
              <p className="text-xs text-slate-400">بیشترین قیمت</p>
              <p className="font-semibold text-slate-800">
                {formatCurrency(metrics.highest.price)}
              </p>
              <p className="text-xs text-rose-600">{metrics.highest.store}</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "پنهان کردن مشخصات" : "نمایش مشخصات"}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {phone.brand}
              </span>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                {phone.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{phone.highlight}</p>
            </div>
            <div className="flex flex-col items-end gap-1 rounded-2xl bg-slate-50 px-4 py-3 text-right">
              <p className="text-sm text-slate-400">اختلاف قیمت</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(metrics.spread)}
              </p>
              <p className="text-xs text-slate-400">
                آخرین به‌روزرسانی {formatRelativeTime(metrics.lowest.updatedAt)}
              </p>
            </div>
          </div>

          <div
            className={`grid gap-4 text-sm text-slate-600 transition-all ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
              <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div>
                  <dt className="text-xs text-slate-400">نمایشگر</dt>
                  <dd className="font-medium text-slate-700">
                    {phone.specs.display}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">حافظه</dt>
                  <dd className="font-medium text-slate-700">
                    {phone.specs.storage}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">دوربین</dt>
                  <dd className="font-medium text-slate-700">
                    {phone.specs.camera}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">باتری</dt>
                  <dd className="font-medium text-slate-700">
                    {phone.specs.battery}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">پردازنده</dt>
                  <dd className="font-medium text-slate-700">
                    {phone.specs.chipset}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">تاریخ عرضه</dt>
                  <dd className="font-medium text-slate-700">{phone.release}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
              <span>فروشنده</span>
              <span className="hidden w-24 text-center sm:block">ارسال</span>
              <span className="w-28 text-center">وضعیت</span>
              <span className="w-28 text-left">قیمت</span>
            </div>
            {phone.prices.map((price) => (
              <a
                key={price.store}
                href={price.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-transparent bg-white/80 px-4 py-3 text-sm transition hover:border-slate-200 hover:bg-white"
              >
                <div className="font-medium text-slate-800">{price.store}</div>
                <div className="hidden w-24 text-center text-xs text-slate-500 sm:block">
                  {price.shipping === "free" ? "ارسال رایگان" : "هزینه ارسال"}
                </div>
                <span
                  className={`inline-flex w-28 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${stockPillStyles[price.stock]}`}
                >
                  {priceStatusLabel[price.stock]}
                </span>
                <div className="w-28 text-left font-semibold text-slate-900">
                  {formatCurrency(price.price)}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
