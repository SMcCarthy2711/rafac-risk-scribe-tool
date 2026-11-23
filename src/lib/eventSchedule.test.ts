import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextScheduleItem, scheduleEndsAfterStart } from './eventSchedule';

test('next item starts on the previous finish date and time', () => {
  const next = nextScheduleItem({ date: '2026-11-23', end_date: '2026-11-24', end_time: '00:30:00' });
  assert.equal(next.date, '2026-11-24');
  assert.equal(next.start_time, '00:30');
  assert.equal(next.end_date, '2026-11-24');
  assert.equal(next.activity, '');
  assert.equal(next.end_time, '');
});
test('legacy schedules use their existing date for the next start', () => {
  assert.equal(nextScheduleItem({ date: '2026-11-23', end_time: '15:45:00' }).date, '2026-11-23');
});
test('schedule finish must follow its start, allowing overnight activities', () => {
  const item = { date: '2026-11-23', end_date: '2026-11-23', start_time: '23:00', end_time: '01:00' };
  assert.equal(scheduleEndsAfterStart(item), false);
  assert.equal(scheduleEndsAfterStart({ ...item, end_date: '2026-11-24' }), true);
});