import { DatePipe, Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AdvanceDataStored } from '../advance';
import { IPSearchListService } from './ip-search-list.service';
import { Router } from '@angular/router';
import { IPAdvanceComponent } from './ip-advance/ip-advance.component';
import Swal from 'sweetalert2';
import { DischargeComponent } from './discharge/discharge.component';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
// import { IPRefundofAdvanceComponent } from './ip-refundof-advance/ip-refundof-advance.component';
import { IPRefundofBillComponent } from './ip-refundof-bill/ip-refundof-bill.component';
import { AdmissionPersonlModel } from '../Admission/admission/admission.component';
import { IPBillingComponent } from './ip-billing/ip-billing.component';
import { IPSettlementComponent } from '../ip-settlement/ip-settlement.component';
import { DischargeSummaryComponent } from './discharge-summary/discharge-summary.component';
import { ToastrService } from 'ngx-toastr';
import { CompanyInformationComponent } from '../company-information/company-information.component';
import { IPRefundofAdvanceComponent } from '../ip-refundof-advance/ip-refundof-advance.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPIPFeedbackComponent } from '../Feedback/opip-feedback/opip-feedback.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { STATUS } from 'angular-in-memory-web-api';
import { MLCInformationComponent } from '../Admission/admission/mlcinformation/mlcinformation.component';
import { DischargeSummaryTemplateComponent } from './discharge-summary-template/discharge-summary-template.component';


