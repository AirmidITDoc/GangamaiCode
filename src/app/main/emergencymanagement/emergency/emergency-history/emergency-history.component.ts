import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { EmergencyService } from '../emergency.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmergencyList } from '../emergency.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-emergency-history',
  templateUrl: './emergency-history.component.html',
  styleUrls: ['./emergency-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmergencyHistoryComponent {
  screenFromString = 'Common-form';
  dateTimeObj: any;
  registerObj = new EmergencyList({});
  historyForm: FormGroup
  addCheiflist: any[] = [];
  addDiagnolist: any = [];
  addExaminlist: any = [];

  constructor(
    public _EmergencyService: EmergencyService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EmergencyHistoryComponent>,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _frombuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.historyForm = this.CreateMyForm()
    if (this.data) {
      this.registerObj = this.data
      console.log("Data:", this.registerObj)
    }
    // this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((res) => {
    //   this.registerObj = res;
    //   console.log(this.registerObj)
    // });
  }

  CreateMyForm() {
    return this._frombuilder.group({
      EmgHistory:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      EmgId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      Height: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      Weight: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      BMI: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      BSL: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      SpO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      Pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      BP: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      Temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignExamination: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
    })
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getBMIcalculation() {
    const height = this.historyForm.get('Height')?.value;
    const weight = this.historyForm.get('Weight')?.value;

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      this.historyForm.get('BMI')?.setValue(Math.round(bmi));

    } else {
      this.historyForm.get('BMI')?.setValue(0);
      // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
    }
  }

  selectChangeChiefComplaint(selectedChips: string[]) {
    this.addCheiflist = selectedChips;
    this.historyForm.get('mAssignChiefComplaint')?.setValue(this.addCheiflist);
  }

  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.historyForm.get('mAssignDiagnosis')?.setValue(this.addDiagnolist);
  }

  selectChangeExamination(selectedChips: string[]) {
    this.addExaminlist = selectedChips;
    this.historyForm.get('mAssignExamination')?.setValue(this.addExaminlist);
  }

  onSave() {
    console.log(this.historyForm.value)
  }

  onClose() {
    this.historyForm.reset();
    this.dialogRef.close();
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
