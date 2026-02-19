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
import { WhatsAppEmailService } from '../../services/whats-app-email.service';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service';

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
  vBillNo:any=0;
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
    public _whatsppService:WhatsAppEmailService,
    private accountService: AuthenticationService,
    public _formvalidationService:FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    debugger
 
    this.EmailFrom=this.createPOEmailFrom()
    if (this.data.Obj) {
      console.log(this.data)
      this.registerObj = this.data.Obj;
      this.EmailFrom.patchValue({
       ToMailId: this.registerObj?.emailId || ''
      })
      this.EmailFrom=this.createPOEmailFrom()
      if(this.data?.emailType == 'OPBill'){
        this.vBillNo = this.registerObj?.billNo || 0
      }
      else if(this.data?.emailType == 'OPReceipt'){
        this.vBillNo = this.registerObj?.paymentId || 0
      }
      else if(this.data?.emailType == 'IPBill'){
        this.vBillNo = this.registerObj?.billNo || 0
      }
      else if(this.data?.emailType == 'IPReceipt'){
        this.vBillNo = this.registerObj?.paymentId || 0
      }
      else if(this.data?.emailType == 'IPAdvance'){
        this.vBillNo = this.registerObj?.advanceId || 0
      }
      else if(this.data?.emailType == 'IPAdvanceRefund'){
        this.vBillNo = this.registerObj?.refundId || 0
      }
      else if(this.data?.emailType == 'IPRefundReceipt'){
        this.vBillNo = this.registerObj?.refundId || 0
      }
      else if(this.data?.emailType == 'PathResultEntry'){
        this.vBillNo = this.registerObj?.pathReportId || 0
      }
      else if(this.data?.emailType == 'RadiologyReport'){
        this.vBillNo = this.registerObj?.radReportId || 0
      }
      else if(this.data?.emailType == 'SalesReceipt'){
        this.vBillNo = this.registerObj?.salesId || 0
      }
      else if(this.data?.emailType == 'SalesReturnReceipt'){
        this.vBillNo = this.registerObj?.salesReturnId || 0
      }
      else if(this.data?.emailType == 'GRNReceipt'){
        this.vBillNo = this.registerObj?.grnid || 0
      }
      else if(this.data?.emailType == 'GRNReturnReceipt'){
        this.vBillNo = this.registerObj?.grnreturnId || 0
      }
      else if(this.data?.emailType == 'PurchaseReport'){
        this.vBillNo = this.registerObj?.purchaseID || 0
      }
      // else if(this.data?.emailType == 'SupplierPayReceipt'){
      //   this.vBillNo = this.registerObj?.grnreturnId || 0
      // }
      // if (this.registerObj.PurchaseID) {
      //   this.vPurchaseId = this.registerObj.PurchaseNo;
      //   this.vPurchaseTime = this.registerObj.PurchaseTime;
      //   this.vSubject = "Rise  Purchase Order  No :" + "  " + this.vPurchaseId + " From " + [this.registerObj.StoreName]

      //   this.vBody = "  Dear Sir , " + " " + this.registerObj.SupplierName + '"\n"' + "we rise Purchase order of Number" + " " + this.vPurchaseId + "  " + "placed on" + "Date : " + this.datePipe.transform(this.vPurchaseTime, "dd/MM/yyyy hh:mm") +
      //     "\n" + "\n" + "\n"


      //     + "Kind regards ," + "\n"
      //     + [this.registerObj.StoreName] + "\n"


      // } else if (this.registerObj.GRNID) {
      //   this.vPurchaseId = this.registerObj.GrnNumber;
      //   this.vPurchaseTime = this.registerObj.GRNTime;

      //   this.vSubject = "Rise  GRN Order  No :" + "  " + this.vPurchaseId + " From " + [this.registerObj.StoreName]

      //   this.vBody = "  Dear Sir , " + " " + this.registerObj.SupplierName + '"\n"' + "we rise GRN order of Number" + " " + this.vPurchaseId + "  " + "placed on" + "Date : " + this.datePipe.transform(this.vPurchaseTime, "dd/MM/yyyy hh:mm") +
      //     "\n" + "\n" + "\n"


      //     + "Kind regards ," + "\n"
      //     + [this.registerObj.StoreName] + "\n"
      // }

 
//       if (this.data.Obj.notificationType) {
//         this.vToMailId = this.data.Obj.toAddress;
//         this.vCCName = this.data.Obj.emailCC;
//         this.vSubject = this.data.Obj.subject
//         this.vBody = this.data.Obj.emailBody 
// debugger
//         this.EmailFrom.get('ToMailId').setValue(this.data.Obj.toAddress)
//         this.EmailFrom.get('CCName').setValue(this.data.Obj.emailCC)
//         this.EmailFrom.get('bccName').setValue(this.data.Obj.emailCC)
//         this.EmailFrom.get('Subject').setValue(this.data.Obj.subject)
//         this.EmailFrom.get('Body').setValue(this.data.Obj.emailBody)

//       } 
    } 
  }  
  createPOEmailFrom() {
    const unitName = this.accountService.currentUserValue.user?.tLoginUnitDetails?.[0]?.unitName || '';
    const patientName = this.registerObj?.patientName || '';
    const regNo = this.registerObj?.regNo || '';

    return this._formBuilder.group({
      ToMailId: ['', [this._formvalidationService.allowEmptyStringValidator()]],
      Subject: [`${patientName} - ${regNo}`, [this._formvalidationService.allowEmptyStringValidator()]],
    Body: [`Dear Recipient,
Greetings from ${unitName}.
Please find the details below for your review. Kindly take the necessary action and feel free to contact us if any clarification is needed.

Regards,
${unitName}`],
      CCName: ['', [this._formvalidationService.allowEmptyStringValidatorOnly()]],
      bccName: ['', [this._formvalidationService.allowEmptyStringValidatorOnly()]]
    });
} 
  
showCc = false;
showBcc = false;

toggleCc() {
  this.showCc = !this.showCc;
}

toggleBcc() {
  this.showBcc = !this.showBcc;
}


  OnSend() {
    debugger
    const formvalues = this.EmailFrom.value
    if (this.EmailFrom.valid) {
      this._whatsppService.OnEmailMsgSent({
        toEmail: formvalues?.ToMailId ?? "",   // patient email or fallback
        cc: formvalues?.CCName ?? "",
        mailSubject: formvalues?.Subject || "",
        mailBody: formvalues?.Body || "",
        billNo: this.vBillNo,
        emailType: this.data?.emailType || "",
        patientId: this.registerObj?.regNo || 0
      }).subscribe({next: (response) => { 
      this.onClose(); 
    } 
  }); 
    } else {
      let invalidFields = [];
      if (this.EmailFrom.invalid) {
        for (const controlName in this.EmailFrom.controls) {
          if (this.EmailFrom.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
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
  OnReset() {
    this.EmailFrom.reset();
  }
  onClose() {
    this.registerObj =''
     this.EmailFrom.reset();
    this.dialogRef.close();
  }
}

