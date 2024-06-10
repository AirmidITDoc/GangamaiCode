import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SMSConfugurationService } from '../smsconfuguration.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator; 
  
  dsTemplateList= new MatTableDataSource<TemplateList>();

  constructor(
    public _SMSConfigService : SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  onClose(){
    this._matDialog.closeAll();
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
