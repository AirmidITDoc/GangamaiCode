import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from "app/core/services/authentication.service";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from "ngx-toastr";
import { DoctornoteService } from "./doctornote.service";
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
  myHandOverform: FormGroup;
  myNoteform: FormGroup;
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

  vCompanyName: any;
  vRegNo: any;
  vDescription: any;
  vGender: any;
  vAdmissionDate: any;
  vIPDNo: any;
  vAgeyear: any;
  vAgeMonth: any;
  vAgeDay: any;
  vWardName: any;
  vBedName: any;
  vPatientType: any;
  vRefDocName: any;
  vTariffName: any;
  dsHandOverNoteList = new MatTableDataSource<PatientHandNote>();
  autocompleteModeTemplate: string = "DoctorNote" //Template 
  vDoctNoteId: any = 0;
  IsAddFlag: boolean = true;
  vDoctorName: any;
  vPatientName: any;
  vDepartment: any;
  // vAdmissionTime: any;
  vAge: any;
  vGenderName: any;
  vDOA: any;
  OP_IP_Id: any;
  vdocHandId: any;
  PatientName: any = '';
  registerObj: any;
  tempdesc: any = '';
  docNoteTempId: any;
  HandOverNoteList: any = [];
  vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
  vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
  vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
  VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
  VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
  vHandOverType = 'morning';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _NursingStationService: DoctornoteService,
    private accountService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) {}

  @ViewChild('docNote', { static: false }) grid: AirmidTableComponent;
  @ViewChild('Handover', { static: false }) grid1: AirmidTableComponent;

  showDropdown = true;

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
        this.grid.bindGridData();
        this.showDropdown = false;
        setTimeout(() => this.showDropdown = true, 100);
      }
    });
  }

  allColumns = [
    { heading: "Date", key: "tdate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Time", key: "ttime", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Note", key: "doctorsNotes", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "CreatedBy", key: "createdby", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.onEdit(data);
          }
        },
        {
          action: gridActions.print, callback: (data: any) => { }
        }]
    }
  ]

  allFilters = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

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
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilterOfHandOver = [
    { fieldName: "AdmId", fieldValue: "0", opType: OperatorComparer.Equals } //12
  ]

  ngOnInit(): void {
    this.myform = this._NursingStationService.createtemplateForm();
    this.myHandOverform = this._NursingStationService.creathandOverForm();
    this.myHandOverform.markAllAsTouched()
    this.myNoteform = this._NursingStationService.createDoctorNoteForm();
    this.myNoteform.markAllAsTouched()
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
    // debugger
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
    console.log("data:", row)
    this.registerObj = row;
    this.vDescription = this.registerObj.doctorsNotes || '';
    this.myNoteform.get('doctorsNotes').setValue(this.vDescription);
    this.vDoctNoteId = this.registerObj.doctNoteId
    this.IsAddFlag = true;
  }

  onChangetemplate(event) {
    console.log("Template:", event)
    this.tempdesc = event.templateDesc
    this.docNoteTempId = event.docNoteTempId
    this.IsAddFlag = false;
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

  onSubmit() {
    if (!this.vDescription || this.vDescription.trim() === '') {
      this.toastr.warning('Please enter template description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.myNoteform.invalid) {
      this.myNoteform.get('admId').setValue(this.OP_IP_Id);
      this.myNoteform.get('tdate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
      this.myNoteform.get('ttime').setValue(this.datePipe.transform(new Date(), 'shortTime'));
      this.myNoteform.get('isAddedBy').setValue(this.accountService.currentUserValue.userId)
      this.myNoteform.get('doctNoteId').setValue(this.vDoctNoteId ?? 0);

      console.log(this.myNoteform.value)

      this._NursingStationService.DoctorNoteInsert(this.myNoteform.value).subscribe(response => {
        this.OP_IP_Id=0;
        this.initializeGridConfig()
        this.onClear();
      });
    } else {
      let invalidFields = [];

      if (this.myNoteform.invalid) {
        for (const controlName in this.myNoteform.controls) {
          if (this.myNoteform.controls[controlName].invalid) {
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

  onSubmitHandOver() {
    debugger
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.myHandOverform.invalid) {
      console.log(this.myHandOverform.value)
      let data = this.myHandOverform.value;
      data.admId = this.OP_IP_Id;
      data.tdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        data.ttime = this.datePipe.transform(new Date(), 'shortTime'),
        data.docHandId = this.vdocHandId || 0
      this._NursingStationService.HandOverInsert(data).subscribe(response => {
        this.getHandOverNotelist()
        this.onClear();
      });
    }else {
      let invalidFields = [];

      if (this.myHandOverform.invalid) {
        for (const controlName in this.myHandOverform.controls) {
          if (this.myHandOverform.controls[controlName].invalid) {
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
    this.myHandOverform.get('shiftInfo').setValue('morning')
    this.dsHandOverNoteList.data = [];
  }

  OnHandOverEdit(row) {
    console.log(row)
    this.vdocHandId = row.docHandId
    this.vHandOverType = row.shiftInfo
    this.vStaffNursName = row.patHandI
    this.vSYMPTOMS = row.patHandB
    this.vInstruction = row.patHandR
    this.VStable = row.patHandS
    this.VAssessment = row.patHandA
  }

  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      // this.vAdmissionTime = obj.admissionTime
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDocName
      this.vWardName = obj.roomName
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
    this.myNoteform.reset();
    this.myform.get('TemplateId').setValue('');
    this.IsAddFlag = true
    this.vDoctNoteId = null;
    this.vDescription = null;
    this.onClearPatientInfo()
  }

  onClose() {
    this.myNoteform.reset();
    this._matDialog.closeAll();
    // this.onClearPatientInfo();
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this.myHandOverform.get('shiftInfo').setValue('morning')
    this.dsHandOverNoteList.data = [];
    // this.HandOverNoteList = [];
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
    this.vAdmissionDate = '';
    this.vRefDocName = '';
    this.vPatientType = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vDOA='';

    this.myform.get('RegID').setValue('')
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




