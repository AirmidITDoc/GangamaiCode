import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../ot-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  requestForm: FormGroup;
  requestSurgeryForm: FormGroup;
  requestAttendentForm: FormGroup;

  vSelectedOption: any = "OP";

  isActive: boolean = true;
  autocompleteModeDepartment: String = "Department";
  autocompleteModeSiteDescriptionId: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "DoctorType"
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";

  vRegNo: any;
  vPatientName: any;
  vbookingId: any;
  vOPDNo: any;
  vIPDNo: any;
  screenFromString = 'Common-form';
  opIpId: any;
  surgId: any;
  surgName: any;
  surgeonId: any;
  surgeonName: any;
  doctorTypeId: any;
  anesthesiaType: any;
  AnthId: any;
  AnthName: any;
  AnthId1: any;
  AnthName1: any;
  editIndex: number | null = null;
  editIndex1: number | null = null;

  displayedColumns: string[] = [
    'surgeryCategoryId',
    'surgeryName',
    'surgeryPart',
    'surgeryDuration',
    'surgeryFromTime',
    'surgeryEndTime',
    'isPrimary',
    'surgeon',
    'anesthesia',
    'Action'
  ];

  displayedColumns1: string[] = [
    'surgeon',
    'anesthesia',
    'Action'
  ];

  @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;
  opIpType: number;
  RegId: string;
  registerObj: any;
  registerObj1 = new OtReqInsert({});
  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  surgeryCategoryIdNames: string[] = ["Normal", "Emergency"];
  partTypes: string[] = ["Left", "Middle", "Right"];

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];

  constructor(public _OtRequestService: OtRequestService,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private ref: MatDialogRef<NewRequestComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.requestForm = this.createRequestForm();
    this.requestForm.markAllAsTouched();

    this.requestSurgeryForm = this.createRequestSurgeryArrayForm();
    this.reqSurgeryArray.push(this.createRequestSurgeryArrayForm())

    this.requestAttendentForm = this.createRequestAttendentArrayForm();
    this.reqAttendingArray.push(this.createRequestAttendentArrayForm())


    if ((this.data?.otBookingId) > 0) {
      this.registerObj = this.data
      this.vbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.visitId
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.opdNo
      this.vPatientName = this.registerObj.patientName

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }

      if (this.registerObj?.otRequestTime) {
        const date = new Date(this.registerObj.otRequestTime);

        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.requestForm.get('otRequestTime')?.setValue(formattedTime);
          });

          console.log("Raw from backend:", this.registerObj.otRequestTime);
          console.log("Formatted:", formattedTime);
          console.log("Control value after patch:", this.requestForm.get('otRequestTime')?.value);
        }
      }

      console.log(this.registerObj)
      this.requestForm.patchValue(this.registerObj);
      this.selectChangedoctorType(this.registerObj)
    }
  }

  createRequestForm(): FormGroup {
    return this._formBuilder.group({
      otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otRequestDate: [new Date()],
      otRequestTime: ['', [Validators.required]],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: ["OP"],
      bloodGroup: ['', [Validators.required]],
      categoryType: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ottable: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],  // means location theater
      surgeryDate: [],
      estimateTime: [''],//"10:00:00AM",
      diagnosis: [[], [Validators.required]],
      comments: [''],
      requestType: ['1'],
      pacrequired: ['1'],
      equipmentsRequired: ['1'],
      clearanceMedical: false,
      clearanceFinancial: false,
      infective: ['1'],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],

      tOtRequestSurgeryDetails: this._formBuilder.array([]),
      tOtRequestAttendingDetails: this._formBuilder.array([]),

      ////////surgery det parameters ////////////
      surgeryCategoryId: [''],
      surgeryId: [0],
      surgeryPart: [''],
      surgeryFromTime: [''],
      surgeryEndTime: [''],
      surgeryDuration: [''],
      isPrimary: [false],
      surgeonId: [0],
      anesthetistId: [0],

      ////////attendent det parameters ////////////
      recourceType: [0],
      doctorTypeId: [0],
      doctorId: [0],

      // new fields
      TheaterLocation: [],
      // MobileNo: [],
      bodyPartId: [0]
    });
  }

  createRequestSurgeryArrayForm(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      otrequestSurgeryDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      surgeryCategoryId: [element.surgeryCategoryId],
      surgeryId: [element.surgeryId],
      surgeryPart: [element.surgeryPart],
      surgeryFromTime: [element.surgeryFromTime],
      surgeryEndTime: [element.surgeryEndTime],
      surgeryDuration: [element.surgeryDuration],
      isPrimary: [element.isPrimary ?? false],
      surgeonId: [element.surgeonId],
      anesthetistId: [element.anestheticsId],
    });
  }
  get reqSurgeryArray(): FormArray {
    return this.requestForm.get('tOtRequestSurgeryDetails') as FormArray;
  }

  createRequestAttendentArrayForm(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      otrequestAttendingDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorTypeId: [element.doctorTypeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [element.anestheticsId1, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  get reqAttendingArray(): FormArray {
    return this.requestForm.get('tOtRequestAttendingDetails') as FormArray;
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

  patientInfoReset() {
    this.requestForm.get('opipid').setValue('');
    this.requestForm.get('opipid').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';

    this.registerObj1 = new OtReqInsert({});
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  onChangeReg(event) {
    if (event.value == 'OP') {
      this.opIpType = 0;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = 1;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Admitted patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vIPDNo = obj.ipdNo
      this.opIpId = obj.admissionID;
    }
  }
  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Visite Patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vOPDNo = obj.opdNo
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
  }

  opstartTime: any;
  onChangeTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opstartTime = time
    this.requestForm.get('estimateTime')?.setValue(time, { emitEvent: false });
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.requestForm.get('diagnosis')?.setValue(this.addDiagnolist);
  }

  selectChangeSurgery(obj: any) {
    this.surgName = obj.text
  }
  selectChangeSurgeon(obj: any) {
    this.surgeonName = obj.text
  }
  selectChangeAnesth(obj: any) {
    this.AnthName = obj.text
  }
  selectChangeanesthesiaType(obj: any) {
    this.anesthesiaType = obj.text
  }
  selectChangeAnesth1(obj: any) {
    this.AnthName1 = obj.text
  }
  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    if (!this.requestForm.get("surgeryCategoryId")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryPart")?.value) {
      this.toastr.warning('Please select a Surgery Part', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeonId")?.value) {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("anesthetistId")?.value) {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // debugger

    let newEntry = {
      surgeryCategoryId: this.requestForm.get('surgeryCategoryId').value,
      surgeryId: this.requestForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.requestForm.get('surgeryPart').value,
      surgeryDuration: this.requestForm.get('surgeryDuration').value,
      surgeryFromTime: this.requestForm.get('surgeryFromTime').value,
      surgeryEndTime: this.requestForm.get('surgeryEndTime').value,
      isPrimary: this.requestForm.get('isPrimary').value,
      surgeonId: this.requestForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.requestForm.get('anesthetistId').value, //
      anestheticsName: this.AnthName,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex !== null) {
      this.Chargelist[this.editIndex] = newEntry;
      this.editIndex = null;
    } else {
      this.Chargelist.push(newEntry);
    }
    this.dssurgeryDetailList.data = [...this.Chargelist];

    //  Also add surgeon & anesthetist to second table (attendants) ---
    // if (this.surgeonName) {
    //   let surgeonEntry = {
    //     doctorTypeId: null,
    //     anesthesiaType: "Surgeon",
    //     anestheticsId1: newEntry.surgeonId,
    //     anestheticsName1: this.surgeonName
    //   };
    //   this.Chargelist1.push(surgeonEntry);
    // }

    // if (this.AnthName) {
    //   let anesthetistEntry = {
    //     doctorTypeId: null,
    //     anesthesiaType: "Anesthetist",
    //     anestheticsId1: newEntry.anestheticsId,
    //     anestheticsName1: this.AnthName
    //   };
    //   this.Chargelist1.push(anesthetistEntry);
    // }

    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.requestForm.patchValue({
      surgeryCategoryId: '',
      surgeryId: '',
      surgeryPart: '',
      surgeryDuration: '',
      surgeryFromTime: '',
      surgeryEndTime: '',
      isPrimary: false,
      surgeonId: '',
      anesthetistId: ''
    });

    this.surgName = '';
    this.surgeonName = '';
    this.AnthName = '';
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dssurgeryDetailList.data = [];
      this.dssurgeryDetailList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit(contact: any) {
    console.log("Editing row:", contact);

    // Patch values into the form
    this.requestForm.patchValue({
      surgeryCategoryId: contact.surgeryCategoryId ?? '',
      surgeryId: contact.surgeryId ?? '',
      surgeryPart: contact.surgeryPart ?? '',
      surgeryDuration: contact.surgeryDuration ?? '',
      surgeryFromTime: contact.surgeryFromTime ?? '',
      surgeryEndTime: contact.surgeryEndTime ?? '',
      isPrimary: contact.isPrimary ?? false,
      surgeonId: contact.surgeonId ?? '',
      anesthetistId: contact.anestheticsId ?? ''
    });

    // Set display names if you have them separately
    this.surgName = contact.surgeryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dssurgeryDetailList.data = [...this.Chargelist];
    }
  }

  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Optional: use device camera directly
  openCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // opens back camera on mobile
    input.onchange = (event: any) => this.onFileSelected(event);
    input.click();
  }

  /////////////////////////////// surgery detail part end /////////////////////////////

  /////////////////////////////// attendent detail part /////////////////////////////
  onAdd1() {
    // debugger
    if (!this.requestForm.get("doctorTypeId")?.value) {
      this.toastr.warning('Please select a Doctor Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("doctorId")?.value) {
      this.toastr.warning('Please select a Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let newEntry = {
      doctorTypeId: this.requestForm.get('doctorTypeId').value,//
      anesthesiaType: this.anesthesiaType,
      anestheticsId1: this.requestForm.get('doctorId').value, //
      anestheticsName1: this.AnthName1,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex1 !== null) {
      this.Chargelist1[this.editIndex1] = newEntry;
      this.editIndex1 = null;
    } else {
      this.Chargelist1.push(newEntry);
    }
    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.requestForm.patchValue({
      doctorTypeId: '',
      doctorId: ''
    });
    this.anesthesiaType = '';
    this.AnthName1 = '';
  }

  deleteTableRow1(event, element) {

    let index = this.Chargelist1.indexOf(element);
    if (index >= 0) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [];
      this.dsattendentDetailList.data = this.Chargelist1;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit1(contact: any) {
    console.log("Editing row:", contact);

    // Patch values into the form
    this.requestForm.patchValue({
      doctorTypeId: contact.doctorTypeId ?? '',
      doctorId: contact.anestheticsId1 ?? ''
    });

    this.anesthesiaType = contact.anesthesiaType ?? '';
    this.AnthName1 = contact.anestheticsName1 ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist1.indexOf(contact);
    if (index > -1) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [...this.Chargelist1];
    }
  }

  /////////////////////////////// attendent detail part end/////////////////////////////

  onSubmit() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.requestForm.get('opipid').setValue(this.opIpId);
    this.requestForm.get('otrequestId')?.setValue(this.vbookingId || 0);
    this.requestForm.get('otRequestDate').setValue(formattedDate);
    this.requestForm.get('otRequestTime').setValue(formattedTime);

    console.log(this.requestForm.value)
    if (!this.requestForm.invalid) {
      debugger

      this.reqSurgeryArray.clear();
      if (this.dssurgeryDetailList.data.length === 0) {
        this.toastr.warning('Data is not available in list ,please add surgery details in the list.', 'Warning');
        return;
      }
      this.dssurgeryDetailList.data.forEach(item => {
        this.reqSurgeryArray.push(this.createRequestSurgeryArrayForm(item));
      });

      this.reqAttendingArray.clear();
      this.dsattendentDetailList.data.forEach(item => {
        this.reqAttendingArray.push(this.createRequestAttendentArrayForm(item));
      });

      const controlsToRemove = ['TheaterLocation', 'bodyPartId', 'surgeryCategoryId', 'surgeryId', 'surgeryPart', 'surgeryFromTime', 'surgeryEndTime', 'surgeryDuration', 'isPrimary',
        'surgeonId', 'anesthetistId', 'recourceType', 'doctorTypeId', 'doctorId'];
      controlsToRemove.forEach(controlName => {
        this.requestForm.removeControl(controlName);
      });

      console.log(this.requestForm.value)
      // this._OtRequestService.requestSave(this.requestForm.value).subscribe((response) => {
      //   this.OnPrint(response)
      //   this.onClear(true);
      // });
    } else {
      let invalidFields: string[] = [];

      const validateFormGroup = (formGroup: FormGroup | FormArray, parentKey: string = '') => {
        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.get(key);
          const fieldKey = parentKey ? `${parentKey}.${key}` : key;

          if (control instanceof FormGroup || control instanceof FormArray) {
            validateFormGroup(control, fieldKey); // ✅ recursion for deeper levels
          } else {
            if (control?.invalid) {
              invalidFields.push(fieldKey);
            }
          }
        });
      };

      validateFormGroup(this.requestForm);

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
        });
        return;
      }
    }
  }

  selectChangedoctorType(obj: any) {
    if (obj.value) {
      this._OtRequestService.getSurgeonsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        this.surgeonList.bindGridAutoComplete();
      });
    } else {
      this._OtRequestService.getSurgeonsByDoctorType(obj.categoryId).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        // this.surgeonList.bindGridAutoComplete();
        const incomingDoctorId = obj.surgeonId;
        setTimeout(() => {
          this.surgeonList.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.requestForm.get('surgeonId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
  }

  OnPrint(Param) {
    const param = {
      searchFields: [
        {
          fieldName: "OTBookingId",
          fieldValue: String(Param.otrequestId),
          opType: "Equals"
        },
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(Param.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTRequest"
    };

    console.log(param);

    this._OtRequestService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "OT Request Report Viewer"
        }
      });
      matDialog.afterClosed().subscribe(result => {
      });
    });
  }

  getValidationMessages() {
    return {
      DepartmentName: [
        { name: "required", Message: "Department Name is required" }
      ],
      SurgeryCategory: [
        { name: "required", Message: "SurgeryCategory  is required" }
      ],
      Site: [
        { name: "required", Message: "Site Name is required" }
      ],
      SurgeryProcedure: [
        { name: "required", Message: "SurgeryProcedure Name is required" }
      ],
      SurgeonName: [
        { name: "required", Message: "Surgeon Name is required" }
      ],
      SurgeryType: [
        { name: "required", Message: "SurgeryType Name is required" },
        { name: "maxlength", Message: "SurgeryType Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ],

    };
  }
  onClose() {
    this.ref.close();
  }
  onClear(val: boolean) {
    // this.requestForm.reset();
    this.dialogRef.close(val);
    this.requestForm.get('opiptype').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.requestForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.requestForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.requestForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.requestForm.get('surgeryDuration')?.value;
    const startTime = this.requestForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.requestForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.requestForm.get('surgeryFromTime')?.value;
    const endTime = this.requestForm.get('surgeryEndTime')?.value;

    if (startTime && endTime) {
      this.calculateDuration(startTime, endTime);
    }
  }

  calculateDuration(startTime: string, endTime: string) {
    // debugger
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

    const dh = Math.floor(durationMinutes / 60);
    const dm = durationMinutes % 60;

    const duration = `${this.pad(dh)}:${this.pad(dm)}`;
    this.requestForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}





