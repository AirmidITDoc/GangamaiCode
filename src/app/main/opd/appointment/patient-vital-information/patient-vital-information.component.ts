import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-vital-information',
  templateUrl: './patient-vital-information.component.html',
  styleUrls: ['./patient-vital-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PatientVitalInformationComponent implements OnInit {

 
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
  
  constructor( 
    public _OpAppointmentService: AppointmentSreviceService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PatientVitalInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog, 
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.advanceObj = this.data.registerObj;
      console.log( this.advanceObj)

      this.RegId = this.advanceObj.RegId,
      this.CompanyId = this.advanceObj.CompanyId,
      this.RegNo = this.advanceObj.RegNoWithPrefix,
      this.PatientName = this.advanceObj.PatientName,
      this.Doctorname = this.advanceObj.Doctorname,
      this.vOPDNo = this.advanceObj.OPDNo,
      this.AgeYear = this.advanceObj.AgeYear,
      this.AgeMonth = this.advanceObj.AgeMonth,
      this.AgeDay = this.advanceObj.AgeDay,
      // this.GenderName = this.advanceObj.RegId,
      this.DepartmentName = this.advanceObj.DepartmentName,
      this.PatientType = this.advanceObj.PatientType,
      this.Tarrifname = this.advanceObj.TariffName,
      this.CompanyName = this.advanceObj.CompanyName,
      this.RefDocName = this.advanceObj.RefDocName
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
    if (this.vHeight == '' || this.vHeight == undefined || this.vHeight == null || this.vHeight == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vWeight == '' || this.vWeight == undefined || this.vWeight == null || this.vWeight == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vBSL == '' || this.vBSL == undefined || this.vBSL == null || this.vBSL == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vSpO2 == '' || this.vSpO2 == undefined || this.vSpO2 == null || this.vSpO2 == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vPulse == '' || this.vPulse == undefined || this.vPulse == null || this.vPulse == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vBP == '' || this.vBP == undefined || this.vBP == null || this.vBP == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }   
    if (this.vTemp == '' || this.vTemp == undefined || this.vTemp == null || this.vTemp == '') {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }  
    
    let VitalInfoSave = {};
    VitalInfoSave['visitId'] = 0 ;
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
      this.toastr.success(' OP Bill Credit Record Saved Successfully.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });   
          this.onClose();
   
    } else {
      this.toastr.success('OP Billing data not saved', 'error', {
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