@Component({
    selector: 'app-ip-search-list',
    templateUrl: './ip-search-list.component.html',
    styleUrls: ['./ip-search-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPSearchListComponent implements OnInit {
    myFilterform: FormGroup;
    autocompleteModedeptdoc: string = "ConDoctor";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('iconPatientCategory') iconPatientCategory!: TemplateRef<any>;
    @ViewChild('iconBillCancle') iconBillCancle!: TemplateRef<any>;
    @ViewChild('iconMlc') iconMlc!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    fromDate = ""// this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    // toDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.iconPatientCategory;
        this.gridConfig.columnsList.find(col => col.key === 'isBillGenerated')!.template = this.iconBillCancle;
        this.gridConfig.columnsList.find(col => col.key === 'isMLC')!.template = this.iconMlc;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    gridConfig: gridModel = {
        apiUrl: "Admission/AdmissionList",
        columnsList: [
            { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, width: 50 },
            { heading: "Bill", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "IsMLC", key: "isMLC", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 100 },
            { heading: "IPDNo", key: "ipdno", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Doctorname", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', type: 10, width: 250 },
            { heading: "RefDocName", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', type: 10, width: 250 },
            { heading: "Adv.Amount", key: "adv.amount", sort: true, align: 'left', emptySign: 'NA', type: 10 },
            // { heading: "PatientType", key: "patientTypeID", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.status, },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', type: 10, width: 250 },
            {
                heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
            // {
            //     heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onSave(data);
            //             }
            //         },
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onAdvanceSave(data);
            //             }
            //         },
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onBedTransferSave(data);
            //             }
            //         },

            //         {

            //             action: gridActions.delete, callback: (data: any) => {
            //                 this._IpSearchListService.deactivateTheStatus(data.AdmissionId).subscribe((response: any) => {
            //                     this.toastr.success(response.message);
            //                     this.grid.bindGridData();
            //                 });
            //             }
            //         }]
            // } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "AdmissionId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

       menuActions: Array<string> = [];

    constructor(
        public _IpSearchListService: IPSearchListService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private _ActRoute: Router,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored) { }

    ngOnInit(): void {
        this.myFilterform = this._IpSearchListService.filterForm();
        // this.myFilterform.get("fromDate").reset();
        // this.myFilterform.get("enddate").reset();
        this.myFilterform.get("fromDate").setValue("");
        this.myFilterform.get("enddate").setValue("");


        if (this._ActRoute.url == '/ipd/ipadvance') {
            this.menuActions.push('Advance');
            this.menuActions.push('Bed Transfer');
        }
        else if (this._ActRoute.url == '/ipd/discharge') {
            this.menuActions.push('Discharge');
            this.menuActions.push('Discharge Summary Template');
            this.menuActions.push('Patient Feedback');
        }
        else if (this._ActRoute.url == '/ipd/dischargesummary') {
            this.menuActions.push('Discharge');
            this.menuActions.push('Discharge Summary');
        }
        else if (this._ActRoute.url == '/ipd/refund/iprefundofadvance' || this._ActRoute.url == '/ipd/refund/iprefundofbill') {

            this.menuActions.push('Refund of Bill');
            this.menuActions.push('Refund of Advance');
            this.menuActions.push('Refund of Advance');
        }

        else if (this._ActRoute.url == '/ipd/add-billing') {
            this.menuActions.push('Advance');
            this.menuActions.push('Bill');
            this.menuActions.push('Refund of Bill');
            this.menuActions.push('Refund of Advance');
            // this.menuActions.push('Payment');
            this.menuActions.push('Update Company Information');
        }
        else if (this._ActRoute.url == '/ipd/medicalrecords') {
            this.menuActions.push('Case Paper');
        }
        else if (this._ActRoute.url == '/ipd/ip-casepaper') {
            this.menuActions.push('Medical CasePaper');

        }
        else if (this._ActRoute.url == '/nursingstation/bedtransfer') {
            this.menuActions.push('Bed Transfer');
            this.menuActions.push('Doctor Note');
            this.menuActions.push('Nursing Note');

        }

    }

   
    OngetRecord(element, m) {
        debugger
        console.log('Third action clicked for:', element);
        if (m == "Discharge") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(DischargeComponent,
                {
                    maxWidth: "85vw",
                    height: '450px',
                    width: '100%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Discharge Summary") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(DischargeSummaryComponent,
                {
                    maxWidth: "100%",
                    height: '90%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Discharge Summary Template") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(DischargeSummaryTemplateComponent,
                {
                    maxWidth: "100%",
                    height: '90%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Patient Feedback") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
                {
                    maxWidth: "100%",
                    height: '90%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Refund of Bill") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(IPRefundofBillComponent,
                {
                    maxWidth: "100%",
                    height: '90%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Refund of Advance") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button 
            let that = this; 
             this.advanceDataStored.storage = new AdvanceDetailObj(element); 
             console.log(this.advanceDataStored.storage)
            const dialogRef = this._matDialog.open(IPRefundofAdvanceComponent,
                {
                    maxWidth: "100%",
                    height: '90%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Update Company Information") {
               
            this.advanceDataStored.storage = new AdvanceDetailObj(element);
            this._IpSearchListService.populateForm2(element);
            // if (!contact.IsBillGenerated) {
            const dialogRef = this._matDialog.open(CompanyInformationComponent,
              {
                maxWidth: "75vw",
                maxHeight: "99%", width: '100%', height: "100%"
              });
            dialogRef.afterClosed().subscribe(result => {
             
            });
            
          }
        else if (m == "Bill") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            this.advanceDataStored.storage = new AdvanceDetailObj(element);
            const dialogRef = this._matDialog.open(IPBillingComponent,
                {
                    maxWidth: "100%",
                    width: '95%',
                    height: '95%',
                    data: {
                        Obj: element
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Bed Transfer") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(BedTransferComponent,
                {
                    maxWidth: "100%",
                    height: '60%',
                    width: '90%',
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Advance") {
            //console.log(element);
            this.advanceDataStored.storage = new AdvanceDetailObj(element);
            // this._IpSearchListService.populateForm(element); 
            let Advflag: boolean = false;
            if (element.IsBillGenerated) {
                Advflag = true;
            }
            if (element.IsDischarged) {
                Advflag = true;
            }

            if (!Advflag) {
                const dialogRef = this._matDialog.open(IPAdvanceComponent,
                    {
                        maxWidth: "100%",
                        height: '95%',
                        width: '80%',
                        data:{
                            Obj:element
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed - Insert Action', result);
                });
            } else {
                //Swal.fire("Bil Generatd !")
                Swal.fire({
                    title: 'Selected Patient Bill Is Already Generated',
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ok!"
                })
            }
        }
    }

    dataSource1 = new MatTableDataSource<AdvanceDetailObj>();

    SubMenu(contact) {
        let xx = {
            RegNo: contact.RegNo,
            AdmissionID: contact.AdmissionID,
            PatientName: contact.PatientName,
            Doctorname: contact.Doctorname,
            AdmDateTime: contact.AdmDateTime,
            AgeYear: contact.AgeYear,
            ClassId: contact.ClassId,
            TariffName: contact.TariffName,
            TariffId: contact.TariffId,
            IsDischarged: contact.IsDischarged,
            IPDNo: contact.IPDNo,
            BedName: contact.BedName,
            WardName: contact.RoomName
        };
        this.advanceDataStored.storage = new AdvanceDetailObj(xx);
        this._ActRoute.navigate(['ipd/add-billing/new-appointment']);
    }



    onChangeStatus(event) {
        debugger
        console.log(event)
        if (event.value=="1")
            this.gridConfig.filters[6].fieldValue = "1"
        else if(event.value=="0")
            this.gridConfig.filters[6].fieldValue = "0"

        this.grid.bindGridData();
    }

    onClear() {

        this._IpSearchListService.myFilterform.reset();
        this._IpSearchListService.myFilterform.get("IsDischarge").setValue(0);
        this._IpSearchListService.myFilterform.get("FirstName").setValue('');
        this._IpSearchListService.myFilterform.get("MiddleName").setValue('');
        this._IpSearchListService.myFilterform.get("LastName").setValue('');

    }

    getValidationdeptDocMessages() {
        return {
            DoctorID: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }

    NewMLc(contact) {

        const dialogRef = this._matDialog.open(MLCInformationComponent,
            {
                maxWidth: '85vw',
                height: '400px', width: '100%',
                data: contact
            });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }

    getfeedback(event) { }
    printDischargesummaryWithoutletterhead(event) { }
    printDischargesummary(event) { }
    printDischargeslip(event) { }
    getSelectedRow(row:any):void{
        console.log("Selected row : ", row);
    }
}



export class Bed {
    BedId: Number;
    BedName: string;

    /**
     * Constructor
     *
     * @param Bed
     */
    constructor(Bed) {
        {
            this.BedId = Bed.BedId || '';
            this.BedName = Bed.BedName || '';
        }
    }
}


export class AdvanceDetail {
    AdvanceDetailID: Number;
    Date: Date;
    Time: Time;
    AdvanceId: number;
    RefId: number;
    TransactionID: number;
    OPD_IPD_Id: number;
    OPD_IPD_Type: number;
    AdvanceAmount: number;
    UsedAmount: number;
    BalanceAmount: number;
    RefundAmount: number;
    ReasonOfAdvanceId: number;
    AddedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;
    Reason: string;

    /**
    * Constructor
    *
    * @param AdvanceDetail
    */
    constructor(AdvanceDetail) {
        {
            this.AdvanceDetailID = AdvanceDetail.AdvanceDetailID || '';
            this.Date = AdvanceDetail.Date || '';
            this.Time = AdvanceDetail.Time || '';
            this.AdvanceId = AdvanceDetail.AdvanceId || '';
            this.RefId = AdvanceDetail.RefId || '';
            this.TransactionID = AdvanceDetail.TransactionID || '';
            this.OPD_IPD_Id = AdvanceDetail.OPD_IPD_Id || '';
            this.OPD_IPD_Type = AdvanceDetail.OPD_IPD_Type || '';
            this.AdvanceAmount = AdvanceDetail.AdvanceAmount || '';
            this.UsedAmount = AdvanceDetail.UsedAmount || '';
            this.BalanceAmount = AdvanceDetail.BalanceAmount || '';
            this.RefundAmount = AdvanceDetail.RefundAmount || '';
            this.ReasonOfAdvanceId = AdvanceDetail.ReasonOfAdvanceId || '';
            this.AddedBy = AdvanceDetail.AddedBy || '';
            this.IsCancelled = AdvanceDetail.IsCancelled || '';
            this.IsCancelledBy = AdvanceDetail.IsCancelledBy || '';
            this.IsCancelledDate = AdvanceDetail.IsCancelledDate || '';
            this.Reason = AdvanceDetail.Reason || '';
        }
    }
}

export class AdvanceDetailObj {
    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    AgeMonth: number;
    AgeDay: number;
    ClassId: number;
    ClassName: String;
    TariffName: String;
    TariffId: number;
    IsDischarged: boolean;
    opD_IPD_Type: number;
    PatientType: any;
    PatientTypeID: any;
    VisitId: any;
    AdmissionId: number;
    IPDNo: any;
    DoctorId: number;
    BedId: any;
    BedName: String;
    WardName: String;
    CompanyId: string;
    SubCompanyId: any;
    IsBillGenerated: any;
    UnitId: any;
    RegId: number;
    RefId: number;
    OPD_IPD_ID: any;
    storage: any;
    IsMLC: any;
    NetPayableAmt: any;
    OPD_IPD_Id: any;
    RegID: any;
    CompanyName: any;
    RoomName: any;
    DOA: any;
    DOD: any;
    DepartmentName: any;
    RefDocName: any;
    GenderName: any;
    DocNameID: any; 
    PolicyNo: any;
    MemberNo: any;
    ClaimNo: any;
    CompBillNo: any;
    CompBillDate: any;
    CompDiscount: any;
    CompDisDate: any;
    C_BillNo: any;
    C_FinalBillAmt: any;
    C_DisallowedAmt: any;
    HDiscAmt: any;
    C_OutsideInvestAmt: any;
    RecoveredByPatient: any;
    H_ChargeAmt: any;
    H_AdvAmt: any;
    H_BillId: any;
    H_BillDate: any;
    H_BillNo: any;
    H_TotalAmt: any;
    H_DiscAmt: any;
    H_NetAmt: any;
    H_PaidAmt: any;
    H_BalAmt: any;
    mobileNo: any;
    MobileNo:any;
    PatientAge: any;
    AdvTotalAmount: any;
    IsInitinatedDischarge:any; 
    /**
    * Constructor
    *
    * @param AdvanceDetailObj
    */
    constructor(AdvanceDetailObj) {
        {
            this.RegNo = AdvanceDetailObj.RegNo || '';
            this.RegId = AdvanceDetailObj.RegId || '';
            this.AdmissionID = AdvanceDetailObj.AdmissionID || '';
            this.PatientName = AdvanceDetailObj.PatientName || '';
            this.Doctorname = AdvanceDetailObj.Doctorname || '';
            this.AdmDateTime = AdvanceDetailObj.AdmDateTime || '';
            this.AgeYear = AdvanceDetailObj.AgeYear || '';
            this.ClassId = AdvanceDetailObj.ClassId || '';
            this.ClassName = AdvanceDetailObj.ClassName || '';
            this.TariffName = AdvanceDetailObj.TariffName || '';
            this.TariffId = AdvanceDetailObj.TariffId || '';
            this.IsDischarged = AdvanceDetailObj.IsDischarged || 0;
            this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type | 0;
            this.PatientType = AdvanceDetailObj.PatientType || 0;
            this.VisitId = AdvanceDetailObj.VisitId || '';
            this.AdmissionId = AdvanceDetailObj.AdmissionId || '';
            this.IPDNo = AdvanceDetailObj.IPDNo || '';
            this.BedName = AdvanceDetailObj.BedName || '';
            this.WardName = AdvanceDetailObj.WardName || '';
            this.CompanyId = AdvanceDetailObj.CompanyId || '';
            this.IsBillGenerated = AdvanceDetailObj.IsBillGenerated || 0;
            this.UnitId = AdvanceDetailObj.UnitId || 0;
            this.RefId = AdvanceDetailObj.RefId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.IsMLC = AdvanceDetailObj.IsMLC || 0;
            this.BedId = AdvanceDetailObj.BedId || 0;
            this.SubCompanyId = AdvanceDetailObj.SubCompanyId || 0;
            this.PatientTypeID = AdvanceDetailObj.PatientTypeID || 0;
            this.NetPayableAmt = AdvanceDetailObj.NetPayableAmt || 0;
            this.OPD_IPD_Id = AdvanceDetailObj.OPD_IPD_Id || 0;
            this.RegID = AdvanceDetailObj.RegID || 0;
            this.CompanyName = AdvanceDetailObj.CompanyName || ''
            this.RoomName = AdvanceDetailObj.RoomName || ''
            this.DOA = AdvanceDetailObj.DOA || ''
            this.DOD = AdvanceDetailObj.DOD || ''
            this.DepartmentName = AdvanceDetailObj.DepartmentName || ''
            this.AgeMonth = AdvanceDetailObj.AgeMonth || ''
            this.AgeDay = AdvanceDetailObj.AgeDay || ''
            this.RefDocName = AdvanceDetailObj.RefDocName || ''
            this.GenderName = AdvanceDetailObj.GenderName || ''
            this.DocNameID = AdvanceDetailObj.DocNameID | 0
            this.mobileNo = AdvanceDetailObj.MobileNo || ''
            this.AdvTotalAmount = AdvanceDetailObj.AdvTotalAmount || 0
              this.IsInitinatedDischarge = AdvanceDetailObj.IsInitinatedDischarge || ''
        }
    }
}


export class ChargesList {
    ChargesId:any
    chargesId: number;
    ServiceId: number;
    ServiceName: String;
    Price: number;
    Qty: number;
    TotalAmt: number;
    DiscPer: number;
    DiscAmt: number;
    NetAmount: number;
    DoctorId: number;
    ChargeDoctorName: String;
    ChargesDate: Date;
    IsPathology: boolean;
    IsRadiology: boolean;
    ClassId: number;
    ClassName: string;
    ChargesAddedName: string;
    BalanceQty: any;
    IsStatus: any;
    extMobileNo: any;
    ConcessionPercentage: any;
    constructor(ChargesList) {
        this.chargesId = ChargesList.chargesId || '';
        this.ServiceId = ChargesList.ServiceId || '';
        this.ServiceName = ChargesList.ServiceName || '';
        this.Price = ChargesList.Price || '';
        this.Qty = ChargesList.Qty || '';
        this.TotalAmt = ChargesList.TotalAmt || '';
        this.DiscPer = ChargesList.DiscPer || '';
        this.DiscAmt = ChargesList.DiscAmt || '';
        this.NetAmount = ChargesList.NetAmount || '';
        this.DoctorId = ChargesList.DoctorId || 0;
        this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
        this.ChargesDate = ChargesList.ChargesDate || '';
        this.IsPathology = ChargesList.IsPathology || '';
        this.IsRadiology = ChargesList.IsRadiology || '';
        this.ClassId = ChargesList.ClassId || 0;
        this.ClassName = ChargesList.ClassName || '';
        this.ChargesAddedName = ChargesList.ChargesAddedName || '';
        this.BalanceQty = ChargesList.BalanceQty || 0;
        this.IsStatus = ChargesList.IsStatus || 0;
        this.extMobileNo = ChargesList.extMobileNo || ''
        this.ConcessionPercentage = ChargesList.ConcessionPercentage || ''
    }
}
export class AdvanceHeader {
    AdvanceId: Number;
    Date: Date;
    RefId: number;
    OPD_IPD_Type: number;
    OPD_IPD_Id: number;
    AdvanceAmount: number;
    AdvanceUsedAmount: number;
    BalanceAmount: number;
    AddedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;

    /**
    * Constructor
    *
    * @param AdvanceHeader
    */
    constructor(AdvanceHeader) {
        {
            this.AdvanceId = AdvanceHeader.AdvanceId || '';
            this.Date = AdvanceHeader.Date || '';
            this.RefId = AdvanceHeader.RefId || '';
            this.OPD_IPD_Type = AdvanceHeader.OPD_IPD_Type || '';
            this.OPD_IPD_Id = AdvanceHeader.OPD_IPD_Id || '';
            this.AdvanceAmount = AdvanceHeader.AdvanceAmount || '';
            this.AdvanceUsedAmount = AdvanceHeader.AdvanceUsedAmount || '';
            this.BalanceAmount = AdvanceHeader.BalanceAmount || '';
            this.AddedBy = AdvanceHeader.AddedBy || '';
            this.IsCancelled = AdvanceHeader.IsCancelled || '';
            this.IsCancelledBy = AdvanceHeader.IsCancelledBy || '';
            this.IsCancelledDate = AdvanceHeader.IsCancelledDate || '';

        }
    }
}
export class Payment {
    PaymentId: Number;
    BillNo: number;
    ReceiptNo: string;
    PaymentDate: Date;
    PaymentTime: Time;
    CashPayAmount: number;
    ChequePayAmount: number;
    ChequeNo: string;
    BankName: string;
    ChequeDate: Date;
    CardPayAmount: number;
    CardNo: string;
    CardBankName: string;
    CardDate: Date;
    AdvanceUsedAmount: number;
    AdvanceId: number;
    RefundId: number;
    TransactionType: number;
    Remark: string;
    AddBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;
    CashCounterId: number;
    IsSelfORCompany: number;
    CompanyId: number;
    NEFTPayAmount: number;
    NEFTNo: string;
    NEFTBankMaster: string;
    NEFTDate: Date;
    PayTMAmount: number;
    PayTMTranNo: string;
    PayTMDate: Date;

    /**
    * Constructor
    *
    * @param Payment
    */
    constructor(Payment) {
        {
            this.PaymentId = Payment.PaymentId || '';
            this.BillNo = Payment.BillNo || '';
            this.ReceiptNo = Payment.ReceiptNo || '';
            this.PaymentDate = Payment.PaymentDate || '';
            this.PaymentTime = Payment.PaymentTime || '';
            this.CashPayAmount = Payment.CashPayAmount || '';
            this.ChequePayAmount = Payment.ChequePayAmount || '';
            this.ChequeNo = Payment.ChequeNo || '';
            this.BankName = Payment.BankName || '';
            this.ChequeDate = Payment.ChequeDate || '';
            this.CardPayAmount = Payment.CardPayAmount || '';
            this.CardNo = Payment.CardNo || '';
            this.CardBankName = Payment.CardBankName || '';
            this.CardDate = Payment.CardDate || '';
            this.AdvanceUsedAmount = Payment.AdvanceUsedAmount || '';
            this.AdvanceId = Payment.AdvanceId || '';
            this.RefundId = Payment.RefundId || '';
            this.TransactionType = Payment.TransactionType || '';
            this.Remark = Payment.Remark || '';
            this.AddBy = Payment.AddBy || '';
            this.IsCancelled = Payment.IsCancelled || '';
            this.IsCancelledBy = Payment.IsCancelledBy || '';
            this.IsCancelledDate = Payment.IsCancelledDate || '';
            this.CashCounterId = Payment.CashCounterId || '';
            this.IsSelfORCompany = Payment.IsSelfORCompany || '';
            this.CompanyId = Payment.CompanyId || '';
            this.NEFTPayAmount = Payment.NEFTPayAmount || '';
            this.NEFTNo = Payment.NEFTNo || '';
            this.NEFTBankMaster = Payment.NEFTBankMaster || '';
            this.NEFTDate = Payment.NEFTDate || '';
            this.PayTMAmount = Payment.PayTMAmount || '';
            this.PayTMTranNo = Payment.PaymentId || '';
            this.PayTMDate = Payment.PayTMDate || '';


        }
    }

}

export class Discharge {
    DischargeId: Number;
    AdmissionID: Number;
    DischargeDate: Date;
    DischargeTime: Date;
    DischargeTypeId: string;
    DischargedDocId: number;
    AddedBy: number;

    /**
    * Constructor
    *
    * @param Discharge
    */
    constructor(Discharge) {
        {
            this.DischargeId = Discharge.DischargeId || '';
            this.AdmissionID = Discharge.AdmissionID || '';
            this.DischargeDate = Discharge.DischargeDate || '';
            this.DischargeTime = Discharge.DischargeTime || '';
            this.DischargeTypeId = Discharge.DischargeTypeId || '';
            this.DischargedDocId = Discharge.DischargedDocId || '';
            this.AddedBy = Discharge.AddedBy || '';

        }
    }
}


export class Bedtransfer {
    // BedId : Number;
    FromTime: Date;
    FromDate: Date;
    FromBedId: number;
    FromClassId: number;
    FromWardID: number;
    ToDate: Date;
    ToTime: Date;
    ToBedId: number;
    ToWardID: Number;
    ToClassId: Number;
    AddedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: Number;

    /**
    * Constructor
    *
    * @param Bedtransfer
    */
    constructor(Bedtransfer) {
        {
            this.FromTime = Bedtransfer.FromTime || '';
            this.FromDate = Bedtransfer.FromDate || '';
            this.FromBedId = Bedtransfer.FromBedId || '';
            this.FromClassId = Bedtransfer.FromClassId || '';
            this.FromWardID = Bedtransfer.FromWardID || '';
            this.ToDate = Bedtransfer.ToDate || '';
            this.ToTime = Bedtransfer.ToTime || '';
            this.ToBedId = Bedtransfer.ToBedId || '';
            this.ToClassId = Bedtransfer.ToClassId || '';
            this.ToWardID = Bedtransfer.ToWardID || '';
            this.IsCancelled = Bedtransfer.IsCancelled || '';
            this.IsCancelledBy = Bedtransfer.IsCancelledBy || '';
            this.AddedBy = Bedtransfer.AddedBy || '';

        }
    }
}
 