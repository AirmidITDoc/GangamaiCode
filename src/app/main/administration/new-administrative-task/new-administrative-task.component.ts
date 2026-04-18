import { DatePipe } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Bill } from 'app/main/ipd/ip-search-list/ip-billing/ip-billing.component';
import { AdvanceDetail, Payment } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdministrationService } from '../administration.service';
import { BillDateUpdateComponent } from '../cancellation/bill-date-update/bill-date-update.component';
import { EditPaymentComponent } from '../paymentmodechanges/edit-payment/edit-payment.component';

@Component({
    selector: 'app-new-administrative-task',
    templateUrl: './new-administrative-task.component.html',
    styleUrls: ['./new-administrative-task.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewAdministrativeTaskComponent {

    @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;
    @ViewChild('Billdate') Billdate!: TemplateRef<any>;
    @ViewChild('visitTable') visitTable!: TemplateRef<any>;
 @ViewChild('admissionCancle') admissionCancle!: TemplateRef<any>;

    


    myForm: FormGroup;
    VisitForm: FormGroup;
    vRegNo: any = "0";
    vPatientName: any;
    vAdmissionDate: any;
    vMobileNo: any;
    vIPDNo: any;
    vTariffName: any;
    vCompanyName: any;
    vDoctorName: any;
    vRoomName: any;
    vBedName: any;
    vAge: any;
    vGenderName: any;
    vAdmissionTime: any;
    vAgeMonth: any;
    vAgeDay: any;
    vDepartment: any;
    vRefDocName: any;
    vPatientType: any;
    vDOA: any;
    vAdmissionID: any;
    vClassId: any;
    AdmissionId: any
    vRegId: any
    vbillNo: any
    FBillNo = 0
    OPIPType = 1
    //
    AdmissionTaskForm: FormGroup
    date: any;
    dateTimeString: any;
    isTimeChanged: boolean = false;
    dateLabel: string = 'Admission Date';
    timeLabel: string = 'Admission Time';
    dateLabel1: string = 'Visit Date';
    timeLabel1: string = 'Visit Time';
    VistId = 0
    isDatePckrDisabled: boolean = false;



    displayedColumns: string[] = [
        // 'action1',
        'VisitDateTime',
        'OPDNo',
        'DoctorName',
        'action'
    ];

    displayedColumns5: string[] = [
        // 'action1',
        'IsBillGenerated',
        'IsDischarged',
        'VisitDateTime',
        'RegID',
        'DoctorName',
        'IPDNo',
        'DischargeDateTime',
        'action'
    ];


    displayedColumns1: string[] = [
        'IsCancelled',
        'billDate',
        'pbillNo',
        'totalAmt',
        'netPayableAmt',

        'action'
    ];


    displayedColumns2: string[] = [
        'IsCancelled',
        'paymentDate',
        'ReceiptNo',
        'AdvanceUsedAmount',
        'CashPayAmount',
        'ChequePayAmount',
        'CardPayAmount',
        'OnlineAmount',
        'action'
    ];


    displayedColumns3: string[] = [
        // 'action1',
        // 'PatientTypeId',
        'Date',
        'AdvanceAmount',
        'AdvanceusedAmount',
        'BalanceAmount',
        'Reason',
        'action'
    ];

    displayedColumns4: string[] = [
        'RefundTime',
        'RefundNo',
        'RefundAmount',
        'Remark',

        'action'
    ];

    dataSource = new MatTableDataSource<VisitAdmissionList>();
    dataSource1 = new MatTableDataSource<VisitAdmissionList>();

    dataSourceBill = new MatTableDataSource<Bill>();
    dataSourcepayment = new MatTableDataSource<Payment>();
    dataSourceAdvance = new MatTableDataSource<AdvanceDetail>();
    dataSourceRefund = new MatTableDataSource<RefundBillMaster>();


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    constructor(

        public _AdministrativetaskService: AdministrationService,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        private formBuilder: FormBuilder,
        private advanceDataStored: AdvanceDataStored,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe, private _fuseSidebarService: FuseSidebarService,
    ) {
        setInterval(() => {
            this.now = new Date();
            this.dateTimeString = this.now.toLocaleString("en-US").split(',');
            if (!this.isTimeChanged) {
                this.AdmissionTaskForm.get('AdmissionTime').setValue(this.now);

            }
        }, 1);

        setInterval(() => {
            this.now = new Date();
            this.dateTimeString = this.now.toLocaleString("en-US").split(',');
            if (!this.isTimeChanged) {
                this.VisitForm.get('VisitTime').setValue(this.now);

            }
        }, 1);
    }
    opiptype = true
    ngOnInit(): void {

        this.myForm = this.createMyForm();
        this.myForm.markAllAsTouched();


        this.VisitForm = this.createVisitForm();
        this.VisitForm.markAllAsTouched();

        this.AdmissionTaskForm = this.CreateAdmissionForm()
        this.AdmissionTaskForm.get('RegID').setValue('');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.date = now.toISOString().slice(0, 16);

    }


    CreateAdmissionForm() {
        return this.formBuilder.group({
            RegID: '',
            Op_ip_id: '1',
            // IsDischargedit: 0, 
            // IsIPDnoEdit: 0,
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            AdmissionTime: [''],
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            NewIpdNo: ['', Validators.required],
            Reason:['']
        });
    }

    createVisitForm() {
        return this.formBuilder.group({
            // RegID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            VisitId: 0,
            VisitDate: [(new Date()).toISOString()],
            VisitTime: [''],
        })
    }

    createMyForm() {
        return this.formBuilder.group({
            RegID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opiptype: ['1'],
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }

    onChangeRadio(event) {


        if (this.myForm.get('opiptype').value == "0") {
            this.opiptype = false
            this.OPIPType = 0
            this.myForm.get('RegID').setValue('')
            this.dataSource.data = []
            this.dataSource1.data = []
            this.dataSourceBill.data = []
            this.dataSourcepayment.data = []

        }
        else {
            this.opiptype = true
            this.OPIPType = 1
            this.myForm.get('RegID').setValue('')
            this.dataSource.data = []
            this.dataSource1.data = []
            this.dataSourceBill.data = []
            this.dataSourcepayment.data = []
        }
    }

    getOpPatientdata() {

        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "RegId",
                    "fieldValue": String(this.vRegId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": String(this.OPIPType),
                    "opType": "Equals"
                }
            ],
            "mode": "Admin_Visitlist"
        }

        console.log(SelectQuery);

        this._AdministrativetaskService.getPatientListOP(SelectQuery).subscribe(Visit => {
            console.log(Visit)
            if (Visit) {
                if (!this.OPIPType) {
                    this.dataSource.data = Visit as VisitAdmissionList[];
                    this.VistId = this.dataSource.data[0].VisAdmId
                }
                else {
                    this.dataSource1.data = Visit as VisitAdmissionList[];
                    console.log(this.dataSource1.data)
                    this.VistId = this.dataSource1.data[0].VisAdmId
                    if (this.VistId > 0) {
                        this.GetRefundData()
                        this.GetAdvanceData()
                    }
                }


            }
        });
    }


    GetBillData() {
        // if (element.VisitId)
        //       this.VistId = element.VisitId
        //     else
        //       this.VistId = element.AdmissionID


        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "VisitId",
                    "fieldValue": String(this.VistId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": String(this.OPIPType),
                    "opType": "Equals"
                }
            ],
            "mode": "Admin_VisitWiseBilllist"
        }

        console.log(SelectQuery);
        this._AdministrativetaskService.getBillDetailList(SelectQuery).subscribe(data => {
            this.dataSourceBill.data = data as Bill[];
            console.log(this.dataSourceBill.data)

        });
    }


    GetPaymentData(element) {

        this.FBillNo = element
        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "BillNo",
                    "fieldValue": String(element),
                    "opType": "Equals"
                }
            ],
            "mode": "Admin_VisitBillWisePaymentlist"
        }

        console.log(SelectQuery);
        this._AdministrativetaskService.getPaymentDetailList(SelectQuery).subscribe(data => {
            this.dataSourcepayment.data = data as Payment[];
            console.log(this.dataSourcepayment.data)

        });
    }

    GetRefundData() {


        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "VisitId",
                    "fieldValue": String(this.VistId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": String(this.OPIPType),
                    "opType": "Equals"
                }
            ],
            "mode": "Admin_VisitRefundBillWiselist"
        }

        console.log(SelectQuery);

        this._AdministrativetaskService.getBillRefundDetailList(SelectQuery).subscribe(data => {
            console.log(data)
            this.dataSourceRefund.data = data as RefundBillMaster[];
            console.log(this.dataSourceRefund.data)

        });
    }

    GetAdvanceData() {


        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "VisitId",
                    "fieldValue": String(this.VistId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": String(this.OPIPType),
                    "opType": "Equals"
                }
            ],
            "mode": "Admin_VisitAdvanceWiselist"
        }

        console.log(SelectQuery);

        this._AdministrativetaskService.getAdvanceList(SelectQuery).subscribe(data => {
            this.dataSourceAdvance.data = data as AdvanceDetail[];
            console.log(this.dataSourceBill.data)

        });
    }


    DischargeCancel(contact) {

        Swal.fire({
            title: 'Do you want to cancel the Discharge ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const SubmitDate = {
                    "admissionID": contact.VisAdmId
                }
                console.log(SubmitDate)
                this._AdministrativetaskService.SaveDischargeCancel(SubmitDate).subscribe(response => {
                    this._matDialog.closeAll()
                    if (response)
                        this.getOpPatientdata()
                });
            }
        })
    }

    AdmissionCancle() {

        Swal.fire({
            title: 'Do you want to cancel the Admission ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const SubmitDate = {
                    "admissionId": this.AdmissionId,
                    "isCancelledBy":this._loggedService.currentUserValue.userId,
                    "isCancelledDateTime":this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd"),
                   "isCancelled": 1,

                }
                console.log(SubmitDate)
                this._AdministrativetaskService.AdmissionCancel(SubmitDate).subscribe(response => {
                    this._matDialog.closeAll()
                });
            }
        })
    }

    OnopenVisitDateUpdate(contact) {

        this.vIPDNo = contact.IPDNo
        this.AdmissionId = contact.VisAdmId

        this.VisitForm.get('VisitDate').setValue(contact.VisAdmTime);
        this._matDialog.open(this.visitTable, {
            maxHeight: "55vh",
            maxWidth: '90vh',

        })
        this.getOpPatientdata()
    }


    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    resultsLength = 0;

    BillCancle(contact) {

        if (this.myForm.get('opiptype').value == "0")
            this.BillCancelOP(contact)
        else
            this.BillCancelIP(contact)
    }

    BillCancelOP(contact) {
        console.log("Data:", contact)
        Swal.fire({
            title: 'Do you want to cancel the Final Bill ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((result) => {

            if (result.isConfirmed) {
                const SubmitDate = {
                    "billNo": contact.BillNo || 0
                }

                console.log("Json:", SubmitDate)
                this._AdministrativetaskService.OpCancelBill(SubmitDate).subscribe(response => {
                    this._matDialog.closeAll()
                });
            }
        })

    }

    BillCancelIP(contact) {

        console.log("Data:", contact)
        Swal.fire({
            title: 'Do you want to cancel the Final Bill ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((result) => {

            if (result.isConfirmed) {
                const SubmitDate = {
                    "billNo": contact.BillNo || 0
                }

                console.log("Json:", SubmitDate)
                this._AdministrativetaskService.IpCancelBill(SubmitDate).subscribe(response => {
                    this._matDialog.closeAll()
                });
            }
        })

    }

    CancelAdvance(contact) {
        console.log("Data:", contact)

        Swal.fire({
            title: 'Do you want to cancel the Advance',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((result) => {

            if (result.isConfirmed) {
                const SubmitDate = {
                    "advanceId": contact.advanceId || 0,
                    "advanceDetailId": contact.advanceDetailID || 0,
                    "addedBy": contact.addedBy || 0,
                    "advanceAmount": contact.advanceAmount || 0
                }

                console.log(SubmitDate)
                this._AdministrativetaskService.SaveCancelAdvance(SubmitDate).subscribe(response => {
                    //  this.grid1.bindGridData();
                });
            }
        })

    }
    //All common

    // Billdateupdate(row) {
    //   const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    //   buttonElement.blur(); // Remove focus from the button
    //   console.log(row)
    //   let that = this;
    //   const dialogRef = this._matDialog.open(BillDateUpdateComponent,
    //     {
    //       maxHeight: "35vh",
    //       maxWidth: '90vh',
    //       width: '100%',
    //       data: {
    //         data: row,
    //         Id: 4
    //       }
    //     });
    //   dialogRef.afterClosed().subscribe(result => {

    //   });
    // }


    onEdit(row) {
        console.log(row)
        const dialogRef = this._matDialog.open(EditPaymentComponent,
            {
                height: "99%",
                width: '80%',
                data: {
                    registerObj: row,
                    FromName: "IP-PaymentModeChange"
                },

            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            // this.grid.bindGridData();

        });
    }
    registerObj = new RegInsert({});

    getSelectedObj(obj) {
        console.log(obj)
        this.vRegId = obj.value;
        this.vRegNo = obj.regNo
        this.vPatientName = obj.patientName
        this.vAge = obj.ageYear
        this.vAgeMonth = obj.ageMonth
        this.vAgeDay = obj.ageDay
        this.registerObj = obj
        this.getOpPatientdata()

    }


    //Admission task
    public now: Date = new Date();
    OnAdmDateTimeUpdate() {

        Swal.fire({
            title: 'Do you want to Update Admission Date & Time ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                debugger
                const formattedDate = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd");
                const formattedTime = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionTime').value, "HH:mm:ss");
                this.AdmissionTaskForm.get('AdmissionDate').setValue(formattedDate);
                const Admissiontime = formattedDate + ' ' + formattedTime


                if (!this.AdmissionTaskForm.invalid) {
                    const data = {
                        'admissionID': this.AdmissionId,
                        'admissionDate': formattedDate,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd"),
                        'admissionTime': Admissiontime,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionTime').value, 'yyyy-MM-dd HH:mm'),
                        'ipdno': this.AdmissionTaskForm.get('NewIpdNo').value
                    }
                    console.log(data);
                    this._AdministrativetaskService.getDateTimeChange(data).subscribe(response => {
                        if (response) {
                            this._matDialog.closeAll();
                            this.getOpPatientdata()
                        }
                    });
                } else {
                    const invalidFields = [];

                    if (this.AdmissionTaskForm.invalid) {
                        for (const controlName in this.AdmissionTaskForm.controls) {
                            if (this.AdmissionTaskForm.controls[controlName].invalid) {
                                invalidFields.push(`Admission Form: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                            );
                        });
                    }
                }
            }
        });

    }


    onChangeDate(value) {
        if (value) {
            const dateOfReg = new Date(value);
            const splitDate = dateOfReg.toLocaleString("en-US").split(',');
            const splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US").split(',');
            this.eventEmitForParent(splitDate[0], splitTime[1]);
        }
    }
    onChangeTime(event) {
        if (event) {
            const selectedDate = new Date(this.AdmissionTaskForm.get('AdmissionDate').value);
            const splitDate = selectedDate.toLocaleString("en-US").split(',');
            const splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US").split(',');
            this.isTimeChanged = true;
            this.eventEmitForParent(splitDate[0], splitTime[1]);
        }
    }

    eventEmitForParent(actualDate, actualTime) {
        const localaDateValues = actualDate.split('/');
        const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
        // this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
    }
    @Input() isDisableFuture: boolean = false;
    myFilter = (d: Date | null): boolean => {
        return this.isDisableFuture ? d <= new Date() : true;
    };

    
    openAdmissiontask(contact): void {

        this.vIPDNo = contact.IPDNo
        this.AdmissionId = contact.VisAdmId

        this.AdmissionTaskForm.get('NewIpdNo').setValue(contact.IPDNo);
        this.AdmissionTaskForm.get('AdmissionDate').setValue(contact.VisAdmTime);
        // this.AdmissionTaskForm.get('AdmissionTime').setValue(contact.AdmissionDate,"HH:mm:ss")

        this._matDialog.open(this.serviceTable, {
            maxHeight: "55vh",
            maxWidth: '90vh',

        })
        this.getOpPatientdata()
    }


       openAdmissioncancletask(contact): void {

        this.vIPDNo = contact.IPDNo
        this.AdmissionId = contact.VisAdmId

        this.AdmissionTaskForm.get('NewIpdNo').setValue(contact.IPDNo);
        this.AdmissionTaskForm.get('AdmissionDate').setValue(contact.VisAdmTime);
        // this.AdmissionTaskForm.get('AdmissionTime').setValue(contact.AdmissionDate,"HH:mm:ss");


        this._matDialog.open(this.admissionCancle, {
            maxHeight: "55vh",
            maxWidth: '90vh',

        })
        this.getOpPatientdata()
    }


    onChangeDate1(value) {
        if (value) {
            const dateOfReg = new Date(value);
            const splitDate = dateOfReg.toLocaleString("en-US").split(',');
            const splitTime = this.VisitForm.get('VisitTime').value.toLocaleString("en-US").split(',');
            this.eventEmitForParent(splitDate[0], splitTime[1]);
        }
    }
    onChangeTime1(event) {
        if (event) {
            const selectedDate = new Date(this.VisitForm.get('VisitDate').value);
            const splitDate = selectedDate.toLocaleString("en-US").split(',');
            const splitTime = this.VisitForm.get('VisitTime').value.toLocaleString("en-US").split(',');
            this.isTimeChanged = true;
            this.eventEmitForParent(splitDate[0], splitTime[1]);
        }
    }


    OnVisitDateTimeUpdate(contact) {
        Swal.fire({
            title: 'Do you want to Update Visit Date & Time ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const formattedDate = this.datePipe.transform(this.VisitForm.get('VisitDate').value, "yyyy-MM-dd");
                const formattedTime = this.datePipe.transform(this.VisitForm.get('VisitTime').value, "HH:mm:ss");

                // const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
                this.VisitForm.get('VisitDate').setValue(formattedDate);
                const VisitTime = formattedDate + ' ' + formattedTime

                const data2 = {
                    "visitId": this.VistId,
                    "visitDate": formattedDate,// this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                    "visitTime": VisitTime//formattedDate + this.dateTimeObj.time

                }

                console.log(data2);
                this._AdministrativetaskService.geVisittDateTimeChange(data2).subscribe(response => {
                    if (response) {
                        this._matDialog.closeAll();
                        this.getOpPatientdata()
                    }
                });
            }
        });
    }

    OnRefundUpdate(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        console.log(row)

        const dialogRef = this._matDialog.open(BillDateUpdateComponent,
            {
                maxHeight: "35vh",
                maxWidth: '90vh',
                width: '100%',
                data: {
                    data: row,
                    Id: 4
                }
            });
        dialogRef.afterClosed().subscribe(result => {

        });
    }
    //Bill Date Update
    //  this.SalesDate = this.data.data.date
    BillNo: any;
    AdvanceDetailId: any;
    RefundId: any;
    SalesId: any;
    PaymentId: any;
    SalesDate: any;
    refundDate: any;
    minDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    formattedDate: any
    Billdateupdate1() {


        this.formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
        const formattedTime = this.formattedDate + this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  
        debugger
        if (this.formattedDate > this.minDate) {
            this.toastr.warning('Select Date Before Todays Date', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
            return;
        }


        Swal.fire({
            title: 'Do you want to Update Bill Date & Time ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        }).then((result) => {

            if (result.isConfirmed) {

                if (this.BillNo) {
                    const data = {
                        'billNo': this.BillNo,
                        'billDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                        'billTime': this.formattedDate + this.dateTimeObj.time
                    }
                    console.log(data);
                    this._AdministrativetaskService.getDateTimeChangeBill(data).subscribe(response => {
                        this._matDialog.closeAll();
                        this.GetBillData()
                    });

                } else if (this.AdvanceDetailId) {
                    const data1 = {
                        "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                        "time": this.formattedDate + this.dateTimeObj.time,
                        "advanceDetailId": this.AdvanceDetailId
                    }
                    console.log(data1);
                    this._AdministrativetaskService.getDateTimeChangeAdvanceDetId(data1).subscribe(response => {
                        this._matDialog.closeAll();
                        this.GetAdvanceData()
                    });

                } else if (this.RefundId) {
                    const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
                    const d2 = new Date(this.refundDate);
                    if (d1 < d2) {
                        Swal.fire("Enter Payment Date After Return Date :" + this.datePipe.transform(this.refundDate, "yyyy-MM-dd"))
                        return;
                    } else {
                        const data2 = {
                            "refundDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            "refundTime": this.formattedDate + this.dateTimeObj.time,
                            "refundId": this.RefundId
                        }
                        console.log(data2);
                        this._AdministrativetaskService.getDateTimeChangeRefundId(data2).subscribe(response => {
                            this._matDialog.closeAll();
                            this.GetRefundData()
                        });
                    }
                }
                // else if (this.SalesId && this.data.Id == 1) {
                //   var data3 = {
                //     "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                //     "time": formattedDate + this.dateTimeObj.time,
                //     "salesId": this.SalesId
                //   }
                //   console.log(data3);
                //   this._AdministrativetaskService.getDateTimeChangeSalesId(data3).subscribe(response => {
                //     this._matDialog.closeAll();
                //   });

                // } 
                else if (this.PaymentId) {

                    const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
                    const d2 = new Date(this.SalesDate);
                    if (d1 < d2) {
                        Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.SalesDate, "yyyy-MM-dd"))
                        return;
                    } else {
                        var data4 = {
                            "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            "paymentTime": this.formattedDate + this.dateTimeObj.time,
                            "paymentId": this.PaymentId
                        }
                        console.log(data4);
                        this._AdministrativetaskService.PaymentDateTimeChange(data4).subscribe(response => {
                            this._matDialog.closeAll();
                            if (response)
                                this.GetPaymentData(this.FBillNo)
                        });
                    }
                }
                else if (this.PaymentId) {

                    const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
                    const d2 = new Date(this.SalesDate);
                    if (d1 < d2) {
                        Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.SalesDate, "yyyy-MM-dd"))
                        return;
                    } else {
                        var data4 = {
                            "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            "paymentTime": this.formattedDate + this.dateTimeObj.time,
                            "paymentId": this.PaymentId
                        }
                        console.log(data4);
                        this._AdministrativetaskService.ChangeSalesBillPaymentdate(data4).subscribe(response => {
                            this._matDialog.closeAll();
                            if (response)
                                this.GetPaymentData(this.BillNo)
                        });
                    }
                }
            }
        });

    }
    screenFromString = 'billform-form';
    openBilldateupdatetask(contact): void {


        this.BillNo = contact.BillNo;
        this.AdvanceDetailId = contact.AdvancedetailId
        this.RefundId = contact.RefundId
        this.SalesId = contact.salesId
        this.PaymentId = contact.PaymentId
        this.SalesDate = contact.date
        this.refundDate = contact.refundDate
        console.log(this.BillNo)
        console.log(this.AdvanceDetailId)
        console.log(this.RefundId)
        console.log(this.SalesId)
        console.log(this.PaymentId)


        this._matDialog.open(this.Billdate, {
            maxHeight: "55vh",
            maxWidth: '90vh'

        })
    }


    oncloseservice() {
        // this.di.closea(this.serviceTable);
    }


    onClose() {
        this._matDialog.closeAll()
    }
}


export class VisitAdmissionList {
    VisAdmId: any;
    VisAdmTime: any;
    OPDNo: any;
    DoctorName: any;
    IsBillGenerated: any;
    IsDischarged: any;
    RegID: any;
    IPDNo: any;
    VisitDateTime: any;
    DischargeDate: any;
    DischargeTime: any;
    HospitalName: any;
    departmentId: any;
    IsChargesAmount: any;
    DischargeDateTime: any;
    /**
    * Constructor
    *
    * @param VisitAdmissionList
    */
    constructor(VisitAdmissionList) {
        {

            this.VisAdmId = VisitAdmissionList.VisAdmId || '';
            this.VisAdmTime = VisitAdmissionList.VisAdmTime || '';
            this.OPDNo = VisitAdmissionList.OPDNo || '';
            this.DoctorName = VisitAdmissionList.DoctorName || '';
            this.IsBillGenerated = VisitAdmissionList.IsBillGenerated || '';
            this.IsDischarged = VisitAdmissionList.IsDischarged || '';
            this.RegID = VisitAdmissionList.RegID || '';
            this.VisitDateTime = VisitAdmissionList.VisitDateTime || '';
            this.IPDNo = VisitAdmissionList.IPDNo || '';
            this.DischargeDate = VisitAdmissionList.DischargeDate || '';
            this.DischargeTime = VisitAdmissionList.DischargeTime || '';
            this.HospitalName = VisitAdmissionList.HospitalName || '';
            this.departmentId = VisitAdmissionList.departmentId || '';
            this.IsChargesAmount = VisitAdmissionList.IsChargesAmount || '';
            this.DischargeDateTime = VisitAdmissionList.DischargeDateTime || '';
        }
    }
}


export class RefundBillMaster {
    RefundId: any;
    RefundDate: Date;
    RefundAmount: any;
    RefundNo: any;
    Remark: any;
    RefundTime: any;
    /**
    * Constructor
    *
    * @param RefundBillMaster
    */
    constructor(RefundBillMaster) {
        {
            this.RefundId = RefundBillMaster.RefundId || '';
            this.RefundDate = RefundBillMaster.RefundDate || '';
            this.RefundAmount = RefundBillMaster.RefundAmount || 0;
            this.RefundNo = RefundBillMaster.RefundNo || '';
            this.Remark = RefundBillMaster.Remark || '';
            this.RefundTime = RefundBillMaster.RefundTime || '';
        }
    }
}