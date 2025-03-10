import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentlistService } from '../../appointmentlist.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { VisitMaster1 } from '../../appointment-list.component';

@Component({
  selector: 'app-patientvital-information',
  templateUrl: './patientvital-information.component.html',
  styleUrls: ['./patientvital-information.component.scss']
})
export class PatientvitalInformationComponent {

  RegId: any; 
  vClassId: any = 0;
  CompanyId: any = 0;  
  RegNo: any;
  PatientName: any;
  Doctorname: any;
  vOPDNo: any;
  AgeYear: any = 0;
  AgeMonth: any;
  AgeDay: any;
  GenderName: any;
  DepartmentName: any;
  PatientType: any;
  Tarrifname: any;
  CompanyName: any;
  RefDocName: any;
  advanceObj:any;
  MyFormGroup:FormGroup

  vHeight: any;
  vWeight: any;
  vBSL: any;
  vBMI: any;
  vBP: any;
  VisitId: any;
  vTemp: any;
  vSpO2: any;
  vPulse: any;
   registerObj1 = new VisitMaster1({});
   patientDetail1 = new VisitMaster1({});

  constructor( 
    public _OpAppointmentService: AppointmentlistService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PatientvitalInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog, 
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
   
    this.MyFormGroup = this.createMyForm();
    if(this.data){
      console.log(this.data)
      this.VisitId=this.data.visitId
            debugger
      setTimeout(() => {
        this._OpAppointmentService.getVisitById(this.VisitId).subscribe(data => {
          this.patientDetail1 = data;
          console.log(data)
          this.vHeight=data.height
          this.vWeight=data.pweight
          this.vBSL=data.bmi
          this.vBMI=data.bmi 
          this.vBP=data. bp
          this.vTemp=data.temp
          this.vSpO2=data.spO2
          this.vPulse=data.pulse
        });
      }, 1000);
    }

    
  }
  
  createMyForm(){
    return this._formBuilder.group({
      visitId:this.data.visitId,
      height: '',
      pweight: '',
      bmi: '',
      bsl: '',
      spO2: [''],
      temp: [''],
      pulse: [''],
      bp: [''],
    });
  }

  
  getBMIcalculation() {
    
    if (this.vHeight > 0 && this.vWeight > 0) {
      let Height = (this.vHeight / 100)
      this.vBMI = String(Math.round((this.vWeight) / ((Height) * (Height))));
    }
    else if (this.vHeight <= 0) {
      this.vBMI = 0;
     
    }
    else if (this.vWeight <= 0) {
      this.vBMI = 0;
      
    }
  }

  onSave(){
   let visitId=this.data.visitId
    console.log(this.MyFormGroup.value)
   this._OpAppointmentService.InsertVitalInfo(visitId,this.MyFormGroup.value).subscribe((response) => {
    this.toastr.success(response.message);
    console.log(response)
   this._matDialog.closeAll();
}, (error) => {
    this.toastr.error(error.message);
});

}  

  onClose(){
   
    this.MyFormGroup.reset();
    this._matDialog.closeAll();
  }



  @ViewChild('EHeight') EHeight: ElementRef;
  @ViewChild('EBSL') EBSL: ElementRef;
  @ViewChild('EWeight') EWeight: ElementRef;
  @ViewChild('ESpO2') ESpO2: ElementRef;
  @ViewChild('EPulse') EPulse: ElementRef;
  @ViewChild('EBMI') EBMI: ElementRef;
  @ViewChild('EBP') EBP: ElementRef;
  @ViewChild('ETemp') ETemp: ElementRef;
  
  public onEnterHeight(event): void {
    if (event.which === 13) {
      this.EWeight.nativeElement.focus();
    }
  }
  public onEnterWeight(event): void {
    if (event.which === 13) {
      this.EBSL.nativeElement.focus();
    }
  }
  public onEnterBSL(event): void {
    if (event.which === 13) {
      this.ESpO2.nativeElement.focus();
    }
  }
  public onEnterSpO2(event): void {
    if (event.which === 13) {
      this.EPulse.nativeElement.focus();
    }
  }
  public onEnterPulse(event): void {
    if (event.which === 13) {
      this.EBP.nativeElement.focus();
    }
  }
  public onEnterBMI(event): void {
    if (event.which === 13) {
    }
  }
  public onEnterBP(event): void {
    if (event.which === 13) {
      this.ETemp.nativeElement.focus();
    }
  }
  onEnterTemp(event): void {
    if (event.which === 13) {
      //this.ChiefComp.nativeElement.focus();
    }
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  ///[^a-zA-Z0-9]/
  keyPressOk(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
