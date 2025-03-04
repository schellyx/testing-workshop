import { describe, it, expect } from 'vitest';
import { validateScore } from '../src/validateScore.js';
describe('validateScore', () => {
  it('should return valid result for a valid score', () => {
    expect(validateScore(75)).toEqual({
      valid: true,
      score: 75,
      passed: true,
      grade: 'C',
      errors: []
    });
  });
  it('should return an error if score is missing', () => {
    expect(validateScore(undefined)).toEqual({
      valid: false,
      score: undefined,
      passed: false,
      grade: '',
      errors: ['Score ist erforderlich']
    });
  });
  it('should return an error if score is not a number', () => {
    expect(validateScore('abc')).toEqual({
      valid: false,
      score: 'abc',
      passed: false,
      grade: '',
      errors: ['Score muss eine Zahl sein']
    });
  });
  it('should return an error if score is out of range', () => {
    expect(validateScore(105)).toEqual({
      valid: false,
      score: 105,
      passed: false,
      grade: '',
      errors: ['Score muss zwischen 0 und 100 liegen']
    });
  });
  it('should enforce strict mode validation', () => {
    expect(validateScore(75.5, { strictMode: true })).toEqual({
      valid: false,
      score: 75.5,
      passed: false,
      grade: '',
      errors: ['Score muss eine ganze Zahl sein']
    });
  });
  it('should apply bonus points correctly', () => {
    expect(validateScore(85, { bonusCategories: ['extra work', 'participation'] })).toEqual({
      valid: true,
      score: 89, // 85 + (2 * 2) = 89
      passed: true,
      grade: 'B',
      errors: []
    });
  });
  it('should cap bonus points at 10', () => {
    expect(validateScore(85, { bonusCategories: ['a', 'b', 'c', 'd', 'e', 'f'] })).toEqual({
      valid: true,
      score: 95, // 85 + 10 (max bonus) = 95
      passed: true,
      grade: 'A',
      errors: []
    });
  });
  it('should correctly determine pass/fail status', () => {
    expect(validateScore(59, { passingScore: 60 })).toEqual({
      valid: true,
      score: 59,
      passed: false,
      grade: 'F',
      errors: []
    });
    expect(validateScore(60, { passingScore: 60 })).toEqual({
      valid: true,
      score: 60,
      passed: true,
      grade: 'D',
      errors: []
    });
  });
  it('should correctly assign grades', () => {
    expect(validateScore(95)).toMatchObject({ grade: 'A' });
    expect(validateScore(85)).toMatchObject({ grade: 'B' });
    expect(validateScore(75)).toMatchObject({ grade: 'C' });
    expect(validateScore(65)).toMatchObject({ grade: 'D' });
    expect(validateScore(50)).toMatchObject({ grade: 'F' });
  });
});