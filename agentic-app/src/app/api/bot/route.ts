import { NextRequest, NextResponse } from "next/server";
import { buildMarketSnapshot } from "@/lib/analytics";
import { getPriceMetrics, phones } from "@/lib/data";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = TELEGRAM_TOKEN
  ? `https://api.telegram.org/bot${TELEGRAM_TOKEN}`
  : null;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildHelpMessage() {
  return [
    "👋 به ربات تحلیل‌گر قیمت موبایل خوش آمدید!",
    "",
    "دستورات پیشنهادی:",
    "• /top — نمایش بهترین پیشنهاد امروز",
    "• /market — وضعیت کلی بازار",
    "• نام دستگاه یا برند را بنویسید تا قیمت‌های لحظه‌ای را ببینید.",
  ].join("\n");
}

function buildMarketMessage() {
  const snapshot = buildMarketSnapshot(phones);
  const lines = [
    "📊 وضعیت بازار موبایل امروز",
    `• میانگین قیمت: ${formatCurrency(snapshot.averagePrice)}`,
    `• اختلاف میانه بازار: ${formatCurrency(snapshot.medianSpread)}`,
    `• بهترین ارزش خرید: ${snapshot.bestValue.name} از برند ${snapshot.bestValue.brand} با قیمت ${formatCurrency(snapshot.bestValue.price)} در فروشگاه ${snapshot.bestValue.store}`,
  ];

  if (snapshot.risingBrands.length) {
    lines.push("", "برندهای با ثبات قیمت:");
    snapshot.risingBrands.forEach((brand, index) => {
      lines.push(
        `${index + 1}. ${brand.brand} — میانگین اختلاف ${formatCurrency(brand.avgSpread)}`,
      );
    });
  }

  return lines.join("\n");
}

function buildTopDealMessage() {
  const snapshot = buildMarketSnapshot(phones);
  return [
    "🏆 بهترین پیشنهاد امروز",
    `${snapshot.bestValue.name} (${snapshot.bestValue.brand})`,
    `قیمت: ${formatCurrency(snapshot.bestValue.price)} در فروشگاه ${snapshot.bestValue.store}`,
  ].join("\n");
}

function buildSearchMessage(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return buildHelpMessage();
  }

  const matches = phones.filter((phone) => {
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

    return haystack.includes(normalized);
  });

  if (!matches.length) {
    return [
      "نتیجه‌ای یافت نشد ❌",
      "نام دستگاه یا برند را دقیق‌تر وارد کنید. مثال:",
      "• iPhone 15 Pro",
      "• سامسونگ",
      "• شارژ 120 وات",
    ].join("\n");
  }

  return matches
    .slice(0, 4)
    .map((phone) => {
      const metrics = getPriceMetrics(phone);
      const prices = phone.prices
        .map(
          (price) =>
            `  • ${price.store}: ${formatCurrency(price.price)} (${price.stock === "in-stock" ? "موجود" : price.stock === "low-stock" ? "موجودی محدود" : "ناموجود"})`,
        )
        .join("\n");

      return [
        `📱 ${phone.name} — ${phone.brand}`,
        `کمترین قیمت: ${formatCurrency(metrics.lowest.price)} در ${metrics.lowest.store}`,
        `اختلاف بازار: ${formatCurrency(metrics.spread)}`,
        "فروشندگان:",
        prices,
      ].join("\n");
    })
    .join("\n\n");
}

async function sendTelegram(chatId: number, text: string) {
  if (!TELEGRAM_API) {
    return { status: "skipped", reason: "missing token" } as const;
  }

  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Telegram API error:", error);
    return { status: "error", detail: error } as const;
  }

  return { status: "sent" } as const;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Telegram bot webhook ready. Send POST requests from Telegram.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const message = payload?.message;

    if (!message || typeof message.text !== "string") {
      return NextResponse.json({ ok: true });
    }

    const text: string = message.text;
    const lower = text.toLowerCase();
    let reply: string;

    if (lower.startsWith("/start") || lower.startsWith("/help")) {
      reply = buildHelpMessage();
    } else if (lower.startsWith("/market")) {
      reply = buildMarketMessage();
    } else if (lower.startsWith("/top")) {
      reply = buildTopDealMessage();
    } else {
      reply = buildSearchMessage(text);
    }

    const chatId = message.chat?.id;
    const result = Number.isFinite(chatId) ? await sendTelegram(chatId, reply) : null;

    return NextResponse.json({
      ok: true,
      delivered: result?.status ?? "local",
      reply,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
}
