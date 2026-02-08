import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { SupplierPaymentStatusService } from '../supplier-payment-status.service';
import { FormGroup } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Subscription } from 'rxjs'
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-supplier-payment-list',
  templateUrl: './supplier-payment-list.component.html',
  styleUrls: ['./supplier-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentListComponent implements OnInit {
 

  SupplierListForm: FormGroup;
  isSupplierSelected: boolean = false;
  ToStoreList: any = [];
  dateTimeObj: any;
  filteredSupplier: any;
  noOptionFound: any;
  sIsLoading: string = '';

  dsSupplierList = new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  supplierN: any = "%";
  SupplierID: any = "0"
  autocompleteSupplier: string = "SupplierMaster"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  

  constructor(
    public _SupplierPaymentStatusService: SupplierPaymentStatusService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService, private overlay: Overlay,
    private accountService: AuthenticationService, public _whatsppService: WhatsAppEmailService,
    public toastr: ToastrService, private commonService: PrintserviceService,
  ) { }

   @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate
    }

  ngOnInit(): void {
    this.SupplierListForm = this._SupplierPaymentStatusService.CreateSupplierList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  allColumns = [
    { heading: "SupPayNo", key: "supPayNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date", key: "supPayDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TotalAmount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPayAmt", key: "cashPayAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePayAmt", key: "chequePayAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PartyReceiptNo", key: "partyReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
    // {
    //   heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
    //     {
    //       action: gridActions.print, callback: (data: any) => {
    //         this.viewgetReportPdf(data)
    //       }
    //     }]
    // }
     {
                heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
  ]

  allFilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "SupplierId", fieldValue: this.SupplierID, opType: OperatorComparer.StartsWith }
  ]

  gridConfig: gridModel = {
    apiUrl: "SupplierPayment/GetSupplierPaymentList",
    columnsList: this.allColumns,
    sortField: "SupplierId",
    sortOrder: 0,
    filters: this.allFilters
  }

  selectChangeSupplier(obj: any) {
   
    if (obj.value !== 0)
      this.SupplierID = obj.value
    else
      this.SupplierID = "0"
  }

  onClose() {
    this._matDialog.closeAll();
  }

    viewgetReportPdf(element) {
      debugger
        this.commonService.Onprint("SupPayId", element.supPayId, "SupplierPaymentRecieptByPayment");
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
            patientData.billNo = patientData.supPayId
            patientData.patientName = patientData.supplierName
            patientData.regNo = patientData.supplierId

            patientData.mobileNo = patientData.mobile
            patientData.emailId= patientData.email


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
            patientData.billNo = patientData.sub
            patientData.patientName = patientData.supplierName
            patientData.regNo = patientData.supplierID
            patientData.mobileNo = patientData.mobile



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
            billNo: el.grnid,
            smsType: "SupplierPayReceipt",
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
                        emailType:'SupplierPayReceipt'
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                this.grid.bindGridData();
            });
        }
 
}

export class SupplierPayStatusList {
  GRNReturnNo: any;
  SupplierName: string;
  GRNReturnDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate: any;
  Mobile: any;
  constructor(SupplierPayStatusList) {
    {
      this.GRNReturnNo = SupplierPayStatusList.GRNReturnNo || 0;
      this.SupplierName = SupplierPayStatusList.SupplierName || '';
      this.GRNReturnDate = SupplierPayStatusList.GRNReturnDate || 0;
      this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
      this.NetAmount = SupplierPayStatusList.NetAmount || 0;
      this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
      this.BalAmount = SupplierPayStatusList.BalAmount || '';
      this.InvDate = SupplierPayStatusList.InvDate || '';
      this.Mobile = SupplierPayStatusList.Mobile || 0;
    }
  }
}
