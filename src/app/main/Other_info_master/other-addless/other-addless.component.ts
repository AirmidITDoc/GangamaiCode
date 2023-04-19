import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/Invoice/advance';
import { OtherinfoMasterService } from '../otherinfo-master.service';
import { EditAddlessComponent } from './edit-addless/edit-addless.component';
import { NewAddlessComponent } from './new-addless/new-addless.component';

@Component({
  selector: 'app-other-addless',
  templateUrl: './other-addless.component.html',
  styleUrls: ['./other-addless.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OtherAddlessComponent implements OnInit {

  step:any;
  setStep(index: number) {
    this.step = index;
  }

  sIsLoading: string = '';
  isLoading = true;
  registerObj:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  
  displayedColumns = [
  
    'AddLessId',
    'AddLessCode',
    'AddLessName',
    'StdEfficiency',
    'ReadingFactor',
    'UpdatedBy',
    'UpdatedOn',
    // 'IsActive',
  'action'
  ];
  dataSource = new MatTableDataSource<Addlessmaster>();
  menuActions: Array<string> = [];

  
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
    this._OtherinfoMasterService.getAddLesstList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Addlessmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

  


  getAddlessmasterList() {
    //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "Keyword": this._OtherinfoMasterService.Searchform.get("Keyword").value + '%' || '',
      "From_Dt" : this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("start").value,"MM-dd-yyyy") || "",
      "To_Dt" : this.datePipe.transform(this._OtherinfoMasterService.Searchform.get("end").value,"MM-dd-yyyy") || "", 
    
    }
    
    this._OtherinfoMasterService.getAddLesstList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Addlessmaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  

  onSearch() {
    this.getAddlessmasterList();

  }



  NewAddlessmaster() {
    const dialogRef = this._matDialog.open(NewAddlessComponent,
      {
        maxWidth: "45vw",
        height: '450px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getAddlessmasterList();
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
    // console.log(row);
      var m_data = {
        "AddLessID":row.AddLessId,
        "AddLessName":row.AddLessName,
        "StdEfficiency":row.StdEfficiency,
        "ReadingFactor":row.ReadingFactor,
       
      }
    
      console.log(m_data);
      this._OtherinfoMasterService.populateFormBeam(m_data);
      
      const dialogRef = this._matDialog.open(EditAddlessComponent, 
        {   maxWidth: "45vw",
            height: '450px',
            width: '100%',
             data : {
            registerObj : m_data,
          }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getAddlessmasterList();
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
    this._OtherinfoMasterService.getAddLesstList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as Addlessmaster[];
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

//  let Query ="update Addlessmaster set isActive=0 where yID=" +element.yID + "";
// console.log(Query);
//  this._OtherinfoMasterService.getDeleteAddlessmaster(Query).subscribe(data => {
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


export class Addlessmaster {
  AddLessId: number;
  AddLessCode: string;
  AddLessName:any;
  StdEfficiency:any;
  ReadingFactor:any;
  EmptyBeamWt:any;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Addlessmaster) {
    {
      this.AddLessId = Addlessmaster.AddLessId || 0;
      this.AddLessCode = Addlessmaster.AddLessCode || '';
      this.AddLessName = Addlessmaster.AddLessName || 0;
      this.StdEfficiency = Addlessmaster.StdEfficiency || 0;
      this.ReadingFactor = Addlessmaster.ReadingFactor || 0;
       

    }
  }
}
