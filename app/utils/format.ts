import { Decimal } from "decimal.js";

export function formatMoney(value: string | number | Decimal) {
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
		minimumFractionDigits: 2,
	}).format(Number(value));
}

export function formatDate(value?: string) {
	if (!value) return "";
	return new Date(value).toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}
