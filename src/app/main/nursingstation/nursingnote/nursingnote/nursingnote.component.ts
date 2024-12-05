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
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

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
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  noOptionFound:any;
  filteredOptions:any; 
  vCompanyName:any;
  vRegNo:any;
  vDescription:any;
  vPatienName:any;
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
  vDoctorname:any;
  vDepartmentName:any;
  NoteList:any=[]; 
   selectedAdvanceObj: AdmissionPersonlModel;
  dsNursingNoteList = new MatTableDataSource<DocNote>();
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
 

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService, 
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder, 
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
    this.vPatienName = this.selectedAdvanceObj.PatientName;
    this.vDoctorname = this.selectedAdvanceObj.DoctorName;
    this.vDepartmentName = this.selectedAdvanceObj.DepartmentName;
    this.vAgeyear = this.selectedAdvanceObj.AgeYear;
    this.vAgeMonth = this.selectedAdvanceObj.AgeMonth;
    this.vAgeDay = this.selectedAdvanceObj.AgeDay;
    this.vBedName = this.selectedAdvanceObj.BedName;
    this.vWardName = this.selectedAdvanceObj.RoomName;

    this.getNoteList(); 
    this.getDoctorList(); 
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this._NursingStationService.myform.get('RegID').value}%`
    }
    if (this._NursingStationService.myform.get('RegID').value.length >= 1) {
      this._NursingStationService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
   this.vWardName = obj.RoomName;
   this.vBedName = obj.BedName;
   this.vGender = obj.GenderName;
  //  this.vAge = obj.Age
   this.vAdmissionID = obj.AdmissionID;
   this.vIPDNo = obj.IPDNo 
   this.getNoteTablelist(obj);
  }
 getNoteList(){
  this._NursingStationService.getNoteList().subscribe(data =>{
    this.NoteList = data;
  })
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

  private filterDoctor() { 
    if (!this.PathologyDoctorList) {
      return;
    } 
    let search = this.pathodoctorFilterCtrl.value;
    if (!search) {
      this.filteredPathDoctor.next(this.PathologyDoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    } 
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




