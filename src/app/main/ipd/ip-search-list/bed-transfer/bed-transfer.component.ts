import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { IPSearchListService } from '../ip-search-list.service';
import { AdvanceDataStored } from '../../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj, Bed, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {

  submitted = false;
  year = 10;
  month=0;
  day=0;
  isLoading: string = '';
  screenFromString = 'admission-form';
  msg: any = [];
  DoctorList: any = [];
  WardList: any = [];
  BedList: any = [];
  bedObj = new Bed({});
  BedClassList: any = [];
  ClassList :any =[];
  currentDate = new Date(); 
  //Date=[(new Date()).toISOString()];
  selectedAdvanceObj: AdvanceDetailObj;

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@Input() dataArray: any;

  //ward filter
public wardFilterCtrl: FormControl = new FormControl();
public filteredWard: ReplaySubject<any> = new ReplaySubject<any>(1);

  ///Bed filter
public bedFilterCtrl: FormControl = new FormControl();
public filteredBed: ReplaySubject<any> = new ReplaySubject<any>(1);
   //room filter
   public classFilterCtrl: FormControl = new FormControl();
   public filteredClass: ReplaySubject<any> = new ReplaySubject<any>(1);
 
   private _onDestroy = new Subject<void>();
   
  dataSource = new MatTableDataSource<Discharge>();
  menuActions: Array<string> = [];
  advanceAmount: any = 12345;

  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    // public notification:NotificationServiceService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,
    
    ) { }

  ngOnInit(): void {

    this.selectedAdvanceObj = this.advanceDataStored.storage;
    this.getDischargePatientList();

    // this.getBedList();
    this.getDoctorList();
    this.getWardList();
    // this.getClassList();

    this.wardFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterWard();
    });

 
    this.bedFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBed();
    });

    this.classFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterClass();
    });
    
    
    if (this.advanceDataStored.storage) {
      debugger
       this.selectedAdvanceObj = this.advanceDataStored.storage;
       // this.PatientHeaderObj = this.advanceDataStored.storage;
       console.log( this.selectedAdvanceObj)
     }
  }

  get f() { return this._IpSearchListService.mySaveForm.controls; }

   // ward filter code  
   private filterWard() {

    if (!this.WardList) {
      return;
    }
    // get the search keyword
    let search = this.wardFilterCtrl.value;
    if (!search) {
      this.filteredWard.next(this.WardList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredWard.next(
      this.WardList.filter(bank => bank.RoomName.toLowerCase().indexOf(search) > -1)
    );

  }

  // bed filter code  
  private filterBed() {

    if (!this.BedList) {
      return;
    }
    // get the search keyword
    let search = this.bedFilterCtrl.value;
    if (!search) {
      this.filteredBed.next(this.BedList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredBed.next(
      this.BedList.filter(bank => bank.BedName.toLowerCase().indexOf(search) > -1)
    );

  }
  
  private filterClass() {
    // debugger;
    if (!this.ClassList) {
      return;
    }
    // get the search keyword
    let search = this.classFilterCtrl.value;
    if (!search) {
      this.filteredClass.next(this.ClassList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredClass.next(
      this.ClassList.filter(bank => bank.ClassName.toLowerCase().indexOf(search) > -1)
    );
  }

  getDischargePatientList() {
      this._IpSearchListService.getDischargePatientList().subscribe(data => {
      this.dataSource.data = data as Discharge[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getDoctorList() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => { this.DoctorList = data; })
  }

 
 getWardList() {
    this._IpSearchListService.getWardCombo().subscribe(data => { this.WardList = data; 
      this.filteredWard.next(this.WardList.slice());
    })
  }

  onClose() {
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }

  onEdit(row){
     
    var m_data = {
    "DischargeDate":row.DischargeDate,
    "DischargeTime":row.DischargeTime,
    "DischargeTypeId":row.DischargeTypeId,
    "DischargedDocId":row.DischargedDocId,
    
    }
    console.log(m_data);
    this._IpSearchListService.populateForm(m_data);
  } 

  onBedtransfer()
  {
    debugger;
    this.submitted = true;
  
    var m_data = {
      "updateBedtransferSetFix": {
        "bedId":this._IpSearchListService.bsaveForm.get("BedId").value.BedId ,
      },
      "updateBedtransferSetFree": {
        
        "bedId":  this.selectedAdvanceObj.BedId
      },
       "updateAdmissionBedtransfer": {
        "admissionID": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value,
        "bedId":this._IpSearchListService.bsaveForm.get("BedId").value.BedId,
        "wardId":this._IpSearchListService.bsaveForm.get("RoomId").value.RoomId,
        "classId":this._IpSearchListService.bsaveForm.get("ClassId").value.ClassId
      },
      "updateBedtransfer": {
        "admissionID":this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value,
        "fromDate":this.dateTimeObj.date,
        "fromTime":this.dateTimeObj.date,
        "fromWardID": this._IpSearchListService.myShowAdvanceForm.get("WardId").value,
        "fromBedId": this._IpSearchListService.myShowAdvanceForm.get("BedId").value,
        "fromClassId":this._IpSearchListService.myShowAdvanceForm.get("ClassId").value,
        "toDate":this.dateTimeObj.date,
        "toTime":this.dateTimeObj.date,
        "toWardID":this._IpSearchListService.bsaveForm.get("RoomId").value.RoomId,
        "toBedId": this._IpSearchListService.bsaveForm.get("BedId").value.BedId,
        "toClassId":this._IpSearchListService.bsaveForm.get("ClassId").value.classId || this.selectedAdvanceObj.ClassId,
        "remark": this._IpSearchListService.bsaveForm.get("Remark").value,
        "addedBy":this.accountService.currentUserValue.user.id,
        "isCancelled": false,
        "isCancelledBy":1 
      }
      
    }
   console.log(m_data);
    this._IpSearchListService.BedtransferUpdate(m_data).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'Bed Transfer save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Bed Transfer  not saved', 'error');
      }
      this.isLoading = '';
    });

  }
    
  OnChangeBedList(wardObj) {
    console.log(wardObj);
    this._IpSearchListService.getBedCombo(wardObj.RoomId).subscribe(data => { this.BedList = data; })
    this._IpSearchListService.getBedClassCombo(wardObj.RoomId).subscribe(data => {
      this.BedClassList = data;
      this._IpSearchListService.bsaveForm.get('ClassId').setValue(this.BedClassList[0]);
    })
  }

  onBedChange(value) {
    this.bedObj = value;
  } 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==',dateTimeObj);
    this.dateTimeObj=dateTimeObj;
  }
}
