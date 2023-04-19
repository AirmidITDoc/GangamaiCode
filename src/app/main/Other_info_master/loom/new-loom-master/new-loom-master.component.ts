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
  selector: 'app-new-loom-master',
  templateUrl: './new-loom-master.component.html',
  styleUrls: ['./new-loom-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLoomMasterComponent implements OnInit {

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
  MfgCompany:any;
  MfgSrno:any;
  RPM:any;
  LoomTypeId:any;
  StdEfficiency:any;
  ReadingFactor:any;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<NewLoomMasterComponent>,
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
      // console.log(this.data);
      // this.yID=this.data.registerObj.yID;
      // this.YarnName=this.data.registerObj.yName;
      // this.count=this.data.registerObj.yCount;
      // this.ply=this.data.registerObj.yPly;
      // this.type=this.data.registerObj.yType;
      // this.blend=this.data.registerObj.yBlend;
      // this.Actualcnt=this.data.registerObj.yActualCount;
      // this.deniercnt=this.data.registerObj.yDenierCount;
     
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
    let YarnId=0;
    if(this.data){
    YarnId = this.data.registerObj.yID;
    }
    this.isLoading = 'submit';

    console.log()
  
      
        var m_data = {
         "insertLoommaster": {
            "LoomId": 0,
            "CompanyName": this._OtherinfoMasterService.LoomForm.get('CompanyName').value || 0,
            "LoomNo": this._OtherinfoMasterService.LoomForm.get('LoomNo').value || '',
            "RPM": this._OtherinfoMasterService.LoomForm.get('RPM').value || '',
            "MfgCompany": this._OtherinfoMasterService.LoomForm.get('MfgCompany').value || '',
            "createdBy": this.accountService.currentUserValue.user.id,
            "MfgSrno": this._OtherinfoMasterService.LoomForm.get('MfgSrno').value || 0,
            "LoomTypeId": this._OtherinfoMasterService.LoomForm.get('LoomTypeId').value || 0,
            "StdEfficiency": this._OtherinfoMasterService.LoomForm.get('StdEfficiency').value || 0,
            "ReadingFactor": this._OtherinfoMasterService.LoomForm.get('ReadingFactor').value || 0,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.LoomInsert(m_data).subscribe(response => {
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


