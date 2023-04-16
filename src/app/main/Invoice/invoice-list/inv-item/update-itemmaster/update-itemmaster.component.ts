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
  selector: 'app-update-itemmaster',
  templateUrl: './update-itemmaster.component.html',
  styleUrls: ['./update-itemmaster.component.scss']
})
export class UpdateItemmasterComponent implements OnInit {

  submitted = false;
  Invdate: any;

  invoicedate: Date;
  screenFromString = 'admission-form';
  isLoading: string = '';
   now = Date.now();
  
   itemName:any;
   itemMaker:any;
   itemCategory:any;
   itemUnit:any;
   itemPartNumber:any;
   itemRate:any;3
   
  
 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InvoiceListService,
    public dialogRef: MatDialogRef<UpdateItemmasterComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    //debugger
       
      if (this.data) {
        // this.invoiceObj = this.data.invoiceObj;
        // console.log("EditInvoice");
        // console.log(this.invoiceObj);
        // this.setDropdownObjs1();
      }
      else{
        
      }

    // setTimeout(function () {

    //   let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
    //   element.click();

    // }, 1000);

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
    let YarnId = 0//this.registerObj1.OTCathLabBokingID;
    this.isLoading = 'submit';

    console.log()
   
     
        var m_data1 = {
         
          "itemUpdate": {
            "itemID": 0,
            "itemName": this._InvoiceListService.Itemform.get('itemName').value || '',
            "itemMaker": this._InvoiceListService.Itemform.get('itemMaker').value || 0,
            "itemCategory": this._InvoiceListService.Itemform.get('itemCategory').value || '',
            "itemUnit": this._InvoiceListService.Itemform.get('itemUnit').value || '',
            "itemPartNumber": this._InvoiceListService.Itemform.get('itemPartNumber').value || '',
            "itemRate": this._InvoiceListService.Itemform.get('itemRate').value || 0,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
         }
        }
        console.log(m_data1);
        this._InvoiceListService.YarnUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Item Master  Updated  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'ItemMaster Data  not Updated', 'error');
          }

        });
      
    
    
  }





}

