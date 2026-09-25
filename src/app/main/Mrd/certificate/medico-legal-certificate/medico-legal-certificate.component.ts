import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../../mrd.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MlcDetail } from 'app/main/ipd/Admission/admission/mlcinformation/mlcinformation.component';
import { AuthenticationService } from 'app/core/services/authentication.service';

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
  minDate: Date;

  opipPatientDetailsObj: any = {};
  languages: LanguageOption[] = [];
  certificateForm: FormGroup;
  mlcForm: FormGroup;
  phdatetime: any;
  isTimeChanged: boolean = false;

  activeMic: 'age' | 'cause' | null = null;
  selectedAgeLang = 'en-US';
  selectedCauseLang = 'en-US';
  private recognition: any = null;
  isListening = false;
  vDoctorId: any;
  isDatePckrDisabled: boolean = false;
  MLCData = new MlcDetail({});
  DetailGiven: any;
  Remark: any;

  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  timeflag = 0;
  vmlcid: any;
  autocompleteModeDepartment: string = "Department";
  autocompleteModeDoctor: string = "ConDoctor";
  isButtonDisabled: boolean = false;
  registerObjDet: any;
  vtemplateText: any;

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(private _formBuilder: FormBuilder,
    public speechService: SpeechRecognitionService,
    public dialogRef: MatDialogRef<MedicoLegalCertificateComponent>,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _mrdService: MrdService, public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.certificateForm = this.createCertificateForm();
    this.certificateForm.markAllAsTouched();

    this.mlcForm = this.createMLCForm();

    this.languages = this.speechService.supportedLanguages;

    this.opIpId = this.data?.opIpId

    if (this.opIpId > 0) {
      this._mrdService.getMLCById(this.opIpId).subscribe((response) => {
        this.MLCData = new MlcDetail(response ?? {});
        // console.log("MLC Data:", this.MLCData);
        this.vmlcid = response.mlcid
        // this.mlcForm.patchValue(response)
        this.DetailGiven = this.MLCData.detailGiven
        this.Remark = this.MLCData.remark

        const backendValue = response.reportingTime; // "19-09-2025 13:00:00"

        if (backendValue) {
          // Parse backend time
          const timePart = backendValue.split(' ')[1]; // "13:00:00"
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          const timeOnly = new Date();
          timeOnly.setHours(hours, minutes, seconds || 0, 0);

          this.certificateForm.get('reportingTime')?.setValue(timeOnly);
        } else {
          // No backend value → set current time
          const now = new Date();
          this.certificateForm.get('reportingDate')?.setValue(now);
          this.certificateForm.get('reportingTime')?.setValue(now);
        }
      });
    }

    if (this.data?.opIpId) { // used to hide OPIPControls search textbox
      this.showOpIpControls = false;
    }

    if (this.data.docId > 0) {
      setTimeout(() => {

        this._mrdService.getMedicalDetailsById(this.data.docId).subscribe((response) => {
          let formattedTimeOfDeath = '';

          // if (response.accidentTime) {
          //   const date = new Date(response.accidentTime);
          //   formattedTimeOfDeath =
          //      this.datePipe.transform(date, 'hh:mm a') || '';
          // }
          let accidentTime = null;

          if (response.accidentTime) {
            const value = String(response.accidentTime);

            const match = value.match(/(\d{1,2}):(\d{2})/);

            if (match) {
              accidentTime = new Date();
              accidentTime.setHours(+match[1], +match[2], 0, 0);
            }
          }

          response.opIpType == '1' ? this.certificateForm.get('opIpType').setValue('IP') : this.certificateForm.get('opIpType').setValue('OP');

          this.certificateForm.patchValue({
            docId: response.docId,
            opIpType: response.opIpType == '1' ? 'IP' : 'OP',
            certificateNo: response.certificateNo,
            accidentDate: response.accidentDate,
            accidentTime: accidentTime,
            detailsInjuries: response.detailsInjuries,
            ageofInjuries: response.ageofInjuries,
            causeofInjuries: response.causeofInjuries,
            treatingDoctorId: response.treatingDoctorId,
            treatingDoctorId1: response.treatingDoctorId1,
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
      }
    };

    // Microphone stopped
    this.recognition.onend = () => {
      this.isListening = false;
    };

    // Error
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
    };

  }


  createCertificateForm(): FormGroup {
    return this._formBuilder.group({
      docId: 0,
      mlcdate: [new Date()],
      mlctime: [new Date()],
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
      addedBy: this.accountService.currentUserValue.userId,
      updatedBy: this.accountService.currentUserValue.userId,
      mlcid: 0,
      admissionId: [0],
      isEmgOrAdm: [false],
      mlcno: [''],
      reportingDate: [(new Date()).toISOString()],
      reportingTime: [new Date()],
      authorityName: [''],
      buckleNo: ['', [Validators.minLength(5), Validators.maxLength(7)]],
      policeStation: [''],
      detailGiven: [''],
      remark: [''],

      // extra field
      TemplateId: [0]
    });
  }

  createMLCForm(): FormGroup {
    return this._formBuilder.group({
      mlcid: 0,
      admissionId: [0],
      isEmgOrAdm: [false],
      mlcno: [''],
      reportingDate: [(new Date()).toISOString()],
      reportingTime: [''],
      authorityName: [''],
      buckleNo: ['', [Validators.minLength(5), Validators.maxLength(7)]],
      policeStation: [''],
      detailGiven: [''],
      remark: ['']
    });
  }

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      const splitDate = dateOfReg.toLocaleString("en-US").split(',');
      const splitTime = this.certificateForm.get('reportingDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      const selectedDate = new Date(this.certificateForm.get('reportingTime').value);
      const splitDate = selectedDate.toLocaleString("en-US").split(',');
      const splitTime = this.certificateForm.get('reportingTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      this.phdatetime = splitTime[1]
      // console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    const localaDateValues = actualDate.split('/');
    const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
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
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vIPDNo = obj.ipdNo
      this.opIpId = obj.admissionID;

      this._mrdService.getMLCById(this.opIpId).subscribe((response) => {
        this.MLCData = new MlcDetail(response ?? {});
        // console.log("MLC Data:", this.MLCData);
        // this.certificateForm.patchValue(response)
        this.DetailGiven = this.MLCData.detailGiven
        this.Remark = this.MLCData.remark

        const backendValue = response.reportingTime; // "19-09-2025 13:00:00"
        if (backendValue) {
          // Parse backend time
          const timePart = backendValue.split(' ')[1]; // "13:00:00"
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          const timeOnly = new Date();
          timeOnly.setHours(hours, minutes, seconds || 0, 0);

          this.certificateForm.get('reportingTime')?.setValue(timeOnly);
        } else {
          // No backend value → set current time
          const now = new Date();
          this.certificateForm.get('reportingDate')?.setValue(now);
          this.certificateForm.get('reportingTime')?.setValue(now);
        }
      });
    }
  }

  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.opipPatientDetailsObj = obj
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

  selectChangeTemplate(data) {
    this.registerObjDet = data.templateDesc;
  }

  addTemplateDescription() {
    this.isButtonDisabled = false;
    if (!this.certificateForm.get('TemplateId').value) {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.registerObjDet) {
      this.vtemplateText = this.registerObjDet;
      this.certificateForm.get('detailsInjuries').setValue(this.vtemplateText)
      this.registerObjDet = '';
    }
  }

  onEditorValueChange(content: string) {
    this.certificateForm.get('detailsInjuries')?.setValue(content);
  }

  selectChangedepartment(obj: any): void {

    const departmentId = obj?.value ?? obj?.departmentId;

    if (!departmentId) { return; }

    this._mrdService.getDoctorsByDepartment(departmentId).subscribe((data: any[]) => {

      // Load doctors into common dropdown
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();

      // Existing doctor ID during edit
      const doctorId = this.vDoctorId;

      if (doctorId) {
        const matchedDoctor = data.find(doctor => String(doctor.value) === String(doctorId));

        if (matchedDoctor) {

          this.certificateForm.get('treatingDoctorId')?.setValue(matchedDoctor.value);
        }
      }
    });
  }

  onSubmit(): void {

    this.certificateForm.removeControl('TemplateId')
    if (this.certificateForm.get('docId').value > 0) {
      this.certificateForm.removeControl('addedBy')
    } else {
      this.certificateForm.removeControl('updatedBy')
    }
    this.certificateForm.get('mlcid').setValue(this.vmlcid ?? 0);
    this.certificateForm.get('opIpId').setValue(this.opIpId);
    this.certificateForm.get('admissionId').setValue(this.opIpId);

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

    if (!this.certificateForm.invalid) {

      this.certificateForm.get('opIpType').value === 'IP' ? this.certificateForm.get('opIpType').setValue(1) : this.certificateForm.get('opIpType').setValue(0);

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
        }
      });
    } else {
      const invalidFields = [];
      if (this.certificateForm.invalid) {
        for (const controlName in this.certificateForm.controls) {
          if (this.certificateForm.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
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
