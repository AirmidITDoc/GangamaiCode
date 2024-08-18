import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdvanceDataStored } from '../../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from './feedback.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { MatSliderChange } from '@angular/material/slider';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-opip-feedback',
  templateUrl: './opip-feedback.component.html',
  styleUrls: ['./opip-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPIPFeedbackComponent implements OnInit {
  isLoading: String = '';
  sIsLoading: string = ""; 

  isWardNameSelected : boolean=false; 
  wardListfilteredOptions: Observable<string[]>;
  vWardId:any;
  WardList:any=[];
  PatientList:any=[];

  vDepartmentName:any;
  vpatientName:any;
  vDoctorname:any;
  vAgeYear:any;
  vAgeDay:any;
  vAgeMonth:any;
  vRegNo:any;
  dateTimeObj: any;
  isRegIdSelected:boolean=false;
  dsPatientlist = new MatTableDataSource<PatientList>();
  selectedAdvanceObj: AdmissionPersonlModel;
  screenFromString = 'IP-billing';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator; 
  displayedColumns: string[] = [
    'patientId',
    'PatientName' 
  ]  


  constructor( public _FeedbackService:FeedbackService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private dialogRef: MatDialogRef<OPIPFeedbackComponent>,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    this.getwardList();
    this.getPatientListwardWise(); 
    if (this.advanceDataStored.storage) {
      
       this.selectedAdvanceObj = this.advanceDataStored.storage;
          console.log( this.selectedAdvanceObj)
         
     }
  }


  getwardList(){
    this._FeedbackService.getWardList().subscribe((data) =>{
      this.WardList = data;
      console.log(this.WardList)
      this.wardListfilteredOptions = this._FeedbackService.MyForm.get('WardName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWardname(value) : this.WardList.slice()),
      ); 
    });
  }
  private _filterWardname(value: any): string[] {
    if (value) {
      const filterValue = value && value.WardName ? value.WardName.toLowerCase() : value.toLowerCase();
      return this.WardList.filter(option => option.WardName.toLowerCase().includes(filterValue));
    }
  } 
  getOptionTextWardName(option) {
    if (!option) return '';
    return option.WardName ;
  }
  getSelectedObjward(obj) {
    this.vWardId = obj.WardId  
    this.getPatientListwardWise();
  } 
  getwardWisePatList(){
    this._FeedbackService.MyForm.get('WardName').setValue('');
      this.vWardId = '';
      this.getPatientListwardWise(); 
  }
  getPatientListwardWise(){
   this.sIsLoading = ''
    var vdata={
      'WardId':  this.vWardId || 0,
      'DoctorId': 0
    }
    console.log(vdata)
    this._FeedbackService.getPatientList(vdata).subscribe((data) =>{
      this.dsPatientlist.data = data as PatientList[];
      this.dsPatientlist.sort = this.sort;  
      this.dsPatientlist.paginator = this.wardpaginator; 
      console.log(this.dsPatientlist.data); 
    },
  error =>{
    this.sIsLoading = ''; 
  }); 
  }

  onSave(){}

  onClose() {
    this.dialogRef.close();
  }
  getPrint(){}
registerObj:any;
  getpatientDet(obj){ 
    debugger
    console.log(obj) 
    this.registerObj = obj;
    this.selectedAdvanceObj = obj;
    this.vpatientName = obj.PatientName;
    this.vDoctorname = obj.DoctorName;
    this.vAgeYear = obj.AgeYear;
    this.vDepartmentName = obj.DepartmentName
    this.vAgeMonth = obj.AgeMonth;
    this.vAgeDay =obj.AgeDay;
    this.vRegNo = obj.RegNo;
  }

  selectedPainLevel: number; 
  onSliderChange(event: MatSliderChange) {
    this.selectedPainLevel = event.value;
    console.log(this.selectedPainLevel)
  }
  getEmoji(painLevel: number): string {
  // Map pain levels to corresponding emojis
  const emojiMap = {
    0: '&#x1F600;', // Neutral face
    1: '&#x1F600;', // Slightly frowning face
    2: '&#x1F60A;',
    3: '&#x1F60A;',
    4: '&#x1F641;',
    5: '&#x1F641;',
    6: '&#x1F612;',
    7: '&#x1F612;',
    8: '&#x1F620;',
    9: '&#x1F620;',
    10:'&#x1F629;' // Loudly crying face
  };

  return emojiMap[painLevel];
}


getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
}

}


export class PatientList {
  DoctorName: any;
  AgeYear: any;
  PatientName: string; 
  DepartmentName: string; 
  RegNo:any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0; 
    }
  }
}