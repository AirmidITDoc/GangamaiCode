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
  selector: 'app-new-addless',
  templateUrl: './new-addless.component.html',
  styleUrls: ['./new-addless.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAddlessComponent implements OnInit {

  submitted = false;
  screenFromString = 'admission-form';
  isLoading: string = '';
  

  AddLessID:any;
  AddLessName:any;
  StdEfficiency:any;
  ReadingFactor:any;
  
  
  Today=[new Date().toISOString()];
 

  date1 = new FormControl(new Date())
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
     public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<NewAddlessComponent>,
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
        this.AddLessID=this.data.registerObj.AddLessID;
        this.AddLessName=this.data.registerObj.AddLessName;
        this.StdEfficiency=this.data.registerObj.StdEfficiency;
        this.ReadingFactor=this.data.registerObj.ReadingFactor;
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
         "insertAddless": {
            "AddLessId ": 0,
            "AddLessName": this._OtherinfoMasterService.otherallform.get('AddLessName').value ||  0,
            "StdEfficiency": this._OtherinfoMasterService.otherallform.get('StdEfficiency').value || 0,
            "ReadingFactor": this._OtherinfoMasterService.otherallform.get('ReadingFactor').value ||  0,
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.AddlessInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Addless Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Addless Data  not saved', 'error');
          }

        });
      
    
    
  }





}
