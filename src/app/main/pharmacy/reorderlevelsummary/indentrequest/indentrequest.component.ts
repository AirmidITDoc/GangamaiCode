import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ReorderlevelsummaryService } from '../reorderlevelsummary.service';

@Component({
    selector: 'app-indentrequest',
    templateUrl: './indentrequest.component.html',
    styleUrls: ['./indentrequest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IndentrequestComponent implements OnInit {
    displayedColumns = [
        'ItemName',
        'Packing',
        'BalQty',
        'StripQty',
        'IndentQty',
        'Action',
    ]
    dateTimeObj: any;
    IndentSaveFrom: FormGroup;
    sIsLoading: string = '';
    isLoadingStr: string = "";
    isLoading: string = '';
    screenFromString = 'indent-form';
    autocompletestore: string = "Store";
    isStoreSelected: boolean = false;
    filteredOptionsStore: Observable<string[]>;
    ToStoreList: any = [];
    registerObbj: any;
    chargeslist: any = [];
    vToStored: any;
    Savebtn: boolean = false
    dsRaisedIndent = new MatTableDataSource<RaisedIndentList>();
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public _Reorderlevelsummery: ReorderlevelsummaryService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _dialogRef: MatDialogRef<IndentrequestComponent>,
        public toastr: ToastrService,
        private _formBuilder: FormBuilder,
        private _loggedService: AuthenticationService,
        public _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    ngOnInit(): void {
        this.IndentSaveFrom = this.CreateIndentSaveFrom();
        if (this.data.Obj) {
            this.registerObbj = this.data.Obj;
            console.log(this.registerObbj)
            this.chargeslist.data = this.registerObbj;
            this.getRaisedIndent();
        }
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getRaisedIndent() {
        this.dsRaisedIndent.data = this.chargeslist.data;
        this.dsRaisedIndent.sort = this.sort;
        this.dsRaisedIndent.paginator = this.paginator;
    }
    CreateIndentSaveFrom() {
        return this._formBuilder.group({
            unitId: [this._loggedService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            indentId: 0,
            IndentDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            IndentTime: this.datePipe.transform(new Date(), 'shortTime'),
            FromStoreId: [this._loggedService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ToStoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isdeleted: 0,
            isverify: false,
            isclosed: false,
            comments: "",
            priority: [false],
            tIndentDetails: this._formBuilder.array([]),
        });
    }
    get IndentdetailArray(): FormArray {
        return this.IndentSaveFrom.get('tIndentDetails') as FormArray;
    }
    // || element.VerifyQuantit
    createdetailInsert(element: any = {}): FormGroup {
        debugger
        return this._formBuilder.group({
            indentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [element.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isclosed: [false],
            indQty: [0 | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issQty: [0],
            verifiedQty: [element.VerifyQuantity || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],

        });
    }
    OnSave1() {
        if ((!this.dsRaisedIndent.data.length)) {
            this.toastr.warning('Data is not a vailable in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.IndentdetailArray.clear();
        this.dsRaisedIndent.data.forEach(item => {
            this.IndentdetailArray.push(this.createdetailInsert(item));
        });

        if (!this.IndentSaveFrom.invalid) {
            this.IndentSaveFrom.get("indentId").setValue(0)
            console.log(this.IndentSaveFrom.value)

            this._Reorderlevelsummery.RaisedIndentSave(this.IndentSaveFrom.value).subscribe(response => {
                this._matDialog.closeAll();
            });
        } else {
            const invalidFields = [];
            if (this.IndentSaveFrom.invalid) {
                for (const controlName in this.IndentSaveFrom.controls) {
                    if (this.IndentSaveFrom.controls[controlName].invalid) { invalidFields.push(`Indent Form: ${controlName}`); }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }
        }
    }
    OnSave() {
        if ((!this.dsRaisedIndent.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vToStored == '' || this.vToStored == null || this.vToStored == undefined)) {
            this.toastr.warning('Please select To Store Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const isCheckIndentQty = this.dsRaisedIndent.data.some(item => item.IndentQty === this._Reorderlevelsummery.RaisedIndentFrom.get('IndentQty').value);
        if (!isCheckIndentQty) {
            this.Savebtn = true;
            const InsertIndentObj = {};
            InsertIndentObj['indentDate'] = this.dateTimeObj.date;
            InsertIndentObj['indentTime'] = this.dateTimeObj.time;
            InsertIndentObj['fromStoreId'] = this._loggedService.currentUserValue.storeId;
            InsertIndentObj['toStoreId'] = this._Reorderlevelsummery.RaisedIndentFrom.get('ToStoreId').value.StoreId;
            InsertIndentObj['addedby'] = this._loggedService.currentUserValue.userId;
            InsertIndentObj['comments'] = '';

            const InsertIndentDetObj = [];
            this.dsRaisedIndent.data.forEach((element) => {
                const IndentDetInsertObj = {};
                IndentDetInsertObj['indentId'] = 0;
                IndentDetInsertObj['itemId'] = element.ItemId;
                IndentDetInsertObj['qty'] = element.IndentQty;
                InsertIndentDetObj.push(IndentDetInsertObj);
            });

            const submitData = {
                "insertIndent": InsertIndentObj,
                "insertIndentDetail": InsertIndentDetObj,
            };

            console.log(submitData);

            this._Reorderlevelsummery.RaisedIndentSave(submitData).subscribe(response => {
                if (response) {
                    this.toastr.success('Record Raised Indent Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    this.OnReset();
                    this.onClose();
                    this.Savebtn = false;
                } else {
                    this.toastr.error('New Raised Indent Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('New Raised Indent Data not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });
        } else {
            this.toastr.warning('Please enter Indent Qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }


    }



    deleteTableRow(elm) {
        this.dsRaisedIndent.data = this.dsRaisedIndent.data
            .filter(i => i !== elm)
            .map((i, idx) => (i.position = (idx + 1), i));
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    OnReset() {
        this.chargeslist.data = [];
        this.dsRaisedIndent.data = [];
        this._Reorderlevelsummery.RaisedIndentFrom.reset();
        //this._matDialog.closeAll();
    }
    onClose() {
        this._matDialog.closeAll();
    }
    getValidationMessages() {
        return {
            ToStoreId: [
                // { name: "required", Message: "Invoice No is storeid" }
            ]

        };
    }
}
export class RaisedIndentList {
    ItemId: any;
    ItemName: string;
    Packing: any;
    BalQty: any;
    StripQty: any;
    IndentQty: any;
    position: number;

    constructor(RaisedIndentList) {
        {
            this.ItemName = RaisedIndentList.ItemName || '';
            this.Packing = RaisedIndentList.Packing || 0;
            this.ItemId = RaisedIndentList.ItemId || 0;
            this.BalQty = RaisedIndentList.BalQty || 0;
            this.StripQty = RaisedIndentList.StripQty || 0;
            this.IndentQty = RaisedIndentList.IndentQty || 0;
        }
    }
}