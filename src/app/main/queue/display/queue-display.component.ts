import { Component } from '@angular/core';
import { map, timer } from 'rxjs';
import { QueueEntry } from '../queue.models';
import { QueueService } from '../queue.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({ selector: 'app-queue-display', templateUrl: './queue-display.component.html', styleUrls: ['./queue-display.component.scss'] })
export class QueueDisplayComponent {
  hospitalName = 'Airmid Hospital'; // TODO: bind to your config
  now$ = timer(0, 1000).pipe(map(() => new Date()));
  inRoom$ = this.q.inRoom$;
  waiting$ = this.q.waiting$.pipe(map(l => l.slice(0, 10)));
  waitingCount$ = this.q.waiting$.pipe(map(l => l.length));
  constructor(private q: QueueService,  private _fuseConfigService: FuseConfigService) {
    this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
  }
  trackId(_: number, e: QueueEntry) { return e.id; }

}
