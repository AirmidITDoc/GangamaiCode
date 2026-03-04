import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  styleUrls: ['./patient-information.component.scss']
})
export class PatientInformationComponent implements OnInit {

  @Input() uhidNo: string = '';
  @Input() patientName: string = '';
  @Input() doctorName: string = '';
  @Input() departmentName: string = '';
  @Input() doa: any;
  @Input() ipdNo: string = '';
  @Input() ageString: string = '';
  @Input() refDocName: string = '';
  @Input() wardBedName: string = '';
  @Input() patientType: string = '';
  @Input() tariffName: string = '';
  @Input() companyName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
