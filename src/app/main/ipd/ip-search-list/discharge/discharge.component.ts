import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPSearchListService } from '../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {

  isLoading: string = '';
  DischargeTypeList: any = [];
  currentDate = new Date();
  screenFromString = 'discharge';
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId: any;
  Today: Date = new Date();
  registerObj: any;
  isDoctorSelected: boolean = false;
  isDistypeSelected: boolean = false;
  isModeSelected: boolean = false;
  // filteredOptionsDoctorname: Observable<string[]>;
  filteredOptionsDoctorname:any;
  filteredOptionsModename: Observable<string[]>;
  filteredOptionsDisctype: Observable<string[]>;
  DoctorNameList: any = [];
  ModeNameList: any = [];
  dateTimeObj: any; 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DischargeComponent>,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.getDoctorNameList();
    this.getDischargetypeCombo();
    this.getModeNameList();

    if (this.advanceDataStored.storage) {
     // debugger
       this.selectedAdvanceObj = this.advanceDataStored.storage;
       this.registerObj =  this.advanceDataStored.storage;
       console.log(this.registerObj);
 
        }
  }

  ngOnInit(): void {
    if (this.advanceDataStored.storage) { 
      // this.setdropdownvalue();
      this.getRtrvDischargelist()
    }

    this.filteredOptionsDisctype = this._IpSearchListService.mySaveForm.get('DischargeTypeId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDischargeType(value)),
    ); 
    this.filteredOptionsDoctorname = this._IpSearchListService.mySaveForm.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoctorname(value)),
    ); 
    this.filteredOptionsModename = this._IpSearchListService.mySaveForm.get('ModeId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterModeName(value)),
    );
    
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

 
  RtrvDischargeList:any=[];
  vComments:any;
