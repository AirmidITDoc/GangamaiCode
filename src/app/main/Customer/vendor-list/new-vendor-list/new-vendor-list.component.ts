import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { VendorListService } from '../vendor-list.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-vendor-list',
  templateUrl: './new-vendor-list.component.html',
  styleUrls: ['./new-vendor-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewVendorListComponent implements OnInit {

  dateTimeObj:any;
  registerObj:any;
  sIsLoading: string = '';
  isLoading = true;
  vVendorName:any;
  vVendorPersonMobileNo:any;
  vVendorpersonName:any;
  vPinCode:any;
  vMobileNo:any;
  vaddress:any;
  vVendorId:any;

  constructor(
  public _VendorInfo: VendorListService,
  public _matDialog: MatDialog,
  private _fuseSidebarService: FuseSidebarService,
  public datePipe: DatePipe,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public toastr: ToastrService,
  private elementRef: ElementRef,
  public dialogRef: MatDialogRef<NewVendorListComponent>,
  private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vVendorName = this.registerObj.VendorName
      this.vMobileNo = this.registerObj.VendorMobileNo
      this.vaddress = this.registerObj.VendorAddress
      this.vPinCode = this.registerObj.VendorPinCode
      this.vVendorpersonName = this.registerObj.VendorPersonName
      this.vVendorPersonMobileNo = this.registerObj.VendorPersonMobileNo
      this.vVendorId =this.registerObj.VendorId;
    }
  }

  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }

  Savebtn:boolean=false;
  onSubmit(){
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this._VendorInfo.myform.get('VendorName').value == '' || this._VendorInfo.myform.get('VendorName').value== null) {
      this.toastr.warning('Please enter Vendor Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this._VendorInfo.myform.get('Address').value == '' || this._VendorInfo.myform.get('Address').value== null) {
      this.toastr.warning('Please enter Address ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this._VendorInfo.myform.get('MobileNo').value == '' || this._VendorInfo.myform.get('MobileNo').value== null) {
      this.toastr.warning('Please enter MobileNo  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this._VendorInfo.myform.get('PinCode').value == '' || this._VendorInfo.myform.get('PinCode').value== null) {
      this.toastr.warning('Please enter PinCode ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this._VendorInfo.myform.get('PersonName').value == '' || this._VendorInfo.myform.get('PersonName').value== null) {
      this.toastr.warning('Please enter PersonName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this._VendorInfo.myform.get('PersonMobileNo').value == '' || this._VendorInfo.myform.get('PersonMobileNo').value== null) {
      this.toastr.warning('Please enter PersonMobileNo ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }  

    //insert code

  }
  
  onClose() {
    this._VendorInfo.myform.reset();
    this.dialogRef.close();
  } 
}
