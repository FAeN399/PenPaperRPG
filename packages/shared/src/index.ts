export const PROJECT_NAME = "PenPaperRPG";

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
