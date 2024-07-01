import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DoctornoteService } from '../doctornote.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

@Component({
  selector: 'app-doctornote',
  templateUrl: './doctornote.component.html',
  styleUrls: ['./doctornote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctornoteComponent implements OnInit {
  displayedColumns: string[] = [
    'RegNo',
    'PatienName' 
  ]
  displayedDoctorNote: string[] = [
    'VDate',
    'Time',
    'Note',
    'Action'
  ]
  displayedHandOverNote: string[] = [
    'VDate',
    'Time',
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
  isLoading:string ='';
  PathologyDoctorList:any=[];
  wardList:any=[];
  DoctorNoteList:any=[];
  vRegNo:any;
  vDescription:any;
  selectedAdvanceObj: AdmissionPersonlModel;
  dsPatientList = new MatTableDataSource;
  dsDoctorNoteList = new MatTableDataSource;
  dsHandOverNoteList = new MatTableDataSource;
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(
    public _NursingStationService: DoctornoteService,
    private accountService: AuthenticationService, 
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder, 
    public datePipe: DatePipe, 
    public toastr: ToastrService,
  ) {  if (this.advanceDataStored.storage) {
    debugger
     this.selectedAdvanceObj = this.advanceDataStored.storage;
     // this.PatientHeaderObj = this.advanceDataStored.storage;
     console.log( this.selectedAdvanceObj)
   } }

  
 
  ngOnInit(): void { 
    this.getDoctorNoteList(); 
    this.getWardNameList();
  }

  getWardNameList(){
    this._NursingStationService.getWardNameList().subscribe(data =>{
      this.wardList = data;
    })
  }
  getDoctorNoteList() {
    this._NursingStationService.getDoctorNoteCombo().subscribe(data => {
      this.DoctorNoteList = data;
    }); 
  } 
OnAdd(){
  if(this.vRegNo =='' || this.vRegNo  == null || this.vRegNo == undefined){ 
    this.toastr.warning('Please select Patient', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if(this._NursingStationService.myform.get('Note').value){
    this.vDescription = this._NursingStationService.myform.get('Note').value.DocsTempName || '';
  }else{
    this.toastr.warning('Please select Note', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
  }
  this._NursingStationService.myform.get('Note').setValue('');
}



  onSubmit() { 
 
    this.isLoading = 'submit';
       
    let DocNoteTemplateInsertObj = {};
        
    DocNoteTemplateInsertObj['AdmID'] = 11,//this.selectedAdvanceObj.PathReportID;
    DocNoteTemplateInsertObj['TDate']= this.dateTimeObj.date;
    DocNoteTemplateInsertObj['TTime ']= this.dateTimeObj.time;
    DocNoteTemplateInsertObj['DoctorsNotes']= this._NursingStationService.myform.get("DoctorsNotes").value || '',
    
    DocNoteTemplateInsertObj['doctNoteId'] =1,// this.accountService.currentUserValue.user.id
    DocNoteTemplateInsertObj['IsAddedBy'] = this.accountService.currentUserValue.user.id
   
   
    // this.dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
           
            "doctorNoteInsert": DocNoteTemplateInsertObj
          };
        console.log(submitData);
      
          this._NursingStationService.DoctorNoteInsert(submitData).subscribe(response => {
            
            if (response) {
              Swal.fire('Congratulations !', 'Doctor Note Template data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                //  this._matDialog.closeAll();
                 debugger;
                //  this.getPrint();
                }
              });
            } else {
              Swal.fire('Error !', 'Doctor Note Template data not saved', 'error');
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

  

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
     this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    this._NursingStationService.myform.reset();
  }

  onClose() {
    this._NursingStationService.myform.reset();
    // this.dialogRef.close();
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




