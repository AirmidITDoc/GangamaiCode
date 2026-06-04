import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { IssuTodeptComponent } from '../issu-todept/issu-todept.component';
import { IssueToDeparmentAgainstIndentComponent } from '../issue-to-deparment-against-indent/issue-to-deparment-against-indent.component';
import { NewIssueList3 } from '../issue-to-department.component';
import { IssueToDepartmentService } from '../issue-to-department.service';

@Component({
    selector: 'app-new-issue-todept',
    templateUrl: './new-issue-todept.component.html',
    styleUrls: ['./new-issue-todept.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewIssueTodeptComponent {
    NewIssueGroup: FormGroup;
    IssueFinalForm: FormGroup;
    StoreFrom: FormGroup;
    FinalIssueForm: FormGroup;
    IssueMainForm: FormGroup;
    FinalIssueaginstForm: FormGroup;
    MaterialForm: FormGroup;
    NewIssueGroupAccept: FormGroup;
    FinalIssueaginstAcceptForm: FormGroup
    Indentid: any;
    indentdetid: any;
    IsClosed: any;
    IndQty: any;
    RQty: any = 0;
    QtyBalchk: any = 0;
    fromstoreId = 0
    dateTimeObj: any;
    sIsLoading: string = '';
    vIndentId: any = 0;
    vIndtDetId: any;
    vFinalTotalAmount: any;
    vFinalNetAmount: any;
    vFinalGSTAmount: any;
    vTotalAmount: any;
    vQty: any;
    vBalanceQty: any;
    vLandedRatee: any;
    vremark: any;
    vLandedRate: any;
    vBatchNo: any;
    vBarcode: any;
    vBatchExpDate: any;
    vUnitMRP: any;
    IssQty: any;
    vBal: any;
    StoreName: any;
    GSTPer: any;
    vMRP: any;
    vVatPer: any;
    vCgstPer: any;
    vSgstPer: any;
    vIgstPer: any;
    vVatAmount: any;
    vStockId: any;
    vStoreId: any;
    vPurchaseRate: any;
    ItemName: any
    vItemID: any
    vTotalMRP: any = 0;
    vDiscAmt: any
    vNetAmt: any
    Indbalqty = 0
    issueqty = 0
    vstoreId: any = '';
    vstoreId1: any = '';
    fromstore: any;
    ItemstoreId: any = 0;

    batchresult: any;
    vItemObj: NewIssueList3;
    chargeslist: any = [];
    ItemSamelist: any = [];
    Itemchargeslist1: any = [];
    Charglist: any = [];
    ApiUrl = ""
    showIndentFlag: boolean = false;
    Addflag: boolean = false;
    vAgainstIndet: boolean = false;
    Isclosedchk: boolean = false;
    AgainstInd: boolean = true;
    ItemID = 0;
    Status = ''

    autocompletestore: string = "Store";
    autocompletestore1: string = "Store";

    dsNewIssueItemList = new MatTableDataSource<NewIssueList3>();
    dsSelectedIndentItemList = new MatTableDataSource<IndentItemDetList>();

    dsTempItemNameList = new MatTableDataSource<NewIssueList3>();

    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('qtyTextboxRef', { read: ElementRef }) qtyTextboxRef: ElementRef;

    displayedNewIssuesList1: string[] = [
        'ItemName',
        'BalanceQty',
        'Action'
    ]
    displayedNewIssuesList2: string[] = [
        'BatchNo',
        'ExpDateNo',
        'BalQty'
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

    constructor(
        public _IssueToDep: IssueToDepartmentService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public toastr: ToastrService, private commonService: PrintserviceService,
        public _dialogRef: MatDialogRef<IssuTodeptComponent>,
        private accountService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any, public _configue: ConfigService,
    ) { }

    IsMaterialAccept: boolean = false;
    IsIndentAgainstMaterialAccept: boolean = false;
    ngOnInit(): void {
        this.vstoreId = this.accountService.currentUserValue.user.storeId;
        const rawValue = this?._configue?.configParams?.IsMaterialAcceptDirect || "";

        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.IsMaterialAccept = id === "1";

        const rawValue1 = this?._configue?.configParams?.IsMaterialAcceptAgainstIndent || "";

        const [id1, val1] = rawValue1.includes(":") ? rawValue1.split(":") : [null, null];
        this.IsIndentAgainstMaterialAccept = id1 === "1";



        if (this.IsMaterialAccept)
            this.Status = 'Material Direct issued with Acceptance'
        else
            this.Status = 'Material Issued without Acceptance'

        if (this.IsIndentAgainstMaterialAccept)
            this.Status = ' Indent Against Material issued with Acceptance'
        else
            this.Status = 'Indent Against  Material  issued without Acceptance'


        // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`
        this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`

        this.NewIssueGroup = this._IssueToDep.getNewIssueForm();

        this.NewIssueGroupAccept = this.getNewIssueAcceptForm();
        this.materialAcceptIssuedetailArray.push(this.materialAcceptIssueDetailsform());


        this.IssueFinalForm = this._IssueToDep.createfinal()
        this.StoreFrom = this._IssueToDep.CreateStoreFrom();

        this.MaterialForm = this.creatematerial()
        this.itemdetailarray.push(this.itemdetailform());
        this.AcceptstockArray.push(this.currentstockform());
        this.AcceptdeptArray.push(this.IssueItemdetailform());

        this.IssueFinalForm.markAllAsTouched();
        this.StoreFrom.markAllAsTouched();
        this.FinalIssueForm = this.IssueFrom()
        this.FinalIssueaginstForm = this.IssueaganistFrom()
        this.deptArray.push(this.IssueItemdetailform());
        this.stockArray.push(this.currentstockform());
        this.deptArray1.push(this.IssueItemdetailform());
        this.stockArray1.push(this.currentstockform());
        this.indentdetailArray.push(this.indentdetailform());

        if (this.data) {
            debugger
            console.log(this.data)

            this.fromstoreId = this.data.fromStoreId
            this.vIndentId = this.data.indentId
            this.getIndentItemDetList()
            if (this.vIndentId > 0) {

                this.FinalIssueaginstAcceptForm = this.IssueIndentaganistAcceptFrom()
                this.itemdetailIndentaginstacceptarray.push(this.itemdetailform());
                this.AcceptstockIndentaginstacceptarray.push(this.currentstockform());
                this.AcceptdeptIndentaginstdeptArray.push(this.IssueItemdetailform());
                this.AcceptdeptIndentaginstindentdetailArray.push(this.indentdetailform());

            }


        }

    }

    get deptArray(): FormArray {
        return this.FinalIssueForm.get('issue.tIssueToDepartmentDetails') as FormArray;
    }

    get AcceptdeptArray(): FormArray {
        return this.NewIssueGroupAccept.get('tIssueToDepartmentDetails') as FormArray;
    }

    get stockArray(): FormArray {
        return this.FinalIssueForm.get('tCurrentStock') as FormArray;
    }

    get AcceptstockArray(): FormArray {
        return this.NewIssueGroupAccept.get('tCurrentStock') as FormArray;
    }


    get deptArray1(): FormArray {
        return this.FinalIssueaginstForm.get('updateIndent.tIssueToDepartmentDetails') as FormArray;
    }



    get stockArray1(): FormArray {
        return this.FinalIssueaginstForm.get('tCurStockModel') as FormArray;
    }

    get indentdetailArray(): FormArray {
        return this.FinalIssueaginstForm.get('tIndentDetails') as FormArray;
    }


    get materialAcceptIssuedetailArray(): FormArray {
        return this.NewIssueGroupAccept.get('materialAcceptIssueDetails') as FormArray;
    }

    IssueFrom() {
        return this._formBuilder.group({
            "issue": this._formBuilder.group({
                "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "indentId": [this.vIndentId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "issueDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "issueTime": this.datePipe.transform(new Date(), 'shortTime'),
                "fromStoreId": [this.accountService.currentUserValue.user.storeId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "toStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalVatAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "netAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "remark": ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
                "addedby": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "createdBy": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isVerified": [false],
                "isClosed": [false],
                "unitId": [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "tIssueToDepartmentDetails": this._formBuilder.array([]),
            }),
            tCurrentStock: this._formBuilder.array([]),
        });
    }

    getNewIssueAcceptForm() {
        return this._formBuilder.group({
            "issuetoDeptWihMaterialAccept": this._formBuilder.group({
                "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "indentId": [this.vIndentId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "issueDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "issueTime": this.datePipe.transform(new Date(), 'shortTime'),
                "fromStoreId": [this.accountService.currentUserValue.user.storeId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "toStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalVatAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "netAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "remark": ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
                "addedby": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "createdBy": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isVerified": [false],
                "isClosed": [false],
                "unitId": [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            }),
            "tIssueToDepartmentDetails": this._formBuilder.array([]),
            tCurrentStock: this._formBuilder.array([]),
            "materialAcceptIssueHeader": {
                "issueId": 0,
                "acceptedBy": 1,// [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isAccepted": true
            },
            materialAcceptIssueDetails: this._formBuilder.array([]),
            "materialAcceptStockUpdate": {
                "issueId": 0
            }
        });
    }



    // IssueItemdetailform(element: any = {}): FormGroup {

    //   console.log(element)
    //   return this._formBuilder.group({
    //     issueDepId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     issueId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     batchNo: [element.BatchNo],
    //     batchExpDate: [(new Date()).toISOString().split('T')[0]],
    //     issueQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     perUnitLandedRate: [element.LandedRate, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     LandedTotalAmount: [element.LandedRateandedTotal, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     unitMRP: [element.UnitMRP, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     mrpTotalAmount: [element.TotalAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     unitPurRate: [element.PurchaseRate, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     purTotalAmount: [element.PurTotAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     vatPercentage: [element.VatPer, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     vatAmount: [element.VatAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     stkId: [element.StockId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     status: ["0"]
    //   });
    // }
    // currentstockform(element: any = {}): FormGroup {

    //   console.log(element)
    //   return this._formBuilder.group({
    //     itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     issueQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     istkId: [element.StockId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     storeId: [this.accountService.currentUserValue.user.storeId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
    //   });
    // }

    // indentdetailform(element: any = {}): FormGroup {

    //   console.log(element)
    //   return this._formBuilder.group({
    //     indentId: [element.IndentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     indentDetailsId: [element.IndentDetailsId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    //     isClosed: [element.IsClosed],
    //     indQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]]
    //   });
    // }

    materialAcceptIssueDetailsform(element: any = {}): FormGroup {

        console.log(element)
        return this._formBuilder.group({
            issueId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issueDepId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            status: ["1"]
        });
    }

    IssueaganistFrom() {
        return this._formBuilder.group({
            "updateIndent": this._formBuilder.group({
                "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "indentId": [this.vIndentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "issueDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "issueTime": this.datePipe.transform(new Date(), 'shortTime'),
                "fromStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "toStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "totalVatAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "netAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "remark": [''],
                "addedby": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "modifiedBy": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isVerified": [false],
                "isClosed": [false],
                "tIssueToDepartmentDetails": this._formBuilder.array([]),
            }),
            tCurStockModel: this._formBuilder.array([]),
            "indentHeader": this._formBuilder.group({
                "indentId": this.vIndentId,
                "isClosed": false
            }),
            tIndentDetails: this._formBuilder.array([]),
        });
    }

    //Indent against Issue Accept ................
    IssueIndentaganistAcceptFrom() {
        debugger
        return this._formBuilder.group({
            "issuetoDeptWihMaterialAccept": this._formBuilder.group({
                "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "indentId": [this.vIndentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "issueDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "issueTime": this.datePipe.transform(new Date(), 'shortTime'),
                "fromStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "toStoreId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "totalVatAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "netAmount": [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                "remark": [''],
                "addedby": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "modifiedBy": [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isVerified": [false],
                "isClosed": [true],
                "unitId": [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "createdBy": 1
            }),
            tIssueToDepartmentDetails: this._formBuilder.array([]),
            tCurrentStock: this._formBuilder.array([]),
            "indentHeader": this._formBuilder.group({
                "indentId": this.vIndentId,
                "isClosed": [true]
            }),
            "materialAcceptIssueHeader": {
                "issueId": 0,
                "acceptedBy": 1,// [this.accountService.currentUserValue.user.userId | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "isAccepted": true
            },
            "materialAcceptStockUpdate": {
                "issueId": 0

            },
            materialAcceptIssueDetails: this._formBuilder.array([]),
            tIndentDetails: this._formBuilder.array([]),
        });
    }

    get itemdetailIndentaginstacceptarray(): FormArray {
        return this.FinalIssueaginstAcceptForm.get('materialAcceptIssueDetails') as FormArray;
    }

    get AcceptstockIndentaginstacceptarray(): FormArray {
        return this.FinalIssueaginstAcceptForm.get('tCurrentStock') as FormArray;
    }

    get AcceptdeptIndentaginstdeptArray(): FormArray {
        return this.FinalIssueaginstAcceptForm.get('tIssueToDepartmentDetails') as FormArray;
    }

    get AcceptdeptIndentaginstindentdetailArray(): FormArray {
        return this.FinalIssueaginstAcceptForm.get('tIndentDetails') as FormArray;
    }

    //
    get itemdetailarray(): FormArray {
        return this.MaterialForm.get('materialAcceptIssueDetails') as FormArray;
    }

    IssueItemdetailform(element: any = {}): FormGroup {

        console.log(element)
        return this._formBuilder.group({
            issueDepId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issueId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            batchNo: [element.BatchNo],
            batchExpDate: [element.BatchExpDate],
            issueQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]],
            perUnitLandedRate: [element.LandedRate, [this._FormvalidationserviceService.onlyNumberValidator()]],
            LandedTotalAmount: [element.LandedRateandedTotal, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitMRP: [element.UnitMRP, [this._FormvalidationserviceService.onlyNumberValidator()]],
            mrpTotalAmount: [element.TotalAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitPurRate: [element.PurchaseRate, [this._FormvalidationserviceService.onlyNumberValidator()]],
            purTotalAmount: [element.PurTotAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
            vatPercentage: [element.VatPer, [this._FormvalidationserviceService.onlyNumberValidator()]],
            vatAmount: [element.VatAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            stkId: [element.StockId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            status: ["0"]
        });
    }
    currentstockform(element: any = {}): FormGroup {
        debugger
        console.log(element)
        return this._formBuilder.group({
            itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issueQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]],
            istkId: [element.StockId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            storeId: [this.accountService.currentUserValue.user.storeId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    indentdetailform(element: any = {}): FormGroup {

        console.log(element)
        return this._formBuilder.group({
            indentId: [element.IndentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            indentDetailsId: [element.IndentDetailsId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isClosed: [element.IsClosed],
            indQty: [element.Qty, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }
    creatematerial() {
        return this._formBuilder.group({
            "materialAcceptIssueHeader": this._formBuilder.group({
                "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "acceptedBy": [this.accountService.currentUserValue.user.userId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "IsAccepted": [true, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            "materialAcceptIssueDetails": this._formBuilder.array([]),
            "materialAcceptStockUpdate": this._formBuilder.group({
                "issueId": 0
            })
        });
    }


    itemdetailform(element: any = {}): FormGroup {
        console.log(element)
        debugger
        return this._formBuilder.group({
            issueId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issueDepId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            status: ["1"]
        });
    }

    onAddFormItem($event) {
        this.StoreFrom.get('ToStoreId').setValue(this.fromstoreId);

        if (this.vIndentId > 0)
            if (!this.NewIssueGroup.get('ItemName')?.value) {
                this.toastr.warning('Please select Item', 'Warning!', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

        if (!this.NewIssueGroup.get('Qty')?.value) {
            this.toastr.warning('Please select Qty', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        this.ItemSamelist = this.dsNewIssueItemList.data.filter(item => item.ItemId === this.NewIssueGroup.get('ItemName').value.itemId)
        if (this.ItemSamelist) {
            if (this.ItemSamelist.some(item => item.BatchNo === this.batchresult.batchNo) && this.ItemSamelist.some(item => item.LandedRate === this.vLandedRate)) {
                this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                this.NewIssueGroup.reset()
                this.NewIssueGroup.get("Qty").setValue(1);
                const serviceNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
                if (serviceNameElement) {
                    serviceNameElement.focus();
                }
                return;
            }
        }
        const TotalMRP = this.NewIssueGroup.get("Qty").value * this.NewIssueGroup.get("UnitRate").value
        const PurTotAmt = this.vPurchaseRate * this.NewIssueGroup.get("Qty").value
        const LandedRateandedTotal = this.NewIssueGroup.get("UnitRate").value * this.NewIssueGroup.get("Qty").value
        const GSTAmount = (((this.NewIssueGroup.get("UnitRate").value) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(4);
        const gstper = 0

        this.chargeslist.push(
            {
                ItemId: this.NewIssueGroup.get('ItemName').value.itemId || 0,
                ItemName: this.NewIssueGroup.get('ItemName').value.formattedText || '',
                BatchNo: this.NewIssueGroup.get('BatchNO').value || "",
                BatchExpDate: this.vBatchExpDate || '1900-01-01',
                BalanceQty: this.NewIssueGroup.get('BalanceQty').value || "",
                Qty: this.NewIssueGroup.get('Qty').value || 0,
                LandedRate: this.NewIssueGroup.get("UnitRate").value,
                UnitMRP: this.NewIssueGroup.get("UnitRate").value || 0,
                VatPer: gstper || 0,
                VatAmount: (((this.vTotalAmount) * (gstper)) / 100).toFixed(4),
                TotalAmount: this.vTotalAmount || 0,
                StockId: this.vStockId,
                TotalMRP: TotalMRP,
                DiscPer: 0,
                DiscAmt: 0,
                NetAmt: LandedRateandedTotal,
                RoundNetAmt: Math.round(LandedRateandedTotal),
                mrpTotalAmount: TotalMRP,
                LandedRateandedTotal: LandedRateandedTotal,
                CgstPer: this.vCgstPer,
                SgstPer: this.vSgstPer,
                IgstPer: this.vIgstPer,
                PurchaseRate: this.vPurchaseRate,
                PurTotAmt: PurTotAmt,
                purTotalAmount: PurTotAmt,
                SalesDraftId: 1
            });
        console.log(this.chargeslist);
        this.dsNewIssueItemList.data = this.chargeslist
        this.resetFormItem();
        const serviceNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
        if (serviceNameElement) {
            serviceNameElement.focus();
        }

    }

    getBatch() {

        const dialogRef = this._matDialog.open(SalePopupComponent,
            {
                maxWidth: "800px",
                minWidth: '800px',
                width: '800px',
                height: '380px',
                disableClose: true,
                data: {
                    "ItemId": this.NewIssueGroup.get('ItemName').value.itemId,
                    "StoreId": this.StoreFrom.get('FromStoreId').value
                }
            });
        dialogRef.afterClosed().subscribe(result => {

            console.log(result);
            if (result.selectedData) {
                result = result.selectedData
                this.batchresult = result.selectedData
                this.vBatchNo = result.batchNo || '';
                this.vBatchExpDate = this.datePipe.transform(result.batchExpDate, "yyyy-MM-dd");
                this.vMRP = result.landedRate;
                this.vQty = '';
                this.vBal = result.BalanceAmt;
                this.GSTPer = result.VatPercentage;
                this.vTotalMRP = this.vQty * this.vLandedRate;
                this.vDiscAmt = 0;
                this.vNetAmt = this.vTotalMRP;
                this.vBalanceQty = result.balanceQty;
                this.vItemObj = result;
                this.vVatPer = result.vatPercentage;
                this.vCgstPer = result.cgstPer;
                this.vSgstPer = result.sgstPer;
                this.vIgstPer = result.igstPer;
                this.vVatAmount = (((this.vTotalAmount) * (this.vVatPer)) / 100).toFixed(4),
                    this.vStockId = result.stockId
                this.vStoreId = result.storeId;
                this.vLandedRate = result.landedRate;
                this.vPurchaseRate = result.purchaseRate;
                this.vUnitMRP = result.unitMRP;
            } else {
                Swal.fire("Select Proper Item ...Batch Not Present")
                // return;
                this.NewIssueGroup.get('ItemName').reset('')
                const serviceNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
                if (serviceNameElement) {
                    serviceNameElement.focus();
                }
            }
            this.NewIssueGroup.get("Qty").setValue(0);
            const serviceNameElement = document.querySelector(`[name='Qty']`) as HTMLElement;
            if (serviceNameElement) {
                serviceNameElement.focus();
            }
        });

    }

    CalculateTotalAmt() {
        if (this.NewIssueGroup.get("Qty").value > this.NewIssueGroup.get("BalanceQty").value) {
            this.toastr.warning('Enter Qty less than Balance', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.NewIssueGroup.get('Qty').setValue(0);
        }
        if (this.NewIssueGroup.get("Qty").value > 0 && this.NewIssueGroup.get("UnitRate").value) {
            this.vTotalAmount = (parseFloat(this.NewIssueGroup.get("Qty").value) * parseFloat(this.NewIssueGroup.get("UnitRate").value)).toFixed(4);
        } else {
            this.toastr.warning('Enter Qty  greater than 0', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }
    }
    getTotalamt(element) {

        this.vFinalTotalAmount = (element.reduce((sum, { LandedRateandedTotal }) => sum += +(LandedRateandedTotal || 0), 0)).toFixed(4);
        this.vFinalGSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(4);
        this.vFinalNetAmount = (parseFloat(this.vFinalGSTAmount) + parseFloat(this.vFinalTotalAmount)).toFixed(4);
        return this.vFinalTotalAmount;
    }


    getSelectedItem(item: GRNItemResponseType): void {
        this.ItemID = item.itemId

        this.NewIssueGroup.patchValue({
            UOMId: item.umoId,
            ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
            Qty: item.balanceQty,
            CGSTPer: item.cgstPer,
            SGSTPer: item.sgstPer,
            IGSTPer: item.igstPer,
            GST: item.cgstPer + item.sgstPer + item.igstPer,
            HSNcode: item.hsNcode

        });
        this.getBatch();

    }

    OnIndentAgainst() {

        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
            });
        dialogRef.afterClosed().subscribe(result => {
            this.dsSelectedIndentItemList.data = result;

            if (result.length !== 0) this.updatestatus()
            else {
                this.vAgainstIndet = false
                this.AgainstInd = true
            }

        });
    }

    getIndentItemDetList() {
        debugger
        this.sIsLoading = 'loading-data';
        const vdata = {
            "first": 0,
            "rows": 9999,
            "sortField": "IndentId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "IndentId",
                    "fieldValue": String(this.vIndentId),
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

        this._IssueToDep.getIndentItemDetList(vdata).subscribe(data => {
            console.log(data.data)
            this.dsSelectedIndentItemList.data = data.data as IndentItemDetList[];
            console.log(data.data)
            this.dsSelectedIndentItemList.data.forEach((element) => {
                this.AddIndentSelectedItem(element)
            })
            this.dsSelectedIndentItemList.sort = this.sort;
            this.dsSelectedIndentItemList.paginator = this.paginator;

            this.sIsLoading = '';
        });


    }

    updatestatus() {

        this.AgainstInd = true
        this.vIndentId = this.dsSelectedIndentItemList.data[0]['indentId'];
        this.vAgainstIndet = true;
        this.fromstoreId = this.dsSelectedIndentItemList.data[0]['fromStoreId']
        this.fromstore = this.dsSelectedIndentItemList.data[0]['fromStoreName']
        this.StoreFrom.get('ToStoreId').setValue(this.fromstoreId);
        this.showIndentFlag = true
    }
    AddIndentSelectedItem(contact) {
        debugger
        console.log(contact)
        this.vIndentId = contact.indentId;
        this.indentdetid = contact.indentDetailsId;
        this.IsClosed = contact.isClosed;
        this.IndQty = contact.indQty;//contact.qty
        this.Indbalqty = contact.balanceQty
        this.issueqty = contact.issQty
        let DuplicateItem = 0;

        if (this.dsNewIssueItemList.data.length > 0) {
            this.ItemSamelist = this.dsNewIssueItemList.data.filter(item => item.ItemId === contact.itemId)
            if (this.ItemSamelist.length > 0) {
                this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                DuplicateItem = 1
                return;
            }
        }

        this.Itemchargeslist1 = [];
        this.QtyBalchk = 0;

        const m_data = {
            "ItemId": contact.itemId,
            "StoreId": this.accountService.currentUserValue.user.storeId || 0
        }

        this._IssueToDep.getBatchList(m_data).subscribe(draftdata => {
            this.Itemchargeslist1 = draftdata as any;

            if (this.Itemchargeslist1.length == 0) {
                Swal.fire(contact.itemId + " : " + "Item Stock is Not Avilable:")
            }
            else if (this.Itemchargeslist1.length > 0) {
                const ItemID = contact.itemId;

                let remaing_qty = contact.balanceQty;
                let bal_qnt = 0;
                this.Itemchargeslist1.forEach((element) => {

                    const IndQty = remaing_qty;
                    if (IndQty > 0) {

                        if (contact.itemId != element.itemId) {
                            this.QtyBalchk = 0;
                        } else if (IndQty <= element.balanceQty) {
                            this.QtyBalchk = 1;
                            this.getFinalCalculation(element, IndQty, contact);
                            contact.itemId = element.itemId;
                            bal_qnt += element.balanceQty - IndQty;
                        } else if (IndQty > element.balanceQty) {
                            this.QtyBalchk = 1;
                            this.getFinalCalculation(element, element.balanceQty, contact);
                            contact.itemId = element.itemId;
                        }

                        remaing_qty = IndQty - element.balanceQty;
                    } else {
                        bal_qnt += element.balanceQty;
                    }

                    const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
                    if (QtyElement) {
                        QtyElement.focus();
                    }


                });
                // Swal.fire("Balance Qty is :", String(bal_qnt))
            }
        });
    }


    getFinalCalculation(contact, DraftQty, element) {

        console.log(contact)

        this.RQty = parseInt(DraftQty);
        if (this.RQty && contact.unitMRP) {
            this.chargeslist = this.dsTempItemNameList.data;

            this.chargeslist.push(
                {
                    ItemId: contact.itemId || 0,
                    ItemName: contact.itemName || '',
                    BatchNo: contact.batchNo,
                    BatchExpDate: this.datePipe.transform(contact.batchExpDate, "yyyy-MM-dd"),
                    BalanceQty: contact.balanceQty - this.RQty || 0,// BQty || 0,
                    Qty: this.RQty || 0,
                    UnitRate: contact.unitMRP,
                    UnitMRP: contact.unitMRP,
                    TotalAmount: ((parseFloat((parseInt(this.RQty) * (contact.landedRate)).toFixed(4)) + parseFloat((((contact.landedRate) * (contact.vatPercentage) / 100) * parseInt(this.RQty)).toFixed(4)))).toFixed(4) || 0,// NetAmt || 0,
                    VatPer: contact.vatPercentage || 0,
                    VatAmount: (((contact.landedRate) * (contact.vatPercentage) / 100) * parseInt(this.RQty)).toFixed(4) || 0,// GSTAmount || 0,
                    TotalMRP: (parseInt(this.RQty) * (contact.unitMRP)).toFixed(4),// TotalMRP,
                    DiscPer: 0,
                    DiscAmt: 0,
                    NetAmt: ((parseFloat((parseInt(this.RQty) * (contact.landedRate)).toFixed(4)) + parseFloat((((contact.landedRate) * (contact.vatPercentage) / 100) * parseInt(this.RQty)).toFixed(4)))).toFixed(4),// NetAmt,
                    RoundNetAmt: parseInt(((parseFloat((parseInt(this.RQty) * (contact.landedRate)).toFixed(4)) + parseFloat((((contact.landedRate) * (contact.vatPercentage) / 100) * parseInt(this.RQty)).toFixed(4)))).toFixed(4)),
                    StockId: contact.stockId,
                    LandedRate: contact.landedRate,
                    LandedRateandedTotal: (parseInt(this.RQty) * (contact.landedRate)).toFixed(4),
                    CgstPer: contact.cgstPer,
                    CGSTAmt: (((contact.landedRate) * (contact.cgstPer) / 100) * parseInt(this.RQty)).toFixed(4),
                    SgstPer: contact.sgstPer,
                    SGSTAmt: (((contact.landedRate) * (contact.sgstPer) / 100) * parseInt(this.RQty)).toFixed(4),
                    IgstPer: contact.igstPer,
                    IGSTAmt: (((contact.landedRate) * (contact.igstPer) / 100) * parseInt(this.RQty)).toFixed(4),
                    PurchaseRate: contact.purchaseRate,
                    PurTotAmt: (parseInt(this.RQty) * (contact.purchaseRate)).toFixed(4),
                    MarginAmt: (parseFloat((parseInt(this.RQty) * (contact.landedRate)).toFixed(4)) - parseFloat((parseInt(this.RQty) * (contact.landedRate)).toFixed(4))).toFixed(4),
                    SalesDraftId: 1,
                    IndentId: this.vIndentId,
                    IndentDetailsId: element.indentDetailsId,
                    IsClosed: this.IsClosed,
                    IndQty: this.IndQty

                });
            console.log(this.chargeslist);
            this.dsNewIssueItemList.data = this.chargeslist
        }
    }

    CellCalculation = 0
    getCellCalculation(contact, Qty) {


        console.log(contact)
        // console.log(Qty)

        this.CellCalculation = 1
        if (parseFloat(contact.Qty) > parseFloat(contact.BalanceQty)) {
            this.toastr.warning('Issue Qty cannot be greater than BalanceQty.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            if (parseFloat(contact.Qty) == 0 || parseFloat(contact.Qty) < 0)
                this.toastr.warning('Enter Qty  greater than 0', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });

            contact.Qty = 0;
            contact.Qty = '';
            contact.VatAmount = 0;
            contact.LandedRateandedTotal = 0;
        }
        else {
            if (contact.Qty > 0) {
                contact.LandedRateandedTotal = (parseFloat(contact.Qty) * parseFloat(contact.LandedRate)).toFixed(4);
                contact.VatAmount = ((parseFloat(contact.VatPer) * parseFloat(contact.LandedRateandedTotal)) / 100).toFixed(4);
                this.Indbalqty = (this.Indbalqty) - parseInt(Qty);
                contact.IssueBalQty = (this.Indbalqty)

                if (contact.IssueBalQty == 0)
                    contact.IsClosed = true
                else
                    contact.IsClosed = false
            }
            else {
                contact.Qty = 0;
                contact.Qty = '';
                contact.VatAmount = 0;
                contact.LandedRateandedTotal = 0;
            }
        }


    }
    Accept = 0
    onAcceptChange(event: any) {
        this.Accept = event.value
    }

    OnSave() {
        console.log(this.vIndentId)
        if ((!this.dsNewIssueItemList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.StoreFrom.get("ToStoreId").value == 0)) {
            this.toastr.warning('Please select TostoreId', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
debugger
        if (!this.IssueFinalForm.invalid) {
            if (this.vIndentId > 0) {
                if (this.IsIndentAgainstMaterialAccept)
                    this.OnSaveAgaintIndentMaterialAccept();
                else
                    this.OnSaveAgaintIndent();
            } else {
                if (this.IsMaterialAccept)
                    this.OnNewAcceptSave();
                else
                    this.OnNewSave();
            }

        } else {
            const invalidFields = [];

            if (this.IssueFinalForm.invalid) {
                for (const controlName in this.IssueFinalForm.controls) {
                    if (this.IssueFinalForm.controls[controlName].invalid) {
                        invalidFields.push(`IssueFinal Form : ${controlName}`);
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

    OnNewAcceptSave() {

        this.AcceptdeptArray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.AcceptdeptArray.push(this.IssueItemdetailform(item));
        });

        this.AcceptstockArray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.AcceptstockArray.push(this.currentstockform(item));
        });

        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.issueId").setValue(0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.fromStoreId").setValue(this.accountService.currentUserValue.user.storeId)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.toStoreId").setValue(this.StoreFrom.get('ToStoreId').value || 0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.totalAmount").setValue(this.IssueFinalForm.get('FinalTotalAmount').value || 0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.totalVatAmount").setValue(this.IssueFinalForm.get('GSTAmount').value || 0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.netAmount").setValue(this.IssueFinalForm.get('FinalNetAmount').value || 0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.remark").setValue(this.IssueFinalForm.get('Remark').value || '')
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.addedby").setValue(this.accountService.currentUserValue.user.userId || 0)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.isVerified").setValue(true)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.isClosed").setValue(false)
        this.NewIssueGroupAccept.get("issuetoDeptWihMaterialAccept.indentId").setValue(0)

        this.itemdetailarray.clear();
        this.dsNewIssueItemList.data.forEach(element => {

            this.itemdetailarray.push(this.itemdetailform(element));
        });

        this.materialAcceptIssuedetailArray.clear();
        this.dsNewIssueItemList.data.forEach(element => {

            this.materialAcceptIssuedetailArray.push(this.materialAcceptIssueDetailsform(element));
        });

        console.log(this.NewIssueGroupAccept.value);
        // console.log(this.FinalIssueForm.value)
        this._IssueToDep.IssuetodepAcceptMaterialSave(this.NewIssueGroupAccept.value).subscribe(response => {
            this.viewgetIssuetodeptReportPdf(response)

            this._matDialog.closeAll();
        });
    }

    OnNewSave() {

        this.deptArray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.deptArray.push(this.IssueItemdetailform(item));
        });

        this.stockArray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.stockArray.push(this.currentstockform(item));
        });

        this.FinalIssueForm.get("issue.issueId").setValue(0)
        this.FinalIssueForm.get("issue.fromStoreId").setValue(this.accountService.currentUserValue.user.storeId)
        this.FinalIssueForm.get("issue.toStoreId").setValue(this.StoreFrom.get('ToStoreId').value || 0)
        this.FinalIssueForm.get("issue.totalAmount").setValue(this.IssueFinalForm.get('FinalTotalAmount').value || 0)
        this.FinalIssueForm.get("issue.totalVatAmount").setValue(this.IssueFinalForm.get('GSTAmount').value || 0)
        this.FinalIssueForm.get("issue.netAmount").setValue(this.IssueFinalForm.get('FinalNetAmount').value || 0)
        this.FinalIssueForm.get("issue.remark").setValue(this.IssueFinalForm.get('Remark').value || '')
        this.FinalIssueForm.get("issue.addedby").setValue(this.accountService.currentUserValue.user.userId || 0)
        this.FinalIssueForm.get("issue.isVerified").setValue(true)
        this.FinalIssueForm.get("issue.isClosed").setValue(false)
        this.FinalIssueForm.get("issue.indentId").setValue(0)

        console.log(this.FinalIssueForm.value)
        this._IssueToDep.IssuetodepSave(this.FinalIssueForm.value).subscribe(response => {
            this.viewgetIssuetodeptReportPdf(response)

            this._matDialog.closeAll();
        });
    }
    OnSaveAgaintIndent() {

        this.deptArray1.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.deptArray1.push(this.IssueItemdetailform(item));
        });

        this.indentdetailArray.clear();
        this.dsNewIssueItemList.data.forEach(element => {
            console.log(element)
            if (this.CellCalculation == 0)
                console.log(element)
            debugger
            const balQty = (parseInt(element.IndQty) - parseInt(element.Qty))

            if (balQty == 0)
                element.IsClosed = true;
            else
                element.IsClosed = false;

            this.indentdetailArray.push(this.indentdetailform(element));
        });

        this.stockArray1.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            if (item.IsClosed)
                this.Isclosedchk = true
            else
                this.Isclosedchk = false
            this.stockArray1.push(this.currentstockform(item));
        });

        this.FinalIssueaginstForm.get("updateIndent.issueId").setValue(0)
        this.FinalIssueaginstForm.get("updateIndent.fromStoreId").setValue(this.accountService.currentUserValue.user.storeId)
        this.FinalIssueaginstForm.get("updateIndent.toStoreId").setValue(this.StoreFrom.get('ToStoreId').value || 0)
        this.FinalIssueaginstForm.get("updateIndent.totalAmount").setValue(this.IssueFinalForm.get('FinalTotalAmount').value || 0)
        this.FinalIssueaginstForm.get("updateIndent.totalVatAmount").setValue(this.IssueFinalForm.get('GSTAmount').value || 0)
        this.FinalIssueaginstForm.get("updateIndent.netAmount").setValue(this.IssueFinalForm.get('FinalNetAmount').value || 0)
        this.FinalIssueaginstForm.get("updateIndent.remark").setValue(this.IssueFinalForm.get('Remark').value || '')
        this.FinalIssueaginstForm.get("updateIndent.addedby").setValue(this.accountService.currentUserValue.user.userId || 0)
        this.FinalIssueaginstForm.get("updateIndent.modifiedBy").setValue(this.accountService.currentUserValue.user.userId || 0)

        this.FinalIssueaginstForm.get("updateIndent.isVerified").setValue(false)
        this.FinalIssueaginstForm.get("updateIndent.isClosed").setValue(this.Isclosedchk)
        this.FinalIssueaginstForm.get("updateIndent.indentId").setValue(this.vIndentId)

        this.FinalIssueaginstForm.get('indentHeader.indentId').setValue(this.vIndentId)
        this.FinalIssueaginstForm.get('indentHeader.isClosed').setValue(this.Isclosedchk)


        console.log(this.FinalIssueaginstForm.value)

        this._IssueToDep.IssuetodepAgaintIndetSave(this.FinalIssueaginstForm.value).subscribe(response => {
            this.viewgetIssuetodeptReportPdf(response)
            this._matDialog.closeAll();
        });
    }

    OnSaveAgaintIndentMaterialAccept() {

        this.AcceptdeptIndentaginstdeptArray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            this.AcceptdeptIndentaginstdeptArray.push(this.IssueItemdetailform(item));
        });

        this.AcceptdeptIndentaginstindentdetailArray.clear();
        this.dsNewIssueItemList.data.forEach(element => {
            console.log(element)
            if (this.CellCalculation == 0)
                console.log(element)
            debugger
            const balQty = (parseInt(element.IndQty) - parseInt(element.Qty))

            if (balQty == 0)
                element.IsClosed = true;
            else
                element.IsClosed = false;

            this.AcceptdeptIndentaginstindentdetailArray.push(this.indentdetailform(element));
        });

        this.AcceptstockIndentaginstacceptarray.clear();
        this.dsNewIssueItemList.data.forEach(item => {
            if (item.IsClosed)
                this.Isclosedchk = true
            else
                this.Isclosedchk = false
            this.AcceptstockIndentaginstacceptarray.push(this.currentstockform(item));
        });

        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.issueId").setValue(0)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.fromStoreId").setValue(this.accountService.currentUserValue.user.storeId)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.toStoreId").setValue(parseInt(this.StoreFrom.get('ToStoreId').value || 0))
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.totalAmount").setValue(this.IssueFinalForm.get('FinalTotalAmount').value || 0)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.totalVatAmount").setValue(this.IssueFinalForm.get('GSTAmount').value || 0)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.netAmount").setValue(this.IssueFinalForm.get('FinalNetAmount').value || 0)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.remark").setValue(this.IssueFinalForm.get('Remark').value || '')
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.addedby").setValue(this.accountService.currentUserValue.user.userId || 0)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.modifiedBy").setValue(this.accountService.currentUserValue.user.userId || 0)

        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.isVerified").setValue(true)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.isClosed").setValue(true)
        this.FinalIssueaginstAcceptForm.get("issuetoDeptWihMaterialAccept.indentId").setValue(this.vIndentId)

        this.FinalIssueaginstAcceptForm.get('indentHeader.indentId').setValue(this.vIndentId)
        this.FinalIssueaginstAcceptForm.get('indentHeader.isClosed').setValue(true)


        console.log(this.FinalIssueaginstAcceptForm.value)

        this._IssueToDep.IssuetodepAgaintIndetdirectAcceptSave(this.FinalIssueaginstAcceptForm.value).subscribe(response => {
            this.viewgetIssuetodeptReportPdf(response)
            this._matDialog.closeAll();
        });
    }
    resetForm(): void {
        this.NewIssueGroup.reset({
            ItemName: "a",
            ItemID: 0,
            BatchNO: 0,
            BalanceQty: 0,
            Qty: 0,
            UnitRate: 0,
            TotalAmount: 0,
            Remark: 0,
            GSTAmount: '',
            FinalTotalAmount: '',
            FinalNetAmount: ''
        });

    }


    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    viewgetIssuetodeptReportPdf(issueId) {
        this.commonService.Onprint("IssueId", issueId, "Issutodeptissuewise");
    }

    resetFormItem() {
        const form = this.NewIssueGroup;

        form.patchValue({
            Barcode: '',
            ItemName: '',
            ItemID: [''],
            BatchNO: '',
            BalanceQty: '',
            Qty: '',
            UnitRate: '',
            TotalAmount: '',
        });
        this.NewIssueGroup.markAsUntouched();
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

    deleteTableRow(element) {
        const index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsNewIssueItemList.data = [];
            this.dsNewIssueItemList.data = this.chargeslist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }
    onClose() {
        this._matDialog.closeAll();
    }
    OnReset() {
        this._matDialog.closeAll();
        this.NewIssueGroup.reset();
    }

    selectChangeStore(obj: any) {
        console.log("Store:", obj);
        this.vstoreId = obj.value
        this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`
        // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`

    }
    selectChangeStore1(obj: any) {
        console.log("Store:", obj);
        this.vstoreId1 = obj.value
    }

}
export class IndentList {
    IndentNo: any;
    IndentDate: any;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: any;
    IndentId: any;
    constructor(IndentList) {
        {
            this.IndentNo = IndentList.IndentNo || 0;
            this.IndentDate = IndentList.IndentDate || 0;
            this.FromStoreName = IndentList.FromStoreName || '';
            this.ToStoreName = IndentList.ToStoreName || '';
            this.Addedby = IndentList.Addedby || 0;
            this.IndentId = IndentList.IndentId || 0;
        }
    }
}
export class IndentItemDetList {
    IndentNo: any;
    IndentDate: any;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: any;
    IndentId: any;
    constructor(IndentItemDetList) {
        {
            this.IndentNo = IndentItemDetList.IndentNo || 0;
            this.IndentDate = IndentItemDetList.IndentDate || 0;
            this.FromStoreName = IndentItemDetList.FromStoreName || '';
            this.ToStoreName = IndentItemDetList.ToStoreName || '';
            this.Addedby = IndentItemDetList.Addedby || 0;
            this.IndentId = IndentItemDetList.IndentId || 0;
        }
    }
}
