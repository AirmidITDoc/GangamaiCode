import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NewCasepaperComponent } from '../new-casepaper/new-casepaper.component';
import { SearchInforObj1 } from '../op-search-list/opd-search-list/opd-search-list.component';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { RegInsert } from '../registration/registration.component';
import { TestingTableComponent } from '../testing-table/testing-table.component';
import { AppointmentBillingComponent } from './appointment-billing/appointment-billing.component';
import { AppointmentlistService } from './appointmentlist.service';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { PatientvitalInformationComponent } from './new-appointment/patientvital-information/patientvital-information.component';
import { UpdateRegPatientInfoComponent } from './update-reg-patient-info/update-reg-patient-info.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
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
    VEMRcount = 0;
    VCheckoutCount = 0;
    VWaitingCount = 0;
    patientDetail = new RegInsert({});
    patientDetail1 = new VisitMaster1({});
    RegId = 0
    autocompletedepartment: string = "Department";

    vOPIPId = 0;
    f_name: any = ""
    regNo=0;
    l_name: any = ""
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
        // this.menuActions.push("Report Record");
        this.Appointdetail(this.gridConfig)

        // to disable checkin button after refresh the page 
        const savedTimers = localStorage.getItem('consultTimers');
        if (savedTimers) {
            this.timers = JSON.parse(savedTimers); //Restore saved check-in/out data

            Object.keys(this.timers).forEach(patientId => {
                const timer = this.timers[patientId];

                if (timer.isCheckedIn && !timer.isCheckedOut) {
                    const startTime = timer.startTime;
                    timer.timerInterval = setInterval(() => {
                        this.timers[patientId].elapsedTime = Date.now() - startTime;
                    }, 1000);
                }
            });
        }
    }

    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals }

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

    allcolumns = [
        { heading: "", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "phoneAppId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "crossConsulFlag", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "UHID", key: "regNoWithPrefix", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Date", key: "vistDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Check-InTime", key: "checkInTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
        { heading: "Check-OutTime", key: "checkOutTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
        {
            heading: "Action", key: "action", align: "right", width: 280, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        apiUrl: "VisitDetail/AppVisitList",
        columnsList: this.allcolumns,
        sortField: "VisitId",
        sortOrder: 0,
        filters: this.allfilters
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[5].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }

    OnClearValues() {
        this.myformSearch.reset();
    }
    onChangeFirst() {

        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value
        this.getfilterdata();

    }
    onChangeFirst1(event) {
debugger
        console.log(event)
        // if (event.key == 13) {
            this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
            this.f_name = this.myformSearch.get('FirstName').value + "%"
            this.l_name = this.myformSearch.get('LastName').value + "%"
            this.regNo = this.myformSearch.get('RegNo').value
            this.getfilterdata();
        // }
    }

    getfilterdata() {
debugger
        this.gridConfig = {
            apiUrl: "VisitDetail/AppVisitList",
            columnsList: this.allcolumns,
            sortField: "VisitId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue: String(this.DoctorId), opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }


    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")

        this.onChangeFirst();
    }

    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    selectChangedepartment(obj: any) {
        if (!obj?.value || obj.value === 0) {
            this.ddlDoctor.options = [];
            return;
        }
        this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
            this.ddlDoctor.options = data;
            console.log(data);
            this.ddlDoctor.bindGridAutoComplete();
        });
    }

    ListView(value) {

        const departmentId = this.myformSearch.get('departmentId')?.value;
        if (!departmentId || departmentId === "0" || departmentId === 0) {
            this.ddlDoctor.options = [];
            this.toastr.warning("Please select a Department First.", "warning");
            this.DoctorId = "0";
            return;
        }
        console.log(value)
        if (value.value !== 0)
            this.DoctorId = value.value
        else
            this.DoctorId = "0"

        this.onChangeFirst();
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

    // raksha date:19/6/25
    // if patient date & system date is diff then hide field
    isTodayAppointment(appointmentDate: string): boolean {
        const today = new Date();
        const todayDay = today.getDate().toString().padStart(2, '0');
        const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        const todayYear = today.getFullYear().toString();

        const [visitDay, visitMonth, visitYear] = appointmentDate.split('/');

        return (
            visitDay === todayDay &&
            visitMonth === todayMonth &&
            visitYear === todayYear
        );
    }
    shouldDisableMenuItem(action: string, element: any): boolean {
        if (action === 'Update Referred Doctor') {
            return !this.isTodayAppointment(element.dVisitDate);
        }
        if (action === 'Update Consultant Doctor') {
            return element.mPbillNo !== '0';
        }
        return false; // show all other menu items
    }

    // 
    OngetRecord(element, m) {
        console.log('Third action clicked for:', element);
        if (m == "Update Consultant Doctor") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            let that = this;
            const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
                {
                    maxWidth: "90vw",
                    height: "430px",
                    width: "80%",
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
                    height: "430px",
                    width: "80%",
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
        let that = this;
        console.log("Row Selected Appointment Page : ", this.advanceDataStored.storage)
        const dialogRef = this._matDialog.open(AppointmentBillingComponent, {
            maxWidth: "99vw",
            height: "98vh",
            width: "100%",
            data: row

        });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
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
                maxWidth: "90vw",
                height: "430px",
                width: "80%",
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
                // maxWidth: '95%',
                // height: '48%',
                maxWidth: "95vw",
                maxHeight: '80%',
                width: '90%',
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
        this.VEMRcount = 0;
        this.VCheckoutCount = 0;
        this.VWaitingCount = 0;
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

            // setTimeout(() => {
            //     this._AppointmentlistService.getRegistraionById(obj.regId).subscribe((response) => {
            //         this.patientDetail = response;
            //         console.log(this.patientDetail)
            //     });

            // }, 500);

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

    getSelectedRow(row: any): void {
        console.log("Selected row : ", row);
    }
    updateRegisteredPatientInfo(obj) {
        const dialogRef = this._matDialog.open(NewAppointmentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: {
                    Obj: obj,
                    FormName: "Registration-Dropdown"
                },
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



    checkIn: Date | null = null;
    checkOut: Date | null = null;
    isCheckedIn = false;
    isCheckedOut = false;
    startTime: number = 0;
    elapsedTime: number = 0;
    timers: { [patientId: number]: any } = {}; //it will store timer entry of each patient using there id

    saveTimersToLocalStorage() {
        const toSave = { ...this.timers };
        Object.keys(toSave).forEach(id => {
            if (toSave[id].timerInterval) {
                delete toSave[id].timerInterval;
            }
        });
        localStorage.setItem('consultTimers', JSON.stringify(toSave));
    }

    onCheckIn(patientId: number) {
        const checkInTime = new Date(); //Store current time
        const startTime = Date.now();

        // Save this data in timers[patientId]
        this.timers[patientId] = {
            isCheckedIn: true,
            isCheckedOut: false,
            checkIn: checkInTime,
            startTime: startTime,
            elapsedTime: 0,

            // Start a timer that updates elapsedTime every second
            timerInterval: setInterval(() => {
                this.timers[patientId].elapsedTime = Date.now() - startTime;
            }, 1000)
        };
        // Save to localStorage
        this.saveTimersToLocalStorage();
        const patientTimer = this.timers[patientId];
        //  const formattedTime = patientTimer.checkIn.toLocaleTimeString('en-GB', {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     second: '2-digit',
        //     hour12: false
        // });
        var data = {
            "visitId": patientId,
            "conStartTime": patientTimer.checkIn?.toLocaleTimeString() //"10:00:00AM"
        }
        console.log("CheckIn:", data)
        this._AppointmentlistService.updateStartTime(data).subscribe(response => {
            this.grid.bindGridData();
        });
    }

    onCheckOut(patientId: number) {
        const patientTimer = this.timers[patientId];
        if (!patientTimer) return;

        clearInterval(patientTimer.timerInterval); //Stop the timer

        patientTimer.isCheckedIn = false; // Mark as checked out
        patientTimer.isCheckedOut = true; // Mark as checked out
        patientTimer.checkOut = new Date(); //Capture the check-out time

        const totalTime = patientTimer.elapsedTime; //it tells total time taken by patient

        //Save updated timer state to localStorage
        this.saveTimersToLocalStorage();
        var data = {
            "visitId": patientId,
            "conEndTime": patientTimer.checkOut?.toLocaleTimeString(),
            "checkOutTime": patientTimer.checkOut?.toLocaleTimeString()
        }
        console.log("CheckOut:", data)
        this._AppointmentlistService.updateEndTime(data).subscribe(response => {
            this.grid.bindGridData();
        });

        console.log('Patient ID:', patientId);
        console.log('Check In:', patientTimer.checkIn?.toLocaleTimeString());
        console.log('Check Out:', patientTimer.checkOut?.toLocaleTimeString());
        console.log('Total Time:', new Date(totalTime).toISOString().substr(11, 8));
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