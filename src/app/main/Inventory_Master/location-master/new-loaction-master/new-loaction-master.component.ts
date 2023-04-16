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
  selector: 'app-new-loaction-master',
  templateUrl: './new-loaction-master.component.html',
  styleUrls: ['./new-loaction-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLoactionMasterComponent implements OnInit {

  submitted = false;
  screenFromString = 'admission-form';
  isLoading: string = '';
  
  now = Date.now();
  LocationCode: any;
  LocationName: any;
  LocationID:any;
  
  Today=[new Date().toISOString()];
  date1 = new FormControl(new Date())
 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<NewLoactionMasterComponent>,
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
        this.LocationCode=this.data.registerObj.LocationCode;
        this.LocationName=this.data.registerObj.LocationCode;
  
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

    console.log()
  
      if (!millID) {
        var m_data = {
         "insertLocationmaster": {
            "LocationID": 0,
            "LocationName": this._InvoiceListService.InvallFormGroup.get('LocationName').value || '',
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._InvoiceListService.LocationInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Location Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Location Data  not saved', 'error');
          }

        });
      }
    
    
  }





}
