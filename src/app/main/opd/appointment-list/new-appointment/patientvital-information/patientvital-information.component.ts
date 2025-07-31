import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { VisitMaster1 } from '../../appointment-list.component';
import { AppointmentlistService } from '../../appointmentlist.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-patientvital-information',
  templateUrl: './patientvital-information.component.html',
  styleUrls: ['./patientvital-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
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
  advanceObj: any;
  MyFormGroup: FormGroup

  vHeight = 0;
  vWeight = 0;
  vBSL = "0";
  vBMI = "0";
  vBP = "0";
  VisitId: any;
  vTemp = "0";
  vSpO2 = "0";
  vPulse = "0";
  registerObj1 = new VisitMaster1({});
  patientDetail1 = new VisitMaster1({});

  constructor(
    public _OpAppointmentService: AppointmentlistService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PatientvitalInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.MyFormGroup = this.createMyForm();
    this.MyFormGroup.markAllAsTouched();
    if (this.data) {
      console.log(this.data)
      this.VisitId = this.data.visitId

      setTimeout(() => {
        this._OpAppointmentService.getVisitById(this.VisitId).subscribe(data => {
          this.patientDetail1 = data;
          console.log(data)
          this.vHeight = data.height
          this.vWeight = data.pweight
          this.vBSL = data.bsl
          this.vBMI = data.bmi
          this.vBP = data.bp
          this.vTemp = data.temp
          this.vSpO2 = data.spO2
          this.vPulse = data.pulse
        });
      }, 1000);
    }
  }

    // showing color for vitals

 getVitalColorClass(vital: string, value: any): string {
  const num = parseFloat(value);
  switch (vital) {
    case 'BMI':
      if (num < 18.5) return 'orange'; // Yellow
      if (num <= 24.9) return 'green'; // Green
      return 'red'; // Red

    case 'SpO2':
      return num < 95 ? 'orange' : 'green';

    case 'Pulse':
      if (num < 60) return 'orange';
      if (num <= 100) return 'green';
      return 'red';

    case 'BP':
      if (!value || typeof value !== 'string' || !value.includes('/')) return '';
      const [sys, dia] = value.split('/').map(Number);
      if (sys < 90 || dia < 60) return 'orange';
      if (sys > 120 || dia > 80) return 'red';
      return 'green';

    case 'Temp':
      if (num < 97) return 'orange';
      if (num <= 99) return 'green';
      return 'red';

    default:
      return '';
  }
}

  createMyForm() {
    return this._formBuilder.group({
      visitId: this.data.visitId,
      height: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.pattern("^[0-9]{1,3}$")]],
      pweight: ['', [Validators.required, Validators.maxLength(20),
      Validators.pattern("^[0-9]{1,3}$"), this._FormvalidationserviceService.allowEmptyStringValidator()]],
      bmi: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      bsl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      spO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      bp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
    });
  }

  getBMIcalculation() {
    // debugger
    if (this.vHeight > 0 && this.vWeight > 0) {
      let Height = (this.vHeight / 100)
      this.vBMI = String(Math.round((this.vWeight) / ((Height) * (Height))));
    }
    else if (this.vHeight <= 0) {
      this.vBMI = '0';

    }
    else if (this.vWeight <= 0) {
      this.vBMI = '0';

    }
  }

  onSave() {

    debugger
    if (!this.MyFormGroup.invalid) {
      let visitId = this.data.visitId
      // this.MyFormGroup.get('bmi').setValue(String(this.MyFormGroup.get('bmi')?.value)),
      this.MyFormGroup.get("bsl").setValue(this.vBSL || "0")
      this.MyFormGroup.get("spO2").setValue(this.vSpO2 || "0")
      this.MyFormGroup.get("pulse").setValue(this.vPulse || "0")
      this.MyFormGroup.get("bp").setValue(this.vBP || "0")
      this.MyFormGroup.get("temp").setValue(this.vTemp || "0")
         console.log(this.MyFormGroup.value)
      this._OpAppointmentService.InsertVitalInfo(visitId, this.MyFormGroup.value).subscribe((response) => {
        this._matDialog.closeAll();
      });
    } else {
      let invalidFields: string[] = [];
      if (this.MyFormGroup.invalid) {
        for (const controlName in this.MyFormGroup.controls) {
          if (this.MyFormGroup.controls[controlName].invalid) {
            invalidFields.push(`My Form: ${controlName}`);
          }
        }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }

  }

  onClose() {

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
