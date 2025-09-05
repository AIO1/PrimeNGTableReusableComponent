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
/*export function createTableOptions(overrides: Partial<ITableOptions> = {}): ITableOptions {
  return deepMerge(structuredClone(DEFAULT_TABLE_OPTIONS), overrides);
}*/
export function createTableOptions(overrides: Partial<ITableOptions> = {}): ITableOptions {
  const defaultsCopy = JSON.parse(JSON.stringify(DEFAULT_TABLE_OPTIONS)); // clona solo datos
  const merged = deepMerge(defaultsCopy as any, overrides);

  // reasignar funciones si existen en overrides
  if (overrides.rows?.style) merged.rows.style = overrides.rows.style;
  if (overrides.rows?.class) merged.rows.class = overrides.rows.class;

  return merged as ITableOptions;
}