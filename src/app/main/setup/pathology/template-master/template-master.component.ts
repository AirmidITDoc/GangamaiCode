import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TemplateServieService } from './template-servie.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { TemplateFormComponent } from './template-form/template-form.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-template-master',
  templateUrl: './template-master.component.html',
  styleUrls: ['./template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TemplateMasterComponent implements OnInit {

  displayedColumns: string[] = [
    "TemplateId",
    "TemplateName",
    "IsDeleted",
    "AddedBy",
    "UpdatedBy",
    "action"
  ];

  isLoading = true;
  sIsLoading: string = '';
  TemplateList: any = [];
  currentStatus = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  Templatedatasource = new MatTableDataSource<TemplateMaster>();
  Templatedatasource1 = new MatTableDataSource<TemplateMaster>();
  tempList= new MatTableDataSource<TemplateMaster>();
  constructor(
    public _TemplateServieService: TemplateServieService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private reportDownloadService: ExcelDownloadService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.getTemplateMasterList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  resultsLength=0;
  getTemplateMasterList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      TemplateName:
        this._TemplateServieService.myformSearch.get("TemplateNameSearch").value + "%" || "%",
    };
    ;
    this._TemplateServieService.getTemplateMasterList(m_data).subscribe((Menu) => {
      this.Templatedatasource.data = Menu as TemplateMaster[];
      this.Templatedatasource1.data = Menu as TemplateMaster[];
      this.isLoading = false;
      this.Templatedatasource.sort = this.sort;
      this.Templatedatasource.paginator = this.paginator;
      this.resultsLength= this.Templatedatasource.data.length
      this.sIsLoading = '';
      console.log(this.Templatedatasource.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onAdd() {
    const dialogRef = this._matDialog.open(TemplateFormComponent, {
      maxWidth: "70vw",
      maxHeight: "95vh",
      width: "100%",
      height: "100%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.getTemplateMasterList();
    });
  }

  toggle(val: any) {
    if (val == "2") {
        this.currentStatus = 2;
    } else if(val=="1") {
        this.currentStatus = 1;
    }
    else{
        this.currentStatus = 0;

    }
}


  onFilterChange(){
    debugger
            
    if (this.currentStatus == 1) {
      this.tempList.data = []
      this.Templatedatasource.data= this.Templatedatasource1.data
      for (let item of this.Templatedatasource.data) {
          if (item.IsDeleted) this.tempList.data.push(item)

      }

      this.Templatedatasource.data = [];
      this.Templatedatasource.data = this.tempList.data;
  }
  else if (this.currentStatus == 0) {
      this.Templatedatasource.data= this.Templatedatasource1.data
      this.tempList.data = []

      for (let item of this.Templatedatasource.data) {
          if (!item.IsDeleted) this.tempList.data.push(item)

      }
      this.Templatedatasource.data = [];
      this.Templatedatasource.data = this.tempList.data;
  }
  else {
      this.Templatedatasource.data= this.Templatedatasource1.data
      this.tempList.data = this.Templatedatasource.data;
  }

   }
  onEdit(row) {
    console.log(row);

    console.log(row);
    this._TemplateServieService.populateForm(row);
    const dialogRef = this._matDialog.open(TemplateFormComponent, {
      maxWidth: "80%",
      width: "80%",
      height: "85%",
      data: {
        registerObj: row,
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.toastr.success('Record Updated Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });

        this.onClear();

      } else {
        this.toastr.error('Template Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
  }


  onDeactive(row, PTemplateId) {

    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to deactivate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
    }).then((result) => {
      let Query
      if (result.isConfirmed) {
        if (row.Isdeleted) {
          Query =
            "Update M_TemplateMaster set IsDeleted=0 where TemplateId=" +
            PTemplateId;
          console.log(Query);
        } else {
          Query =
            "Update M_TemplateMaster set IsDeleted=1 where TemplateId=" +
            PTemplateId;
          console.log(Query);
        }
        this._TemplateServieService
          .deactivateTheStatus(Query)
          .subscribe((data) => {
            if (data) {
             this.toastr.success('Record  Status has been Changed Successfully.', 'Saved !', {
               toastClass: 'tostr-tost custom-toast-success',
             });
             
             this.onClear();
             
           } else {
             this.toastr.error('Template Data  Status has been Changed !, Please check API error..', 'Error !', {
               toastClass: 'tostr-tost custom-toast-error',
             });
           }
          });
        this.getTemplateMasterList();
      }
    });
  }



  onSearch() {
    this.getTemplateMasterList();
  }
  onClear() {
    this._TemplateServieService.myform.reset({ IsDeleted: "false" });
    // this._TemplateServieService.initializeFormGroup();
  }
  onSearchClear() {
    this._TemplateServieService.myformSearch.reset({
      TemplateNameSearch: "",
      IsDeletedSearch: "2",
    });
    this.getTemplateMasterList();
  }


  
  exportTemplateExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['TemplateId', 'TemplateName', 'IsDeleted', 'AddedBy', 'UpdatedBy'];
    this.reportDownloadService.getExportJsonData(this.Templatedatasource.data, exportHeaders, 'Pathology Template');
    this.Templatedatasource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.Templatedatasource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.TemplateId);
      tempObj.push(e.TemplateName);
      tempObj.push(e.IsDeleted);
      tempObj.push(e.AddedBy);
      
      actualData.push(tempObj);
    });
    let headers = [['TemplateId', 'TemplateName', 'IsDeleted', 'AddedBy', 'UpdatedBy']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Pathology Template');
  }


}


export class TemplateMaster {
  TemplateId: number;
  TemplateName: any;
  TemplateDesc: any;
  IsDeleted:any;
  AddedBy:any;
  UpdatedBy:any;
  TemplateDescInHTML:any;
  /**
   * Constructor
   *
   * @param TemplateMaster
   */
  constructor(TemplateMaster) {
      {
          this.AddedBy = TemplateMaster.AddedBy || 0;
          this.TemplateName = TemplateMaster.TemplateName || "";
          this.TemplateDesc = TemplateMaster.TemplateDesc || "";
          this.IsDeleted = TemplateMaster.IsDeleted || 0;
          this.AddedBy = TemplateMaster.AddedBy || 0;
          this.UpdatedBy = TemplateMaster.UpdatedBy || 0;
          this.TemplateDescInHTML = TemplateMaster.TemplateDescInHTML || '';
      }
  }
}
