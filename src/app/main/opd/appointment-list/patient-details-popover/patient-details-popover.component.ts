import { Component, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentlistService } from '../appointmentlist.service';

@Component({
  selector: 'app-patient-details-popover',
  templateUrl: './patient-details-popover.component.html',
  styleUrls: ['./patient-details-popover.component.scss']
})
export class PatientDetailsPopoverComponent implements OnInit {
  @Input() patientData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  patientDetails: any = null;
  isLoading: boolean = false;

  constructor(
    private _AppointmentlistService: AppointmentlistService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.patientData && this.patientData.regId) {
      this.loadPatientDetails();
    } else {
      // Use available data from patientData if regId is not available
      this.patientDetails = this.patientData;
    }
  }

  loadPatientDetails() {
    this.isLoading = true;
    this._AppointmentlistService.getRegistraionById(this.patientData.regId).subscribe(
      (response: any) => {
        this.patientDetails = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading patient details:', error);
        this.isLoading = false;
        // Fallback to available data
        this.patientDetails = this.patientData;
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

  formatAge(): string {
    if (!this.patientDetails) return 'N/A';
    const ageYear = this.patientDetails.ageYear || this.patientDetails.AgeYear || 0;
    const ageMonth = this.patientDetails.ageMonth || this.patientDetails.AgeMonth || 0;
    const ageDay = this.patientDetails.ageDay || this.patientDetails.AgeDay || 0;
    
    if (ageYear > 0) {
      return `${ageYear} Year${ageYear > 1 ? 's' : ''}`;
    } else if (ageMonth > 0) {
      return `${ageMonth} Month${ageMonth > 1 ? 's' : ''}`;
    } else if (ageDay > 0) {
      return `${ageDay} Day${ageDay > 1 ? 's' : ''}`;
    }
    return 'N/A';
  }

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }
}

