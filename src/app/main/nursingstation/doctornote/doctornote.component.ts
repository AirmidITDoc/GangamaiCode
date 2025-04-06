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
  myform:FormGroup;
  mytemplteform:FormGroup;
    vTemplateDesc:any;
    vTemplateName:any;
    isActive:boolean=true;
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
    autocompleteModeTemplate: string= "Template"; 
    vDoctNoteId: any;
    IsAddFlag: boolean = false;
    vDoctorName:any;
    vPatientName:any;
    vDepartment:any;
    vAdmissionTime:any;
    vAge:any;
    vGenderName:any;
    vRoomName:any;
    vDOA:any;
    OP_IP_Id:any;
  
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

   @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
   
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

    allColumns=[
      { heading: "DateTime", key: "tdate", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Note", key: "doctorsNote", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "CreatedBy", key: "createdby", sort: true, align: 'left', emptySign: 'NA' },
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
  ]

  allFilters=[
          { fieldName: "AdmId", fieldValue:"0", opType: OperatorComparer.Equals }
      ]

  ngOnInit(): void {
    this.myform=this._NursingStationService.createtemplateForm();
    this.mytemplteform = this._NursingStationService.createtemplateForm();
    this.getHandOverNotelist();
    this.searchFormGroup = this.createSearchForm();
  }

  gridConfig: gridModel = {
    apiUrl: "Nursing/DoctorNoteList",
    columnsList: this.allColumns,
    sortField: "AdmId",
    sortOrder: 0,
    filters: this.allFilters
}

  initializeGridConfig() {
    this.gridConfig = {
      apiUrl: "Nursing/DoctorNoteList",
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

  gridConfig1: gridModel = new gridModel();

getHandOverNotelist() {
  
  this.gridConfig1 = {
    apiUrl: "Nursing/PatientHandoverList",
    columnsList: [
        { heading: "DateTime", key: "date", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Shift", key: "shift", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "I", key: "i", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "S", key: "s", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "B", key: "b", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "A", key: "a", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "R", key: "r", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CreatedBy", key: "createdby", sort: true, align: 'left', emptySign: 'NA' },
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
    sortField: "AdmId",
    sortOrder: 0,
    filters: [
          { fieldName: "AdmId", fieldValue:this.OP_IP_Id, opType: OperatorComparer.Equals } //12
    ]
}
}


onEdit(row) {
  
  console.log("data:", row)
  this.registerObj=row;
  var m_data = {
    "Description": this.registerObj.doctorsNotes,
    "DoctNoteId": this.registerObj.doctNoteId
  }
  // this.IsAddFlag = true;
  this._NursingStationService.DoctorNotepoppulateForm(m_data);
      
    }
tempdesc:any='';
    onChangetemplate(event){
      this.tempdesc=event.text
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
    this._NursingStationService.myform.get('Note').setValue('');
  }

  getValidationMessages() {
    return {
      Note: [
        // { name: "required", Message: "Note Name is required" }
      ]
    };
  }

  onSubmit() {
  
    if (!this.vDoctNoteId || this.vDoctNoteId === 0) {  // Insert Condition
      var mdata = {
        "doctNoteId": 0,
        "admId": 0,
        "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "ttime": this.datePipe.transform(new Date(), 'shortTime'),
        "doctorsNotes": this._NursingStationService.myform.get("Description").value,
        "isAddedBy": this.accountService.currentUserValue.userId,
      };
      console.log('json mdata:', mdata);
    
      this._NursingStationService.DoctorNoteInsert(mdata).subscribe(response => {
        this.toastr.success(response.message);
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);
    });
    } 
    else if (this.registerObj?.doctNoteId && this.registerObj.doctNoteId !== 0) {  // Update Condition
      var mdata1 = {
        "doctNoteId": this.registerObj.doctNoteId,
        "admId": 0,
        "tdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "ttime": this.datePipe.transform(new Date(), 'shortTime'),
        "doctorsNotes": this._NursingStationService.myform.get("Description").value,
        "isAddedBy": this.accountService.currentUserValue.userId,
      };
      console.log('json mdata:', mdata1);
    
      this._NursingStationService.DoctorNoteUpdate(mdata1).subscribe(response => {
        this.toastr.success(response.message);
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);
    });
    } 
    else {
      this.toastr.error('Invalid data! Cannot insert or update.', 'Error !');
    }
   
  }

  // onEdit(row) {
  //   var m_data = {
  //     "TemplateId": row.TemplateId,
  //     "TemplateName": row.TemplateName.trim(),
  //     "TemplateDesc": row.TemplateDesc.trim(),
  //     "IsDeleted": JSON.stringify(row.IsDeleted),
  //     "UpdatedBy": row.UpdatedBy,
  //   }
  //   this._SampleService.populateForm(m_data);
  // }

  createSearchForm() {
    return this.formBuilder.group({
      RegID: [''],
    });
  }

  RegOrPhoneflag = '';
  PatientName: any = '';
  RegId: any = 0;
  VisitFlagDisp: boolean = false;
  registerObj: any;

  getSelectedObjIP(obj) {
    
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:",obj)
      this.vRegNo=obj.regNo
      this.vDoctorName=obj.doctorName
      this.vPatientName=obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment=obj.departmentName
      this.vAdmissionDate=obj.admissionDate
      this.vAdmissionTime=obj.admissionTime
      this.vIPDNo=obj.ipdNo
      this.vAge=obj.age
      this.vAgeMonth=obj.ageMonth
      this.vAgeDay=obj.ageDay
      this.vGenderName=obj.genderName
      this.vRefDocName=obj.refDocName
      this.vRoomName=obj.roomName
      this.vBedName=obj.bedName
      this.vPatientType=obj.patientType
      this.vTariffName=obj.tariffName
      this.vCompanyName=obj.companyName
      this.vDOA=obj.admissionDate
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
    this._NursingStationService.myform.reset();
  }

  onClose() {
    this._NursingStationService.myform.reset();
    this._matDialog.closeAll();
    this.onClearPatientInfo();
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




