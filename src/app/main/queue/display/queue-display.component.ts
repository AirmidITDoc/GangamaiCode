import { Component, OnInit } from '@angular/core';
import { map, timer } from 'rxjs';
import { QueueEntry } from '../queue.models';
import { QueueService } from '../queue.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({ selector: 'app-queue-display', templateUrl: './queue-display.component.html', styleUrls: ['./queue-display.component.scss'] })
export class QueueDisplayComponent implements OnInit {
    hospitalName = 'Airmid Hospital'; // TODO: bind to your config
    now$ = timer(0, 1000).pipe(map(() => new Date()));
    inRoom$ = [];// this.q.inRoom$;
    waiting$ = [];//this.q.waiting$.pipe(map(l => l.slice(0, 10)));
    waitingCount$ = [];// this.q.waiting$.pipe(map(l => l.length));
    constructor(private q: QueueService, private _fuseConfigService: FuseConfigService) {
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
    trackId(_: number, e: QueueEntry) { return e.visitId; }
    ngOnInit(): void {
        this.BindQueueData();
    }
    BindQueueData() {
        this.q.getQueueData(0, 10).subscribe((data) => {
            const minDate = new Date('1900-01-01T00:00:00');
            this.waiting$ = data.data.filter((x: { conStartTime: string | number | Date; }) => x.conStartTime && new Date(x.conStartTime) <= minDate);
            this.inRoom$ = data.data.filter((x: { conStartTime: string | number | Date; conEndTime: string | number | Date; }) => x.conStartTime && new Date(x.conStartTime) > minDate && new Date(x.conEndTime) <= minDate);
        });
    }
}
