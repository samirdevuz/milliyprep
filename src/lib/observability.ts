export type LogLevel = "info" | "warn" | "error";

type EventFields = Record<string, unknown>;

function safeValue(value: unknown): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message.slice(0, 500),
      digest:
        "digest" in value && typeof value.digest === "string"
          ? value.digest
          : undefined,
    };
  }
  if (Array.isArray(value)) return value.slice(0, 20).map(safeValue);
  return String(value).slice(0, 500);
}

export function logEvent(
  level: LogLevel,
  event: string,
  fields: EventFields = {}
): void {
  const payload: EventFields = {
    timestamp: new Date().toISOString(),
    service: "milliyprep-web",
    event,
  };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) payload[key] = safeValue(value);
  }

  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

