import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';
import { BrowseIpAdvanceService } from './browse-ip-advance.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-browse-ip-advance',
    templateUrl: './browse-ip-advance.component.html',
    styleUrls: ['./browse-ip-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {

    constructor(
        public _BrowseIpAdvanceService: BrowseIpAdvanceService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService
      ) { }

      ngOnInit(): void { }

     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "MReportConfig/List",
            columnsList: [
                { heading: "Patient", key: "patient", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "UHID", key: "uHID", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "IPDNo", key: "iPDNo", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "AdvanceAmt", key: "advanceAmt", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "CashPay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "CardPay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "OnlinePay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "RefundAmt", key: "refundAmt", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA'},
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, 
                        {
                            action: gridActions.delete, callback: (data: any) => {
                                this._BrowseIpAdvanceService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "ReportName",
            sortOrder: 0,
            filters: [
                { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
                { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
                { fieldName: "PBillNo", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
        gridConfig1: gridModel = {
            apiUrl: "MReportConfig/List",
            columnsList: [
                { heading: "UHIDNo", key: "uHIDNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "AdvanceAmt", key: "advanceAmt", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "AdvanceUsedAmt", key: "advanceUsedAmt", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "RefundAmt", key: "refundAmt", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "PayDate", key: "payDate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "CashPay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "CardPay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._BrowseIpAdvanceService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "ReportName",
            sortOrder: 0,
            filters: [
                { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
                { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
            ],
            row: 25
        }

        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
    
            let that = this;
            // const dialogRef = this._matDialog.open( NewcreateUserComponent, 
            //     {
            //         maxHeight: '95vh',
            //         width: '90%',
            //         data: row
            //     });
            // dialogRef.afterClosed().subscribe(result => {
            //     if (result) {
            //         that.grid.bindGridData();
            //     }
            // });
        }
}


export class IpdAdvanceBrowseModel {
    RegNo: Number;
    PatientName: string;
    Date: Date;
    AdvanceNo: string;
    TransactionID: number;
    AdvanceAmount: number;
    UsedAmount: number;
    BalanceAmount: number;
    AddedBy: number;
    CashPayAmount: number;
    ChequePayAmount: number;
    CardPayAmount: number;
    TransactionType: number;
    UserName: string;
    RefundAmount:number;
    PrevAdvAmt:number;
    AdvanceId:number;
    IPDNo:any;
    AdvanceDetailID:number;
    HospitalName:any;
    HospAddress:any;
    Phone:any;
    EmailId:any;
    reason:any;
  
    Address: any;
    PatientType: any;
    TariffName:any;
    AdmissionDate:any;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    CardNo: any;
    CardBankName:any;
    ChequeNo:any;
    PaymentDate: any;
    AdvanceUsedAmount: number;
      Remark:any;
      
    /**
  * Constructor
  *
  * @param IpdAdvanceBrowseModel
  */
    constructor(IpdAdvanceBrowseModel) {
        {
            this.RegNo = IpdAdvanceBrowseModel.RegNo || '';
            this.PatientName = IpdAdvanceBrowseModel.PatientName || '';
            this.Date = IpdAdvanceBrowseModel.Date || '';
            this.AdvanceNo = IpdAdvanceBrowseModel.AdvanceNo || '';
            this.AdvanceAmount = IpdAdvanceBrowseModel.AdvanceAmount || '';
            this.UsedAmount = IpdAdvanceBrowseModel.UsedAmount || '';
            this.BalanceAmount = IpdAdvanceBrowseModel.BalanceAmount || '';
            this.AddedBy = IpdAdvanceBrowseModel.AddedBy || '';
            this.CashPayAmount = IpdAdvanceBrowseModel.CashPayAmount || '';
            this.ChequePayAmount = IpdAdvanceBrowseModel.ChequePayAmount || '';
            this.CardPayAmount = IpdAdvanceBrowseModel.CardPayAmount || '';
            this.UserName = IpdAdvanceBrowseModel.UserName || '';
            this.RefundAmount = IpdAdvanceBrowseModel.RefundAmount || '';
            this.PrevAdvAmt=IpdAdvanceBrowseModel.PrevAdvAmt || '';
            this.AdvanceId = IpdAdvanceBrowseModel.AdvanceId || 0;
            this.AdvanceDetailID = IpdAdvanceBrowseModel.AdvanceDetailID || 0;
            this.IPDNo = IpdAdvanceBrowseModel.IPDNo || 0;
  
            this.HospitalName=IpdAdvanceBrowseModel.HospitalName || '';
            this.HospAddress = IpdAdvanceBrowseModel.HospAddress || '';
            this.Phone = IpdAdvanceBrowseModel.Phone || 0;
            this.EmailId = IpdAdvanceBrowseModel.EmailId || 0;
            this.reason = IpdAdvanceBrowseModel.reason || 0;
  
            this.Address=IpdAdvanceBrowseModel.Address || '';
            this.PatientType = IpdAdvanceBrowseModel.PatientType || '';
            this.TariffName = IpdAdvanceBrowseModel.TariffName || 0;
            this.PayDate = IpdAdvanceBrowseModel.PayDate || 0;
            this.PaidAmount = IpdAdvanceBrowseModel.PaidAmount || 0;
            
            this.NEFTPayAmount=IpdAdvanceBrowseModel.NEFTPayAmount || '';
            this.PayTMAmount = IpdAdvanceBrowseModel.PayTMAmount || '';
            this.CardNo = IpdAdvanceBrowseModel.CardNo || 0;
            this.CardBankName = IpdAdvanceBrowseModel.CardBankName || 0;
            this.ChequeNo = IpdAdvanceBrowseModel.ChequeNo || 0;
            this.PaymentDate = IpdAdvanceBrowseModel.PaymentDate || '';
            this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
            this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
            this.Remark = IpdAdvanceBrowseModel.Remark || 0;
        }
    }
  
  }