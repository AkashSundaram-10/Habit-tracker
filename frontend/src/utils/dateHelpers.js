import { format, parseISO, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, formatStr);
}

export function formatDisplayDate(date) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }

  if (isToday(date)) {
    return 'Today';
  }

  return format(date, 'MMM dd, yyyy');
}

export function getTodayString() {
  return formatDate(new Date());
}

export function getWeekDates() {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(today, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end });
}

export function getCurrentMonth() {
  return format(new Date(), 'yyyy-MM');
}
