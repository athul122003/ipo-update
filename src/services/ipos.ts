function safe(value: any, fallback = "N/A") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return String(value);
}

function safeNumber(value: any, fallback = "N/A") {
  const num = Number(value);
  if (isNaN(num)) return fallback;
  return num;
}

function escapeMarkdown(text: string) {
  // Telegram MarkdownV2 escaping (safe for names)
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

export function formatIpoMessage(ipos: any[]) {
  let message = `📢 *IPO Updates (Live)*\n\n`;

  if (!Array.isArray(ipos) || ipos.length === 0) {
    return message + "_No active IPOs found._";
  }

  for (const ipo of ipos) {
    const companyName = escapeMarkdown(
      safe(ipo.companyName, "Unknown Company")
    );

    const symbol = safe(ipo.symbol);
    const issueStart = safe(ipo.issueStartDate);
    const issueEnd = safe(ipo.issueEndDate);

    const priceBand = ipo.issuePrice
      ? ipo.issuePrice.replace("Rs.", "₹")
      : "N/A";

    const issueSizeNum = safeNumber(ipo.issueSize);
    const issueSizeCr =
      issueSizeNum !== "N/A"
        ? ((issueSizeNum as number) / 1e7).toFixed(2) + " Cr shares"
        : "N/A";

    const subscriptionNum = safeNumber(ipo.noOfTime);
    const subscription =
      subscriptionNum !== "N/A" ? `${(subscriptionNum as number).toFixed(2)}×` : "N/A";

    const statusEmoji =
      typeof subscriptionNum === "number" && subscriptionNum >= 1 ? "🔥" : "🟡";

    message +=
      `${statusEmoji} *${companyName}*\n` +
      `• Symbol: ${symbol}\n` +
      `• Issue: ${issueStart} – ${issueEnd}\n` +
      `• Price Band: ${priceBand}\n` +
      `• Issue Size: ${issueSizeCr}\n` +
      `• Subscription: *${subscription}*\n\n`;
  }

  return message.trim();
}

export async function getIpos() {
  const response = await fetch(
    "https://www.nseindia.com/api/ipo-current-issue"
  );
  const ipos = await response.json();

  const message = formatIpoMessage(ipos);
  return message;
}
