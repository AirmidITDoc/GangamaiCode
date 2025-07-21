import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { DoscApprovalService } from './dosc-approval.service';
import { RegInsert } from '../registration/registration.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { gridColumnTypes } from 'app/core/models/tableActions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-disc-approval',
  templateUrl: './disc-approval.component.html',
  styleUrls: ['./disc-approval.component.scss']
})
export class DiscApprovalComponent {
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  myFilterbillform: FormGroup;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  DoctorId = 0
  PBillNo: any = "%"

    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
      @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
      @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
      @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;
  
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('opBillGrid', { static: false }) grid: AirmidTableComponent;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate2;
        // this.gridConfig.columnsList.find(col => col.key === 'refundAmount1')!.template = this.actionsTemplate3;
        this.gridConfig.columnsList.find(col => col.key === 'concessionAmt')!.template = this.actionsTemplate3;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
         this.gridConfig.columnsList.find(col => col.key === 'concessionAmt1')!.template = this.actionsTemplate3;

    }


  allOBillfilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }

  ];
  allOPbillcolumns = [
    { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "concessionAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
    { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : ""},
    { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount},
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
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];


  gridConfig: gridModel = {

    apiUrl: "OPBill/BrowseOPDBillPagiList",
    columnsList: this.allOPbillcolumns,
    sortField: "PbillNo",
    sortOrder: 0,
    filters: this.allOBillfilters
  }


  constructor(public _DoscApprovalService: DoscApprovalService,
    public _matDialog: MatDialog,
    // private dialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private commonService: PrintserviceService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.myFilterbillform = this._DoscApprovalService.myFilterbillbrowseform();
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: ['']
    });
  }


  getSelectedObj(obj) {
    if ((obj.value ?? 0) > 0) {
      console.log(obj)
      // setTimeout(() => {
      //   this._RefundbillService.getRegistraionById(obj.value).subscribe((response) => {
      //     this.registerObj = response;
      //     this.RegId = this.registerObj?.regId
      //     this.RegNo = this.registerObj?.regNo
      //     this.PatientName = this.registerObj?.firstName + " " + this.registerObj?.middleName + " " + this.registerObj?.lastName
      //     this.billNo = this.registerObj.billNo;
      //     this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(this.registerObj.billNo);
      //     console.log(response)
      //   });
      // }, 500);
    }
    this.getfilterdataOpBill()
  }

  onChangeOPBill() {
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterbillform.get('FirstName').value + "%"
    this.l_name = this.myFilterbillform.get('LastName').value + "%"
    this.regNo = this.myFilterbillform.get('RegNo').value || "0"
    this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
    this.getfilterdataOpBill();
  }

  getfilterdataOpBill() {

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

  ClearfilterOPbill(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterbillform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterbillform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterbillform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterbillform.get('PBillNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterbillform.get('PBillNo').setValue("")

    this.onChangeOPBill();
  }



  // new save method date:5/6/25
  onSave() {


    // if (!this.RefundOfBillFormFooter.invalid && !this.vRefundOfBillFormGroup.invalid) { 
    //    console.log("FormValue", this.vRefundOfBillFormGroup.value)

    // Refund table detail assign to array
    // this.refundDetailsArray.clear();
    // this.dataSource2.data.forEach(item => {
    //   this.refundDetailsArray.push(this.createRefundDetail(item));
    // });

    // // addCharges table detail assign to array
    // this.addChargesArray.clear();
    // this.dataSource2.data.forEach(item => {
    //   this.addChargesArray.push(this.createAddCharge(item));
    // });

    //  this._DoscApprovalService.InsertOPRefundBilling(this.vRefundOfBillFormGroup.value).subscribe(response => {
    //         this.viewgetOPRefundBillReportPdf(response);
    //         setTimeout(() => {
    //           this.grid.bindGridData();              
    //           this.cleardata();
    //         }, 100); 
    //       });
  }

  cleardata() {

  }

  doubleCheckIcon ='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32"><path d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z" fill="currentColor" /></svg>'


  openConfirmation(): void {
   Swal.fire({
       title: 'Discount Approval',
       text: "Discount Approval:",
       icon: 'success',
  iconHtml: this.doubleCheckIcon,
  customClass: {
    icon: 'rotate-y',
  },
       showDenyButton: true,
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       denyButtonColor: "#6c757d",
       cancelButtonColor: "#d33",
       confirmButtonText: "Disc Approval",
       denyButtonText: "Reject",
     }).then((result) => {
       if (result.isConfirmed) {
         this.onSave()
       } else if (result.isDenied) {
       this._matDialog.closeAll()
       }
     });
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
    
  // getDateTime(dateTimeObj) {
  //   this.dateTimeObj = dateTimeObj;
  // }

  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  openPaymentpopup(){

  }
}
