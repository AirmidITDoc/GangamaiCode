import { Component, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
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

  formatDate(date: any): string {
    if (!date) return 'N/A';

    try {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || 'N/A';
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
