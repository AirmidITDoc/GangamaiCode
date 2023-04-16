import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';

@Component({
  selector: 'app-edite-yarn-master',
  templateUrl: './edite-yarn-master.component.html',
  styleUrls: ['./edite-yarn-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditeYarnMasterComponent implements OnInit {

  submitted = false;
  date1 = new FormControl(new Date())
  screenFromString = 'admission-form';
  isLoading: string = '';

  Today=[new Date().toISOString()];

  now = Date.now();
  yID:any;
  YarnName:any;
  count:any;
  ply:any;
  type:any;
  blend:any;
  Actualcnt:any;
  deniercnt:any;
 
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
 
  private _onDestroy = new Subject<void>();
  constructor(
    public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<EditeYarnMasterComponent>,
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
      this.yID=this.data.registerObj.yID;
      this.YarnName=this.data.registerObj.yName;
      this.count=this.data.registerObj.yCount;
      this.ply=this.data.registerObj.yPly;
      this.type=this.data.registerObj.yType;
      this.blend=this.data.registerObj.yBlend;
      this.Actualcnt=this.data.registerObj.yActualCount;
      this.deniercnt=this.data.registerObj.yDenierCount;
     
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
  
        var m_data1 = {
         
          "yarmUpdate": {
            "operation":"UPDATE",
            "yID": this.data.registerObj.yID,
            "yName": this._InvoiceListService.invyarnform.get('YarnName').value || '',
            "yCount": this._InvoiceListService.invyarnform.get('count').value || 0,
            "yPly": this._InvoiceListService.invyarnform.get('ply').value || '',
            "yType": this._InvoiceListService.invyarnform.get('type').value || '',
            "yBlend": this._InvoiceListService.invyarnform.get('blend').value || '',
            "yActualCount": this._InvoiceListService.invyarnform.get('Actualcnt').value || 0,
            "yDenierCount": this._InvoiceListService.invyarnform.get('deniercnt').value || 0,
            "updatedBy": this.accountService.currentUserValue.user.id,
            
         }
        }
        console.log(m_data1);
        this._InvoiceListService.YarnUpdate(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Yarn Master  Updated  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'YarnMaster Data  not Updated', 'error');
          }

        });
          
    
  }





}



