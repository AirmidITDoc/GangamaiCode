import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { CanteenList } from '../canteen-request.component';
import { CanteenRequestService } from '../canteen-request.service';

@Component({
    selector: 'app-new-canteen-request',
    templateUrl: './new-canteen-request.component.html',
    styleUrls: ['./new-canteen-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCanteenRequestComponent implements OnInit {

    data: any;
    autocompleteModegroupName: string = "Service";
    autocompleteModestoreName: string = "Store";
    autocompleteModewardName: string = "Room";
    dsItemList = new MatTableDataSource<CanteenItemList>();
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    vOPIPId: any = 0;
    vOPDNo: any;
    PatientName: any;
    vAdmissionID: any = 0;
    RegNo: any;
    Doctorname: any;
    Tarrifname: any;
    CompanyName: any;
    WardName: any;
    BedNo: any;
    registerObj: any;
    ItemId: any;
    ItemName: any;
    Chargelist: any = [];
    vOpDId: any = 0;

    vstoreId = this._loggedService.currentUserValue.user.storeId

    price = 0
    isBatchRequired: boolean = false;

    dsCanteenDateList = new MatTableDataSource<CanteenList>();
    CanteenInsertForm: FormGroup;
    CanteendetailForm: FormGroup;

    constructor(
        public _CanteenRequestservice: CanteenRequestService,
        private _loggedService: AuthenticationService,
        private accountService: AuthenticationService,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
    ) { }

    ngOnInit(): void {
        this.CanteenInsertForm = this.createcanteenInsertForm();
        this.CanteenInsertForm.markAllAsTouched();

        this._CanteenRequestservice.ItemForm.markAllAsTouched();
        this.CanteendetailArray.push(this.createdetailForm());

        this.CanteenInsertForm.get("StoreId").setValue(this._loggedService.currentUserValue.user.storeId)
    }

    createcanteenInsertForm(): FormGroup {
        return this.formBuilder.group({
            reqId: 0,
            date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            time: this.datePipe.transform(new Date(), 'hh:mm:ss a'),
            reqNo: "",
            opIpId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opIpType: ["1"],
            wardId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            cashCounterId: 0,
            isFree: false,
            unitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isBillGenerated: true,
            isPrint: true,
            tCanteenRequestDetails: this.formBuilder.array([]),
            CustomerName: "",
            RegID: 0

            // StoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

        });
    }

    createdetailForm(item: any = {}): FormGroup {
        return this.formBuilder.group({
            reqDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            reqId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [item.ItemID, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitMRP: [item.Price || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [Number(item.Qty) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmount: [item.totalamt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isBillGenerated: true,
            isCancelled: false
        });
    }

    get CanteendetailArray(): FormArray {
        return this.CanteenInsertForm.get('tCanteenRequestDetails') as FormArray;
    }

    getValidationMessages() {
        return {
            StoreId: [],
            WardName: [],
            ItemId: [],
            Qty: [],
            Remark: [],
            Price: [],

        }
    }

    displayedVisitColumns: string[] = [
        'Date',
        'Time'
    ]
    displayedVisitColumns2: string[] = [
        'ItemName',
        'Qty',
        'Remark',
        'buttons'
    ]

    vPatientName = ''
    getSelectedObjIP(obj) {

        console.log(obj)
        if ((obj.regID ?? 0) > 0) {
            console.log("Admitted patient:", obj)
            // this.vRegNo = obj.regNo
            // this.vRegId = obj.regID
            // this.vDoctorName = obj.doctorName
            this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
            // this.vDepartment = obj.departmentName
            // this.vAdmissionDate = obj.admissionDate
            // this.vAdmissionTime = obj.admissionTime
            // this.vAdmissionID = obj.admissionID
            // this.vIPDNo = obj.ipdNo
            // this.vAge = obj.age
            // this.vAgeMonth = obj.ageMonth
            // this.vAgeDay = obj.ageDay
            // this.vGenderName = obj.genderName
            // this.vRefDocName = obj.refDocName
            // this.vRoomName = obj.roomName
            // this.vBedName = obj.bedName
            // this.vPatientType = obj.patientType
            // this.vTariffName = obj.tariffName
            // this.vCompanyName = obj.companyName
            // this.vDOA = obj.admissionDate
            // this.vTariffId = obj.tariffId
            // this.vClassId = obj.classId

            this.registerObj = obj;
            console.log(obj)
            this.RegNo = obj.regNo;
            this.vAdmissionID = obj.admissionID;
            this.vOpDId = obj.admissionID;
            console.log(obj);

            this.CanteenInsertForm.get("opIpId").setValue(this.vOpDId)
        }

    }

    onAdd() {
        if (this._CanteenRequestservice.ItemForm.get('ItemId').value == '' || this._CanteenRequestservice.ItemForm.get('ItemId').value == '%') {
            this.toastr.warning('Please Select Item', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._CanteenRequestservice.ItemForm.get('Qty').value == '') {
            this.toastr.warning('Please enter a qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
        if (!iscekDuplicate) {
            this.dsItemList.data = [];
            this.Chargelist.push(
                {
                    ItemID: this.ItemId,
                    ItemName: this.ItemName,
                    Qty: this._CanteenRequestservice.ItemForm.get('Qty').value,
                    Price: this.price || 0,
                    totalamt: parseInt(this._CanteenRequestservice.ItemForm.get('Qty').value) * this.price,
                    Remark: this._CanteenRequestservice.ItemForm.get('Remark').value || ''
                });
            this.dsItemList.data = this.Chargelist
            console.log(this.dsItemList.data);
        } else {
            this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this._CanteenRequestservice.ItemForm.get('ItemId').reset('');
        this._CanteenRequestservice.ItemForm.get('Qty').reset('');
        this._CanteenRequestservice.ItemForm.get('Remark').reset('');
    }
    custflag = 0
    customertype(event) {
        console.log(event)
        if (event.value == 0)
            this.custflag = 1
        else
            this.custflag = 0
    }
    getSelectedserviceObj(obj) {
        console.log(obj)
        this.ItemId = obj.itemID
        this.ItemName = obj.itemName
        this.price = obj.price
        this.isBatchRequired = obj.isBatchRequired
    }


    getSelectedObj(obj) {
        console.log(obj)
        // this.RegId1 = obj.regID;
        // this.registerObj = obj;
        // this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName


        // this.registerObj = obj;
        // console.log(obj)
        // this.RegNo = obj.regNo;
        // this.vAdmissionID = obj.admissionID;
        // this.vOpDId = obj.admissionID;
        // console.log(obj);

        //  this.CanteenInsertForm.get("opIpId").setValue(this.vOpDId)
    }

    ItemFromReset() {
        this._CanteenRequestservice.ItemForm.patchValue({
            ItemId: "",
            Qty: "",
            Remark: "",
        });
    }

    deleteTableRow(event, element) {
        const index = this.Chargelist.indexOf(element);
        if (index >= 0) {
            this.Chargelist.splice(index, 1);
            this.dsItemList.data = [];
            this.dsItemList.data = this.Chargelist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
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

    savebtn: boolean = false;

    OnSave() {

        if ((!this.dsItemList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.CanteenInsertForm.get('opIpType').value == 1 && this.vAdmissionID == 0)) {
            this.toastr.warning('Please Select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        debugger
        if ((this.CanteenInsertForm.get('opIpType').value == "0" && this.CanteenInsertForm.get('CustomerName').value == '')) {
            this.toastr.warning('Please Select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        this.CanteendetailArray.clear();
        this.dsItemList.data.forEach(item => {
            this.CanteendetailArray.push(this.createdetailForm(item));
        });

        // ['RegID', 'StoreId'].forEach(controlName => {
        //   this.CanteenInsertForm.removeControl(controlName);
        // });

        this.CanteenInsertForm.removeControl('RegID')

        this.CanteenInsertForm.removeControl('CustomerName')

        console.log(this.CanteenInsertForm.value)
        if (!this.CanteenInsertForm.invalid) {

            this._CanteenRequestservice.CanteenReqSave(this.CanteenInsertForm.value).subscribe(response => {
                console.log(response)
                this.onPrint(response)
                this.onClose();
            });
        } else {
            const invalidFields = [];

            if (this.CanteenInsertForm.invalid) {
                for (const controlName in this.CanteenInsertForm.controls) {
                    if (this.CanteenInsertForm.controls[controlName].invalid) {
                        invalidFields.push(`Canteen Request Form: ${controlName}`);
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

    onPrint(element) {
        this.commonService.Onprint("ReqId", element, "CanteenRequestprint");
    }

    onClose() {
        this._matDialog.closeAll();
        this._CanteenRequestservice.ItemForm.reset();
        this.CanteenInsertForm.reset();
        this.dsCanteenDateList.data = [];
        this.dsItemList.data = [];
        this.Chargelist.data = [];
        this.ItemFromReset();
    }
}

export class CanteenItemList {
    ItemID: any;
    ItemId: any;
    ItemName: string;
    Qty: number;
    Remark: any;
    Price: any;
    totalamt: any;
    /**
    * Constructor
    *
    * @param CanteenItemList
    */
    constructor(CanteenItemList) {
        {
            this.ItemId = CanteenItemList.ItemId || 0;
            this.ItemID = CanteenItemList.ItemID || 0;
            this.ItemName = CanteenItemList.ItemName || "";
            this.Qty = CanteenItemList.Quantity || 0;
            this.Price = CanteenItemList.price || 0;
            this.Remark = CanteenItemList.Remark || '';
            this.totalamt = CanteenItemList.totalamt || '';
        }
    }
}
