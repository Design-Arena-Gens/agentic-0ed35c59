"use client";

import type { MarketSnapshot } from "@/lib/analytics";

interface MarketHighlightsProps {
  snapshot: MarketSnapshot;
}

function formatCurrency(value: number) {
  if (!value) return "۰ ریال";
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function MarketHighlights({ snapshot }: MarketHighlightsProps) {
  return (
    <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 p-6 shadow-inner">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            ضربان بازار موبایل امروز
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            داده‌های تازه‌شده از فروشگاه‌های معتبر بازار ایران. برای اتصال مستقیم ربات
            تلگرام از همین داده‌ها استفاده می‌کند.
          </p>

          <dl className="mt-6 grid gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                میانگین قیمت فعلی
              </dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {formatCurrency(snapshot.averagePrice)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                اختلاف میانه بازار
              </dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {formatCurrency(snapshot.medianSpread)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                تعداد پیشنهادها
              </dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {snapshot.totalListings.toLocaleString("fa-IR")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-white/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
              بهترین ارزش خرید
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {snapshot.bestValue.name}
              <span className="mr-2 text-sm font-medium text-slate-500">
                ({snapshot.bestValue.brand})
              </span>
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              کمترین قیمت از فروشگاه {snapshot.bestValue.store}
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(snapshot.bestValue.price)}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
              برندهای با ثبات قیمت
            </p>
            <ul className="mt-2 space-y-3 text-sm text-slate-600">
              {snapshot.risingBrands.map((brand) => (
                <li
                  key={brand.brand}
                  className="flex items-center justify-between rounded-xl border border-blue-50 bg-blue-50/60 px-3 py-2"
                >
                  <span className="font-medium text-slate-800">{brand.brand}</span>
                  <div className="text-right text-xs text-slate-500">
                    <p>
                      میانگین اختلاف{" "}
                      <strong className="font-semibold text-slate-800">
                        {formatCurrency(brand.avgSpread)}
                      </strong>
                    </p>
                    <p>
                      بیشترین اختلاف{" "}
                      <strong className="font-semibold text-slate-800">
                        {formatCurrency(brand.maxSpread)}
                      </strong>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
