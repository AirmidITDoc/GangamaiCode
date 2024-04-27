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
  ) { }

  //doctorone filter
  public pathodoctorFilterCtrl: FormControl = new FormControl();
  public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  ngOnInit(): void { 
 
    this.pathodoctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      }); 
    this.getDoctorList(); 
  }

 
  private filterDoctor() {

    if (!this.PathologyDoctorList) {
      return;
    }
    // get the search keyword
    let search = this.pathodoctorFilterCtrl.value;
    if (!search) {
      this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredPathDoctor.next(
      this.PathologyDoctorList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );

  }

  getDoctorList() {
    debugger;
   
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




