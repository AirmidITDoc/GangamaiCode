import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditItemComponent implements OnInit {

  submitted = false;
  date1 = new FormControl(new Date())
  screenFromString = 'admission-form';
  isLoading: string = '';
   now = Date.now();
  
   itemID:any;
   itemCode:any;
   itemName:any;
   itemMaker:any;
   itemCategory:any;
   itemUnit:any;
   itemPartNumber:any;
   itemRate:any;3
   
  
 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<EditItemComponent>,
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
        this.itemID=this.data.registerObj.itemID;
        this.itemCode=this.data.registerObj.itemCode;
        this.itemName=this.data.registerObj.itemName;
        this.itemMaker=this.data.registerObj.itemMaker;
        this.itemCategory=this.data.registerObj.itemCategory;
        this.itemUnit=this.data.registerObj.itemUnit;
        this.itemPartNumber=this.data.registerObj.itemPartNumber;
        this.itemRate=this.data.registerObj.itemRate;
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
            "operation":"UPDATE",
            "itemID":this.data.registerObj.itemID,
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
        this._InvoiceListService.ItemUpdate(m_data1).subscribe(response => {
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


