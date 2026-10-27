import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { QueueEntry } from './queue.models';

/**
 * STATIC/MOCK implementation: state is kept in localStorage and synced between browser tabs
 * (open /queue and /queue/display in two tabs to see it live).
 * Production: call your API on each action and push updates to the LED page via SignalR
 * (see README -> "Wiring SignalR"). The public API of this service can stay the same.
 */
@Injectable({ providedIn: 'root' })
export class QueueService {
  private readonly LS = 'queue.entries.v1';
  private readonly subject = new BehaviorSubject<QueueEntry[]>(this.load());

  readonly entries$ = this.subject.asObservable();
  readonly waiting$ = this.entries$.pipe(map(e => e.filter(x => x.status === 'waiting').sort((a, b) => a.token - b.token)));
  readonly inRoom$ = this.entries$.pipe(map(e => e.filter(x => x.status === 'in').sort((a, b) => (a.inAt ?? 0) - (b.inAt ?? 0))));
  readonly done$ = this.entries$.pipe(map(e => e.filter(x => x.status === 'out').sort((a, b) => (b.outAt ?? 0) - (a.outAt ?? 0)).slice(0, 8)));

  constructor(zone: NgZone) {
    window.addEventListener('storage', ev => { if (ev.key === this.LS) zone.run(() => this.subject.next(this.load())); });
  }

  add(p: { name: string; uhid: string; department: string; doctor: string }) {
    const list = this.subject.value;
    const token = Math.max(0, ...list.map(x => x.token)) + 1;
    this.commit([...list, { ...p, id: crypto.randomUUID(), token, status: 'waiting', createdAt: Date.now() }]);
  }
  callIn(id: string) { this.patch(id, { status: 'in', inAt: Date.now() }); }
  markOut(id: string) { this.patch(id, { status: 'out', outAt: Date.now() }); }
  backToWaiting(id: string) { this.patch(id, { status: 'waiting', inAt: undefined }); }
  remove(id: string) { this.commit(this.subject.value.filter(x => x.id !== id)); }
  reset() { this.commit([]); }

  private patch(id: string, change: Partial<QueueEntry>) { this.commit(this.subject.value.map(x => (x.id === id ? { ...x, ...change } : x))); }
  private commit(list: QueueEntry[]) { localStorage.setItem(this.LS, JSON.stringify(list)); this.subject.next(list); }
  private load(): QueueEntry[] {
    try { const raw = localStorage.getItem(this.LS); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
    const now = Date.now();
    const mk = (token: number, name: string, department: string, doctor: string, status: QueueEntry['status']): QueueEntry =>
      ({ id: crypto.randomUUID(), token, name, uhid: `UH-${1000 + token}`, department, doctor, status, createdAt: now - (10 - token) * 60000, inAt: status === 'in' ? now : undefined });
    return [
      mk(1, 'Rahul Sharma', 'OPD - General', 'Dr. Mehta', 'in'), mk(2, 'Meena Patel', 'Cardiology', 'Dr. Shah', 'in'),
      mk(3, 'Amit Desai', 'OPD - General', 'Dr. Mehta', 'waiting'), mk(4, 'Sunita Joshi', 'Orthopedics', 'Dr. Rao', 'waiting'),
      mk(5, 'Kiran Vyas', 'Cardiology', 'Dr. Shah', 'waiting'), mk(6, 'Farhan Ali', 'Dental', 'Dr. Iyer', 'waiting'),
    ];
  }
}
