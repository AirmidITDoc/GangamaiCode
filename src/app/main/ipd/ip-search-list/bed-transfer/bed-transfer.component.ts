import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { IPSearchListService } from '../ip-search-list.service';
import { AdvanceDataStored } from '../../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj, Bed, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {

  submitted = false;

  isLoading: string = '';
  screenFromString = 'admission-form';
  msg: any = [];
  DoctorList: any = [];
  WardList: any = [];
  BedList: any = [];
  bedObj = new Bed({});
  BedClassList: any = [];
  ClassList: any = [];
  currentDate = new Date();

  ClassId: any;
  BedId: any;
  RoomId: any;
  vWardId: any;
  vBedId: any;
  vClassId: any;

  selectedAdvanceObj: AdmissionPersonlModel;

  Bedtransfer: FormGroup;

  isWardSelected: boolean = false;
  isBedSelected: boolean = false;
  isClassIdSelected: boolean = false;
  optionsWard: any[] = [];
  optionsRoomId: any[] = [];
  optionsBed: any[] = [];

  filteredOptionsWard: Observable<string[]>;
  filteredOptionsBed: Observable<string[]>;
  filteredClass: Observable<string[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@Input() dataArray: any;


  dataSource = new MatTableDataSource<Discharge>();
  menuActions: Array<string> = [];
  advanceAmount: any = 12345;

  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,
    private _formBuilder: FormBuilder
  ) {

    if (this.advanceDataStored.storage) {
      debugger
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
      this.getWardList();
    }

  }

  ngOnInit(): void {
    this.Bedtransfer = this.bedsaveForm();
    this.selectedAdvanceObj = this.advanceDataStored.storage;
    this.getDischargePatientList();

    
    this.getDoctorList();
  
    // this.getWardList();

    if (this.selectedAdvanceObj) {
      this.setDropdownObjs();
      this.getBedList(this.selectedAdvanceObj);
    }

    this.filteredOptionsWard = this.Bedtransfer.get('RoomId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterWard(value)),

    );


    this.filteredOptionsBed = this.Bedtransfer.get('BedId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterBed(value)),

    );
    // this.filteredClass = this.Bedtransfer.get('ClassId').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterClass(value)),

    // );
  }

  get f() { return this._IpSearchListService.mySaveForm.controls; }

  setDropdownObjs() {
    debugger
    const toSelect = this.WardList.find(c => c.RoomId == this.selectedAdvanceObj.RoomId);
    this.Bedtransfer.get('RoomId').setValue(toSelect);


    this._IpSearchListService.getBedCombo(toSelect).subscribe(data => {
      this.BedList = data;
      const ddValue = this.BedList.filter(c => c.BedId == this.selectedAdvanceObj.BedId);
      this.Bedtransfer.get('BedId').setValue(ddValue[0]);
      this.Bedtransfer.updateValueAndValidity();
      return;
    });
    this.filteredOptionsBed = this.Bedtransfer.get('BedId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterBed(value) : this.BedList.slice()),
    );
  }

  bedsaveForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      RoomId: ['', Validators.required],
      RoomName: '',
      BedId: ['', Validators.required],
      BedName: '',
      ClassId: ['', Validators.required],
      ClassName: '',
      Remark: '',
    });
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
    this._IpSearchListService.getWardCombo().subscribe(data => {
      this.WardList = data;
      if (this.selectedAdvanceObj) {
        const ddValue = this.WardList.filter(c => c.RoomId == this.selectedAdvanceObj.WardId);
        this.Bedtransfer.get('RoomId').setValue(ddValue[0]);
        this.OnChangeBedList(this.selectedAdvanceObj);
        this.Bedtransfer.updateValueAndValidity();
        return;
      }
    });
  }



  private _filterWard(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.WardList.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    }
  }

  getBedList(wardObj){
  this._IpSearchListService.getBedCombo(wardObj.RoomId).subscribe(data => {
    this.BedList = data;
  });
}


  OnChangeBedList(wardObj) {
    debugger
    this._IpSearchListService.getBedCombo(wardObj.RoomId).subscribe(data => {
      this.BedList = data;
      console.log(this.BedList)
      this.optionsBed = this.BedList.slice();
      this.filteredOptionsBed = this.Bedtransfer.get('BedId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBed(value) : this.BedList.slice()),
      );
    });
    this._IpSearchListService.getBedClassCombo(wardObj.RoomId).subscribe(data => {
      this.BedClassList = data;
      this.Bedtransfer.get('ClassId').setValue(this.BedClassList[0]);
    })


  }


  onBedChange(value) {
    this.bedObj = value;
  }
  private _filterBed(value: any): string[] {
    if (value) {
      const filterValue = value && value.BedName ? value.BedName.toLowerCase() : value.toLowerCase();
      return this.optionsBed.filter(option => option.BedName.toLowerCase().includes(filterValue));
    }

  }



  private _filterClass(value: any): string[] {
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  }



  // getTariffCombo(){
  //   this._IpSearchListService.getTariffCombo().subscribe(data => {
  //     this.TariffList = data;
  //     this.Bedtransfer.get('TariffId').setValue(this.TariffList[0]);
  //   });
  // }
  getOptionTextWard(option) {
    return option && option.RoomName ? option.RoomName : '';
  }

  getOptionTextBed(option) {
    return option && option.BedName ? option.BedName : '';
  }
  @ViewChild('bed') bed: ElementRef;
  public onEnterward(event): void {
    if (event.which === 13) {

      this.bed.nativeElement.focus();
    }

  }

  onClose() {
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }

  onEdit(row) {

    var m_data = {
      "DischargeDate": row.DischargeDate,
      "DischargeTime": row.DischargeTime,
      "DischargeTypeId": row.DischargeTypeId,
      "DischargedDocId": row.DischargedDocId,

    }
    console.log(m_data);
    this._IpSearchListService.populateForm(m_data);
  }

  onBedtransfer() {
    debugger;
    if ((this.vWardId == '' || this.vWardId == null || this.vWardId == undefined)) {
      this.toastr.warning('Please select valid Ward ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vBedId == '' || this.vBedId == null || this.vBedId == undefined)) {
      this.toastr.warning('Please select valid Bed', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vClassId == '' || this.vClassId == null || this.vClassId == undefined)) {
      this.toastr.warning('Please select Class', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.submitted = true;

    var m_data = {
      "updateBedtransferSetFix": {
        "bedId": this.Bedtransfer.get("BedId").value.BedId,
      },
      "updateBedtransferSetFree": {

        "bedId": this.selectedAdvanceObj.BedId
      },
      "updateAdmissionBedtransfer": {
        "admissionID": this.selectedAdvanceObj.AdmissionID,
        "bedId": this.Bedtransfer.get("BedId").value.BedId,
        "wardId": this.Bedtransfer.get("RoomId").value.RoomId,
        "classId": this.Bedtransfer.get("ClassId").value.ClassId
      },
      "updateBedtransfer": {
        "admissionID": this.selectedAdvanceObj.AdmissionID,
        "fromDate": this.dateTimeObj.date,
        "fromTime": this.dateTimeObj.time,
        "fromWardID": this.selectedAdvanceObj.WardId,
        "fromBedId": this.selectedAdvanceObj.BedId,
        "fromClassId": this.selectedAdvanceObj.ClassId,
        "toDate": this.dateTimeObj.date,
        "toTime": this.dateTimeObj.time,
        "toWardID": this.Bedtransfer.get("RoomId").value.RoomId,
        "toBedId": this.Bedtransfer.get("BedId").value.BedId,
        "toClassId": this.Bedtransfer.get("ClassId").value.classId || this.selectedAdvanceObj.ClassId,
        "remark": this.Bedtransfer.get("Remark").value,
        "addedBy": this.accountService.currentUserValue.user.id,
        "isCancelled": false,
        "isCancelledBy": 1
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


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
}
