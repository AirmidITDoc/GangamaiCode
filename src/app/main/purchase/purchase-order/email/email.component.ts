import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from '../purchase-order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class EmailComponent implements OnInit {

  registerObj: any;
  vToMailId: any;
  vSubject: any;
  vBody: any;
  vEmailfooter: any;
  isLoading: any;
  vCCName: any;
  vbccName: any;
  vPurchaseId: any;
  vPurchaseTime: any;
  screenFromString = 'admission-form';
  constructor(
    public _matDialog: MatDialog,
    public _PurchaseOrder: PurchaseOrderService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      if (this.registerObj.PurchaseID) {
        this.vPurchaseId = this.registerObj.PurchaseNo;
        this.vPurchaseTime = this.registerObj.PurchaseTime;
        this.vSubject = "Rise  Purchase Order  No :" + "  " + this.vPurchaseId + " From " + [this.registerObj.StoreName]

        this.vBody = "  Dear Sir , " + " " + this.registerObj.SupplierName + '"\n"' + "we rise Purchase order of Number" + " " + this.vPurchaseId + "  " + "placed on" + "Date : " + this.datePipe.transform(this.vPurchaseTime, "dd/MM/yyyy hh:mm") +
          "\n" + "\n" + "\n"


          + "Kind regards ," + "\n"
          + [this.registerObj.StoreName] + "\n"


      } else if (this.registerObj.GRNID) {
        this.vPurchaseId = this.registerObj.GrnNumber;
        this.vPurchaseTime = this.registerObj.GRNTime;

        this.vSubject = "Rise  GRN Order  No :" + "  " + this.vPurchaseId + " From " + [this.registerObj.StoreName]

        this.vBody = "  Dear Sir , " + " " + this.registerObj.SupplierName + '"\n"' + "we rise GRN order of Number" + " " + this.vPurchaseId + "  " + "placed on" + "Date : " + this.datePipe.transform(this.vPurchaseTime, "dd/MM/yyyy hh:mm") +
          "\n" + "\n" + "\n"


          + "Kind regards ," + "\n"
          + [this.registerObj.StoreName] + "\n"
      }
      //console.log(this.registerObj);
      this.vToMailId = this.registerObj.Email;
      // this.vSubject = "Rise  Purchase Order  No :" +"  " + this.vPurchaseId +" From "+ [this.registerObj.StoreName]

      // this.vBody = "  Dear Sir , "+" " + this.registerObj.SupplierName + '"\n"' + "we rise Purchase order of Number" +" " + this.vPurchaseId + "  " +"placed on" + "Date : "+ this.datePipe.transform(this.vPurchaseTime,"dd/MM/yyyy hh:mm") +
      // "\n"+"\n"+"\n"


      // + "Kind regards ," + "\n"
      // + [this.registerObj.StoreName] + "\n" 
    }


  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  OnSend() {
    this.isLoading = 'submit';
    let Emailobj = {};
    Emailobj['fromEmail'] = (this.accountService.currentUserValue.user.storeId).toString();
    Emailobj['fromName'] = "SS Medical";
    Emailobj['ToEmail'] = this._PurchaseOrder.POEmailFrom.get("ToMailId").value || '',
    Emailobj['cc'] = this._PurchaseOrder.POEmailFrom.get("CCName").value || '',
    Emailobj['bcc'] = this._PurchaseOrder.POEmailFrom.get("bccName").value || '',
    Emailobj['mailSubject'] = this._PurchaseOrder.POEmailFrom.get("Subject").value || '',
    Emailobj['mailBody'] = this._PurchaseOrder.POEmailFrom.get("Body").value || '',
    Emailobj['status'] = -2;
    Emailobj['retry'] = 0;
    Emailobj['attachmentName'] = "";
    Emailobj['attachmentLink'] = "";
    Emailobj['TranNo'] = this.registerObj.PurchaseID;
    Emailobj['EmailType'] = "Purchase";
    Emailobj['id'] = 0

    let submitData = {
      "insertEamil": Emailobj
    };
    console.log(submitData);
    this._PurchaseOrder.EmailSendInsert(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Email data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Email data not saved', 'error');
      }
      this.isLoading = '';
    });

  }
  OnReset() {
    this._PurchaseOrder.POEmailFrom.reset();
  }
  onClose() {
    this.dialogRef.close();
  }
}
