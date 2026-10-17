import { describe, it, expect, beforeEach } from 'vitest';
import { getLocalMentorResponse, sendAICoachMessage } from '../src/services/ai';
import { saveUserProfile } from '../src/db/index';

describe('Progress & Mentor AI Service', () => {
  beforeEach(() => {
    localStorage.clear();
    saveUserProfile({ currentWeightKg: 83, heightCm: 165, age: 26, targetWeightKg: 65 });
  });

  describe('Local Mentor Engine (Offline Fallback)', () => {
    it('provides joint-friendly knee protection advice when asked about knee or pain', () => {
      const response = getLocalMentorResponse('lutut saya agak pegal hari ini');
      expect(response.toLowerCase()).toContain('lutut');
      expect(response).toMatch(/(glute bridge|kursi|istirahat|kompres)/i);
    });

    it('provides deficit nutrition advice when asked about food or calories', () => {
      const response = getLocalMentorResponse('menu makan siang apa yang bagus untuk defisit?');
      expect(response).toMatch(/(kalori|protein|sayur|defisit)/i);
    });

    it('provides motivational guidance for general questions', () => {
      const response = getLocalMentorResponse('bagaimana memulai lari pertama saya?');
      expect(response.length).toBeGreaterThan(30);
    });
  });

  describe('sendAICoachMessage', () => {
    it('falls back to local mentor response when no gemini key is configured', async () => {
      const reply = await sendAICoachMessage('apakah push up di lantai aman?');
      expect(reply).toBeDefined();
      expect(typeof reply).toBe('string');
      expect(reply.length).toBeGreaterThan(20);
    });
  });
});
