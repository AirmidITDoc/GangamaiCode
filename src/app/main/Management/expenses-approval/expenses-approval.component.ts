import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ExpensesApprovalService } from './expenses-approval.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-expenses-approval',
  templateUrl: './expenses-approval.component.html',
  styleUrls: ['./expenses-approval.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ExpensesApprovalComponent {
  myFilterform: FormGroup;
  autocompleteExpensen: string = "ExpHeadMaster"
  autocompleteExpensenCategory: string = "MExpensesCategory"
  type: any = "3";
  expId: any = "0"
  appstatus: any = '0'
  expCategoryId: any = "0"
  dataSource = new MatTableDataSource<expenseList>();
  selection = new SelectionModel<expenseList>(true, []);
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  displayedColumns = [
    'CheckBox',
    'datetime',
    'expCategoryName',
    'headName',
    'personName',
    'expAmount',
    'utrno',
    'narration',
    'userName',
    'Approvedby',
    'Approveddate',
    // 'action'
  ];
  vExpApprovalFormGroup: FormGroup
  @ViewChild('statusForm') statusForm!: TemplateRef<any>;

  constructor(
    public _ExpensesService: ExpensesApprovalService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._ExpensesService.CreateSearchGroup();
    this.vExpApprovalFormGroup = this.vApprovalFormInsert();
    this.GetExpeList();
  }

  ListView1(value) {
    if (value.value !== 0)
      this.expId = value.value
    else
      this.expId = "0"
    this.onChangeFirst();
  }

  ListView2(value) {
    if (value.value !== 0)
      this.expCategoryId = value.value
    else
      this.expCategoryId = "0"
    this.onChangeFirst();
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
    this.expId = this.myFilterform.get('ExpensenId').value || "0"
    this.expCategoryId = this.myFilterform.get('expCategoryId').value || "0"
    this.type = this.myFilterform.get('expType').value
    this.appstatus = this.myFilterform.get('approvalStatus').value
    this.GetExpeList();
  }

  openStatus(row: any = null): void {
    console.log(row)
    
    if (this.selection.selected.length === 0) {
      this.toastr.warning('Please select Expense data');
      return;
    }
    
    const dialogRef = this._matDialog.open(this.statusForm, {
      width: '35%',
      height: '35%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetExpeList();
      this.OnReset();
    });
  }

  vApprovalFormInsert(): FormGroup {
    return this._formbuilder.group({
      reason: '',
      pathologyLabReport: this._formbuilder.array([])// FormArray for details
    });
  }

  createApprovalDetail(item: any = {}): FormGroup {
    return this._formbuilder.group({
      expId: [item.expID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isApproval: true,
      approvalBy: this._loggedService.currentUserValue.userId,
      approvalReason: ['', Validators.required],
      approvalDate: [this.getNow()],//new Date()],
    });
  }

  get receivedDetailsArray(): FormArray {
    return this.vExpApprovalFormGroup.get('pathologyLabReport') as FormArray;
  }

  OnSave() {
    const reasonValue = this.vExpApprovalFormGroup.get('reason')?.value;

    if (!reasonValue) {
      this.toastr.warning('Please enter reason');
      return;
    }

    debugger
    this.receivedDetailsArray.clear();
    this.selection.selected.forEach(item => {
      const group = this.createApprovalDetail(item);

      //Set same reason for all selected rows
      group.get('approvalReason')?.setValue(reasonValue);

      this.receivedDetailsArray.push(group);
    });
    const payload = this.receivedDetailsArray.value;

    console.log(payload);

    this._ExpensesService.UpdateExpApproval(payload).subscribe(() => {
      this._matDialog.closeAll();
      this.GetExpeList();
    });
  }

  getNow(): string {
    const d = new Date();
    return (
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0') + 'T' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0')
    );
  }

  SelectedList: any = [];
  isCheckboxDisabled(row: any): boolean {
    return row.isSampleReceivedStatus === true;
  }
  areAllRowsDisabled(): boolean {
    return this.dataSource?.data?.length
      ? this.dataSource.data.every(row => this.isCheckboxDisabled(row))
      : true;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data
        .filter(row => !row.isApproval) // ✅ only remaining 3
        .forEach(row => this.selection.select(row));
    }
  }
  isAllSelected() {
    const selectableRows = this.dataSource.data.filter(
      row => !row.isApproval
    );

    return this.selection.selected.length === selectableRows.length;
  }
  isSomeSelected() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  GetExpeList() {

    const fromDateControl = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd");
    const toDateControl = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd");

    const filters: any[] = [];

    // Handle date range
    if (fromDateControl && toDateControl) {
      this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
      this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
    }
    filters.push(
      {
        "fieldName": "FromDate",
        "fieldValue": this.fromDate,
        "opType": "Equals"
      },
      {
        "fieldName": "ToDate",
        "fieldValue": this.toDate,
        "opType": "Equals"
      },
      {
        "fieldName": "ExpHeadId",
        "fieldValue": String(this.expId),
        "opType": "Equals"
      },
      {
        "fieldName": "ExpType",
        "fieldValue": this.type,
        "opType": "Equals"
      },
      {
        "fieldName": "ExpCategoryId",
        "fieldValue": String(this.expCategoryId),
        "opType": "Equals"
      },
      {
        "fieldName": "IsApproval",
        "fieldValue": String(this.appstatus),
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "ExpID",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    console.log(data)
    this._ExpensesService.getExpenselist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
    });
  }

  OnReset() {
    // this.SelectedList = [];
    this.selection.clear();
    this.vExpApprovalFormGroup.get('reason').setValue('')
    this.myFilterform.reset({
      expType: "3",
      approvalStatus: "0",
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }

}

export class expenseList {
  expDate: Date;
  expTime: Date;
  expCategoryName: string;
  headName: string;
  personName: string;
  expAmount: any;
  utrno: any;
  narration: any;
  userName: any;
  isApproval: any;
  approvalReason: any;
  approvalDate: any;
  approvalUserName: any;
  approvalBy: any;

  constructor(expenseList) {
    this.expDate = expenseList.expDate || '';
    this.expTime = expenseList.expTime || '';
    this.expCategoryName = expenseList.expCategoryName || '';
    this.headName = expenseList.headName || '';
    this.personName = expenseList.personName || '';
    this.expAmount = expenseList.expAmount || 0;
    this.utrno = expenseList.utrno || 0;
    this.narration = expenseList.narration || '';
    this.userName = expenseList.userName || 0;
    this.isApproval = expenseList.isApproval || 0
  }
}
