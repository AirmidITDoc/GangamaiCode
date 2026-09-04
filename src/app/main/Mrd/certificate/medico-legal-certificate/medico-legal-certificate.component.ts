import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../../mrd.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
  selector: 'app-medico-legal-certificate',
  templateUrl: './medico-legal-certificate.component.html',
  styleUrls: ['./medico-legal-certificate.component.scss']
})
export class MedicoLegalCertificateComponent {

  screenFromString = 'Common-form';
  dateTimeObj: any;
  today = new Date();
  showOpIpControls = true;

  Language: ['1'];
  opIpType: boolean = false;
  opIpId: any;
  vRegNo: any;
  vPatientName: any;
  vDepartmentName: any;
  vDoctorName: any;
  vRefDocName: any;
  vIPDNo: any;
  vOPDNo: any;
  vCheckBox: boolean = false;
  vSelectedOption: any = 'OP';
  vCertificateID: any;

  opipPatientDetailsObj: any = {};
  languages: LanguageOption[] = [];
  certificateForm: FormGroup;

  activeMic: 'age' | 'cause' | null = null;
  selectedAgeLang = 'en-US';
  selectedCauseLang = 'en-US';

  autocompleteModeDepartment: string = "Department";
  autocompleteModeDoctor: string = "ConDoctor";

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(private _formBuilder: FormBuilder,
    public speechService: SpeechRecognitionService,
    public dialogRef: MatDialogRef<MedicoLegalCertificateComponent>,
    public toastr: ToastrService,
    public _mrdService: MrdService, public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.languages = this.speechService.supportedLanguages;
  }

  ngOnInit(): void {
    this.certificateForm = this.createCertificateForm();
    this.certificateForm.markAllAsTouched();
    this.languages = this.speechService.supportedLanguages;

    console.log("Medico data info", this.data, this.data.opIpId);

    console.log("opipPatientDetailsObj", this.opipPatientDetailsObj);
    if (this.data?.opIpId) { // used to hide OPIPControls search textbox
      this.showOpIpControls = false;
    }


    if (this.data.docId > 0) {
      setTimeout(() => {

      })
      this.opipPatientDetailsObj = this.data
      this.vDoctorName = this.data.admittedDoctorName
      this.vRefDocName = this.data.refDocName
      this.certificateForm.patchValue(this.data);
    }


  }


