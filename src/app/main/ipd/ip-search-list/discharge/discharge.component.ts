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
import { T } from '@angular/cdk/keycodes';
import { ConfigService } from 'app/core/services/config.service';
import { InitiateDischargeComponent } from './initiate-discharge/initiate-discharge.component';
import { InitiateProcessComponent } from './initiate-discharge/initiate-process/initiate-process.component';

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
  // screenFromString = 'discharge';
  screenFromString = 'OP-billing';
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId: any;
  Today: Date = new Date();
  registerObj: any;
  isDoctorSelected: boolean = false;
  isDistypeSelected: boolean = false;
  isModeSelected: boolean = false;
  // filteredOptionsDoctorname: Observable<string[]>;
  filteredOptionsDoctorname: any;
  filteredOptionsModename: Observable<string[]>;
  filteredOptionsDisctype: Observable<string[]>;
  DoctorNameList: any = [];
  ModeNameList: any = [];
  dateTimeObj: any;
  vAdmissionId: any; 

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
    public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getDoctorNameList();
    this.getDischargetypeCombo();
    this.getModeNameList();

    if (this.advanceDataStored.storage) {
      // debugger
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj = this.advanceDataStored.storage;
      console.log(this.registerObj);

    }
  }

  ngOnInit(): void {
    if (this.advanceDataStored.storage) {
      this.vAdmissionId = this.registerObj.AdmissionID;
      // this.setdropdownvalue();
      this.getRtrvDischargelist()
      this.getCheckBalanceAmt();
    }
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  RtrvDischargeList: any = [];
  vComments: any;
  IsCancelled: any;
  getRtrvDischargelist() {
    let Query = "select IsCancelled, DischargeId,DischargeTypeId,DischargedDocId,ModeOfDischargeid from Discharge where AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
    console.log(Query)
    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      this.RtrvDischargeList = data;
      this.IsCancelled = this.RtrvDischargeList[0].IsCancelled || 0
      if (this.IsCancelled == '1') {
        this.DischargeId = 0
      } else {
        this.DischargeId = this.RtrvDischargeList[0].DischargeId || 0
      }
      // this.vComments = this.RtrvDischargeList.
      this.Rtevdropdownvalue();
      console.log(this.RtrvDischargeList);
    });
  }
  Rtevdropdownvalue() {
    debugger
    if (this.RtrvDischargeList[0].DischargeTypeId) {
      const toSelect = this.DischargeTypeList.find(c => c.DischargeTypeId == this.RtrvDischargeList[0].DischargeTypeId);
      console.log(toSelect)
      this._IpSearchListService.mySaveForm.get('DischargeTypeId').setValue(toSelect);
    }
    if (this.RtrvDischargeList[0].ModeOfDischargeid) {
      const toSelect = this.ModeNameList.find(c => c.ModeOfDischargeId == this.RtrvDischargeList[0].ModeOfDischargeid);
      console.log(toSelect)
      this._IpSearchListService.mySaveForm.get('ModeId').setValue(toSelect);
    }
  }
  optionsDoctor: any[] = [];
  getDoctorNameList() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorNameList = data;
      this.optionsDoctor = this.DoctorNameList.slice();
      this.filteredOptionsDoctorname = this._IpSearchListService.mySaveForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctorname(value) : this.DoctorNameList.slice()),
      );

      if (this.registerObj) {
        const ddValue = this.DoctorNameList.filter(item => item.DoctorID == this.registerObj.DocNameID);
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
  optionsModeofDischarge: any[] = [];
  getModeNameList() {
    this._IpSearchListService.getModenameListCombo().subscribe(data => {
      this.ModeNameList = data;
      this.optionsModeofDischarge = this.ModeNameList.slice();
      this.filteredOptionsModename = this._IpSearchListService.mySaveForm.get('ModeId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterModeName(value) : this.ModeNameList.slice()),
      );
    });
  }
  private _filterModeName(value: any): string[] {
    if (value) {
      const filterValue = value && value.ModeOfDischargeName ? value.ModeOfDischargeName.toLowerCase() : value.toLowerCase();
      return this.ModeNameList.filter(option => option.ModeOfDischargeName.toLowerCase().includes(filterValue));
    }
  }

  optionsDischargeType: any[] = [];
  getDischargetypeCombo() {
    this._IpSearchListService.getDischargetypeCombo().subscribe(data => {
      this.DischargeTypeList = data;
      this.optionsDischargeType = this.DischargeTypeList.slice();
      this.filteredOptionsDisctype = this._IpSearchListService.mySaveForm.get('DischargeTypeId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDischargeType(value) : this.DischargeTypeList.slice()),
      );

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
  CheckBalanceAmt: any = 0;
  getCheckBalanceAmt() {
    let Query = "select Isnull(SUM(BalanceAmount),0) as BalAmt from T_SalesHeader where BalanceAmount <>0 and OP_IP_Type=1 and OP_IP_ID=" + this.vAdmissionId
    this._IpSearchListService.getCheckBalanceAmt(Query).subscribe((data) => {
      console.log(data)
      this.CheckBalanceAmt = data[0].BalAmt;
      console.log(this.CheckBalanceAmt)
    })
  }
  vDoctorId: any;
  vDescType: any;
  onDischarge() {
    this.isLoading = 'submit';

    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    if (this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined) {
      this.toastr.warning('Please select Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.DoctorNameList.find(item => item.DoctorName == this._IpSearchListService.mySaveForm.get('DoctorID').value.DoctorName)) {
      this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vDescType == '' || this.vDescType == null || this.vDescType == undefined) {
      this.toastr.warning('Please select Discharge Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.DischargeTypeList.find(item => item.DischargeTypeName == this._IpSearchListService.mySaveForm.get('DischargeTypeId').value.DischargeTypeName)) {
      this.toastr.warning('Please select valid Discharge Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._IpSearchListService.mySaveForm.get('ModeId').value) {
      if (!this.ModeNameList.find(item => item.ModeOfDischargeName == this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeName)) {
        this.toastr.warning('Please select valid Mode Of Discharge', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    debugger
    if (this._ConfigService.configParams.chkPharmacyDue == '0') {
      console.log(this._ConfigService.configParams.chkPharmacyDue)
      if (this.CheckBalanceAmt > 0) {
        Swal.fire({
          title: '"Please clear all pharmacy dues ' + this.CheckBalanceAmt,
          text: "If the pharmacy dues cannot be discharged!",
          icon: "warning",
          confirmButtonColor: "#d33",
          confirmButtonText: "Ok"
        })
        return
      }
    }


    let ModeOfDischarge = 0
    if (this._IpSearchListService.mySaveForm.get('ModeId').value)
      ModeOfDischarge = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;

    if (!this.DischargeId) {
      var m_data = {
        "insertIPDDischarg": {
          "dischargeId": 0,
          "admissionId": this.selectedAdvanceObj.AdmissionID,
          "dischargeDate": formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900', 
          "dischargeTime": formattedTime || '01/01/1900', //this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900', 
          "dischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
          "dischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
          "dischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
          "modeOfDischargeId": ModeOfDischarge,
          "createdBy": this.accountService.currentUserValue.user.id,
        },
        "updateAdmission": {
          "admissionID": this.selectedAdvanceObj.AdmissionID,
          "isDischarged": 1,
          "dischargeDate": formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',
          "dischargeTime": formattedTime || '01/01/1900',//this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900', 
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
      if (this._IpSearchListService.mySaveForm.get('ModeId').value)
        ModeOfDischargeUpdate = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;

      var m_data1 = {
        "updateIPDDischarg": {
          "DischargeId": this.DischargeId,
          "DischargeDate": formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') 
          "DischargeTime": formattedTime || '01/01/1900', //  this.datePipe.transform(this.currentDate, 'hh:mm:ss')  
          "DischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
          "DischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
          "DischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
          "Modeofdischarge": ModeOfDischargeUpdate,
          "updatedBy": this.accountService.currentUserValue.user.id,
        },
        "updateAdmission": {
          "admissionID": this.selectedAdvanceObj.AdmissionID || 0,
          "isDischarged": 1,
          "dischargeDate": formattedDate || '01/01/1900',// this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')  
          "dischargeTime": formattedTime || '01/01/1900', // this.datePipe.transform(this.currentDate, 'hh:mm:ss')  
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
  DischargeInitiate() {
    if(this.selectedAdvanceObj.IsInitinatedDischarge == '1'){
      this.toastr.warning('selected patient already Initiated ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const dialogRef = this._matDialog.open(InitiateProcessComponent,
      {
        maxWidth: "50vw",
        height: '72%',
        width: '100%',
        data: {
          Obj: this.selectedAdvanceObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }
}




