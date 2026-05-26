export type Lang = 'en' | 'ar';

export function localize<T extends Record<string, any>>(
  item: T,
  lang: Lang,
): Record<string, any> {
  if (!item || typeof item !== 'object') return item;

  const result: Record<string, any> = {};

  for (const key of Object.keys(item)) {
    if (key.endsWith('En')) {
      const base = key.slice(0, -2); // 'nameEn' → 'name'
      const arKey = base + 'Ar';
      result[base] = lang === 'ar' && item[arKey] ? item[arKey] : item[key];
    } else if (key.endsWith('Ar')) {
      // skip — already handled above
      continue;
    } else if (Array.isArray(item[key])) {
      result[key] = item[key].map((el: any) => localize(el, lang));
    } else if (item[key] && typeof item[key] === 'object' && item[key].constructor === Object) {
      result[key] = localize(item[key], lang);
    } else {
      result[key] = item[key];
    }
  }

  return result;
}

export function localizeArray<T extends Record<string, any>>(
  items: T[],
  lang: Lang,
): Record<string, any>[] {
  return items.map((item) => localize(item, lang));
}