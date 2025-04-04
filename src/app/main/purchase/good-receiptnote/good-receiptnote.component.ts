import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from './good-receiptnote.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, result } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { UpdateGRNComponent } from './update-grn/update-grn.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { QrcodegeneratorComponent } from 'app/main/purchase/good-receiptnote/qrcodegenerator/qrcodegenerator.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import * as XLSX from 'xlsx';
import { ConfigService } from 'app/core/services/config.service';
import { BarcodeSaveComponent } from './barcode-save/barcode-save.component';

@Component({
    selector: 'app-good-receiptnote',
    templateUrl: './good-receiptnote.component.html',
    styleUrls: ['./good-receiptnote.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class GoodReceiptnoteComponent implements OnInit {
    displayedColumns = [
        'Status',
        'GrnNumber',
        'GRNDate',
        'InvoiceNo',
        'SupplierName',
        'TotalAmount',
        'TotalDiscAmount',
        'TotalVATAmount',
        'NetAmount',
        'RoundingAmt',
        'DebitNote',
        'CreditNote',
        // 'InvDate',
        'Cash_CreditType',
        'ReceivedBy',
        'IsClosed',
        'Action1',
    ];

    displayedColumns1 = [
        "select",
        "ItemName",
        "BatchNo",
        "BatchExpDate",
        "ConversionFactor",
        "ReceiveQty",
        "FreeQty",
        "MRP",
        "Rate",
        "TotalAmount",
        "VatPercentage",
        "DiscPercentage",
        "LandedRate",
        "NetAmount",
        "TotalQty",
        "stockid",
        "IsVerified",
        "IsVerifiedDatetime",
        "IsVerifiedUserId"
    ];
    displayedColumns3 = [
        'SupplierName',
        'ReceiveQty',
        'FreeQty',
        'MRP',
        'Rate',
        'discpercentage',
        // 'DiscAmount',
        'VatPercentage'
    ]

    sIsLoading: string = '';
    isLoading = true;
    ToStoreList: any = [];
    FromStoreList: any;
    SupplierList: any;
    screenFromString = 'admission-form';
    isPaymentSelected: boolean = false;
    isSupplierSelected: boolean = false;
    isItemNameSelected: boolean = false;
    registerObj = new RegInsert({});
    chargeslist: any = [];
    isChecked: boolean = true;
    labelPosition: 'before' | 'after' = 'after';
    isItemIdSelected: boolean = false;
    StoreList: any = [];
    StoreName: any;
    ItemID: any;
    VatPercentage: any;
    GSTPer: any;
    Specification: any;
    VatAmount: any;
    FinalNetAmount: any;
    FinalDisAmount: any;
    NetPayamount: any;
    CGSTFinalAmount: any;
    SGSTFinalAmount: any;
    IGSTFinalAmount: any;
    TotalFinalAmount: any;
    chkNewGRN: any;
    SpinLoading: boolean = false;
    dsGRNList = new MatTableDataSource<GRNList>();
    dsGrnItemList = new MatTableDataSource<GrnItemList>();
    dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();
    dsItemNameList = new MatTableDataSource<ItemNameList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    filteredOptions: any;
    noOptionFound: boolean;
    ItemName: any;
    UOM: any = 0;
    HSNCode: any = 0;
    Dis: any = 0;
    BatchNo: any;
    Qty: any;
    ExpDate: any;
    MRP: any;
    FreeQty: any = 0;
    Rate: any;
    TotalAmount: any;
    Disc: any = 0;
    DisAmount: any = 0;
    CGST: any;
    CGSTAmount: any;
    SGST: any;
    SGSTAmount: any;
    IGST: any = 0;
    IGSTAmount: any = 0;
    NetAmount: any;
    filteredoptionsToStore: Observable<string[]>;
    filteredoptionsSupplier: Observable<string[]>;
    filteredoptionsItemName: Observable<string[]>;
    optionsToStore: any;
    optionsFrom: any;
    optionsMarital: any;
    optionsSupplier: any;
    optionsItemName: any;
    renderer: any;
    GST: any = 0;
    GSTAmount: any = 0;
    GSTAmt: any;
    DiscAmt: any;
    tab: number = 3;
    selectedIndex = 0;
    Filepath: any;
    loadingarry: any = [];
    currentDate = new Date();
    IsLoading: boolean = false;
    isGRNVerify:any;

    constructor(
        public _GRNService: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
         public _ConfigService : ConfigService

    ) { }

    ngOnInit(): void {
        this.getToStoreSearchList();
        this.getToStoreSearchCombo();
        this.getGRNList();
        this.isGRNVerify = this.accountService.currentUserValue.user.isGRNVerify
        console.log(this.isGRNVerify)
    }
    data: any[];
    FullData: GRNList = {} as GRNList;

    onFileChange(evt: any) {
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            this.data = <any[]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            console.log(this.data);
            let INetAmt = 0, SgstPer = 0, SgstAmt = 0, CgstPer = 0, CgstAmt = 0;
            for (let i = 1; i < this.data.length; i++) {
                INetAmt += parseFloat(this.data[i][this.data[0].indexOf('INetAmt')] || 0);
                SgstPer += parseFloat(this.data[i][this.data[0].indexOf('SGSTAmt')] || 0);
                SgstAmt += parseFloat(this.data[i][this.data[0].indexOf('SGSTPer')] || 0);
                CgstAmt += parseFloat(this.data[i][this.data[0].indexOf('CGSTAmt')] || 0);
                CgstPer += parseFloat(this.data[i][this.data[0].indexOf('CGSTPer')] || 0);
            }
            this.FullData = {
                GrnNumber: this.data[1][this.data[0].indexOf('InvNo')],
                GRNDate: this.data[1][this.data[0].indexOf('InvDate')],
                GRNTime: null,
                InvoiceNo: this.data[1][this.data[0].indexOf('InvNo')],
                SupplierName: this.data[1][this.data[0].indexOf('Vendor')],
                TotalAmount: 0,
                TotalDiscAmount: 0,
                TotalVATAmount: 0,
                NetAmount: INetAmt,
                RoundingAmt: 0,
                DebitNote: '',
                CreditNote: this.data[1][this.data[0].indexOf('CNote')],
                InvDate: this.data[1][this.data[0].indexOf('InvDate')],
                Cash_CreditType: '',
                ReceivedBy: '',
                IsClosed: false,
                GSTNo: this.data[1][this.data[0].indexOf('VGSTIN')],
                Remark: '',
                Mobile: '',
                Address: '',
                Email: '',
                Phone: '',
                PONo: '',
                EwayBillNo: this.data[1][this.data[0].indexOf('EWBN')],
                EwayBillDate: '',
                OtherCharge: '',
                Rate: 0,
                CGSTPer: CgstPer,
                SGSTPer: SgstPer,
                CGSTAmt: CgstAmt,
                SGSTAmt: CgstPer,
                NetPayble: 0,
                AddedByName: '',
                GrandTotalAount: 0,
                TotCGSTAmt: 0,
                TotSGSTAmt: 0,

                Items: [] as ItemNameList[]
            } as unknown as GRNList;
            for (let i = 1; i < this.data.length; i++) {
                // list here item details map...
                this.FullData["Items"].push({
                    ItemName: this.data[i][this.data[0].indexOf('ProductDesc')],
                    BatchNo: this.data[i][this.data[0].indexOf('BatchNo')],
                    ExpDate: this.data[i][this.data[0].indexOf('ExpDate')],
                    Qty: this.data[i][this.data[0].indexOf('Qty')],
                    FreeQty: this.data[i][this.data[0].indexOf('Free')],
                    Rate: this.data[i][this.data[0].indexOf('Rate')],
                    MRP: this.data[i][this.data[0].indexOf('MRP')],
                    CGSTPer: this.data[i][this.data[0].indexOf('CSTPer')],
                    VatPer: this.data[i][this.data[0].indexOf('VATPer')],
                    NetAmount: this.data[i][this.data[0].indexOf('INetAmt')],
                } as ItemNameList);
            }
            this.newGRNEntry(3);
        };

        reader.readAsBinaryString(target.files[0]);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getOptionTextPayment(option) {
        return option && option.StoreName ? option.StoreName : '';
    }

    deleteTableRow(element) {
        let index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsItemNameList.data = [];
            this.dsItemNameList.data = this.chargeslist;
        }
        Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
    }
    getGRNList() {
        var Param = {
            "ToStoreId": this.accountService.currentUserValue.user.storeId,// this._GRNService.GRNSearchGroup.get('ToStoreId').value.storeid,
            "From_Dt": this.datePipe.transform(this._GRNService.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
            "To_Dt": this.datePipe.transform(this._GRNService.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
            "IsVerify": this._GRNService.GRNSearchGroup.get("Status1").value || 0,
            "Supplier_Id": this._GRNService.GRNSearchGroup.get('SupplierId').value.SupplierId || 0,
        }
        //console.log(Param)
        this._GRNService.getGRNList(Param).subscribe(data => {
            this.dsGRNList.data = data as GRNList[];
            this.dsGRNList.sort = this.sort;
            this.dsGRNList.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }

    getToStoreSearchCombo() {
        var vdata = {
            Id: this.accountService.currentUserValue.user.storeId
        }
        this._GRNService.getLoggedStoreList(vdata).subscribe(data => {
            this.StoreList = data;
            this._GRNService.GRNSearchGroup.get('ToStoreId').setValue(this.StoreList[0]);
            this.StoreName = this._GRNService.GRNSearchGroup.get('ToStoreId').value.StoreName;
        });

    }
    getToStoreSearchList() {
        var vdata = {
            Id: this.accountService.currentUserValue.user.storeId
        }
        this._GRNService.getLoggedStoreList(vdata).subscribe(data => {
            this.ToStoreList = data;
            this._GRNService.GRNSearchGroup.get('ToStoreId').setValue(this.ToStoreList[0]);
            this.StoreName = this._GRNService.GRNSearchGroup.get('ToStoreId').value.StoreName;
        });
    }
    filteredOptionssupplier: any;
    noOptionFoundsupplier: any;
    vSupplierId: any;
    getSupplierSearchCombo() {
        var m_data = {
            'SupplierName': `${this._GRNService.GRNSearchGroup.get('SupplierId').value}%`
        }
        //console.log(m_data)
        this._GRNService.getSupplierSearchList(m_data).subscribe(data => {
            this.filteredOptionssupplier = data;
            //  console.log(this.filteredOptionssupplier)
            if (this.filteredOptionssupplier.length == 0) {
                this.noOptionFoundsupplier = true;
            } else {
                this.noOptionFoundsupplier = false;
            }
        });
    }
    getOptionTextSupplier(option) {
        return option && option.SupplierName ? option.SupplierName : '';
    }
    private _filterStore(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            return this.optionsToStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }
    }

    selection = new SelectionModel<GrnItemList>(true, []);
    printBulkQrCode() {
        setTimeout(() => {
            this.SpinLoading = true;
            let data = [];
            this.selection.selected.forEach(element => {
                data.push({ QrCodeData: element["stockid"].toString(), Qty: element.ReceiveQty, Width: 15, Margin: 2, Between: 3 });
            });
            console.log(data)
            const dialogRef = this._matDialog.open(QrcodegeneratorComponent,
                {
                    data: {
                        QrData: data,
                        title: "Grn QR"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
        }, 100);
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dsGrnItemList.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        // if there is a selection then clear that selection
        if (this.isSomeSelected()) {
            this.selection.clear();
        } else {
            this.isAllSelected()
                ? this.selection.clear()
                : this.dsGrnItemList.data.forEach(row => this.selection.select(row));
        }
    }

    isSomeSelected() {
        // console.log(this.selection.selected);
        return this.selection.selected.length > 0;
    }
    getGrnItemDetailList(Params) {
        this.sIsLoading = 'loading-data';
        var Param = {
            "GrnId": Params.GRNID
        }
        this._GRNService.getGrnItemList(Param).subscribe(data => {
            this.dsGrnItemList.data = data as GrnItemList[];
            console.log(this.dsGrnItemList.data)
            // this.dsGrnItemList.sort = this.sort;
            // this.dsGrnItemList.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }
    getSupplierSearchList1() {
        var vdata = {
            'SupplierName': `${this._GRNService.GRNSearchGroup.get('SupplierId').value}%`,
        }
        this._GRNService.getSupplierSearchList(vdata).subscribe(data => {
            this.SupplierList = data;
        });
    }

    onClear() {
    }
    OnReset() {
        this._GRNService.GRNSearchGroup.reset();
        this._GRNService.userFormGroup.reset();
        this.dsItemNameList.data = [];
    }

    delete(elm) {
        this.dsItemNameList.data = this.dsItemNameList.data
            .filter(i => i !== elm)
            .map((i, idx) => (i.position = (idx + 1), i));
    }

    @ViewChild('GRNListTemplate') GRNListTemplate: ElementRef;
    reportPrintObjList: GRNList[] = [];
    printTemplate: any;
    reportPrintObj: GRNList;
    reportPrintObjTax: GRNList;
    subscriptionArr: Subscription[] = [];
    TotalAmt: any = 0;
    TotalQty: any = 0;
    TotalRate: any = 0;
    TotalNetAmt: any = 0;
    TotalDiscPer: any = 0;
    TotalCGSTPer: any = 0;
    TotalSGSTPer: any = 0;
    TotalGSTAmt: any = 0;
    TotalCGSTAmt: any = 0;
    TotalSGSTAmt: any = 0;
    TotalNetAmount: any = 0;
    TotalOtherCharge: any = 0;
    finalamt: any = 0;

    openQrCodePrintDialog(row) {
        setTimeout(() => {
            this.SpinLoading = true;
            const dialogRef = this._matDialog.open(QrcodegeneratorComponent,
                {
                    data: {
                        QrCodeData: row.stockid,
                        Qty: row.ReceiveQty,
                        title: "Grn QR"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
        }, 100);
    }

    viewgetGRNReportPdf(row) {
        debugger
        setTimeout(() => {
            this.SpinLoading = true;
            this._GRNService.getGRNreportview(
                row.GRNID
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "95vw",
                        height: '850px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "GRN REPORT Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
            });

        }, 100);
    }

    LastThreeItemList(contact) {
        var vdata = {
            'ItemId': contact.ItemId,
        }
        this._GRNService.getLastThreeItemInfo(vdata).subscribe(data => {
            this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
        });
    }

    newGRNEntry(chkNewGRN) {
        const dialogRef = this._matDialog.open(UpdateGRNComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    chkNewGRN: chkNewGRN,
                    FullData: this.FullData
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getGRNList();
        });
        this.getGRNList();
    }

    GRNEmail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
        this.getGRNList();
    }

    onEdit(contact) {
        this.chkNewGRN = 2;
        console.log(contact)
        const dialogRef = this._matDialog.open(UpdateGRNComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    Obj: contact,
                    chkNewGRN: this.chkNewGRN
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getGRNList();
        });
    }

    Onbarcode(contact){
        const dialogRef = this._matDialog.open(BarcodeSaveComponent,
            {
                width:"60%",
                height:"45%",
                data:{
                    Obj:contact
                }
            });
            dialogRef.afterClosed().subscribe(result =>{
                console.log('The dialog was closed - Insert Action', result);
                this.getGRNList();
            })

            this.LastThreeItemList(contact)
    }

    onVerify(row) {
        let updateGRNVerifyStatusobj = {};
        updateGRNVerifyStatusobj['GRNID'] = row.GRNID;
        updateGRNVerifyStatusobj['IsVerifiedUserId'] = this.accountService.currentUserValue.user.id;
        let submitObj = {
            "updateGRNVerifyStatus": updateGRNVerifyStatusobj
        }
        this._GRNService.getVerifyGRN(submitObj).subscribe(response => {
            if (response) {
                this.toastr.success('Record Verified Successfully.', 'Verified !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
                this.getGRNList();
            } else {
                this.toastr.error('Record Not Verified !, Please check error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
            // this.isLoading = '';
        },
            success => {
                this.toastr.success('Record Verified Successfully.', 'Verified !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });

            });
        this.getGRNList();
    }


    getWhatsappshareSales(el) {
        var m_data = {
            "insertWhatsappsmsInfo": {
                "mobileNumber": 22,//el.RegNo,
                "smsString": "Dear" + el.PatientName + ",Your GRN has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
                "isSent": 0,
                "smsType": 'GRN',
                "smsFlag": 0,
                "smsDate": this.currentDate,
                "tranNo": el.GRNID,
                "PatientType": 2,//el.PatientType,
                "templateId": 0,
                "smSurl": "info@gmail.com",
                "filePath": this.Filepath || '',
                "smsOutGoingID": 0

            }
        }
        this._GRNService.InsertWhatsappGRN(m_data).subscribe(response => {
            if (response) {
                Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
                    if (result.isConfirmed) {
                        this._matDialog.closeAll();
                    }
                });
            } else {
                Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
            }

        });
        this.IsLoading = false;
        el.button.disable = false;
    }
    RowData: any = [];
    deleteRow(row) {
        // debugger
        // this.RowData = this.dsItemNameList.data;
        // const index = this.RowData.data.indexOf(row);
        // console.log(index);
        // if (index >= 0) {
        //   this.RowData.data.splice(index, 1);
        //   // this.dsItemNameList.data = [];
        //    this.dsItemNameList = this.RowData.data;
        //    console.log(this.dsItemNameList.data);
        // }
        // this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        //   toastClass: 'tostr-tost custom-toast-success',
        // });
        // //this.getGRNList();
    }


    EditSupplier:boolean=false;
    ExpDateenableEditing(row:GRNList) {
      row.EditSupplier = true;
      row.SupplierName = ''; 
    }
    supplieredisableEditing(row:GRNList) {
      row.EditSupplier = false;
      this.getGRNList();
    }
    EditSupplierId:any;
    DropDownValue(Obj){ 
      console.log(Obj)
      console.log(Obj.SupplierId)
      this.EditSupplierId = Obj.SupplierId;
 
    }
    OnSaveEditSupplier(contact){
      console.log(contact)
    let Query 
    Query = "update T_GRNHeader set SupplierId = " + this.EditSupplierId  + "where grnid =" + contact.GRNID ;
    this._GRNService.UpdateSupplierName(Query).subscribe(response =>{
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getGRNList();
      }
      else {
        this.toastr.error('Record Data not Updated !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }  
    });
    }
    editfilteredOptionssupplier:any;
    EditSupplierName(contact) {
        console.log(contact)
        var m_data = {
            'SupplierName': `${this._GRNService.GRNSearchGroup.get('EditSupplierId').value}%`
        }
        //console.log(m_data)
        this._GRNService.getSupplierSearchList(m_data).subscribe(data => {
            this.editfilteredOptionssupplier = data;
            //  console.log(this.filteredOptionssupplier)
            if (this.filteredOptionssupplier.length == 0) {
                this.noOptionFoundsupplier = true;
            } else {
                this.noOptionFoundsupplier = false;
            }
        });
         console.log(this._GRNService.GRNSearchGroup.get('EditSupplierId').value)
         contact.SupplierName = ''; 
   
    }  
}

export class GRNList {
    EditSupplier:any;
    GrnNumber: number;
    GRNDate: number;
    GRNTime: any;
    InvoiceNo: number;
    SupplierName: string;
    TotalAmount: any;
    TotalDiscAmount: any;
    TotalVATAmount: any;
    NetAmount: any;
    RoundingAmt: number;
    DebitNote: number;
    CreditNote: number;
    InvDate: number;
    Cash_CreditType: string;
    ReceivedBy: any;
    IsClosed: any;
    GSTNo: any;
    Remark: any;
    Mobile: any;
    Address: any;
    Email: any;
    Phone: any;
    PONo: any;
    EwayBillNo: any;
    EwayBillDate: Date;
    OtherCharge: any;
    Rate: any;
    CGSTPer: any;
    SGSTPer: any;
    CGSTAmt: any;
    SGSTAmt: any;
    NetPayble: any
    AddedByName: any;
    GrandTotalAount: any;
    TotCGSTAmt: any;
    TotSGSTAmt: any;

    /**
     * Constructor
     *
     * @param GRNList
     */
    constructor(GRNList) {
        {
            this.GrnNumber = GRNList.GrnNumber || 0;
            this.GRNDate = GRNList.GRNDate || 0;
            this.GRNTime = GRNList.GRNTime || '';
            this.InvoiceNo = GRNList.InvoiceNo || 0;
            this.SupplierName = GRNList.SupplierName || "";
            this.TotalAmount = GRNList.TotalAmount || 0;
            this.TotalDiscAmount = GRNList.TotalDiscAmount || 0;
            this.TotalVATAmount = GRNList.TotalVATAmount || 0;
            this.NetPayble = GRNList.NetPayble || 0;
            this.NetAmount = GRNList.NetAmount || 0;
            this.RoundingAmt = GRNList.RoundingAmt || 0;
            this.DebitNote = GRNList.DebitNote || 0;
            this.CreditNote = GRNList.CreditNote || 0;
            this.InvDate = GRNList.InvDate || 0;
            this.Cash_CreditType = GRNList.Cash_CreditType || "";
            this.ReceivedBy = GRNList.ReceivedBy || 0;
            this.IsClosed = GRNList.IsClosed || 0;
            this.GSTNo = GRNList.GSTNo || 0;
            this.Remark = GRNList.Remark || "";
            this.TotSGSTAmt = GRNList.TotSGSTAmt || 0;
            this.TotCGSTAmt = GRNList.TotCGSTAmt || 0;
        }
    }
}

export class GrnItemList {

    ItemID: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    ReceiveQty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    ConversionFactor: number;
    VatPercentage: number;
    DiscPercentage: number;
    LandedRate: number;
    NetAmount: number;
    TotalQty: number;

    /**
     * Constructor
     *
     * @param GrnItemList
     */
    constructor(GrnItemList) {
        {

            this.ItemID = GrnItemList.ItemID || 0;
            this.ItemName = GrnItemList.ItemName || "";
            this.BatchNo = GrnItemList.BatchNo || 0;
            this.BatchExpDate = GrnItemList.BatchExpDate || 0;
            this.ReceiveQty = GrnItemList.ReceiveQty || 0;
            this.FreeQty = GrnItemList.FreeQty || 0;
            this.MRP = GrnItemList.MRP || 0;
            this.Rate = GrnItemList.Rate || 0;
            this.TotalAmount = GrnItemList.TotalAmount || 0;
            this.ConversionFactor = GrnItemList.ConversionFactor || 0;
            this.VatPercentage = GrnItemList.VatPercentage || 0;
            this.DiscPercentage = GrnItemList.DiscPercentage || 0;
            this.LandedRate = GrnItemList.LandedRate || 0;
            this.NetAmount = GrnItemList.NetAmount || 0;
            this.TotalQty = GrnItemList.TotalQty || 0;

        }
    }
}

export class ItemNameList {
    // Action: string;

    ItemName: string;
    UOMId: number;
    HSNCode: number;
    BatchNo: number;
    ExpDate: number;
    Qty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    Disc: number;
    DisAmount: number;
    GSTNo: number;
    GSTAmount: number;
    CGST: number;
    CGSTAmount: number;
    SGST: number;
    SGSTAmount: number;
    IGST: number;
    IGSTAmount: number;
    NetAmount: number;
    position: number;
    ItemID: any;
    ItemId: any;
    VatPer: any;
    VatAmt: any;
    MRP_Strip: any;
    GRNId: any;
    GRNID: any;
    InvoiceNo: any;
    GateEntryNo: any;
    SupplierId: any;
    GrnNumber: any;
    OtherCharge: any;
    DebitNote: any;
    CreditNote: any;
    RoundingAmt: any;
    InvDate: Date;
    PaymentDate: Date;
    TotalDiscAmount: any;
    ReceivedBy: any;
    Remark: any;
    StoreId: any;
    totalVATAmount: any;
    ConversionFactor: any;
    ReceiveQty: any;
    CGSTAmt: number;
    CGSTPer: number;
    SGSTAmt: number;
    SGSTPer: number;
    IGSTPer: number;
    IGSTAmt: number;
    HSNcode: any;
    VatAmount: number;
    VatPercentage: number;
    id: number;
    ConstantId: number;
    discPercentage: number;
    discAmount: number;
    DiscPercentage: number;
    DiscAmount: number;
    DiscPer2: number;
    DiscAmt2: number;
    PaymentType: any;
    GRNType: any;
    DateOfInvoice: any;
    EwayBillDate: Date;
    CurrentDate = new Date();
    Tranprocessmode: any;
    Cash_CreditType: any;
    tranProcessMode: any;
    EwayBillNo: any;
    TotalQty: any;
    UnitofMeasurementName: number;
    UnitofMeasurementId: any;
    POBalQty: any;
    PurchaseId: any;
    IsClosed: boolean;
    PurDetId: any;
    LandedRate: any;
    PurUnitRate: any;
    PurUnitRateWF: any;
    BatchExpDate: any;
    POQty: any;
    ItemDiscAmount: any;
    DiscPer: any;
    ItemTotalAmount: any;
    UOMID: any;
    GrandTotalAmount: any;
    TranProcessId: any;
    UnitMRP: any;
    IsVerified: any;
    IsVerifiedDatetime: any;
    IsVerifiedUserId: any;
    StkID: any;
    IsVerifiedId: any
    VerifiedDateTime: any;
    PurchaseID: any;
    PurchaseNo: any;
    SupplierName: any;
    SrNo: number;
    /**
     * Constructor
     *
     * @param ItemNameList
     */
    constructor(ItemNameList) {
        {

            this.ItemName = ItemNameList.ItemName || "";
            this.UOMId = ItemNameList.UOMId || 0;
            this.HSNCode = ItemNameList.HSNCode || 0;
            this.BatchNo = ItemNameList.BatchNo || 0;
            this.ExpDate = ItemNameList.ExpDate || 0;
            this.Qty = ItemNameList.Qty || 0;
            this.FreeQty = ItemNameList.FreeQty || 0;
            this.MRP = ItemNameList.MRP || 0;
            this.Rate = ItemNameList.Rate || 0;
            this.TotalAmount = ItemNameList.TotalAmount || 0;
            this.Disc = ItemNameList.Disc || '';
            this.DisAmount = ItemNameList.DisAmount || 0;
            this.DiscPer2 = ItemNameList.DiscPer2 || 0;
            this.DiscAmt2 = ItemNameList.DiscAmt2 || 0;
            this.GSTNo = ItemNameList.GSTNo || 0;
            this.GSTAmount = ItemNameList.GSTAmount || 0;
            this.CGST = ItemNameList.CGST || 0;
            this.CGSTAmount = ItemNameList.CGSTAmount || 0;
            this.SGST = ItemNameList.SGST || 0;
            this.SGSTAmount = ItemNameList.SGSTAmount || 0;
            this.IGST = ItemNameList.IGST || 0;
            this.IGSTAmount = ItemNameList.IGSTAmount || 0;
            this.NetAmount = ItemNameList.NetAmount || 0;
            this.ItemID = ItemNameList.ItemID || 0;
            this.ItemId = ItemNameList.ItemId || 0;
            this.VatPer = ItemNameList.VatPer || 0;
            this.VatAmt = ItemNameList.VatAmt || 0;
            this.MRP_Strip = ItemNameList.MRP_Strip || 0;
            this.GRNId = ItemNameList.GRNId || 0;
            this.GRNID = ItemNameList.GRNID || 0;
            this.InvoiceNo = ItemNameList.InvoiceNo || 0;
            this.GateEntryNo = ItemNameList.GateEntryNo || 0;
            this.SupplierId = ItemNameList.SupplierId || 0;
            this.GrnNumber = ItemNameList.GrnNumber || 0;
            this.OtherCharge = ItemNameList.OtherCharge || 0;
            this.DebitNote = ItemNameList.DebitNote || 0;
            this.CreditNote = ItemNameList.CreditNote || 0;
            this.RoundingAmt = ItemNameList.RoundingAmt || 0;
            this.InvDate = ItemNameList.InvDate || this.CurrentDate;;
            this.TotalDiscAmount = ItemNameList.TotalDiscAmount || 0;
            this.totalVATAmount = ItemNameList.totalVATAmount || 0;
            this.ReceivedBy = ItemNameList.ReceivedBy || ''
            this.Remark = ItemNameList.Remark || ''
            this.StoreId = ItemNameList.StoreId || 0;
            this.TotalQty = ItemNameList.TotalQty || 0;
            this.EwayBillNo = ItemNameList.EwayBillNo || 0;
            this.Tranprocessmode = ItemNameList.Tranprocessmode || "";
            this.EwayBillDate = ItemNameList.EwayBillDate || this.CurrentDate;
            this.PaymentDate = ItemNameList.PaymentDate || this.CurrentDate;
            this.DateOfInvoice = ItemNameList.DateOfInvoice || this.CurrentDate;
            this.LandedRate = ItemNameList.LandedRate || 0;
            this.PurUnitRate = ItemNameList.PurUnitRate || 0;
            this.PurUnitRateWF = ItemNameList.PurUnitRateWF || 0;
            this.BatchExpDate = ItemNameList.BatchExpDate || 0;
            this.PurchaseId = ItemNameList.PurchaseId || 0;
            this.ItemDiscAmount = ItemNameList.ItemDiscAmount || 0;
            this.DiscPer = ItemNameList.DiscPer || 0;
            this.ItemTotalAmount = ItemNameList.ItemTotalAmount || 0;
            this.UOMID = ItemNameList.UOMID || 0;
            this.GrandTotalAmount = ItemNameList.GrandTotalAmount || 0;
            this.UnitMRP = ItemNameList.UnitMRP || 0;
            this.IsVerified = ItemNameList.IsVerified || 0;
            this.IsVerifiedDatetime = ItemNameList.IsVerifiedDatetime || 0;
            this.IsVerifiedUserId = ItemNameList.IsVerifiedUserId || 0;
            this.StkID = ItemNameList.StkID || 0;
            this.IsVerifiedId = ItemNameList.IsVerifiedId || 0;
            this.VerifiedDateTime = ItemNameList.VerifiedDateTime || 0;
            this.ReceiveQty = ItemNameList.ReceiveQty || 0
            this.ConversionFactor = ItemNameList.ConversionFactor || 0
            this.SrNo = ItemNameList.SrNo || 0;
            this.PurchaseNo = ItemNameList.PurchaseNo || 0;
        }
    }
}
export class LastThreeItemList {
    ItemID: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    ReceiveQty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    ConversionFactor: number;
    VatPercentage: number;

    constructor(LastThreeItemList) {
        {

            this.ItemID = LastThreeItemList.ItemID || 0;
            this.ItemName = LastThreeItemList.ItemName || "";
            this.BatchNo = LastThreeItemList.BatchNo || 0;
            this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
            this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
            this.FreeQty = LastThreeItemList.FreeQty || 0;
            this.MRP = LastThreeItemList.MRP || 0;

        }
    }
}
