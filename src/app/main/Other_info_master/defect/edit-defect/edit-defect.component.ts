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
  selector: 'app-edit-defect',
  templateUrl: './edit-defect.component.html',
  styleUrls: ['./edit-defect.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditDefectComponent implements OnInit {

  submitted = false;
  
  screenFromString = 'admission-form';
  isLoading: string = '';

  DefectId:any;
  DefectName:any;
  EntNo:any;
  Today=[new Date().toISOString()];
 

  date1 = new FormControl(new Date())
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
     public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<EditDefectComponent>,
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
       this.DefectId=this.data.registerObj.DefectID;
       this.DefectName=this.data.registerObj.DefectName;
       this.EntNo=this.data.registerObj.EntNo;
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
          "updateDefect": {
            "operation": "UPDATE",
            "DefectID": this.data.registerObj.DefectID,
            "DefectName": this._OtherinfoMasterService.otherallform.get('DefectName').value ||  0,
            "EntNo": this._OtherinfoMasterService.otherallform.get('EntNo').value || 0,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.DefectUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Defect Master  Data  Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Defect Data  not saved', 'error');
          }

        });
      
    
    
  }





}
