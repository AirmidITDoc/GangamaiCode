import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HospitalService } from './hospital.service';
import { MatDialog } from '@angular/material/dialog';
import { NewHospitalComponent } from './new-hospital/new-hospital.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-hospital-master',
  templateUrl: './hospital-master.component.html',
  styleUrls: ['./hospital-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HospitalMasterComponent implements OnInit {
 
  resultsLength:any=0;
  displayedColumns: string[] = [
    // "HospitalId",
    "HospitalName",
    "HospitalAddress",
    "City",
    "Pin",
    "Phone",
    "EmailID",
    "WebSiteInfo",
    "action",
];
DSHospitalList=new MatTableDataSource<HospitalMaster>();

@ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    
  constructor( public _HospitalService: HospitalService,
    public _matDialog: MatDialog
   ) { }

  ngOnInit(): void {
    this.getHospitalMaster();

    
  }


  getHospitalMaster() {
  this._HospitalService.getHospitalMasterList().subscribe((data) => {
        this.DSHospitalList.data = data as HospitalMaster[];
       
        this.resultsLength=  this.DSHospitalList.data.length; 
        console.log(this.DSHospitalList.data);
    });
}
onSearch(){

}
onAdd() {

  const dialogRef = this._matDialog.open(NewHospitalComponent, {
      maxWidth: "65vw",
      maxHeight: "85vh",
      width: "100%",
      height: "100%",
  });
  dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.getHospitalMaster();
  });
}

onEdit(row){
  this._HospitalService.populateForm(row);
  const dialogRef = this._matDialog.open(NewHospitalComponent, {
    maxWidth: "65vw",
    maxHeight: "85vh",
    width: "100%",
    height: "100%",
    data: {
      registerObj: row,
  }
});
dialogRef.afterClosed().subscribe((result) => {
    console.log("The dialog was closed - Insert Action", result);
    this.getHospitalMaster();
});
}
}


export class HospitalMaster {
  HospitalId: any;
  HospitalName: any;
  HospitalAddress: any;
  City: any;
  CityId: any;
  Pin: any;
  Phone : any;
  EmailID:any;
  WebSiteInfo:any;
  Header:any;
  IsDeleted:any;
  /**
   * Constructor
   *
   * @param HospitalMaster
   */
  constructor(HospitalMaster) {
      {
        this.HospitalId = HospitalMaster.HospitalId || 0;
          this.HospitalName = HospitalMaster.HospitalName || "";
          this.HospitalAddress = HospitalMaster.HospitalAddress || "";
          this.City = HospitalMaster.City || "";
          this.CityId = HospitalMaster.CityId || "";
          this.Pin = HospitalMaster.Pin || "";
          this.Phone  =HospitalMaster.Phone  || "";
          this.EmailID = HospitalMaster.EmailID || "";
          this.WebSiteInfo  =HospitalMaster.WebSiteInfo  || "";
          this.Header  =HospitalMaster.Header  || "";
          this.IsDeleted  =HospitalMaster.IsDeleted  || 1;
      }
  }
}