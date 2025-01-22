import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj, Bed, Discharge } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { NurBedTransferService } from './nur-bed-transfer.service';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { RegInsert } from 'app/main/opd/registration/registration.component';

@Component({
  selector: 'app-nursing-bedtransfer',
  templateUrl: './nursing-bedtransfer.component.html',
  styleUrls: ['./nursing-bedtransfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NursingBedtransferComponent implements OnInit {

 
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
  PatientListfilteredOptions: any;
  selectedAdvanceObj: AdvanceDetailObj;
  filteredOptions: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  WardName: any = '';
  registerObj = new RegInsert({});
  PatientName: any;
  RegNo: any;
  DoctorName: any;
  vAdmissionID: any;
  BedNo:any=0;
  noOptionFound: boolean = false;
  isRegIdSelected: boolean = false;
  myForm: FormGroup;
  BedId:any=0;
  
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
  advanceAmount: any = 0;
  isRegSearchDisabled: boolean;

  constructor(private _FormBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public _BedtransferService:NurBedTransferService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    // public dialogRef: MatDialogRef<IPSearchListComponent>,
    
    ) { }

  ngOnInit(): void {
    this.myForm = this.createMyForm();
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
    
  }


  createMyForm() {
    return this._FormBuilder.group({
      RegId: '',
      PatientName: '',
      WardName: '',
      StoreId: '',
      RegID: [''],
      Op_ip_id: ['1'],
      AdmissionID: 0

    })
  }
  

  // get f() { return this._BedtransferService.mySaveForm.controls; }

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
    // ;
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
      this._BedtransferService.getDischargePatientList().subscribe(data => {
      this.dataSource.data = data as Discharge[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getDoctorList() {
    this._BedtransferService.getDoctorMaster1Combo().subscribe(data => { this.DoctorList = data; })
  }

 
 getWardList() {
    this._BedtransferService.getWardCombo().subscribe(data => { this.WardList = data; 
      this.filteredWard.next(this.WardList.slice());
    })
  }

  onClose() {
    this._BedtransferService.bsaveForm.reset();
    // this.dialogRef.close();
  }

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' '+ option.MiddleName + ' ' + option.LastName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj) {
    
    if(obj.IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged');
      this.PatientName = ''  
      this.vAdmissionID =  ''
      this.RegNo = ''
      this.Doctorname =  ''
      this.Tarrifname = ''
      this.CompanyName =''
      this.vOPDNo = ''
      this.WardName =''
      this.BedNo = ''
      this.BedId = 0
    }
    else{
      
      this.registerObj = obj;
      // this.PatientName = obj.FirstName + '' + obj.LastName;
      this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
      this.RegNo = obj.RegNo;
      this.vAdmissionID = obj.AdmissionID;
      this.CompanyName = obj.CompanyName;
      this.Tarrifname = obj.TariffName;
      this.Doctorname = obj.DoctorName;
      // this.vOpIpId = obj.AdmissionID;
      this.vOPDNo = obj.IPDNo;
      this.WardName = obj.RoomName;
      this.BedNo = obj.BedName;
      this.BedId = obj.BedId || 0;
      console.log(obj);
    } 
  } 

  getSearchList() {
    
    var m_data = {
      "Keyword": `${this._BedtransferService.bsaveForm.get('RegID').value}%`
    }
    // if (this._BedtransferService.bsaveForm.get('RegID').value.length >= 1) {
      this._BedtransferService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    // } 
  }
  onEdit(row){
     
    var m_data = {
    "DischargeDate":row.DischargeDate,
    "DischargeTime":row.DischargeTime,
    "DischargeTypeId":row.DischargeTypeId,
    "DischargedDocId":row.DischargedDocId,
    
    }
    console.log(m_data);
    // this._BedtransferService.populateForm(m_data);
  } 

  onBedtransfer()
  {
    ;
    this.submitted = true;
  
    var m_data = {
      "updateBedtransferSetFix": {
        "bedId":this._BedtransferService.bsaveForm.get("BedId").value.BedId || 0,
      },
      "updateBedtransferSetFree": {
        
        "bedId": this.BedId
      },
       "updateAdmissionBedtransfer": {
        "admissionID": this.vAdmissionID,//this._BedtransferService.bsaveForm.get("AdmissionID").value,
        "bedId": this._BedtransferService.bsaveForm.get("BedId").value.BedId || 0,
        "wardId": this._BedtransferService.bsaveForm.get("RoomId").value.RoomId,
        "classId":this._BedtransferService.bsaveForm.get("ClassId").value.ClassId
      },
      "updateBedtransfer": {
        "admissionID": this.vAdmissionID,//this._BedtransferService.bsaveForm.get("AdmissionID").value,
        "fromDate":this.dateTimeObj.date,
        "fromTime":this.dateTimeObj.date,
        "fromWardID": this._BedtransferService.bsaveForm.get("WardId").value,
        "fromBedId": this._BedtransferService.bsaveForm.get("BedId").value || 0,
        "fromClassId":this._BedtransferService.bsaveForm.get("ClassId").value,
        "toDate":this.dateTimeObj.date,
        "toTime":this.dateTimeObj.date,
        "toWardID":this._BedtransferService.bsaveForm.get("RoomId").value.RoomId,
        "toBedId": this._BedtransferService.bsaveForm.get("BedId").value.BedId || 0,
        "toClassId":this._BedtransferService.bsaveForm.get("ClassId").value.classId || this.selectedAdvanceObj.ClassId,
        "remark": this._BedtransferService.bsaveForm.get("Remark").value,
        "addedBy":this.accountService.currentUserValue.userId,
        "isCancelled": false,
        "isCancelledBy":1 
      }
      
    }
   console.log(m_data);
    this._BedtransferService.BedtransferUpdate(m_data).subscribe(response => {
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
    this._BedtransferService.getBedCombo(wardObj.RoomId).subscribe(data => { this.BedList = data; })
    this._BedtransferService.getBedClassCombo(wardObj.RoomId).subscribe(data => {
      this.BedClassList = data;
      this._BedtransferService.bsaveForm.get('ClassId').setValue(this.BedClassList[0]);
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
