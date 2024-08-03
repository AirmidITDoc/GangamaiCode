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
    "Isdeleted",
    "AddedBy",
    "UpdatedBy",
    "action"
  ];

  isLoading = true;
  sIsLoading: string = '';
  TemplateList: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  Templatedatasource = new MatTableDataSource<TemplateMaster>();
  constructor(
    public _TemplateServieService: TemplateServieService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getTemplateMasterList();
  }

  getTemplateMasterList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      TemplateName:
        this._TemplateServieService.myformSearch.get("TemplateNameSearch").value + "%" || "%",
    };
    ;
    this._TemplateServieService.getTemplateMasterList(m_data).subscribe((Menu) => {
      this.Templatedatasource.data = Menu as TemplateMaster[];
      this.isLoading = false;
      this.Templatedatasource.sort = this.sort;
      this.Templatedatasource.paginator = this.paginator;
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
      title: 'Do you want to Deactive Template',
      showCancelButton: true,
      confirmButtonText: 'OK',

    }).then((flag) => {
      let Query
      if (flag.isConfirmed) {
        if (row.Isdeleted) {
          Query =
            "Update M_TemplateMaster set Isdeleted=0 where TemplateId=" +
            PTemplateId;
          console.log(Query);
        } else {
          Query =
            "Update M_TemplateMaster set Isdeleted=1 where TemplateId=" +
            PTemplateId;
          console.log(Query);
        }
        this._TemplateServieService
          .deactivateTheStatus(Query)
          .subscribe((data) => {
            if (data) {
             this.toastr.success('Record Deactivated Successfully.', 'Saved !', {
               toastClass: 'tostr-tost custom-toast-success',
             });
             
             this.onClear();
             
           } else {
             this.toastr.error('Template Data not Deactivated !, Please check API error..', 'Error !', {
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

}


export class TemplateMaster {
  TemplateId: number;
  TemplateName: any;
  TemplateDesc: any;
  Isdeleted:any;
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
          this.Isdeleted = TemplateMaster.Isdeleted || 0;
          this.AddedBy = TemplateMaster.AddedBy || 0;
          this.UpdatedBy = TemplateMaster.UpdatedBy || 0;
          this.TemplateDescInHTML = TemplateMaster.TemplateDescInHTML || '';
      }
  }
}
