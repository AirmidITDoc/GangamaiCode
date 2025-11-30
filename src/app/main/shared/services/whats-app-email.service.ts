import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OPListService } from 'app/main/opd/new-oplist/oplist.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppEmailService {

  constructor(
    public _httpClient: HttpClient,
    private _loaderService: LoaderService,
    public datePipe:DatePipe,
    public _accountService:AuthenticationService,
    public _OPListService:OPListService
  ) { }

  public InsertWhatsappSales(emp, loader=true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
  }
 
  OnWhatsAppMsgSent(params: { mobileNo: any; patientName: string; billNo: any; smsType: string, patientId:any }){
    setTimeout(() => {
      let param = {
        "mobileNumber": params?.mobileNo,
        "smsString": "Dear " + params?.patientName + ",Your Bill has been successfully Generated. Thank You" || '',
        "isSent": true,
        "smsType": params?.smsType ?? '',
        "smsFlag": '0',
        "smsDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1999-01-01',
        "tranNo": params?.billNo,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": '',
        "sourceType": 0,
        "createdBy": this._accountService.currentUserValue.userId,
        "smsOutGoingID": 0,
        "patientId": params?.patientId,

      }
      this._OPListService.InsertWhatsapp(param).subscribe(response => {

      });
    }, 100);
  }

OnEmailMsgSent(params: { toEmail: string; cc: string; mailSubject: string; mailBody: string; billNo: any; emailType: string, patientId:any }){
    setTimeout(() => {
      let param = {
            "fromEmail": "support@airmidtechinnovations.com",
            "fromName": "AirmidTech",
            "toEmail": params?.toEmail,
            "cc": params?.cc,
            "bcc": "",
            "mailSubject": params?.mailSubject,
            "mailBody": params?.mailBody,
            "attachmentName": "",
            "attachmentLink": "",
            "id": 0,
            "tranNo": params.billNo,
            "emailType": params.emailType,
            "patientId": params?.patientId,
            "createdBy": this._accountService.currentUserValue.userId,
      }
      this._OPListService.InsertWhatsappEmail(param).subscribe(response => { 
      });
    }, 100);
  }
}
