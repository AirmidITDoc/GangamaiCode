import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-millmaster',
  templateUrl: './edit-millmaster.component.html',
  styleUrls: ['./edit-millmaster.component.scss']
})
export class EditMillmasterComponent implements OnInit {

  submitted = false;
  Invdate: any;

  invoicedate: Date;
  screenFromString = 'admission-form';
  isLoading: string = '';
  
  now = Date.now();
  millID:any;
  millName:any;
  millCode:any;

  Today=[new Date().toISOString()];

 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InvoiceListService,
    public dialogRef: MatDialogRef<EditMillmasterComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    debugger
       
      if (this.data) {
        this.millID = this.data.registerObj.millID;
        this.millName = this.data.registerObj.millName;
        this.millCode = this.data.registerObj.millCode;
      
      }
      else{
        
      }

   

  }

 
  onClose() {

    this.dialogRef.close();
  }



  dateTimeObj: any;s
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onSubmit() {
    debugger;
    let millID = 0//this.registerObj1.OTCathLabBokingID;
    this.isLoading = 'submit';

    
     
        var m_data1 = {
         
          "millUpdate": {
            "operation":"Update",
            "millID": this.data.registerObj.millID,
            "millName": this._InvoiceListService.Millform.get('millName').value || '',
            "updatedBy": this.accountService.currentUserValue.user.id,
            
         }
        }
        console.log(m_data1);
        this._InvoiceListService.MillUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Mi;; Master  Updated  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'MillMaster Data  not Updated', 'error');
          }

        });
      
    
    
  }





}
