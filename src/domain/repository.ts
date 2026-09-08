import type { Attempt } from '../domain/types';

const STORAGE_KEY = 'lld_platform_attempts';

export class AttemptRepository {
  public static getAllAttempts(): Attempt[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load attempts from localStorage', e);
      return [];
    }
  }

  public static getAttemptsByProblem(problemId: string): Attempt[] {
    return this.getAllAttempts().filter(a => a.problemId === problemId);
  }

  public static saveAttempt(attempt: Attempt): void {
    try {
      const existing = this.getAllAttempts();
      const updated = [attempt, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save attempt', e);
    }
  }

  public static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
