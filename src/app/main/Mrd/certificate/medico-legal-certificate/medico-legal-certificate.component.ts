import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../../mrd.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
  opIpType: any;
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
  private recognition: any = null;
  isListening = false;
  vDoctorId: any;

  autocompleteModeDepartment: string = "Department";
  autocompleteModeDoctor: string = "ConDoctor";

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(private _formBuilder: FormBuilder,
    public speechService: SpeechRecognitionService,
    public dialogRef: MatDialogRef<MedicoLegalCertificateComponent>,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _mrdService: MrdService, public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.certificateForm = this.createCertificateForm();
    this.certificateForm.markAllAsTouched();

    this.languages = this.speechService.supportedLanguages;

    console.log("Medico data info", this.data);

    if (this.data?.opIpId) { // used to hide OPIPControls search textbox
      this.showOpIpControls = false;
    }

    if (this.data.docId > 0) {
      setTimeout(() => {

        this._mrdService.getMedicalDetailsById(this.data.docId).subscribe((response) => {
          console.log("Medical info", response)
          let formattedTimeOfDeath = '';

          if (response.accidentTime) {
            const date = new Date(response.accidentTime);
            formattedTimeOfDeath =
              this.datePipe.transform(date, 'HH:mm') || '';
          }

          this.certificateForm.patchValue({
            docId: response.docId,
            certificateNo: response.certificateNo,
            accidentDate: response.accidentDate,
            accidentTime: formattedTimeOfDeath,
            detailsInjuries: response.detailsInjuries,
            ageofInjuries: response.ageofInjuries,
            causeofInjuries: response.causeofInjuries,
            treatingDoctorId: response.treatingDoctorId,
            treatingDoctorId1: response.treatingDoctorId2,
            treatingDoctorId2: response.treatingDoctorId2,
            departmentId: response.departmentId
          });

          this.selectChangedepartment(response)
          this.vDoctorId = response.treatingDoctorId
          this.opIpId = response.opIpId
          this.opIpType = response.opIpType === 1 ? 'IP' : 'OP'
        })

      })
      this.opipPatientDetailsObj = this.data
      this.vDoctorName = this.data.admittedDoctorName
      this.vRefDocName = this.data.refDocName
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = this.selectedCauseLang || 'en-US';

    // Microphone started
    this.recognition.onstart = () => {
      console.log('MIC ON');
      this.isListening = true;
    };

    // Speech result
    this.recognition.onresult = (event: any) => {

      let text = '';

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript;
        }
      }

      if (text.trim()) {

        const control = this.certificateForm.get('causeofInjuries');

        if (control) {
          const currentText = control.value || '';

          const updatedText = currentText
            ? currentText + ' ' + text.trim()
            : text.trim();

          control.setValue(updatedText);
        }

        console.log('Recognized:', text);
      }
    };

    // Microphone stopped
    this.recognition.onend = () => {
      console.log('MIC OFF');
      this.isListening = false;
    };

    // Error
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

  }


  createCertificateForm(): FormGroup {
    return this._formBuilder.group({
      docId: 0,
      mlcdate: [new Date()],
      mlctime: "",
      certificateNo: ['', [Validators.required]],
      opIpId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: ['OP'],
      accidentDate: ['', [Validators.required]],
      accidentTime: ['', [Validators.required]],
      detailsInjuries: ['', [Validators.required]],
      ageofInjuries: "",
      causeofInjuries: ['', [Validators.required]],
      treatingDoctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      treatingDoctorId1: 0,
      treatingDoctorId2: 0,
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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

  onLangChange() {
    if (this.speechService.isListening) {
      this.speechService.stopRecognition();
    }
  }
  onMicToggle() {
    // console.log(this.selectedLang);
    this.speechService.toggleRecognition(this.selectedCauseLang, (text: string) => {
      const currentText = this.certificateForm.get('causeofInjuries')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.certificateForm.get('causeofInjuries')?.setValue(updated);
    });
  }

  // onCauseMicToggle() {

  //   if (this.activeMic === 'cause') {
  //     this.speechService.stopRecognition();
  //     this.activeMic = null;
  //     return;
  //   }

  //   // Stop previous microphone if any
  //   if (this.speechService.isListening) { this.speechService.stopRecognition(); }

  //   this.activeMic = 'cause';

  //   this.speechService.startRecognition(this.selectedCauseLang, (text: string) => {

  //     const currentText = this.certificateForm.get('causeofInjuries')?.value || '';

  //     const updated = currentText ? `${currentText} ${text}` : text;

  //     this.certificateForm.get('causeofInjuries')?.setValue(updated);
  //   }
  //   );
  // }

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
      const doctorId = this.vDoctorId;

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

    this.certificateForm.get('opIpType').value === 'IP' ? this.certificateForm.get('opIpType').setValue(1) : this.certificateForm.get('opIpType').setValue(0);

    // const formValue = this.certificateForm.value;
    // const { opIpType, ...rest } = formValue;
    // const formdata = {
    //   ...rest,
    //   opIpType: opIpType === 'IP' ? 1 : 0
    // };

    // console.log("opIpType", opIpType)

    if (this.certificateForm.valid) {
      console.log("After Submit", this.certificateForm.value)

      this._mrdService.medicoCertificateSave(this.certificateForm.value).subscribe({
        next: (response) => {
          this.OnMedicoPrint(response);
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
  }

  OnMedicoPrint(obj) {
    // debugger
    const param = {
      "searchFields": [
        {
          "fieldName": "DocId",
          "fieldValue": String(obj.docId),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": String(obj.opIpType),
          "opType": "Equals"
        }

      ],
      "mode": "MedicolegalCertificateReport"
    }

    console.log(param);

    this._mrdService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Medico Legal Certificate",
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });
  }

}
