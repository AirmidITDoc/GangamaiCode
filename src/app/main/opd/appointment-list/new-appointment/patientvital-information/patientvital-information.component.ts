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
    if ((this.data?.visitId ?? 0) > 0) {
      setTimeout(() => {
        this._OpAppointmentService.getVisitById(this.data.visitId).subscribe((response) => {
          this.registerObj1 = response;
          // this.regId=response.regId;
          // this.crossconForm.get("consultantDocId").setValue(this.registerObj1.consultantDocId)
     
          // this.ddldoctor.SetSelection(this.registerObj1.consultantDocId);
    
          // this.registerObj1.visitTime= this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm')
          console.log(response)
        });
      }, 500);
    }

    this.MyFormGroup = this.createMyForm();
  }
  createMyForm(){
    return this._formBuilder.group({
      Height: '',
      Weight: '',
      BMI: '',
      BSL: '',
      SpO2: [''],
      Pulse: [''],
      BP: [''],
      Temp: [''],
    });
  }

  
  getBMIcalculation() {
    if (this.vHeight > 0 && this.vWeight > 0) {
      let Height = (this.vHeight / 100)
      this.vBMI = Math.round((this.vWeight) / ((Height) * (Height)));
    }
    else if (this.vHeight <= 0) {
      this.vBMI = 0;
      //Swal.fire('Please enter Height')
    }
    else if (this.vWeight <= 0) {
      this.vBMI = 0;
      //Swal.fire('Please enter Weight')
    }
  }

  onSave(){
   
    let VitalInfoSave = {};
    VitalInfoSave['visitId'] = this.advanceObj.VisitId || 0 ;
    VitalInfoSave['height'] =  this.vHeight||  '' ;
    VitalInfoSave['pWeight'] = this.vWeight ||  '' ;
    VitalInfoSave['bmi'] = this.vBMI ||  '' ;
    VitalInfoSave['bsl'] = this.vBSL ||  '' ;
    VitalInfoSave['spO2'] = this.vSpO2 ||  '' ;
    VitalInfoSave['temp'] = this.vTemp  ||  '' ;
    VitalInfoSave['pulse'] = this.vPulse   ||  '' ;
    VitalInfoSave['bp'] = this.vBP ||  '' ; 

    let SubmitData={
      "updateVitalInformation":VitalInfoSave
    }
    console.log(SubmitData)
    this._OpAppointmentService.InsertVitalInfo(SubmitData).subscribe(response => {
      if(response){
      this.toastr.success('Record Saved Successfully.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });   
          this.onClose();
   
    } else {
      this.toastr.success('Record data not saved', 'error', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
    } 
  });  

}  

  onClose(){
    this.RegId = ''
    this.CompanyId = ''
    this.RegNo = ''
    this.PatientName = ''
    this.Doctorname = ''
    this.vOPDNo = ''
    this.AgeYear = ''
    this.AgeMonth = ''
    this.AgeDay = ''
    this.GenderName = ''
    this.DepartmentName = ''
    this.PatientType = ''
    this.Tarrifname = ''
    this.CompanyName = ''
    this.RefDocName = ''
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
