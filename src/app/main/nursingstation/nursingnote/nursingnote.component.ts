import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NursingnoteService } from './nursingnote.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NewTemplateComponent } from './new-template/new-template.component';

@Component({
  selector: 'app-nursingnote',
  templateUrl: './nursingnote.component.html',
  styleUrls: ['./nursingnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NursingnoteComponent implements OnInit {

  vTemplateDesc: any;
  vTemplateName: any;
  isActive: boolean = true;
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
  isLoading: any;
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  PathologyDoctorList: any = [];
  isRegIdSelected: boolean = false;
  PatientListfilteredOptions: any;
  noOptionFound: any;
  filteredOptions: any;
  vCompanyName: any;
  vRegNo: any;
  vDescription: any;
  vGender: any;
  vAdmissionDate: any;
  vAdmissionID: any;
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
  vAdmissionTime: any;
  vAge: any;
  vGenderName: any;
  vRoomName: any;
  vDOA: any;
  OP_IP_Id: any;
  myform: FormGroup;
  IsAddFlag: boolean = false;
  registerObj: any;
  vDoctNoteId: any;

  NoteList: any = [];
  selectedAdvanceObj: AdmissionPersonlModel;
  dsNursingNoteList = new MatTableDataSource<DocNote>();
  dsMadicationChartList = new MatTableDataSource<DocNote>();
  dsItemList = new MatTableDataSource<MedicineItemList>();
  dsHandOverNoteList = new MatTableDataSource<DocNote>();

  autocompleteModeNurNote: string = "NurNote";

  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('docNote', { static: false }) grid: AirmidTableComponent;
  @ViewChild('Handover', { static: false }) grid1: AirmidTableComponent;

   allColumnsOfDocNote = [
      { heading: "Date", key: "tdate", sort: true, align: 'left', emptySign: 'NA',type:6},
      { heading: "Time", key: "ttime", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "Note", key: "doctorsNotes", sort: true, align: 'left', emptySign: 'NA', width:250 },
      { heading: "CreatedBy", key: "createdby", sort: true, align: 'left', emptySign: 'NA' },
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
    sortField: "AdmId",
    sortOrder: 0,
    filters: this.allFiltersOfDocNote
  }

  initializeGridConfig() {
    this.gridConfig = {
      apiUrl: "Nursing/NursingNoteList",
      columnsList: this.allColumnsOfDocNote,
      sortField: "AdmId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals }
      ]
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  gridConfig1: gridModel = {
    apiUrl: "Nursing/PrescriptionWardList",
    columnsList: [
      { heading: "ItemName", key: "itemname", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "BatchNo", key: "batchno", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
      {
        heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
          {
            action: gridActions.edit, callback: (data: any) => {
              this.onEdit(data);
            }
          },
          {
            action: gridActions.delete, callback: (data: any) => {
              this._NursingStationService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                this.toastr.success(response.message);
                this.grid.bindGridData();
              });
            }
          }]
      } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "ReqId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals }
    ]
  }

  gridConfig2: gridModel = {
    apiUrl: "Nursing/PrescriptionWardList",
    columnsList: [
      { heading: "()", key: "logo", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DrugName", key: "drugname", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DoseName", key: "dosename", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Route", key: "route", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Frequency", key: "frequency", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "NurseName", key: "nursename", sort: true, align: 'left', emptySign: 'NA' },
      {
        heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
          {
            action: gridActions.edit, callback: (data: any) => {
              this.onEdit(data);
            }
          },
          {
            action: gridActions.delete, callback: (data: any) => {
              this._NursingStationService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                this.toastr.success(response.message);
                this.grid.bindGridData();
              });
            }
          }]
      } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "ReqId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals }
    ]
  }

  allColumnOfHandOver=[
    { heading: "Date", key: "vDate", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Time", key: "mTime", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Shift", key: "shiftInfo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "I", key: "patHand_I", sort: true, align: 'left', emptySign: 'NA', width:200 },
    { heading: "S", key: "s", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "B", key: "b", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "A", key: "a", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "R", key: "r", sort: true, align: 'left', emptySign: 'NA' },
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
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilterOfHandOver=[
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals } //12
  ]

  gridConfig3: gridModel = {
    apiUrl: "Nursing",
    columnsList: this.allColumnOfHandOver,
    sortField: "AdmId",
    sortOrder: 0,
    filters: this.allFilterOfHandOver
  }

  getHandOverNotelist() {
    debugger
        this.gridConfig3 = {
          apiUrl: "Nursing",
          columnsList: this.allColumnOfHandOver,
          sortField: "AdmId",
          sortOrder: 0,
          filters: [
            { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals } //12
          ]
        }
        console.log(this.gridConfig3)
    
        this.grid1.gridConfig = this.gridConfig3;
        this.grid1.bindGridData();
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
      if (result) {
        that.grid.bindGridData();
      }
    });
  }

  getRefundofBillOPDListByReg(RegId) {

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "BillNo",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(RegId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }

    console.log(m_data);

    this._NursingStationService.getRefundofBillOPDList(m_data).subscribe(Visit => {
      console.log(Visit);
      //   this.dataSource3.data = Visit.data
      //   console.log(this.dataSource3.data);
      //   this.vOPIPId = this.dataSource3.data
    });


  }

  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  data: any;
  getValidationMessages() {
    return {
      StoreId: [],
      WardName: [],
      ItemId: [],
      Qty: [],
      Remark: [],
      comments: [],
    }
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.PatientHeaderObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }

  private _onDestroy = new Subject<void>();
  ngOnInit(): void {
    this.myform = this._NursingStationService.createtemplateForm();

    this.vRegNo = this.selectedAdvanceObj.RegNo;
    this.vPatientName = this.selectedAdvanceObj.PatientName;
    this.vDepartment = this.selectedAdvanceObj.DoctorName;
    this.vDoctorName = this.selectedAdvanceObj.DepartmentName;
    this.vAgeyear = this.selectedAdvanceObj.AgeYear;
    this.vAgeMonth = this.selectedAdvanceObj.AgeMonth;
    this.vAgeDay = this.selectedAdvanceObj.AgeDay;
    this.vBedName = this.selectedAdvanceObj.BedName;
    this.vWardName = this.selectedAdvanceObj.RoomName;
  }

  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDocName
      this.vRoomName = obj.roomName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.vDOA = obj.admissionDate
      this.OP_IP_Id = obj.admissionID;
      this.initializeGridConfig();

    }
    // this.getNoteTablelist(obj);
  }

  onEdit(row: any = null) {
    debugger
    console.log("data:", row)
    this.registerObj = row;
    this.vDescription = this.registerObj.doctorsNotes || '';
    this.vDoctNoteId=this.registerObj.doctNoteId
    this.IsAddFlag = true;
  }

  getNoteList() {
    // this._NursingStationService.getNoteList().subscribe(data => {
    //   this.NoteList = data;
    // })
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
    this.vAdmissionDate = '';
    this.vRefDocName = '';
    this.vPatientType = '';
    this.vTariffName = '';
    this.vCompanyName = '';
  }

  tempdesc: any = '';
  onChangetemplate(event) {
    console.log(event)
    this.tempdesc = event.text
  }

  onAdd(){
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
    debugger
    if (!this.vDescription || this.vDescription.trim() === '') {
      this.toastr.warning('Please enter template description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

  if(!this.vDoctNoteId || this.vDoctNoteId === 0){
    let submitData = {
      "docNoteId": 0,
      "admId": this.OP_IP_Id,
      "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "ttime": this.datePipe.transform(new Date(), 'shortTime'),
      "nursingNotes": this.vDescription
    }
      console.log("submitData:",submitData);
  
      this._NursingStationService.NursingNoteInsert(submitData).subscribe(response => {
        this.toastr.success(response.message);
        this.onClear();
        this.grid.bindGridData();
      }, (error) => {
        this.toastr.error(error.message);
      });
  }else{
    let updateData = {
      "docNoteId": this.vDoctNoteId,
      "admId": this.OP_IP_Id,
      "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "ttime": this.datePipe.transform(new Date(), 'shortTime'),
      "nursingNotes": this.vDescription
    }
      console.log("updateData:",updateData);
  
      this._NursingStationService.NursingNoteInsert(updateData).subscribe(response => {
        this.toastr.success(response.message);
        this.onClear();
        this.grid.bindGridData();
      }, (error) => {
        this.toastr.error(error.message);
      });
      this.IsAddFlag = false
    }
  }

  onClear() {
    // this.myform.reset();
    this.myform.get('templateDesc').setValue('')
    this.myform.get('TemplateId').setValue('')
    this.IsAddFlag = false 
  }

  HandOverNoteList: any = [];

  vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
  vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
  vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
  VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
  VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
  vdocHandId:any;
  vHandOverType = 'Morning';
  // patient hand over
  onSubmitHandOver() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.myform.get("docHandId").value) {

      let submitData = {

          "docHandId": 0,
          "admID": this.OP_IP_Id,
          "tDate": formattedDate,
          "tTime": formattedTime,
          "shiftInfo": this.myform.get('HandOverType').value,
          "patHandI": this.myform.get('staffName').value,
          "patHandS": this.myform.get('Stable').value,
          "patHandB": this.myform.get('SYMPTOMS').value,
          "patHandA": this.myform.get('Assessment').value,
          "patHandR": this.myform.get('Instruction').value,
          "isAddedBy": this.accountService.currentUserValue.userId,
        
      };
      console.log(submitData);
      this._NursingStationService.HandOverInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        this.grid1.bindGridData();
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not saved !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
    else {
      let updateData = {
        "docHandId": this.vdocHandId,
        "admID": this.OP_IP_Id,
        "tDate": formattedDate,
        "tTime": formattedTime,
        "shiftInfo": this.myform.get('HandOverType').value,
        "patHandI": this.myform.get('staffName').value,
        "patHandS": this.myform.get('Stable').value,
        "patHandB": this.myform.get('SYMPTOMS').value,
        "patHandA": this.myform.get('Assessment').value,
        "patHandR": this.myform.get('Instruction').value,
        "isAddedBy": this.accountService.currentUserValue.userId,      
    };

      console.log(updateData);
      this._NursingStationService.HandOverUpdate(updateData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.grid1.bindGridData();
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not Updated !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this.myform.get('HandOverType').setValue('Morning')
    this.dsHandOverNoteList.data = [];
  }

  OnHandOverEdit(row) {
    console.log(row)
    this.vdocHandId=row.docHandId
    this.vHandOverType=row.shiftInfo
    this.vStaffNursName=row.patHand_I
    // this.vSYMPTOMS
    // this.vInstruction
    // this.VStable
    // this.VAssessment
    // var m_data = {
    //   "HandOverType": row.ShiftInfo,
    //   "staffName": row.PatHand_I,
    //   "SYMPTOMS": row.PatHand_B,
    //   "Instruction": row.PatHand_R,
    //   "Stable": row.PatHand_S,
    //   "Assessment": row.PatHand_A,
    //   "docHandId": row.DocHandId
    // }
    // this._NursingStationService.DoctorNotepoppulateForm(m_data);
  }

  SelectedChecked(contact, event) {
    if (event.checked) {
      this.toastr.success('The selected dose/item has been successfully administered to the patient.', 'successfully !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.myform.reset();
    this._matDialog.closeAll();
    this.onClearPatientInfo();
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




