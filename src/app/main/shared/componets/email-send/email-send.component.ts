import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EmailComponent } from 'app/main/purchase/purchase-order/email/email.component';
import { PurchaseOrderService } from 'app/main/purchase/purchase-order/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EmailSendComponent implements OnInit {
EmailFrom:FormGroup
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
    public datePipe: DatePipe,  private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.EmailFrom=this.createPOEmailFrom()
    if (this.data.Obj) {
      console.log(this.data)
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
      if (this.data.Obj.notificationType) {
        this.vToMailId = this.data.Obj.toAddress;
        this.vCCName = this.data.Obj.emailCC;
        this.vSubject = this.data.Obj.subject
        this.vBody = this.data.Obj.emailBody

debugger
        this.EmailFrom.get('ToMailId').setValue(this.data.Obj.toAddress)
        this.EmailFrom.get('CCName').setValue(this.data.Obj.emailCC)
        this.EmailFrom.get('bccName').setValue(this.data.Obj.emailCC)
        this.EmailFrom.get('Subject').setValue(this.data.Obj.subject)
        this.EmailFrom.get('Body').setValue(this.data.Obj.emailBody)

      }
      //console.log(this.registerObj);
      this.vToMailId = this.registerObj.Email;
     
    }


  }

    createPOEmailFrom() {
    return this._formBuilder.group({
      ToMailId: [''],
      Subject: [''],
      Body: [''],
      CCName: [''],
      bccName: ['']
    })
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  OnSend() {
    this.isLoading = 'submit';
    let Emailobj = {};
    Emailobj['fromEmail'] = (this.accountService.currentUserValue.storeId).toString();
    Emailobj['fromName'] = "SS Medical";
    Emailobj['ToEmail'] = this.EmailFrom.get("ToMailId").value || '',
      Emailobj['cc'] = this.EmailFrom.get("CCName").value || '',
      Emailobj['bcc'] = this.EmailFrom.get("bccName").value || '',
      Emailobj['mailSubject'] = this.EmailFrom.get("Subject").value || '',
      Emailobj['mailBody'] = this.EmailFrom.get("Body").value || '',
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
    this.EmailFrom.reset();
  }
  onClose() {
    this.dialogRef.close();
  }
}

