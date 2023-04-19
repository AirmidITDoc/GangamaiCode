import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';

@Component({
  selector: 'app-edit-quality',
  templateUrl: './edit-quality.component.html',
  styleUrls: ['./edit-quality.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditQualityComponent implements OnInit {

  isLoading:any;
  Partyname:any;
  QualityId: number;
  QualityName: string;
  QualityCode: any;
  AccountId: any;
  Waste: any;
  Construction: any;
  WidthInch: any;
  WidthCms: any;

  RsInch: any;
  RsCms: any;
  ReedInch: any;
  ReedCms: any;
  
  PickInch: any;
  PickCms: any;
  WarpSort1: any;
  WarpSort2: any;

  WarpSort3: any;

  WeftSort1: any;
  WeftSort2: any;
  WeftSort3: any;

  Type: any;
  Remark:any;
  IsDesign:any;
  date1 = new FormControl(new Date())
  Today=[new Date().toISOString()];
  constructor( public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<EditQualityComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {

    if (this.data) {
      console.log(this.data);
      this.Partyname=this.data.registerObj.Partyname;
      this.Waste=this.data.registerObj.Waste;
      this.QualityName=this.data.registerObj.QualityName;
      this.Construction=this.data.registerObj.Construction;
      this.WidthInch=this.data.registerObj.WidthInch;
      this.WidthCms=this.data.registerObj.WidthCms;
      this.RsInch=this.data.registerObj.RsInch;
      this.RsCms=this.data.registerObj.RsCms;
      this.ReedInch=this.data.registerObj.ReedInch;
      this.ReedCms=this.data.registerObj.ReedCms;
      this.PickInch=this.data.registerObj.PickInch;
      this.PickCms=this.data.registerObj.PickCms;
      this.WarpSort1=this.data.registerObj.WarpSort1;
      this.WarpSort2=this.data.registerObj.WarpSort2;
      this.WarpSort3=this.data.registerObj.WarpSort3;
      this.WeftSort1=this.data.registerObj.WeftSort1;
      this.WeftSort2=this.data.registerObj.WeftSort2;
      this.WeftSort3=this.data.registerObj.WeftSort3;
      this.Type=this.data.registerObj.Type;
      this.Remark=this.data.registerObj.Remark;
      
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
    
    this.isLoading = 'submit';

    console.log()
  
   
        var m_data = {
         "QualityUpdate": {
            "QualityId": 0,
            "QualityName": this._InvoiceListService.qualityform.get('QualityName').value || '',
            "QualityCode": this._InvoiceListService.qualityform.get('QualityCode').value || 0,
            "AccountId": this._InvoiceListService.qualityform.get('AccountId').value || '',
            "Waste": this._InvoiceListService.qualityform.get('Waste').value || '',
            "construction": this._InvoiceListService.qualityform.get('Construction').value || '',
            "WidthInch": this._InvoiceListService.qualityform.get('WidthInch').value || 0,
            "WidthCms": this._InvoiceListService.qualityform.get('WidthCms').value || 0,
            "RsInch": this._InvoiceListService.qualityform.get('RsInch').value || 0,
            "RsCms": this._InvoiceListService.qualityform.get('RsCms').value || 0,
            "ReedInch": this._InvoiceListService.qualityform.get('ReedInch').value || 0,
            "ReedCms": this._InvoiceListService.qualityform.get('ReedCms').value || 0,
            

            "PickInch": this._InvoiceListService.qualityform.get('PickInch').value || 0,
            "PickCms": this._InvoiceListService.qualityform.get('PickCms').value || 0,
            "WarpSort1": this._InvoiceListService.qualityform.get('WarpSort1').value || '',
            "WarpSort2": this._InvoiceListService.qualityform.get('WarpSort2').value || '',
            "WarpSort3": this._InvoiceListService.qualityform.get('WarpSort3').value || '',
            "WeftSort1": this._InvoiceListService.qualityform.get('WeftSort1').value || '',
            "WeftSort2": this._InvoiceListService.qualityform.get('WeftSort2').value || '',
            "WeftSort3": this._InvoiceListService.qualityform.get('WeftSort3').value || '',
            "Type": this._InvoiceListService.qualityform.get('Type').value || 0,
            "IsDesign":0,
            "Remark": this._InvoiceListService.qualityform.get('Remark').value || 0,
          
            
            "createdBy": this.accountService.currentUserValue.user.id,
            
            
            "updatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._InvoiceListService.QualityInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Quality Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Quality Data  not saved', 'error');
          }

        });
      
      
    
  }


}

