import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultEntryService } from '../result-entry.service';

@Component({
    selector: 'app-outsource-details-popover',
    templateUrl: './outsource-details-popover.component.html',
    styleUrls: ['./outsource-details-popover.component.scss']
})
export class OutsourceDetailsPopoverComponent {
    @Input() outSourceData: any;
    @Output() mouseEnter = new EventEmitter<void>();
    @Output() mouseLeave = new EventEmitter<void>();

    outSourceDetails: any = null;
    isLoading: boolean = false;

    constructor(
        public _SampleService: ResultEntryService,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        if (this.outSourceData && this.outSourceData.regId) {
            this.loadoutSourceDetails();
        } else {
            // Use available data from outSourceData if regId is not available
            this.outSourceDetails = this.outSourceData;
        }
    }

    loadoutSourceDetails() {
        this.isLoading = true;
        // this._SampleService.getRegistraionById(this.outSourceData.regId).subscribe(
        //   (response: any) => {
        //     this.outSourceDetails = response;
        //     this.isLoading = false;
        //   },
        //   (error) => {
        //     console.error('Error loading outSource details:', error);
        //     this.isLoading = false;
        //     // Fallback to available data
        //     this.outSourceDetails = this.outSourceData;
        //   }
        // );
    }

    // formatDate(date: any): string {
    //   if (!date) return 'N/A';

    //   try {
    //     return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || 'N/A';
    //   } catch {
    //     return 'N/A';
    //   }
    // }

    formatDate(date: any): string {
        if (!date) return 'N/A';

        try {
            let parsedDate: Date;

            // ISO format → works directly
            if (typeof date === 'string' && date.includes('T')) {
                parsedDate = new Date(date);
            }
            // dd-MM-yyyy HH:mm:ss → manual parse
            else if (typeof date === 'string' && date.includes('-')) {
                const [d, t] = date.split(' ');
                const [day, month, year] = d.split('-').map(Number);
                const [hour, min, sec] = t.split(':').map(Number);

                parsedDate = new Date(year, month - 1, day, hour, min, sec);
            }
            // Date object
            else {
                parsedDate = new Date(date);
            }

            return this.datePipe.transform(parsedDate, 'dd/MM/yyyy HH:mm') || 'N/A';

        } catch {
            return 'N/A';
        }
    }

    onMouseEnter() {
        this.mouseEnter.emit();
    }

    onMouseLeave() {
        this.mouseLeave.emit();
    }
}
