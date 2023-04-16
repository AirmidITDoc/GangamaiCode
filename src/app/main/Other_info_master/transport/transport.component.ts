import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { OtherinfoMasterService } from '../otherinfo-master.service';
import { EditTransportMasterComponent } from './edit-transport-master/edit-transport-master.component';
import { NewTransportMasterComponent } from './new-transport-master/new-transport-master.component';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TransportComponent implements OnInit {

  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  sIsLoading:any;
  registerObj:any;
  // menuActions:Array<string> = [];
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    
    'TransportId',
    'TransportCode',
    'TransportName',
    'TagaRate',
    'BagRate',
    'LoadedBeamRate',
    'EmptyBeamRate',
    'OtherRate',
    'CutePeiceRate',
    'RollRate',
    'UpdatedBy',
    'UpdatedOn',
    // 'IsActive',
  'action'
  ];
  dataSource = new MatTableDataSource<Transportmaster>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();


  constructor(public _OtherinfoMasterService: OtherinfoMasterService,
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
      "Keyword":'',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._OtherinfoMasterService.getTransportTypeList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Transportmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

  


  getTransportmasterList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '',
      "From_Dt" : this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    
    this._OtherinfoMasterService.getTransportTypeList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Transportmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  


  onSearch() {
    this.getTransportmasterList();

  }



  NewTransportmaster() {
    const dialogRef = this._matDialog.open(NewTransportMasterComponent,
      {
        maxWidth: "45vw",
        height: '450px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getTransportmasterList();
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
        "TransportId":row.TransportId,
        "TransportName":row.TransportName,
        "TagaRate":row.TagaRate,
        "BagRate":row.BagRate,

        "LoadedBeamRate":row.LoadedBeamRate,
        "EmptyBeamRate":row.EmptyBeamRate,
        "OtherRate":row.OtherRate,
        "CutePeiceRate":row.CutePeiceRate,
        "RollRate":row.RollRate,
      }
    
      console.log(m_data);
      this._OtherinfoMasterService.populateFormBeam(m_data);
      
      const dialogRef = this._matDialog.open(EditTransportMasterComponent, 
        {   maxWidth: "45vw",
            height: '450px',
            width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getTransportmasterList();
      });
    }


  onClear() {

    this._OtherinfoMasterService.Searchform.get('Keyword').reset();
 
    var D_data = {
      "Keyword":'',// this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '%',
      "From_Dt" :'',// this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : '',//this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "01/01/1900", 
    
    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._OtherinfoMasterService.getTransportTypeList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Transportmaster[];
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

//  let Query ="update Transportmaster set isActive=0 where yID=" +element.yID + "";
// console.log(Query);
//  this._OtherinfoMasterService.getDeleteTransportmaster(Query).subscribe(data => {
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



export class Transportmaster {
  TransportId: any;
  TransportName: any;
  TagaRate:any;
  TransportCode: any;

  BagRate: any;
  LoadedBeamRate: any;
  EmptyBeamRate:any;
  EmptyBeamWt: any;
  OtherRate: any;
  CutePeiceRate: any;
  BeamNumber:any;
  RollRate: any;
 
  Created: any;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Transportmaster) {
    {
      this.TransportId = Transportmaster.TransportId || 0;
      this.TransportName = Transportmaster.TransportName || '';
      this.TagaRate = Transportmaster.TagaRate || 0;
      this.EmptyBeamWt = Transportmaster.EmptyBeamWt || 0;
      this.BagRate = Transportmaster.BagRate || 0;
      this.LoadedBeamRate = Transportmaster.LoadedBeamRate || 0;
      this.EmptyBeamRate = Transportmaster.EmptyBeamRate || 0;
      this.EmptyBeamWt = Transportmaster.EmptyBeamWt || 0;
      this.OtherRate = Transportmaster.OtherRate || 0;
      this.CutePeiceRate = Transportmaster.CutePeiceRate || 0;
      this.RollRate = Transportmaster.RollRate || 0;
      
    

    }
  }
}