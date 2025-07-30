import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { MedicineSchedulerComponent } from './medicine-scheduler/medicine-scheduler.component';
import { NewTemplateComponent } from './new-template/new-template.component';
import { NursingnoteService } from './nursingnote.service';

@Component({
  selector: 'app-nursingnote',
  templateUrl: './nursingnote.component.html',
  styleUrls: ['./nursingnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NursingnoteComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,
  };

  onBlur(e: any) {
    this.vDescription = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  displayedItemColumn: string[] = [
    'Status',
    'DrugName',
    'DoseName',
    'Route',
    'Frequency',
    'NurseName',
    'Action'
  ]

  currentDate = new Date();
  vCompanyName: any;
  vRegNo: any;
  vDescription: any;
  vGender: any;
  vIPDNo: any;
  vAgeyear: any;
  vAgeMonth: any;
  vAgeDay: any;
  vWardName: any;
  vBedName: any;
  vPatientType: any;
  vRefDocName: any;
  vTariffName: any;
  vDoctorName: any;
  vPatientName: any;
  vDepartment: any;
  vAge: any;
  vGenderName: any;
  vDOA: any;
  OP_IP_Id: any;
  myform: FormGroup;
  myNursingForm: FormGroup;
  myHandOverForm: FormGroup;
  IsAddFlag: boolean = true;
  registerObj: any;
  vDoctNoteId: any;
  NoteList: any = [];
  // selectedAdvanceObj: AdmissionPersonlModel;
  dsItemList = new MatTableDataSource<MedicineItemList>();
  dsHandOverNoteList = new MatTableDataSource<DocNote>();
  autocompleteModeNurNote: string = "NurNote";
  HandOverNoteList: any = [];
  vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
  vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
  vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
  VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
  VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
  vpatHandId: any;
  vHandOverType = 'Morning';
  vcomments: any
  showDropdown = true;
  tempdesc: any = '';
  nursingId: any;
  @ViewChild('docNote', { static: false }) grid: AirmidTableComponent;
  @ViewChild('Handover', { static: false }) grid1: AirmidTableComponent;
  @ViewChild('MedicationItem', { static: false }) grid2: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allColumnsOfDocNote = [
    { heading: "Date", key: "tDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Time", key: "tTime", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Note", key: "nursingNotes", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "CreatedBy", key: "isAddedBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.onEdit(data);
          }
        },
        {
          action: gridActions.print, callback: (data: any) => {
          }
        }]
    }
  ]

  allFiltersOfDocNote = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: "Nursing/NursingNoteList",
    columnsList: this.allColumnsOfDocNote,
    sortField: "DocNoteId", //AdmId
    sortOrder: 0,
    filters: this.allFiltersOfDocNote
  }

  initializeGridConfig() {
    this.gridConfig = {
      apiUrl: "Nursing/NursingNoteList",
      columnsList: this.allColumnsOfDocNote,
      sortField: "DocNoteId", //AdmId
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  allMedicationColumns = [
    { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  allMedicationFilters = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals } //1
  ]

  gridConfig1: gridModel = {
    apiUrl: "Nursing/MedicationChartlist",
    columnsList: this.allMedicationColumns,
    sortField: "AdmissionID",
    sortOrder: 0,
    filters: this.allMedicationFilters
  }

  getMedicationList() {
    this.gridConfig1 = {
      apiUrl: "Nursing/MedicationChartlist",
      columnsList: this.allMedicationColumns,
      sortField: "AdmissionID",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals }
        // { fieldName: "AdmId", fieldValue: '1', opType: OperatorComparer.Equals }
      ]
    }
    console.log(this.gridConfig1)
    this.grid2.gridConfig = this.gridConfig1;
    this.grid2.bindGridData();
  }

  allColumnOfHandOver = [
    { heading: "Date", key: "vDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Time", key: "mTime", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Shift", key: "shiftInfo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "I", key: "patHandI", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "S", key: "patHandS", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "B", key: "patHandB", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "A", key: "patHandA", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "R", key: "patHandR", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "CreatedBy", key: "createdBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnHandOverEdit(data);
          }
        },
        {
          action: gridActions.print, callback: (data: any) => {
          }
        }]
    }
  ]

  allFilterOfHandOver = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals } //12
  ]

  gridConfig3: gridModel = {
    apiUrl: "Nursing/NursingPatientHandoverList",
    columnsList: this.allColumnOfHandOver,
    sortField: "PatHandId",
    sortOrder: 0,
    filters: this.allFilterOfHandOver
  }

  getHandOverNotelist() {
    this.gridConfig3 = {
      apiUrl: "Nursing/NursingPatientHandoverList",
      columnsList: this.allColumnOfHandOver,
      sortField: "PatHandId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals } //91024
      ]
    }
    console.log(this.gridConfig3)
    this.grid1.gridConfig = this.gridConfig3;
    this.grid1.bindGridData();
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.myform = this._NursingStationService.createtemplateForm();
    this.myNursingForm = this._NursingStationService.createnursingForm();
    this.myHandOverForm = this._NursingStationService.createHandOverForm();
  }

  onTemplate(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewTemplateComponent,
      {
        maxHeight: '90vh',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
        this.grid.bindGridData();
        this.showDropdown = false;
        setTimeout(() => this.showDropdown = true, 100);
    });
  }

  getSchedular(row: any = null) {
    const dialogRef = this._matDialog.open(MedicineSchedulerComponent,
      {
        maxHeight: '90vh',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getSchedulerlist();
      this.grid2.bindGridData();
    });
  }

  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDocName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.vDOA = obj.admissionDate
      this.OP_IP_Id = obj.admissionID;
      this.initializeGridConfig();
      this.getSchedulerlist();
      this.getMedicationList();
      this.getHandOverNotelist();
    }
    // this.getNoteTablelist(obj);
  }

  onEdit(row) {
    console.log("data:", row)
    this.registerObj = row;
    this.vDescription = this.registerObj.nursingNotes || '';
    this.myNursingForm.get('nursingNotes').setValue(this.vDescription);
    this.vDoctNoteId = this.registerObj.docNoteId
    this.IsAddFlag = true
  }

  onClearPatientInfo() {
    this.vRegNo = '';
    this.vPatientName = '';
    this.vWardName = '';
    this.vBedName = '';
    this.vGender = '';
    this.vIPDNo = '';
    this.vDepartment = '';
    this.vDoctorName = '';
    this.vAgeyear = '';
    this.vAgeMonth = '';
    this.vAgeDay = '';
     this.vAge = '';
    this.vGenderName = '';
    this.vRefDocName = '';
    this.vPatientType = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vDOA='';
    this.myform.get('RegID').setValue('')
  }

  onChangetemplate(event) {
    console.log("Template:", event)
    this.tempdesc = event.templateDesc
    this.nursingId = event.nursingId
    this.IsAddFlag = false
  }

  Chargelist: any[] = [];

  getSchedulerlist() {
    // debugger
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "MedChartId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(this.OP_IP_Id), //1
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(param)
    this._NursingStationService.getSchedulerlist(param).subscribe(data => {
      this.dsItemList.data = data.data as MedicineItemList[];
      this.Chargelist = data.data as MedicineItemList[];
         })
  }

