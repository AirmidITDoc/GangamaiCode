import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { NewTallyInterfaceService } from './new-tally-interface.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-tally-inerface',
  templateUrl: './new-tally-inerface.component.html',
  styleUrls: ['./new-tally-inerface.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewTallyInerfaceComponent {
  IsAdvanceTally = false;
  IsIpTally = false;
  IsSalesTally = false;
  IsOpTally = false;
  myFilteropcashcounerform: FormGroup;

  myFilterIpBillform: FormGroup;
  myFilterIpAdvform: FormGroup;

  myFiltersalesform: FormGroup;


  hasSelectedContacts: boolean;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  modeOPbill: string = '';
  modeOPbillrefund: string = '';

  modeIPPay: string = '';
  modeIPBillPatientwise: string = '';
  modeIPbilldetail: string = '';
  modeIpbillrefund: string = '';
  modeSalesPaydetail: string = '';
  modeSalesdetail: string = '';
  modeSalesreturn: string = '';
  modeIPadv: string = '';
  modeAdvrefund: string = '';


  constructor(public _tallyService: NewTallyInterfaceService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService, private _configue: ConfigService,
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay
  ) {
  }
  filtersop: any
  filtersIP: any
  filtersAdv: any
  filterssales: any

  ngOnInit(): void {

debugger
    const rawValue = this?._configue?.configParams?.IsAdvanceTally || "";
    const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
    this.IsAdvanceTally = id === "1";

    const rawValue1 = this?._configue?.configParams?.IsIpTally || "";
    const [id1, val1] = rawValue1.includes(":") ? rawValue1.split(":") : [null, null];
    this.IsIpTally = id1 === "1";

    const rawValue2 = this?._configue?.configParams?.IsSalesTally || "";
    const [id2, val2] = rawValue2.includes(":") ? rawValue2.split(":") : [null, null];
    this.IsSalesTally = id2 === "1";

    const rawValue3 = this?._configue?.configParams?.IsOpTally || "";
    const [id3, val3] = rawValue3.includes(":") ? rawValue3.split(":") : [null, null];
    this.IsOpTally = id3 === "1";



    this.myFilteropcashcounerform = this._tallyService.myFilterOpcashcounerform();

    this.myFilterIpBillform = this._tallyService.myFilterrIPBillform();
    this.myFilterIpAdvform = this._tallyService.myFilterIPAdvanceform();

    this.myFiltersalesform = this._tallyService.myFiltersalesform();
    this.onChangeOpBill()
    this.onChangeOPBillRefund()

    this.onChangeIPBill()
    this.onChangeIPBillPatientwise()
    this.onChangeIPBillDetail()
    this.onChangeIPBillRefundPay()
    this.onChangeAdvanceRefund()
    this.onChangeIPAdvancePay()

    this.onChangePhSalesPayDetail()
    this.onChangePhSalesDetail()
    this.onChangePhSalesreurn()
  }

  //OP
  onChangeOpBill() {
    
    this.fromDate = this.datePipe.transform(this.myFilteropcashcounerform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilteropcashcounerform.get('enddate').value, "yyyy-MM-dd")
    this.filtersop = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeOPbill = "OPPayment";
  }
  onChangeOPBillRefund() {
    
    this.filtersop = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeOPbillrefund = "OPBillRefundPayment";
  }
  onChangeIPBill() {
    
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPPay = "IPBillPayment";
  }
  // IP?
  onChangeIPBillPatientwise() {
    
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPBillPatientwise = "IPBillPayment";
  }

  onChangeIPBillDetail() {
    
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPbilldetail = "IPBillDetailList";
  }
  onChangeIPBillRefundPay() {
    
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIpbillrefund = "IPBillRefundPayment";
  }
  //IP Advance

  onChangeIPAdvancePay() {
    
    this.filtersAdv = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPadv = "IPAdvancePayment";
  }
  onChangeAdvanceRefund() {
    
    this.filtersAdv = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeAdvrefund = "IPAdvanceRefundPayment";
  }
  //Sales
  onChangePhSalesPayDetail() {
    
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesPaydetail = "OPIPSalsePayment";
  }
  onChangePhSalesDetail() {
    
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesdetail = "OPIPSalesDetailList";
  }

  onChangePhSalesreurn() {
    
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesreturn = "OPIPSalesReturnBillDetailList";
  }
  onChangeDateOP() {
    this.fromDate = this.datePipe.transform(this.myFilteropcashcounerform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilteropcashcounerform.get('enddate').value, "yyyy-MM-dd")


    this.onChangeOpBill()
    this.onChangeOPBillRefund()
  }


  onChangeDateIP() {
    this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.onChangeIPBill()
    this.onChangeIPBillPatientwise()
    this.onChangeIPBillDetail()
    this.onChangeIPBillRefundPay()



  }

  onChangeDateAdv() {
    this.fromDate = this.datePipe.transform(this.myFilterIpAdvform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterIpAdvform.get('enddate').value, "yyyy-MM-dd")

    this.onChangeIPAdvancePay()
    this.onChangeAdvanceRefund()

  }

  onChangeDatesales() {
    this.fromDate = this.datePipe.transform(this.myFiltersalesform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFiltersalesform.get('enddate').value, "yyyy-MM-dd")

    this.onChangePhSalesPayDetail()
    this.onChangePhSalesDetail()
    this.onChangePhSalesreurn()
  }


}