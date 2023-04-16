import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { OtherinfoMasterService } from '../../otherinfo-master.service';

@Component({
  selector: 'app-new-beam',
  templateUrl: './new-beam.component.html',
  styleUrls: ['./new-beam.component.scss']
})
export class NewBeamComponent implements OnInit {

  submitted = false;
  Invdate: any;

  invoicedate: Date;
  screenFromString = 'admission-form';
  isLoading: string = '';
  
   BeamNumber:any;
  EmptyBeamWt:any;
  Today=[new Date().toISOString()];
 

  date1 = new FormControl(new Date())
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
     public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<NewBeamComponent>,
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
    let millID = 0//this.registerObj1.OTCathLabBokingID;
    this.isLoading = 'submit';

    console.log()
   
      
        var m_data = {
         "insertBeam": {
            "BeamId ": 0,
            "BeamNumber": this._OtherinfoMasterService.otherallform.get('BeamNumber').value ||  0,
            "EmptyBeamWt": this._OtherinfoMasterService.otherallform.get('EmptyBeamWt').value || 0,
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.beamInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Beam Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Beam Data  not saved', 'error');
          }

        });
      
    
    
  }





}
