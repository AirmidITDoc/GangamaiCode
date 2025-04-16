import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorShareService } from '../doctor-share.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { BillListForDocShrList } from '../doctor-share.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { AnyNaptrRecord } from 'dns';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-add-doctor-share',
  templateUrl: './add-doctor-share.component.html',
  styleUrls: ['./add-doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddDoctorShareComponent implements OnInit {

  autocompleteModeItem: string = "ConDoctor";
  autocompletedepartment: string = "Department";
  autocompleteModeService: string = "Service";
  autocompleteClass: string = "Class";

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  gridConfig: gridModel = {
    apiUrl: "CurrencyMaster/List",
    columnsList: [
      { heading: "-", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DoctorName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "ServiceName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Share%", key: "address", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "ShareAmt", key: "City", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DocShareType", key: "Age", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "ClassName", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "O", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA' },
    ],
    sortField: "firstName",
    sortOrder: 0,
    filters: [
      { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      // { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
      // { fieldName: "To_Dt", fieldValue:this.toDate, opType: OperatorComparer.Equals },
    ]
  }


  classid = 0;
  selectChangeClass(obj: any) {
    console.log(obj);
    this.classid = obj.value
  }

  doctorId = 0
  selectChangeDoctor(obj: any) {
    console.log(obj);
    this.doctorId = obj.value
  }

  serviceId = 0
  selectChangeService(obj: any) {
    console.log(obj);
    this.serviceId = obj.value
  }

  groupId = 0
  selectChangeGroup(obj: any) {
    console.log(obj);
    this.groupId = obj.value
  }

  getValidationMessages() {
    return {
      registrationNo: [],
      ipNo: [],
      opNo: [],
      patientType: [],
      ServiceID:[],
      GroupWise:[],
      ClassId:[],
      DoctorID:[],
      DoctorName:[]
    };
  }

  displayedColumns: string[] = [
    'button',
    'DoctorName',
    'ServiceName',
    'Share',
    'ShareAmt',
    'DocShareType',
    'ClassName',
    'OP_IP_Type',
  ];

  DoctorListfilteredOptions: Observable<string[]>;
  DoctorNamefilteredOptions: Observable<string[]>;
  ClassListfilteredOptions: Observable<string[]>;
  doctorNameCmbList: any = [];
  sIsLoading: string = '';
  isDoctorIDSelected: boolean = false;
  isDoctorID1Selected: boolean = false;
  isServiceIDSelected: boolean = false;
  isClassIdSelected: boolean = false;
  ServiceList: any = [];
  filterdService: Observable<string[]>;
  noOptionFound: any;
  doctorNameCmbList1: any = [];
  GroupList: any = [];
  isGroupnameSelected: boolean = false;
  GroupListfilteredOptions: Observable<string[]>;
  doctorShareId: any;
  ClassList: any = [];

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: any;

  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAddDoctorList();
  }

  searchdoctorID: any = 0;
  getAddDoctorList() {
    if (this.doctorId) {
      this.searchdoctorID = this.doctorId || 0;
    } else {
      this.searchdoctorID = 0;
    }
    this.sIsLoading = 'loading-data';
    var m_data = {
      "DoctorId": this.searchdoctorID,
      "ShrTypeSerOrGrp": this._DoctorShareService.DocFormGroup.get('Type').value
    }
    console.log(m_data);
    this._DoctorShareService.getDocShrList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as BillListForDocShrList[];
      //console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  ServiceName: any;
  OnEdit(contact) {
    console.log(contact)

    this.doctorShareId = contact.DoctorShareId;
    this.ServiceName = contact.ServiceName;
    // this.getServiceListCombobox();
    if (contact.ServicePercentage > 0) {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
      this.vServicePerc = contact.ServicePercentage;
    } else {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('A');
      this.vServiceAmt = contact.ServiceAmount;
    }
    if (contact.Op_IP_Type == '0') {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
    } else {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('1');
    }
    if (contact.ShrTypeSerOrGrp == '1') {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
    } else {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('2');
    }
    if (contact.DoctorId) {
      const doctorValue = this.doctorNameCmbList.find(item => item.DoctorId === contact.DoctorId)
      console.log(doctorValue)
      this._DoctorShareService.DocFormGroup.get('DoctorID').setValue(doctorValue)
    }
    if (contact.ClassId) {
      const ClassValue = this.ClassList.find(item => item.ClassId === contact.ClassId)
      console.log(ClassValue)
      this._DoctorShareService.DocFormGroup.get('ClassId').setValue(ClassValue)
    }


  }

  vServicePerc: any;
  vServiceAmt: any;

  OnSave() {
    debugger
    if (this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '1') {

      if (!this.serviceId) {
        this.toastr.warning('Please Select Service Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '2') {
      if (!this.groupId) {
        this.toastr.warning('Please Select Group Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (!this.classid) {
      this.toastr.warning('Please Select Class Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.doctorId) {
      this.toastr.warning('Please Select Doctor Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'P') {
      if (this.vServicePerc == '' || this.vServicePerc == undefined || this.vServicePerc == '0' || this.vServicePerc == null) {
        this.toastr.warning('Please enter Doctor Share Percentage ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'A') {
      if (this.vServiceAmt == '' || this.vServiceAmt == undefined || this.vServiceAmt == '0' || this.vServiceAmt == null) {
        this.toastr.warning('Please enter Doctor Share Amount ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    const docShareType = this._DoctorShareService.DocFormGroup.get('DocShareType').value;
    const docShrTypeS = docShareType === 'P' ? 'P' : 'A';
    if (!this.doctorShareId) {
      let submitData = {
        "doctorShareId": 0,
        "doctorId": this.doctorId || 0,
        "serviceId": this.serviceId || 0,
        "docShrType": 0, //this._DoctorShareService.DocFormGroup.get('DocShareType').value || 0,
        "docShrTypeS": docShrTypeS,
        "servicePercentage": this._DoctorShareService.DocFormGroup.get('Percentage').value || 0,
        "serviceAmount": this._DoctorShareService.DocFormGroup.get('Amount').value || 0,
        "classId": this.classid || 0,
        "shrTypeSerOrGrp": this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value || 0,
        "opIpType": this._DoctorShareService.DocFormGroup.get('PatientType').value || 0
      }
      console.log(submitData)
      this._DoctorShareService.InsertDocShare(submitData).subscribe((response) => {
        if (response) {
          this.toastr.success('Doctor Share Saved Successfully', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getAddDoctorList()
          this.Reset();
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else {
      let updatedate = {
        "doctorShareId": this.doctorShareId,
        "doctorId": this.doctorId || 0,
        "serviceId": this.serviceId || 0,
        "docShrType": this._DoctorShareService.DocFormGroup.get('DocShareType').value || 0,
        "docShrTypeS": docShrTypeS,
        "servicePercentage": this._DoctorShareService.DocFormGroup.get('Percentage').value || 0,
        "serviceAmount": this._DoctorShareService.DocFormGroup.get('Amount').value || 0,
        "classId": this.classid || 0,
        "shrTypeSerOrGrp": this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value || 0,
        "opIpType": this._DoctorShareService.DocFormGroup.get('PatientType').value || 0
      }
      console.log(updatedate)
      this._DoctorShareService.UpdateDocShare(updatedate).subscribe((response) => {
        if (response) {
          this.toastr.success('Doctor Share Updated Successfully', 'Update !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getAddDoctorList()
          this.Reset();
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }

  }
  onClose() {
    this._matDialog.closeAll();
    this._DoctorShareService.DocFormGroup.reset();
    this.dataSource.data = [];
    this.Reset();
    this._DoctorShareService.DocFormGroup.get('Type').setValue('1');
  }
  Reset() {
    this._DoctorShareService.DocFormGroup.get('DoctorID').setValue('');
    this._DoctorShareService.DocFormGroup.get('GroupWise').setValue('');
    this._DoctorShareService.DocFormGroup.get('ServiceID').setValue('');
    this._DoctorShareService.DocFormGroup.get('Percentage').setValue('');
    this._DoctorShareService.DocFormGroup.get('Amount').setValue('');
    this._DoctorShareService.DocFormGroup.get('ClassId').setValue('');
    this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
    this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
    this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
