import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";
import { DoctornoteService } from "./doctornote.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { FormGroup, FormControl, UntypedFormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { NewTemplateComponent } from './new-template/new-template.component';


@Component({
  selector: 'app-doctornote',
  templateUrl: './doctornote.component.html',
  styleUrls: ['./doctornote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctornoteComponent implements OnInit {
  myform: FormGroup;
  mytemplteform: FormGroup;
  myNoteform: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  isActive: boolean = true;
  autocompleteModetemplate: string = "Template";
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

  currentDate = new Date();
  screenFromString = 'opd-casepaper';

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

  selectedAdvanceObj: AdmissionPersonlModel;
  dsPatientList = new MatTableDataSource;
  dsDoctorNoteList = new MatTableDataSource<DocNote>();
  dsHandOverNoteList = new MatTableDataSource<PatientHandNote>();
  searchFormGroup: FormGroup;
  autocompleteModeTemplate: string = "DoctorNote" //Template 
  vDoctNoteId: any;
  IsAddFlag: boolean = false;
  vDoctorName: any;
  vPatientName: any;
  vDepartment: any;
  vAdmissionTime: any;
  vAge: any;
  vGenderName: any;
  vRoomName: any;
  vDOA: any;
  OP_IP_Id: any;
  vdocHandId:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _NursingStationService: DoctornoteService,
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

  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  // @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;

  @ViewChild('docNote', { static: false }) grid: AirmidTableComponent;
  @ViewChild('Handover', { static: false }) grid1: AirmidTableComponent;

  NewTemplate(row: any = null) {
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

  allColumns = [
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
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilters = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

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

  ngOnInit(): void {
    this.myform = this._NursingStationService.createtemplateForm();
    this.mytemplteform = this._NursingStationService.createtemplateForm();
    this.myNoteform=this._NursingStationService.createDoctorNoteForm();
    this.searchFormGroup = this.createSearchForm();
  }

  gridConfig: gridModel = {
    apiUrl: "Nursing/DoctorsNotesList",
    columnsList: this.allColumns,
    sortField: "AdmId",
    sortOrder: 0,
    filters: this.allFilters
  }

  gridConfig1: gridModel = {
    apiUrl: "Nursing/DoctorPatientHandoverList",
    columnsList: this.allColumnOfHandOver,
    sortField: "AdmId",
    sortOrder: 0,
    filters: this.allFilterOfHandOver
  }

  initializeGridConfig() {
    this.gridConfig = {
      apiUrl: "Nursing/DoctorsNotesList",
      columnsList: this.allColumns,
      sortField: "AdmId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals }
      ]
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  getHandOverNotelist() {
debugger
    this.gridConfig1 = {
      apiUrl: "Nursing/DoctorPatientHandoverList",
      columnsList: this.allColumnOfHandOver,
      sortField: "AdmId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Equals } //12
      ]
    }
    console.log(this.gridConfig1)

    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

  onEdit(row) {
debugger
    console.log("data:", row)
    this.registerObj = row;
    this.vDescription = this.registerObj.doctorsNotes || '';
    this.vDoctNoteId=this.registerObj.doctNoteId
    this.IsAddFlag = true;
  }

  tempdesc: any = '';
  onChangetemplate(event) {
    this.tempdesc = event.text
  }

  OnAdd() {
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

  getValidationMessages() {
    return {
      Note: [
        // { name: "required", Message: "Note Name is required" }
      ]
    };
  }

  // onSubmit() {
  //   debugger
  //   if (!this.vDescription || this.vDescription.trim() === '') {
  //     this.toastr.warning('Please enter template description', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }

  //   this.myNoteform.get('templateDesc').setValue(this.vDescription);

  //   if (!this.searchFormGroup.invalid) {

  //     console.log("DoctorNote json:", this.myNoteform.value);

  //     this._NursingStationService.DoctorNoteInsert(this.myNoteform.value).subscribe((response) => {
  //       this.toastr.success(response.message);
  //       this.onClear();
  //       this.grid.bindGridData();
  //     }, (error) => {
  //       this.toastr.error(error.message);
  //     });
  //   }
  //   else {
  //     let invalidFields = [];

  //     if (this.searchFormGroup.invalid) {
  //       for (const controlName in this.searchFormGroup.controls) {
  //         if (this.searchFormGroup.controls[controlName].invalid) {
  //           invalidFields.push(`My Form: ${controlName}`);
  //         }
  //       }
  //     }

  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
  //         );
  //       });
  //     }
      
  //   }
  // }

  onSubmit() {
debugger
    if (!this.vDescription || this.vDescription.trim() === '') {
      this.toastr.warning('Please enter template description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.vDoctNoteId || this.vDoctNoteId === 0) {  // Insert Condition
      var mdata = {
        "doctNoteId": 0,
        "admId": this.OP_IP_Id,
        "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "ttime": this.datePipe.transform(new Date(), 'shortTime'),
        "doctorsNotes": this.vDescription,
        "isAddedBy": this.accountService.currentUserValue.userId,
      };

      console.log('json mdata:', mdata);

      this._NursingStationService.DoctorNoteInsert(mdata).subscribe(response => {
        this.toastr.success(response.message);
        this.onClear();
        this.grid.bindGridData();
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
    else {  // Update Condition
      var mdata1 = {
        "doctNoteId": this.vDoctNoteId,
        "admId": this.OP_IP_Id,
        "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "ttime": this.datePipe.transform(new Date(), 'shortTime'),
        "doctorsNotes": this.vDescription,
        "isAddedBy": this.accountService.currentUserValue.userId,
      };
      console.log('json mdata:', mdata1);

      this._NursingStationService.DoctorNoteInsert(mdata1).subscribe(response => {
        this.toastr.success(response.message);
        this.onClear();
        this.grid.bindGridData();

      }, (error) => {
        this.toastr.error(error.message);
      });
      this.IsAddFlag = false
    }
  }

  HandOverNoteList: any = [];

  vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
  vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
  vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
  VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
  VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
  // vHandOverType:any;
  vHandOverType = 'Morning';

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

  createSearchForm() {
    return this.formBuilder.group({
      RegID: ['', Validators.required],
    });
  }

  RegOrPhoneflag = '';
  PatientName: any = '';
  RegId: any = 0;
  VisitFlagDisp: boolean = false;
  registerObj: any;

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
      this.getHandOverNotelist();
    }
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    // this.myform.reset();
    this.myform.get('templateDesc').setValue('')
    this.myform.get('TemplateId').setValue('')
    this.IsAddFlag = false 
  }

  onClose() {
    this.myNoteform.reset();
    this._matDialog.closeAll();
    // this.onClearPatientInfo();
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
export class PatientHandNote {

  AdmID: number;
  TDate: Date;
  TTime: Date;
  DoctorsNotes: any;
  IsAddedBy: any;
  DoctNoteId: any;
  VDate: any;
  MTime: Date;
  ShiftInfo: any;
  PatHand_I: any;
  PatHand_S: any;
  PatHand_B: any;
  PatHand_A: any;
  PatHand_R: any;

  constructor(PatientHandNote) {

    this.AdmID = PatientHandNote.AdmID || 0;
    this.TDate = PatientHandNote.TDate || '';
    this.TTime = PatientHandNote.TTime || '';
    this.DoctorsNotes = PatientHandNote.DoctorsNotes || '';
    this.IsAddedBy = PatientHandNote.IsAddedBy || 0;
    this.DoctNoteId = PatientHandNote.DoctNoteId || 0;
    this.VDate = PatientHandNote.VDate || 0;
    this.MTime = PatientHandNote.MTime || 0;
    this.ShiftInfo = PatientHandNote.ShiftInfo || 0;
    this.PatHand_I = PatientHandNote.PatHand_I || 0;
    this.PatHand_S = PatientHandNote.PatHand_S || 0;
    this.PatHand_B = PatientHandNote.PatHand_B || 0;
    this.PatHand_A = PatientHandNote.PatHand_A || 0;
    this.PatHand_R = PatientHandNote.PatHand_R || 0;
  }

}




