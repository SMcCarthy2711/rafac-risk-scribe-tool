export const emptyScheduleItem = () => ({ date: '', end_date: '', start_time: '', end_time: '', activity: '', lead_person: '', target_audience: 'All', notes: '' });

export function nextScheduleItem(previous: { date: string; end_date?: string | null; end_time: string }) {
  const date = previous.end_date || previous.date;
  return { ...emptyScheduleItem(), date, end_date: date, start_time: previous.end_time.slice(0, 5) };
}

export function scheduleEndsAfterStart(item: { date: string; end_date: string; start_time: string; end_time: string }) {
  return `${item.end_date}T${item.end_time.slice(0, 5)}` > `${item.date}T${item.start_time.slice(0, 5)}`;
}