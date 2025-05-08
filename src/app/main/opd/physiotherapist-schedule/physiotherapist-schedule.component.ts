import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { PhysiotherapistScheduleService } from './physiotherapist-schedule.service';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PhysioScheduleComponent } from './physio-schedule/physio-schedule.component';

@Component({
  selector: 'app-physiotherapist-schedule',
  templateUrl: './physiotherapist-schedule.component.html',
  styleUrls: ['./physiotherapist-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PhysiotherapistScheduleComponent implements OnInit {

  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  DoctorId = 0
  PBillNo: any = "%"

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
  @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
  @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>; 
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate2;
    this.gridConfig.columnsList.find(col => col.key === 'refundAmount1')!.template = this.actionsTemplate3;
    this.gridConfig.columnsList.find(col => col.key === 'balanceAmt1')!.template = this.actionsTemplate4;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;  
}
  allOPbillcolumns = [
    { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
    { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["refundAmount"] > 0 ? Color.RED : "" },
    { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Age", key: "patientAge", sort: true, align: 'left', emptySign: 'NA', width: 50 },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 130, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];

  gridConfig: gridModel = {

    apiUrl: "OPBill/BrowseOPDBillPagiList",
    columnsList: this.allOPbillcolumns,
    sortField: "PbillNo",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }
    ]
  }

  constructor(
    public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService
  ) { }


  ngOnInit(): void {

  }





  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this._PhysiotherapistScheduleService.SearchForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._PhysiotherapistScheduleService.SearchForm.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._PhysiotherapistScheduleService.SearchForm.get('FirstName').value + "%"
    this.l_name = this._PhysiotherapistScheduleService.SearchForm.get('LastName').value + "%"
    this.regNo = this._PhysiotherapistScheduleService.SearchForm.get('RegNo').value || "0"
    this.PBillNo = this._PhysiotherapistScheduleService.SearchForm.get('PBillNo').value || "%"
    this.getDate();
  }
  getDate() {
    this.gridConfig = {
      apiUrl: "OPBill/BrowseOPDBillPagiList",
      columnsList: this.allOPbillcolumns,
      sortField: "PbillNo",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }































  NewScheduler() {
    const dialogRef = this._matDialog.open(PhysioScheduleComponent,
      {
        maxWidth: "100%",
        width: '80%',
        height: '80%'
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      this.onChangeFirst();
    });
  }
  EditScheduler(row) {
    const dialogRef = this._matDialog.open(PhysioScheduleComponent,
      {
        maxWidth: "100%",
        width: '80%',
        height: '80%',
        data:row
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      this.onChangeFirst();
    });
  }

  getValidationMessages() {
    return {
      RegNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      FirstName: [
        // { name: "required", Message: "Item Name is required" }
      ],
      LastName: [
        // { name: "required", Message: "Batch No is required" }
      ],
      PBillNo: [
        // { name: "required", Message: "Invoice No is required" }
      ]
    };
  }
  OnPrint(element) {
    this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
}
  getWhatsappshareBill(Id) { }
}
