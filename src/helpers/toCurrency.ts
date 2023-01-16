export const toCurrency = <T extends unknown>(
  n: T,
  curr: string,
  LanguageFormat = undefined
): T | string => {
  if (typeof n === 'number' && isFinite(n)) {
    return Intl.NumberFormat(LanguageFormat, {
      style: 'currency',
      currency: curr,
    }).format(n)
  }
  return n
}
