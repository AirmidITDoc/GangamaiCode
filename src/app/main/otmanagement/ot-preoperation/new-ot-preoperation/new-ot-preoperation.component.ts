import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { OtPreoperationService } from '../ot-preoperation.service';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ConsentService } from 'app/main/nursingstation/consent/consent.service';
import { AirmidConsentformComponent } from 'app/main/shared/componets/airmid-consentform/airmid-consentform.component';

@Component({
  selector: 'app-new-ot-preoperation',
  templateUrl: './new-ot-preoperation.component.html',
  styleUrls: ['./new-ot-preoperation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOtPreoperationComponent {
  searchFormGroup: FormGroup;
  preOperationFinalForm: FormGroup;
  vSelectedOption: any = "OP";
  vsurgeryType: any = "1";

  isActive: boolean = true;
  autocompleteModeSurgeryCategory: String = "OttypeMaster";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";

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
  OPIPType = 0

  displayedColumns: string[] = [
    'sequence',
    'surgeryCategoryName',
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
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeResourseType: string = "ResourcesTypes";
  autocompleteModeSiteDescription: String = "SiteDescription";
  autocompleteModeDepartment: string = "Department";

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];
  registerObj2 = new OtReserInsert({});
  registerObj3 = new OtReserInsert({});
  vreservationType: any = "1";
  vpacrequired: any = "1";
  vbloodArranged: any = "1";
  vequipmentsRequired: any = "1";
  vinfective: any = "1";
  vreservationId: any;
  @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
  @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
  dateTimeObj: any;
  AllTypeDescription: any = []
  AllTypeDescription1: any = []
  RtrvDescriptionList: any = [];
  RtrvDescriptionList1: any = [];
  surgCategoryName: any;
  partTypes: string[] = ["Left", "Middle", "Right"];
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  doctorType: any;
  vPreOperationId: any;
  preOperSurgeryForm: FormGroup;
  preOperAttendentForm: FormGroup;
  preOperDiagnosisForm: FormGroup;
  preOperCathLabDiagnosisForm: FormGroup;

  constructor(public _OTPreOperationService: OtPreoperationService,
    public dialogRef: MatDialogRef<NewOtPreoperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, private _formBuilder: UntypedFormBuilder,
    private ref: MatDialogRef<NewOtPreoperationComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
    public _ConsentService: ConsentService,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.preOperationFinalForm = this._OTPreOperationService.createOtPreOperationForm();
    this.preOperationFinalForm.markAllAsTouched();

    this.preOperationFinalForm = this.createOtPreOperationFinalForm();

    this.preOperSurgeryForm = this.createtOtPreOperationSurgeryDetailsInsert();
    this.tOtPreOperationSurgeryDetailsArray.push(this.createtOtPreOperationSurgeryDetailsInsert())

    this.preOperAttendentForm = this.createtOtPreOperationAttendingDetailsInsert();
    this.tOtPreOperationAttendingDetailsArray.push(this.createtOtPreOperationAttendingDetailsInsert())

    this.preOperDiagnosisForm = this.createtOtPreOperationDiagnosesInsert();
    this.tOtPreOperationDiagnoses.push(this.createtOtPreOperationDiagnosesInsert())

    this.preOperCathLabDiagnosisForm = this.createtOtPreOperationCathlabDiagnosesInsert();
    this.tOtPreOperationCathlabDiagnosesArray.push(this.createtOtPreOperationCathlabDiagnosesInsert())

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName
      this.vPreOperationId = this.registerObj1.otPreOperationId
      this.OPIPType = this.registerObj1.opIpType




      setTimeout(() => {
        this._OTPreOperationService.getotTableById(this.data.ottable).subscribe((response) => {
          this.registerObj2 = response;
          // console.log("Get ottable Data:", this.registerObj2)
          this.ddlLocation.SetSelection(this.registerObj2.locationId);
        });
      }, 500);


      if (this.vPreOperationId > 0) {
        setTimeout(() => {
          this._OTPreOperationService.getpreOPerById(this.vPreOperationId).subscribe((response) => {
            this.registerObj3 = response;
            console.log("Get PreOper Data:", this.registerObj3)
            this.vreservationId = this.registerObj3.otreservationId
            this.opIpId = this.registerObj3.opipid
            this.vSelectedOption = this.registerObj3.opiptype == 0 ? 'OP' : 'IP';
            this.vbloodArranged = this.registerObj3.bloodArranged == true ? '1' : '0';
            this.vpacrequired = this.registerObj3.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj3.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj3.infective == true ? '1' : '0';
            this.preOperationFinalForm.get('clearanceMedical')?.setValue(this.registerObj3.clearanceMedical)
            this.preOperationFinalForm.get('clearanceFinancial')?.setValue(this.registerObj3.clearanceFinancial)
            this.preOperationFinalForm.get('duration')?.setValue(this.registerObj3.duration)
            this.preOperationFinalForm.get('surgeryDate')?.setValue(this.registerObj3.surgeryDate)
            if (this.registerObj3?.fromTime) {
              const date = new Date(this.registerObj3.fromTime);
              if (!isNaN(date.getTime())) {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"
                setTimeout(() => {
                  this.preOperationFinalForm.get('fromTime')?.setValue(formattedTime);
                });
                console.log("Control value after patch:", this.preOperationFinalForm.get('fromTime')?.value);
              }
            }

            if (this.registerObj3?.toTime) {
              const date = new Date(this.registerObj3.toTime);
              if (!isNaN(date.getTime())) {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"
                setTimeout(() => {
                  this.preOperationFinalForm.get('toTime')?.setValue(formattedTime);
                });
                console.log("Control value after patch:", this.preOperationFinalForm.get('toTime')?.value);
              }
            }
          });
        }, 500);
      } else if (this.data.otReservationId) {
        setTimeout(() => {
          this._OTPreOperationService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Reservation Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
            this.vreservationType = this.registerObj2.reservationType == true ? '1' : '0';
            this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj2.infective == true ? '1' : '0';
            this.preOperationFinalForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate)
          });
        }, 500);
      }

      this.preOperationFinalForm.patchValue(this.registerObj1);
      if (this.vPreOperationId > 0) {
        this.getPreOperCatLabdiagnosisList();
        this.getPreOperdiagnosisList();
        this.getPreOperSurgeryDetList();
        this.getPreOperAttendentDetList();
      } else {
        this.getdiagnosisList(this.registerObj1);
        this.getReservationSurgeryDetList(this.registerObj1);
        this.getReservationAttendentDetList(this.registerObj1);
      }

      this.getfilterdata();
    }
  }

  formatDateTime(isoString: string) {
    const date = new Date(isoString);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${sec}`;
  }


  createOtPreOperationFinalForm() {
    return this._formBuilder.group({
      otpreOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otpreOperationDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      otpreOperationTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      opipid: [0],
      opiptype: 0,
      categoryType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ottable: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeryDate: [new Date().toISOString(), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      duration: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      fromTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      toTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      bloodArranged: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pacrequired: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      equipmentsRequired: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      infective: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      clearanceMedical: false,
      clearanceFinancial: false,

      tOtPreOperationAttendingDetails: this._formBuilder.array([]),
      tOtPreOperationCathlabDiagnoses: this._formBuilder.array([]),
      tOtPreOperationDiagnoses: this._formBuilder.array([]),
      tOtPreOperationSurgeryDetails: this._formBuilder.array([]),

      // extra fields
      TheaterLocation: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      diagnosis: [[]],
      cathLabDiagnosis: [[]],
      bodyPartId: [],

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
    });
  }

  createtOtPreOperationAttendingDetailsInsert(element: any = {}, index: number = 0): FormGroup {
    return this._formBuilder.group({
      otpreOperationAttendingDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otpreOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorTypeId: [element.doctorTypeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [element.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      seqNo: [index + 1]
    });
  }
  get tOtPreOperationAttendingDetailsArray(): FormArray {
    return this.preOperationFinalForm.get('tOtPreOperationAttendingDetails') as FormArray;
  }

  createtOtPreOperationCathlabDiagnosesInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      otpreOperationCathLabDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otpreOperationId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
    });
  }
  get tOtPreOperationCathlabDiagnosesArray(): FormArray {
    return this.preOperationFinalForm.get('tOtPreOperationCathlabDiagnoses') as FormArray;
  }

  createtOtPreOperationDiagnosesInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      otpreOperationDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otpreOperationId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
    });
  }
  get tOtPreOperationDiagnoses(): FormArray {
    return this.preOperationFinalForm.get('tOtPreOperationDiagnoses') as FormArray;
  }

  createtOtPreOperationSurgeryDetailsInsert(element: any = {}, index: number = 0): FormGroup {
    return this._formBuilder.group({
      otpreOperationSurgeryDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otpreOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      surgeryCategoryId: [element.surgeryCategoryId],
      surgeryId: [element.surgeryId],
      surgeryPart: [element.surgeryPart],
      surgeryFromTime: [element.surgeryFromTime],
      surgeryEndTime: [element.surgeryEndTime],
      surgeryDuration: [element.surgeryDuration],
      isPrimary: [String(element.isPrimary ?? false)],
      surgeonId: [element.surgeonId],
      anesthetistId: [element.anestheticsId],
      seqNo: [index + 1]
    });
  }

  get tOtPreOperationSurgeryDetailsArray(): FormArray {
    return this.preOperationFinalForm.get('tOtPreOperationSurgeryDetails') as FormArray;
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
    this.preOperationFinalForm.get('opipid').setValue('');
    this.preOperationFinalForm.get('opipid').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.registerObj1 = new OtReqInsert({});
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.preOperationFinalForm.get('diagnosis')?.setValue(this.addDiagnolist);
  }
  getdiagnosisList(obj) {
    this.addDiagnolist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "OTReservationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._OTPreOperationService.getRtrvRservdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otrequestDiagnosisDetId: element.otrequestDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.preOperationFinalForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("OT pre-OPEr DIAGNOSIS DATA:", this.preOperationFinalForm.get('diagnosis').value)
        }
      }
    });
  }

  // api pending
  getPreOperdiagnosisList() {
    this.addDiagnolist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "OTPreOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTPreOperationId", "fieldValue": String(this.vPreOperationId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._OTPreOperationService.getRtrvPreOPrdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otpreOperationDiagnosisDetId: element.otpreOperationDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.preOperationFinalForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("DIAGNOSIS DATA:", this.preOperationFinalForm.get('diagnosis').value)
        }
      }
    });
  }

  getPreOperCatLabdiagnosisList() {
    this.addcathLabDiagnolist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "OTPreOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTPreOperationId", "fieldValue": String(this.vPreOperationId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._OTPreOperationService.getRtrvCathlabdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'CathLabDiagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addcathLabDiagnolist.push(
              {
                otpreOperationCathLabDiagnosisDetId: element.otpreOperationCathLabDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.preOperationFinalForm.get('cathLabDiagnosis').setValue(this.addcathLabDiagnolist);
          console.log("Cath lab DIAGNOSIS DATA:", this.preOperationFinalForm.get('cathLabDiagnosis').value)
        }
      }
    });
  }

  addcathLabDiagnolist: any = [];
  selectChangeCathLabDiagnosis(selectedChips: string[]) {
    this.addcathLabDiagnolist = selectedChips;
    this.preOperationFinalForm.get('cathLabDiagnosis')?.setValue(this.addcathLabDiagnolist);
  }

  selectChangeSurgeryCategory(obj: any) {
    this.surgCategoryName = obj.text
  }
  selectChangeSurgery(obj: any) {
    this.surgName = obj.surgeryName
    this.ddlSurgerytype.SetSelection(obj.siteDescId);
    setTimeout(() => {
      this._OTPreOperationService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
        this.surgCategoryName = response.siteDescriptionName;
        console.log("Get siteDisc Data:", this.surgCategoryName)
      });
    }, 100);
  }
  selectChangeSurgeon(obj: any) {
    this.surgeonName = obj.text
  }
  selectChangeAnesth(obj: any) {
    this.AnthName = obj.text
  }
  selectChangedepdoctorType(obj: any) {
    if (obj.value) {
      this.doctorType = obj.text
      this._OTPreOperationService.getDoctorsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
  }
  selectChangedoctor(obj: any) {
    this.AnthName1 = obj.text
  }
  onChangeOtTable(e) {
    this.ddlLocation.SetSelection(e.locationId);
  }

  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    if (!this.preOperationFinalForm.get("surgeryId")?.value || this.preOperationFinalForm.get("surgeryId")?.value == "0") {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("surgeryPart")?.value) {
      this.toastr.warning('Please select a Surgery Part', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("surgeonId")?.value || this.preOperationFinalForm.get("surgeonId")?.value == "0") {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("anesthetistId")?.value || this.preOperationFinalForm.get("anesthetistId")?.value == "0") {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const selectedPrimary = this.preOperationFinalForm.get('isPrimary').value;
    const alreadyHasPrimary = this.dssurgeryDetailList.data.some(x => x.isPrimary);
    if (selectedPrimary && alreadyHasPrimary) {
      this.toastr.warning("Primary surgery already added. You can only select one primary.");
      return;
    }

    let newEntry = {
      surgeryCategoryName: this.surgCategoryName,
      surgeryCategoryId: this.preOperationFinalForm.get('surgeryCategoryId').value,
      surgeryId: this.preOperationFinalForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.preOperationFinalForm.get('surgeryPart').value,
      surgeryDuration: this.preOperationFinalForm.get('surgeryDuration').value,
      surgeryFromTime: this.preOperationFinalForm.get('surgeryFromTime').value,
      surgeryEndTime: this.preOperationFinalForm.get('surgeryEndTime').value,
      isPrimary: this.preOperationFinalForm.get('isPrimary').value,
      surgeonId: this.preOperationFinalForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.preOperationFinalForm.get('anesthetistId').value, //
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

    this.preOperationFinalForm.patchValue({
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
    this.surgCategoryName = '';
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
    // debugger
    console.log("Editing row:", contact);
    // Patch values into the form
    this.preOperationFinalForm.patchValue({
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
    this.surgCategoryName = contact.surgeryCategoryName ?? '';

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

  drop1(event: CdkDragDrop<any[]>) {
    const data = this.dssurgeryDetailList.data; // Extract raw array from MatTableDataSource
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dssurgeryDetailList.data = data; // Update table with reordered data
  }
  @ViewChild(CdkScrollable, { static: true }) scrollable1!: CdkScrollable;
  onDragMoved1(event: CdkDragMove) {
    const scrollContainer = this.scrollable1.getElementRef().nativeElement;
    const scrollRect = scrollContainer.getBoundingClientRect();
    const pointerY = event.pointerPosition.y;

    const edgeMargin = 60; // px from top/bottom where scrolling starts
    const scrollSpeed = 40; // 🔥 increase for faster scrolling

    if (pointerY < scrollRect.top + edgeMargin) {
      scrollContainer.scrollTop -= scrollSpeed;
    } else if (pointerY > scrollRect.bottom - edgeMargin) {
      scrollContainer.scrollTop += scrollSpeed;
    }
  }

  parseDate(dateStr: string) {
    const [d, m, yAndTime] = dateStr.split('-');
    const [y, time] = yAndTime.split(' ');
    return new Date(`${y}-${m}-${d} ${time}`);
  }

  FetchList: any = [];
  getReservationSurgeryDetList(obj) {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OTReservationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._OTPreOperationService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
      this.FetchList = records.data as OtReserInsert[];
      this.FetchList.forEach(element => {

        // const from = new Date(element.surgeryFromTime);
        // const end = new Date(element.surgeryEndTime);
        const from = this.parseDate(element.surgeryFromTime);
        const end = this.parseDate(element.surgeryEndTime);

        const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        this.Chargelist.push(
          {
            surgeryCategoryName: element.surgeryCategoryName,
            surgeryCategoryId: element.surgeryCategoryId,
            surgeryId: element.surgeryId,//
            surgeryName: element.surgeryName,
            surgeryPart: element.surgeryPart,
            surgeryDuration: Number(element.surgeryDuration).toFixed(2),
            surgeryFromTime: surgeryFromTime,
            surgeryEndTime: surgeryEndTime,
            isPrimary: element.isPrimary,
            surgeonId: element.surgeonId,//
            surgeonName: element.surgeonName,
            anestheticsId: element.anesthetistId, //
            anestheticsName: element.anestheticsName,
          });
      })
      this.dssurgeryDetailList.data = this.Chargelist
      console.log("surgeryDet Data:", this.dssurgeryDetailList.data)
    });

  }

  getPreOperSurgeryDetList() {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OTPreOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTPreOperationId", "fieldValue": String(this.vPreOperationId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._OTPreOperationService.getRtrvPreOperSurgeryList(m_data2).subscribe(records => {
      this.FetchList = records.data as OtReserInsert[];
      this.FetchList.forEach(element => {

        // const from = new Date(element.surgeryFromTime);
        // const end = new Date(element.surgeryEndTime);
        const from = this.parseDate(element.surgeryFromTime);
        const end = this.parseDate(element.surgeryEndTime);

        const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        this.Chargelist.push(
          {
            surgeryCategoryName: element.surgeryCategoryName,
            surgeryCategoryId: element.surgeryCategoryId,
            surgeryId: element.surgeryId,//
            surgeryName: element.surgeryName,
            surgeryPart: element.surgeryPart,
            surgeryDuration: Number(element.surgeryDuration).toFixed(2),
            surgeryFromTime: surgeryFromTime,
            surgeryEndTime: surgeryEndTime,
            isPrimary: element.isPrimary,
            surgeonId: element.surgeonId,//
            surgeonName: element.surgeonName,
            anestheticsId: element.anesthetistId, //
            anestheticsName: element.anestheticsName,
          });
      })
      this.dssurgeryDetailList.data = this.Chargelist
      console.log("surgeryDet Data:", this.dssurgeryDetailList.data)
    });

  }

  /////////////////////////////// surgery detail part end /////////////////////////////

  /////////////////////////////// attendent detail part /////////////////////////////

  onAdd1() {
    if (!this.preOperationFinalForm.get("doctorTypeId")?.value || this.preOperationFinalForm.get("doctorTypeId")?.value == "0") {
      this.toastr.warning('Please select a Doctor Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationFinalForm.get("doctorId")?.value || this.preOperationFinalForm.get("doctorId")?.value == "0") {
      this.toastr.warning('Please select a Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let newEntry = {
      doctorTypeId: this.preOperationFinalForm.get('doctorTypeId').value,//
      doctorType: this.doctorType,
      doctorId: this.preOperationFinalForm.get('doctorId').value, //
      doctorName: this.AnthName1,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex1 !== null) {
      this.Chargelist1[this.editIndex1] = newEntry;
      this.editIndex1 = null;
    } else {
      this.Chargelist1.push(newEntry);
    }
    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.preOperationFinalForm.patchValue({
      recourceType: '',
      doctorTypeId: '',
      doctorId: ''
    });
    this.doctorType = '';
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
    this.preOperationFinalForm.patchValue({
      doctorTypeId: contact.doctorTypeId ?? '',
      doctorId: contact.doctorId ?? ''
    });

    this.doctorType = contact.doctorType ?? '';
    this.AnthName1 = contact.doctorName ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist1.indexOf(contact);
    if (index > -1) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [...this.Chargelist1];
    }
  }

  drop2(event: CdkDragDrop<any[]>) {
    const data = this.dsattendentDetailList.data;
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dsattendentDetailList.data = data; // Update table with reordered data
  }

  @ViewChild(CdkScrollable, { static: true }) scrollable2!: CdkScrollable;
  onDragMoved2(event: CdkDragMove) {
    const scrollContainer = this.scrollable2.getElementRef().nativeElement;
    const scrollRect = scrollContainer.getBoundingClientRect();
    const pointerY = event.pointerPosition.y;

    const edgeMargin = 60; // px from top/bottom where scrolling starts
    const scrollSpeed = 40; // 🔥 increase for faster scrolling

    if (pointerY < scrollRect.top + edgeMargin) {
      scrollContainer.scrollTop -= scrollSpeed;
    } else if (pointerY > scrollRect.bottom - edgeMargin) {
      scrollContainer.scrollTop += scrollSpeed;
    }
  }

  FetchList1: any = [];
  getReservationAttendentDetList(obj) {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OTReservationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._OTPreOperationService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
      this.FetchList1 = records.data as OtReserInsert[];
      this.FetchList1.forEach(element => {

        this.Chargelist1.push(
          {
            doctorTypeId: element.doctorTypeId,//
            doctorType: element.doctorType,
            doctorId: element.doctorId, //
            doctorName: element.doctorName,
          });
      })
      this.dsattendentDetailList.data = this.Chargelist1
      console.log("attendentDet Data:", this.dsattendentDetailList.data)
    });

  }

  getPreOperAttendentDetList() {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OTPreOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTPreOperationId", "fieldValue": String(this.vPreOperationId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._OTPreOperationService.getRtrvpreOperAttendentList(m_data2).subscribe(records => {
      this.FetchList1 = records.data as OtReserInsert[];
      this.FetchList1.forEach(element => {

        this.Chargelist1.push(
          {
            doctorTypeId: element.doctorTypeId,//
            doctorType: element.doctorType,
            doctorId: element.doctorId, //
            doctorName: element.doctorName,
          });
      })
      this.dsattendentDetailList.data = this.Chargelist1
      console.log("attendentDet Data:", this.dsattendentDetailList.data)
    });

  }

  /////////////////////////////// attendent detail part end/////////////////////////////

  showAddBtn = false;

  onTabChange(index: number) {
    this.showAddBtn = index === 1;
  }

  selectedDate: any;
  onSurgeryDateChange(event: any) {
    this.selectedDate = event.value;   // This is a Date object
    this.preOperationFinalForm.get('surgeryDate')?.setValue(this.selectedDate);
    console.log("Selected:", this.selectedDate);
  }

  onSubmit() {
    debugger
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.preOperationFinalForm.get('opipid').setValue(this.opIpId);
    this.preOperationFinalForm.get('otpreOperationId')?.setValue(this.vPreOperationId || 0);
    this.preOperationFinalForm.get('otpreOperationDate').setValue(formattedDate);
    this.preOperationFinalForm.get('otpreOperationTime').setValue(formattedTime);

    if (this.addDiagnolist.length > 0) {
      this.addDiagnolist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Diagnosis"
        });
      });
    }

    if (this.addcathLabDiagnolist.length > 0) {
      this.addcathLabDiagnolist.forEach(element => {
        this.AllTypeDescription1.push({
          descriptionName: element.descriptionName,
          descriptionType: "CathLabDiagnosis"
        });
      });
    }

    console.log(this.preOperationFinalForm.value)

    if (!this.preOperationFinalForm.invalid) {
      debugger

      this.preOperationFinalForm.get('otreservationId')?.setValue(this.vreservationId ?? 0);
      this.preOperationFinalForm.get('otpreOperationId')?.setValue(this.vPreOperationId ?? 0);
      this.preOperationFinalForm.get('opiptype').setValue(this.vSelectedOption === "OP" ? 0 : 1);
      // this.preOperationFinalForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate ?? this.selectedDate);

      if (this.dssurgeryDetailList.data.length === 0) {
        this.toastr.warning('Data is not available in list ,please add surgery details in the list.', 'Warning');
        return;
      }

      this.tOtPreOperationSurgeryDetailsArray.clear();
      this.dssurgeryDetailList.data.forEach(item => {
        this.tOtPreOperationSurgeryDetailsArray.push(this.createtOtPreOperationSurgeryDetailsInsert(item));
      });

      this.tOtPreOperationAttendingDetailsArray.clear();
      this.dsattendentDetailList.data.forEach(item => {
        this.tOtPreOperationAttendingDetailsArray.push(this.createtOtPreOperationAttendingDetailsInsert(item));
      });

      this.tOtPreOperationDiagnoses.clear();
      this.AllTypeDescription.forEach(item => {
        this.tOtPreOperationDiagnoses.push(this.createtOtPreOperationDiagnosesInsert(item));
      });

      this.tOtPreOperationDiagnoses.clear();
      if (this.AllTypeDescription.length === 0) {
        const DiagnosisForm: FormGroup = this.createtOtPreOperationDiagnosesInsert({});
        this.tOtPreOperationDiagnoses.push(DiagnosisForm);
      } else {
        this.AllTypeDescription.forEach(element => {
          const DiagnosisForm: FormGroup = this.createtOtPreOperationDiagnosesInsert(element);
          this.tOtPreOperationDiagnoses.push(DiagnosisForm);
        });
      }

      this.tOtPreOperationCathlabDiagnosesArray.clear();
      this.AllTypeDescription1.forEach(item => {
        this.tOtPreOperationCathlabDiagnosesArray.push(this.createtOtPreOperationCathlabDiagnosesInsert(item));
      });

      this.tOtPreOperationCathlabDiagnosesArray.clear();
      if (this.AllTypeDescription1.length === 0) {
        const CathlabDiagnosisForm: FormGroup = this.createtOtPreOperationCathlabDiagnosesInsert({});
        this.tOtPreOperationCathlabDiagnosesArray.push(CathlabDiagnosisForm);
      } else {
        this.AllTypeDescription1.forEach(element => {
          const CathlabDiagnosisForm: FormGroup = this.createtOtPreOperationCathlabDiagnosesInsert(element);
          this.tOtPreOperationCathlabDiagnosesArray.push(CathlabDiagnosisForm);
        });
      }

      const formValue = { ...this.preOperationFinalForm.value };
      const controlsToRemove = ['TheaterLocation', 'bodyPartId', 'surgeryCategoryId', 'surgeryId', 'surgeryPart', 'surgeryFromTime', 'surgeryEndTime', 'surgeryDuration', 'isPrimary',
        'surgeonId', 'anesthetistId', 'recourceType', 'doctorTypeId', 'doctorId', 'diagnosis', 'cathLabDiagnosis'];
      controlsToRemove.forEach(key => delete formValue[key]);

      console.log(formValue)

      this._OTPreOperationService.InsertOTPreOperation(formValue).subscribe(response => {
        this.OnViewPreOprationReportPdf()
        this._matDialog.closeAll();
      });
    } else {
      const invalidFields = this.collectErrors(this.preOperationFinalForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.preOperationFinalForm.get('opiptype').setValue('OP')
  }

  calculateToTime() {
    const duration = this.preOperationFinalForm.get('surgeryDuration')?.value;
    const start = this.preOperationFinalForm.get('surgeryFromTime')?.value;

    if (!start || duration === null) return;

    // split duration 1.30 → ["1","30"]
    const parts = duration.toString().split('.');
    const hrs = Number(parts[0]);  // before decimal
    const mins = parts[1] ? Number(parts[1].padEnd(2, '0')) : 0; // after decimal as minutes

    const [h, m] = start.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(h, m, 0);

    // Add hours + minutes
    startDate.setHours(startDate.getHours() + hrs);
    startDate.setMinutes(startDate.getMinutes() + mins);

    const endH = startDate.getHours().toString().padStart(2, '0');
    const endM = startDate.getMinutes().toString().padStart(2, '0');

    this.preOperationFinalForm.get('surgeryEndTime')?.setValue(`${endH}:${endM}`);
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.preOperationFinalForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.preOperationFinalForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.preOperationFinalForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.preOperationFinalForm.get('surgeryDuration')?.value;
    const startTime = this.preOperationFinalForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.preOperationFinalForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.preOperationFinalForm.get('surgeryFromTime')?.value;
    const endTime = this.preOperationFinalForm.get('surgeryEndTime')?.value;

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
    this.preOperationFinalForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onChangeDuration1(event: any) {
    // debugger
    const durationHours = parseFloat(this.preOperationFinalForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.preOperationFinalForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.preOperationFinalForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom1(event: any) {
    const duration = this.preOperationFinalForm.get('duration')?.value;
    const startTime = this.preOperationFinalForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration1(null); // reuse logic for calculating end time
    } else {
      const endTime = this.preOperationFinalForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration1(startTime, endTime);
      }
    }
  }

  onChangeTimeto1(event: any) {
    const startTime = this.preOperationFinalForm.get('fromTime')?.value;
    const endTime = this.preOperationFinalForm.get('toTime')?.value;

    if (startTime && endTime) {
      this.calculateDuration1(startTime, endTime);
    }
  }

  calculateDuration1(startTime: string, endTime: string) {
    // debugger
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

    const dh = Math.floor(durationMinutes / 60);
    const dm = durationMinutes % 60;

    const duration = `${this.pad1(dh)}:${this.pad1(dm)}`;
    this.preOperationFinalForm.get('duration')?.setValue(duration);
  }

  pad1(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onFiles() {
    const dialogRef = this._matDialog.open(
      AirmidConsentformComponent,
      {
        maxWidth: "90vw",
        maxHeight: '85%',
        width: '70%',
        data: { refId: this.vreservationId, opipId: this.opIpId, opipType: this.opipType, Id: 0, title: 'Consent', labelType: 'OT' }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.grid.bindGridData();
    });
  }

  // Consent list
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA', width: 500 },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "RefId", fieldValue: String(this.data.otReservationId), opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    apiUrl: "TransactionConsentMaster/List",
    columnsList: this.allcolumns,
    sortField: "RefId",
    sortOrder: 0,
    filters: this.allfilters
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "TransactionConsentMaster/List",
      columnsList: this.allcolumns,
      sortField: "RefId",
      sortOrder: 0,
      filters: [
        { fieldName: "RefId", fieldValue: String(this.data.otReservationId), opType: OperatorComparer.Equals },
      ]
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  delete(element) {
    if (element.consentId) {
      this._OTPreOperationService.deactivateTheStatus(element.consentId).subscribe((response: any) => {
        this.grid.bindGridData();
      });
    }
  }


  OnViewPreOprationReportPdf() {
    debugger
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            fieldName: "OPIPID",
            fieldValue: String(this.opIpId),
            opType: "Equals"
          },
          {
            fieldName: "OPIPType",
            fieldValue: String(this.OPIPType),
            opType: "Equals"
          }
        ],
        "mode": "OTPreOperationReport"
      }
      console.log(param)
      this._ConsentService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OT PreOPration Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  OnViewReportPdf(element: any) {

    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "ConsentId",
            "fieldValue": String(element.consentId),
            "opType": "Equals"
          },
          {
            "fieldName": "OPIPType",
            "fieldValue": String(element.opiptype),
            "opType": "Equals"
          }
        ],
        "mode": "ConsentInformation"
      }

      this._ConsentService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Consent Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }
  opipType = 0
  // OnPrint(element) {
  //   console.log(element)
  //   debugger
  //   const param = {

  //     "searchFields": [
  //       {
  //         "fieldName": "OPIPID",
  //         "fieldValue": String(this.opIpId),
  //         "opType": "Equals"
  //       },
  //       {
  //         "fieldName": "OPIPType",
  //         "fieldValue": String(this.opipType),
  //         "opType": "Equals"
  //       }
  //     ],
  //     mode: "OTPreOperationReport"
  //   };
  //   console.log(param)
  //   this._OTPreOperationService.getReportView(param).subscribe(res => {
  //     const matDialog = this._matDialog.open(PdfviewerComponent, {
  //       maxWidth: "85vw",
  //       height: '750px',
  //       width: '100%',
  //       data: {
  //         base64: res["base64"] as string,
  //         title: "OTPreOperation Report Viewer"
  //       }
  //     });

  //     matDialog.afterClosed().subscribe(result => {

  //     });
  //   });
  //   // this.commonService.Onprint("AnesthesiaId", element.AnesthesiaId, "OTAnaesthesiaRecord");

  // }
}