getRtrvDischargelist(){
  let Query = "select DischargeId,DischargeTypeId,DischargedDocId,ModeOfDischargeid from Discharge where AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
  console.log(Query)
  this._IpSearchListService.getDischargeId(Query).subscribe(data => {
    this.RtrvDischargeList = data ;
    this.DischargeId = this.RtrvDischargeList[0].DischargeId || 0
   // this.vComments = this.RtrvDischargeList.
    this.Rtevdropdownvalue();
    console.log(this.RtrvDischargeList); 
  });
}
Rtevdropdownvalue(){
  debugger
  if(this.RtrvDischargeList[0].DischargeTypeId){
     const toSelect = this.DischargeTypeList.find(c => c.DischargeTypeId == this.RtrvDischargeList[0].DischargeTypeId);
     console.log(toSelect)
     this._IpSearchListService.mySaveForm.get('DischargeTypeId').setValue(toSelect);
  }
  if(this.RtrvDischargeList[0].ModeOfDischargeid){
    const toSelect = this.ModeNameList.find(c => c.ModeOfDischargeId == this.RtrvDischargeList[0].ModeOfDischargeid);
    console.log(toSelect)
    this._IpSearchListService.mySaveForm.get('ModeId').setValue(toSelect);
 }
}
  getDoctorNameList() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorNameList = data;
      //console.log(this.DoctorNameList)
      
      if (this.registerObj) {
        const ddValue= this.DoctorNameList.filter(item => item.DoctorID ==  this.registerObj.DocNameID);
        //console.log(ddValue)
        this._IpSearchListService.mySaveForm.get('DoctorID').setValue(ddValue[0]);
        this._IpSearchListService.mySaveForm.updateValueAndValidity();
      }
    });
  }

  private _filterDoctorname(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.DoctorNameList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }

  getModeNameList() {
    this._IpSearchListService.getModenameListCombo().subscribe(data => {
      this.ModeNameList = data;
      console.log(this.ModeNameList)
    });
  }
  private _filterModeName(value: any): string[] {
    if (value) {
      const filterValue = value && value.ModeOfDischargeName ? value.ModeOfDischargeName.toLowerCase() : value.toLowerCase();
      return this.ModeNameList.filter(option => option.ModeOfDischargeName.toLowerCase().includes(filterValue));
    }
  }
  getDischargetypeCombo() {
    this._IpSearchListService.getDischargetypeCombo().subscribe(data => {
      this.DischargeTypeList = data;
    });
  }
  private _filterDischargeType(value: any): string[] {
    if (value) {
      const filterValue = value && value.DischargeTypeName ? value.DischargeTypeName.toLowerCase() : value.toLowerCase();
      return this.DischargeTypeList.filter(option => option.DischargeTypeName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextDisctype(option) {
    return option && option.DischargeTypeName ? option.DischargeTypeName : '';
  }
  getOptionTextMode(option) {
    return option && option.ModeOfDischargeName ? option.ModeOfDischargeName : '';
  }
  vDoctorId:any;
  vDescType:any;
  onDischarge() {
    this.isLoading = 'submit';
    if(this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined) {
      this.toastr.warning('Please select Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.DoctorNameList.find(item => item.DoctorName ==  this._IpSearchListService.mySaveForm.get('DoctorID').value.DoctorName)){
      this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.vDescType == '' || this.vDescType == null || this.vDescType == undefined) {
      this.toastr.warning('Please select Discharge Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.DischargeTypeList.find(item => item.DischargeTypeName ==  this._IpSearchListService.mySaveForm.get('DischargeTypeId').value.DischargeTypeName)){
      this.toastr.warning('Please select valid Discharge Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this._IpSearchListService.mySaveForm.get('ModeId').value){
    if(!this.ModeNameList.find(item => item.ModeOfDischargeName ==  this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeName)){
      this.toastr.warning('Please select valid Mode Of Discharge', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
    
    let ModeOfDischarge = 0
    if(this._IpSearchListService.mySaveForm.get('ModeId').value)
      ModeOfDischarge = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;
     
    if (!this.DischargeId) {
      var m_data = {
        "insertIPDDischarg": {
          "dischargeId": 0,
          "admissionId": this.selectedAdvanceObj.AdmissionID,
          "dischargeDate": this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',//this._IpSearchListService.mySaveForm.get("DischargeDate").value,// this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "dischargeTime": this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900',//this._IpSearchListService.mySaveForm.get("DischargeDate").value,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "dischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
          "dischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
          "dischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
          "modeOfDischargeId": ModeOfDischarge , 
          "createdBy": this.accountService.currentUserValue.user.id,
        }, 
        "updateAdmission": {
          "admissionID": this.selectedAdvanceObj.AdmissionID,
          "isDischarged": 1,
          "dischargeDate": this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',// this._IpSearchListService.mySaveForm.get("DischargeDate").value ,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "dischargeTime": this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900',// this._IpSearchListService.mySaveForm.get("DischargeDate").value,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
        },
        "dischargeBedRelease": {
          "bedId": this.selectedAdvanceObj.BedId,
        }
      }
      console.log(m_data);
      this._IpSearchListService.DischargeInsert(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Discharge save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) { 
              this._matDialog.closeAll();
              console.log(response)
              this.viewgetCheckoutslipPdf(response)
            }
          });
        } else {
          Swal.fire('Error !', 'Discharge  not saved', 'error');
        }
        this.isLoading = '';
      });
    }
    else {
      let ModeOfDischargeUpdate = 0
      if(this._IpSearchListService.mySaveForm.get('ModeId').value)
        ModeOfDischargeUpdate = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;
       
      var m_data1 = {
        "updateIPDDischarg": {
          "DischargeId": this.DischargeId,
          "DischargeDate":this.dateTimeObj.date , // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "DischargeTime":this.dateTimeObj.time , //  this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900',//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "DischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
          "DischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
          "DischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
          "Modeofdischarge": ModeOfDischargeUpdate,
          "updatedBy": this.accountService.currentUserValue.user.id,
        },
        "updateAdmission": {
          "admissionID": this.selectedAdvanceObj.AdmissionID || 0,
          "isDischarged": 1,
          "dischargeDate":this.dateTimeObj.date ,// this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
          "dischargeTime":this.dateTimeObj.time , // this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900',//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.datePipe.transform(this.currentDate,'MM/dd/yyyy') || '01/01/1900',,
        }
      }
      console.log(m_data1);
      this._IpSearchListService.DischargeUpdate(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Discharge Update Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              let m = response;
              this._matDialog.closeAll();
              this.viewgetCheckoutslipPdf(this.selectedAdvanceObj.AdmissionID)
            }
          });
        } else {
          Swal.fire('Error !', 'Discharge  not Update', 'error');
        }
        this.isLoading = '';
      });
    }
    this._IpSearchListService.mySaveForm.reset();
  }
  onClose() {
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }
  DischargedateTimeObj: any;
  getDischargeDateTime(DischargedateTimeObj) {
    this.DischargedateTimeObj = DischargedateTimeObj;
  }

  viewgetCheckoutslipPdf(AdmId) {

    this._IpSearchListService.getIpDischargeReceipt(
      AdmId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "CHECK OUT SLIP Viewer"
          }
        });
    });
  }
}




