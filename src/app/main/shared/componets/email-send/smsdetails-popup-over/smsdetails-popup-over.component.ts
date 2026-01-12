import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { OPListService } from 'app/main/opd/new-oplist/oplist.service';

@Component({
  selector: 'app-smsdetails-popup-over',
  templateUrl: './smsdetails-popup-over.component.html',
  styleUrls: ['./smsdetails-popup-over.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SMSDetailsPopupOverComponent {
  @Input() patientData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  patientDetails: any = null;
  mailDetails: any = null;
  isLoading: boolean = false;
  BillNo = 0
  constructor(
    private _OPListService: OPListService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.patientData && this.patientData.billNo || this.patientData.pBillNo || this.patientData.grnNumber || this.patientData.purchaseNo) {
      this.patientDetails = this.patientData;
      if (this.patientData.billNo)
        this.BillNo = this.patientData.billNo
      else if (this.patientData.pBillNo)
        this.BillNo = this.patientData.pBillNo
      else if (this.patientData.grnNumber)
        this.BillNo = this.patientData.grnNumber
      else if (this.patientData.purchaseNo)
        this.BillNo = this.patientData.purchaseNo
      //  else   if(this.patientData.billNo )
      //        this.BillNo=this.patientData.billNo 



      console.log(this.patientDetails)
      this.loadPatientDetails();
    }
  }

  loadPatientDetails() {
    this.isLoading = true;
    this._OPListService.getSMSDetailsById(this.patientData.billNo).subscribe(
      (response: any) => {
        this.mailDetails = response;
        console.log(this.mailDetails)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading patient details:', error);
        this.isLoading = false;
        // Fallback to available data
        this.mailDetails = null;
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


