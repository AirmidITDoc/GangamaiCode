import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SMSConfugurationService } from '../smsconfuguration.service';

@Component({
  selector: 'app-update-sms',
  templateUrl: './update-sms.component.html',
  styleUrls: ['./update-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateSMSComponent implements OnInit {

  displayedColumns = [
    'Code',
    'MgsCategory',
    'IsBlock',
    'TemplateId' 
  ];
  displayedColumns1 = [
     'MappingValue' 
  ];

  vTemplateCreation:any;
  vMessage:any;
  vTemplateId:any; 
  vIsBlock:any;
  MSGCategory:any=[];
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator; 
  
  dsTemplateList= new MatTableDataSource<TemplateList>();
  dsmappingList= new MatTableDataSource<MappingList>();

  constructor(
    public _SMSConfigService : SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getMappingSMS();
    this.getMSGCategoryList();
    this.getMSGCategory();
  }
  getMSGCategory(){
    this._SMSConfigService.getMSGCategory().subscribe(data =>{
      this.MSGCategory = data ;
    });
  }
  getMappingSMS(){
    this._SMSConfigService.getMappinfSMS().subscribe(data =>{
      this.dsmappingList.data = data as MappingList[];
    });
  }
  getMSGCategoryList(){
    this._SMSConfigService.getMSGCategoryList().subscribe(data =>{
      this.dsTemplateList.data = data as TemplateList[] ;
      console.log(this.dsTemplateList.data)
    });
  }
  OnSelectTemplate(contact){
    console.log(contact)
    this.vTemplateId = contact.TemplateId;
    this.vTemplateCreation = contact.MsgId;
    this.vMessage = contact.msg; 
    let isBlock = contact.IsBlock;
    if(isBlock == 1){
      this.vIsBlock = true;
    }else{
      this.vIsBlock = false;
    }

    if(this.vTemplateCreation > 0){
      const selectCategory = this.MSGCategory.find(item => item.Msgid ==this.vTemplateCreation )
      console.log(selectCategory)
      this._SMSConfigService.MyNewSMSForm.get('Msgcategory').setValue(selectCategory)
    }
  }
  OnSave(){
    if ((this.vMessage == '' || this.vMessage == null || this.vMessage == undefined)) {
      this.toastr.warning('Please enter message', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
      console.log(this._SMSConfigService.MyNewSMSForm.value)
      this._SMSConfigService.SMSSave(this._SMSConfigService.MyNewSMSForm.value).subscribe((response) => {
        this.toastr.success(response.message);
      
      }, (error) => {
        this.toastr.error(error.message);
      }); 
    }
  }
  OnReset(){
    this.onClose();
  }
  onClose(){
    this._matDialog.closeAll();
    this._SMSConfigService.MyNewSMSForm.reset();
  }
}
export class TemplateList { 
  MgsCategory:string;
  Code: Number;
  IsBlock:number;
  TemplateId:number; 
  constructor(TemplateList) {
    {
      this.Code = TemplateList.Code || 0;
      this.IsBlock = TemplateList.IsBlock || 0;
      this.TemplateId = TemplateList.TemplateId || 0;  
      this.MgsCategory = TemplateList.MgsCategory || '';
    }
  }
}
export class MappingList { 
  MappingValue:string; 
  constructor(MappingList) {
    {
      this.MappingValue = MappingList.MappingValue ||  ''; 
    }
  }
}
