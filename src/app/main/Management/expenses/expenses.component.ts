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

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ExpensesComponent {

  myFilterform: FormGroup;
  type: any = "3";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
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
    { heading: "-", key: "expensetype", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "Expense Date/Time", key: "time", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 80 },
    { heading: "Head Name", key: "headName", sort: true, align: 'left', emptySign: 'NA', width: 60 },
    { heading: "Person Name", key: "personName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Expense Amount", key: "expenseAmt", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Expense Type", key: "type", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.StartsWith },
    // { fieldName: "Type", fieldValue: "0", opType: OperatorComparer.StartsWith },
  ]

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.allcolumns,
    sortField: "EmgId",
    sortOrder: 0,
    filters: this.allfilters
  }

   onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    this.type = this.myFilterform.get('expType').value

    this.getfilterdata();
  }

   getfilterdata() {
    this.gridConfig = {
      apiUrl: "Emergency/Emergencylist",
      columnsList: this.allcolumns,
      sortField: "EmgId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate || "1900-01-01", opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.toDate || "2100-12-31", opType: OperatorComparer.StartsWith },
        { fieldName: "type", fieldValue: this.type, opType: OperatorComparer.StartsWith },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  addNewExpenses() {
    const dialogRef = this._matDialog.open(NewExpensesComponent,
      {
        maxWidth: "95vw",
        maxHeight: '90vh',
        // height: '90%',
        width: '60%',
        // data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

}
