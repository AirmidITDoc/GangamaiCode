import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { OtherinfoMasterService } from '../../otherinfo-master.service';

@Component({
  selector: 'app-new-loom-type',
  templateUrl: './new-loom-type.component.html',
  styleUrls: ['./new-loom-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLoomTypeComponent implements OnInit {

  submitted = false;
  

  screenFromString = 'admission-form';
  isLoading: string = '';
  
  now = Date.now();
  LoomTypeId:any;
  LoomTypeCode:any;
  LoomType:any;
  Today=[new Date().toISOString()];

  date1 = new FormControl(new Date())
 
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
     public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<NewLoomTypeComponent>,
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
        this.LoomTypeId=this.data.registerObj.LoomTypeId;
        this.LoomTypeCode=this.data.registerObj.LoomTypeCode;
        this.LoomType=this.data.registerObj.LoomType;
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
   
      
        var m_data = {
         "insertLoomTypenmaster": {
            "LoomTypeID ": 0,
            "LoomType": this._OtherinfoMasterService.otherallform.get('LoomType').value ||  0,
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.LoomTypeInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'LoomType Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'LoolType Data  not saved', 'error');
          }

        });
      
    
    
  }





}
