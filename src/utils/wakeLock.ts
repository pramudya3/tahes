interface WakeLockSentinelLike {
  release: () => Promise<void>;
  released: boolean;
  addEventListener: (type: string, listener: () => void) => void;
}

class WakeLockService {
  private sentinel: WakeLockSentinelLike | null = null;
  private isActive = false;

  async request(): Promise<boolean> {
    this.isActive = true;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return false;
    }

    try {
      this.sentinel = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<WakeLockSentinelLike> } }).wakeLock.request('screen');
      if (this.sentinel) {
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  async release(): Promise<void> {
    this.isActive = false;
    if (this.sentinel && !this.sentinel.released) {
      try {
        await this.sentinel.release();
      } catch {
        // ignore
      }
      this.sentinel = null;
    }
  }

  // Handle re-aquiring on visibility change if still active
  handleVisibilityChange(): void {
    if (
      this.isActive &&
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible'
    ) {
      this.request();
    }
  }
}

export const wakeLockService = new WakeLockService();

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    wakeLockService.handleVisibilityChange();
  });
}
