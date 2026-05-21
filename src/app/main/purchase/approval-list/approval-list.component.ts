import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
 import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';  
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { ApprovalListService } from './approval-list.service';


@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class ApprovalListComponent  implements OnInit { 
 
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.GRNReturn, permissionType.Add);
    SpinLoading: boolean = false;
    ToStoreList: any = [];
    SupplierList: any;
    optionsToStore: any;
    optionsSupplier: any;
    isPaymentSelected: boolean = false;
    isSupplierSelected: boolean = false;
    dateTimeObj: any;
    screenFromString = 'admission-form';
    sIsLoading: string;
    filteredoptionsToStore: Observable<string[]>;
    filteredoptionsSupplier: Observable<string[]>;
    vGRNReturnItemFilter: any;
    VsupplierId: any = 0
    vFinalTotalAmount: any = 0
    vFinalNetAmount: any = 0
    vFinalVatAmount: any = 0
    vFinalDiscAmount: any = 0;
    vRoundingAmt: any;
    autocompletestore: string = "Store";
    autocompleteSupplier: string = "SupplierMaster"
    IsGRNverify: boolean = false; 

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
    @ViewChild('paginator2', { static: true }) public paginator2: MatPaginator;
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        public _ApprovalListService: ApprovalListService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public _ConfigService: ConfigService,
        private accountService: AuthenticationService, 
        private overlay: Overlay,
        public toastr: ToastrService,
         public _whatsppService: WhatsAppEmailService,
        private commonService: PrintserviceService, 
        public permissionService: PagePermissionService,
    ) { }

  

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    ngOnInit(): void {  
        // const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsGRNReturnVerify');
        // this.IsGRNverify = access?.AccessValue;
    } 
    fromDate = '' //this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('start').value, "yyyy-MM-dd")
    toDate ='' // this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('end').value, "yyyy-MM-dd")

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('ColorCode') ColorCode!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.ColorCode;
    }

    ToStoreId: any = this.accountService.currentUserValue.user.storeId
    Status: any = "0";
    vSupplier: any = "0";

    allColumns = [
        {
            heading: "-", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.ColorCode
        },
        { heading: "GRNReturn No", key: "grnReturnNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "GRNReturn DateTime", key: "grnReturnDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Total Amount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "GSTAmount", key: "totalVatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        {
            heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]
    allFilters = [
        { fieldName: "ToStoreId", fieldValue: String(this.ToStoreId), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "SupplierId", fieldValue: this.vSupplier, opType: OperatorComparer.Equals },
        { fieldName: "IsVerify", fieldValue: this.Status, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.GRNReturn,
        apiUrl: "GRNReturn/GRNReturnlistbynameLis",
        columnsList: this.allColumns,
        sortField: "GRNReturnId",
        sortOrder: 0,
        filters: this.allFilters
    }

    onChangeFirst() {
        // this.isShowDetailTable = false;
        // if (this._ApprovalListService.ApprovalForm.get('Status').value == true) {
        //     this.Status = "1"
        // } else {
        //     this.Status = "0"
        // }
        // this.fromDate = this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('start').value, "yyyy-MM-dd")
        // this.toDate = this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('end').value, "yyyy-MM-dd")
        // // this.ToStoreId = this.vstoreId || '2'
        // // this.Supplier = this.vSupplier || "1"
        // // this.Status = this._ApprovalListService.ApprovalForm.get('Status').value || "0"
        // this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "GRNReturn/GRNReturnlistbynameList",
            columnsList: this.allColumns,
            sortField: "GRNReturnId",
            sortOrder: 0,
            filters: [
                { fieldName: "ToStoreId", fieldValue: String(this.ToStoreId), opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "SupplierId", fieldValue: this.vSupplier, opType: OperatorComparer.Equals },
                { fieldName: "IsVerify", fieldValue: this.Status, opType: OperatorComparer.Equals }
            ]
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    // vstoreId: any = '2';
    ListView(value) {
        // debugger
        console.log(value)
        if (value.value !== 0)
            this.ToStoreId = value.value
        else
            this.ToStoreId = "0"

        this.onChangeFirst();
    }

    ListView1(value) {
        // debugger
        console.log(value)
        if (value.value !== 0)
            this.vSupplier = value.value
        else
            this.vSupplier = "0"

        this.onChangeFirst();
    }
  

    onClear() { }
  
    // getNewGRNRet(row?: any) {
    //     const dialogRef = this._matDialog.open(NewGRNReturnComponent,
    //         {
    //             maxWidth: "95vw",
    //             maxHeight: '100vh',
    //             width: '90%',
    //             data: row ?? ''
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed - Insert Action', result);
    //         this.getfilterdata();
    //     });
    // }

    // newGRNRetunr(row?: any) {
    //     const dialogRef = this._matDialog.open(NewGRNReturnWithoutGRNComponent,
    //         {
    //             maxWidth: "95vw",
    //             maxHeight: '100vh',
    //             width: '90%',
    //             // height:'90%',
    //             data: row ?? ''
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed - Insert Action', result);
    //         this.getfilterdata();
    //         // this.getGRNReturnList();
    //     });
    // }

    // getNew(row?: any) {
    //     const dialogRef = this._matDialog.open(GrnreturnWithoutGrnNewComponent,
    //         {
    //             maxWidth: "95vw",
    //             maxHeight: '100vh',
    //             width: '90%',
    //             // height:'90%',
    //             data: row ?? ''
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed - Insert Action', result);
    //         this.getfilterdata();
    //     });
    // }

    onPrint(row) {
        this.commonService.Onprint("GRNReturnId", row.grnReturnId, "GRNReturnReport");
    }

    //whatsapp
    private overlayRef: OverlayRef | null = null;
    private EmailOverlayRef: OverlayRef | null = null;
    private whatsappOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    openEmailDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.EmailOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
            const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
            console.log(patientData)
            debugger
            patientData.billNo = patientData.grnReturnId

            patientData.patientName = patientData.supplierName
            patientData.regNo = patientData.supplierId
            patientData.mobileNo = patientData.mobile.trim()
            patientData.emailId = patientData.email

            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.EmailOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeEmailDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }
        }, 200);
    }
    openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);

            console.log(patientData)
            patientData.billNo = patientData.grnReturnId

            patientData.patientName = patientData.supplierName
            patientData.regNo = patientData.supplierId
            patientData.mobileNo = patientData.mobile.trim()

            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }
    ngOnDestroy() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
        if (this.EmailOverlayRef) {
            this.EmailOverlayRef.dispose();
        }
        if (this.whatsappOverlayRef) {
            this.whatsappOverlayRef.dispose();
        }
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
        }
    }

    getWhatsappshareBill(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobile,
            patientName: el.supplierName,
            billNo: el.grnreturnId,
            smsType: "GRNReturnReceipt",
            patientId: el.supplierId
        })
    }
    Onemail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'GRNReturnReceipt'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}

 