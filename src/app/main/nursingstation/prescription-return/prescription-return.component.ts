import { Component, OnInit, ViewChild } from '@angular/core';
import { PrescriptionReturnService } from './prescription-return.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prescription-return',
  templateUrl: './prescription-return.component.html',
  styleUrls: ['./prescription-return.component.scss'],
  
  animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {

  hasSelectedContacts: boolean;

  displayedColumns: string[] = [
    'Date',
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    'StoreName',
     'IPMedID'

  ]

  displayColumns: string[] =[
    'ItemName',
    'BatchNo',
    'Qty'
  ]


  dsprescritionretList = new MatTableDataSource<PrescriptionretList>();
  dsprescriptionretdetList=new MatTableDataSource<PrescriptionretdetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _PrescriptionReturnService:PrescriptionReturnService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.getPriscriptionretList();
  }

    // toggle sidebar
    toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getPriscriptionretList(){
    var vdata={
      FromDate:this.datePipe.transform(this._PrescriptionReturnService.mySearchForm.get('startdate').value,"yyyy-MM-dd 00:00:00.000") || '01/2/2023',
      ToDate:this.datePipe.transform(this._PrescriptionReturnService.mySearchForm.get('enddate').value,"yyyy-MM-dd 00:00:00.000") || '01/2/2023',
      Reg_No: this._PrescriptionReturnService.mySearchForm.get('RegNo').value || 0
    }
    this._PrescriptionReturnService.getPriscriptionretList(vdata).subscribe(data =>{
      this.dsprescritionretList.data = data as PrescriptionretList[];
      this.dsprescritionretList.sort = this.sort;
      this.dsprescritionretList.paginator = this.paginator;
     // console.log(this.dsprescritionretList.data);
  })
  }

  getPreiscriptionretdetList(Param){
    var vdata={
      PresReId: Param
    }
    this._PrescriptionReturnService.getPreiscriptionretdetList(vdata).subscribe(data =>{
      this.dsprescriptionretdetList.data = data as PrescriptionretdetList[];
      this.dsprescriptionretdetList.sort = this.sort;
      this.dsprescriptionretdetList.paginator = this.paginator;
       //console.log(this.dsprescriptionretdetList.data);
    })
  }

  onSelect(Parama){
     console.log(Parama.PresReId);
    this.getPreiscriptionretdetList(Parama.PresReId)
  }


}

export class PrescriptionretList{
  RegNo :any;
  PatientName: string;
  Date:any;
  Vst_Adm_Date:any;
  StoreName:any;
  IPMedID:any;

  constructor(PrescriptionretList) {
    this.RegNo=PrescriptionretList.RegNo || 0;
    this.PatientName=PrescriptionretList.PatientName || '';
    this.Date=PrescriptionretList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionretList.Vst_Adm_Date || '01/01/1900';
    this.StoreName = PrescriptionretList.StoreName || '';
    this.IPMedID = PrescriptionretList.IPMedID || 0;
 
  }
}

export class PrescriptionretdetList{
  ItemName: any;
  Qty: any;
  BatchNo:any

  constructor(PrescriptionretdetList){
    this.ItemName=PrescriptionretdetList.ItemName || '';
    this.Qty=PrescriptionretdetList.Qty || 0;
    this.BatchNo=PrescriptionretdetList.BatchNo || 0;
    }
}
