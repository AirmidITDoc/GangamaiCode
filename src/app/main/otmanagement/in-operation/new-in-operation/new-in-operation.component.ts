import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { InOperationService } from '../in-operation.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-new-in-operation',
  templateUrl: './new-in-operation.component.html',
  styleUrls: ['./new-in-operation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewInOperationComponent {
  // inOperForm: FormGroup;  
  inOperFinalForm: FormGroup;
  inOperSurgeryForm: FormGroup;
  inOperAttendentForm: FormGroup;
  inOperDiagnosisForm: FormGroup;
  inOperPostDiagnosisForm: FormGroup;
  screenFromString = 'Common-form';
  opIpType: boolean = false;
  opIpId: any;
  RegId: string;
  vInstruction: any;
  votbookingId: any = ""
  vsurgeryType: any = "1";
  isActive: boolean = true;
  vSelectedOption: any = 'OP';
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  surgName: any;
  surgeonName: any;
  editIndex: number | null = null;
  AnthName: any;
  anesthesiaType: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  movedatetime: any;
  timeflag = 0
  minDate: Date;

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
    'sequence',
    'surgeon',
    'anesthesia',
    'Action'
  ];

  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeotTableCategory: String = "OttypeMaster";
  autocompleteModeSiteDescription: String = "SiteDescription";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeResourseType: string = "ResourcesTypes";

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  AnthName1: any;
  editIndex1: number | null = null;
  partTypes: string[] = ["Left", "Middle", "Right"];
  @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
  @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  vreservationId: any;
  registerObj2 = new OtReserInsert({});
  registerObj1 = new OtReserInsert({});
  surgCategoryName: any;
  vpacrequired: any = "1";
  vequipmentsRequired: any = "1";
  vinfective: any = "1";
  vbloodArranged: any = "1"
  vInterOPe: any = "1";
  vmopCount: any = "1";
  doctorType: any;
  doctorTypeId: any;
  vInOperationId: any;
  AllTypeDescription: any = []
  AllTypeDescription1: any = []
  RtrvDescriptionList: any = [];
  RtrvDescriptionList1: any = [];

  constructor(public _inOpearionService: InOperationService,
    public dialogRef: MatDialogRef<NewInOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<NewInOperationComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService) { }

  ngOnInit(): void {
    this.inOperFinalForm = this.createOtInOperationFinalForm();
    this.inOperFinalForm.markAllAsTouched();

    this.inOperSurgeryForm = this.createtOtInOperationSurgeryDetailsInsert();
    this.tOtInOperationSurgeryDetailsArray.push(this.createtOtInOperationSurgeryDetailsInsert())

    this.inOperAttendentForm = this.createtOtInOperationAttendingDetailsInsert();
    this.tOtInOperationAttendingDetailsArray.push(this.createtOtInOperationAttendingDetailsInsert())

    this.inOperDiagnosisForm = this.createtOtInOperationDiagnosesInsert();
    this.tOtInOperationDiagnosesArray.push(this.createtOtInOperationDiagnosesInsert())

    this.inOperPostDiagnosisForm = this.createtOtInOperationPostDiagnosesInsert();
    this.tOtInOperationPostDiagnoses.push(this.createtOtInOperationPostDiagnosesInsert())

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName
      this.vInOperationId = this.registerObj1.otInOperationId

      setTimeout(() => {
        this._inOpearionService.getotTableById(this.data.ottable).subscribe((response) => {
          this.registerObj2 = response;
          // console.log("Get ottable Data:", this.registerObj2)
          this.ddlLocation.SetSelection(this.registerObj2.locationId);
        });
      }, 500);

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._inOpearionService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
            this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj2.infective == true ? '1' : '0';
            this.inOperFinalForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate)
          });
        }, 500);
      }

      if (this.vInOperationId > 0) {
        // setTimeout(() => {
        //   this._inOpearionService.getpreOPerById(this.vPreOperationId).subscribe((response) => {
        //     this.registerObj3 = response;
        //     console.log("Get Data:", this.registerObj3)
        //     this.vreservationId = this.registerObj3.otreservationId
        //     this.opIpId = this.registerObj3.opipid
        //     this.vSelectedOption = this.registerObj3.opiptype == 0 ? 'OP' : 'IP';
        //     this.vbloodArg = this.registerObj3.bloodArranged == true ? '1' : '0';
        //     this.vpacrequired = this.registerObj3.pacrequired == true ? '1' : '0';
        //     this.vequipmentsRequired = this.registerObj3.equipmentsRequired == true ? '1' : '0';
        //     this.vinfective = this.registerObj3.infective == true ? '1' : '0';
        //     this.vbloodArranged = this.registerObj3.infective == true ? '1' : '0';
        //     this.vmopCount = this.registerObj3.mopCount == true ? '1' : '0';
        //     this.vInterOPe = this.registerObj3.intraOpeChangeInSurgeryPlan == true ? '1' : '0';
        //     this.inOperFinalForm.get('duration')?.setValue(this.registerObj3.duration)
        //     this.inOperFinalForm.get('fromTime')?.setValue(this.registerObj3.fromTime.trim())
        //     this.inOperFinalForm.get('toTime')?.setValue(this.registerObj3.toTime.trim())
        //   });
        // }, 500);
      }

      this.inOperFinalForm.patchValue(this.registerObj1);

      if (this.vInOperationId > 0) {
        this.getInOperPostdiagnosisList();
        this.getInOperdiagnosisList();
        this.getInOperSurgeryDetList();
        this.getInOperAttendentDetList();
      } else {
        this.getdiagnosisList(this.registerObj1);
        this.getReservationSurgeryDetList(this.registerObj1);
        this.getReservationAttendentDetList(this.registerObj1);
      }
    }
  }

  createOtInOperationFinalForm() {
    return this._formBuilder.group({
      otinOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otinOperationDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      otinOperationTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      opipid: [0],
      opiptype: 1,
      categoryType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ottable: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeryDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      duration: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      fromTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      toTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      bloodLoss: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      stepsOfProc: [''],
      anesthesiaType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      theaterInDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      theaterInTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      theaterOutData: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      theaterOutTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      bloodArranged: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pacrequired: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      equipmentsRequired: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      infective: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      clearanceMedical: false,
      clearanceFinancial: false,
      intraOpeChangeInSurgeryPlan: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mopCount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      closureNotes: [''],
      operativeFindingsNotes: [''],
      postOperativeNotes: [''],
      conditionOfPatientNotes: [''],

      tOtInOperationAttendingDetails: this._formBuilder.array([]),
      tOtInOperationDiagnoses: this._formBuilder.array([]),
      tOtInOperationPostOperDiagnoses: this._formBuilder.array([]),
      tOtInOperationSurgeryDetails: this._formBuilder.array([]),

      // extra fields
      TheaterLocation: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      diagnosis: [[], [Validators.required]],
      postDiagnosis: [[], [Validators.required]],
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

  createtOtInOperationAttendingDetailsInsert(element: any = {}, index: number = 0): FormGroup {
    return this._formBuilder.group({
      otinOperationAttendingDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otinOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorTypeId: [element.doctorTypeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [element.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      seqNo: [index + 1]
    });
  }
  get tOtInOperationAttendingDetailsArray(): FormArray {
    return this.inOperFinalForm.get('tOtInOperationAttendingDetails') as FormArray;
  }

  createtOtInOperationSurgeryDetailsInsert(element: any = {}, index: number = 0): FormGroup {
    return this._formBuilder.group({
      otinOperationSurgeryDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otinOperationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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

  get tOtInOperationSurgeryDetailsArray(): FormArray {
    return this.inOperFinalForm.get('tOtInOperationSurgeryDetails') as FormArray;
  }

  createtOtInOperationDiagnosesInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      otinOperationDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otinOperationId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
    });
  }
  get tOtInOperationDiagnosesArray(): FormArray {
    return this.inOperFinalForm.get('tOtInOperationDiagnoses') as FormArray;
  }

  createtOtInOperationPostDiagnosesInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      otinOperationPostOperDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otinOperationId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
    });
  }
  get tOtInOperationPostDiagnoses(): FormArray {
    return this.inOperFinalForm.get('tOtInOperationPostOperDiagnoses') as FormArray;
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  onChangeReg(event) {
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

  patientInfoReset() {
    this.inOperFinalForm.get('opipid').setValue('');
    this.inOperFinalForm.get('opipid').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.registerObj1 = new OtReserInsert({});
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

  selectChangeSurgeryCategory(obj: any) {
    this.surgCategoryName = obj.text
  }
  selectChangeSurgery(obj: any) {
    this.surgName = obj.surgeryName
    this.ddlSurgerytype.SetSelection(obj.siteDescId);
    setTimeout(() => {
      this._inOpearionService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
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
  selectChangedoctor(obj: any) {
    this.AnthName1 = obj.text
  }
  onChangeOtTable(e) {
    this.ddlLocation.SetSelection(e.locationId);
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.inOperFinalForm.get('diagnosis')?.setValue(this.addDiagnolist);
  }

  addDiagnolist1: any = [];
  selectChangeDiagnosis1(selectedChips: string[]) {
    this.addDiagnolist1 = selectedChips;
    this.inOperFinalForm.get('postDiagnosis')?.setValue(this.addDiagnolist1);
  }

  selectChangeanesthesiaType(obj: any) {
    this.anesthesiaType = obj.text
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.inOperFinalForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.inOperFinalForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.inOperFinalForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.inOperFinalForm.get('surgeryDuration')?.value;
    const startTime = this.inOperFinalForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.inOperFinalForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.inOperFinalForm.get('surgeryFromTime')?.value;
    const endTime = this.inOperFinalForm.get('surgeryEndTime')?.value;

    if (startTime && endTime) {
      this.calculateDuration(startTime, endTime);
    }
  }

  calculateDuration(startTime: string, endTime: string) {
    debugger
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

    const dh = Math.floor(durationMinutes / 60);
    const dm = durationMinutes % 60;

    const duration = `${this.pad(dh)}:${this.pad(dm)}`;
    this.inOperFinalForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onChangeDuration1(event: any) {
    // debugger
    const durationHours = parseFloat(this.inOperFinalForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.inOperFinalForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.inOperFinalForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom1(event: any) {
    const duration = this.inOperFinalForm.get('duration')?.value;
    const startTime = this.inOperFinalForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration1(null); // reuse logic for calculating end time
    } else {
      const endTime = this.inOperFinalForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration1(startTime, endTime);
      }
    }
  }

  onChangeTimeto1(event: any) {
    const startTime = this.inOperFinalForm.get('fromTime')?.value;
    const endTime = this.inOperFinalForm.get('toTime')?.value;

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
    this.inOperFinalForm.get('duration')?.setValue(duration);
  }

  pad1(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onClear(val: boolean) {
    this.inOperFinalForm.reset();
    this.dialogRef.close(val);
  }

  selectChangeanesthesiaType1(obj: any) {
    this.anesthesiaType = obj.text
  }
  selectChangeAnesth1(obj: any) {
    this.AnthName1 = obj.text
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

    this._inOpearionService.getRtrvdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otreservationDiagnosisDetId: element.otreservationDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.inOperFinalForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("DIAGNOSIS DATA:", this.inOperFinalForm.get('diagnosis').value)
        }
      }
    });
  }

  getInOperdiagnosisList() {
    this.addDiagnolist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "OTInOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTInOperationId", "fieldValue": String(this.vInOperationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._inOpearionService.getRtrvInoprdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otinOperationDiagnosisDetId: element.otinOperationDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.inOperFinalForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("DIAGNOSIS DATA:", this.inOperFinalForm.get('diagnosis').value)
        }
      }
    });
  }

   getInOperPostdiagnosisList() {
    this.addDiagnolist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "OTInOperationId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTInOperationId", "fieldValue": String(this.vInOperationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._inOpearionService.getRtrvInoprPostdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'postDiagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otinOperationPostOperDiagnosisDetId: element.otinOperationPostOperDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.inOperFinalForm.get('postDiagnosis').setValue(this.addDiagnolist);
          console.log("Post DIAGNOSIS DATA:", this.inOperFinalForm.get('postDiagnosis').value)
        }
      }
    });
  }
  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    // if (!this.inOperFinalForm.get("surgeryCategoryId")?.value) {
    //   this.toastr.warning('Please select a surgery Type', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if (!this.inOperFinalForm.get("surgeryId")?.value || this.inOperFinalForm.get("surgeryId")?.value == "0") {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("surgeryPart")?.value) {
      this.toastr.warning('Please select a Surgery Part', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("surgeonId")?.value || this.inOperFinalForm.get("surgeonId")?.value == "0") {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("anesthetistId")?.value || this.inOperFinalForm.get("anesthetistId")?.value == "0") {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // debugger
    // const surgeryDate = this.inOperFinalForm.get('surgeryDate')?.value;
    // const surgeryFromTime = this.inOperFinalForm.get('surgeryFromTime')?.value;

    // let combinedDateTime = null;

    // if (surgeryDate && surgeryFromTime) {
    //   combinedDateTime = new Date(surgeryDate);
    //   const [hours, minutes] = surgeryFromTime.split(':');
    //   combinedDateTime.setHours(+hours, +minutes, 0, 0);
    // }

    let newEntry = {
      surgeryCategoryName: this.surgCategoryName,
      surgeryCategoryId: this.inOperFinalForm.get('surgeryCategoryId').value,
      surgeryId: this.inOperFinalForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.inOperFinalForm.get('surgeryPart').value,
      surgeryDuration: this.inOperFinalForm.get('surgeryDuration').value,
      // surgeryFromTime: combinedDateTime,
      surgeryFromTime: this.inOperFinalForm.get('surgeryFromTime').value,
      surgeryEndTime: this.inOperFinalForm.get('surgeryEndTime').value,
      isPrimary: this.inOperFinalForm.get('isPrimary').value,
      surgeonId: this.inOperFinalForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.inOperFinalForm.get('anesthetistId').value, //
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

    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.inOperFinalForm.patchValue({
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
    this.inOperFinalForm.patchValue({
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

    this.surgName = contact.surgeryName ?? '';
    this.surgCategoryName = contact.surgeryCategoryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dssurgeryDetailList.data = [...this.Chargelist];
    }
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

    this._inOpearionService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
      this.FetchList = records.data as OtReserInsert[];
      this.FetchList.forEach(element => {

        const from = new Date(element.surgeryFromTime);
        const end = new Date(element.surgeryEndTime);

        const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        this.Chargelist.push(
          {
            surgeryCategoryName: element.surgeryCategoryName,
            surgeryCategoryId: element.surgeryCategoryId,
            surgeryId: element.surgeryId,//
            surgeryName: element.surgeryName,
            surgeryPart: element.surgeryPart,
            surgeryDuration: element.surgeryDuration,
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

  getInOperSurgeryDetList() {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OtinOperationSurgeryDetId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTInOperationId", "fieldValue": String(this.vInOperationId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._inOpearionService.getRtrvinOperSurgeryList(m_data2).subscribe(records => {
      this.FetchList = records.data as OtReserInsert[];
      this.FetchList.forEach(element => {

        const from = new Date(element.surgeryFromTime);
        const end = new Date(element.surgeryEndTime);

        const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        this.Chargelist.push(
          {
            surgeryCategoryName: element.surgeryCategoryName,
            surgeryCategoryId: element.surgeryCategoryId,
            surgeryId: element.surgeryId,//
            surgeryName: element.surgeryName,
            surgeryPart: element.surgeryPart,
            surgeryDuration: element.surgeryDuration,
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
      console.log("In surgeryDet Data:", this.dssurgeryDetailList.data)
    });

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
    if (!this.inOperFinalForm.get("doctorTypeId")?.value || this.inOperFinalForm.get("doctorTypeId")?.value == "0") {
      this.toastr.warning('Please select a Doctor Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperFinalForm.get("doctorId")?.value || this.inOperFinalForm.get("doctorId")?.value == "0") {
      this.toastr.warning('Please select a Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let newEntry = {
      doctorTypeId: this.inOperFinalForm.get('doctorTypeId').value,//
      doctorType: this.doctorType,
      doctorId: this.inOperFinalForm.get('doctorId').value, //
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

    this.inOperFinalForm.patchValue({
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
    // debugger
    console.log("Editing row:", contact);
    this.inOperFinalForm.patchValue({
      doctorTypeId: contact.doctorTypeId ?? '',
      doctorId: contact.doctorId ?? ''
    });

    this.doctorType = contact.doctorType ?? '';
    this.AnthName1 = contact.doctorName ?? '';

    const index = this.Chargelist1.indexOf(contact);
    if (index > -1) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [...this.Chargelist1];
    }
  }

  selectChangedepdoctorType(obj: any) {
    if (obj.value) {
      this.doctorType = obj.text
      this._inOpearionService.getDoctorsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
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

    this._inOpearionService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
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

  getInOperAttendentDetList() {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "OTInOperationAttendingDetId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "OTInOperationId", "fieldValue": String(this.vInOperationId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._inOpearionService.getRtrvinOperAttendentList(m_data2).subscribe(records => {
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
      console.log("In attendentDet Data:", this.dsattendentDetailList.data)
    });

  }

  /////////////////////////////// attendent detail part end/////////////////////////////

  onSubmit() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.inOperFinalForm.get('opipid').setValue(this.opIpId);
    this.inOperFinalForm.get('otinOperationId')?.setValue(this.vInOperationId || 0);
    this.inOperFinalForm.get('otinOperationDate').setValue(formattedDate);
    this.inOperFinalForm.get('otinOperationTime').setValue(formattedTime);

    if (this.addDiagnolist.length > 0) {
      this.addDiagnolist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Diagnosis"
        });
      });
    }

    if (this.addDiagnolist1.length > 0) {
      this.addDiagnolist1.forEach(element => {
        this.AllTypeDescription1.push({
          descriptionName: element.descriptionName,
          descriptionType: "postDiagnosis"
        });
      });
    }

    console.log(this.inOperFinalForm.value)

    if (!this.inOperFinalForm.invalid) {
      debugger

      this.inOperFinalForm.get('otreservationId')?.setValue(this.vreservationId ?? 0);
      this.inOperFinalForm.get('otinOperationId')?.setValue(this.vInOperationId ?? 0);
      this.inOperFinalForm.get('opiptype')?.setValue(this.inOperFinalForm.get('opiptype')?.value === 'IP' ? '1' : '0');
      this.inOperFinalForm.get('bloodArranged')?.setValue(this.inOperFinalForm.get('bloodArranged')?.value === true ? 1 : 0);
      this.inOperFinalForm.get('pacrequired')?.setValue(this.inOperFinalForm.get('pacrequired')?.value === true ? 1 : 0);
      this.inOperFinalForm.get('equipmentsRequired')?.setValue(this.inOperFinalForm.get('equipmentsRequired')?.value === true ? 1 : 0);
      this.inOperFinalForm.get('infective')?.setValue(this.inOperFinalForm.get('infective')?.value === true ? 1 : 0);
      this.inOperFinalForm.get('clearanceMedical')?.setValue(this.inOperFinalForm.get('clearanceMedical')?.value === true ? 1 : 0);
      this.inOperFinalForm.get('clearanceFinancial')?.setValue(this.inOperFinalForm.get('clearanceFinancial')?.value === true ? 1 : 0);

      if (this.dssurgeryDetailList.data.length === 0) {
        this.toastr.warning('Data is not available in list ,please add surgery details in the list.', 'Warning');
        return;
      }

      this.tOtInOperationSurgeryDetailsArray.clear();
      this.dssurgeryDetailList.data.forEach(item => {
        this.tOtInOperationSurgeryDetailsArray.push(this.createtOtInOperationSurgeryDetailsInsert(item));
      });

      this.tOtInOperationAttendingDetailsArray.clear();
      this.dsattendentDetailList.data.forEach(item => {
        this.tOtInOperationAttendingDetailsArray.push(this.createtOtInOperationAttendingDetailsInsert(item));
      });

      this.tOtInOperationDiagnosesArray.clear();
      this.AllTypeDescription.forEach(item => {
        this.tOtInOperationDiagnosesArray.push(this.createtOtInOperationDiagnosesInsert(item));
      });

      this.tOtInOperationDiagnosesArray.clear();
      if (this.AllTypeDescription.length === 0) {
        const DiagnosisForm: FormGroup = this.createtOtInOperationDiagnosesInsert({});
        this.tOtInOperationDiagnosesArray.push(DiagnosisForm);
      } else {
        this.AllTypeDescription.forEach(element => {
          const DiagnosisForm: FormGroup = this.createtOtInOperationDiagnosesInsert(element);
          this.tOtInOperationDiagnosesArray.push(DiagnosisForm);
        });
      }

      this.tOtInOperationPostDiagnoses.clear();
      this.AllTypeDescription1.forEach(item => {
        this.tOtInOperationPostDiagnoses.push(this.createtOtInOperationPostDiagnosesInsert(item));
      });

      this.tOtInOperationPostDiagnoses.clear();
      if (this.AllTypeDescription1.length === 0) {
        const CathlabDiagnosisForm: FormGroup = this.createtOtInOperationPostDiagnosesInsert({});
        this.tOtInOperationPostDiagnoses.push(CathlabDiagnosisForm);
      } else {
        this.AllTypeDescription1.forEach(element => {
          const CathlabDiagnosisForm: FormGroup = this.createtOtInOperationPostDiagnosesInsert(element);
          this.tOtInOperationPostDiagnoses.push(CathlabDiagnosisForm);
        });
      }

      const formValue = { ...this.inOperFinalForm.value };
      const controlsToRemove = ['TheaterLocation', 'bodyPartId', 'surgeryCategoryId', 'surgeryId', 'surgeryPart', 'surgeryFromTime', 'surgeryEndTime', 'surgeryDuration', 'isPrimary',
        'surgeonId', 'anesthetistId', 'recourceType', 'doctorTypeId', 'doctorId', 'diagnosis', 'postDiagnosis',];
      controlsToRemove.forEach(key => delete formValue[key]);

      console.log(formValue)

      this._inOpearionService.InsertOTInOperation(formValue).subscribe(response => {
        // this.viewgetIndentReportPdf(response)
        this._matDialog.closeAll();
      });
    } else {
      const invalidFields = this.collectErrors(this.inOperFinalForm);
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

  onChangeDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperFinalForm.get('theaterInDate').setValue(isoDateString);
    }
  }

  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperFinalForm.get('theaterInTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }


  onChangeOutDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperFinalForm.get('theaterOutData').setValue(isoDateString);
    }
  }

  onChangeOutTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperFinalForm.get('theaterOutTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
}