deleteTableRow(event, element) {
  const index = this.Chargelist.indexOf(element);
  if (index >= 0) {
    this.Chargelist.splice(index, 1);
    this.dsItemList.data = [...this.Chargelist];
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
}

  onAdd() {
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.tempdesc == '') {
      this.toastr.warning('Please select Template', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vDescription = this.tempdesc || '';
    this.myform.get('TemplateId').setValue('');
  }

  // Doctor Note insert
  onSubmit() {
    if (!this.vDescription || this.vDescription.trim() === '') {
      this.toastr.warning('Please enter template description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.myNursingForm.invalid) {
      this.myNursingForm.get('admId').setValue(this.OP_IP_Id);
      this.myNursingForm.get('tdate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
      this.myNursingForm.get('ttime').setValue(this.datePipe.transform(new Date(), 'shortTime'));
      this.myNursingForm.get('isAddedBy').setValue(this.accountService.currentUserValue.userId)
      this.myNursingForm.get('docNoteId').setValue(this.vDoctNoteId ?? 0);
      console.log(this.myNursingForm.value)

      this._NursingStationService.NursingNoteInsert(this.myNursingForm.value).subscribe(response => {
        // this.OP_IP_Id=0
        // this.initializeGridConfig()
        this.grid.bindGridData();
        this.onClear();
      });
    } else {
      let invalidFields = [];

      if (this.myNursingForm.invalid) {
        for (const controlName in this.myNursingForm.controls) {
          if (this.myNursingForm.controls[controlName].invalid) {
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

  onClear() {
    this.vDoctNoteId = null;
    this.IsAddFlag = true
    this.vDescription = null;
    // this.onClearPatientInfo()
  }
  // patient hand over
  onSubmitHandOver() {
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.myHandOverForm.invalid) {
      this.myHandOverForm.get('admId').setValue(this.OP_IP_Id)
      this.myHandOverForm.get('tdate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      this.myHandOverForm.get('ttime').setValue(this.datePipe.transform(new Date(), 'shortTime'))
      this.myHandOverForm.get('patHandId').setValue(this.vpatHandId ?? 0)
      console.log(this.myHandOverForm.value)

      this._NursingStationService.HandOverInsert(this.myHandOverForm.value).subscribe(response => {
        this.getHandOverNotelist()
        this.onClear();
      });
    }else {
      let invalidFields = [];

      if (this.myHandOverForm.invalid) {
        for (const controlName in this.myHandOverForm.controls) {
          if (this.myHandOverForm.controls[controlName].invalid) {
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

    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this.myHandOverForm.get('shiftInfo').setValue('Morning')
    this.myHandOverForm.get('comments').setValue('')
    this.dsHandOverNoteList.data = [];
  }

  OnHandOverEdit(row) {
    console.log(row)
    this.vpatHandId = row.patHandId
    this.vHandOverType = row.shiftInfo
    this.vStaffNursName = row.patHandI
    this.vSYMPTOMS = row.patHandB
    this.vInstruction = row.patHandR
    this.VStable = row.patHandS
    this.VAssessment = row.patHandA
    this.vcomments = row.comments
  }

  SelectedChecked(contact, event) {
    if (event.checked) {
      this.toastr.success('The selected dose/item has been successfully administered to the patient.', 'successfully !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  onClose() {
    this.IsAddFlag = true
    this._matDialog.closeAll();
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this.myHandOverForm.get('shiftInfo').setValue('Morning')
    this.myHandOverForm.get('comments').setValue('')
    this.dsHandOverNoteList.data = [];
  }
}

export class DocNote {

  AdmID: number;
  TDate: Date;
  TTime: Date;
  DoctorsNotes: any;
  IsAddedBy: any;
  DoctNoteId: any;

  constructor(DocNote) {

    this.AdmID = DocNote.AdmID || 0;
    this.TDate = DocNote.TDate || '';
    this.TTime = DocNote.TTime || '';
    this.DoctorsNotes = DocNote.DoctorsNotes || '';
    this.IsAddedBy = DocNote.IsAddedBy || 0;
    this.DoctNoteId = DocNote.DoctNoteId || 0;
  }
}

export class MedicineItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  DoseName: any;
  Route: number;
  Frequency: any;
  NurseName: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  DoseDateTime: any;

  /**
  * Constructor
  *
  * @param MedicineItemList
  */
  constructor(MedicineItemList) {
    {
      this.ItemId = MedicineItemList.ItemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.ItemName = MedicineItemList.ItemName || "";
      this.Frequency = MedicineItemList.Frequency || '';
      this.DoseName = MedicineItemList.DoseName || '';
      this.Route = MedicineItemList.Route || 0;
      this.NurseName = MedicineItemList.NurseName || 0;

    }
  }
}




