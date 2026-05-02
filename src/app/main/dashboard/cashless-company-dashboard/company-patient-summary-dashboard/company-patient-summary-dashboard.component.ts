import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { CashlessDashboardService } from '../cashless-dashboard.service';
import { DatePipe } from '@angular/common';
import { gridModel, gridRequest, gridResponseType, OperatorComparer } from 'app/core/models/gridRequest';
import { DATE_TYPES, gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ConfigService } from 'app/core/services/config.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';

@Component({
  selector: 'app-company-patient-summary-dashboard',
  templateUrl: './company-patient-summary-dashboard.component.html',
  styleUrls: ['./company-patient-summary-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
        ...fuseAnimations,
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class CompanyPatientSummaryDashboardComponent implements OnInit {
     displayedColumns1: string[] = [ 
          'billDate',
          'pBillNo', 
          'discAmount',
          'netBillAmount', 
          'billAmount',
          'paidAmt',
          'balAmount' ,
          'action'
      ];
           parentColumns: string[] = [ 
          //  'type',
          'PBillNo',
          'VisitDate', 
           'UHID',
          'PatientName',
         'CompanyName',
          'BillDate',
          'billAmount',
          'DiscAmount',  
           'NetBillAmount',
            'pharSalesAmt', 
           'billPharNetAmount', 
          'GovtCompanyName',
          'GovtApprovedAmt',
          'GovtRefNo',
          'SecondCompanyName',
          'CompanyApprovedAmt',
          'CompanyRefNo',
          'PaidAmount',
          'BalAmount',
          'Action' 
//           {
//     "billDate": "2026-04-20T00:00:00",
//     "patientName": "Mr. opd  flow test",
//     "regNo": "5290",
//     "visitCompanyName": "LIASON INSURANCE",
//     "visitDate": "2026-04-20T00:00:00",
//     "billAmount": 5700,
//     "discAmount": 2000,
//     "netBillAmount": 3700,
//     "pharSalesAmt": 251,
//     "billPharNetAmount": 3951,
//     "paidAmtPaidByPaidGov": 3951,
//     "balAmount_ful": 0,
//     "sys_BalanceAmt": 3951,
//     "paidByPatient": 0,
//     "firstCompanyName": "LIASON INSURANCE",
//     "govtApprovedAmt": 3951,
//     "govtRefNo": "AAAAAAAAA",
//     "companyApprovedAmt": 0,
//     "compRefNo": "",
//     "billCount": "2",
//     "pBillNo": "12667, 12668",
//     "opipid": 28543
// }
 
      ]; 
    columnsToDisplayWithExpand = [...this.parentColumns];
    expandedElement: any | null = null;
    parentResultsLength = 0;
    dateType = DATE_TYPES;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('childPaginator') paginator: MatPaginator;
    @ViewChild('parentPaginator') parentPaginator: MatPaginator;

    dataSource = new MatTableDataSource<any>();
    dataSource1 = new MatTableDataSource<any>();
    dataSourceParent = new MatTableDataSource<any>();

    @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  @ViewChild('grid1Ref') grid1: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  //fromDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");
  //toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  vfromDate = this.data.fromDate;
  vtoDate = this.data.toDate;

  // ===== Start Table Count Wise summary  =================
  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "CompanyName", key: "visitCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Bill Amount", key: "billAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Disc Amount", key: "discAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Bill Amount", key: "netBillAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "pharSalesAmt", key: "pharSalesAmt", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "billPharNetAmount", key: "billPharNetAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "paidAmtPaidByPaidGov", key: "paidAmtPaidByPaidGov", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "paidByPatient", key: "paidByPatient", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "balAmount_ful", key: "balAmount_ful", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "sys_BalanceAmt", key: "sys_BalanceAmt", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },

    { heading: "Govt Company Name", key: "firstCompanyName", sort: true, align: "center", emptySign: 'NA' , width: 250 },
    { heading: "Govt Approved Amt", key: "govtApprovedAmt", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount, width: 150 },
    { heading: "Govt Ref No", key: "govtRefNo", sort: true, align: "center", emptySign: 'NA' },
    { heading: "Second CompanyName", key: "secondCompanyName", sort: true, align: "center", emptySign: 'NA' , width: 200 },
    { heading: "Company Approved Amt", key: "companyApprovedAmt", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "RefNo", key: "compRefNo", sort: true, align: "center", emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  allfilters = [
    { fieldName: "FromDate", fieldValue: this.vfromDate ?? '', opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.vtoDate ?? '', opType: OperatorComparer.Equals },
    { fieldName: "CompanyId", fieldValue: this.data.row.companyId?.toString() ?? 0, opType: OperatorComparer.Equals },
  ]
  gridConfig: gridModel = {
    apiUrl: "CashLess/CashlessPatientWiseSummaryList",
    columnsList: this.allcolumns,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.allfilters,
    //row: 25
  }

  // ========================= end table Count Wise summary  =================

  constructor(
    public dialogRef: MatDialogRef<CompanyPatientSummaryDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null,
    public _CashlessDashboardService: CashlessDashboardService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _ConfigService: ConfigService,
     public _matDialog: MatDialog,
     public _AppointmentlistService: AppointmentlistService,
  ) {
    console.log("Dialog Data:", data);
    // dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data) {
      console.log("OnInit Data:", this.data);
      console.log("FromDate:", this.data.fromDate);
      console.log("ToDate:", this.data.toDate);
      this.getfilterdata(this.data)
    }

  }
  
      toggleRow(element: any) {
          if (this.expandedElement === element) {
              this.expandedElement = null;
          } else {
              this.expandedElement = element 
              this.getBilldetails(element)
          }
      }
     getBilldetails(row) {
         this.dataSource1.data = [];   
         const m_data = {
             "first": 0,
             "rows": 999,
             "sortField": "PBillNo",
             "sortOrder": 0,
             "filters": [{"fieldName": "OPIPId",  "fieldValue":String(row?.opipid || 0), "opType": "Contains"}],
             "Columns": [],
             "exportType": "JSON"
         }  
         console.log(m_data);
         this._CashlessDashboardService.getBillDetInfo(m_data).subscribe(Visit => {
             this.dataSource1.data = Visit.data as [];
             console.log("billdetails:", this.dataSource1.data)
             this.dataSource1.sort = this.sort;
             this.dataSource1.paginator = this.paginator; 
         });
     }
  onClose() {
    this.dialogRef.close({ result: "cancel" });
  }

      getfilterdata(Obj) { 
          this.gridConfig = {
              apiUrl: "CashLess/CashlessPatientWiseSummaryList",
              columnsList: this.allcolumns,
              sortField: "PresReId",
              sortOrder: 0,
              filters:  [
               { fieldName: "FromDate", fieldValue: Obj?.fromDate ?? '', opType: OperatorComparer.Equals },
               { fieldName: "ToDate", fieldValue: Obj?.toDate ?? '', opType: OperatorComparer.Equals },
               { fieldName: "CompanyId", fieldValue: this.data.row.companyId?.toString() ?? 0, opType: OperatorComparer.Equals },
            ]
          }
          if (this.grid1) {
              this.grid1.gridConfig = this.gridConfig;
              this.grid1.bindGridData();
          }
          this.bindParentGridData();
      }

    bindParentGridData() {
        const gridDataRequest: gridRequest = {
            sortField: this.gridConfig.sortField,
            sortOrder: this.gridConfig.sortOrder,
            filters: this.gridConfig.filters,
            columns: this.gridConfig.columnsList.map(x => ({ Name: x.heading, Data: x.key })),
            first: (this.parentPaginator?.pageIndex ?? 0),
            rows: (this.parentPaginator?.pageSize ?? 25),
            exportType: gridResponseType.JSON
        }; 
        this._CashlessDashboardService.getcompanypatientbillinfo(gridDataRequest).subscribe((data: any) => {
            debugger
            this.dataSourceParent.data = data.data as [];
            this.parentResultsLength = data["recordsFiltered"];
        });
    }

  OnPrint(element) { 
            this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt"); 
    }

    //Op Patient statement
        OnPrintStatement(element) {
            setTimeout(() => {
                const param = {
                    "searchFields": [
                        { "fieldName": "OPIPId", "fieldValue": String(element.opipid), "opType": "13" },
                        { "fieldName": "OPIPType", "fieldValue": String(0), "opType": "13" }
                    ],
                    "mode": "PatientBillStatement"
                }
                this._AppointmentlistService.getReportView(param).subscribe(res => {
                    const matDialog = this._matDialog.open(PdfviewerComponent,
                        {
                            maxWidth: "85vw",
                            height: '750px',
                            width: '100%',
                            data: {
                                base64: res["base64"] as string,
                                title: "Patient Statement" + " " + "Viewer"
                            }
                        });
                    matDialog.afterClosed().subscribe(result => {
                    });
                });
            }, 100);
        }
}
