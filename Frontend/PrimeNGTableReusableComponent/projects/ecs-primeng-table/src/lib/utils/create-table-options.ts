import { DEFAULT_TABLE_OPTIONS, ITableOptions } from '../interfaces';

/**
 * Deep merge two objects.
 * Recursively copies properties from `source` into `target`.
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) (target as any)[key] = {};
      deepMerge((target as any)[key], source[key]);
    } else {
      (target as any)[key] = source[key];
    }
  }
  return target;
}

/**
 * Create table options based on defaults, with optional overrides.
 */
export function createTableOptions(overrides: Partial<ITableOptions> = {}): ITableOptions {
  return deepMerge(structuredClone(DEFAULT_TABLE_OPTIONS), overrides);
}
