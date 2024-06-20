import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IPSearchListService } from '../../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-prebill-details',
  templateUrl: './prebill-details.component.html',
  styleUrls: ['./prebill-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrebillDetailsComponent implements OnInit {

  PrevBillColumns = [
    'BillNo',
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
    'ConcessionAmount',
    'NetAmount',
    'AddDoctorName'
  ];

  isLoadingStr: string = '';
  registerObj:any;

  dsPrebilldetList = new MatTableDataSource<PreDetailsList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<PrebillDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.getBillDetList(this.registerObj);
    }
  }
  getBillDetList(el){
    var vdata={
      'BillNo': el.BillNo
    }
    console.log(vdata)
    this._IpSearchListService.getPreBillDetList(vdata).subscribe(data =>{
      this.dsPrebilldetList.data = data as PreDetailsList[];
      this.dsPrebilldetList.sort = this.sort;
      this.dsPrebilldetList.paginator = this.paginator;
      console.log(this.dsPrebilldetList.data)
    })
  }
  onClose(){
    this.dialogRef.close();
  }
}
export class PreDetailsList {
  AdmissionID: Number;
  BillNo: any;
  BillDate: Date;
  concessionReasonId: number;
  tariffId: number;
  RemarkofBill: string
  /**
 * Constructor
 *
 * @param PreDetailsList
 */
  constructor(PreDetailsList) {
    {
      this.AdmissionID = PreDetailsList.AdmissionID || '';
      this.BillNo = PreDetailsList.BillNo || '';
      this.BillDate = PreDetailsList.BillDate || '';
      this.concessionReasonId = PreDetailsList.concessionReasonId || '';
      this.tariffId = PreDetailsList.tariffId || '';
      this.RemarkofBill = PreDetailsList.RemarkofBill;
    }
  }
}
