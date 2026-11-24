import { format, isValid, parse } from 'date-fns';

export function parseDateEntry(value: string): string | undefined {
  if (!/^\d{2}\/\d{2}\/[1-9]\d{3}$/.test(value)) return undefined;
  const date = parse(value, 'dd/MM/yyyy', new Date());
  if (!isValid(date) || format(date, 'dd/MM/yyyy') !== value) return undefined;
  return format(date, 'yyyy-MM-dd');
}

export function displayDateEntry(value: string): string {
  if (!value) return '';
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(date) ? format(date, 'dd/MM/yyyy') : value;
}