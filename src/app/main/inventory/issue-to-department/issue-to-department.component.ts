import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IssueToDepartmentService } from './issue-to-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, indexOf, round, values } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from "rxjs/operators";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { IssueToDeparmentAgainstIndentComponent } from './issue-to-deparment-against-indent/issue-to-deparment-against-indent.component';

@Component({
    selector: 'app-issue-to-department',
    templateUrl: './issue-to-department.component.html',
    styleUrls: ['./issue-to-department.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
    vBarcode: any = 0;
    tempDatasource = new MatTableDataSource<IssueItemList>();
    BarcodetempDatasource: any[];
    Addflag: boolean = false;
    vBarcodeflag: boolean = false;
    SpinLoading: boolean = false;
    vprintflag: boolean = false;
    vsaveflag: boolean = true;
    vremark: any = '';

    displayedColumns: string[] = [
        'IssueNo',
        'IssueDate',
        'FromStoreName',
        'ToStoreName',
        'Addedby',
        'TotalAmount',
        'TotalVatAmount',
        'NetAmount',
        'Remark',
        'Receivedby',
        'action'
    ];
    displayedColumns1: string[] = [
        'ItemName',
        'BatchNo',
        'BatchExpDate',
        'Qty',
        'VatPercentage',
        'PerUnitLandedRate',
        'LandedTotalAmount',
    ]

    displayedNewIssuesList3: string[] = [
        'ItemId',
        'ItemName',
        'BatchNO',
        'ExpDate',
        'BalanceQty',
        'Qty',
        'UnitRate',
        'GSTPer',
        'GSTAmount',
        'TotalAmount',
        'Action'
    ];
    displayedNewIssuesList1: string[] = [
        'ItemName',
        'Qty',
        'Action'
    ]
    displayedNewIssuesList2: string[] = [
        'BatchNo',
        'ExpDateNo',
        'BalQty'
    ]
    hasSelectedContacts: boolean;
    isItemIdSelected: boolean = false;
    sIsLoading: string = '';
    isLoading = true;
    ToStoreList: any = [];
    FromStoreList: any = [];
    screenFromString = 'admission-form';
    filteredOptions: any;
    isStoreSelected: boolean = false;
    showAutocomplete = false;
    noOptionFound: boolean = false;
    ItemCode: any;
    ItemName: any;
    Qty: any;
    filteredOptionsItem: any;
    ItemId: any;
    BalanceQty: any;
    vBatchNo: any;
    vBatchExpDate: any;
    vUnitMRP: any;
    vQty: any = 0;
    IssQty: any;
    vBal: any;
    StoreName: any;
    GSTPer: any;
    vMRP: any;
    DiscPer: any = 0;
    vDiscAmt: any = 0;
    vNetAmt: any = 0;
    vTotalMRP: any = 0;
    vBalanceQty: any;
    currentDate = new Date();
    vVatPer: any;
    vCgstPer: any;
    vSgstPer: any;
    vIgstPer: any;
    vTotalAmount: any;
    vVatAmount: any;
    vStockId: any;
    vStoreId: any;
    vLandedRate: any;
    vPurchaseRate: any;
    vItemObj: NewIssueList3;
    chargeslist: any = [];
    vItemID: any;
    FromStoreList1: any = [];
    ToStoreList1: any = [];
    vFinalTotalAmount: any;
    vFinalNetAmount: any;
    vFinalGSTAmount: any;
    ItemID: any;
    dateTimeObj: any;
    filteredOptionsStore: Observable<string[]>;
    filteredOptionsStoreList: Observable<string[]>;

    dsIssueToDep = new MatTableDataSource<IssueToDep>();
    dsIssueItemList = new MatTableDataSource<IssueItemList>();
    dsNewIssueList1 = new MatTableDataSource<IssueItemList>();
    dsNewIssueList2 = new MatTableDataSource<NewIssueList3>();
    dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();
    dsTempItemNameList = new MatTableDataSource<NewIssueList3>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public ToStoreFilterCtrl: FormControl = new FormControl();
    public filteredToStore: ReplaySubject<any> = new ReplaySubject<any>(1);
    private _onDestroy = new Subject<void>();
    constructor(
        public _IssueToDep: IssueToDepartmentService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        private reportDownloadService: ExcelDownloadService,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        private _loggedService: AuthenticationService

    ) { }

    ngOnInit(): void {
        this.getToStoreSearchList();
        this.gePharStoreList();
        this.getToStoreList();
        this.getPharStoreList();
        this.getIssueToDep();

        this.filteredOptionsStore = this._IssueToDep.NewIssueGroup.get('ToStoreId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterToStore(value)),
        );
        this.filteredOptionsStoreList = this._IssueToDep.IssueSearchGroup.get('ToStoreId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterToStoreList(value)),
        );
    }

    // Added by nikunj temporary
    getIssueToDepList() { }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    private _filterToStoreList(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            return this.ToStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextStoresList(option) {
        return option && option.StoreName ? option.StoreName : '';
    }
    getToStoreSearchList() {
        this._IssueToDep.getToStoreSearchList().subscribe(data => {
            this.ToStoreList = data;
        });
    }
    gePharStoreList() {
        var vdata = {
            Id: this._loggedService.currentUserValue.user.storeId
        }
        this._IssueToDep.getLoggedStoreList(vdata).subscribe(data => {
            this.FromStoreList = data;
            this._IssueToDep.IssueSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0])
        });
    }
    getIssueToDep() {
        this.sIsLoading = 'loading-data';
        var vdata = {
            "FromStoreId": this._loggedService.currentUserValue.user.storeId,
            "ToStoreId": this._IssueToDep.IssueSearchGroup.get('ToStoreId').value.StoreId || 0,
            "From_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
            "To_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
            "IsVerify": 0,
        }
        this._IssueToDep.getIssueToDepList(vdata).subscribe(data => {
            this.dsIssueToDep.data = data as IssueToDep[];
            this.dsIssueToDep.sort = this.sort;
            this.dsIssueToDep.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }

    getIssueItemwiseList(Param) {
        var vdata = {
            "IssueId": Param.IssueId
        }
        this._IssueToDep.getIssueItemList(vdata).subscribe(data => {
            this.dsIssueItemList.data = data as IssueItemList[];
            console.log(this.dsIssueItemList)
            this.dsIssueItemList.sort = this.sort;
            this.dsIssueItemList.paginator = this.paginator;
        });
    }
    //second tab
    getSearchItemList() {
        var m_data = {
            "ItemName": `${this._IssueToDep.NewIssueGroup.get('ItemID').value}%`,
            "StoreId": this._IssueToDep.StoreFrom.get('FromStoreId').value.storeid
        }
        this._IssueToDep.getItemlist(m_data).subscribe(data => {
            this.filteredOptionsItem = data;
            this.filteredOptionsItem = data;
            if (this.filteredOptionsItem.length == 0) {
                this.noOptionFound = true;
            } else {
                this.noOptionFound = false;
            }
        });
    }
    getOptionItemText(option) {
        if (!option) return '';
        return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')' + ' (' + option.UnitMRP + ')';
    }
    getSelectedObjItem(obj) {
        this.ItemName = obj.ItemName;
        this.ItemID = obj.ItemId;
        this.BalanceQty = obj.BalanceQty;
        if (this.BalanceQty > 0) {
            this.getBatch();
        }
    }
    getToStoreList() {
        this._IssueToDep.getToStoreSearchList().subscribe(data => {
            this.ToStoreList1 = data;
        });
    }
    private _filterToStore(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            return this.ToStoreList1.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextStores(option) {
        return option && option.StoreName ? option.StoreName : '';
    }

    getPharStoreList() {
        var vdata = {
            Id: this._loggedService.currentUserValue.user.storeId
        }
        this._IssueToDep.getLoggedStoreList(vdata).subscribe(data => {
            this.FromStoreList1 = data;
            this._IssueToDep.StoreFrom.get('FromStoreId').setValue(this.FromStoreList1[0])
        });
    }

    Itemchargeslist1: any = [];
    QtyBalchk: any = 0;
    Itemflag: boolean = false;

    onAddBarcodeItemList(contact, DraftQty) {
        console.log(contact)
        this.vBarcodeflag = true;
        let i = 0;
        if (this.dsNewIssueList3.data.length > 0) {

            this.dsNewIssueList3.data.forEach((element) => {
                if (element.ItemId == contact.ItemId) {
                    this.Itemflag = true;
                    // this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                    //     toastClass: 'tostr-tost custom-toast-warning',
                    // });
                    if (contact.IssueQty != null) {
                        this.DraftQty = element.Qty + contact.IssueQty;
                    } else {
                        this.DraftQty = element.Qty + 1;
                    }
                    let TotalMRP = (parseInt(this.DraftQty) * (contact.UnitMRP)).toFixed(2);
                    let Vatamount = ((parseFloat(TotalMRP) * (contact.VatPercentage)) / 100).toFixed(2)
                    let vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);


                    // let TotalMRP = (parseInt(this.DraftQty) * (contact.UnitMRP)).toFixed(2);
                    // let Vatamount = ((parseFloat(TotalMRP) * (contact.VatPercentage)) / 100).toFixed(2)
                    // let vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);
                    let LandedRateandedTotal = (parseInt(this.DraftQty) * (contact.LandedRate)).toFixed(2);
                    let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
                    let PurTotAmt = (parseInt(this.DraftQty) * (contact.PurUnitRateWF)).toFixed(2);

                    let CGSTAmt = (((contact.UnitMRP) * (contact.CgstPer) / 100) * (this.DraftQty)).toFixed(2);
                    let SGSTAmt = (((contact.UnitMRP) * (contact.SgstPer) / 100) * (this.DraftQty)).toFixed(2);
                    let IGSTAmt = (((contact.UnitMRP) * (contact.IgstPer) / 100) * (this.DraftQty)).toFixed(2);

                    // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

                    let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
                    let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);




                    // this.dsNewIssueList3.data[i].Qty = this.DraftQty;
                    // this.dsNewIssueList3.data[i].VatAmount = Vatamount;
                    // this.dsNewIssueList3.data[i].TotalAmount = TotalMRP;
                    // this.dsNewIssueList3.data[i].NetAmount = vFinalNetAmount;


                    this.dsNewIssueList3.data[i].Qty = this.DraftQty;
                    this.dsNewIssueList3.data[i].VatAmount = Vatamount;
                    this.dsNewIssueList3.data[i].TotalAmount = TotalMRP;
                    this.dsNewIssueList3.data[i].NetAmt = vFinalNetAmount;
                    this.dsNewIssueList3.data[i].TotalMRP = TotalMRP;
                    this.dsNewIssueList3.data[i].VatAmount = Vatamount;
                    this.dsNewIssueList3.data[i].TotalAmount = TotalMRP;
                    this.dsNewIssueList3.data[i].NetAmt = NetAmt;
                    this.dsNewIssueList3.data[i].UnitMRP = contact.UnitMRP;
                    this.dsNewIssueList3.data[i].DiscPer = contact.DiscPer;
                    this.dsNewIssueList3.data[i].DiscAmt = DiscAmt;
                
                    this.dsNewIssueList3.data[i].CGSTAmt = CGSTAmt;
                    this.dsNewIssueList3.data[i].SGSTAmt = SGSTAmt;
                    this.dsNewIssueList3.data[i].IGSTAmt = IGSTAmt;

                    this.dsNewIssueList3.data[i].CgstPer = contact.CGSTPer;
                    this.dsNewIssueList3.data[i].SgstPer = contact.SGSTPer;
                    this.dsNewIssueList3.data[i].IgstPer = contact.IGSTPer;

                    this.dsNewIssueList3.data[i].LandedRate = contact.LandedRate;
                    this.dsNewIssueList3.data[i].StockId = contact.StockId;
                    // this.dsNewIssueList3.data[i].PurchaseRate = contact.PurUnitRateWF;
                    // this.dsNewIssueList3.data[i].PurTotAmt = PurTotAmt;

                    // this.dsNewIssueList3.data[i].BalanceQty = BalQty;
                }
                i++;
            });

        }
        if (!this.Itemflag) {
            let TotalMRP = (parseInt(this.DraftQty) * (contact.UnitMRP)).toFixed(2);
            let Vatamount = ((parseFloat(TotalMRP) * (contact.VatPercentage)) / 100).toFixed(2)
            let TotalNet = TotalMRP + Vatamount

            let LandedRateandedTotal = (parseInt(this.DraftQty) * (contact.LandedRate)).toFixed(2);
            let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
            let PurTotAmt = (parseInt(this.DraftQty) * (contact.PurUnitRateWF)).toFixed(2);

            let CGSTAmt = (((contact.UnitMRP) * (contact.CGSTPer) / 100) * (this.DraftQty)).toFixed(2);
            let SGSTAmt = (((contact.UnitMRP) * (contact.SGSTPer) / 100) * (this.DraftQty)).toFixed(2);
            let IGSTAmt = (((contact.UnitMRP) * (contact.IGSTPer) / 100) * (this.DraftQty)).toFixed(2);

            // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

            let DiscAmt = ((parseFloat(LandedRateandedTotal) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
            let NetAmt = (parseFloat(LandedRateandedTotal) - parseFloat(DiscAmt)).toFixed(2);



            this.chargeslist.push(
                {
                    ItemId: contact.ItemId || 0,
                    ItemName: contact.ItemName || '',
                    BatchNo: contact.BatchNo,

                    BalanceQty: contact.BalanceQty || 0,
                    Qty: this.DraftQty || 0,
                    UnitRate: contact.UnitMRP || 0,
                    VatPer: contact.VatPercentage || 0,
                    VatAmount: ((parseFloat(LandedRateandedTotal) * (contact.VatPercentage)) / 100).toFixed(2),
                    TotalAmount: LandedRateandedTotal || 0,
                    NetAmount: TotalNet || 0,


                    BatchExpDate: this.datePipe.transform(contact.BatchExpDate, "yyyy-MM-dd") || '01/01/1900',

                    UnitMRP: contact.LandedRate,
                    GSTPer: contact.VatPer || 0,
                    GSTAmount: Vatamount || 0,
                    TotalMRP: LandedRateandedTotal || TotalMRP,
                    DiscPer: contact.DiscPer,
                    DiscAmt: DiscAmt || 0,
                    NetAmt: TotalNet,
                    RoundNetAmt: parseInt(TotalNet),// Math.round(TotalNet),
                    StockId: contact.StockId,
                    LandedRate: contact.LandedRate,
                    LandedRateandedTotal: LandedRateandedTotal,
                    CgstPer: contact.CGSTPer,
                    CGSTAmt: CGSTAmt,
                    SgstPer: contact.SGSTPer,
                    SGSTAmt: SGSTAmt,
                    IgstPer: contact.IGSTPer,
                    IGSTAmt: IGSTAmt,
                    PurchaseRate: contact.PurUnitRateWF,
                    PurTotAmt: PurTotAmt,
                    MarginAmt: v_marginamt,
                    SalesDraftId: 1
                });
            console.log(this.chargeslist);
            // });

        }
        this.dsNewIssueList3.data = this.chargeslist
        console.log(this.dsNewIssueList3.data)
        this.vBarcode = 0;
        // this.vBarcodeflag=false;
    }


    tempdata: any = [];
    onAdd($event) {
        
        if (this.vBarcode == 0) {

            if ((this.vItemID == '' || this.vItemID == null || this.vItemID == undefined)) {
                this.toastr.warning('Please enter a item', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
                this.toastr.warning('Please enter a Qty', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

        }

        if (!this.vBarcodeflag) {
            // const isDuplicate = this.dsNewIssueList3.data.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId);
            // if (!isDuplicate) {
            let gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));

            this.chargeslist = this.dsTempItemNameList.data;
            // if (this.dsNewIssueList3.data.length > 0) {
            //   this.chargeslist = this.dsNewIssueList3.data;
            // }


            let TotalMRP = this.vUnitMRP * this.vQty
            let PurTotAmt = this.vPurchaseRate * this.vQty

            let LandedRateandedTotal = this.vLandedRate * this.vQty

            let GSTAmount = (((this.vUnitMRP) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(2);
            // let  CGSTAmt = (((contact.LandedRate) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
            // let  SGSTAmt = (((contact.LandedRate) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
            // let  IGSTAmt = (((contact.LandedRate) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);




            this.chargeslist.push(
                {
                    ItemId: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId || 0,
                    ItemName: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemName || '',
                    BatchNo: this.vBatchNo,
                    BatchExpDate: this.vBatchExpDate || '01/01/1900',
                    BalanceQty: this.vBalanceQty || 0,
                    Qty: this.vQty || 0,
                    UnitRate: this.vLandedRate || 0,
                    UnitMRP:this.vUnitMRP || 0,
                    VatPer: gstper || 0,
                    VatAmount: (((this.vTotalAmount) * (gstper)) / 100).toFixed(2),
                    TotalAmount: this.vTotalAmount || 0,
                    StockId: this.vStockId,

                    TotalMRP: TotalMRP,
                    DiscPer: 0,// contact.DiscPer || 0,
                    DiscAmt: 0,
                    NetAmt: LandedRateandedTotal,
                    RoundNetAmt: Math.round(LandedRateandedTotal),// Math.round(TotalNet),
                    mrpTotalAmount:TotalMRP,

                    LandedRate: this.vLandedRate,
                    LandedRateandedTotal: LandedRateandedTotal,
                    CgstPer: this.vCgstPer,
                    //   CGSTAmt: CGSTAmt,
                    SgstPer: this.vSgstPer,
                    //   SGSTAmt: SGSTAmt,
                    IgstPer: this.vIgstPer,
                    //   IGSTAmt: IGSTAmt,
                    PurchaseRate: this.vPurchaseRate,
                    PurTotAmt: PurTotAmt,
                    purTotalAmount: PurTotAmt,
                    //   MarginAmt: v_marginamt,
                    SalesDraftId: 1
                });
            console.log(this.chargeslist);
            this.dsNewIssueList3.data = this.chargeslist
            // } else {
            //     this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            //         toastClass: 'tostr-tost custom-toast-warning',
            //     });
            // }
        }



        this.ItemReset();
        this.itemid.nativeElement.focus();
        this._IssueToDep.NewIssueGroup.get('ItemID').setValue('');
        this.Addflag = false;


        // &&   this.vFinalNetAmount > 0 
        
        if (!(this._IssueToDep.NewIssueGroup.invalid) && this.dsNewIssueList3.data.length > 0) {
            this.vsaveflag = false;
        }
    }

    // chkSaveflag(){

    //     if(this.vremark ! ='')
    //     if ((this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId) && this.dsNewIssueList3.data.length > 0) {
    //         this.vsaveflag = false;
    //     }
    // }


    AddIndentItem(contact) {
        console.log(contact)
        let DuplicateItem=0;
        
        if (this.dsNewIssueList3.data.length > 0) {
            this.dsNewIssueList3.data.forEach((element) => {
                if (element.ItemId == contact.ItemId) {
                    // Swal.fire('Selected Item already added in the list');
                    this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    DuplicateItem=1
                    //add Duplicate

                    // var m_data = {
                    //     "ItemId": contact.ItemId,
                    //     "StoreId": this._loggedService.currentUserValue.user.storeId || 0
                    // }
                    // this._IssueToDep.getIndentItemBatch(m_data).subscribe(draftdata => {
                    //     console.log(draftdata)
                    //     this.Itemchargeslist1 = draftdata as any;
                    //     if (this.Itemchargeslist1.length == 0) {
                    //         Swal.fire(contact.ItemId + " : " + "Item Stock is Not Avilable:")
                    //     }
                    //     else if (this.Itemchargeslist1.length > 0) {
                    //         let ItemID=contact.ItemId;
                    //         this.Itemchargeslist1.forEach((element) => {

                    //             let IndQty=contact.Qty

                    //             if (ItemID != element.ItemId) {
                    //                 this.QtyBalchk = 0;
                    //             }
                    //             if (this.QtyBalchk != 1) {
                    //                 if (IndQty <= element.BalanceQty) {
                    //                     this.QtyBalchk = 1;
                    //                       this.getFinalCalculation(element, contact.Qty);
                    //                     ItemID = element.ItemId;
                    //                 }
                    //                 else if(IndQty > element.BalanceQty){
                    //                     Swal.fire("Balance Qty is :", element.Qty)
                    //                     this.QtyBalchk = 0;
                    //                     Swal.fire("Balance Qty is Less than Selected Item Qty for Item :" + element.ItemId + "Balance Qty:", element.BalanceQty)
                    //                 }
                    //             }
                    //         });
                    //     }

                    // });


                    //end
                }
            });
        }
        //   else  {
            
if(!DuplicateItem){
        this.Itemchargeslist1 = [];
        this.QtyBalchk = 0;

        var m_data = {
            "ItemId": contact.ItemId,
            "StoreId": this._loggedService.currentUserValue.user.storeId || 0
        }
        this._IssueToDep.getIndentItemBatch(m_data).subscribe(draftdata => {
            console.log(draftdata)
            this.Itemchargeslist1 = draftdata as any;
            if (this.Itemchargeslist1.length == 0) {
                Swal.fire(contact.ItemId + " : " + "Item Stock is Not Avilable:")
            }
            else if (this.Itemchargeslist1.length > 0) {
                let ItemID = contact.ItemId;
                this.Itemchargeslist1.forEach((element) => {

                    let IndQty = contact.Qty

                    if (ItemID != element.ItemId) {
                        this.QtyBalchk = 0;
                    }
                    if (this.QtyBalchk != 1) {
                        if (contact.Qty <= element.BalanceQty) {
                            this.QtyBalchk = 1;
                            this.getFinalCalculation(element, contact.Qty);
                            ItemID = element.ItemId;
                        }
                        else if (IndQty > element.BalanceQty) {
                            Swal.fire("Balance Qty is :", element.Qty)
                            this.QtyBalchk = 0;
                            Swal.fire("Balance Qty is Less than Selected Item Qty for Item :" + element.ItemId + "Balance Qty:", element.BalanceQty)
                        }
                    }
                });
            }

        });

        }

    }

    RQty: any = 0;
    getFinalCalculation(contact, DraftQty) {
        
        console.log(contact)

        this.RQty = parseInt(DraftQty);
        if (this.RQty && contact.UnitMRP) {
            let TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);

            let LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
            let PurTotAmt = (parseInt(this.RQty) * (contact.PurchaseRate)).toFixed(2);

            let v_marginamt = (parseFloat(LandedRateandedTotal) - parseFloat(LandedRateandedTotal)).toFixed(2);

            let GSTAmount = (((contact.LandedRate) * (contact.VatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
            let CGSTAmt = (((contact.LandedRate) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
            let SGSTAmt = (((contact.LandedRate) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
            let IGSTAmt = (((contact.LandedRate) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);

            let NetAmt = ((parseFloat(LandedRateandedTotal) + parseFloat(GSTAmount))).toFixed(2);

            let BQty = contact.BalanceQty - this.RQty;


            if (contact.DiscPer > 0) {
                // let  DiscAmt = ((TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
                // let   NetAmt = (TotalMRP - this.DiscAmt).toFixed(2);

            }

            this.chargeslist = this.dsTempItemNameList.data;
            let gstper
            this.chargeslist.push(
                {
                    ItemId: contact.ItemId || 0,
                    ItemName: contact.ItemName || '',
                    BatchNo: contact.BatchNo,
                    BatchExpDate: this.datePipe.transform(contact.BatchExpDate, "MM-dd-yyyy"),
                    BalanceQty: BQty || 0,
                    Qty: this.RQty || 0,
                    UnitRate: contact.UnitRate,
                    UnitMRP: contact.UnitMRP,
                    
                    TotalAmount: NetAmt || 0,
                    VatPer: contact.VatPercentage || 0,
                    VatAmount: GSTAmount || 0,
                    TotalMRP: TotalMRP,
                    DiscPer: 0,// contact.DiscPer || 0,
                    DiscAmt: 0,
                    NetAmt: NetAmt,
                    RoundNetAmt: parseInt(NetAmt),// Math.round(TotalNet),
                    StockId: contact.StockId1,
                    LandedRate: contact.LandedRate,
                    LandedRateandedTotal: LandedRateandedTotal,
                    CgstPer: contact.CGSTPer,
                    CGSTAmt: CGSTAmt,
                    SgstPer: contact.SGSTPer,
                    SGSTAmt: SGSTAmt,
                    IgstPer: contact.IGSTPer,
                    IGSTAmt: IGSTAmt,
                    PurchaseRate: contact.PurchaseRate,
                    PurTotAmt: PurTotAmt,
                    MarginAmt: v_marginamt,
                    SalesDraftId: 1

                });
            console.log(this.chargeslist);
            this.dsNewIssueList3.data = this.chargeslist
        }
       
    }

    deleteTableRow(element) {
        let index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsNewIssueList3.data = [];
            this.dsNewIssueList3.data = this.chargeslist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }
    ItemReset() {
        this.ItemName = " ";
        this.vItemID = 0;
        this.vBatchNo = " ";
        this.vBalanceQty = 0;
        this.vQty = 0;
        this.vUnitMRP = 0;
        this.vTotalAmount = 0;
    }
    CalculateTotalAmt() {
        
        if (this.vQty > this.vBalanceQty) {
            this.toastr.warning('Enter Qty less than Balance', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this._IssueToDep.NewIssueGroup.get('Qty').setValue(0);
        }
        if (this.vQty && this.vUnitMRP) {
            this.vTotalAmount = (parseInt(this.vQty) * parseInt(this.vUnitMRP)).toFixed(2);
        }
    }
    getTotalamt(element) {
        this.vFinalTotalAmount = (element.reduce((sum, { LandedRateandedTotal }) => sum += +(LandedRateandedTotal || 0), 0)).toFixed(2);
        this.vFinalGSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
        this.vFinalNetAmount = (parseFloat(this.vFinalGSTAmount) + parseFloat(this.vFinalTotalAmount)).toFixed(2);
        return this.vFinalTotalAmount;


    }

    OnSave() {
        this.vsaveflag = true;


        if ((!this.dsNewIssueList3.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        // if (this._IssueToDep.NewIssueGroup.invalid) {
        //     this.toastr.warning('please check from is invalid', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
        let insertheaderObj = {};
        insertheaderObj['issueDate'] = this.dateTimeObj.date;
        insertheaderObj['issueTime'] = this.dateTimeObj.time;
        insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
        insertheaderObj['toStoreId'] = this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
        insertheaderObj['totalAmount'] = this._IssueToDep.NewIssueGroup.get('FinalTotalAmount').value || 0;
        insertheaderObj['totalVatAmount'] = this._IssueToDep.NewIssueGroup.get('GSTAmount').value || 0;
        insertheaderObj['netAmount'] = this._IssueToDep.NewIssueGroup.get('FinalNetAmount').value || 0;
        insertheaderObj['remark'] = this._IssueToDep.NewIssueGroup.get('Remark').value || '';
        insertheaderObj['addedby'] = this.accountService.currentUserValue.user.id || 0;
        insertheaderObj['isVerified'] = false;
        insertheaderObj['isclosed'] = false;
        insertheaderObj['indentId'] = 0;
        insertheaderObj['issueId'] = 0;

        let isertItemdetailsObj = [];
        this.dsNewIssueList3.data.forEach(element => {
            console.log(element)

            let insertitemdetail = {};
            insertitemdetail['issueId'] = 0;
            insertitemdetail['itemId'] = element.ItemId;
            insertitemdetail['batchNo'] = element.BatchNo;
            insertitemdetail['batchExpDate'] = element.BatchExpDate;
            insertitemdetail['issueQty'] = element.Qty;
            insertitemdetail['perUnitLandedRate'] = element.LandedRate;
            insertitemdetail['LandedTotalAmount'] = element.LandedRateandedTotal;
            insertitemdetail['unitMRP'] = element.UnitMRP;
            insertitemdetail['mrpTotalAmount'] = element.TotalMRP;
            insertitemdetail['unitPurRate'] = element.PurchaseRate;
            insertitemdetail['purTotalAmount'] = element.PurTotAmt;
            insertitemdetail['vatPercentage'] = element.VatPer || 0;
            insertitemdetail['vatAmount'] = element.VatAmount || 0;
            insertitemdetail['stkId'] = element.StockId;
            isertItemdetailsObj.push(insertitemdetail);
        });
        let updateissuetoDepartmentStock = [];
        this.dsNewIssueList3.data.forEach(element => {
            let updateitemdetail = {};
            updateitemdetail['itemId'] = element.ItemId;
            updateitemdetail['issueQty'] = element.Qty;
            updateitemdetail['stkId'] = element.StockId;
            updateitemdetail['storeID'] = this._loggedService.currentUserValue.user.storeId;
            updateissuetoDepartmentStock.push(updateitemdetail);
        });

        let submitData = {
            "insertIssuetoDepartmentHeader": insertheaderObj,
            "insertIssuetoDepartmentDetail": isertItemdetailsObj,
            "updateissuetoDepartmentStock": updateissuetoDepartmentStock
        };

        console.log(submitData);

        this._IssueToDep.IssuetodepSave(submitData).subscribe(response => {
            if (response) {
                this.toastr.success('Record New Issue To Department Saved Successfully.', 'Saved !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
                this.viewgetIssuetodeptReportPdf(response, this.vprintflag);
                this.OnReset();
                this.getIssueToDep();

            } else {
                this.toastr.error('New Issue To Department Data not saved !, Please check validation error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        }, error => {
            this.toastr.error('New Issue To Department Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        });
    }
    OnReset() {
        this._IssueToDep.NewIssueGroup.reset();
        this.dsNewIssueList1.data = [];
        this.dsNewIssueList2.data = [];
        this.dsNewIssueList3.data = [];
        this.BarcodetempDatasource = [];
        this.chargeslist.data = [];
        this.dsTempItemNameList.data = [];
    }

    @ViewChild('itemid') itemid: ElementRef;
    @ViewChild('Batchno') Batchno: ElementRef;
    @ViewChild('Rate') Rate: ElementRef;
    @ViewChild('BalQuantity') BalQuantity: ElementRef;
    @ViewChild('Quantity') Quantity: ElementRef;
    @ViewChild('addbutton') addbutton: ElementRef;
    @ViewChild('save') save: ElementRef;


    public onEnterFromstore(event): void {
        if (event.which === 13) {
            this.itemid.nativeElement.focus();
        }

        this.dsNewIssueList1.data = [];
        this.dsNewIssueList2.data = [];
        this.dsNewIssueList3.data = [];
        this.BarcodetempDatasource = [];
        this.chargeslist.data = [];
        this.tempDatasource.data = [];
        this.dsTempItemNameList.data = [];
    }
    public onEnteritemid(event): void {
        if (event.which === 13) {
            this.Batchno.nativeElement.focus();
        }
    }
    public onEnterBatchNo(event): void {
        if (event.which === 13) {
            this.BalQuantity.nativeElement.focus();
        }
    }
    public onEnterBalQty(event): void {
        if (event.which === 13) {
            this.Quantity.nativeElement.focus();
        }
    }
    public onEnterQty(event): void {
        
        if (event.which === 13) {
            // this.Rate.nativeElement.focus();
            this.Addflag = true
            this.addbutton.nativeElement.focus();
        }
    }
    public onEnterRate(event): void {
        if (event.which === 13) {
            this.Addflag = true
            this.addbutton.nativeElement.focus();
        }
    }

    public onEnterRemark(event): void {
        if (event.which === 13) {
            this.save.nativeElement.focus();
            //    if ((this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId) && this.dsNewIssueList3.data.length > 0) {
            this.vsaveflag = false;
            // }
        }
    }

    getBatch() {
        this.Quantity.nativeElement.focus();
        const dialogRef = this._matDialog.open(SalePopupComponent,
            {
                maxWidth: "800px",
                minWidth: '800px',
                width: '800px',
                height: '380px',
                disableClose: true,
                data: {
                    "ItemId": this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId,
                    "StoreId": this._IssueToDep.StoreFrom.get('FromStoreId').value.storeid
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);

            result = result.selectedData

            this.vBatchNo = result.BatchNo;
            this.vBatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
            this.vMRP = result.UnitMRP;
            this.vQty = '';
            this.vBal = result.BalanceAmt;
            this.GSTPer = result.VatPercentage;
            this.vTotalMRP = this.vQty * this.vMRP;
            this.vDiscAmt = 0;
            this.vNetAmt = this.vTotalMRP;
            this.vBalanceQty = result.BalanceQty;
            this.vItemObj = result;
            this.vVatPer = result.VatPercentage;
            this.vCgstPer = result.CGSTPer;
            this.vSgstPer = result.SGSTPer;
            this.vIgstPer = result.IGSTPer;
            this.vVatAmount = result.VatPercentage;
            this.vStockId = result.StockId
            this.vStoreId = result.StoreId;
            this.vLandedRate = result.LandedRate;
            this.vPurchaseRate = result.PurchaseRate;
            this.vUnitMRP = result.UnitMRP;
        });
    }

    DraftQty: any = 0;
    barcodeItemfetch() {
        this.Addflag = true;
        var d = {
            "StockId": this._IssueToDep.NewIssueGroup.get("Barcode").value || 0,
            "StoreId": this._loggedService.currentUserValue.user.storeId || 0

        }
        this._IssueToDep.getCurrentStockItem(d).subscribe(data => {
            this.tempDatasource.data = data as any;
            // console.log(this.tempDatasource.data);
            // this.BarcodetempDatasource = this.dsNewIssueList3.data
            // this.BarcodetempDatasource = this.tempDatasource.data
            // console.log(this.BarcodetempDatasource)
            if (this.tempDatasource.data.length >= 1) {
                this.tempDatasource.data.forEach((element) => {
                    this.DraftQty = 1;
                    this.onAddBarcodeItemList(element, this.DraftQty);
                    // this.onAdd(element, this.DraftQty);
                });
            }
            else if (this.tempDatasource.data.length == 0) {
                this.toastr.error('Item Not Found !', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
        // this.vBarcode = '';
        this.Addflag = false
    }


    viewgetIssuetodeptReportPdf(contact, vprintflag) {
        
        let IssueId
        if (vprintflag) {
            IssueId = contact.IssueId
        } else {
            IssueId = contact
        }

        this.sIsLoading == 'loading-data'

        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._IssueToDep.getIssueToDeptview(IssueId).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "95vw",
                        height: '850px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Issue to Dept Report Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.sIsLoading = '';
                });
            });
        }, 1000);
    }


    viewgetIssuetodeptsummaryReportPdf() {
        
        let Fromdate = this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let Todate = this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'

        let FromStoreId = this._loggedService.currentUserValue.user.storeId || this._IssueToDep.IssueSearchGroup.get("FromStoreId").value.StoreId || 0

        let ToStoreId = this._IssueToDep.IssueSearchGroup.get("ToStoreId").value.StoreId || 0

        this.sIsLoading == 'loading-data'

        setTimeout(() => {
            this.SpinLoading = true;
          debugger
            this._IssueToDep.getIssueToDeptsummaryview(Fromdate, Todate, FromStoreId, ToStoreId).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "95vw",
                        height: '850px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Issue to Dept Summary Report Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.sIsLoading = '';
                });
            });
        }, 1000);
    }



    exportIssuetodeptReportExcel() {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['IssueNo', 'IssueDate', 'FromStoreName', 'ToStoreName', 'TotalAmount', 'TotalVatAmount', 'NetAmount', 'Remark', 'Receivedby'];
        this.reportDownloadService.getExportJsonData(this.dsIssueToDep.data, exportHeaders, 'Issue To Department');
        this.dsIssueToDep.data = [];
        this.sIsLoading = '';
    }

    OnIndent() {
        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.dsNewIssueList1.data = result;
            console.log(result)
        });
    }
    IndentItemDetails(Param) {
        console.log(Param)
        this.sIsLoading = 'loading-data';
        var vdata = {
            'IndentId': Param.IndentId
        }
        console.log(vdata);
        this._IssueToDep.getAgainstIndentList(vdata).subscribe(data => {
            console.log(data)
            this.dsNewIssueList3.data = data as NewIssueList3[];
            this.chargeslist = data as NewIssueList3[];
            console.log(this.dsNewIssueList3);
            this.dsNewIssueList3.sort = this.sort;
            this.dsNewIssueList3.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }
}
export class NewIssueList3 {

    ItemId: any;
    ItemName: any;
    BatchNO: any;
    ExpDate: any;
    BalanceQty: any;
    Qty: any;
    UnitRate: any;
    TotalAmount: any;
    BatchNo: string;
    BatchExpDate: any;
    QtyPerDay: any;
    UnitMRP: any;
    Bal: number;
    StoreId: any;
    StoreName: any;
    GSTPer: any;
    GSTAmount: any;
    TotalMRP: any;
    DiscPer: any;
    DiscAmt: any;
    NetAmt: any;
    StockId: any;
    ReturnQty: any;
    Total: any;
    VatPer: any;
    VatAmount: any;
    LandedRate: any;
    CgstPer: any;
    CGSTAmt: any;
    SgstPer: any;
    SGSTAmt: any;
    IgstPer: any;
    IGSTAmt: any;
    DiscAmount: any;
    NetAmount: any;
    ExpDateNo; any;
    BalQty: any;
    PurchaseRate: any;
    LandedRateandedTotal: any;
    PurTotAmt: any;
    constructor(NewIssueList3) {
        this.ItemId = NewIssueList3.ItemId || 0;
        this.ItemName = NewIssueList3.ItemName || '';
        this.BatchNO = NewIssueList3.BatchNO || 0;
        this.ExpDate = NewIssueList3.ExpDate || 1 / 2 / 23;
        this.BalanceQty = NewIssueList3.BalanceQty || 0;
        this.Qty = NewIssueList3.Qty || 0;
        this.UnitRate = NewIssueList3.UnitRate || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.BatchExpDate = NewIssueList3.BatchExpDate || "";
        this.UnitMRP = NewIssueList3.UnitMRP || "";
        this.QtyPerDay = NewIssueList3.QtyPerDay || 0;
        this.Bal = NewIssueList3.Bal || 0;
        this.StoreId = NewIssueList3.StoreId || 0;
        this.StoreName = NewIssueList3.StoreName || '';
        this.GSTPer = NewIssueList3.GSTPer || "";
        this.TotalMRP = NewIssueList3.TotalMRP || 0;
        this.DiscAmt = NewIssueList3.DiscAmt || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.StockId = NewIssueList3.StockId || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.ReturnQty = NewIssueList3.ReturnQty || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.Total = NewIssueList3.Total || '';
        this.VatPer = NewIssueList3.VatPer || 0;
        this.VatAmount = NewIssueList3.VatAmount || 0;
        this.LandedRate = NewIssueList3.LandedRate || 0;
        this.CgstPer = NewIssueList3.CgstPer || 0;
        this.CGSTAmt = NewIssueList3.CGSTAmt || 0;
        this.SgstPer = NewIssueList3.SgstPer || 0;
        this.SGSTAmt = NewIssueList3.SGSTAmt || 0;
        this.IgstPer = NewIssueList3.IgstPer || 0;
        this.IGSTAmt = NewIssueList3.IGSTAmt || 0;
        this.NetAmount = NewIssueList3.NetAmount || 0;
        this.DiscAmount = NewIssueList3.DiscAmount || 0;
        this.ExpDateNo = NewIssueList3.ExpDateNo || 1 / 2 / 23;
        this.BalQty = NewIssueList3.BalQty || 0;
        this.PurchaseRate = NewIssueList3.PurchaseRate || 0;
        this.LandedRateandedTotal = NewIssueList3.LandedRateandedTotal || 0;
        this.PurTotAmt = NewIssueList3.PurTotAmt || 0;

    }
}



export class IssueItemList {
    ItemId: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    Qty: number;
    PerUnitLandedRate: number;
    LandedTotalAmount: number;
    VatPercentage: number;
    StoreId: any;
    StoreName: any;

    constructor(IssueItemList) {
        {
            this.ItemId = IssueItemList.ItemId || 0;
            this.ItemName = IssueItemList.ItemName || "";
            this.BatchNo = IssueItemList.BatchNo || 0;
            this.BatchExpDate = IssueItemList.BatchExpDate || 0;
            this.Qty = IssueItemList.Qty || 0;
            this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
            this.LandedTotalAmount = IssueItemList.LandedTotalAmount || 0;
            this.VatPercentage = IssueItemList.VatPercentage || 0;
            this.StoreId = IssueItemList.StoreId || 0;
            this.StoreName = IssueItemList.StoreName || "";
        }
    }
}

export class IssueToDep {
    IssueNo: Number;
    IssueDate: number;
    FromStoreName: string;
    ToStoreName: string;
    NetAmount: number;
    Remark: string;
    Receivedby: string;
    IssueDepId: number;

    constructor(IssueToDep) {
        {
            this.IssueNo = IssueToDep.IssueNo || 0;
            this.IssueDate = IssueToDep.IssueDate || 0;
            this.FromStoreName = IssueToDep.FromStoreName || "";
            this.ToStoreName = IssueToDep.ToStoreName || "";
            this.NetAmount = IssueToDep.NetAmount || 0;
            this.Remark = IssueToDep.Remark || "";
            this.Receivedby = IssueToDep.Receivedby || "";
            this.IssueDepId = IssueToDep.IssueDepId || 0;
        }
    }
}

