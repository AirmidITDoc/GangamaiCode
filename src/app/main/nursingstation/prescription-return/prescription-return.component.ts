import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from './prescription-return.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { NewPrescriptionreturnComponent } from './new-prescriptionreturn/new-prescriptionreturn.component';
import { MatDialog } from '@angular/material/dialog';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-return',
  templateUrl: './prescription-return.component.html',
  styleUrls: ['./prescription-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {

  hasSelectedContacts: boolean;
  SpinLoading:boolean=false;
  displayedColumns: string[] = [
    'action',
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
    private dialog:MatDialog,
    public _matDialog:MatDialog,
    public datePipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.getPriscriptionretList();
  }

    // toggle sidebar
    toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  PType:any;
  onChangePrescriptionType(event) {
    if (event.value == 'Pending') {
      this.PType = 0;
      this.getPriscriptionretList();
    }
    else{
      this.PType = 1;
      this.getPriscriptionretList();
    }
  }

  getPriscriptionretList(){
    // debugger
    var vdata={
      FromDate:this.datePipe.transform(this._PrescriptionReturnService.mySearchForm.get('startdate').value,"yyyy-dd-MM 00:00:00.000") || '01/2/2023',
      ToDate:this.datePipe.transform(this._PrescriptionReturnService.mySearchForm.get('enddate').value,"yyyy-dd-MM 00:00:00.000") || '01/2/2023',
      Reg_No: this._PrescriptionReturnService.mySearchForm.get('RegNo').value || 0,
      Type :this.PType || 0
    }
    console.log(vdata)
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

  //window
  OpenNewPrescriptionret(){
    this.dialog.open(NewPrescriptionreturnComponent,{
        height: '85vh',
        width: '70vw'
    })
  }
 


  viewgetIpprescriptionreturnReportPdf(row) {
    // debugger
    setTimeout(() => {
      this.SpinLoading =true;
    this._PrescriptionReturnService.getIpPrescriptionreturnview(
      row.PresReId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Prescription Return Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
    });
   
    },100);
  }


  PresItemlist:any =[];
  deleteTableRow(element) {
    if(!element.IsClosed){
    // if (this.key == "Delete") {
      let index = this.PresItemlist.indexOf(element);
      if (index >= 0) {
        this.PresItemlist.splice(index, 1);
        this.dsprescritionretList.data = [];
        this.dsprescritionretList.data = this.PresItemlist;
      }
      Swal.fire('Success !', ' Row Deleted Successfully', 'success');

    }
    else{
      Swal.fire('Row can not Delete Billed Prescription!');

    }
  }

}

export class PrescriptionretList{
  RegNo :any;
  PatientName: string;
  Date:any;
  Vst_Adm_Date:any;
  StoreName:any;
  IPMedID:any;
  IsClosed:any;

  constructor(PrescriptionretList) {
    this.RegNo=PrescriptionretList.RegNo || 0;
    this.PatientName=PrescriptionretList.PatientName || '';
    this.Date=PrescriptionretList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionretList.Vst_Adm_Date || '01/01/1900';
    this.StoreName = PrescriptionretList.StoreName || '';
    this.IPMedID = PrescriptionretList.IPMedID || 0;
 this.IsClosed = PrescriptionretList.IsClosed || 0;
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
