import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';  
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations'; 
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import { ItemFormMasterComponent } from 'app/main/setup/inventory/item-master/item-form-master/item-form-master.component';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';
import { GrnItemList, GRNList, ItemNameList } from '../good-receiptnote.component';
import { GoodReceiptnoteService } from '../good-receiptnote.service'; 
   import {  HostListener,  } from '@angular/core';
   import { FormArray, FormGroup, FormGroupName, UntypedFormBuilder, Validators } from '@angular/forms';
   import { PrintserviceService } from 'app/main/shared/services/printservice.service';   
   import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
    import { FixSupplierComponent } from 'app/main/setup/inventory/supplier-master/fix-supplier/fix-supplier.component';
   import { POtoGRNComponent } from '../poto-grn/poto-grn.component'; 
import { NewGRNService } from '../new-grn/new-grn.service';
import { GRNFinalFormModel, GRNFormModel, GRNItemResponseType, GSTType, ToastType } from '../new-grn/types';
import { ConfigService } from 'app/core/services/config.service';
   
   


const moment = _rollupMoment || _moment;
@Component({
    selector: 'app-update-grn',
    templateUrl: './update-grn.component.html',
    styleUrls: ['./update-grn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UpdateGRNComponent implements OnInit { 
       displayedColumns2 = [
           'Status',
           'SrNo',
           'ItemName',
           'UOMId',
           'HSNCode',
           'BatchNo',
           'ExpDate',
           'Qty',
           'FreeQty',
           'ConversionFactor',
           'TotalQty',
           'MRP',
           'Rate',
           'TotalAmount',
           'Disc',
           'Disc2',
           "GST", 
           'IGST',
           'IGSTAmount',
           'NetAmount',
           //'poId',
           // 'purDetID',
           //'isClosed',
           'poBalQty',
           'poQty',
           // 'landedRate',
           'purUnitRate',
           //'purUnitRateWF',
           'UnitMRP',
           // 'IsVerifiedUserId',
           // 'IsVerified',
           // 'IsVerifiedDatetime',
           // 'stockid',
           'buttons',
       ];
       displayedColumns3 = [
           'SupplierName',
           'ReceiveQty',
           'FreeQty',
           'MRP',
           'Rate',
           'discpercentage',
           'DiscAmount',
           'VatPercentage'
       ]
       GrnHeaderForm: FormGroup;
       userFormGroup: FormGroup
   
       isExpanded = false;
       sIsLoading: string = '';
       isLoading = true;
       screenFromString = 'grn-form';
       registerObj = new ItemNameList({});
       chargeslist: any = [];
       labelPosition: 'before' | 'after' = 'after';
       PaymentType: any;
       ItemID: any;
       VatPercentage: any;
       GSTPer: any;
       VatAmount: any;
       vFinalNetAmount: any; 
       IGSTFinalAmount: any;
       vPurchaseId: any = 0;
       InvoiceNo: any;
       GateEntryNo: any;
       SupplierId: any;
       Name: any;
       StoreId: any;
       GSTAmt: any;
       DiscAmt: any;
       IGSTAmt: any; 
       vContact: any;
       ItemId: any;
       vlastDay: string = '';
       lastDay2: string = '';
       vExpDate: string = '';
       dateTimeObj: any;
       lastsupplierflag: boolean = false;
       autocompletestore: string = "Store";
       autocompleteModeGSTType: string = "GstCalcType";
       autocompleteModeGSTTypesValues: string = "GSTTypes";
       autocompleteModebatchlist: string = "CheckExistingBatchAvailable";
       ItemName: any;
       Dis: any = 0;
       vpoBalQty: any;
       vMobile: any;
       ExpDate: any;
       currency:any;
       // Make it true when you want to use mock data.
       mock = false;
       vGRNType: boolean = true;
       vPaymentType: boolean = false
       // Bind dropdown mode
       dropdownMode = {
           gstCalcType: "GstCalcType",
           supplierMaster: "SupplierMaster"
       }
   
       dsGRNList = new MatTableDataSource<GRNList>();
       dsGrnItemList = new MatTableDataSource<GrnItemList>();
       dsItemNameList = new MatTableDataSource<ItemNameList>();
       dsItemNameList1 = new MatTableDataSource<ItemNameList>();
       dsTempItemNameList = new MatTableDataSource<ItemNameList>();
       dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();
   
   
       constructor(
           public _GRNList: GoodReceiptnoteService,
           public _matDialog: MatDialog,
           public datePipe: DatePipe,
           @Inject(MAT_DIALOG_DATA) public data: any,
           public dialogRef: MatDialogRef<UpdateGRNComponent>,
           private accountService: AuthenticationService,
           public toastr: ToastrService,
           private _FormvalidationserviceService: FormvalidationserviceService,
           private newGRNService: NewGRNService,
           private formBuilder: UntypedFormBuilder,
           private commonService: PrintserviceService,
           public _ConfigService:ConfigService
       ) {
           this.userFormGroup = this._GRNList.getGRNForm();
           this.userFormGroup.markAllAsTouched();
           this._GRNList.GRNFinalForm.markAllAsTouched();
       }
       ngOnInit(): void {
           this.GrnHeaderForm = this.createGrnHeaderInsert();
           this.PoToGrnSaveForm = this.createGrnPOInsert();
           if (this.mock) {
               this.setMockData();
           }
           if (this.data.chkNewGRN == 2) {
               //Edit GRN  
               this.registerObj = this.data.Obj;
               console.log(this.registerObj)
               this.getGRNrtrvItemlist();
               this.selectChangeSupplier(this.registerObj);
               if (this.registerObj.grntype == true) {
                   this.userFormGroup.get('GRNType').setValue(true)
               } else {
                   this.userFormGroup.get('GRNType').setValue(false)
               }
               if (this.registerObj.Cash_CreditType == true) {
                   this.userFormGroup.get('PaymentType').setValue(true)
               } else {
                   this.userFormGroup.get('PaymentType').setValue(false)
               }
           }
           else if (this.data.chkNewGRN == 3) {
               // get full data from excell import.
               let obj = this.data.FullData;
               this.registerObj = obj;
               this.dsItemNameList.data = obj.Items as ItemNameList[];
               this.chargeslist = obj.Items as ItemNameList[];
               this.dsTempItemNameList.data = obj.Items as ItemNameList[];
           }
                    //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue 
       }
       batchlistApiUrl: any = '';
       //Item details selectedObj
       getSelectedItem(item: GRNItemResponseType): void {
           if (this.mock) {
               return;
           }
           this.lastsupplierflag = true
           this.isExpanded = true;
           this.userFormGroup.patchValue({
               UOMId: item.umoId,
               HSNCode: item.hsNcode,
               ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
           });
           if (((item?.taxPer ?? 0) || 0) > 0) { 
               this.userFormGroup.patchValue({ 
                   IGST: item?.taxPer,
                   GST: item?.taxPer
               }) 
           }
           this.calculateTotalamt();
           this.getLastThreeItemInfo(item)
       } 
   
       getchangeIgstper(rate: any): void {
   
           if (Number(rate?.text) > 0) {
               this.userFormGroup.patchValue({ 
                   //IGST: rate?.taxPer,
                   GST: Number(rate.text),
               }) 
           } else {
               this.userFormGroup.get('IGST').reset(0); 
           }
           this.calculateTotalamt();
       }
       @ViewChild('addButton') addButton!: ElementRef<HTMLButtonElement>;
       @HostListener('document:keydown.enter', ['$event'])
       handleEnterKey(event: KeyboardEvent) {
           const activeElement = document.activeElement as HTMLElement;
   
           // Only act if focus is inside the CGST dropdown
           if (activeElement && activeElement.closest('airmid-dropdown')) { 
               const igstValue = this.userFormGroup.get('IGST')?.value;
   
               // If CGST already has a value, trigger the add button
               if ( igstValue) {
                   event.preventDefault(); // prevent default behavior if needed
                   this.addButton?.nativeElement.focus();
                   // this.addButton?.nativeElement.click();
               }
               // Otherwise let selectionChange happen and set the value normally
           }
       }
   
       //supplier details
       selectChangeSupplier(supplier: any): void {
           let SupplierId = 0
           if (supplier.value > 0) {
               SupplierId = supplier?.value
           } else if (this.registerObj) {
               SupplierId = this.registerObj?.supplierId
           }
           this._GRNList.getSupplierdetails(SupplierId).subscribe(response => {
               if (response) {
                   this.userFormGroup.patchValue({
                       Contact: response?.contactPerson || '',
                       Mobile: response?.mobile || 0,
                       SupplierId: response?.supplierId || 0,
                       SupplierName: response?.supplierName || '',
                       SupplierAddress: response?.address || ''
                   })
               }
           })
       }
       //BatchExpireDate calculation
       calculateLastDay() {
           //debugger 
           const NextExpiryDate = new Date();
           const Months = 3
           const inputDate = this.userFormGroup.get("ExpDate").value;
           const numericPattern = /^[0-9]+$/;
           const CurrentDate = new Date();
           const currentMonth = CurrentDate.getMonth();
           const currentYear = CurrentDate.getFullYear();
           const NxtMonths = ((currentMonth) + (Months));
           NextExpiryDate.setMonth(NxtMonths);
           const newNextDate = new Date(NextExpiryDate)
   
   
           if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
               const month = +inputDate.substring(0, 2);
               const year = +inputDate.substring(2, 6);
   
               if (year >= currentYear) {
                   if (month <= currentMonth && year == currentYear) {
                       Swal.fire({
                           icon: 'warning',
                           title: '⚠️ Expired Item Alert',
                           html: `<strong>This item has already <span style="color: #e74c3c;">expired</span>.</strong>`,
                           showConfirmButton: false,
                           timer: 2000,
                           timerProgressBar: true,
                           background: '#fff',
                           width: '400px',
                           padding: '1.5em',
                       });
                       this.vlastDay = '';
                       this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
                       return
                   }
                   if (month > 12 && month <= 0) {
                       this.vlastDay = '';
                       this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
                       this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                           toastClass: 'tostr-tost custom-toast-warning',
                       });
                       return;
                   }
                   const lastDay = this.getLastDayOfMonth(month, year);
                   this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                   this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                   const newuserDate = this.datePipe.transform(this.lastDay2, 'dd/MM/YYYY')
                   setTimeout(() => {
                       this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
                       const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
                       if (QtyElement) {
                           QtyElement.focus();
                       }
                   }, 500);
   
                   // Get values as strings in dd/MM/yyyy format
                   const NewNextExpiray = this.datePipe.transform(newNextDate, "dd/MM/yyyy");
                   const NewCurrentDate = this.vlastDay
                   if (NewNextExpiray && NewCurrentDate) {
                       // Convert to Date objects
                       const [sDay, sMonth, sYear] = NewNextExpiray.split('/').map(Number);
                       const [aDay, aMonth, aYear] = NewCurrentDate.split('/').map(Number);
   
                       const NewNextExpiray_1 = new Date(sYear, sMonth - 1, sDay);      // Month is 0-based
                       const NewCurrentDate_1 = new Date(aYear, aMonth - 1, aDay);
   
                       if (NewCurrentDate_1 < NewNextExpiray_1) {
                           Swal.fire({
                               icon: 'warning',
                               title: '⚠️ Upcoming Expiry Alert',
                               html: `<strong>This item will expire within the next 
                                                <span style="color:#e74c3c;">3 months</span>.</strong>`,
                               showConfirmButton: true,
                               confirmButtonText: 'OK',
                               confirmButtonColor: '#f39c12',
                               width: '400px',
                               padding: '1.5em',
                               background: '#fff',
                               timer: 4000,
                               timerProgressBar: true,

                               didClose: () => {
                                   this.userFormGroup.get('ExpDate')?.setValue(this.vlastDay);

                                   setTimeout(() => {
                                       const qtyElement = document.querySelector(
                                           `[name='Qty']`
                                       ) as HTMLElement;

                                       if (qtyElement) {
                                           qtyElement.focus();
                                       }
                                   }, 0);
                               }
                           });

                        //    this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
                        //    const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
                        //    if (QtyElement) {
                        //        QtyElement.focus();
                        //    }
                       }
                   }
               } else {
                   Swal.fire({
                       icon: 'warning',
                       title: '⚠️ Expired Item Alert',
                       html: `<strong>This item has already <span style="color: #e74c3c;">expired</span>.</strong>`,
                       showConfirmButton: false,
                       timer: 2000,
                       timerProgressBar: true,
                       background: '#fff',
                       width: '400px',
                       padding: '1.5em',
                   });
                   this.vlastDay = '';
                   this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
                   return
               }
           } else {
               this.vlastDay = '';
               this.userFormGroup.get('ExpDate').setValue(this.vlastDay)
               this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
       }
       private pad(num: number): string {
           return num.toString().padStart(2, '0');
       }
       private getLastDayOfMonth(month: number, year: number): number {
           return new Date(year, month, 0).getDate();
       }
       //Table Exp Date change
       lastDay1: any;
       CellcalculateLastDay(contact: ItemNameList, inputDate: string) {
           const numericPattern = /^[0-9]+$/;
           const CurrentDate = new Date();
           const currentMonth = CurrentDate.getMonth();
           const currentYear = CurrentDate.getFullYear();
   
           if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
               const month = +inputDate.substring(0, 2);
               const year = +inputDate.substring(2, 6);
               if (year <= currentYear) {
                   if (month <= currentMonth) {
                       Swal.fire({
                           icon: 'warning',
                           title: '⚠️ Expired Item Alert',
                           html: `<strong>This item has already <span style="color: #e74c3c;">expired</span>.</strong>`,
                           showConfirmButton: false,
                           timer: 2000,
                           timerProgressBar: true,
                           background: '#fff',
                           width: '400px',
                           padding: '1.5em',
                       });
                       this.lastDay1 = '';
                       contact.ExpDate = '';
                       return
                   }
                   if (month > 12 && month <= 0) {
                       this.lastDay1 = '';
                       contact.ExpDate = '';
                       this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                           toastClass: 'tostr-tost custom-toast-warning',
                       });
                       return;
                   }
                   const lastDay1 = this.getLastDayOfMonth(month, year);
                   this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                   this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                   contact.ExpDate = this.lastDay1;
               } else {
                   if (month > 12 && month <= 0) {
                       this.lastDay1 = '';
                       contact.ExpDate = '';
                       this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                           toastClass: 'tostr-tost custom-toast-warning',
                       });
                       return;
                   }
                   const lastDay1 = this.getLastDayOfMonth(month, year);
                   this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                   this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                   contact.ExpDate = this.lastDay1;
               }
           } else {
               this.lastDay1 = '';
               contact.ExpDate = '';
               this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
       }
       //Add item list
       onAddGRNItem() {
           debugger
           const formValue = this.userFormGroup.value
           if (!this.newGRNService.validateGRNForm(this.userFormGroup)) {
               return;
           }
           // Check if the item is already in the list
           //console.log("Form values : ", this.userFormGroup.value);
           const isDuplicate = this.dsItemNameList.data.some(item => Number(item?.ItemId) === Number(formValue?.ItemName?.itemId) &&
               item.BatchNo?.trim().toLowerCase() === formValue.BatchNo?.trim().toLowerCase() &&
               Number(item.MRP).toFixed(2) === Number(formValue.MRP).toFixed(2) && Number(item.Rate).toFixed(2) === Number(formValue.Rate).toFixed(2)
           );
           if (isDuplicate) {
               this.newGRNService.showToast('Item already added with same Batch no , MRP & Rate in the list', ToastType.WARNING);
               return;
           }
   
           this.userFormGroup.patchValue({
               BatchNo: (formValue.BatchNo?.batchNo ?? formValue.BatchNo).toUpperCase(),
           })
           const formValues = this.userFormGroup.getRawValue() as GRNFormModel;
           const totalQty = (Number(formValues.Qty) + Number(formValues.FreeQty)) * (Number(formValues.ConversionFactor) || 1);
           if (formValues.ItemName) {
               const newItem = new ItemNameList({
                   ...formValues,
                   ItemName: formValues.ItemName.itemName,
                   TotalQty: totalQty,
                   // Add any additional calculated fields
                   LandedRate: Number(formValues.NetAmount / (totalQty || 1)).toFixed(2),
                   PurUnitRate: Number(formValues.TotalAmount / (formValues.Qty * formValues.ConversionFactor)).toFixed(2),
                   PurUnitRateWF: Number(formValues.TotalAmount / (totalQty || 1)).toFixed(2),
                   UnitMRP: Number(formValues.MRP / formValues.ConversionFactor).toFixed(2),
                   ItemId: formValues.ItemName.itemId
               });
               this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
               this.updateGRNFinalForm();
           }
           this.resetFormItem();
           this.lastsupplierflag = false;
           this.isExpanded = false;
           this.userFormGroup.markAllAsTouched(); 
           setTimeout(() => {
               const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
               if (itemNameElement) {
                   itemNameElement.focus();
               }
           }, 1000);
       }
       //Delete 
       deleteTableRow(row: ItemNameList) {
           if (row.IsVerifiedUserId == 1) {
               this.newGRNService.showToast('Verified Record should not be Deleted .', ToastType.SUCCESS);
           } else {
               this.dsItemNameList.data = this.dsItemNameList.data.filter(item => item !== row);
               this.newGRNService.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
               this.updateGRNFinalForm();
           }
       }
       //Reset
       resetFormItem() {
           const form = this.userFormGroup;
           form.patchValue({
               ItemName: "",
               ConversionFactor: 1,
               Qty: "",
               UOMId: 0,
               HSNCode: "",
               BatchNo: "",
               ExpDate: "",
               FreeQty: 0,
               Rate: "",
               MRP: "",
               Disc: 0,
               Disc2: 0,
               DisAmount: 0,
               DisAmount2: 0, 
               IGST: 0,
               GST: 0,
               GSTAmount: 0,
               TotalAmount: 0,
               NetAmount: 0,
               FinalTotalQty: 0
           });
           this.userFormGroup.markAsUntouched();
       }
       
       //item Total amt
       calculateTotalamt() {
           const form = this.userFormGroup;
           // const enteredRate = Number(form.get('Rate').value).toFixed(2);
           // const lastRates = this.dsLastThreeItemList.data.map(item => Number(item.rate).toFixed(2));
   
           // // Check if rate matches any of last three
           // const isRateSame = lastRates.includes(enteredRate);
           
           // if (!isRateSame && (Number(enteredRate) > 0)) { 
           //     Swal.fire({
           //         icon: 'warning',
           //         title: 'Price Verification Required',
           //         html: ` <p>⚠️ The entered rate <strong>(${enteredRate})</strong> differs from your last three purchase rates 
           //         <strong>(${lastRates.join(', ')})</strong>.</p> <p>Please verify before saving.</p>
           //         <hr>  `,
           //         confirmButtonText: 'OK',
           //         confirmButtonColor: '#f39c12',
           //         background: '#fff',
           //         timer: 4000,
           //         timerProgressBar: true
           //     });
           // }
   
               this.validateFormValues();
           // Get values with proper type conversion
           const qty = +form.get('Qty').value || 0;
           const freeqty = +form.get('FreeQty').value || 0;
           const rate = +form.get('Rate').value || 0;
           const conversionFactor = +form.get('ConversionFactor').value || 1;
           // Calculate total quantity and amount
           const totalQty = (qty + freeqty) * conversionFactor;
           let totalAmount = 0;
           let netAmount = 0;
           if (qty > 0 && rate > 0) {
               totalAmount = rate * qty;
               netAmount = totalAmount;
               // Update form values
               form.patchValue({
                   TotalAmount: totalAmount,
                   NetAmount: netAmount,
                   FinalTotalQty: totalQty
               });
               // Trigger discount and GST calculations
               // this.calculateDiscperAmount();
           } else {
               // Reset all calculated values
               form.patchValue({
                   TotalAmount: 0,
                   DiscAmount: 0,
                   DiscAmount2: 0, 
                   IGSTAmount: 0,
                   GSTAmount: 0,
                   NetAmount: 0,
                   FinalTotalQty: totalQty
               });
           }
           this.calculateDiscountAmount();
           this.calculateGSTType();
       }
       calculateDiscper2Amt() { }
       // Calculate discount when discount percentage changes
       calculateDiscountAmount() {
           const form = this.userFormGroup;
           const values = form.getRawValue() as GRNFormModel;
           // Get and validate discount percentage
           const discountPercentage = Number(values.Disc || 0);
           if (discountPercentage >= 100 || discountPercentage < 0) {
               this.newGRNService.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
               form.patchValue({ Disc: 0 });
               this.calculateGSTType();
               return;
           }
           // Calculate discount amount
           const totalAmount = Number(values.TotalAmount || 0);
           const discountAmount = Number(((totalAmount * discountPercentage) / 100).toFixed(2));
           // Update form with new discount amount
           form.patchValue({
               DisAmount: discountAmount
           }, { emitEvent: false });
   
           // // Recalculate GST after discount update
           this.calculateGSTType();
       }
       calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
           const form = this.userFormGroup;
           const formValues = form.getRawValue() as GRNFormModel;
   
           // Get all required values with proper type conversion
           const values = this.newGRNService.normalizeValues(formValues);
   
           // Get GST Calculation
           const calculation = this.newGRNService.getGSTCalculation(type, values);
   
           // Update form with calculated values
           form.patchValue({
               IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
               IGSTAmount: calculation.igstAmount.toFixed(2),
               GSTAmount: calculation.totalGSTAmount.toFixed(2),
               NetAmount: calculation.netAmount.toFixed(2)
           }, { emitEvent: false });
       }
   
       calculateCellGSTType(item: ItemNameList): ItemNameList {
           // Validate input
           if (!item) return item;
           try {
               // Get all required values with proper type conversion
               const values = this.newGRNService.normalizeValues(item);
   
               // Get GST Calculation
               const calculation = this.newGRNService.getGSTCalculation(item.GSTType, values);
   
               // Create updated item with new values
               return {
                   ...item,
                   IGST: item.GSTType === GSTType.GST_AFTER_DISC ? 0 : values.igst,
                   IGSTAmount: Number(calculation.igstAmount.toFixed(2)),
                   GSTAmount: Number(calculation.totalGSTAmount.toFixed(2)),
                   NetAmount: Number(calculation.netAmount.toFixed(2)),
                   // Add any additional calculated fields
                   LandedRate: Number(calculation.netAmount / (item.TotalQty || 1)).toFixed(2),
                   PurUnitRate: Number(item.TotalAmount / (item.Qty * item.ConversionFactor)).toFixed(2),
                   PurUnitRateWF: Number(item.TotalAmount / (item.TotalQty || 1)).toFixed(2),
                   UnitMRP: Number(item.MRP / item.ConversionFactor).toFixed(2),
               };
           } catch (error) {
               console.error('Error calculating GST:', error);
               return item;
           }
       }
       //GST wise calculation
       IsDiscPer2: boolean = false;
       GSTTypeID: any = 0;
       GSTTypeName: any = '';
       itemlist: any = [];
   
   
       @ViewChild('HSNCodeInput') HSNCodeInput!: ElementRef;
       onGSTTypeChange(event: { value: number, text: string }) {
           console.log(event)
           this.GSTTypeName = event.text
           this.GSTTypeID = event.value;
           const newGSTType = event.text as GSTType;
           this.calculateGSTType(newGSTType);
           if (event.text == "GST After TwoTime Disc") {
               this.IsDiscPer2 = true
           } else {
               this.IsDiscPer2 = false
           }
           // Update gst type of table data 
           this.dsItemNameList.data.forEach((item) => {
               item.GSTType = newGSTType;
               this.getCellCalculation(item);
           })
   
           setTimeout(() => {
               if (this.HSNCodeInput?.nativeElement) {
                   this.HSNCodeInput.nativeElement.focus();
               } else {
                   console.warn('HSNCodeInput not found in DOM');
               }
           }, 500);
           //   const HSNCodeElement = document.querySelector(`[name='HSNCode']`) as HTMLElement;
           //     if (HSNCodeElement) {
           //         HSNCodeElement.focus();
           //     }
       }

       getIGSTAmt() {
           this.IGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
           return this.IGSTFinalAmount
       }
       getTotalAmount() {
           return this.dsItemNameList.data.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
       }
       getNetAmount() {
           return this.dsItemNameList.data.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
       }
       //Table calculation
       getCellCalculation(item: ItemNameList) {
           //Validate PO Quantity
           // if (!this.newGRNService.validatePOQuantity(item)) {  
           //     Swal.fire("Qty Should Be less than PO Qty : ",item.POQty); 
           //     return;
           // }
   
           setTimeout(() => {
               item.Qty = Number(item.Qty); // ensure it's a number
               item.POQty = Number(item.POQty); // just in case
               if (!this.newGRNService.validatePOQuantity(item)) {
                   Swal.fire({
                       title: "Validation Error",
                       text: `Qty should be less than PO Qty: ${item.POQty}`,
                       icon: "warning"
                   });
                   return;
               }
           });
           this.newGRNService.validateCellData(item);
           // Calculate basic values
           this.newGRNService.calculateBasicValues(item);
           // Validate GST Rates
           this.newGRNService.validateGSTRates(item);
           const updatedItem = this.calculateCellGSTType(item);
           Object.assign(item, updatedItem);
           this.updateGRNFinalForm();
       }
       updateGRNFinalForm() {
   
           this.BaseNetpayAmt = 0;
           const form = this._GRNList.GRNFinalForm;
           const itemList = this.dsItemNameList.data;
           const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
           const finalnetamt = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0).toFixed(2);
           const reoundingamt = Math.round(netAmount).toFixed(2)
           this.BaseNetpayAmt = netAmount || 0
           const updatableFormValues: GRNFinalFormModel = {
               TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2),
               VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(2),
               NetPayamt: Math.round(netAmount).toFixed(2),
               RoundingAmt: (parseFloat(reoundingamt) - parseFloat(finalnetamt)).toFixed(2),
               DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(2),
               DiscAmount2: itemList.reduce((sum, { DisAmount2 }) => sum += +(DisAmount2 || 0), 0),
               // OtherCharge: itemList.reduce((sum, { OtherCharge }) => sum += +(OtherCharge || 0), 0) 
           } as GRNFinalFormModel;
   
           form.patchValue({
               ...updatableFormValues
           });
           this.getcalculateothercharges();
       }
       BaseNetpayAmt: any = 0;
       getcalculateothercharges() {
   
           const form = this._GRNList.GRNFinalForm.value;
   
           const baseNet = parseFloat(this.BaseNetpayAmt) || 0;
           const otherCharge = parseFloat(form?.OtherCharge) || 0;
           const debitAmount = parseFloat(form?.DebitAmount) || 0;
           const creditAmount = parseFloat(form?.CreditAmount) || 0;
   
           // Calculate net based on original base + additions - credits
           let finalAmt = baseNet + otherCharge + debitAmount - creditAmount;
   
           const roundedAmt = Math.round(finalAmt);
           const roundingAmt = (roundedAmt - finalAmt).toFixed(2);
   
           this._GRNList.GRNFinalForm.patchValue({
               NetPayamt: roundedAmt.toFixed(2),
               RoundingAmt: roundingAmt
           });
       }
       resetForm() {
           this.userFormGroup.reset();
           this.dsItemNameList.data = [];
           this.updateGRNFinalForm();
       }
       //Insert header form
       createGrnHeaderInsert(): FormGroup {
           return this.formBuilder.group({
               //GRN Header form
               grn: this.formBuilder.group({
                   grnid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   grnNumber: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   grndate: [""],
                   grntime: [""],
                   storeId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                   supplierId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                   invoiceNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                   deliveryNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   gateEntryNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   cashCreditType: [true],
                   grntype: [true],
                   totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totalDiscAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totalVatamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   remark: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   receivedBy: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   isVerified: [false],
                   isClosed: [false],
                   addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   updatedBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   prefix: ["GRN", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   isCancelled: [false],
                   isPaymentProcess: [true],
                   paymentPrcDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
                   processDes: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   invDate: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   debitNote: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   creditNote: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   otherCharge: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   roundingAmt: [0],
                   paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   balAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totCgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totSgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totIgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   tranProcessId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   tranProcessMode: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   billDiscAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   ewayBillNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   ewayBillDate: [""],
                   //GRN Details form
                   tGrndetails: this.formBuilder.array([]),
               }),
               // Current stock form
               grnItems: this.formBuilder.array([])
           });
       }
       //Insert grn details form
       createGrndetailInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               grndetId: [item?.grnDetID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               grnid: [this.registerObj?.grnid || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               itemId: [item?.ItemId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               uomid: [item?.UOMId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               returnQty: [0],
               receiveQty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               freeQty: [item?.FreeQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               mrp: [item?.UnitMRP, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               rate: [item?.Rate, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               totalAmount: [item?.TotalAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               conversionFactor: [item?.ConversionFactor, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               vatPercentage: [item?.GST || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               vatAmount: [item?.GSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discPercentage: [item?.Disc || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discAmount: [item?.DisAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               otherTax: [item?.otherTax || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               landedRate: [item?.LandedRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               grossAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               totalQty: [item?.TotalQty, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               pono: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
               batchExpDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
               purUnitRate: [item?.PurUnitRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               purUnitRateWf: [item?.PurUnitRateWF || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               cgstper: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               cgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgstper: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igstper: [item?.IGST || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igstamt: [item?.IGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               mrpStrip: [item?.MRP || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               stkId: [item?.StkID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               discPerc2: [item?.DiscPer2 || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discAmt2: [item?.DiscAmt2 || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               isVerified: [false],
               isVerifiedDatetime: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
               isVerifiedUserId: [0],
           });
       }
       //Insert current stk form
       createGrnItemInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               itemId: [item?.ItemId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
               hsncode: [item?.HSNCode, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
               cgst: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgst: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igst: [item?.IGST, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               conversionFactor: [String(item?.ConversionFactor), [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
           });
       }
       get GrndetailArray(): FormArray {
           return this.GrnHeaderForm.get('grn.tGrndetails') as FormArray;
       }
       get ItemArray(): FormArray {
           return this.GrnHeaderForm.get('grnItems') as FormArray;
       }
       onSave() {
           const formValues = this.userFormGroup.getRawValue() as GRNFormModel;
           if ((formValues.StoreId == '' || formValues.StoreId == null || formValues.StoreId == '0')) {
               this.toastr.warning('Please select a supplier name', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
           if ((formValues.SupplierId == '' || formValues.SupplierId == null || formValues.SupplierId == '0')) {
               this.toastr.warning('Please select a supplier name', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
           if ((formValues.InvoiceNo == '' || formValues.InvoiceNo == null)) {
               this.toastr.warning('Please enter a InvoiceNo', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
           if (!(this.dsItemNameList.data.length)) {
               this.toastr.warning('Please enter a Item details in list', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
           if (!this.isValidForm()) {
               Swal.fire('Please enter valid table data.');
               return;
           }
           if ((this._GRNList.GRNFinalForm.get('ReceivedBy').value == '' || this._GRNList.GRNFinalForm.get('ReceivedBy').value == null)) {
               this.toastr.warning('Please enter a ReceivedBy Name', 'Warning !', {
                   toastClass: 'tostr-tost custom-toast-warning',
               });
               return;
           }
           Swal.fire({
               title: 'Do you want to Save the GRN ',
               text: "You won't be able to revert this!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, Save !"
           }).then((result) => {
               if (result.isConfirmed) {
                   if (!this.vPurchaseId) {
                       this.OnSavenew();
                   }
                   else {
                       this.OnSavePoTOGRN();
                   }
               }
           })
       }
       OnSavenew() {
           const grnPatchData = {
               grndate: this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
               grntime: this.dateTimeObj.time,
               storeId: this.userFormGroup.get('StoreId')?.value,
               supplierId: this.userFormGroup.get('SupplierId')?.value,
               invoiceNo: this.userFormGroup.get('InvoiceNo')?.value,
               gateEntryNo: this.userFormGroup.get('GateEntryNo')?.value || '',
               totalAmount: this._GRNList.GRNFinalForm.get('TotalAmt')?.value,
               totalDiscAmount: this._GRNList.GRNFinalForm.get('DiscAmount')?.value,
               totalVatamount: this._GRNList.GRNFinalForm.get('VatAmount')?.value,
               netAmount: this._GRNList.GRNFinalForm.get('NetPayamt')?.value,
               remark: this._GRNList.GRNFinalForm.get('Remark')?.value || '',
               receivedBy: this._GRNList.GRNFinalForm.get('ReceivedBy')?.value,
               invDate: this.datePipe.transform(this.userFormGroup.get('DateOfInvoice')?.value, "yyyy-MM-dd") || '1999-01-01',
               debitNote: this._GRNList.GRNFinalForm.get('DebitAmount')?.value || 0,
               creditNote: this._GRNList.GRNFinalForm.get('CreditAmount')?.value || 0,
               otherCharge: this._GRNList.GRNFinalForm.get('OtherCharge')?.value || 0,
               roundingAmt: this._GRNList.GRNFinalForm.get('RoundingAmt')?.value || 0,
               cashCreditType: this.userFormGroup.get('PaymentType')?.value === true ? true : false,
               grntype: this.userFormGroup.get('GRNType')?.value === true ? true : false,
               paidAmount: this.userFormGroup.get('PaymentType')?.value === true ? this._GRNList.GRNFinalForm.get('NetPayamt')?.value : 0,
               balAmount: this.userFormGroup.get('PaymentType')?.value === false ? this._GRNList.GRNFinalForm.get('NetPayamt')?.value : 0,
               totIgstamt: this.IGSTFinalAmount.toFixed(2) || 0,
               tranProcessId: this.userFormGroup.get('GSTType')?.value || 0,
               tranProcessMode: this.GSTTypeName || '',
               billDiscAmt: this._GRNList.GRNFinalForm.get('DiscAmount2')?.value || 0,
               ewayBillNo: this._GRNList.GRNFinalForm.get('EwayBillNo')?.value || '',
               ewayBillDate: this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate')?.value, "yyyy-MM-dd"),
           };
           this.GrnHeaderForm.get('grn')?.patchValue(grnPatchData);
           debugger
   
           if (this.GrnHeaderForm.valid) {
               this.GrndetailArray.clear();
               this.dsItemNameList.data.forEach(item => {
                   // this.GrndetailArray.push(this.createGrndetailInsert(item));
                   const input = item?.ExpDate;
                   const [day, month, year] = input.split("/");
                   const formattedDate = `${year}-${month}-${day}`;
                   const formObj = this.createGrndetailInsert(item);
                   formObj.patchValue({ batchExpDate: formattedDate || '1999-01-01' });
                   this.GrndetailArray.push(formObj);
               });
               this.ItemArray.clear();
               this.dsItemNameList.data.forEach(item => {
                   this.ItemArray.push(this.createGrnItemInsert(item));
               });
               if (!this.registerObj?.grnid) {
                   //New GRN Save
                   console.log(this.GrnHeaderForm.value)
                   this._GRNList.GRNSave(this.GrnHeaderForm.value).subscribe(response => {
                       this.OnReset();
                       this.viewgetGRNReportPdf(response)
                   });
               } else {
                   // GRN Update
                   this.GrnHeaderForm.get("grn.grnid").setValue(this.registerObj?.grnid)
                   this.GrnHeaderForm.get("grn.grnNumber").setValue(this.registerObj?.grnNumber)
                   this.GrnHeaderForm.get("grn.grndate")?.setValue(this.registerObj?.grndate || '1999-01-01')
                   this.GrnHeaderForm.get("grn.grntime")?.setValue(this.registerObj?.grntime || "12:00")
                   this.GrnHeaderForm.get("grn.updatedBy")?.setValue(this.accountService.currentUserValue.userId)
                   console.log(this.GrnHeaderForm.value)
                   this._GRNList.GRNEdit(this.GrnHeaderForm.value, this.registerObj?.grnid).subscribe(response => {
                       this.viewgetGRNReportPdf(this.registerObj?.grnid)
                       this.OnReset();
                   });
               }
           } else {
               let invalidFields = [];
               if (this.GrnHeaderForm.invalid) {
                   for (const controlName in this.GrnHeaderForm.controls) {
                       const control = this.GrnHeaderForm.get(controlName);
                       if (control instanceof FormGroup || control instanceof FormArray) {
                           for (const nestedKey in control.controls) {
                               if (control.get(nestedKey)?.invalid) {
                                   invalidFields.push(`GRN Data : ${controlName}.${nestedKey}`);
                               }
                           }
                       } else if (control?.invalid) {
                           invalidFields.push(`GRn From Data: ${controlName}`);
                       }
                   }
               }
               if (invalidFields.length > 0) {
                   invalidFields.forEach(field => {
                       this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                       );
                   });
                   return
               }
           }
       }
       viewgetGRNReportPdf(grnid) {
           this.commonService.Onprint("GRNID", grnid, "GRNReport");
       }
       OnReset() {
           this.BaseNetpayAmt = 0;
           this._matDialog.closeAll();
           this.resetForm();
           this.vPurchaseId = 0;
       }
       // item details retreving 
       getGRNrtrvItemlist() {
           var vdata = {
               "first": 0,
               "rows": 10,
               "sortField": "GRNDetID",
               "sortOrder": 0,
               "filters": [{ "fieldName": "GRNID", "fieldValue": String(this.registerObj.grnid), "opType": "Equals" }],
               "Columns": [],
               "exportType": "JSON"
           }
           this._GRNList.getGRNrtrvItemlist(vdata).subscribe(response => {
               this.dsItemNameList.data = response.data
               this.vPurchaseId = this.dsItemNameList.data[0]?.purchaseId || 0
               console.log(this.dsItemNameList.data)
               this.dsItemNameList.data.forEach(element => {
                   this.chargeslist.push(
                       {
                           ItemId: element.itemId,
                           ItemName: element.itemName,
                           ConversionFactor: element.conversionFactor,
                           UOMId: element.uomId,
                           HSNCode: element.hsncode,
                           BatchNo: element.batchNo,
                           ExpDate: element.batchExpDate,
                           Qty: element.receiveQty,
                           FreeQty: element.freeQty,
                           TotalQty: element.totalQty,
                           MRP: element.mrp,
                           Rate: element.rate,
                           TotalAmount: element.totalAmount,
                           Disc: element.discPercentage,
                           DisAmount: element.discAmount,
                           Disc2: 0,
                           DiscAmt2: element.discAmt2,
                           GST: element.vatPercentage,
                           GSTAmount: element.vatAmount,
                           IGST: element.igstper,
                           IGSTAmount: element.igstamt,
                           NetAmount: element.netAmount,
                           PurchaseId: element.purchaseId,
                           PurDetId: element.purDetId,
                           POBalQty: element.poBalQty,
                           POQty: element.poQty,
                           purchaseNo: element.poNo,
                           LandedRate: element.landedRate,
                           purUnitRate: element.purUnitRate,      //Purchaserate
                           PurUnitRateWF: element.purUnitRateWf,
                           //unitmrp
                           UnitMRP: element.unitMRP,
                           IsVerifiedUserId: element.isVerifiedUserId,
                           IsVerified: element.isVerified,
                           IsVerifiedDatetime: element.isVerifiedDatetime,
                           StkID: element.stkID,
                           grnDetID: element.grnDetID
                       }
                   )
               })
               this.dsItemNameList.data = this.chargeslist;
               this.updateGRNFinalForm();
           });
       }
       // Handlers
       validateFormValues() {
           const form = this.userFormGroup;
           const values = form.getRawValue() as GRNFormModel;
           if (+values.Qty < 0) {
               this.newGRNService.showToast('Quantity should be greater than 0', ToastType.WARNING);
               form.patchValue({
                   Qty: 0,
               });
           }
           if (+values.FreeQty < 0) {
               this.newGRNService.showToast('Free Quantity should be greater than 0', ToastType.WARNING);
               form.patchValue({
                   FreeQty: 0,
               });
           }
           if (+values.MRP < 0) {
               this.newGRNService.showToast('MRP should be greater than 0', ToastType.WARNING);
               form.patchValue({
                   MRP: 0,
               });
           }
           if (+values.Rate < 0) {
               this.newGRNService.showToast('Rate should be greater than 0', ToastType.WARNING);
               form.patchValue({
                   Rate: 0,
               });
           }
           if (+values.Rate > +values.MRP) {
               this.newGRNService.showToast('Rate should be less than MRP', ToastType.WARNING);
               form.patchValue({
                   Rate: 0,
               });
           }
           if (+values.ConversionFactor < 0) {
               this.newGRNService.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
               form.patchValue({
                   ConversionFactor: 1,
               });
           }
       }
       ngOnDestroy(): void {
           this.resetForm();
           this.GrnHeaderForm.reset()
       }
       setFocus(elementId: string) {
           // Set focus to the element with the given id
       }
       setMockData() {
           this.userFormGroup.patchValue({
               UOMId: 1234,
               ConversionFactor: 5,
               Qty: 10,
               IGST: 0,
               GST: 12,
               Rate: 100,
               MRP: 200,
               FreeQty: 5,
               Disc: 10,
               BatchNo: "123",
               ItemName: {
                   itemName: "Test Item"
               }
           });
           // console.log("Form values : ", this.userFormGroup.value);
           this.calculateTotalamt();
       }
       private resetCalculations(contact: any): void {
           const resetValues = {
               TotalAmount: 0,
               DiscAmount: 0,
               DiscAmt2: 0,
               IGSTAmt: 0,
               VatAmount: 0,
               NetAmount: 0
           };
           Object.assign(contact, resetValues);
       }
       getValidationMessages() {
           return {
               supplierId: [
                   // { name: "required", Message: "SupplierId is required" }
               ],
               GSTType: [
                   // { name: "required", Message: "SupplierId is required" }
               ],
               itemName: [
                   // { name: "required", Message: "Item Name is required" }
               ],
               batchNo: [
                   // { name: "required", Message: "Batch No is required" }
               ],
               invoiceNo: [
                   // { name: "required", Message: "Invoice No is required" }
               ],
               gateEntryNo: [
                   // { name: "required", Message: "Gate Entry No is required" }
               ],
               mrp: [
                   // { name: "required", Message: "MRP is required" }
               ],
               rate: [
                   // { name: "required", Message: "Rate is required" }
               ],
               StoreId: [
                   // { name: "required", Message: "StoreId is required" }
               ],
               CGST: [
                   // { name: "required", Message: "StoreId is required" }
               ],
               IGST: [
                   // { name: "required", Message: "StoreId is required" }
               ],
               BatchNo: [
                   // { name: "required", Message: "StoreId is required" }
               ],
           };
       }
       getDateTime(dateTimeObj) {
           this.dateTimeObj = dateTimeObj;
       }
       // Add New Item
       OnAddItem() {
           const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
               maxWidth: "100%",
               height: '95%',
               width: '95%',
           });
           dialogRef.afterClosed().subscribe((result) => {
               console.log("The dialog was closed - Insert Action", result);
           });
       }
       // Add New Supplier
       OnAddSupplier() {
           const dialogRef = this._matDialog.open(FixSupplierComponent, {
               maxWidth: "100%",
               height: '95%',
               width: '95%',
           });
           dialogRef.afterClosed().subscribe((result) => {
               console.log("The dialog was closed - Insert Action", result);
           });
       }
       // Last three item info
       getLastThreeItemInfo(Obj) {
           var vdata = {
               "first": 0,
               "rows": 10,
               "sortField": "ItemId",
               "sortOrder": 0,
               "filters": [{ "fieldName": "ItemId", "fieldValue": String(Obj.itemId), "opType": "Equals" }],
               "exportType": "JSON",
               "columns": [{ "data": "string", "name": "string" }]
           }
           this._GRNList.getLastThreeItemInfo(vdata).subscribe(response => {
               this.dsLastThreeItemList.data = response.data as LastThreeItemList[];
           });
       }
       isValidForm(): boolean {
           //  return this.dsItemNameList.data.every((i) => i.ConversionFactor > 0 && i.Qty > 0 && i.TotalQty > 0 );
           return this.dsItemNameList.data.every((item) =>
               item.ConversionFactor > 0 && item.Qty > 0 && item.TotalQty > 0 && !!item.HSNCode && !!item.ExpDate // Checks for null, undefined, false, 0, NaN, ''
           );
   
       }
       // it allowed only Digit 
       keyPressDigitsOnly(event) {
           var inp = String.fromCharCode(event.keyCode);
           if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
               return true;
           } else {
               event.preventDefault();
               return false;
           }
       }
       // it allowed only Digit & decimal
       keyPressDigitDecimalOnly(event) {
           var inp = String.fromCharCode(event.keyCode);
           if (/^\d*\.?\d*$/.test(inp)) {
               return true;
           } else {
               event.preventDefault();
               return false;
           }
       }
       // Check Invice is already exist or not 
       chkInvoiceNo(InvoiceNo) {
           if (!this.userFormGroup.get('SupplierId')?.value) {
               this.newGRNService.showToast('Please select Supplier Name', ToastType.WARNING);
               this.userFormGroup.get('InvoiceNo')?.setValue('')
               return
           }
           var vdata = {
               "searchFields": [
                   { "fieldName": "InvoiceNo", "fieldValue": String(InvoiceNo), "opType": "13" },
                   { "fieldName": "SupplierId", "fieldValue": String(this.userFormGroup.get('SupplierId')?.value), "opType": "13" },
                   { "fieldName": "StoreId", "fieldValue": String(this.userFormGroup.get('StoreId')?.value), "opType": "13" }
               ],
               "mode": "grnInvoicenocheck"
           }
           this._GRNList.getGRNchkInvoice_chkGSTTypes(vdata).subscribe(response => {
               if (response[0]?.Invoice_Exists == 1) {
                   this.newGRNService.showToast('Entered Invoice no already exists', ToastType.WARNING);
                   this.userFormGroup.get('InvoiceNo').setValue('');
                   const InvoiceNoNameElement = document.querySelector(`[name='InvoiceNo']`) as HTMLElement;
                   if (InvoiceNoNameElement) {
                       InvoiceNoNameElement.focus();
                   }
                   return;
               }
           });
   
       }
           // Check Invice is already exist or not 
       chkpreviouserates(rate) { 
           const enteredRate = rate;
           const lastRates = this.dsLastThreeItemList.data.map(item => Number(item.rate).toFixed(2));
   
           // Check if rate matches any of last three
           const isRateSame = lastRates.includes(enteredRate);
           
           if (!isRateSame && (Number(enteredRate) > 0)) { 
               Swal.fire({
                   icon: 'warning',
                   title: 'Price Verification Required',
                   html: ` <p>⚠️ The entered rate <strong>(${enteredRate})</strong> differs from your last three purchase rates 
                   <strong>(${lastRates.join(', ')})</strong>.</p> <p>Please verify before saving.</p>
                   <hr>  `,
                   confirmButtonText: 'OK',
                   confirmButtonColor: '#f39c12',
                   background: '#fff',
                   timer: 4000,
                   timerProgressBar: true
               });
           }
   
       }
       onBatchChange(event) {
           console.log(event)
           if (((event?.vatper ?? 0) || 0) > 0) {
               this.userFormGroup.patchValue({
                   IGST: event?.igstPer,
                   GST: event?.gst
               })
           }
           const expDate = this.datePipe.transform(event.batchExpDate, 'MMYYYY')
           this.userFormGroup.patchValue({
               ExpDate: expDate,
               MRP: event?.unitMRP || 0,
               Rate: event?.unitPurRate || 0,
           })
       }
   
       onEnterHSNCode(event) {
           const HSNCodeElement = document.querySelector(`[name='HSNCode']`) as HTMLElement;
           if (HSNCodeElement) {
               HSNCodeElement.focus();
           }
       }
       convertUppercase(value: string): string {
           return value ? value.toUpperCase() : '';
       }
       //Purchase order to grn section
       getPurchaseList() {
           const dialogRef = this._matDialog.open(POtoGRNComponent, {
               maxWidth: '100%',
               height: '100%',
               width: '95%',
           });
           dialogRef.afterClosed().subscribe((result) => {
               debugger
               console.log(result)
               this.dsItemNameList1.data = result
               this.vPurchaseId = result[0]?.PurchaseId || 0;
               const otherAmt = (result[0]?.freightCharges || 0) + (result[0]?.handlingCharges || 0)
                   + (result[0]?.transportChanges || 0) + (result[0]?.octriAmount || 0)
               this._GRNList.GRNFinalForm.get('OtherCharge').setValue(otherAmt);
               this.registerObj.supplierId = result[0]?.supplierId
               this._GRNList.getSupplierdetails(result[0]?.supplierId).subscribe(response => {
                   if (response) {
                       this.userFormGroup.patchValue({
                           Contact: response?.contactPerson || '',
                           Mobile: response?.mobile || 0,
                           SupplierId: response?.supplierId || 0,
                           SupplierName: response?.supplierName || '',
                           SupplierAddress: response?.address || ''
                       })
                   }
               })
               // this.userFormGroup.get('SupplierId').setValue(result[0]?.supplierId);
   
               this.dsItemNameList1.data = result;
               this.dsItemNameList1.data.forEach((element) => {
                   const FinalTotalQty = (element.Qty * element?.ConversionFactor || 1);
                   const FinalpurUnitRate = (((element.TotalAmount) / (element.Qty)) * (element?.ConversionFactor || 1))
                   const FinalpurUnitrateWF = (((element.TotalAmount) / (FinalTotalQty)) * (element?.ConversionFactor || 1))
                   let  FinalUnitMRP_1 = 0 
                   if(element?.MRP){
                    FinalUnitMRP_1 = (element.MRP) / (element?.ConversionFactor || 1)
                   }else{
                    let FinalMRP = (element.Rate) * (element?.ConversionFactor || 1)
                    FinalUnitMRP_1 = (FinalMRP) / (element?.ConversionFactor || 1)   
                   } 
                   const FinalUnitMRP = FinalUnitMRP_1 || 0;
                   this.chargeslist.push(
                       {
                           ItemId: element.ItemId ?? 0,
                           ItemName: element.ItemName?.trim() || '',
                           ConversionFactor: Number(element.ConversionFactor) || 1,
                           UOMId: element.UOMId ?? 0,
                           HSNCode: element.HSNCode || 'N/A',
                           BatchNo: '',
                           ExpDate: '', // Set default if needed e.g., '1999-01-01'
                           Qty: Number(element.Qty) || 1,
                           FreeQty: 0,
                           TotalQty: Number(FinalTotalQty) || 0,
                           MRP: Number(element.MRP) || 0,
                           Rate: Number(element.Rate) || 0,
                           TotalAmount: Number(element.TotalAmount) || 0,
                           Disc: Number(element.Disc) || 0,
                           DisAmount: Number(element.DisAmount) || 0,
                           Disc2: 0,
                           DiscAmt2: 0,
                           GST: Number(element.GST) || 0,
                           GSTAmount: Number(element.GSTAmount) || 0,
                           IGST: Number(element.IGST) || 0,
                           IGSTAmount: Number(element.IGSTAmount) || 0,
                           NetAmount: Number(element.NetAmount) || 0,
                           PurchaseId: element.PurchaseId ?? 0,
                           PurDetId: element.PurDetId ?? 0,
                           POBalQty: Number(element.POBalQty) || 0,
                           POQty: Number(element.POQty) || 0,
                           LandedRate: Number(element.LandedRate) || 0,
                           purUnitRate: Number(FinalpurUnitRate) || 0,
                           PurUnitRateWF: Number(FinalpurUnitrateWF) || 0,
                           UnitMRP: Number(FinalUnitMRP) || 0,
                           IsVerifiedUserId: 0,
                           IsVerified: false,
                           IsVerifiedDatetime: '1999-01-01',
                           StkID: 0,
                           grnDetID: 0,
                           purchaseNo: Number(element.PurchaseNo) || 0
                       });
                   this.dsItemNameList.data = this.chargeslist
                   this.updateGRNFinalForm();
               });
           });
   
   
       }
       PoID: any = 0;
       //----------------------------------------------------------------- Po to GRN Save ----
       // PO to GRN Insert header form
       PoToGrnSaveForm: FormGroup;
       createGrnPOInsert(): FormGroup {
           return this.formBuilder.group({
               //GRN Header form
               grn: this.formBuilder.group({
                   grnid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   grnNumber: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   grndate: [""],
                   grntime: [""],
                   storeId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                   supplierId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                   invoiceNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                   deliveryNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   gateEntryNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   cashCreditType: [true],
                   grntype: [true],
                   totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totalDiscAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totalVatamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   remark: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   receivedBy: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   isVerified: [false],
                   isClosed: [false],
                   addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   updatedBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   prefix: ["GRN", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   isCancelled: [false],
                   isPaymentProcess: [true],
                   paymentPrcDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
                   processDes: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   invDate: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   debitNote: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   creditNote: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   otherCharge: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   roundingAmt: [0],
                   paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   balAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totCgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totSgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   totIgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   tranProcessId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                   tranProcessMode: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   billDiscAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                   ewayBillNo: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                   ewayBillDate: [""],
                   //GRN Details form
                   tGrndetails: this.formBuilder.array([]),
               }),
               // Current stock form
               grnItems: this.formBuilder.array([]),
               // Current stock form
               grnPODetails: this.formBuilder.array([]),
               // Current stock form
               grnPOHeaders: this.formBuilder.array([]),
   
           });
       }
       //Insert Po to grn details form
       createGrnPOdetailInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               grndetId: [item?.grnDetID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               grnid: [this.registerObj?.grnid || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               itemId: [item?.ItemId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               uomid: [item?.UOMId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               receiveQty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               freeQty: [item?.FreeQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               mrp: [item?.UnitMRP, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               rate: [item?.Rate, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               totalAmount: [item?.TotalAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               conversionFactor: [item?.ConversionFactor, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               vatPercentage: [item?.GST || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               vatAmount: [item?.GSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discPercentage: [item?.Disc || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discAmount: [item?.DisAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               otherTax: [item?.otherTax || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               landedRate: [item?.LandedRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               grossAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               totalQty: [item?.TotalQty, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
               pono: [item?.PurchaseId, [this._FormvalidationserviceService.onlyNumberValidator()]],
               batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
               batchExpDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
               purUnitRate: [item?.PurUnitRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               purUnitRateWf: [item?.PurUnitRateWF || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               cgstper: [ 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               cgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgstper: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgstamt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igstper: [item?.IGST || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igstamt: [item?.IGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               mrpStrip: [item?.MRP || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               stkId: [item?.StkID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               discPerc2: [item?.DiscPer2 || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               discAmt2: [item?.DiscAmt2 || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               isVerified: [false],
               isVerifiedDatetime: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
               isVerifiedUserId: [0],
           });
       }
       //Insert Po to grn current stk form
       createGrnPOItemInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               itemId: [item?.ItemId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
               hsncode: [item?.HSNCode, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
               cgst: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               sgst: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               igst: [item?.IGST, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
               conversionFactor: [String(item?.ConversionFactor), [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
           });
       }
       //Insert Po to grn PoDetails stk form
       createGrnPODetInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               purchaseId: [item?.PurchaseId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
               isClosed: [true]
           });
       }
       //Insert Po to grn POHeader stk form
       createGrnPOHeaderInsert(item: any = {}): FormGroup {
           return this.formBuilder.group({
               purchaseId: [item?.PurchaseId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
               purDetId: [item?.PurDetId ?? 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
               pobalQty: [item?.POBalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               isClosed: [true]
           });
       }
       get GrnPOdetailArray(): FormArray {
           return this.PoToGrnSaveForm.get('grn.tGrndetails') as FormArray;
       }
       get GrnPoItemArray(): FormArray {
           return this.PoToGrnSaveForm.get('grnItems') as FormArray;
       }
       get GrnPoHeaderArray(): FormArray {
           return this.PoToGrnSaveForm.get('grnPOHeaders') as FormArray;
       }
       get GrnPoDetailsArray(): FormArray {
           return this.PoToGrnSaveForm.get('grnPODetails') as FormArray;
       }
       OnSavePoTOGRN() {
           const grnPatchData = {
               grndate: this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
               grntime: this.dateTimeObj.time,
               storeId: this.userFormGroup.get('StoreId')?.value,
               supplierId: this.userFormGroup.get('SupplierId')?.value,
               invoiceNo: this.userFormGroup.get('InvoiceNo')?.value,
               gateEntryNo: this.userFormGroup.get('GateEntryNo')?.value || '',
               totalAmount: this._GRNList.GRNFinalForm.get('TotalAmt')?.value,
               totalDiscAmount: this._GRNList.GRNFinalForm.get('DiscAmount')?.value,
               totalVatamount: this._GRNList.GRNFinalForm.get('VatAmount')?.value,
               netAmount: this._GRNList.GRNFinalForm.get('NetPayamt')?.value,
               remark: this._GRNList.GRNFinalForm.get('Remark')?.value || '',
               receivedBy: this._GRNList.GRNFinalForm.get('ReceivedBy')?.value,
               invDate: this.datePipe.transform(this.userFormGroup.get('DateOfInvoice')?.value, "yyyy-MM-dd") || '1999-01-01',
               debitNote: this._GRNList.GRNFinalForm.get('DebitAmount')?.value || 0,
               creditNote: this._GRNList.GRNFinalForm.get('CreditAmount')?.value || 0,
               otherCharge: this._GRNList.GRNFinalForm.get('OtherCharge')?.value || 0,
               roundingAmt: this._GRNList.GRNFinalForm.get('RoundingAmt')?.value || 0,
               cashCreditType: this.userFormGroup.get('PaymentType')?.value === true ? true : false,
               grntype: this.userFormGroup.get('GRNType')?.value === true ? true : false,
               paidAmount: this.userFormGroup.get('PaymentType')?.value === true ? this._GRNList.GRNFinalForm.get('NetPayamt')?.value : 0,
               balAmount: this.userFormGroup.get('PaymentType')?.value === false ? this._GRNList.GRNFinalForm.get('NetPayamt')?.value : 0,
               totIgstamt: this.IGSTFinalAmount || 0,
               tranProcessId: this.userFormGroup.get('GSTType')?.value || 0,
               tranProcessMode: this.GSTTypeName || '',
               billDiscAmt: this._GRNList.GRNFinalForm.get('DiscAmount2')?.value || 0,
               ewayBillNo: this._GRNList.GRNFinalForm.get('EwayBillNo')?.value || '',
               ewayBillDate: this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate')?.value, "yyyy-MM-dd"),
           };
           this.PoToGrnSaveForm.get('grn')?.patchValue(grnPatchData);
           debugger
           this.GrnPOdetailArray.clear();
           this.dsItemNameList.data.forEach(item => {
               this.GrnPOdetailArray.push(this.createGrnPOdetailInsert(item));
           });
           this.GrnPoItemArray.clear();
           this.dsItemNameList.data.forEach(item => {
               this.GrnPoItemArray.push(this.createGrnPOItemInsert(item));
           });
           this.GrnPoHeaderArray.clear();
           this.dsItemNameList.data.forEach(item => {
               this.GrnPoHeaderArray.push(this.createGrnPOHeaderInsert(item));
           });
           this.GrnPoDetailsArray.clear();
           this.dsItemNameList.data.forEach(item => {
               this.GrnPoDetailsArray.push(this.createGrnPODetInsert(item));
           });
           console.log(this.PoToGrnSaveForm.value)
           if (this.PoToGrnSaveForm.valid) {
               if (!this.registerObj?.grnid) {
                   //New GRN Save
                   this._GRNList.POtoGRNSave(this.PoToGrnSaveForm.value).subscribe(response => {
                       this.OnReset();
                       console.log(response)
                       this.viewgetGRNReportPdf(response)
                   });
               } else {
                   // GRN Update
                   this.PoToGrnSaveForm.get("grn.grnid").setValue(this.registerObj?.grnid)
                   this.PoToGrnSaveForm.get("grn.grnNumber").setValue(this.registerObj?.grnNumber)
                   this.PoToGrnSaveForm.get("grn.updatedBy")?.setValue(this.accountService.currentUserValue.userId)
                   this._GRNList.POtoGRNUpated(this.PoToGrnSaveForm.value, this.registerObj?.grnid).subscribe(response => {
                       this.viewgetGRNReportPdf(this.registerObj?.grnid)
                       this.OnReset();
                       console.log(response)
                   });
               }
           } else {
               let invalidFields = [];
               if (this.PoToGrnSaveForm.invalid) {
                   for (const controlName in this.PoToGrnSaveForm.controls) {
                       const control = this.PoToGrnSaveForm.get(controlName);
                       if (control instanceof FormGroup || control instanceof FormArray) {
                           for (const nestedKey in control.controls) {
                               if (control.get(nestedKey)?.invalid) {
                                   invalidFields.push(`Po to GRN Data : ${controlName}.${nestedKey}`);
                               }
                           }
                       } else if (control?.invalid) {
                           invalidFields.push(`Po TO GRN From Data: ${controlName}`);
                       }
                   }
               }
               if (invalidFields.length > 0) {
                   invalidFields.forEach(field => {
                       this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                       );
                   });
                   return
               }
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
       rate: any;
   
       constructor(LastThreeItemList) {
           {
               this.ItemID = LastThreeItemList.ItemID || 0;
               this.ItemName = LastThreeItemList.ItemName || "";
               this.BatchNo = LastThreeItemList.BatchNo || 0;
               this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
               this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
               this.FreeQty = LastThreeItemList.FreeQty || 0;
               this.MRP = LastThreeItemList.MRP || 0;
               this.rate = LastThreeItemList.rate || 0;
   
   
           }
       }
   }