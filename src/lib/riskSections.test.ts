import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitRisks } from './riskSections';
import type { RiskEntry } from './types';
const risk = (Ref: string, section?: RiskEntry['section']) => ({ Ref, section } as RiskEntry);
test('unclassified saved risks remain activity risks', () => {
  assert.deepEqual(splitRisks([risk('1')]).activity.map(r => r.Ref), ['1']);
});
test('environmental risks are grouped after activity risks without losing references', () => {
  const grouped = splitRisks([risk('1', 'environmental'), risk('2', 'activity'), risk('3', 'environmental')]);
  assert.deepEqual([...grouped.activity, ...grouped.environmental].map(r => r.Ref), ['2', '1', '3']);
});
test('moving a risk back to activity removes it from the environmental group', () => {
  const moved = { ...risk('1', 'environmental'), section: 'activity' as const };
  assert.equal(splitRisks([moved]).environmental.length, 0);
  assert.equal(splitRisks([moved]).activity[0].Ref, '1');
});
