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

    autocompleteModegroupName:string = "Note";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "Nursing/PrescriptionWardList",
        columnsList: [
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Note", key: "note", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "addedby", sort: true, align: 'left', emptySign: 'NA' },
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

    gridConfig3: gridModel = {
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
            { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals }
        ]
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

    onEdit(row: any = null) {
        let that = this;
        // const dialogRef = this._matDialog.open(NewTemplateComponent,
        //     {
        //         maxWidth: "90vw",
        //         height: '90%',
        //         width: '90%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        // });
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
    getValidationMessages(){
        return{
            StoreId: [],
            WardName: [],
            ItemId: [],
            Qty: [],
            Remark: [],
            comments:[],
        }
    }

//   displayedColumns: string[] = [
//     'VDate',
//     // 'Time',
//     'Note',
//     'AddedBy',
//     'Action'
//   ]

//   displayedColumns1: string[] = [
//     'ItemName',
//     'BatchNo',
//     'Qty',
//     'Action'
//   ]

displayedItemColumn: string[] = [
    'Status',
    'DrugName',
    'DoseName',
    'Route',
    'Frequency',
    'NurseName',
    'Action'
  ]

//   displayedHandOverNote: string[] = [
//     'VDate',
//     // 'Time',
//     'Shift',
//     'I',
//     'S',
//     'B',
//     'A',
//     'R',
//     'Comments',
//     'CreatedBy',
//   ]
 
  currentDate = new Date();
  isLoading: any;
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  PathologyDoctorList: any = [];
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  noOptionFound:any;
  filteredOptions:any; 
  vCompanyName:any;
  vRegNo:any;
  vDescription:any;
  vGender:any;
  vAdmissionDate:any;
  vAdmissionID:any;
  vIPDNo:any;
  vAgeyear:any;
  vAgeMonth:any;
  vAgeDay:any;
  vWardName:any;
  vBedName:any;
  vPatientType:any;
  vRefDocName:any;
  vTariffName:any;
  vDoctorName:any;
  vPatientName:any;
  vDepartment:any;
  vAdmissionTime:any;
  vAge:any;
  vGenderName:any;
  vRoomName:any;
  vDOA:any;
  OP_IP_Id:any;

  NoteList:any=[]; 
   selectedAdvanceObj: AdmissionPersonlModel;
  dsNursingNoteList = new MatTableDataSource<DocNote>();
  dsMadicationChartList=new MatTableDataSource<DocNote>();
  dsItemList=new MatTableDataSource<MedicineItemList>();
  dsHandOverNoteList=new MatTableDataSource<DocNote>();
 
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
  )
  { 
    if (this.advanceDataStored.storage) { 
    this.selectedAdvanceObj = this.advanceDataStored.storage;
    // this.PatientHeaderObj = this.advanceDataStored.storage;
    console.log( this.selectedAdvanceObj)
  } 
 }

  //doctorone filter
  public pathodoctorFilterCtrl: FormControl = new FormControl();
  public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  ngOnInit(): void { 
    this.vRegNo = this.selectedAdvanceObj.RegNo;
    this.vPatientName = this.selectedAdvanceObj.PatientName;
    this.vDepartment = this.selectedAdvanceObj.DoctorName;
    this.vDoctorName = this.selectedAdvanceObj.DepartmentName;
    this.vAgeyear = this.selectedAdvanceObj.AgeYear;
    this.vAgeMonth = this.selectedAdvanceObj.AgeMonth;
    this.vAgeDay = this.selectedAdvanceObj.AgeDay;
    this.vBedName = this.selectedAdvanceObj.BedName;
    this.vWardName = this.selectedAdvanceObj.RoomName;

    this.getNoteList(); 
    this.getDoctorList(); 
  }

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
    }
   this.getNoteTablelist(obj);
  }

 getNoteList(){
  this._NursingStationService.getNoteList().subscribe(data =>{
    this.NoteList = data;
  })
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

 onAdd(){
  if(this._NursingStationService.myform.get('Note').value){
    this.vDescription = this._NursingStationService.myform.get('Note').value.NursTempName || '';
  }else{
    this.toastr.warning('Please select Note', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  this._NursingStationService.myform.get('Note').setValue('') 
 }

 getNoteTablelist(el){
  var vdata={
    'AdmId': el.AdmissionID
  }
  this._NursingStationService.getNursingNotelist(vdata).subscribe(data =>{
    this.dsNursingNoteList.data = data as DocNote[];
    console.log(this.dsNursingNoteList.data);
    this.dsNursingNoteList.sort = this.sort;
    this.dsNursingNoteList.paginator =this.paginator;
  });
 }

 Chargelist: any = [];

 getSchedulerlist() {
  var vdata = {
    'AdmissionId': this.vAdmissionID
  }
  // this._NursingStationService.getSchedulerlist(vdata).subscribe(data => {
  //   this.dsItemList.data = data as MedicineItemList[];
  //   this.Chargelist = data as MedicineItemList[];
  //   this.dsItemList.sort = this.sort
  //   this.dsItemList.paginator = this.paginator
  // })
}

  getDoctorList() {
   
    this._NursingStationService.getDoctorCombo().subscribe(data => {
      this.PathologyDoctorList = data;
     this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
    // //  if(this.data){
    // //   const ddValue = this.PathologyDoctorList.find(c => c.DoctorID == this.advanceData.DoctorId);
    // //  this.otherForm.get('DoctorId').setValue(ddValue); 
    
    //  }
    }); 
  } 
  onSubmit() {
    ;
    let pathologyTemplateDeleteObj = {};
  //  pathologyTemplateDeleteObj['pathReportId'] = this.selectedAdvanceObj.PathReportID;

    this.isLoading = 'submit';
       
    let nursingTemplateInsert = {};
        
    nursingTemplateInsert['nursTempName'] = this._NursingStationService.myform.get("TemplateDesc").value || '',
    nursingTemplateInsert['IsDeleted']= 0,
    nursingTemplateInsert['TemplateDesc']= this._NursingStationService.myform.get("TemplateDesc").value || '',
    nursingTemplateInsert['AddedBy'] = this.accountService.currentUserValue.userId
   
   
    // this.dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
           
            "nursingTemplateInsert": nursingTemplateInsert
          };
        console.log(submitData);
      
          this._NursingStationService.DoctorNoteInsert(submitData).subscribe(response => {
            
            if (response) {
              Swal.fire('Congratulations !', 'Nurse Note Template data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                //  this._matDialog.closeAll();
                 ;
                //  this.getPrint();
                }
              });
            } else {
              Swal.fire('Error !', 'Nurse Note Template data not saved', 'error');
            }
            this.isLoading = '';
          });
        
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
  onClear() {
    this._NursingStationService.myform.reset();
  } 
  onClose() {
    this._NursingStationService.myform.reset();
    this._matDialog.closeAll();
    this.onClearPatientInfo();
  } 
}
 
export class DocNote {

  AdmID : number;
  TDate : Date;
  TTime : Date;
  DoctorsNotes : any;
  IsAddedBy : any;
  DoctNoteId  : any;
 
  constructor(DocNote) {
 
    this.AdmID = DocNote.AdmID || 0;
    this.TDate = DocNote.TDate || '';
    this.TTime = DocNote.TTime || '';
    this.DoctorsNotes = DocNote.DoctorsNotes || '';
    this.IsAddedBy = DocNote.IsAddedBy || 0;
   this.DoctNoteId =DocNote.DoctNoteId  || 0;
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




