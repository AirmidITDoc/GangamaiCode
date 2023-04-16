import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/admission/admission.model';
import { AdmissionService } from 'app/main/ipd/admission/admission.service';
import { AdvanceDataStored } from 'app/main/ipd/ip-search-list/advance';
import Swal from 'sweetalert2';
import 'app/shared/email.js';
import { OpSearchListService } from 'app/main/opd/op-search-list/op-search-list.service';
declare var Email :any;
//import { BrowseOPDBillsService } from '../../../../../browse-opd-bills/browse-opd-bills.service';

@Component({
  selector: 'app-sms-email-template',
  templateUrl: './sms-email-template.component.html',
  styleUrls: ['./sms-email-template.component.scss']
})
export class SmsEmailTemplateComponent implements OnInit {
  
  templateName: string;
  templateFormGroup: FormGroup;
  toPattern: string = '';
  attachedFile: any;
  dateTimeObj: any;
  isCompanySelected: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  RegNo:any;
  AdmissionID:any;
  PatientName:any;
  AdmissionDate:any;
  DoctorId:any;
  AdmittedDoc1:any;
  screenFromString = 'admission-form';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) templateFor: any,
    private formBuilder: FormBuilder,
    public _BrowseOPDBillsService: OpSearchListService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    // public dialogRef: MatDialogRef<ListComponent>,
    private router: Router,
    private advanceDataStored: AdvanceDataStored,
    private matDialogRef: MatDialogRef<SmsEmailTemplateComponent>
  ) {
    this.templateName = templateFor;
  }

  ngOnInit(): void {

    console.log(this.data)
    if (this.data) {
      this.AdmissionDate = this.transform2(this.data.AdmissionDate);
   
      // this.registerObj = this.data.PatObj;
      this.RegNo = this.data.RegNo;
      this.AdmissionID =this.data.OPD_IPD_ID;
      this.PatientName = this.data.PatientName;
      this.DoctorId = this.data.DoctorId;
      this.AdmittedDoc1 = this.data.AdmittedDoctor1ID;

      console.log(this.registerObj);

    if (this.templateName == 'SMS') {
      this.toPattern = '^[6789]{1,1}[0-9]{9,9}$';
    } else if (this.templateName == 'Email') {
      this.toPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    }
    this.createForm();

  }
  }
  createForm() {
    this.templateFormGroup = this.formBuilder.group({
      toController: ['', [Validators.required, Validators.pattern(this.toPattern)]],
      toCCController: ['', [Validators.required, Validators.pattern(this.toPattern)]],
      subjectController: [''],
      bodyController: [''],
      MobileNo:[''],
      SMSString:[''],
      IsSentL:['']
    });
  }

  onChange(event) {
    this.attachedFile = event.target.files[0];
    console.log('attachedFile==', this.attachedFile)
  }
  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }


  onSendSMS(){

    var m_data = {
      "ipsmsOutgoingInsert": {
        "mobileNo": 0,
        "smsString": this.dateTimeObj.date,
        "isSent": 1,
      
       
      }
 
    }
    console.log(m_data);
    try{
      Email.send({
        Host : "hostname",//for ex smtp.gmail.com
        Username : "senderusername",//sender user name
      
        Body :this.templateFormGroup.get('bodyController').value
      }).then(
      message => {
        console.log(message)
        Swal.fire('Congratulations !', 'SMS Send  Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      },
      error =>{
        console.log(error)
        Swal.fire('Error !', 'SMS not Send', 'error');
      });
    }
    catch(err){
      console.log(err)
  }
}
  onSend() {
   var m_data = {
     "emailInsert": {
       "Id": 0,
       "SendDate": this.dateTimeObj.date,
       "NotificationType": 1,
       "ToAddress": this.templateFormGroup.get('toController').value || '',
       "Subject": this.templateFormGroup.get('subjectController').value || '',
       "EmailBody": this.templateFormGroup.get('bodyController').value || '',
       "EmailCC": this.templateFormGroup.get('toCCController').value || "",
       "IsSendMail":1,
       // "AttachmentPath": this.attachedFile.name
      
     }

   }
   console.log(m_data);
   try{
     Email.send({
       Host : "hostname",//for ex smtp.gmail.com
       Username : "senderusername",//sender user name
       Password : "Password123",//Password of sender user
       To : "receiver",//to user id
       From : "sender",//sender email id
       Subject :this.templateFormGroup.get('subjectController').value,//subject line
       // Attachments: [{
       // }],
       Body :this.templateFormGroup.get('bodyController').value
     }).then(
     message => {
       console.log(message)
       Swal.fire('Congratulations !', 'Email Send  Successfully !', 'success').then((result) => {
         if (result.isConfirmed) {
           this._matDialog.closeAll();
         }
       });
     },
     error =>{
       console.log(error)
       Swal.fire('Error !', 'Email not Send', 'error');
     });
   }
   catch(err){
     console.log(err)
   }
  //  /api/OutPatient/SMSOutgoingInsert
                 
//    this._BrowseOPDBillsService.EmailInsert(m_data).subscribe(data =>{
//      if (data) {
//        Swal.fire('Congratulations !', 'Email Send  Successfully !', 'success').then((result) => {
//          if (result.isConfirmed) {
//            this._matDialog.closeAll();
// }
//        });
//      } else {
//        Swal.fire('Error !', 'Email not Send', 'error');
//      }
    
//    });

}
getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
}
  onClose() {
    this.matDialogRef.close();
  }

}
