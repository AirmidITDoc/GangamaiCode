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

    vTemplateDesc:any;
    vTemplateName:any;
    isActive:boolean=true;
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

   @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "Nursing/PrescriptionWardList",
        columnsList: [
            { heading: "DateTime", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Note", key: "note", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Nursing/PrescriptionWardList",
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
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
   
       onSave(row: any = null) {
           let that = this;
        //    const dialogRef = this._matDialog.open(NewTemplateComponent,
        //        {
        //            maxWidth: "90vw",
        //            height: '90%',
        //            width: '90%',
        //            data: row
        //        });
        //    dialogRef.afterClosed().subscribe(result => {
        //        if (result) {
        //            that.grid.bindGridData();
        //        }
        //    });
       }

    NewTemplate(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewTemplateComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

  displayedColumns: string[] = [
    'RegNo',
    'PatienName'
  ]
  displayedDoctorNote: string[] = [
    'Date&Time',
    // 'Time',
    'Note',
    'Action'
  ]
  displayedHandOverNote: string[] = [
    'Date&Time',
    // 'Time',
    'Shift',
    'I',
    'S',
    'B',
    'A',
    'R',
    'Action'
  ]

  currentDate = new Date();
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  isLoading: string = '';
  PathologyDoctorList: any = [];
  wardList: any = [];
  DoctorNoteList: any = [];
  NoteList: any = [];
  vCompanyName: any;
  vRegNo: any;
  vDescription: any;
  vPatienName: any;
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
  vDoctorname: any;
  vDepartmentName: any;

  selectedAdvanceObj: AdmissionPersonlModel;
  dsPatientList = new MatTableDataSource;
  dsDoctorNoteList = new MatTableDataSource<DocNote>();
  dsHandOverNoteList = new MatTableDataSource<PatientHandNote>();
  searchFormGroup: FormGroup;
  autocompletenote: string = "Note";
  vDoctNoteId: any;
  IsAddFlag: boolean = false;

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

//   editorConfig: AngularEditorConfig = {
//     editable: true,
//     spellcheck: true,
//     height: '12rem',
//     minHeight: '12rem',
//     translate: 'yes',
//     placeholder: 'Enter text here...',
//     enableToolbar: true,
//     showToolbar: true,
//   };

  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  ngOnInit(): void {
    // this.vRegNo = this.selectedAdvanceObj.RegNo;
    // this.vPatienName = this.selectedAdvanceObj.PatientName;
    // this.vDoctorname = this.selectedAdvanceObj.DoctorName;
    // this.vDepartmentName = this.selectedAdvanceObj.DepartmentName;
    // this.vAgeyear = this.selectedAdvanceObj.AgeYear;
    // this.vAgeMonth = this.selectedAdvanceObj.AgeMonth;
    // this.vAgeDay = this.selectedAdvanceObj.AgeDay;
    // this.vBedName = this.selectedAdvanceObj.BedName;
    // this.vWardName = this.selectedAdvanceObj.RoomName;
    // this.getDoctorNoteList(); 
    // this.getWardNameList();
    this.getDoctorNoteList();
    this.getHandOverNotelist();
    this.searchFormGroup = this.createSearchForm();
  }

  getDoctorNoteList() {
    debugger
    var param = {
        sortField: "DoctNoteId",
        sortOrder: 0,
        filters: [
                  { fieldName: "AdmId", fieldValue: "119", opType: OperatorComparer.Equals },
                  { fieldName: "Start", fieldValue: "", opType: OperatorComparer.Equals },
                  { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
              ],
                  row: 25
    }
    this._NursingStationService.getdoctornoteList(param).subscribe(Menu => {

        this.dsDoctorNoteList.data = Menu.data as DocNote[];
        this.dsDoctorNoteList.sort = this.sort;
        this.dsDoctorNoteList.paginator = this.paginator;
        console.log(this.dsDoctorNoteList.data)
    });
}

getHandOverNotelist() {
  debugger
  var param = {
      sortField: "DocHandId",
      sortOrder: 0,
      filters: [
                { fieldName: "AdmId", fieldValue: "3", opType: OperatorComparer.Equals },
                { fieldName: "Start", fieldValue: "", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
            ],
                row: 25
  }
  this._NursingStationService.getpatientHandList(param).subscribe(Menu => {

      this.dsDoctorNoteList.data = Menu.data as PatientHandNote[];
      this.dsDoctorNoteList.sort = this.sort;
      this.dsDoctorNoteList.paginator = this.paginator;
      console.log(this.dsDoctorNoteList.data)
  });
}


//   gridConfig: gridModel = {
//     apiUrl: "CanteenRequest/DoctorNoteList",
//     columnsList: [
//         { heading: "VDate", key: "vtDate", sort: true, align: 'left', emptySign: 'NA' },
//         { heading: "Time", key: "tTime", sort: true, align: 'left', emptySign: 'NA' },
//         { heading: "Note", key: "doctorsNotes", sort: true, align: 'left', emptySign: 'NA'},
//         {
//             heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
//                 {
//                     action: gridActions.edit, callback: (data: any) => {
//                         this.onSave(data);
//                     }
//                 }, {
//                     action: gridActions.print, callback: (data: any) => {
                        
//                     }
//                 }]
//         } //Action 1-view, 2-Edit,3-delete
//     ],
//     sortField: "DoctNoteId",
//     sortOrder: 0,
//     filters: [
//         { fieldName: "AdmId", fieldValue: "119", opType: OperatorComparer.Equals },
//         { fieldName: "Start", fieldValue: "", opType: OperatorComparer.Equals },
//         { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
//     ],
//     row: 25
// }

onEdit(row) {
  debugger
  console.log("data:", row)
  this.registerObj=row;
  var m_data = {
    "Description": this.registerObj.doctorsNotes,
    "DoctNoteId": this.registerObj.doctNoteId
  }
  // this.IsAddFlag = true;
  this._NursingStationService.DoctorNotepoppulateForm(m_data);
      
    }

//   NewTemplate() {
//     const dialogRef = this._matDialog.open(NewTemplateComponent,
//       {
//         maxWidth: "75vw",
//         height: '85%',
//         width: '100%',
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       this.getDoctorNoteList();
//     });
//   }

  OnAdd() {
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._NursingStationService.myform.get('Note').value) {
      this.vDescription = this._NursingStationService.myform.get('Note').value.DocsTempName || '';
    } else {
      this.toastr.warning('Please select Note', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
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
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    if (!this.vDoctNoteId || this.vDoctNoteId === 0) {  // Insert Condition
      var mdata = {
        "doctNoteId": 0,
        "admId": 0,
        "tdate": formattedDate,
        "ttime": formattedTime,
        "doctorsNotes": this._NursingStationService.myform.get("Description").value,
        "isAddedBy": 1, //this.accountService.currentUserValue.userId,
      };
      console.log('json mdata:', mdata);
    
      this._NursingStationService.DoctorNoteInsert(mdata).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record not saved! Please check API error.', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, (error) => {
        this.toastr.error(error.message);
      });
    } 
    else if (this.registerObj?.doctNoteId && this.registerObj.doctNoteId !== 0) {  // Update Condition
      var mdata1 = {
        "doctNoteId": this.registerObj.doctNoteId,
        "admId": 0,
        "tdate": formattedDate,
        "ttime": formattedTime,
        "doctorsNotes": this._NursingStationService.myform.get("Description").value,
        "isAddedBy": 1, //this.accountService.currentUserValue.userId,
      };
      console.log('json mdata:', mdata1);
    
      this._NursingStationService.DoctorNoteUpdate(mdata1).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Update !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Record not updated! Please check API error.', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, (error) => {
        this.toastr.error(error.message);
      });
    } 
    else {
      this.toastr.error('Invalid data! Cannot insert or update.', 'Error !');
    }
    
    // if (this.vDoctNoteId) {
    //   var mdata = {
    //     "doctNoteId": 0,
    //     "admId": 0,
    //     "tdate": formattedDate,
    //     "ttime": formattedTime,
    //     "doctorsNotes": this._NursingStationService.myform.get("Description").value,
    //     "isAddedBy": 0, //this.accountService.currentUserValue.user.id,
    //   }
    //   console.log('json mdata:', mdata);

    //   this._NursingStationService.DoctorNoteInsert(mdata).subscribe(response => {
    //     if (response) {
    //       this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //         toastClass: 'tostr-tost custom-toast-success',
    //       });
    //       this.onClose()
    //     } else {
    //       this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
    //         toastClass: 'tostr-tost custom-toast-error',
    //       });
    //     }
    //   }, (error) => {
    //     this.toastr.error(error.message);
    //   });
    // }
    // else if (this.registerObj.doctNoteId) {
    //   var mdata1 = {
    //     "doctNoteId": this.registerObj.doctNoteId,
    //     "admId": 0,
    //     "tdate": formattedDate,
    //     "ttime": formattedTime,
    //     "doctorsNotes": this._NursingStationService.myform.get("Description").value,
    //     "isAddedBy": 0, //this.accountService.currentUserValue.user.id,
    //   }
    //   console.log('json mdata:', mdata1);

    //   this._NursingStationService.DoctorNoteUpdate(mdata1).subscribe((response) => {
    //     if (response) {
    //       this.toastr.success('Record Update Successfully.', 'Update !', {
    //         toastClass: 'tostr-tost custom-toast-success',
    //       });
    //       this.onClose()
    //     } else {
    //       this.toastr.error('Record not Update !, Please check API error..', 'Error !', {
    //         toastClass: 'tostr-tost custom-toast-error',
    //       });
    //     }
    //   }, (error) => {
    //     this.toastr.error(error.message);
    //   });
    // }

    // this.isLoading = 'submit';

    // let DocNoteTemplateInsertObj = {};

    // DocNoteTemplateInsertObj['AdmID'] = 11,//this.selectedAdvanceObj.PathReportID;
    // DocNoteTemplateInsertObj['TDate']= this.dateTimeObj.date;
    // DocNoteTemplateInsertObj['TTime ']= this.dateTimeObj.time;
    // DocNoteTemplateInsertObj['DoctorsNotes']= this._NursingStationService.myform.get("DoctorsNotes").value || '',

    // DocNoteTemplateInsertObj['doctNoteId'] =1,// this.accountService.currentUserValue.userId
    // DocNoteTemplateInsertObj['IsAddedBy'] = this.accountService.currentUserValue.userId


    // // this.dialogRef.afterClosed().subscribe(result => {
    //       console.log('==============================  Advance Amount ===========');
    //       let submitData = {

    //         "doctorNoteInsert": DocNoteTemplateInsertObj
    //       };
    //     console.log(submitData);

    //       this._NursingStationService.DoctorNoteInsert(submitData).subscribe(response => {

    //         if (response) {
    //           Swal.fire('Congratulations !', 'Doctor Note Template data saved Successfully !', 'success').then((result) => {
    //             if (result.isConfirmed) {
    //             //  this._matDialog.closeAll();
    //              ;
    //             //  this.getPrint();
    //             }
    //           });
    //         } else {
    //           Swal.fire('Error !', 'Doctor Note Template data not saved', 'error');
    //         }
    //         this.isLoading = '';
    //       });

    // });
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

  getSelectedObj(obj) {
    debugger
    console.log(obj)
    this.RegOrPhoneflag = 'Entry from Registration';
    let todayDate = new Date();
    const d = new Date(obj.DateofBirth);

    this.PatientName = obj.PatientName;
    this.RegId = obj.value;
    this.VisitFlagDisp = true;
    debugger
    if ((this.RegId ?? 0) > 0) {
      debugger
      // console.log(this.data)
      setTimeout(() => {
        this._NursingStationService.getRegistraionById(this.RegId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)

        });

      }, 500);
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
    this.vPatienName = '';
    this.vWardName = '';
    this.vBedName = '';
    this.vGender = '';
    this.vIPDNo = '';
    this.vDepartmentName = '';
    this.vDoctorname = '';
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




