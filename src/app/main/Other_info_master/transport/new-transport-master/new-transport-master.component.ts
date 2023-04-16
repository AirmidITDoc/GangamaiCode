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
  selector: 'app-new-transport-master',
  templateUrl: './new-transport-master.component.html',
  styleUrls: ['./new-transport-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewTransportMasterComponent implements OnInit {

  submitted = false;
  date1 = new FormControl(new Date())
  screenFromString = 'admission-form';
  isLoading: string = '';

  Today=[new Date().toISOString()];

 

  now = Date.now();

  TransportId: number;
  TransportName: any;
  TagaRate:number;
  TransportCode: any;

  BagRate: number;
  LoadedbeamRate: number;
  EmptyBeamRate:number;
    OtherRate: number;
  CutePeiceRate: number;
  BeamNumber:number;
  RollRate: number;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _OtherinfoMasterService: OtherinfoMasterService,
    public dialogRef: MatDialogRef<NewTransportMasterComponent>,
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
      // this.yID=this.data.registerObj.yID;
      // this.YarnName=this.data.registerObj.yName;
      // this.count=this.data.registerObj.yCount;
      // this.ply=this.data.registerObj.yPly;
      // this.type=this.data.registerObj.yType;
      // this.blend=this.data.registerObj.yBlend;
      // this.Actualcnt=this.data.registerObj.yActualCount;
      // this.deniercnt=this.data.registerObj.yDenierCount;
     
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
          
         "insertTransport": {
            "TransportID": 0,
            "TransportName": this._OtherinfoMasterService.transportform.get('TransportName').value || '',
           // "TransportCode": this._OtherinfoMasterService.transportform.get('TransportCode').value || '',
            "TagaRate": this._OtherinfoMasterService.transportform.get('TagaRate').value || 0,
            "BagRate": this._OtherinfoMasterService.transportform.get('BagRate').value || 0,
            "LoadedBeamRate": this._OtherinfoMasterService.transportform.get('LoadedBeamRate').value || 0,
            "EmptyBeamRate": this._OtherinfoMasterService.transportform.get('EmptyBeamRate').value || 0,
            "OtherRate": this._OtherinfoMasterService.transportform.get('OtherRate').value || 0,
            "CutePeiceRate": this._OtherinfoMasterService.transportform.get('CutpeiceRate').value || 0,
            "RollRate": this._OtherinfoMasterService.transportform.get('RollRate').value || 0,
            "createdBy": this.accountService.currentUserValue.user.id,
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._OtherinfoMasterService.TransportInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Transport Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', ' Transport Master Data  not saved', 'error');
          }

        });
      
      
    
  }





}

