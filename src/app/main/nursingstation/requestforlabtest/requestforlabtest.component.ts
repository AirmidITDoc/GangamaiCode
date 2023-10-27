import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RequestforlabtestService } from './requestforlabtest.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { NewRequestforlabComponent } from './new-requestforlab/new-requestforlab.component';

@Component({
  selector: 'app-requestforlabtest',
  templateUrl: './requestforlabtest.component.html',
  styleUrls: ['./requestforlabtest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {

  hasSelectedContacts: boolean;
 
  displayedColumns: string[] = [
    'action',
    'RegNo',
    'PatientName',
    'Age',
    'Vst_Adm_Date',
    'WardName',
    'RequestType',
    'TariffName',
    'CompanyName'
  ]

  displayColumns: string[] =[
    'ReqDate',
    'ReqTime',
    'ServiceName',
    'AddedByName',
    'AddBilingUser',
    'BillDateTime',
    'IsStatus',
    'PBillNo',
    'IsComplted'
  ]

  dsrequestList = new MatTableDataSource<RequestList>();
  dsrequestdetList=new MatTableDataSource<RequestdetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _RequestforlabtestService:RequestforlabtestService,
    public datePipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService,
    private dialog:MatDialog
    
    ) { }

  ngOnInit(): void {
    this.getRequesttList();
  }
     // toggle sidebar
     toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
 

  Openpopup(){
    this.dialog.open(NewRequestforlabComponent,{
      width:'80%',
      height:'800px',
      panelClass: 'new-request-dialog'
    })
  }

 
  getRequesttList(){
    var vdata={
      FromDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._RequestforlabtestService.mySearchForm.get('RegNo').value || 0
    }
    //console.log(vdata);
    this._RequestforlabtestService.getRequesttList(vdata).subscribe(data =>{
      this.dsrequestList.data = data as RequestList[];
      this.dsrequestList.sort = this.sort;
      this.dsrequestList.paginator = this.paginator;
      console.log(this.dsrequestList.data);
    })
  }

  getRequestdetList(Param){
    var vdata={
      RequestId: Param
    
    }
   
    this._RequestforlabtestService.getRequestdetList(vdata).subscribe(data =>{
      this.dsrequestdetList.data = data as RequestdetList[];
      this.dsrequestdetList.sort = this.sort;
      this.dsrequestdetList.paginator = this.paginator;
       console.log(this.dsrequestdetList.data);
    })
  }

  onSelect(Parama){
    console.log(Parama.RequestId);
    this.getRequestdetList(Parama.RequestId)
  }
}
export class RequestList{
  RegNo :any;
  PatientName: string;
  WardName:any;
  Vst_Adm_Date:any;
  Age:any;
  RequestType:any;
  TariffName:any;
  CompanyName:any;

  constructor(RequestList) {
    this.RegNo=RequestList.RegNo || 0;
    this.PatientName=RequestList.PatientName || '';
    this.WardName=RequestList.WardName  || ' ';
    this.Vst_Adm_Date=RequestList.Vst_Adm_Date || '01/01/1900';
    this.Age=RequestList.Age || 0;
    this.RequestType=RequestList.RequestType || '';
    this.TariffName=RequestList.TariffName || '';
    this.CompanyName=RequestList.CompanyName || '';
  }
}

export class RequestdetList{
  ReqDate: any;
  ReqTime: any;
  ServiceName:any;
  AddedByName:any;
  AddBilingUser:any;
  BillDateTime:any;
  IsStatus:any;
  PBillNo:any;
  IsComplted:any;
   
   

  constructor(RequestdetList){
    this.ReqDate=RequestdetList.ReqDate || 0;
    this.ReqTime=RequestdetList.ReqTime || 0;
    this.ServiceName=RequestdetList.ServiceName ||  '';
    this.AddedByName=RequestdetList.AddedByName ||  '';
    this.AddBilingUser=RequestdetList.AddBilingUser ||  '';
    this.BillDateTime=RequestdetList.BillDateTime ||  0;
    this.IsStatus=RequestdetList.IsStatus ||  0;
    this.PBillNo=RequestdetList.PBillNo ||  0;
    this.IsComplted=RequestdetList.IsComplted ||  0;
 
    }
}
