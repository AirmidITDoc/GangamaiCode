import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../../../ip-search-list.service';
import { ConfigService } from 'app/core/services/config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discharge-initiate-process',
  templateUrl: './discharge-initiate-process.component.html',
  styleUrls: ['./discharge-initiate-process.component.scss']
})
export class DischargeInitiateProcessComponent {

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
  autocompleteModeDepartment: string = "Department";
  constructor(
    public _IpSearchListService: IPSearchListService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DischargeInitiateProcessComponent>,
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
    // this.getRtrvDepartmentlist();
    // this.getDepartmentlist();
  }
  createInitiateForm() {
    return this._formbuilder.group({
      DepartmentName: ['']
    });
  }
  // getRtrvDepartmentlist() {
  //   this._IpSearchListService.getRtrvDepartmentlist().subscribe(data => {
  //     this.dsDepartmentlist.data = data as ApprovList[];
  //     this.Chargelist= data as ApprovList[];
  //     console.log(this.dsDepartmentlist.data)
  //     this.dsDepartmentlist.sort = this.sort
  //     this.dsDepartmentlist.paginator = this.paginator
  //   });
  // }
  depatId=0;
  deptname=''
  onChangeDepartment(event){
this.depatId=event.value
this.deptname=event.text
  }
  onAddDepartment() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

   this.dsDepartmentlist.data = [];
    this.Chargelist.push(
      {

        DepartmentID:this.depatId,// this.InitiateForm.get('DepartmentName').value.StoreId,
        DepartmentName:this.deptname,// this.InitiateForm.get('DepartmentName').value.StoreName || '',
        AddedBy: 1,//this.accountService.currentUserValue.user.id || 0,
        AddedByDatetime: formattedDate || 0, 

      });
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
      this.toastr.success(response);
      this.dialogRef.close();
      }, (error) => {
        this.toastr.error(error.message);
      });
  }
  onClose() {
    // this._matDialog.closeAll();
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
  StoreName:any;
  StoreId:any;

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
      this.StoreName = ApprovList.StoreName || 0;
      this.StoreId = ApprovList.StoreId || '';
    }
  }
}
