import { Component, OnInit } from '@angular/core';
import { map, timer } from 'rxjs';
import { QueueEntry } from '../queue.models';
import { QueueService } from '../queue.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { SignalRService } from 'app/core/services/signalr.service';

@Component({ selector: 'app-queue-display', templateUrl: './queue-display.component.html', styleUrls: ['./queue-display.component.scss'] })
export class QueueDisplayComponent implements OnInit {
    hospitalName = 'Airmid Hospital'; // TODO: bind to your config
    now$ = timer(0, 1000).pipe(map(() => new Date()));
    inRoom$ = [];// this.q.inRoom$;
    waiting$ = [];//this.q.waiting$.pipe(map(l => l.slice(0, 10)));
    waitingCount$ = [];// this.q.waiting$.pipe(map(l => l.length));
    fullData=[];
    constructor(private q: QueueService, private signalRService: SignalRService, private _fuseConfigService: FuseConfigService) {
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
        this.signalRService.addReceiveQueueListener((mode, data) => {
            debugger
            if (mode == "CheckIn") {
                var item = this.waiting$.find(x => x.visitId == data.VisitId);
                if (item) {
                    this.inRoom$.push(item);
                    this.waiting$ = this.waiting$.filter(x => x.visitId != data.VisitId);
                }
                else {
                    this.BindQueueData();
                }
            }
            else if (mode == "CheckOut") {
                var item = this.inRoom$.find(x => x.visitId == data.VisitId);
                if (item) {
                    this.inRoom$ = this.inRoom$.filter(x => x.visitId != data.VisitId);
                }
                else {
                    this.BindQueueData();
                }
            }
            else if (mode == "Waiting") {
                this.fullData.push(data[0]);
                this.BindData(this.fullData);
            }
        });
    }
    BindQueueData() {
        this.q.getQueueData(0, 0).subscribe((data) => {
            this.fullData = data;
            this.BindData(this.fullData);
        });
    }
    BindData(data) {
        const minDate = new Date('1900-01-01T00:00:00');
        this.waiting$ = data.filter((x: { conStartTime: string | number | Date; }) => x.conStartTime && new Date(x.conStartTime) <= minDate);
        this.inRoom$ = data.filter((x: { conStartTime: string | number | Date; conEndTime: string | number | Date; }) => x.conStartTime && new Date(x.conStartTime) > minDate && new Date(x.conEndTime) <= minDate);

    }
}
