import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDateEntry } from './dateEntry';

test('complete typed years remain 2027 rather than 0027', () => {
  assert.equal(parseDateEntry('24/11/2027'), '2027-11-24');
});
test('partial years and accidentally padded years are not committed', () => {
  for (const year of ['2', '20', '202', '0007', '0027']) assert.equal(parseDateEntry(`24/11/${year}`), undefined);
});
test('invalid calendar dates cannot be saved', () => {
  assert.equal(parseDateEntry('31/02/2027'), undefined);
  assert.equal(parseDateEntry('29/02/2028'), '2028-02-29');
});