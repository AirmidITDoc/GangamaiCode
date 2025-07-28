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
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

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
  registerObj1 = new EmergencyList({});
  historyForm: FormGroup
  addCheiflist: any[] = [];
  addDiagnolist: any = [];
  addExaminlist: any = [];
  languages: LanguageOption[] = [];
  selectedLang = 'en-US';
  emergencyId:any;
  retriveList:any=[];

  constructor(
    public _EmergencyService: EmergencyService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EmergencyHistoryComponent>,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _frombuilder: UntypedFormBuilder,
    public speechService: SpeechRecognitionService,  
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.languages = this.speechService.supportedLanguages;

    this.historyForm = this.CreateMyForm()
    this.historyForm.markAllAsTouched()
    if (this.data) {
      this.registerObj = this.data
      this.emergencyId=this.registerObj.emgId
      console.log("Data:", this.registerObj)
    }
    this.gethistory(this.registerObj);
    // this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((res) => {
    //   this.registerObj = res;
    //   console.log(this.registerObj)
    // });
  }

  CreateMyForm() {
    return this._frombuilder.group({
      emgHistoryId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      emgId:[0, [Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      height: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      pweight: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      bmi: ['', [Validators.required,this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      bsl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      spO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      bp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      chiefComplaint:['',this._FormvalidationserviceService.allowEmptyStringValidatorOnly],
      diagnosis:['',this._FormvalidationserviceService.allowEmptyStringValidatorOnly],
      examination:['',this._FormvalidationserviceService.allowEmptyStringValidatorOnly],
      // mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      // mAssignDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      // mAssignExamination: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      advice:['']
    })
  }

  gethistory(obj) {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "EmgId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "EmgId",
          "fieldValue": String(obj.emgId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._EmergencyService.retriveHistoryList(m_data2).subscribe(Visit => {
      const data = Visit?.data as EmergencyList[];

      if (data && data.length > 0) {
        this.registerObj1 = data[0];
        this.historyForm.patchValue({
          height: this.registerObj1.height,
          pweight: this.registerObj1.pweight,
          bmi: this.registerObj1.bmi,
          bsl: this.registerObj1.bsl,
          spo2: this.registerObj1.spo2,
          pulse: this.registerObj1.pulse,
          bp: this.registerObj1.bp,
          temp: this.registerObj1.temp
        });
      }
      console.log("History 0th record:", this.registerObj1);
    });
  }
    
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getBMIcalculation() {
    const height = this.historyForm.get('height')?.value;
    const weight = this.historyForm.get('pweight')?.value;

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      this.historyForm.get('bmi')?.setValue(Math.round(bmi));

    } else {
      this.historyForm.get('bmi')?.setValue(0);
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
    if(!this.historyForm.invalid){
      this.historyForm.get('emgHistoryId').setValue(this.registerObj1.emgHistoryId || 0)
      this.historyForm.get('emgId').setValue(this.emergencyId)
      this.historyForm.get('bmi').setValue(String(this.historyForm.get('bmi').value))
      console.log(this.historyForm.value)
      this._EmergencyService.EmgHistorySave(this.historyForm.value).subscribe((res)=>{
        this.OnViewReportPdf(res)
        this.onClose()
      })

    }else {
      let invalidFields: string[] = [];
      if (this.historyForm.invalid) {
        for (const controlName in this.historyForm.controls) {
          if (this.historyForm.controls[controlName].invalid) {
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

  OnViewReportPdf(EmgId: any) {
    this.commonService.Onprint("EmgId", EmgId, "EmergencyPrescription");
  }

  onClose() {
    this.historyForm.reset();
    this.dialogRef.close();
  }

  /////////////////////////////// advice part ///////////////////////////////
   onLangChange() {
    if (this.speechService.isListening) {
      this.speechService.stopRecognition();
    }
  }
  onMicToggle() {
    this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
      const currentText = this.historyForm.get('advice')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.historyForm.get('advice')?.setValue(updated);
    });
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
