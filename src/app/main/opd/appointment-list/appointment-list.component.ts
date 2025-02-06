import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from './appointmentlist.service';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { fuseAnimations } from '@fuse/animations';
import { DischargeComponent } from 'app/main/ipd/ip-search-list/discharge/discharge.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { OPBillingComponent } from '../op-search-list/op-billing/op-billing.component';
import { AirmidTable1Component } from 'app/main/shared/componets/airmid-table1/airmid-table1.component';
import { AppointmentBillingComponent } from './appointment-billing/appointment-billing.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
// const moment = _rollupMoment || _moment;

@Component({
    selector: 'app-appointment-list',
    templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class AppointmentListComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    myformSearch: FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTable1Component;
    menuActions: Array<string> = [];
    
    
    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe,
    ) {

    }
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    DoctorId = "0";
    autocompleteModedeptdoc: string = "ConDoctor";
    doctorID = "0";

    onChangeStartDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[5].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    ngOnInit(): void {
        this.myformSearch = this._AppointmentlistService.filterForm();
        
        // menu Button List
        this.menuActions.push("Change Consultant Doctor");
        this.menuActions.push("Change Refer Doctor");
    }

    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

    ];
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientOldNew')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'mPbillNo')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    gridConfig: gridModel = {
        apiUrl: "VisitDetail/AppVisitList",
        columnsList: [
            { heading: "-", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 20 },
            { heading: "-", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 20 },
            { heading: "UHID", key: "regId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Date", key: "vistDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "OpdNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: 22 },
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
            // {heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.action, actions: [
            //         {
            //             // Pending page...
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.showBilling(data);
            //             }
            //         },
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onRegistrationEdit(data);
            //                 this.grid.bindGridData();
            //             }
            //         },
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.EditConsultdr(data);
            //             }
            //         },
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.Editrefrancedr(data);
            //             }
            //         },
            //     ]
            // }, //Action 1-view, 2-Edit,3-delete
           
        ],

        sortField: "VisitId",
        sortOrder: 0,
        filters: this.allfilters,
        row: 25
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewAppointmentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    showBilling(row: any = null) {
        // Pending...
        const dialogRef = this._matDialog.open(AppointmentBillingComponent, {
            maxWidth: "90vw",
            maxHeight: "90vh",
            width: "80%",
            data: {
                patientDetail: row
            }
        });
    }

    OnEditRegistration(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '90%',
                data: row
                //  {
                //     data1: row,
                //     Submitflag: true
                // },

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    OngetRecord(element, m){
        console.log('Third action clicked for:', element); 
        if (m == "Change Consultant Doctor") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
    
            let that = this;
            const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
                {
                    maxWidth: "70vw",
                    height: "410px",
                    width: "70%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Change Refer Doctor") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(EditRefranceDoctorComponent,
                {
                    maxWidth: "70vw",
                    height: "390px",
                    width: "50%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
    }

    OnViewReportPdf(element){
        debugger
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("VisitId", element.visitId, "AppointmentReceipt"); 
    }

    OnBillPayment(element){
        console.log('Third action clicked for:', element); 
    }

    OnNewCrossConsultation(element){
        console.log('Third action clicked for:', element); 
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: '75vw',
                height: '400px', width: '100%',
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    OnVitalInfo(element){
        console.log('Third action clicked for:', element); 
    }

    OnPrintPatientIcard(element){
        console.log('Third action clicked for:', element);
    }

    OnWhatsAppAppointmentSend(element){
       console.log('Third action clicked for:', element);
    }

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;


    Appointdetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;
        console.log(data)
        this.Vtotalcount;

        for (var i = 0; i < data.length; i++) {
            if (data[i].patientOldNew == 1) {
                this.VNewcount = this.VNewcount + 1;
            }
            else if (data[i].patientOldNew == 2) {
                this.VFollowupcount = this.VFollowupcount + 1;
            }
            if (data[i].mPbillNo == 1 || data[i].mPbillNo == 2) {
                this.VBillcount = this.VBillcount + 1;
            }
            if (data[i].crossConsulFlag == 1) {
                this.VCrossConscount = this.VCrossConscount + 1;
            }

            this.Vtotalcount = this.Vtotalcount + 1;
        }

    }
    EditConsultdr(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
            {
                maxWidth: "55vw",
                height: '45%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    Editrefrancedr(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditRefranceDoctorComponent,
            {
                maxWidth: "55vw",
                height: '45%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    Editcrossconsult(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: "65vw",
                height: '50%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    EditOpBill(row) {
        let that = this;
        const dialogRef = this._matDialog.open(OPBillingComponent,
            {
                maxWidth: "99vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
    AppointmentCancle(contact) {
        Swal.fire({
            title: 'Do you want to Cancle Appointment',
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {

            if (flag.isConfirmed) {
                let submitData = {
                    "visitId": contact.visitId
                };
                console.log(submitData);
                this._AppointmentlistService.Appointmentcancle(submitData).subscribe(response => {
                    this.toastr.success(response.message);
                    this._matDialog.closeAll();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });

    }
    // getAppointmentrview() {
    //     let param = {
    //         "searchFields": [
    //             {
    //                 "fieldName": "FromDate",
    //                 "fieldValue": "10-01-2024",
    //                 "opType": "13"
    //             },
    //             {
    //                 "fieldName": "ToDate",
    //                 "fieldValue": "12-12-2024",
    //                 "opType": "13"
    //             }
    //         ],
    //         "mode": "AppointmentListReport"
    //     }
    //     console.log(param)
    //     setTimeout(() => {

    //         this._AppointmentlistService.getAppointmenttemplateReport(param
    //         ).subscribe(res => {
    //             const dialogRef = this._matDialog.open(PdfviewerComponent,
    //                 {
    //                     maxWidth: "85vw",
    //                     height: '750px',
    //                     width: '100%',
    //                     data: {
    //                         base64: res["base64"] as string,
    //                         title: "Appointment  Viewer"
    //                     }
    //                 });
    //             dialogRef.afterClosed().subscribe(result => {

    //             });
    //         });

    //     }, 100);

    // }

    selectChangedeptdoc(obj: any) {
        this.gridConfig.filters[3].fieldValue = obj.value
    }
    getValidationdoctorMessages() {
        return {
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }


}


export class VisitMaster1 {
    visitId: Number;
    regId: number;
    RegID: number;
    visitDate: any;
    visitTime: any;
    unitId: number;
    patientTypeId: number;
    companyId: number;
    OPDNo: string;
    tariffId: number;
    consultantDocId: number;
    refDocId: number;
    departmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    phoneAppId: any;
    IsCancelled: any;
    classId: any;
    firstFollowupVisit: any;
    addedBy: any;
    updatedBy: any;
    /**
     * Constructor
     *
     * @param VisitMaster1
     */
    constructor(VisitMaster1) {
        {
            this.visitId = VisitMaster1.visitId || 0;
            this.regId = VisitMaster1.regId || 0;
            this.RegID = VisitMaster1.RegID || 0;
            this.visitDate = VisitMaster1.visitDate || "";
            this.visitTime = VisitMaster1.visitTime || "";
            this.unitId = VisitMaster1.unitId || 1;
            this.patientTypeId = VisitMaster1.patientTypeId || 1;
            this.companyId = VisitMaster1.companyId || 1;
            this.tariffId = VisitMaster1.tariffId || 1;
            this.consultantDocId = VisitMaster1.consultantDocId || 1;
            this.refDocId = VisitMaster1.refDocId || 1;
            this.departmentId = VisitMaster1.departmentId || 1;
            this.patientOldNew = VisitMaster1.patientOldNew || 0;
            this.phoneAppId = VisitMaster1.phoneAppId || 0
            this.IsCancelled = VisitMaster1.IsCancelled || 0
            this.classId = VisitMaster1.classId || 1;
            this.firstFollowupVisit = VisitMaster1.firstFollowupVisit || "";
            this.addedBy = VisitMaster1.addedBy || 0
            this.updatedBy = VisitMaster1.updatedBy || 0;
        }
    }
}


export class Regdetail {
    RegId: Number;
    regId: Number;
    RegDate: Date;
    RegTime: Date;
    PrefixId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    firstName: string;
    middleName: string;
    lastName: string;

    Address: string;
    City: string;
    PinNo: string;
    RegNo: string;
    DateofBirth: Date;
    Age: any;
    GenderId: Number;
    PhoneNo: string;
    MobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    CountryId: number;
    StateId: number;
    CityId: number;
    MaritalStatusId: number;
    IsCharity: Boolean;
    ReligionId: number;
    AreaId: number;
    VillageId: number;
    TalukaId: number;
    PatientWeight: number;
    AreaName: string;
    AadharCardNo: string;
    PanCardNo: string;
    currentDate = new Date();
    AdmissionID: any;
    VisitId: any;
    WardId: any;
    BedId: any;
    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || 0;
            this.regId = RegInsert.regId || 0;
            this.RegDate = RegInsert.RegDate || "";
            this.RegTime = RegInsert.RegTime || "";
            this.PrefixId = RegInsert.PrefixId || "";
            this.PrefixID = RegInsert.PrefixID || "";
            this.FirstName = RegInsert.FirstName || "";
            this.MiddleName = RegInsert.MiddleName || "";
            this.LastName = RegInsert.LastName || "";
            this.firstName = RegInsert.firstName || "";
            this.middleName = RegInsert.middleName || "";
            this.lastName = RegInsert.lastName || "";
            this.Address = RegInsert.Address || "";
            this.City = RegInsert.City || "";
            this.PinNo = RegInsert.PinNo || "";
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || "";
            this.GenderId = RegInsert.GenderId || "";
            this.PhoneNo = RegInsert.PhoneNo || "";
            this.MobileNo = RegInsert.MobileNo || "";
            this.AddedBy = RegInsert.AddedBy || "";
            this.AgeYear = RegInsert.AgeYear || "";
            this.AgeMonth = RegInsert.AgeMonth || "";
            this.AgeDay = RegInsert.AgeDay || "";
            this.CountryId = RegInsert.CountryId || "";
            this.StateId = RegInsert.StateId || "";
            this.CityId = RegInsert.CityId || "";
            this.MaritalStatusId = RegInsert.MaritalStatusId || "";
            this.IsCharity = RegInsert.IsCharity || "";
            this.ReligionId = RegInsert.ReligionId || "";
            this.AreaId = RegInsert.AreaId || "";
            this.VillageId = RegInsert.VillageId || "";
            this.TalukaId = RegInsert.TalukaId || "";
            this.PatientWeight = RegInsert.PatientWeight || "";
            this.AreaName = RegInsert.AreaName || "";
            this.AadharCardNo = RegInsert.AadharCardNo || "";
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || 0;
            this.VisitId = RegInsert.VisitId || 0;
            this.WardId = RegInsert.WardId || 0;
            this.BedId = RegInsert.BedId || 0;
        }
    }
}