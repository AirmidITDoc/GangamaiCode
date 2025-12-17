import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ExpensesService } from './expenses.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';
import { NewExpensesComponent } from './new-expenses/new-expenses.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ExpensesComponent {

  myFilterform: FormGroup;
  autocompleteExpensen: string = "ExpHeadMaster"
  autocompleteExpensenCategory: string = "MExpensesCategory"
  type: any = "3";
  expId: any = "0"
  expCategoryId: any = "0"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('ColorCode') ColorCode!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'expType')!.template = this.ColorCode;
  }

  constructor(
    public _ExpensesService: ExpensesService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._ExpensesService.CreateSearchGroup();
  }

  allcolumns = [
    {
      heading: "-", key: "expType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.ColorCode, width: 30
    },
    { heading: "Expense Date", key: "expDate", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Expense Time", key: "expTime", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Expense Category", key: "expCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 60 },
    { heading: "Head Name", key: "headName", sort: true, align: 'left', emptySign: 'NA', width: 60 },
    { heading: "Person Name", key: "personName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Expense Amount", key: "expAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UTR No", key: "utrno", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Reason", key: "narration", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ExpHeadId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "ExpType", fieldValue: this.type, opType: OperatorComparer.Equals },
    { fieldName: "ExpCategoryId", fieldValue: this.expCategoryId, opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    apiUrl: "TExpense/DailyExpenceList",
    columnsList: this.allcolumns,
    sortField: "ExpID",
    sortOrder: 0,
    filters: this.allfilters
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
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    this.expId = this.myFilterform.get('ExpensenId').value
    this.type = this.myFilterform.get('expType').value
    this.expCategoryId = this.myFilterform.get('expCategoryId').value

    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "TExpense/DailyExpenceList",
      columnsList: this.allcolumns,
      sortField: "ExpID",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate || "1900-01-01", opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate || "2100-12-31", opType: OperatorComparer.StartsWith },
        { fieldName: "ExpHeadId", fieldValue: this.expId, opType: OperatorComparer.Equals },
        { fieldName: "ExpType", fieldValue: this.type, opType: OperatorComparer.Equals },
        { fieldName: "ExpCategoryId", fieldValue: String(this.expCategoryId), opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  addNewExpenses(row?: any) {
    const dialogRef = this._matDialog.open(NewExpensesComponent,
      {
        maxWidth: "95vw",
        maxHeight: '90vh',
        // height: '90%',
        width: '60%',
        data: row || null
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  OnPrint(element) {
    this.commonService.Onprint("ExpId", element.expID, "ExpenseVoucharPrint");
  }

  OnCancel(data: any) {
    Swal.fire({
      title: 'Do you want to cancel Expenses?',
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let submitData = {
          expId: data.expID,
          isCancelledBy: this._loggedService.currentUserValue.userId
        };
        console.log(submitData);
        this._ExpensesService.OnCancel(submitData).subscribe((res) => {
          this.grid.bindGridData();
        });
      }
    });
  }

}
