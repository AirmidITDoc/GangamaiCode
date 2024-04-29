import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NursingnoteService } from '../nursingnote.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nursingnote',
  templateUrl: './nursingnote.component.html',
  styleUrls: ['./nursingnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NursingnoteComponent implements OnInit {
  displayedColumns: string[] = [
    'VDate',
    'Time',
    'Note',
    'Action'
  ]
 
  currentDate = new Date();
  isLoading: any;
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  PathologyDoctorList: any = [];

  dsNursingNoteList = new MatTableDataSource ;
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
 

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService, 
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder, 
    public datePipe: DatePipe,  
  ) {  }

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
    debugger;
    let pathologyTemplateDeleteObj = {};
  //  pathologyTemplateDeleteObj['pathReportId'] = this.selectedAdvanceObj.PathReportID;

    this.isLoading = 'submit';
       
    let nursingTemplateInsert = {};
        
    nursingTemplateInsert['nursTempName'] = this._NursingStationService.myform.get("TemplateDesc").value || '',
    nursingTemplateInsert['IsDeleted']= 0,
    nursingTemplateInsert['TemplateDesc']= this._NursingStationService.myform.get("TemplateDesc").value || '',
    nursingTemplateInsert['AddedBy'] = this.accountService.currentUserValue.user.id
   
   
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
                 debugger;
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




