import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import Swal from 'sweetalert2';
import { InventoryMasterService } from '../../inventory-master.service';

@Component({
  selector: 'app-new-quality-master',
  templateUrl: './new-quality-master.component.html',
  styleUrls: ['./new-quality-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewQualityMasterComponent implements OnInit {

  isLoading:any;
  Partyname:any;
  Wastageper:any;
  qualityname:any;
  construction:any;
  widthinch:any;
  widthcm:any;
  rsinch:any;
  rscm:any;
  reedinch:any;
  reedcm:any;
  pickinch:any;
  pickcm:any;
  warpsort1:any;
  weftsort1:any;
  warpsort2:any;
  weftsort2:any;
  warpsort3:any;
  weftsort3:any;
  type:any;
  remark:any;
  date1 = new FormControl(new Date())
  Today=[new Date().toISOString()];
  constructor( public _InvoiceListService: InventoryMasterService,
    public dialogRef: MatDialogRef<NewQualityMasterComponent>,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public _httpClient:HttpClient,) { }

  ngOnInit(): void {
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
         "yarmInsert": {
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

