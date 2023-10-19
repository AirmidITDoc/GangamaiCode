import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PrescriptionService } from './prescription.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewPrescriptionComponent } from './new-prescription/new-prescription.component';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {

  hasSelectedContacts: boolean;

  displayedColumns: string[] = [
    'Date',
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    'action'
  ]

  dscPrescriptionDetList:string[] = [
    'ItemName',
    'Qty'
  ]

   
  dsprescritionList = new MatTableDataSource<PrescriptionList>();
  dsprescriptiondetList = new MatTableDataSource<PrescriptiondetList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  
  constructor(
    public _PrescriptionService:PrescriptionService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private dialog:MatDialog
  ) { }


  

  ngOnInit(): void {
    this.getPrescriptionList();
  }

    // toggle sidebar
  toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  //window
  Openpopup(){
    this.dialog.open(NewPrescriptionComponent,{
      width:'80%',
      height:'750px'
      
    })
  }

  getPrescriptionList(){
    var vdata={
      FromDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._PrescriptionService.mysearchform.get('RegNo').value || 0
    }
    // console.log(vdata);
    this._PrescriptionService.getPrecriptionlist(vdata).subscribe(data =>{
        this.dsprescritionList.data = data as PrescriptionList[];
        this.dsprescritionList.sort = this.sort;
        this.dsprescritionList.paginator = this.paginator;
        console.log(this.dsprescritionList.data);
    })
  }

  getPrescriptiondetList(Param){
    var vdata={
      IPMedID: Param
    }
    this._PrescriptionService.getPrecriptiondetlist(vdata).subscribe(data =>{
      this.dsprescriptiondetList.data = data as PrescriptiondetList[];
      this.dsprescriptiondetList.sort = this.sort;
      this.dsprescriptiondetList.paginator = this.paginator;
      // console.log(this.dsprescriptiondetList.data);
    })
  }

  onSelect(Parama){
     console.log(Parama.IPMedID);
    this.getPrescriptiondetList(Parama.IPMedID)
  }

}



export class PrescriptionList{
  RegNo :any;
  PatientName: string;
  Date:any;
  Vst_Adm_Date:any;

  constructor(PrescriptionList) {
    this.RegNo=PrescriptionList.RegNo || 0;
    this.PatientName=PrescriptionList.PatientName || '';
    this.Date=PrescriptionList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionList.Vst_Adm_Date || '01/01/1900';
  }
}

export class PrescriptiondetList{
  ItemName: any;
  Qty:number;

  constructor(PrescriptiondetList){
    this.ItemName=PrescriptiondetList.ItemName;
    this.Qty=PrescriptiondetList.Qty;
  }
}
