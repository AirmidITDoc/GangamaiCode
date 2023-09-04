import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPSearchListService } from '../ip-search-list.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {

  submitted = false;
  year = 10;
  month = 0;
  day = 0;
  isLoading: string = '';
  msg: any = [];
  DoctorList: any = [];
  WardList: any = [];
  BedList: any = [];
  DischargeTypeList: any = [];
  currentDate = new Date();
  DischargeDoctorList: any = [];
  screenFromString = 'discharge';
  AdmittedPatientList: any;
  Doctor1List: any = [];
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId:any;
  Today: Date=new Date();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  public dischargetypeFilterCtrl: FormControl = new FormControl();
  public filteredDischargetype: ReplaySubject<any> = new ReplaySubject<any>(1);



  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();


  dataSource = new MatTableDataSource<Discharge>();
  menuActions: Array<string> = [];
  advanceAmount: any = 12345;

  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,

  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
    }
  
    this.getDischargetypeCombo();
    this.getDoctor1List();


    this.dischargetypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDischargetype();
      });

    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });
  }

  get f() { return this._IpSearchListService.mySaveForm.controls; }

 
  private filterDischargetype() {

    if (!this.DischargeTypeList) {
      return;
    }
    // get the search keyword
    let search = this.dischargetypeFilterCtrl.value;
    if (!search) {
      this.filteredDischargetype.next(this.DischargeTypeList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDischargetype.next(
      this.DischargeTypeList.filter(bank => bank.DischargeTypeName.toLowerCase().indexOf(search) > -1)
    );

  }


  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  getDoctorList() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => { this.DoctorList = data; })
  }

  getDischargeDoctorList() {
    this._IpSearchListService.getDischargedoctorNameCombo().subscribe(data => { this.DischargeDoctorList = data; })
  }

  getDischargetypeCombo() {
    //  this._IpSearchListService.getDischargetypeCombo().subscribe(data => { this.DischargeTypeList = data; })
    this._IpSearchListService.getDischargetypeCombo().subscribe(data => {
      this.DischargeTypeList = data;
      this.filteredDischargetype.next(this.DischargeTypeList.slice());
      this._IpSearchListService.mySaveForm.get('DischargeTypeId').setValue(this.DischargeTypeList[0]);
    });
  }

  getDoctor1List() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.filteredDoctorone.next(this.Doctor1List.slice());
      this._IpSearchListService.mySaveForm.get('DoctorID').setValue(this.Doctor1List[0]);
    });

  }
  onClose() {
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }

  onDischarge() {
debugger;
    this.submitted = true;
    this.isLoading = 'submit';
    if(!this.selectedAdvanceObj.IsDischarged){

    var m_data = {
      "insertIPDDischarg": {
        "DischargeId": 0,
        "AdmissionId": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value,
        "DischargeDate": this.dateTimeObj.date,//this._IpSearchListService.mySaveForm.get("DischargeDate").value,// this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.dateTimeObj.date,
        "DischargeTime": this.dateTimeObj.date,//this._IpSearchListService.mySaveForm.get("DischargeDate").value,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.dateTimeObj.date,
        "DischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
        "DischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
        "DischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
        // "Modeofdischarge":this._IpSearchListService.mySaveForm.get("Modeofdischarge").value || '',
        "UpdatedBy": this.accountService.currentUserValue.user.id,
        "AddedBy": this.accountService.currentUserValue.user.id,
      },
      "updateAdmission": {
        "AdmissionId": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value || 0,
        "IsDischarged": 1,
        "DischargeDate":this.dateTimeObj.date,// this._IpSearchListService.mySaveForm.get("DischargeDate").value ,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.dateTimeObj.date,
        "DischargeTime":this.dateTimeObj.date,// this._IpSearchListService.mySaveForm.get("DischargeDate").value,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.dateTimeObj.date,

      }
    }
    console.log(m_data);
    this._IpSearchListService.DischargeInsert(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Discharge save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Discharge  not saved', 'error');
      }
      this.isLoading = '';
    });
  }
  else{
debugger;
   
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

      this._IpSearchListService.getDischargeId(Query).subscribe(data => {
        this.DischargeId = data[0];
       
        console.log(this.DischargeId);
      });

    var m_data1 = {
      "updateIPDDischarg": {
        "DischargeId": this.DischargeId,
        "DischargeDate": this.dateTimeObj.date,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.dateTimeObj.date,
        "DischargeTime": this.dateTimeObj.date,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.dateTimeObj.date,
        "DischargeTypeId": this._IpSearchListService.mySaveForm.get("DischargeTypeId").value.DischargeTypeId || 0,
        "DischargedDocId": this._IpSearchListService.mySaveForm.get("DoctorID").value.DoctorID || 0,
        "DischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
        "Modeofdischarge":this._IpSearchListService.mySaveForm.get("Modeofdischarge").value || '',
        "updatedBy": this.accountService.currentUserValue.user.id,
      },
      "updateAdmission": {
        "AdmissionId": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value || 0,
        "IsDischarged": 1,
        "DischargeDate": this.dateTimeObj.date,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"yyyy-Mm-dd") || this.dateTimeObj.date,
        "DischargeTime": this.dateTimeObj.date,//this.datePipe.transform(this._IpSearchListService.mySaveForm.get("DischargeDate").value,"hh-mm-ss") || this.dateTimeObj.date,
      }
    }
    console.log(m_data1);
    this._IpSearchListService.DischargeUpdate(m_data1).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Discharge Update Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Discharge  not Update', 'error');
      }
      this.isLoading = '';
    });
  }
  
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  DischargedateTimeObj: any;
  getDischargeDateTime(DischargedateTimeObj) {
    // console.log('dateTimeObj==',DischargedateTimeObj);
    this.DischargedateTimeObj = DischargedateTimeObj;
  }


}




