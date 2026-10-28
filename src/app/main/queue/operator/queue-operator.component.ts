import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEPARTMENTS, QueueEntry } from '../queue.models';
import { QueueService } from '../queue.service';

@Component({ selector: 'app-queue-operator', templateUrl: './queue-operator.component.html', styleUrls: ['./queue-operator.component.scss'] })
export class QueueOperatorComponent {
  departments = DEPARTMENTS;
  form = { name: '', uhid: '', department: DEPARTMENTS[0], doctor: '' };
  waiting$ =[];// this.q.waiting$;
  inRoom$ =[];// this.q.inRoom$;
  done$ =[];// this.q.done$;
  constructor(public q: QueueService, private snack: MatSnackBar) {}

  register() {
    if (!this.form.name.trim()) return;
    //this.q.add({ ...this.form, name: this.form.name.trim() });
    this.snack.open(`${this.form.name.trim()} added to queue`, 'OK', { duration: 2000 });
    this.form = { ...this.form, name: '', uhid: '' };
  }
  openDisplay() { window.open(`${location.pathname.replace('/operator', '')}/display`, '_blank'); }
  trackId(_: number, e: QueueEntry) { return e.visitId; }
  mins(from?: number) { return from ? Math.max(0, Math.round((Date.now() - from) / 60000)) : 0; }
}
