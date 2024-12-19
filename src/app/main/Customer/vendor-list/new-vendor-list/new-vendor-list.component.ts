import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { VendorListService } from '../vendor-list.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

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
    if(this.data){
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
  onSave(){
    if (this.vVendorName == '' || this.vVendorName == null || this.vVendorName == undefined) {
      this.toastr.warning('Please enter Vendor Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this.vaddress == '' || this.vaddress == null || this.vaddress== undefined) {
      this.toastr.warning('Please enter Address ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else    
    if (this.vVendorpersonName == '' || this.vVendorpersonName == null || this.vVendorpersonName== undefined) {
      this.toastr.warning('Please enter PersonName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else
    if (this.vVendorPersonMobileNo == '' || this.vVendorPersonMobileNo == null || this.vVendorPersonMobileNo == undefined) {
      this.toastr.warning('Please enter PersonMobileNo ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 

    Swal.fire({
      title: 'Do you want to Save the Vendor Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmit();
      }
    });

  }
  Savebtn:boolean=false;
  onSubmit(){
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    // const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss');


    debugger
    if(!this.vVendorId){

      var m_dataInsert={
        "saveVendorInformationParam": {
          "vendorName": this._VendorInfo.myform.get("VendorName").value || '',
          "vendorAddress": this._VendorInfo.myform.get("Address").value || '',
          "vendorMobileNo": this._VendorInfo.myform.get("MobileNo").value || '',
          "vendorPinCode": this._VendorInfo.myform.get("PinCode").value || '',
          "vendorPersonName": this._VendorInfo.myform.get("PersonName").value || '',
          "vendorPersonMobileNo":this._VendorInfo.myform.get("PersonMobileNo").value || '',
          "createdBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("insertJson:", m_dataInsert);
      this._VendorInfo.vendorInsert(m_dataInsert).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });

    } else{
      debugger
      var m_dataUpdate={
        
          // "vendorId":this.vVendorId,
          // "vendorName": this._VendorInfo.myform.get("VendorName").value || '',
          // "vendorAddress": this._VendorInfo.myform.get("Address").value || '',
          // "vendorMobileNo": parseInt(this._VendorInfo.myform.get("MobileNo").value) || '',
          // "vendorPinCode": parseInt(this._VendorInfo.myform.get("PinCode").value) || '',
          // "vendorPersonName": this._VendorInfo.myform.get("PersonName").value || '',
          // "vendorPersonMobileNo":parseInt(this._VendorInfo.myform.get("PersonMobileNo").value) || '',
          // "createdBy": this._loggedService.currentUserValue.user.id,
          // "createdDateTime": formattedDate,    //this._VendorInfo.myform.get("Date").value || "2024-12-18T09:58:36.337Z",
          // "modifiedBy": this._loggedService.currentUserValue.user.id,
          // "modifiedDateTime": formattedDate,// this._VendorInfo.myform.get("Date").value || "2024-12-18T09:58:36.337Z",
        
          "updateVendorInformationParam": {
          "vendorId": this.vVendorId,
          "vendorName": this._VendorInfo.myform.get("VendorName").value || '',
          "vendorAddress": this._VendorInfo.myform.get("Address").value || '',
          "vendorMobileNo": parseInt(this._VendorInfo.myform.get("MobileNo").value) || '',
          "vendorPinCode": parseInt(this._VendorInfo.myform.get("PinCode").value) || '',
          "vendorPersonName": this._VendorInfo.myform.get("PersonName").value || '',
          "vendorPersonMobileNo": parseInt(this._VendorInfo.myform.get("PersonMobileNo").value) || '',
          "modifiedBy": this._loggedService.currentUserValue.user.id,
          }
      }
      console.log("updateJson:", m_dataUpdate);
      this._VendorInfo.vendorUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }    
  }
  
  onClose() {
    this._VendorInfo.myform.reset();
    this.dialogRef.close();
  } 
}