  createCertificateForm(): FormGroup {
    return this._formBuilder.group({
      docId: 0,
      mlcdate: [new Date()],
      mlctime: "",
      certificateNo: "",
      opIpId: 0,
      opIpType: ['OP'],
      accidentDate: "",
      accidentTime: "",
      detailsInjuries: [''],
      ageofInjuries: "",
      causeofInjuries: "",
      treatingDoctorId: 0,
      treatingDoctorId1: 0,
      treatingDoctorId2: 0,
      departmentId: 0
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onChangeType(event) {
    if (event.value == 'OP') {
      this.opIpType = false;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = true;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.opipPatientDetailsObj = obj
      console.log("Admitted patient:", this.opipPatientDetailsObj)
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vIPDNo = obj.ipdNo
      this.opIpId = obj.admissionID;
    }
  }

  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.opipPatientDetailsObj = obj
      console.log("Visite Patient:", this.opipPatientDetailsObj)
      this.vRegNo = obj.regNo
      this.vOPDNo = obj.opdNo
      const nameField = obj.formattedText;
      const extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
  }

  patientInfoReset() {
    this.certificateForm.get('opIpId').setValue('');
    this.certificateForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.opipPatientDetailsObj = '';
  }

  onAgeLangChange() {
    if (this.activeMic === 'age') {
      this.speechService.stopRecognition();
      this.activeMic = null;
    }
  }

  onCauseLangChange() {
    if (this.activeMic === 'cause') {
      this.speechService.stopRecognition();
      this.activeMic = null;
    }
  }

  onAgeMicToggle() {

    if (this.activeMic === 'age') {
      this.speechService.stopRecognition();
      this.activeMic = null;
      return;
    }

    // Stop previous microphone if any
    if (this.speechService.isListening) { this.speechService.stopRecognition(); }

    this.activeMic = 'age';

    this.speechService.startRecognition(this.selectedAgeLang, (text: string) => {

      const currentText = this.certificateForm.get('ageofInjuries')?.value || '';

      const updated = currentText ? `${currentText} ${text}` : text;

      this.certificateForm.get('ageofInjuries')?.setValue(updated);
    }
    );
  }

  onCauseMicToggle() {

    if (this.activeMic === 'cause') {
      this.speechService.stopRecognition();
      this.activeMic = null;
      return;
    }

    // Stop previous microphone if any
    if (this.speechService.isListening) { this.speechService.stopRecognition(); }

    this.activeMic = 'cause';

    this.speechService.startRecognition(this.selectedCauseLang, (text: string) => {

      const currentText = this.certificateForm.get('causeofInjuries')?.value || '';

      const updated = currentText ? `${currentText} ${text}` : text;

      this.certificateForm.get('causeofInjuries')?.setValue(updated);
    }
    );
  }

  onClose(val: boolean) {
    this.dialogRef.close(val);
  }

  onEditorValueChange(content: string) {
    this.certificateForm.get('detailsInjuries')?.setValue(content);
  }

  selectChangedepartment(obj: any): void {

    const departmentId = obj?.value ?? obj?.departmentId;

    if (!departmentId) { return; }

    this._mrdService.getDoctorsByDepartment(departmentId).subscribe((data: any[]) => {

      console.log('Doctor API:', data);

      // Load doctors into common dropdown
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();

      // Existing doctor ID during edit
      const doctorId = this.opipPatientDetailsObj?.docNameId ?? this.opipPatientDetailsObj?.doctorId;

      console.log('Existing doctorId:', doctorId);

      if (doctorId) {
        const matchedDoctor = data.find(doctor => String(doctor.value) === String(doctorId));

        console.log('Matched Doctor:', matchedDoctor);

        if (matchedDoctor) {

          this.certificateForm.get('treatingDoctorId')?.setValue(matchedDoctor.value);

          console.log('Form doctor:', this.certificateForm.get('treatingDoctorId')?.value);
        }
      }
    });
  }

  onSubmit(): void {

    this.certificateForm.get('opIpId').setValue(this.opIpId);

    const detailsInjuries = this.certificateForm.get('detailsInjuries')?.value;
    this.certificateForm.get('detailsInjuries').setValue(detailsInjuries);

    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.certificateForm.get('mlcdate').setValue(formattedDate);
    this.certificateForm.get('mlctime').setValue(formattedTime);

    //accident date
    const accidentDate = this.certificateForm.get('accidentDate')?.value;
    const formattedaccidentDate = this.datePipe.transform(accidentDate, "yyyy-MM-dd'T'00:00:00");
    this.certificateForm.get('accidentDate')?.setValue(formattedaccidentDate);

    console.log("On medico certificate form submit", this.certificateForm.value)
    this.certificateForm.get('docId').setValue(this.vCertificateID ?? 0);

    const formValue = this.certificateForm.value;
    const { opIpType, ...rest } = formValue;
    const formdata = {
      ...rest,
      opIpType: opIpType === 'IP' ? 1 : 0
    };

    console.log("opIpType", opIpType)

    if (this.certificateForm.valid) {
      console.log("After Submit", this.certificateForm.value)

      this._mrdService.medicoCertificateSave(formdata).subscribe({
        next: (response) => {
          // console.log('API Response:', response);
          this.onClose(true);
        },
        error: (err) => {
          console.error('Error:', err);
        },
        complete: () => {
          console.log('Request complete');
        }
      });
    }


    // this._mrdService.medicoCertificateSave(formdata).subscribe({
    //   next: (response) => {
    //     console.log('API Response:', response);
    //     this.onClose(true);
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //   },
    //   complete: () => {
    //     console.log('Request complete');
    //   }
    // });
  }
}
