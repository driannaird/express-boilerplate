export const INDONESIA_TIMEZONES = {
  WIB: "Asia/Jakarta",
  WITA: "Asia/Makassar",
  WIT: "Asia/Jayapura",
} as const;

type DateFormatOptions = {
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

export const formatDateTime = (
  value: Date | string | null | undefined,
  options: DateFormatOptions = {}
): string | null => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(options.locale ?? "id-ID", {
    timeZone: options.timeZone ?? INDONESIA_TIMEZONES.WIB,
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle ?? "medium",
  }).format(date);
};
