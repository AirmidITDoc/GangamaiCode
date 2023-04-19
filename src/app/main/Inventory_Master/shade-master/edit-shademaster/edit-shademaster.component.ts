import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';

@Component({
  selector: 'app-edit-shademaster',
  templateUrl: './edit-shademaster.component.html',
  styleUrls: ['./edit-shademaster.component.scss']
})
export class EditShademasterComponent implements OnInit {

  title = 'colorPicker';
  color: string = '#2889e9'
  arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };

  selectedColor: string = 'color1';
  
  submitted = false;
 
  date1 = new FormControl(new Date())
  screenFromString = 'admission-form';
  isLoading: string = '';
  
  now = Date.now();

  
  shadeID:any;
  shadeCode:any;
  shadeNumber:any;
  shadeColour:any;
  Today=[new Date().toISOString()];
 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<EditShademasterComponent>,
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
        this.shadeID =this.data.registerObj.shadeID;
        // this.shadeCode=this.data.registerObj.shadeID;
        this.shadeNumber=this.data.registerObj.shadeNumber;
        this.shadeColour=this.data.registerObj.shadeColour;
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
    
    this.isLoading = 'submit';

    console.log()
  
    
        var m_data = {
         "shadeUpdate": {
            "operation":'UPDATE',
            "shadeID": this.data.registerObj.shadeID,
            "shadeNumber": this._InvoiceListService.InvallFormGroup.get('shadeNumber').value || '',
            "shadeColour": this._InvoiceListService.InvallFormGroup.get('shadeColour').value || '',
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._InvoiceListService.ShadeUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Shade Master  Data  Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'ShadeMaster Data  not saved', 'error');
          }

        });
      
    
    
  }





}
