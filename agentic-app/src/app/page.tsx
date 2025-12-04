import { MarketHighlights } from "@/components/MarketHighlights";
import { PhoneExplorer } from "@/components/PhoneExplorer";
import { buildMarketSnapshot } from "@/lib/analytics";
import { phones } from "@/lib/data";

export default function Home() {
  const snapshot = buildMarketSnapshot(phones);

  return (
    <main className="relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 lg:px-12">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                ربات هوشمند تلگرام آنالیز قیمت موبایل
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                دیتابیس زنده قیمت موبایل با هوش بازار
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                این داشبورد همان موتور تحلیل‌گر است که ربات تلگرام روی آن ساخته شده.
                آخرین قیمت‌ها، اختلاف فروشندگان و وضعیت موجودی را ببینید و تصمیم خرید
                مطمئن بگیرید.
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 p-1 shadow-lg">
              <div className="rounded-[26px] bg-white/95 p-6 text-right text-sm text-slate-600">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                  اتصال سریع ربات
                </p>
                <p className="mt-3 text-xl font-semibold text-slate-900">
                  https://t.me/mobilewatcher_bot
                </p>
                <p className="mt-2 leading-relaxed">
                  ربات از همین داده استفاده می‌کند. وبهوک Next.js در مسیر{" "}
                  <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs">
                    /api/bot
                  </code>{" "}
                  آماده اتصال است.
                </p>
              </div>
            </div>
          </div>
        </header>

        <MarketHighlights snapshot={snapshot} />

        <PhoneExplorer phones={phones} />
      </div>
    </main>
  );
}
