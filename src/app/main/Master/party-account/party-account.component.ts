import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/Invoice/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MasterService } from '../master.service';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { NewPartyAccountComponent } from './new-party-account/new-party-account.component';

@Component({
  selector: 'app-party-account',
  templateUrl: './party-account.component.html',
  styleUrls: ['./party-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PartyAccountComponent implements OnInit {
  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  sIsLoading:any;
  registerObj:any;
  // menuActions:Array<string> = [];
  PartyList: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    
    'AccountType',
    'AccountCode',
    'Name',
    'ContactPerson',
    'ContactNo',
    'EmailAddress',
    // 'Website',
    // 'BussAddress',
    'City',
    'District',
    'State',
    // 'Country',
    'GSTN',
    'PAN',
    'CIN',
    'CreditDebit',
    'OpeningBalance',
    'UpdatedBy',
    'UpdatedOn',
  'action'
  ];
  dataSource = new MatTableDataSource<Accountmaster>();
  menuActions: Array<string> = [];

 // Account filter
 public PartyFilterCtrl: FormControl = new FormControl();
 public filteredParty: ReplaySubject<any> = new ReplaySubject<any>(1);

 
 private _onDestroy = new Subject<void>();



  constructor(public _MasterService: MasterService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }
  D_data1: any;
  ngOnInit(): void {
   
    var D_data = {
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "AccountType":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._MasterService.getAccountList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Accountmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

    
      // console.log(this.data)
      this.getPartyList();
    
    
      this.PartyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterParty();
        });
  }

  
  // Party filter code
  private filterParty() {

    if (!this.PartyList) {
      return;
    }
    // get the search keyword
    let search = this.PartyFilterCtrl.value;
    if (!search) {
      this.filteredParty.next(this.PartyList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredParty.next(
      this.PartyList.filter(bank => bank.AccountType.toLowerCase().indexOf(search) > -1)
    );
  }
  
 
  getPartyList() {
    this._MasterService.getPartyaccountList().subscribe(data => {
      this.PartyList = data;
      this.filteredParty.next(this.PartyList.slice());
    });
  }
  onChangeAccountList(AccountId){

    debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._MasterService.myFilterform.get("Keyword").value + '%' || '%',
      "AccountType": this._MasterService.myFilterform.get("AccountId").value.AccountType  || '%',
      "From_Dt" : this.datePipe.transform(this._MasterService.myFilterform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._MasterService.myFilterform.get("end").value,"MM-dd-yyyy") || "", 
    }
    console.log(D_data);
    this._MasterService.getAccountList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Accountmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

  }
  

  getPartymasterList() {
     debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._MasterService.myFilterform.get("Keyword").value + '%' || '%',
      "AccountType": this._MasterService.myFilterform.get("AccountType").value + '%' || '%',
      "From_Dt" :this.datePipe.transform(this._MasterService.myFilterform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._MasterService.myFilterform.get("end").value,"MM-dd-yyyy") || "", 
    }
    console.log(D_data);
    this._MasterService.getAccountList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Accountmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  


  onSearch() {
    this.getPartymasterList();

  }



  NewPartymaster() {
    const dialogRef = this._matDialog.open(NewPartyAccountComponent,
      {
        maxWidth: "90%",
        height: '650px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPartymasterList();
    });
  }


 


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onClose() {
    // this.dialogRef.close();
  }

  onSubmit() { }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
 



  onEdit(row){
    console.log(row);
      var m_data = {
        "AccountId":row.AccountId,
        "AccountType":row.AccountType,
        "PartyName":row.PartyName,
        "Name":row.Name,

        "ContactPerson":row.ContactPerson,
        "Mobile":row.ContactNo,
        "EMail":row.EmailAddress,
        "Website":row.Website,
        "BAddress":row.BussAddress,

        "City":row.City,
        "pin":row.PinCode,
        "District":row.District,
        "State":row.State,
        "Country":row.Country,


        "GSTno":row.GSTN,
        "PanNo":row.PAN,
        "CINNo":row.CIN,
        "OpeningBalance":row.OpeningBalance,
        "CreditDebit":row.CreditDebit,
      }
    
      console.log(m_data);
      this._MasterService.populateFormAccountMaster(m_data);
      
      const dialogRef = this._matDialog.open(EditAccountComponent, 
        {  
          maxWidth: "90%",
          height: '650px',  width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getPartymasterList();
      });
    }


  onClear() {
// 
    this._MasterService.myFilterform.get('Keyword').reset();
    this._MasterService.myFilterform.get('AccountType').reset();
    var D_data = {
      "Keyword": '',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "AccountType":'',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._MasterService.getAccountList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Accountmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

    

  }
// Delete row in datatable level
  ondelete(element){
 
// debugger;
// //  let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

//  let Query ="update Accountmaster set isActive=0 where yID=" +element.yID + "";
// console.log(Query);
//  this._OtherinfoMasterService.getDeleteAccountmaster(Query).subscribe(data => {
//   if(data)
//   Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  
//   //  console.log(this.DischargeId);
//  });
  }


  onExport(exprtType){
    // debugger;
    // let columnList=[];
    // if(this.dataSource.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,

      
    //       "yID" :this.dataSource.data[i]["yID"],
    //       "yName" :this.dataSource.data[i]["yName"] ? this.dataSource.data[i]["yName"]:"N/A",
    //       "yCode" :this.dataSource.data[i]["yCode"] ? this.dataSource.data[i]["yCode"]:"N/A",
    //       "yPly" :this.dataSource.data[i]["yPly"] ? this.dataSource.data[i]["yPly"] :"N/A",
    //       "yType" :this.dataSource.data[i]["yType"] ? this.dataSource.data[i]["yType"] :"N/A",
    //       "yBlend" :this.dataSource.data[i]["yBlend"] ? this.dataSource.data[i]["yBlend"] : "N/A",
    //       "yActualCount" :this.dataSource.data[i]["yActualCount"] ? this.dataSource.data[i]["yActualCount"]:"N/A",
    //       "yDenierCount" :this.dataSource.data[i]["yDenierCount"] ? this.dataSource.data[i]["yDenierCount"]:"N/A",
    //       "createdBy" :this.dataSource.data[i]["createdBy"] ? this.dataSource.data[i]["createdBy"]:"N/A",
    //       "createdOn" :this.dataSource.data[i]["createdOn"] ? this.dataSource.data[i]["createdOn"]:"N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Yarn-Master-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }
}



export class Accountmaster {
  AccountType: any;
  AccountCode: any;
  Name:any;
  ContactPerson: any;

  ContactNo: any;
  EmailAddress: any;
  Website:any;
  BussAddress: any;
  City: any;
  District: any;
  State:any;
  Country: any;
 
  PinCode: any;

  GSTN: any;
  PAN: any;
  CIN:any;
  CreditDebit: any;
 
  OpeningBalance: number;

  IsActive: any;
  CreatedBy:any;
  UpdatedBy: any;
 
  CreatedOn: any;
  UpdatedOn: any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Accountmaster) {
    {
      this.AccountType = Accountmaster.AccountType || 0;
      this.AccountCode = Accountmaster.AccountCode || '';
      this.Name = Accountmaster.Name || 0;
      this.ContactPerson = Accountmaster.ContactPerson || '';
      this.ContactNo = Accountmaster.ContactNo || 0;
      this.EmailAddress = Accountmaster.EmailAddress || '';
      this.Website = Accountmaster.Website || '';
      this.BussAddress = Accountmaster.BussAddress || '';
      this.City = Accountmaster.City || '';
      this.District = Accountmaster.District || '';
      this.State = Accountmaster.State || '';
      
      this.Country = Accountmaster.Country || '';
      this.PinCode = Accountmaster.PinCode || 0;
      this.GSTN = Accountmaster.GSTN || '';
      this.PAN = Accountmaster.PAN || '';
      this.CIN = Accountmaster.CIN || '';
      
      this.CreditDebit = Accountmaster.CreditDebit || 0;
      this.OpeningBalance = Accountmaster.OpeningBalance || 0;
      this.IsActive = Accountmaster.IsActive || 0;
      this.CreatedBy = Accountmaster.CreatedBy || '';
      this.UpdatedBy = Accountmaster.UpdatedBy || '';
      this.CreatedOn = Accountmaster.CreatedOn || '';
      this.UpdatedOn = Accountmaster.UpdatedOn || '';
    }
  }
}