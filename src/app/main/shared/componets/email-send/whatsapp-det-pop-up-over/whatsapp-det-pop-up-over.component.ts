import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { OPListService } from 'app/main/opd/new-oplist/oplist.service';

@Component({
  selector: 'app-whatsapp-det-pop-up-over',
  templateUrl: './whatsapp-det-pop-up-over.component.html',
  styleUrls: ['./whatsapp-det-pop-up-over.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class WhatsappDetPopUpOverComponent {
 @Input() patientData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  patientDetails: any = null;
  whatsappDetails: any = null;
  isLoading: boolean = false;

  constructor(
    private _OPListService: OPListService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    debugger
    if (this.patientData && this.patientData.billNo || this.patientData.pBillNo) {
       this.patientDetails = this.patientData;
       console.log(this.patientDetails)
      this.loadPatientDetails();
    }  
  }

  loadPatientDetails() {
    this.isLoading = true;
    debugger
    this._OPListService.getWhatsappDetailsById(this.patientData.billNo).subscribe(
      (response: any) => { 
        this.whatsappDetails = response;
        console.log(this.whatsappDetails)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading patient details:', error);
        this.isLoading = false;
        // Fallback to available data
        this.whatsappDetails = null;
      }
    );
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    try {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || 'N/A';
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
