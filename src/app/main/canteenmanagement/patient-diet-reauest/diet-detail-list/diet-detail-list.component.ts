import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DietRequestService } from '../diet-request.service';
import { MatTableDataSource } from '@angular/material/table';
import { RequestMaster } from '../patient-diet-reauest.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfigService } from 'app/core/services/config.service';

@Component({
    selector: 'app-diet-detail-list',
    templateUrl: './diet-detail-list.component.html',
    styleUrls: ['./diet-detail-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DietDetailListComponent {
    // HeaderCancleTaskForm: FormGroup;
    DetailCancleTaskForm: FormGroup;
    myFilterform: FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd");
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd");
    regNo: any = "";
    fname = "%";
    lname = "%";
    WardId = "0";
    autocompleteModewardName: string = "Room";

    ReqId = 0;
    ReqDetId = 0;
    CancleStatus: boolean = false;
    StausChangeFlg: any;

    // reference of the "detail cancel" dialog only (not the dialog this component lives in)
    private cancelDialogRef: MatDialogRef<any>;

    selectedAcceptRows: any[] = [];
    masterCheckedAccept: boolean = false;

    selectedDeliverRows: any[] = [];
    masterCheckedDeliver: boolean = false;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('detIsCancelled') detIsCancelled!: TemplateRef<any>;
    @ViewChild('isAccept') isAccept!: TemplateRef<any>;
    @ViewChild('isDelived') isDelived!: TemplateRef<any>;
    // @ViewChild('HeaderCancleTask') HeaderCancleTask!: TemplateRef<any>;
    @ViewChild('DetailCancleTask') DetailCancleTask!: TemplateRef<any>;

    allcolumns = [
        {
            heading: "Status", key: "isAccept", sort: true, align: 'left', emptySign: 'NA', width: 150,
            type: gridColumnTypes.template, template: this.isAccept
        },
        {
            heading: "IsDelived", key: "isDelived", sort: true, align: 'left', emptySign: 'NA', width: 150,
            type: gridColumnTypes.template, template: this.isDelived
        },
        { heading: "Order Time", key: "orderTime", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        // { heading: "UHID No", key: "regId", sort: true, align: 'left', emptySign: 'NA', width: 70 },

        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 400 },
        { heading: "Room Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Meal Name", key: "mealName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Restriction ", key: "restrictionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Accepted By", key: "acceptedUser", sort: true, align: 'left', emptySign: 'NA', width: 270 },
        { heading: "Delivered By", key: "deliverUser", sort: true, align: 'left', emptySign: 'NA', width: 270 },
        { heading: "Cancelled", key: "detIsCancelled", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.template },
        { heading: "Cancelled By", key: "cancelledUser", sort: true, align: 'left', emptySign: 'NA', width: 220 },
        { heading: "Cancelled Reason", key: "cancelledReason", sort: true, align: 'left', emptySign: 'NA', width: 140 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate1
        }
    ];

    gridConfig1: gridModel = {
        apiUrl: "DietPatientRequest/DietPatientRequestDetailsList",
        columnsList: this.allcolumns,
        sortField: "DietReqDetId",
        sortOrder: 0,
        filters: [
            { fieldName: "DietReqId", fieldValue: "1", opType: OperatorComparer.Equals }
        ]
    };

    constructor(
        public _DietRequestService: DietRequestService,
        private _formBuilder: FormBuilder,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        public datePipe: DatePipe, private _configue: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }


    ngOnInit(): void {
        this.myFilterform = this.filterForm();
        // this.HeaderCancleTaskForm = this.CreateheaderCancleForm();
        this.DetailCancleTaskForm = this.CreatdetailCancleForm();

        const id = String(this.data?.dietReqId ?? 0);
        this.gridConfig1.filters = [
            { fieldName: "DietReqId", fieldValue: id, opType: OperatorComparer.Equals }
        ];
        debugger
        const access = this._configue.userAccessParam.find(x => x.AccessValueName === 'IsDietRequstStatusChange');
        this.StausChangeFlg = Number(access?.AccessValue ?? false);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const col = (key: string) => this.gridConfig1.columnsList.find(c => c.key === key)!;
            col('action').template = this.actionButtonTemplate1;
            col('isAccept').template = this.isAccept;
            col('isDelived').template = this.isDelived;
            col('detIsCancelled').template = this.detIsCancelled;

            if (this.data?.dietReqId > 0) {
                this.GetDetails(this.data);
                this.Getrequestdetailcount(this.data.dietReqId);
            }
        });
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

    GetDetails(data) {
        const DietReqId = String(data.dietReqId);

        this.gridConfig1 = {
            apiUrl: "DietPatientRequest/DietPatientRequestDetailsList",
            columnsList: this.allcolumns,
            sortField: "DietReqDetId",
            sortOrder: 0,
            filters: [
                { fieldName: "DietReqId", fieldValue: DietReqId, opType: OperatorComparer.Equals }
            ]
        };

        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();

        this.clearSelections();
    }

    // ------------------------------------------------------------------
    //  helpers
    // ------------------------------------------------------------------

    private get gridRows(): any[] {
        return (this.grid1 as any)?.data
            ?? (this.grid1 as any)?.rows
            ?? (this.grid1 as any)?.dataSource?.data
            ?? [];
    }

    /** Rows that can still be accepted (not accepted, not cancelled). */
    get pendingAcceptRows(): any[] {
        return this.gridRows.filter(r => r.isAccept !== true && !r.detIsCancelled);
    }

    /** Rows that can still be delivered (accepted, not delivered, not cancelled). */
    get pendingDeliverRows(): any[] {
        return this.gridRows.filter(r => r.isDelived !== true && r.isAccept === true && !r.detIsCancelled);
    }

    private clearSelections(): void {
        this.selectedAcceptRows = [];
        this.masterCheckedAccept = false;
        this.selectedDeliverRows = [];
        this.masterCheckedDeliver = false;
    }

    /** Refresh grid, clear selections and reload the counts after any successful change. */
    private refreshAfterChange(): void {
        this.grid1.bindGridData();
        this.clearSelections();
        this.Getrequestdetailcount(this.data.dietReqId);
    }

    /** Shows a warning and returns false when the user is not allowed to change the status. */
    private canChangeStatus(action: string): boolean {
        debugger
        if (!this.StausChangeFlg) {
            this.toastr.warning(`You do not have permission to ${action}.`);
            return false;
        }
        return true;
    }


    /** "Select All Pending Accept" – ticks / clears every pending row checkbox. */
    toggleMasterCheckboxAccept(checked: boolean): void {
        this.masterCheckedAccept = checked;
        this.selectedAcceptRows = checked ? [...this.pendingAcceptRows] : [];
    }

    /** Row checkbox – only selects / deselects the row (no API call). */
    onAcceptRowCheck(element: any, checked: boolean): void {
        this.selectedAcceptRows = this.selectedAcceptRows
            .filter(r => r.dietReqDetId !== element.dietReqDetId);

        if (checked) {
            this.selectedAcceptRows.push(element);
        }

        this.masterCheckedAccept = this.pendingAcceptRows.length > 0
            && this.selectedAcceptRows.length === this.pendingAcceptRows.length;
    }

    /** Compared by id so the tick survives the grid re-creating its row objects. */
    isAcceptRowSelected(element: any): boolean {
        return this.selectedAcceptRows.some(r => r.dietReqDetId === element.dietReqDetId);
    }

    AcceptSelectedRequests() {
        debugger
        if (!this.canChangeStatus('accept requests')) { return; }

        if (!this.selectedAcceptRows.length) {
            this.toastr.warning('Please select at least one request');
            return;
        }

        const count = this.selectedAcceptRows.length;

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Accept this Request?',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Accept it!"
        }).then((flag) => {
            if (!flag.isConfirmed) return;

            const calls = this.selectedAcceptRows.map(element => {
                const submitData = {
                    dietReqDetId: element.dietReqDetId,
                    isAccept: true,
                    isAcceptedBy: this._loggedService.currentUserValue.userId,
                    isAcceptedDateTime: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
                };
                return this._DietRequestService.RequestAccept(submitData);
            });

            forkJoin(calls).subscribe({
                next: () => {
                    this.toastr.success(count === 1 ? 'Request accepted' : 'Selected requests accepted');
                    this.refreshAfterChange();
                },
                error: (error) => this.toastr.error(error.message)
            });
        });
    }


    /** "Select All Pending Deliver" – ticks / clears every deliverable row checkbox. */
    toggleMasterCheckboxDeliver(checked: boolean): void {
        this.masterCheckedDeliver = checked;
        this.selectedDeliverRows = checked ? [...this.pendingDeliverRows] : [];
    }

    /** Row checkbox – only selects / deselects the row (no API call). */
    onDeliverRowCheck(element: any, checked: boolean): void {
        this.selectedDeliverRows = this.selectedDeliverRows
            .filter(r => r.dietReqDetId !== element.dietReqDetId);

        if (checked) {
            this.selectedDeliverRows.push(element);
        }

        this.masterCheckedDeliver = this.pendingDeliverRows.length > 0
            && this.selectedDeliverRows.length === this.pendingDeliverRows.length;
    }

    isDeliverRowSelected(element: any): boolean {
        return this.selectedDeliverRows.some(r => r.dietReqDetId === element.dietReqDetId);
    }

    DeliverSelectedRequests() {
        if (!this.canChangeStatus('deliver requests')) { return; }

        if (!this.selectedDeliverRows.length) {
            this.toastr.warning('Please select at least one request');
            return;
        }

        const count = this.selectedDeliverRows.length;

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Deliver this Request?',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Deliver it!"
        }).then((flag) => {
            if (!flag.isConfirmed) return;

            const calls = this.selectedDeliverRows.map(element => {
                const submitData = {
                    dietReqDetId: element.dietReqDetId,
                    isDelived: true,
                    isDelivedBy: this._loggedService.currentUserValue.userId,
                    isDelivedDateTime: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
                };
                return this._DietRequestService.RequestDeliver(submitData);
            });

            forkJoin(calls).subscribe({
                next: () => {
                    this.toastr.success(count === 1 ? 'Request delivered' : 'Selected requests delivered');
                    this.refreshAfterChange();
                },
                error: (error) => this.toastr.error(error.message)
            });
        });
    }


    onPrint(element) {
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




    // HeaderRequestCancle() {
    //     Swal.fire({
    //         icon: 'question',
    //         title: 'Do you want to Cancle Request',
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Yes, Cancel it!"
    //     }).then((flag) => {
    //         if (flag.isConfirmed) {
    //             const submitData = {
    //                 "dietReqId": this.ReqId,
    //                 "isCancelledBy": this._loggedService.currentUserValue.userId,
    //                 "cancelledReason": this.HeaderCancleTaskForm.get('Reason').value
    //             };
    //             this._DietRequestService.Requestcancle(submitData).subscribe(response => {
    //                 this._matDialog.closeAll();
    //                 this.grid1.bindGridData();
    //             }, (error) => {
    //                 this.toastr.error(error.message);
    //             });
    //         }
    //     });
    // }

    opendetailcancletask(contact): void {
        if (!this.canChangeStatus('Cancel requests')) { return; }


        this.ReqDetId = contact.dietReqDetId;
        this.DetailCancleTaskForm.reset();   // clear the previous reason

        this.cancelDialogRef = this._matDialog.open(this.DetailCancleTask, {
            width: '520px',
            maxWidth: '95vw',
            autoFocus: false,
            disableClose: true
        });
    }

    DetailRequestCancle() {
        if (this.DetailCancleTaskForm.invalid) {
            this.DetailCancleTaskForm.markAllAsTouched();
            this.toastr.warning('Please enter a reason');
            return;
        }

        Swal.fire({
            icon: 'question',
            title: 'Do you want to cancel this request?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((flag) => {
            if (!flag.isConfirmed) { return; }

            const submitData = {
                dietReqDetId: this.ReqDetId,
                isCancelledBy: this._loggedService.currentUserValue.userId,
                cancelledReason: this.DetailCancleTaskForm.get('Reason').value
            };

            this._DietRequestService.DetailRequestcancle(submitData).subscribe({
                next: () => {
                    this.toastr.success('Request cancelled successfully');
                    this.cancelDialogRef?.close(true);
                    this.refreshAfterChange();
                },
                error: (error) => this.toastr.error(error.message)
            });
        });
    }

    onCancelDialogClose(): void {
        this.cancelDialogRef?.close();
    }

    // ------------------------------------------------------------------
    //  single-row ACCEPT / UN-ACCEPT
    // ------------------------------------------------------------------

    onUnAcceptCheck(element: any, event: MatCheckboxChange) {
        event.source.checked = true;       // stays ticked until the API succeeds
        this.UnAcceptRequest(element);
    }

    AcceptRequest(element) {
        if (!this.canChangeStatus('accept requests')) { return; }

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Accept Request',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Accept it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isAccept": true,
                    "isAcceptedBy": this._loggedService.currentUserValue.userId,
                    "isAcceptedDateTime": this.datePipe.transform(new Date(), "yyyy-MM-dd"),
                };
                this._DietRequestService.RequestAccept(submitData).subscribe(response => {
                    this.toastr.success('Request accepted');
                    this.refreshAfterChange();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    UnAcceptRequest(element) {
        if (!this.canChangeStatus('un-accept requests')) { return; }

        if (element.isDelived) {
            this.toastr.warning('Delivered request cannot be un-accepted');
            return;
        }

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Un-Accept Request',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Un-Accept it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isAccept": false,
                    "isAcceptedBy": 0,
                    "isAcceptedDateTime": null,
                };
                this._DietRequestService.RequestAccept(submitData).subscribe(response => {
                    this.toastr.success('Request un-accepted');
                    this.refreshAfterChange();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    // ------------------------------------------------------------------
    //  single-row DELIVER / UN-DELIVER
    // ------------------------------------------------------------------

    onUnDeliverCheck(element: any, event: MatCheckboxChange) {
        event.source.checked = true;       // stays ticked until the API succeeds
        this.UnDeliverRequest(element);
    }

    DeliverRequest(element) {
        if (!this.canChangeStatus('deliver requests')) { return; }

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Deliver Request',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Deliver it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isDelived": true,
                    "isDelivedBy": this._loggedService.currentUserValue.userId,
                    "isDelivedDateTime": this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                this._DietRequestService.RequestDeliver(submitData).subscribe(response => {
                    this.toastr.success('Request delivered');
                    this.refreshAfterChange();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    UnDeliverRequest(element) {
        if (!this.canChangeStatus('un-deliver requests')) { return; }

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Un-Deliver Request',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Un-Deliver it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isDelived": false,
                    "isDelivedBy": 0,
                    "isDelivedDateTime": null,
                };
                this._DietRequestService.RequestDeliver(submitData).subscribe(response => {
                    this.toastr.success('Request un-delivered');
                    this.refreshAfterChange();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const that = this;
        const dialogRef = this._matDialog.open(DietDetailListComponent, {
            maxWidth: "95vw",
            height: '95%',
            width: '90%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    onClose() {
        this._matDialog.closeAll();
    }

    getValidationMessages() {
        return {
            WardName: [],
        };
    }

    // ------------------------------------------------------------------
    //  counts for the dashboard cards
    // ------------------------------------------------------------------

    dataSource = new MatTableDataSource<RequestMaster>();

    VCancelcount = 0;
    VTotalcount = 0;
    VAcceptcount = 0;
    VaccPendingcount = 0;
    VdelPendingcount = 0;
    vDelived = 0;
    DietReqId = 0;

    Getrequestdetailcount(dietReqId) {
        this.VTotalcount = 0;
        this.vDelived = 0;
        this.VAcceptcount = 0;
        this.VaccPendingcount = 0;
        this.VdelPendingcount = 0;
        this.VCancelcount = 0;

        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }

        const filters: any[] = [
            {
                "fieldName": "DietReqId",
                "fieldValue": String(dietReqId),
                "opType": "Equals"
            }
        ];

        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "DietReqDetId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };

        this._DietRequestService.getRequestdetaillist(data).subscribe((response) => {
            this.dataSource.data = response.data;

            if (this.dataSource.data.length > 0) {
                this.VTotalcount = this.dataSource.data.length;

                this.dataSource.data.forEach(element => {
                    if (element.isAccept) {
                        this.VAcceptcount++;
                    }
                    if (element.isDelived == true) {
                        this.vDelived++;
                    }
                    if (element.detIsCancelled) {
                        this.VCancelcount++;
                    }
                });

                this.VaccPendingcount = this.VTotalcount - this.VAcceptcount;
                this.VdelPendingcount = this.VTotalcount - this.vDelived;
            }
        });
    }
}