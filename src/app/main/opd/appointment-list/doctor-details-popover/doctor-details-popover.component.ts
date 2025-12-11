import { Component, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DoctorMasterService } from 'app/main/setup/doctor/doctor-master/doctor-master.service';

@Component({
  selector: 'app-doctor-details-popover',
  templateUrl: './doctor-details-popover.component.html',
  styleUrls: ['./doctor-details-popover.component.scss']
})
export class DoctorDetailsPopoverComponent implements OnInit {
  @Input() doctorData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  doctorDetails: any = null;
  isLoading: boolean = false;

  constructor(
    private _DoctorMasterService: DoctorMasterService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.doctorData && this.doctorData.doctorId) {
      this.loadDoctorDetails();
    } else if (this.doctorData && this.doctorData.consultantDocId) {
      this.loadDoctorDetailsById(this.doctorData.consultantDocId);
    } else {
      // Use available data from doctorData if doctorId is not available
      this.doctorDetails = this.doctorData;
    }
  }

  loadDoctorDetails() {
    this.isLoading = true;
    const doctorId = this.doctorData.doctorId || this.doctorData.consultantDocId;
    this._DoctorMasterService.getDoctorById(doctorId).subscribe(
      (response: any) => {
        this.doctorDetails = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading doctor details:', error);
        this.isLoading = false;
        // Fallback to available data
        this.doctorDetails = this.doctorData;
      }
    );
  }

  loadDoctorDetailsById(doctorId: number) {
    this.isLoading = true;
    this._DoctorMasterService.getDoctorById(doctorId).subscribe(
      (response: any) => {
        this.doctorDetails = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading doctor details:', error);
        this.isLoading = false;
        // Fallback to available data
        this.doctorDetails = this.doctorData;
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

  getDoctorName(): string {
    if (this.doctorDetails) {
      return this.doctorData?.doctorName ||
        (this.doctorDetails.firstName || '') + ' ' +
        (this.doctorDetails.middleName || '') + ' ' +
        (this.doctorDetails.lastName || '') ||
        this.doctorData?.doctorname || 'N/A';
    }
    return this.doctorData?.doctorname || this.doctorData?.doctorName || 'N/A';
  }

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }
}

