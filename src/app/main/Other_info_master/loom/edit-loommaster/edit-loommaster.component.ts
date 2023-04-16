import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { OtherinfoMasterService } from '../../otherinfo-master.service';

@Component({
  selector: 'app-edit-loommaster',
  templateUrl: './edit-loommaster.component.html',
  styleUrls: ['./edit-loommaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditLoommasterComponent implements OnInit {

  submitted = false;
  date1 = new FormControl(new Date())
  screenFromString = 'admission-form';
  isLoading: string = '';

  Today=[new Date().toISOString()];

 

  now = Date.now();

 
  LoomId:any;
  LoomCode:any;
  CompanyName:any;
  LoomNo:any;
  RPM:any;
  MfgCompany:any;
  MfgSrno:any;
  LoomTypeId:any;
  StdEfficiency:any;

  ReadingFactor:any;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<EditLoommasterComponent>,
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
      console.log(this.data);
      this.LoomId=this.data.registerObj.LoomId;
      this.CompanyName=this.data.registerObj.CompanyName;
      this.LoomNo=this.data.registerObj.LoomNo;
      this.MfgCompany=this.data.registerObj.MfgCompany;
      this.MfgSrno=this.data.registerObj.MfgSrno;
      this.LoomTypeId=this.data.registerObj.LoomTypeId;
      this.StdEfficiency=this.data.registerObj.StdEfficiency;
      this.ReadingFactor=this.data.registerObj.ReadingFactor;
      this.RPM=this.data.registerObj.RPM;

     
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
    let YarnId=0;
    if(this.data){
    YarnId = this.data.registerObj.yID;
    }
    this.isLoading = 'submit';

    console.log()
  
      
        var m_data = {
          "updatetLoommaster": {
            "operation":"UPDATE",
            "LoomId":this.data.registerObj.LoomId,
            "CompanyName": this._OtherinfoMasterService.LoomForm.get('CompanyName').value || 0,
            "LoomNo": this._OtherinfoMasterService.LoomForm.get('LoomNo').value || '',
            "RPM": this._OtherinfoMasterService.LoomForm.get('RPM').value || 0,
            "MfgCompany": this._OtherinfoMasterService.LoomForm.get('MfgCompany').value || '',
            "MfgSrno": this._OtherinfoMasterService.LoomForm.get('MfgSrno').value || 0,
            "LoomTypeId": this._OtherinfoMasterService.LoomForm.get('LoomTypeId').value || 0,
            "StdEfficiency": this._OtherinfoMasterService.LoomForm.get('StdEfficiency').value || 0,
            "ReadingFactor": this._OtherinfoMasterService.LoomForm.get('ReadingFactor').value || 0,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.LoomUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Loom Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'LoomMaster Data  not saved', 'error');
          }

        });
      
      
    
  }





}


