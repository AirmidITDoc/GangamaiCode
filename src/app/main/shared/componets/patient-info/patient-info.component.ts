import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent {
 
  @Input() label: string = "";
  private _placeholder: string = '';
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(): void {
  
    // this.data.regId=11
    // this.data.patientName='Sagar Divakar'
    // this.data.doctorname='Nitin Kale'
    // this.data.opdNo=121
    // this.data.ageYear='22'
    // this.data.genderName='Male'
    // this.data.departmentName="Phy"
    // this.data.patientType='Self'
    // this.data.tariffName='Cash'
    // this.data.companyName="AIRMID"
    // this.data.refDocName="Satish Patil"


    // this.PName='GANGAMI HOSPITAL'
    // this.PAddress='Plot No 1 CS No 279/2, Solapur City, Near Railway Under Park Modi Khana, Solapur-413007';
    // this.Phone='9765999855';
    // this.EmailId='GangamaiHospitalsolapur@gmail.com';

  
  }

    @Input()
      get placeholder(): string {
        this.data=this.label
        console.log(this.label)
          return this._placeholder ?? this.label;
}

  //  @Input()
  //     get value(): string {
  //         return this.control.value;
  //     }
  //     set value(value: string) {
  //         this.control.setValue(value);
  //         this.stateChanges.next();
  //     }
  
      
}
