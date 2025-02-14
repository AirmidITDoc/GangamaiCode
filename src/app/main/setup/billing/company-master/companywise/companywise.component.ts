import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { CompanyMasterService } from '../company-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-companywise',
  templateUrl: './companywise.component.html',
  styleUrls: ['./companywise.component.scss']
})
export class CompanywiseComponent {

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
        
      isClasselected:boolean=false;
      vClassName:any;
      myFormGroup:FormGroup
      chargeslist:any=[]; 
      isLoading: String = '';
      sIsLoading: string = "";
      screenFromString = 'Company';
      registerObj:any;  
      isServiceIdSelected:boolean=false;
      filteredOptionsBillingClassName:Observable<string[]>;
      ClassList:any=[];
      selectedObj:any;
    
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;
    
      dsservicelist = new MatTableDataSource<ServCompList>();
      dscompanyserv = new MatTableDataSource<ServCompList>();
    
      constructor(
        public _CompanyMasterService: CompanyMasterService,
        public toastr : ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CompanywiseComponent>, 
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
          this.getRtrvCompanyServList(this.registerObj)
        } 
        this.getclassNameCombo();
      }
      
      CreateServCompForm(){
        return this.formBuilder.group({
          IsPathRad: ['3'], 
          ServiceId: '',  
          ClassId:'',
          CompanyName:''
        });
      }
      getclassNameCombo() {
        var m_data = {
          'ClassName': '%'  
        }
        // this._CompanyMasterService.getclassNameCombo(m_data).subscribe((data) => {
        //   this.ClassList = data; 
        //   this.filteredOptionsBillingClassName = this.myFormGroup.get('ClassId').valueChanges.pipe(
        //     startWith(''),
        //     map(value => value ? this._filterClassName(value) : this.ClassList.slice()),
        //   ); 
        // });
      } 
      //filters
      private _filterClassName(value: any): string[] {
        if (value) {
          const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
          return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
        }
      } 
      getOptionTextclass(option) {
        return option && option.ClassName ? option.ClassName : '';
      } 
      getSelectedObjClass(obj){
        this.getServiceListdata();
      }
      //get RtrvCompanyService
      getRtrvCompanyServList(obj) {
        this.isLoading = 'loading-data';
        var vdata={
          "CompanyId": obj.CompanyId || 0
        }
        console.log(vdata)
        setTimeout(() => {
        //   this._CompanyMasterService.getRtrvCompanyServList(vdata).subscribe(data=>{
        //     this.dscompanyserv.data =  data as ServCompList[];
        //     this.chargeslist = data as ServCompList
        //     console.log(this.dscompanyserv.data)  
        //   }); 
        },1000); 
      }
    
      getServiceListdata() {
        // debugger  
        if (this.vClassName == '' || this.vClassName == null || this.vClassName == undefined) {
          this.toastr.warning('Please Select class Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
        this.sIsLoading = ''
        var Param = {
          "ServiceName": `${this.myFormGroup.get('ServiceId').value}%` || '%',
          "IsPathRad": parseInt(this.myFormGroup.get('IsPathRad').value) || 0,
          "ClassId": this.myFormGroup.get('ClassId').value.ClassId || 0,
          "TariffId": this.registerObj.TraiffId || 0
        }
        console.log(Param);
        // this._CompanyMasterService.getServiceListDetails(Param).subscribe(data => {
        //   this.dsservicelist.data = data as ServCompList[];
        //   this.dsservicelist.data = data as ServCompList[];
        //   console.log(this.dsservicelist)
        //   this.sIsLoading = '';
        // },
        //   error => {
        //     this.sIsLoading = '';
        //   });
      }
      onAssignServComp(row) {
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
            ServicePrice: row.Price || 0,
            ServiceQty:1
    
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
        if(element.ServiceQty == 0 || element.ServiceQty == ''){
          element.ServiceQty = 1 ;
          this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
            toastClass: 'tostr-tost custom-toast-warning',
          });  
          return;
        }
        debugger 
       if(element.ServicePrice > 0 && element.ServiceQty > 0){ 
        element.TotalAmt = element.ServiceQty * element.ServicePrice || 0;
        element.DiscAmt = (element.ConcessionPercentage * element.TotalAmt) / 100  || 0;
        element.NetAmount =  element.TotalAmt - element.DiscAmt
        }  
        else if(element.ServicePrice == 0 || element.ServicePrice == '' || element.ServiceQty == '' || element.ServiceQty == 0){
          element.TotalAmt = 0;  
          element.DiscAmt =  0 ;
          element.NetAmount =  0 ;
        }  
      }
      onSubmit(){  
          if (!this.dscompanyserv.data.length) {
            this.toastr.warning('Please assign service to company', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
         let insert_CompanyServiceAssignMasterObj = [];
          this.dscompanyserv.data.forEach(element =>{
            let insert_CompanyServiceAssignMaster={
              "companyId":this.registerObj.CompanyId || 0,
              "serviceId": element.ServiceId || 0,
              "servicePrice":element.ServicePrice || 0,
              "serviceQty":element.ServiceQty || 0,
              "isActive": String(this.registerObj.IsActive) == 'false' ? 0:1,
              "createdBy": 1,
            }
            insert_CompanyServiceAssignMasterObj.push(insert_CompanyServiceAssignMaster)
          });
      
           let delete_CompantServiceDetails={
            "companyId": this.registerObj.CompanyId || 0
          }
      
          let submitData={
            "insert_CompanyServiceAssignMaster":insert_CompanyServiceAssignMasterObj,
            "delete_CompantServiceDetails":delete_CompantServiceDetails
          }
      
          console.log(submitData)
        //   this._CompanyMasterService.SaveCompanyService(submitData).subscribe(reponse =>{
        //     if(reponse){
        //       this.toastr.success('Record Saved Successfully.', 'Saved !', {
        //         toastClass: 'tostr-tost custom-toast-success',
        //       });
        //       this.onClose();
        //     } else {
        //       this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        //         toastClass: 'tostr-tost custom-toast-error',
        //       });
        //       this.onClose();
        //     }
        //   }, error => {
        //     this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        //       toastClass: 'tostr-tost custom-toast-error',
        //     });
        //   });  
      }
      onClose(){
        this._matDialog.closeAll();
        this.dscompanyserv.data = [];
        this.dsservicelist.data = [];
        this.myFormGroup.reset();
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
      ServicePrice: number;
      ServiceId: any;
      ServiceQty:any;
      constructor(ServCompList) {
        this.ServiceName = ServCompList.ServiceName || '';
        this.ServicePrice = ServCompList.ServicePrice || 0;
        this.ServiceId = ServCompList.ServiceId || 0;
      }
    }
    