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
import { AirmidTable1Component } from 'app/main/shared/componets/airmid-table1/airmid-table1.component';
import { AppointmentBillingComponent } from './appointment-billing/appointment-billing.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { forEach } from 'lodash';
import { NewCasepaperComponent } from '../new-casepaper/new-casepaper.component';
import { PatientvitalInformationComponent } from './new-appointment/patientvital-information/patientvital-information.component';
import { RegInsert } from '../registration/registration.component';
import { UpdateRegPatientInfoComponent } from './update-reg-patient-info/update-reg-patient-info.component';
import { SearchInforObj, SearchInforObj1 } from '../op-search-list/opd-search-list/opd-search-list.component';
import { TestingTableComponent } from '../testing-table/testing-table.component';
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
    searchFormGroup: FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    menuActions: Array<string> = [];
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    DoctorId = "0";
    autocompleteModedeptdoc: string = "ConDoctor";
    doctorID = "0";

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;
    patientDetail = new RegInsert({});
    patientDetail1 = new VisitMaster1({});
    RegId = 0

    vOPIPId = 0;

    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: FormBuilder,
        public toastr: ToastrService, public datePipe: DatePipe,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._AppointmentlistService.filterForm();
        this.searchFormGroup = this.createSearchForm();
        // menu Button List
        this.menuActions.push("Update Consultant Doctor");
        this.menuActions.push("Update Referred Doctor");
        this.menuActions.push("Medical Record");
        this.menuActions.push("Report Record");
        this.Appointdetail(this.gridConfig)

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

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientOldNew')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'mPbillNo')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'phoneAppId')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'crossConsulFlag')!.template = this.actionsTemplate3;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    gridConfig: gridModel = {
        apiUrl: "VisitDetail/AppVisitList",
        columnsList: [
            { heading: "Patient", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },
            { heading: "", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "phoneAppId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "crossConsulFlag", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "UHID", key: "regId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Date", key: "vistDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: 22 },
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            {
                heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
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

    onChangeStartDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[5].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
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
            // if (result) {
            that.grid.bindGridData();
            // }
        });
    }
    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: ['']
        });
    }

    // showBilling(row) {
    //     const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    //     buttonElement.blur(); // Remove focus from the button

    //     this.advanceDataStored.storage = new SearchInforObj1(row);
    //     const dialogRef = this._matDialog.open(AppointmentBillingComponent, {
    //         maxWidth: "90vw",
    //         maxHeight: "90vh",
    //         width: "80%",
    //         // data:row
    //     });
    // }

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

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    OngetRecord(element, m) {
        console.log('Third action clicked for:', element);
        if (m == "Update Consultant Doctor") {
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
        else if (m == "Update Referred Doctor") {
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
        else if (m == "Medical Record") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(NewCasepaperComponent,
                {
                    maxWidth: "90vw",
                    height: "890px",
                    width: "100%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
        else if (m == "Report Record") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(TestingTableComponent,
                {
                    maxWidth: "90vw",
                    height: "890px",
                    width: "100%",
                    data: element
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }
       
    }

    OnViewReportPdf(element) {
        this.commonService.Onprint("VisitId", element.visitId, "AppointmentReceipt");
    }

    OnBillPayment(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        this.advanceDataStored.storage = new SearchInforObj1(row);
        console.log(row)

        console.log(this.advanceDataStored.storage)
        const dialogRef = this._matDialog.open(AppointmentBillingComponent, {
            maxWidth: "99vw",
            height: "98vh",
            width: "100%",
            // data:row

        });
    }

    OnNewCrossConsultation(element) {
        console.log('Third action clicked for:', element);
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        console.log(element)
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

    OnVitalInfo(element) {
        const dialogRef = this._matDialog.open(PatientvitalInformationComponent,
            {
                maxWidth: '95%',
                height: '48%',
                data: element
            });

        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OnPrintPatientIcard(element) {
        console.log('Third action clicked for:', element);
    }

    OnWhatsAppAppointmentSend(element) {
        console.log('Third action clicked for:', element);
    }

    Appointdetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;
        console.log(data)
        this.Vtotalcount;
        console.log(data)
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

    // EditOpBill(row) {
    //     let that = this;
    //     const dialogRef = this._matDialog.open(OPBillingComponent,
    //         {
    //             maxWidth: "99vw",
    //             height: '95%',
    //             width: '90%',
    //             data: row
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             that.grid.bindGridData();
    //         }
    //     });
    // }
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

    getSelectedObj(obj) {
        if ((obj.regId ?? 0) > 0) {
            console.log(obj)
            this.vOPIPId = obj.visitId

            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(obj.regId).subscribe((response) => {
                    this.patientDetail = response;
                    console.log(this.patientDetail)
                });

            }, 500);

            // setTimeout(() => {
            //     this._AppointmentlistService.getVisitById(this.vOPIPId).subscribe(data => {
            //         this.patientDetail1 = data;
            //         console.log(data)
            //         console.log(this.patientDetail1)
            //     });
            // }, 1000);
        }
        this.updateRegisteredPatientInfo(obj);
    }

    updateRegisteredPatientInfo(obj) {
        const dialogRef = this._matDialog.open(UpdateRegPatientInfoComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: obj
            });
        dialogRef.afterClosed().subscribe(result => {
            this.searchFormGroup.get('RegId').setValue('');
              this.grid.bindGridData();
        });
      
    }

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
    doctorId: number;
    departmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    phoneAppId: any;
    IsCancelled: any;
    classId: any;
    firstFollowupVisit: any;
    addedBy: any;
    updatedBy: any;
    doctorID: any;
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
            this.consultantDocId = VisitMaster1.consultantDocId || '';
            this.refDocId = VisitMaster1.refDocId || 1;
            this.doctorId = VisitMaster1.doctorId || 1;
            this.departmentId = VisitMaster1.departmentId || 1;
            this.patientOldNew = VisitMaster1.patientOldNew || 0;
            this.phoneAppId = VisitMaster1.phoneAppId || 0
            this.IsCancelled = VisitMaster1.IsCancelled || 0
            this.classId = VisitMaster1.classId || 1;
            this.firstFollowupVisit = VisitMaster1.firstFollowupVisit || "";
            this.addedBy = VisitMaster1.addedBy || 0
            this.updatedBy = VisitMaster1.updatedBy || 0;
            this.doctorID = VisitMaster1.doctorID || 0;
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
    companyId: any;
    tarrifId: any;
    departmentId: any;
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
            this.CountryId = RegInsert.CountryId || 1;
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
            this.companyId = RegInsert.companyId || 0;
            this.tarrifId = RegInsert.tarrifId || 0;
            this.departmentId = RegInsert.departmentId || 0;
        }
    }
}


export class ChargesList {
    ChargesId: number;
    ServiceId: number;
    serviceId: number;
    ServiceName: String;
    Price: any;
    Qty: any;
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
    PackageId: any;
    PackageServiceId: any;
    IsPackage: any;
    PacakgeServiceName: any;
    BillwiseTotalAmt: any;
    DoctorName: any;
    OpdIpdId: any;

    constructor(ChargesList) {
        this.ChargesId = ChargesList.ChargesId || '';
        this.ServiceId = ChargesList.ServiceId || '';
        this.serviceId = ChargesList.serviceId || '';
        this.ServiceName = ChargesList.ServiceName || '';
        this.Price = ChargesList.Price || '';
        this.Qty = ChargesList.Qty || '';
        this.TotalAmt = ChargesList.TotalAmt || '';
        this.DiscPer = ChargesList.DiscPer || '';
        this.DiscAmt = ChargesList.DiscAmt || '';
        this.NetAmount = ChargesList.NetAmount || '';
        this.DoctorId = ChargesList.DoctorId || 0;
        this.DoctorName = ChargesList.DoctorName || '';
        this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
        this.ChargesDate = ChargesList.ChargesDate || '';
        this.IsPathology = ChargesList.IsPathology || '';
        this.IsRadiology = ChargesList.IsRadiology || '';
        this.ClassId = ChargesList.ClassId || 0;
        this.ClassName = ChargesList.ClassName || '';
        this.ChargesAddedName = ChargesList.ChargesAddedName || '';
        this.PackageId = ChargesList.PackageId || 0;
        this.PackageServiceId = ChargesList.PackageServiceId || 0;
        this.IsPackage = ChargesList.IsPackage || 0;
        this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
        this.OpdIpdId = ChargesList.OpdIpdId || '';
    }
} 