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
  ShrTypeSerOrGrp:any=1
  DoctorId = "0";
  classid = 0;
  doctorId = 0
  serviceId = 0
  groupId = 0

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns=[
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Share%", key: "servicePercentage", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ShareAmt", key: "serviceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DocShareType", key: "docShrTypeS", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "OP_IP_Type", key: "op_IP_Type", sort: true, align: 'left', emptySign: 'NA' },
  ]
  allFilters=[
    { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },//"10006"
    { fieldName: "ShrTypeSerOrGrp", fieldValue: "1", opType: OperatorComparer.StartsWith }
  ]
  gridConfig: gridModel = {
    apiUrl: "Doctor/DoctorShareLbyNameList",
    columnsList: this.allColumns,
    sortField: "DoctorShareId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onChange() {
    debugger
    this.ShrTypeSerOrGrp = this._DoctorShareService.DocFormGroup.get('Type').value
    this.getfilterdata();
}

  getfilterdata(){
    debugger
    this.gridConfig = {
        apiUrl: "Doctor/DoctorShareLbyNameList",
        columnsList:this.allColumns , 
        sortField: "DoctorShareId",
        sortOrder: 0,
        filters: [
          { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
          { fieldName: "ShrTypeSerOrGrp", fieldValue: this.ShrTypeSerOrGrp, opType: OperatorComparer.StartsWith }
        ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData(); 
}

  ListView(value) {
    console.log(value)
     if(value.value!==0)
        this.DoctorId=value.value
    else
    this.DoctorId="0"

    this.getfilterdata();
}

  selectChangeClass(obj: any) {
    console.log(obj);
    this.classid = obj.value
  }

  selectChangeDoctor(obj: any) {
    console.log(obj);
    this.doctorId = obj.value
  }

  selectChangeService(obj: any) {
    console.log(obj);
    this.serviceId = obj.value
  }

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
  sIsLoading: string = '';
  isDoctorIDSelected: boolean = false;
  isDoctorID1Selected: boolean = false;
  isServiceIDSelected: boolean = false;
  isClassIdSelected: boolean = false;
  ServiceList: any = [];
  filterdService: Observable<string[]>;
  noOptionFound: any;
  GroupList: any = [];
  isGroupnameSelected: boolean = false;
  GroupListfilteredOptions: Observable<string[]>;
  doctorShareId: any;

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
    debugger
    console.log(contact)

    this.doctorShareId = contact.doctorShareId;
    this.ServiceName = contact.serviceName;
    this.classid=contact.classId
    this.doctorId=contact.doctorId
    this.serviceId=contact.serviceId

    this._DoctorShareService.DocFormGroup.get('DoctorID').setValue(contact.doctorId);
    this._DoctorShareService.DocFormGroup.get('ServiceID').setValue(contact.serviceId);
    this._DoctorShareService.DocFormGroup.get('ClassId').setValue(contact.classId)


    // this.getServiceListCombobox();
    if (contact.servicePercentage > 0) {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
      this.vServicePerc = contact.servicePercentage;
    } else {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('A');
      this.vServiceAmt = contact.serviceAmount;
    }
    if (contact.op_IP_Type == '0') {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
    } else {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('1');
    }
    if (contact.shrTypeSerOrGrp == '1') {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
    } else {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('2');
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
