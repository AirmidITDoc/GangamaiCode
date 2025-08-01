import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CanteenList } from '../canteen-request.component';
import { CanteenRequestService } from '../canteen-request.service';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
  
  vstoreId=this._loggedService.currentUserValue.user.storeId

  price = 0
  isBatchRequired: boolean = false;

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
      opIpId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: ["1"],
      wardId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      cashCounterId: 0,
      isFree: false,
      unitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isBillGenerated: false,
      isPrint: false,
      tCanteenRequestDetails: this.formBuilder.array([]), // FormArray for details

      // extra fields
      RegID: [0],
      StoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

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
      isBillGenerated: false,
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

  getSelectedObj(obj) {
    if (obj.IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.PatientName = ''
      this.vAdmissionID = ''
      this.RegNo = ''
      this.Doctorname = ''
      this.Tarrifname = ''
      this.CompanyName = ''
      this.vOPDNo = ''
      this.WardName = ''
      this.BedNo = ''
    }
    else {
      this.registerObj = obj;
      this.RegNo = obj.regNo;
      this.vAdmissionID = obj.admissionID;
      this.vOpDId = obj.admissionID;
      console.log(obj);
    }
    this.CanteenInsertForm.get("opIpId").setValue(this.vOpDId)
  }

  onAdd() {
    if(this._CanteenRequestservice.ItemForm.get('ItemId').value=='' || this._CanteenRequestservice.ItemForm.get('ItemId').value=='%'){
      this.toastr.warning('Please Select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this._CanteenRequestservice.ItemForm.get('Qty').value==''){
      this.toastr.warning('Please enter a qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if (!iscekDuplicate) {
      // debugger
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

  getSelectedserviceObj(obj) {
    console.log(obj)
    this.ItemId = obj.itemID
    this.ItemName = obj.itemName
    this.price = obj.price
    this.isBatchRequired = obj.isBatchRequired
  }

  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
    let index = this.Chargelist.indexOf(element);
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
    var inp = String.fromCharCode(event.keyCode);
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

    if ((this.vAdmissionID == 0)) {
      this.toastr.warning('Please Select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.CanteendetailArray.clear();
    this.dsItemList.data.forEach(item => {
      this.CanteendetailArray.push(this.createdetailForm(item));
    });

    ['RegID', 'StoreId'].forEach(controlName => {
      this.CanteenInsertForm.removeControl(controlName);
    });

    if (!this.CanteenInsertForm.invalid) {
      console.log(this.CanteenInsertForm.value)
      this._CanteenRequestservice.CanteenReqSave(this.CanteenInsertForm.value).subscribe(response => {
        // this._matDialog.closeAll();
        this.onClose();
      });
    } else {
      let invalidFields = [];

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
  dsCanteenDateList = new MatTableDataSource<CanteenList>();

  onClose() {
    this._matDialog.closeAll();
    this._CanteenRequestservice.ItemForm.reset();
    this.CanteenInsertForm.reset();
    this.dsCanteenDateList.data = [];
    this.dsItemList.data = [];
    this.Chargelist.data = [];
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
