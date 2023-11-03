import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CancellationService } from './cancellation.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CancellationComponent implements OnInit {
  displayedColumns:string[] = [
    'action',
    'RegNo',
    'PatientName',
    'BillAmt',
    'ConAmt',
    'NetpayableAmt',
    'BillDate',
    'PBillNo'
  ];
  

  sIsLoading: string = '';
  isLoading = true;

  dsCancellation = new MatTableDataSource<CancellationList>();
  

  constructor(
    public _CancellationService:CancellationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


}
export class CancellationList{
  RegNo:any;
  PatientName:string;
  BillAmt:number;
  ConAmt: Number;
  NetpayableAmt: number;
  BillDate:number;
  PBillNo:number;

  constructor(PaymentPharmayList) {
    {
      this.RegNo = PaymentPharmayList.RegNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.BillAmt = PaymentPharmayList.BillAmt || 0;
      this.ConAmt = PaymentPharmayList.ConAmt || 0;
      this.NetpayableAmt = PaymentPharmayList.NetpayableAmt || 0;
      this.BillDate = PaymentPharmayList.BillDate || 0;
      this.PBillNo = PaymentPharmayList.PBillNo || 0;   
    }
  }
}
