import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../../../ip-search-list.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { element } from 'protractor';

@Component({
  selector: 'app-initiate-process',
  templateUrl: './initiate-process.component.html',
  styleUrls: ['./initiate-process.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InitiateProcessComponent implements OnInit {
  displayedColumns: string[] = [
    'DepartmentName',
    'AddedBy',
    'AddedByDateTime',
    'action'
  ]

  registerObj: any;
  vDepartmentName: any;
  InitiateForm: FormGroup
  Chargelist: any = [];
  isLoading: string = '';
  screenFromString = 'OP-billing';
  isDepartmentSelected: boolean = false;
  filteredOptionDepartment: Observable<string[]>;
  DepartmentList: any = [];

  dsDepartmentlist = new MatTableDataSource<ApprovList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<InitiateProcessComponent>,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.InitiateForm = this.createInitiateForm()
    if (this.data) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
    this.getRtrvDepartmentlist();
    this.getDepartmentlist();
  }
  createInitiateForm() {
    return this._formbuilder.group({
      DepartmentName: ['']
    });
  }
  getRtrvDepartmentlist() {
    this._IpSearchListService.getRtrvDepartmentlist().subscribe(data => {
      this.dsDepartmentlist.data = data as ApprovList[];
      this.Chargelist= data as ApprovList[];
      console.log(this.dsDepartmentlist.data)
      this.dsDepartmentlist.sort = this.sort
      this.dsDepartmentlist.paginator = this.paginator
    });
  }
  getDepartmentlist() {
    this._IpSearchListService.getDepartmentNameCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredOptionDepartment = this.InitiateForm.get('DepartmentName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );

    });
  }
  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }
  getOptionText(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  onAddDepartment() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((this.vDepartmentName == 0 || this.vDepartmentName == null || this.vDepartmentName == undefined)) {
      this.toastr.warning('Please select DepartmentName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.InitiateForm.get('DepartmentName').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this.InitiateForm.get('DepartmentName').value.DepartmentName)) {
        this.toastr.warning('Please select valid DepartmentName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.dsDepartmentlist.data.length > 0) {
      if (this.dsDepartmentlist.data.find(item => item.DepartmentName == this.InitiateForm.get('DepartmentName').value.DepartmentName)) {
        this.toastr.warning('selected  Department Name already added', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.isLoading = 'save';
    this.dsDepartmentlist.data = [];
    this.Chargelist.push(
      {

        DepartmentID: this.InitiateForm.get('DepartmentName').value.DepartmentId,
        DepartmentName: this.InitiateForm.get('DepartmentName').value.DepartmentName || '',
        AddedBy: this.accountService.currentUserValue.user.id || 0,
        AddedByDatetime: formattedDate || 0, 

      });
    this.isLoading = '';
    this.dsDepartmentlist.data = this.Chargelist;
    this.InitiateForm.reset();
    console.log(this.dsDepartmentlist.data)

  }
  deleteTableRow(element) {
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsDepartmentlist.data = [];
      this.dsDepartmentlist.data = this.Chargelist;
    }
    Swal.fire('Success !', 'Row Deleted Successfully', 'success');
  }

  onSave() {
    if ((!this.dsDepartmentlist.data.length)) {
      this.toastr.warning('list is blank add department Name in list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let saveDischargeInitiateParam = [];
    this.dsDepartmentlist.data.forEach(element => {
      let saveDischargeInitiateParamObj = {
        "admID": this.registerObj.AdmissionID || 0,
        "departmentName": element.DepartmentName || '',
        "departmentID": element.DepartmentID || 0,
        "isApproved": 0,
        "approvedBy": 0,
        "approvedDatetime": "2024-12-19T08:01:44.541Z"
      }
      saveDischargeInitiateParam.push(saveDischargeInitiateParamObj)
    })

    let updateDischargeInitiateParam = {
      "admID":this.registerObj.AdmissionID || 0,
      "isInitinatedDischarge": 1
    }

    let submitData = {
      "saveDischargeInitiateParam": saveDischargeInitiateParam,
      "updateDischargeInitiateParam":updateDischargeInitiateParam
    }
    
    console.log(submitData)
    this._IpSearchListService.SaveDischargeInitiate(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose()
      }
      else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  onClose() {
    this._matDialog.closeAll();
  }
}
export class ApprovList {
  DepartmentName: any;
  IsApprove: any;
  ApprovedBy: any;
  IsNoDues: any;
  Comments: any;
  AddedByDate: any
  DepartmentID: any;
  AddedByDatetime: any;

  constructor(ApprovList) {
    {
      this.DepartmentName = ApprovList.DepartmentName || '';
      this.IsApprove = ApprovList.IsApprove || '';
      this.ApprovedBy = ApprovList.ApprovedBy || '';
      this.IsNoDues = ApprovList.IsNoDues || '';
      this.Comments = ApprovList.Comments || '';
      this.DepartmentID = ApprovList.DepartmentID || 0;
      this.AddedByDate = ApprovList.AddedByDate || '';
      this.AddedByDatetime = ApprovList.AddedByDatetime || '';
    }
  }
}
