import { DatePipe } from '@angular/common';
import { Component, HostBinding, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AirmidCardViewComponent } from 'app/main/shared/componets/airmid-card-view/airmid-card-view.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SearchInforObj1 } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { NewRegistrationComponent } from '../../registration/new-registration/new-registration.component';
import { TestingTableComponent } from '../../testing-table/testing-table.component';
import { AppointmentBillingComponent } from '../appointment-billing/appointment-billing.component';
import { VisitMaster1 } from '../appointment-list.component';
import { AppointmentlistService } from '../appointmentlist.service';
import { CrossConsultationComponent } from '../cross-consultation/cross-consultation.component';
import { EditConsultantDoctorComponent } from '../edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefranceDoctorComponent } from '../edit-refrance-doctor/edit-refrance-doctor.component';
import { NewAppointmentComponent } from '../new-appointment/new-appointment.component';
import { PatientvitalInformationComponent } from '../new-appointment/patientvital-information/patientvital-information.component';

@Component({
    selector: 'app-apointment-cardview',
    templateUrl: './apointment-cardview.component.html',
    styleUrls: ['./apointment-cardview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApointmentCardviewComponent {
    @HostBinding('style.display') display = 'flex';
    @HostBinding('style.flex') flex = '1 1 auto';
    @HostBinding('style.minHeight') minH = '0';
    @HostBinding('style.flexDirection') dir = 'column';

    myuserform: FormGroup;
    myformSearch: FormGroup;
    searchFormGroup: FormGroup;
    mNo: any;
    f_name: any = "%"
    regNo = 0;
    l_name: any = "%"
    IsMark = "2"
    vOPIPId = 0;
    IsShowGrid: boolean = false;
    id: string;
    mode: string;

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    vEMRReady = 0;
    VCrossConscount = 0;
    VEMRcount = 0;
    VCheckoutCount = 0;
    VWaitingCount = 0;

    menuActions: Array<{ icon: string, text: string }> = [];
    ngOnInit(): void {
        this.myuserform = this.filterForm();
        this.myformSearch = this.filterForm();
        this.searchFormGroup = this.createSearchForm();


        this.menuActions.push({ icon: "local_hospital", text: "Update Consultant Doctor" });
        this.menuActions.push({ icon: "people_outline", text: "Update Referred Doctor" });
        this.menuActions.push({ icon: "language", text: "Request For IP" });

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

        // debugger
        this.GetAppointdetail()
        if (this._ActRoute.url == '/opd/appointment') {
            this.id = this.route.snapshot.queryParamMap.get('Id');
            this.mode = this.route.snapshot.queryParamMap.get('Mode');
            if (this.mode == "Bill" && Number(this.id) > 0) {
                this.gridConfig.filters.find(x => x.fieldName == "Id").fieldValue = this.id;
            }
            this.IsShowGrid = true;
        }
        this.id = this.route.snapshot.queryParamMap.get('Id');
        this.mode = this.route.snapshot.queryParamMap.get('Mode');
        if (this.mode == "Bill" && Number(this.id) > 0) {
            this.gridConfig.filters.find(x => x.fieldName == "visitId").fieldValue = this.id;
        }
        this.IsShowGrid = true;
    }

    handleNotificationEvent(data) {
        if (this.mode == "Bill" && Number(this.id) > 0) {
            this.OnBillPayment(data[0]);
        }
    }

    // Card view config and pagination
    pageSize = 25;
    resultsLength = 0;
    autocompletedepartment: string = "Department";
    statusOptions = [
        { text: 'All', value: '' },
        { text: 'IsActive', value: '1' },
        { text: 'IsDeactive', value: '0' }
    ];

    // Add view mode and user data for card view
    viewMode: 'table' | 'card' = 'table';
    userList: any[] = [];


    cardConfig = {
        fields: [
            { label: 'First Name', key: 'firstName' },
            { label: 'Last Name', key: 'lastName' },
            { label: 'UHID', key: 'regNoWithPrefix' },
            { label: 'OPDNo', key: 'opdNo' },
            { label: 'DepartmentName', key: 'departmentName' },
            { label: 'Doctor Name', key: 'doctorname' },
            { label: 'MobileNo', key: 'mobileNo' },
            { label: 'PatientType', key: 'patientType' },
            { label: 'RefDocName', key: 'refDocName' },
            { label: 'Is Active', key: 'isActive' }
        ],
        actions: [
            { icon: 'remove_red_eye', tooltip: 'View Password', action: 'viewPassword' },
            { icon: 'edit', tooltip: 'Edit', action: 'edit' },
            { icon: 'delete', tooltip: 'Delete', action: 'delete' }
        ]
    };

    constructor(private _formBuilder: UntypedFormBuilder, public datePipe: DatePipe, public _AppointmentlistService: AppointmentlistService,
        public _matDialog: MatDialog, public toastr: ToastrService, private _FormvalidationserviceService: FormvalidationserviceService,
        private commonService: PrintserviceService,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: FormBuilder,
        private _ActRoute: Router, private route: ActivatedRoute,) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild(AirmidCardViewComponent) cardView: AirmidCardViewComponent;

    ngAfterViewInit() {
        // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'doctorID')!.template = this.docIcon;

        this.gridConfig.columnsList.find(col => col.key === 'patientOldNew')!.template = this.actionsTemplateptype;
        this.gridConfig.columnsList.find(col => col.key === 'mPbillNo')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'phoneAppId')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'crossConsulFlag')!.template = this.actionsTemplate3;
        this.gridConfig.columnsList.find(col => col.key === 'isConvertRequestForIp')!.template = this.actionsTemplate4;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
    @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;
    @ViewChild('actionsTemplateptype') actionsTemplateptype!: TemplateRef<any>;



    // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    // @ViewChild('docIcon') docIcon!: TemplateRef<any>;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    DoctorId = "0";
    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals }

    ];
    allcolumns = [
        { heading: "", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "phoneAppId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "crossConsulFlag", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "isConvertRequestForIp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "UHID", key: "regNoWithPrefix", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Date", key: "vistDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 230 },

        { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Check-InTime", key: "checkInTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
        { heading: "Check-OutTime", key: "checkOutTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
        {
            heading: "Action", key: "action", align: "center", width: 150
            , sticky: true, type: gridColumnTypes.template,
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



    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: [''],
            LastName: [''],
            DoctorId: [0],
            departmentId: [0],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            IsMark: ['2']
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
    // ..card view
    onAfterLoadData(data: any[]) {
        console.log(data)
        this.userList = data;//thia.dataSource
        this.resultsLength = data.length;
    }

    onCardAction(event: { action: string, item: any }) {
        if (event.action === 'viewPassword') {
            // this.PasswordView(event.item);
        } else if (event.action === 'edit') {
            this.onEdit(event.item);
        } else if (event.action === 'delete') {
        }
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

    onChangeFirst() {

        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value
        this.getfilterdata();

    }
    onChangeFirst1(event) {

        console.log(event)
        // if (event.key == 13) {
        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value
        this.IsMark = this.myformSearch.get('IsMark').value
        this.getfilterdata();
        // }
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

        this.onChangeFirst1(event);
    }

    // onChangeFirst1(event) {

    //   console.log(event)
    //   // if (event.key == 13) {
    //   this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    //   this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
    //   this.f_name = this.myformSearch.get('FirstName').value + "%"
    //   this.l_name = this.myformSearch.get('LastName').value + "%"
    //   this.regNo = this.myformSearch.get('RegNo').value
    //   this.IsMark = this.myformSearch.get('IsMark').value
    //   this.getfilterdata();
    //   // }
    // }

    getfilterdata() {
        // debugger
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
                { fieldName: "IsMark", fieldValue: this.IsMark, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        this.GetAppointdetail();
        // / Update grid based on current view mode
        if (this.viewMode === 'table' && this.grid) {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        } else if (this.viewMode === 'card' && this.cardView) {
            this.cardView.gridConfig = this.gridConfig;
            this.cardView.bindGridData();
        }
    }
    dataSource = new MatTableDataSource<VisitMaster1>();
    GetAppointdetail() {

        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")

        const data =
        {
            "first": 0,
            "rows": 150,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "F_Name",
                    "fieldValue": String(this.f_name),
                    "opType": "Contains"
                },
                {
                    "fieldName": "L_Name",
                    "fieldValue": String(this.l_name),
                    "opType": "Contains"
                },
                {
                    "fieldName": "Reg_No",
                    "fieldValue": String(this.regNo),
                    "opType": "Equals"
                },
                {
                    "fieldName": "Doctor_Id",
                    "fieldValue": String(this.DoctorId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "From_Dt",
                    "fieldValue": this.fromDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "To_Dt",
                    "fieldValue": this.toDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "IsMark",
                    "fieldValue": "2",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        }
        console.log(data)
        this._AppointmentlistService.getVisitlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            if (this.dataSource.data.length > 0) {
                this.Vtotalcount = this.dataSource.data.length
                this.vEMRReady = 0;
                this.dataSource.data.forEach(element => {
                    if (element.patientOldNew == 1) {
                        this.VNewcount = this.VNewcount + 1;
                    }
                    else if (element.patientOldNew == 2) {
                        this.VFollowupcount = this.VFollowupcount + 1;
                    }

                    if (element.mPbillNo == 1 || element.mPbillNo == 2) {
                        this.VBillcount = this.VBillcount + 1;
                    }
                    if (element.crossConsulFlag == 1) {
                        this.VCrossConscount = this.VCrossConscount + 1;
                    }
                    if (element.emrReady == 1) {
                        this.vEMRReady++;
                    }
                });
                console.log(this.dataSource.data)
            }
        });
    }

    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (that.viewMode === 'table' && that.grid) {
                    that.grid.bindGridData();
                } else if (that.viewMode === 'card' && that.cardView) {
                    that.cardView.bindGridData();
                }
            }
        });
    }

    OngetRecord(element, m) {
        console.log('Third action clicked for:', element);
        if (m == "Update Consultant Doctor") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button

            const that = this;
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

            const that = this;
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

            const that = this;
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
        else if (m == "Request For IP") {
            Swal.fire({
                title: 'Do you want to convert OP to IP?',
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then((flag) => {
                if (flag.isConfirmed) {
                    const Convert = {
                        "visitId": element.visitId,
                        "isConvertRequestForIp": true
                    }
                    this._AppointmentlistService.converOPtoIP(Convert).subscribe((response: any) => {
                        this.grid.bindGridData();
                    });
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
        const that = this;
        console.log("Row Selected Appointment Page : ", this.advanceDataStored.storage)
        const dialogRef = this._matDialog.open(AppointmentBillingComponent, {
            maxWidth: "99vw",
            height: "98vh",
            width: "100%",
            data: row

        });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.GetAppointdetail()
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
        if (action === 'Request For IP') {
            return element.isConvertRequestForIp == true;
        }
        return false; // show all other menu items
    }


    OnNewCrossConsultation(element) {
        console.log('Third action clicked for:', element);
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        console.log(element)
        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: "90vw",
                height: "430px",
                width: "80%",
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
            this.GetAppointdetail()
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
        this.commonService.Onprint("VisitId", element.visitId, "OPStickerPrint");
    }

    OnWhatsAppAppointmentSend(element) {
        console.log('Third action clicked for:', element);
    }

    AppointmentCancle(contact) {
        Swal.fire({
            title: 'Do you want to Cancle Appointment',
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
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

    oncardView(obj) {
        const dialogRef = this._matDialog.open(ApointmentCardviewComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
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
        const data = {
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
        const data = {
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
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewAppointmentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
            this.GetAppointdetail()
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

    Password: string;

    // PasswordView(contact) {

    //   const today = new Date();
    //   const Currentyear = today.getFullYear()
    //   this.Password = (contact.userLoginName + "@" + Currentyear)
    //   Swal.fire({
    //     title: 'Your Password is ' + contact.password,
    //     text: "Do you want to reset Your Password",
    //     icon: "success",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Reset Password"
    //   }).then((flag) => {
    //     if (flag.isConfirmed) {
    //       let submitData = {
    //         "userId": contact.userId,
    //         "userName": contact.userLoginName,
    //         "password": this.Password
    //       }
    //       console.log(submitData);

    //       this._CreateUserService.PasswordUpdate(submitData).subscribe(
    //         (response) => {
    //           this.toastr.success(response.message);
    //           if (this.viewMode === 'table' && this.grid) {
    //             this.grid.bindGridData();
    //           } else if (this.viewMode === 'card' && this.cardView) {
    //             this.cardView.bindGridData();
    //           }
    //         });
    //     }
    //   });
    // }
}

