import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { OPListService } from './oplist.service';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewOPRefundofbillComponent } from '../op-search-list/new-oprefundofbill/new-oprefundofbill.component';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormGroup } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import Swal from 'sweetalert2';
import { UpdateBill } from '../op-search-list/op-advance-payment/op-advance-payment.component';


@Component({
    selector: 'app-new-oplist',
    templateUrl: './new-oplist.component.html',
    styleUrls: ['./new-oplist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class NewOPListComponent implements OnInit {
    myFilterbillform:FormGroup;
    myFilterpayform:FormGroup;
    myFilterrefundform:FormGroup;
    menuActions: Array<string> = [];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    fromDate =this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 
    vMobileNo:any;
    vbalanceamt:any;
    vpaidamt:any;
    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

    ]

     @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
        @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
        // @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
        // @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
    
        ngAfterViewInit() {
            // Assign the template to the column dynamically
            this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate;
            this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate;
            // this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.actionsTemplate;
            this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
            // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
    
        }

        
    gridConfig: gridModel = {

        apiUrl: "VisitDetail/OPBillList",
        columnsList: [
            { heading: "Patient", key: "patientType", sort: true, align: 'left',type: gridColumnTypes.template, emptySign: 'NA',},
            { heading: "BillCancelled", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA' ,type: gridColumnTypes.template,},
            // { heading: "-", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' ,type: gridColumnTypes.template,},
             { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
            { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "Total Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 200},
            { heading: "Age", key: "patientAge", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200},
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate}  // Assign ng-template to the column
            // {
            //     heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
            //         {
            //             action: gridActions.print, callback: (data: any) => {
            //                 this.viewgetOPBillReportPdf(data);
            //             }
            //         },
            //         {
            //             action: gridActions.view, callback: (data: any) => {
            //                 this.getWhatsappshareBill(data);
            //             }
            //         }]
            // } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PbillNo",
        sortOrder: 0,
        filters: this.allfilters,
               row: 250
    }

    gridConfig1: gridModel = {
        apiUrl: "VisitDetail/OPPaymentList",
        columnsList: [
            { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA',type:6, width: 150  },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "Bill Amount", key: "neftpayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center" },
            { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center" },
            { heading: "AdvUsedPay", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center"},
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "CompanyName", key: "companyName", sort: true, align: "center", width: 200 },
            { heading: "UserName", key: "userName", sort: true, align: "center", width: 200 },
            // { heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            //     template: this.actionButtonTemplate1}  // Assign ng-template to the column
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPPaymentReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.whatsapp, callback: (data: any) => {
                            this.getWhatsappsharePaymentReceipt(data,true);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

        ],
        row: 25
    }


    gridConfig2: gridModel = {
        apiUrl: "VisitDetail/OPRefundList",
        columnsList: [
            { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "RefundNo", key: "refundNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA',type: 8 },
            { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
           
            { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200  },
            { heading: "RefDoctorName", key: "refdoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200  },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200  },
            { heading: "PatientType", key: "patientType", sort: true, align: "center" },
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' , width: 200 },
            { heading: "CompanyName", key: "companyName",sort: true, align: "center", width: 200  },
            // { heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            //     template: this.actionButtonTemplate2} 
            { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CardPay", key: "cardPay", sort: true,align: "center" },
            { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPRefundBillReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.view, callback: (data: any) => {
                            this.getWhatsappshareRefundBill(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RefundId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _OPListService: OPListService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe,
        private commonService: PrintserviceService) { }

        
    ngOnInit(): void {
             this.myFilterbillform=this._OPListService.myFilterbillbrowseform();
        this.myFilterpayform=this._OPListService.myFilterpaymentbrowseform();
         this.myFilterrefundform=this._OPListService.myFilterrefundbrowseform();

         this.menuActions.push("Print Final Bill");
         this.menuActions.push("Print Final Bill with Package Details");
    }

    onSave(row: any = null) {
    }


    onChangeStartDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
   
    
    viewgetOPBillReportPdf(element){
        debugger
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt"); 
    }


    getWhatsappshareBill(Id) { }

    viewgetOPPaymentReportPdf(data) { 
        
        this.commonService.Onprint("PaymentId",data.paymentId,"OPPaymentReceipt");
    }
    getWhatsappsharePaymentReceipt(Id,Mobile) { }

    viewgetOPRefundBillReportPdf(data) {
     
        this.commonService.Onprint("RefundId",data.RefundId,"OPRefundReceipt");
     }
    getWhatsappshareRefundBill(Id) { }


       OngetRecord(element, m){
        console.log(element)
        element.billNo=216366
            console.log('Third action clicked for:', element); 
            if (m == "Print Final Bill") {
                debugger
        this.commonService.Onprint("BillNo",element.billNo,"OpBillReceipt");
            }
            else if (m == "Print Final Bill with Package Details") {
                this.commonService.Onprint("BillNo",element.billNo,"OpBillReceipt");
            }
        }

  

    onChangeDate(selectDate) {
        if (selectDate) {
            
            this.fromDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.fromDate);
            this.gridConfig.filters[2].fieldValue = this.fromDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            ]
        }

    }
    onChangeDate1(selectDate) {
        if (selectDate) {
            
            // this.toDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            // console.log(this.toDate);
            // this.gridConfig.filters[3].fieldValue = this.toDate

            this.gridConfig.filters = [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        ]
        }
    }


    openPaymentpopup(contact){
        console.log(contact)
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.BillDate, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['RegNo'] = contact.RegNo;
        PatientHeaderObj['PatientName'] = contact.PatientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['Age'] = contact.PatientAge;
        PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
        PatientHeaderObj['DoctorName'] = contact.DoctorName;
        PatientHeaderObj['TariffName'] = contact.TariffName;
        PatientHeaderObj['CompanyName'] = contact.CompanyName;
        PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
        this.vMobileNo = contact.MobileNo;
        
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
    
            maxWidth: "80vw",
           // height: '600px',
            width: '70%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "OP-Bill"
            }
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log(result)
            if (result.IsSubmitFlag == true) {
              this.vpaidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
              this.vbalanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
              let updateBillobj = {};
              updateBillobj['BillNo'] = contact.BillNo;
              updateBillobj['BillBalAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController || result.submitDataPay.ipPaymentInsert.BalanceAmt;//result.BalAmt;
              const updateBill = new UpdateBill(updateBillobj);
              let Data = {
                "updateBill": updateBill,
                "paymentCreditUpdate": result.submitDataPay.ipPaymentInsert
              };
              console.log(Data)
              this._OPListService.InsertOPBillingsettlement(Data).subscribe(response => {
                if (response) {
                  Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
                    if (result.isConfirmed) {
                      
                      this.viewgetOPPaymentReportPdf(response)
                      this._matDialog.closeAll();
                     
                      this.getWhatsappsharePaymentReceipt(response,this.vMobileNo);
                    }
                  });
                }
                else {
                  Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
                }
              });
            }
          });
      }

    // getBilllistview(){
    //     let param={
      
    //         "searchFields": [
    //               {
    //                 "fieldName": "FromDate",
    //                 "fieldValue": "10-01-2024",
    //                 "opType": "13"
    //               },
    //           {
    //                 "fieldName": "ToDate",
    //                 "fieldValue": "12-12-2024",
    //                 "opType": "13"
    //               }
    //             ],
    //             "mode": "OPDailyCollectionReport"
    //           }
    //     console.log(param)
    //      setTimeout(() => {
        
    //                 this._OPListService.getBilllistReport(param
    //                 ).subscribe(res => {
    //                     const dialogRef = this._matDialog.open(PdfviewerComponent,
    //                         {
    //                             maxWidth: "85vw",
    //                             height: '750px',
    //                             width: '100%',
    //                             data: {
    //                                 base64: res["base64"] as string,
    //                                 title: "OP Bill  Viewer"
    //                             }
    //                         });
    //                     dialogRef.afterClosed().subscribe(result => {
        
    //                     });
    //                 });
        
    //             }, 100);

    //             this.commonService.Onprint("VisitId", element.visitId, "AppointmentReceipt"); 
    // }


    Onemail(data){}
    Onmessage(data){}
}
export class BrowseOPDBill {
    BillNo: Number;
  
    RegId: number;
    RegNo: number;
    PatientName: string;
    FirstName: string;
    Middlename: string;
    LastName: string;
   
    TotalAmt: number;
    ConcessionAmt: number;
    NetPayableAmt: number;
    BillDate: any;
    IPDNo: number;
    ServiceName: String;
    Price: number;
    price: number;
    Qty: number;
    ChargesTotalAmount: number;
    NetAmount: number;
    PaidAmount: number;
    HospitalName: string;
    HospitalAddress: string;
    Phone: number;
    EmailId: any;
    ChargesDoctorName: string;
    TotalBillAmount: number;
    ConsultantDocName: string;
    DepartmentName: string;
    IsCancelled: boolean;
    OPD_IPD_Type: number;
    PBillNo: string;
    BDate: Date;
    VisitDate: Date;
    BalanceAmt: number;
    AddedByName: string;
    Department: any;
    Address: any;
    MobileNo: any;
    CashCounterID:number;
    //NEFTPayAmount:number;
    /**
     * Constructor
     *
     * @param BrowseOPDBill
     */
    constructor(BrowseOPDBill) {
      {
        this.BillNo = BrowseOPDBill.BillNo || '';
        this.RegId = BrowseOPDBill.RegId || '';
        this.RegNo = BrowseOPDBill.RegNo || '';
        this.PatientName = BrowseOPDBill.PatientName || '';
        this.FirstName = BrowseOPDBill.FirstName || '';
        this.Middlename = BrowseOPDBill.MiddleName || '';
        this.LastName = BrowseOPDBill.LastName || '';
     
        this.TotalAmt = BrowseOPDBill.TotalAmt || '';
        this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
        this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
        this.BillDate = BrowseOPDBill.BillDate || '';
        this.IPDNo = BrowseOPDBill.IPDNo || '';
        this.IsCancelled = BrowseOPDBill.IsCancelled || '';
        this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
        this.PBillNo = BrowseOPDBill.PBillNo || '';
        this.BDate = BrowseOPDBill.BDate || '';
        this.PaidAmount = BrowseOPDBill.PaidAmount || '';
        this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
        this.ServiceName = BrowseOPDBill.ServiceName || '';
        this.Price = BrowseOPDBill.Price || '';
        this.price = BrowseOPDBill.price || '';
        this.Qty = BrowseOPDBill.Qty || '';
        this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
        this.NetAmount = BrowseOPDBill.NetAmount || '';
        this.HospitalName = BrowseOPDBill.HospitalName || '';
        this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
        this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
        this.Phone = BrowseOPDBill.Phone || '';
        this.EmailId = BrowseOPDBill.EmailId || '';
        this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
        this.DepartmentName = BrowseOPDBill.DepartmentName || '';
        this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
        this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
        this.VisitDate = BrowseOPDBill.VisitDate || '';
        this.AddedByName = BrowseOPDBill.AddedByName || '';
        this.TotalAmt = BrowseOPDBill.TotalAmt || '';
  
        this.Address = BrowseOPDBill.Address || '';
        this.Department = BrowseOPDBill.Department || '';
        this.MobileNo = BrowseOPDBill.MobileNo || '';
        this.CashCounterID=BrowseOPDBill.CashCounterID ||0
      }
    }
  
  }
  