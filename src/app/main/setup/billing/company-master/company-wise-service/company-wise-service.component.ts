import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyMasterService } from '../company-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-company-wise-service',
  templateUrl: './company-wise-service.component.html',
  styleUrls: ['./company-wise-service.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyWiseServiceComponent implements OnInit {
  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action' 
    ] 
    displayedServiceselected: string[] = [
      'ServiceName',
      'Qty',
      'Price',
      'buttons'
    ]



  myFormGroup:FormGroup
  chargeslist:any=[]; 
  isLoading: String = '';
  sIsLoading: string = "";
  screenFromString = 'Company';
  registerObj:any;  
  isServiceIdSelected:boolean=false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsservicelist = new MatTableDataSource<ServCompList>();
  dscompanyserv = new MatTableDataSource<ServCompList>();

  constructor(
    public _companyService: CompanyMasterService,
    public toastr : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompanyWiseServiceComponent>, 
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,  
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.myFormGroup = this.CreateServCompForm();
    if(this.data){
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
    }
    this.getServiceListdata();
  }
  CreateServCompForm(){
    return this.formBuilder.group({
      IsPathRad: ['3'], 
      ServiceId: '',  
    });
  }
  getServiceListdata() {
    // debugger  
      this.sIsLoading = ''
      var Param = {
        "ServiceName":`${this.myFormGroup.get('ServiceId').value}%` ||'%',
        "IsPathRad":parseInt(this.myFormGroup.get('IsPathRad').value) || 0,
        "ClassId":   0,
        "TariffId":  0 //this.registerObj.TraiffId  || 0
    }
      console.log(Param);
      this._companyService.getServiceListDetails(Param).subscribe(data => {
        this.dsservicelist.data = data as ServCompList[]; 
        this.dsservicelist.data = data as ServCompList[];
       console.log(this.dsservicelist)
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        }); 
  }
  onSaveEntry(row) {
    this.isLoading = 'save';
    this.dscompanyserv.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.ServiceId);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }
      this.isLoading = '';
      this.dscompanyserv.data = this.chargeslist;
      this.dscompanyserv.sort = this.sort;
      this.dscompanyserv.paginator = this.paginator;
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
    else{
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ServiceId: row.ServiceId,
        ServiceName: row.ServiceName,
        Price: row.Price || 0
      });
    this.isLoading = '';
    console.log(this.chargeslist);
    this.dscompanyserv.data = this.chargeslist;
    this.dscompanyserv.sort = this.sort;
    this.dscompanyserv.paginator = this.paginator;
  }

  deleteTableRow(element) { 
      this.chargeslist= this.dscompanyserv.data ;
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dscompanyserv.data = [];
        this.dscompanyserv.data = this.chargeslist;
      }
      this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        toastClass: 'tostr-tost custom-toast-success',
      });  
  }
  gettablecalculation(element) {
    console.log(element)
    if(element.Qty == 0 || element.Qty == ''){
      element.Qty = 1 ;
      this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
      return;
    }
    debugger 
   if(element.Price > 0 && element.Qty > 0){ 
    element.TotalAmt = element.Qty * element.Price || 0;
    element.DiscAmt = (element.ConcessionPercentage * element.TotalAmt) / 100  || 0;
    element.NetAmount =  element.TotalAmt - element.DiscAmt
    }  
    else if(element.Price == 0 || element.Price == '' || element.Qty == '' || element.Qty == 0){
      element.TotalAmt = 0;  
      element.DiscAmt =  0 ;
      element.NetAmount =  0 ;
    }  
  }
  onSubmit(){

  }
  onClose(){
    this._matDialog.closeAll();
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}
}
export class ServCompList {
  ServiceName: any;
  Price: number;
  ServiceId: any;
  Qty:any;
  constructor(ServCompList) {
    this.ServiceName = ServCompList.ServiceName || '';
    this.Price = ServCompList.Price || 0;
    this.ServiceId = ServCompList.ServiceId || 0;
  }
}
