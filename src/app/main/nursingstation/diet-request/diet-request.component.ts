import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DietRequestService } from './diet-request.service';
import { NewDietRequestComponent } from './new-diet-request/new-diet-request.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-diet-request',
    templateUrl: './diet-request.component.html',
    styleUrls: ['./diet-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DietRequestComponent {
    HeaderCancleTaskForm: FormGroup
    DetailCancleTaskForm: FormGroup
    myFilterform: FormGroup;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    regNo: any = ""
    fname = "%"
    lname = "%"
    WardId = "0"
    autocompleteModewardName: string = "Room";

    ReqId = 0
    ReqDetId = 0
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('IsCancelledBy') IsCancelledBy!: TemplateRef<any>;
    @ViewChild('status') status!: TemplateRef<any>;
    @ViewChild('isAccept') isAccept!: TemplateRef<any>;
    @ViewChild('isDelived') isDelived!: TemplateRef<any>;
    @ViewChild('detIsCancelled') detIsCancelled!: TemplateRef<any>;
    @ViewChild('HeaderCancleTask') HeaderCancleTask!: TemplateRef<any>;
    @ViewChild('DetailCancleTask') DetailCancleTask!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.IsCancelledBy;
    }

    allcolumns = [
        { heading: "Status", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', width: 80, type: gridColumnTypes.template },

        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        { heading: "Diet Req No", key: "dietReqNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        // { heading: "Diet Menu Code", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Created By", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Created Date", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
        { heading: "Cancelled By", key: "cancelledUser", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Cancelled Date", key: "isCancelledDate", sort: true, align: 'left', emptySign: 'NA', width: 140, type: 6 },

        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    constructor(public _DietRequestService: DietRequestService,
        private _formBuilder: FormBuilder,
        private commonService: PrintserviceService, public _matDialog: MatDialog, private _loggedService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe,
        private cdr: ChangeDetectorRef) { }
    ngOnInit(): void {
        this.myFilterform = this.filterForm()

        this.HeaderCancleTaskForm = this.CreateheaderCancleForm()
        this.DetailCancleTaskForm = this.CreatdetailCancleForm()
        this.Getrequestdetail()
    }


    CreateheaderCancleForm() {
        return this._formBuilder.group({
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            AdmissionTime: [''],
            Reason: ['', Validators.required]
        });
    }
    CreatdetailCancleForm() {
        return this._formBuilder.group({
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            AdmissionTime: [''],
            Reason: ['', Validators.required]
        });
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            DietReqId: ''
        });
    }

    gridConfig: gridModel = {
        apiUrl: "DietPatientRequest/DietPatientRequestHeaderList",
        columnsList: this.allcolumns,
        sortField: "DietReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "DietReqId", fieldValue: "0", opType: OperatorComparer.Equals }

        ]
    }


    selectChangeward(value) {
        if (value.value !== 0)
            this.WardId = value.value
        else
            this.WardId = "0"

        this.onChangeFirst();
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'DietReqId')
            this.myFilterform.get('DietReqId').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this.myFilterform.get('DietReqId').value

        this.getfilterdata();
    }

    getfilterdata() {

        let fromDate1 = this.myFilterform.get("fromDate").value || "";
        let toDate1 = this.myFilterform.get("enddate").value || "";
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";

        let Reqno = this.myFilterform.get("DietReqId").value || "";
        this.gridConfig = {
            apiUrl: "DietPatientRequest/DietPatientRequestHeaderList",
            columnsList: this.allcolumns,
            sortField: "DietReqId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt ", fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: "DietReqId", fieldValue: Reqno, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

        if (this.gridConfig) {
            debugger
            setTimeout(() => {
                this.Getrequestdetail()

            }, 500);
        }
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;
    isDetailicon: boolean = true;

    GetDetails(data) {
        console.log(data)
        const DietReqId = String(data.dietReqId)
        debugger
        if (data.isCancelled)
            this.isDetailicon = false
        else
            this.isDetailicon = true

        this.gridConfig1 = {
            apiUrl: "DietPatientRequest/DietPatientRequestDetailsList",
            columnsList: [
                // {
                //     heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA', width: 100,
                //     type: gridColumnTypes.template, template: this.status
                // },
                {
                    heading: "Status", key: "isAccept", sort: true, align: 'left', emptySign: 'NA', width: 140,
                    type: gridColumnTypes.template, template: this.isAccept
                },
                {
                    heading: "IsDelived", key: "isDelived", sort: true, align: 'left', emptySign: 'NA', width: 120,
                    type: gridColumnTypes.template, template: this.isDelived
                },
                { heading: "Order Time", key: "orderTime", sort: true, align: 'left', emptySign: 'NA', width: 180 },

                { heading: "OPIPID", key: "opipid", sort: true, align: 'left', emptySign: 'NA', width: 100 },

                { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "Room Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 350 },

                // { heading: "DietMenuCode", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                // { heading: "Diet MenuName", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                // { heading: "MealTypeCode", key: "MealTypeCode", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "Meal Name", key: "mealName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                // { heading: "DietCode", key: "DietCode", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "Diet Name", key: "dietName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                // { heading: "Restriction ", key: "restrictionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                // { heading: "Allergy", key: "allergyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                // { heading: "Reaction", key: "reaction", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                // { heading: "Accepted By", key: "isAcceptedUser", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Accepted DateTime", key: "isAcceptedDateTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 8 },

                // { heading: "DelivedBy", key: "isDelivedBy", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Delived DateTime", key: "isDelivedDateTime", sort: true, align: 'left', emptySign: 'NA', width: 140, type: 8 },
                {
                    heading: "Cancelled", key: "detIsCancelled", sort: true, align: 'left', emptySign: 'NA', width: 140,
                    type: gridColumnTypes.template, template: this.detIsCancelled
                },
                { heading: "Cancelled DateTime", key: "detIsCancelledDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 8 },


                { heading: "CancelledBy", key: "cancelledUser", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Cancelled Reason", key: "cancelledReason", sort: true, align: 'left', emptySign: 'NA', width: 140 },
                {
                    heading: "Action", key: "action1", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate1  // Assign ng-template to the column
                }
            ],
            sortField: "DietReqDetId",
            sortOrder: 0,
            filters: [
                { fieldName: "DietReqId", fieldValue: DietReqId, opType: OperatorComparer.Equals }

            ]
        }
        this.isShowDetailTable = true;

        this.cdr.detectChanges();

        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    onPrint(element) {
        console.log(element)
        this.commonService.Onprint("ReqId", element.reqId, "CanteenRequestprint");
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

    openheadercancletask(contact): void {
        console.log(contact);
        this.ReqId = contact.dietReqId;

        this._matDialog.open(this.HeaderCancleTask, {
            width: '520px',          // Fixed comfortable width
            maxWidth: '95vw',        // Responsive on small screens
            autoFocus: false,
            disableClose: true       // Optional: prevent closing by clicking outside
        });
    }

    HeaderRequestCancle() {
        Swal.fire({
            title: 'Do you want to Cancle Request',
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqId": this.ReqId,
                    "isCancelledBy": this._loggedService.currentUserValue.userId,
                    "cancelledReason": this.HeaderCancleTaskForm.get('Reason').value
                };
                console.log(submitData);
                this._DietRequestService.Requestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll()
                    this.HeaderCancleTaskForm.get('Reason').setValue('')
                    this.grid.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                }
                );
            }
        });

    }

    opendetailcancletask(contact): void {
        console.log(contact)
        this.ReqDetId = contact.dietReqDetId
        this._matDialog.open(this.DetailCancleTask, {
            width: '520px',          // Fixed comfortable width
            maxWidth: '95vw',        // Responsive on small screens
            autoFocus: false,
            disableClose: true
        })

    }
    DetailRequestCancle(element) {
        Swal.fire({
            title: 'Do you want to Cancle Request',
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": this.ReqDetId,
                    "isCancelledBy": this._loggedService.currentUserValue.userId,
                    "cancelledReason": this.DetailCancleTaskForm.get('Reason').value

                };
                console.log(submitData);
                this._DietRequestService.DetailRequestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll()
                    this.DetailCancleTaskForm.get('Reason').setValue('')
                    this.grid1.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                }
                );
            }
        });

    }

    NewRequest() {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietRequestComponent,
            {
                maxWidth: "95vw",
                maxHeight: "99vh",
                width: "100%"
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }


    Edit(row) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietRequestComponent,
            {
                maxWidth: "95vw",
                maxHeight: "99vh",
                width: "100%",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    onClose() {
        this._matDialog.closeAll()
    }

    getValidationMessages() {
        return {

            WardName: [],

        }
    }
    //
    dataSource = new MatTableDataSource<RequestMaster>();

    VCancelcount = 0;
    VNewcount = 0;
    VAcceptcount = 0;
    VPendingcount = 0;
    Getrequestdetail() {

        this.VNewcount = 0;
        this.VAcceptcount = 0;
        this.VPendingcount = 0;
        this.VCancelcount = 0;

        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];

        // Handle date range
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }


        filters.push(

            {
                "fieldName": "From_Dt",
                "fieldValue": String(this.fromDate),
                "opType": "Contains"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": String(this.toDate),
                "opType": "Contains"
            },
            {
                "fieldName": "DietReqId",
                "fieldValue": String(this.regNo),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "DietReqId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._DietRequestService.getRequestlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            if (this.dataSource.data.length > 0) {
                this.VNewcount = this.dataSource.data.length
                this.VCancelcount = 0;
                this.dataSource.data.forEach(element => {

                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    }

                });
                console.log(this.dataSource.data)
            }
        });
    }

}


export class RequestMaster {
    visitId: number;
    isCancelled: any;
    RegID: number;
    visitDate: any;
    visitTime: any;
    unitId: number;


    /**
     * Constructor
     *
     * @param RequestMaster
     */
    constructor(RequestMaster) {
        {
            this.visitId = RequestMaster.visitId || 0;
            this.isCancelled = RequestMaster.isCancelled || 0;
            this.RegID = RequestMaster.RegID || 0;
            this.visitDate = RequestMaster.visitDate || "";
            this.visitTime = RequestMaster.visitTime || "";

        }
    }

}
