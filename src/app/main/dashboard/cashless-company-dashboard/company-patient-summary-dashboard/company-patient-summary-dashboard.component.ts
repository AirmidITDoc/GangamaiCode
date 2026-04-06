import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { CashlessDashboardService } from '../cashless-dashboard.service';
import { DatePipe } from '@angular/common';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-company-patient-summary-dashboard',
  templateUrl: './company-patient-summary-dashboard.component.html',
  styleUrls: ['./company-patient-summary-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyPatientSummaryDashboardComponent implements OnInit {
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
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Bal Amount", key: "balAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
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
  ) {
    console.log("Dialog Data:", data);
    // dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data) {
      console.log("OnInit Data:", this.data);
      console.log("FromDate:", this.data.fromDate);
      console.log("ToDate:", this.data.toDate);
    }

  }
  onClose() {
    this.dialogRef.close({ result: "cancel" });
  }
}
