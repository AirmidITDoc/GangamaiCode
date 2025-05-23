import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { PrescriptionclassmasterService } from "./prescriptionclassmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-prescriptionclassmaster",
    templateUrl: "./prescriptionclassmaster.component.html",
    styleUrls: ["./prescriptionclassmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrescriptionclassmasterComponent implements OnInit {
    PrescriptionclassMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "ClassId",
        "ClassName", 
        "IsDeleted",
        "AddedByName",
        "UpdatedByName",
        "action",
    ];

    DSPrescriptionClassMasterList =
        new MatTableDataSource<PrescriptionClassMaster>();

    constructor(
        public _PrescriptionclassService: PrescriptionclassmasterService,
        public toastr : ToastrService,
       private _loggedService: AuthenticationService,
       private datepipe:DatePipe
    ) {}
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(): void {
        this.getPrescriptionclassMasterList();
    }
  

    onSearchClear() {
        this._PrescriptionclassService.myformSearch.reset({
            ClassNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getPrescriptionclassMasterList();
    }
   
    onSearch() {
        this.getPrescriptionclassMasterList();
    }
    getPrescriptionclassMasterList() {
        var vdata = {
            "ClassName":this._PrescriptionclassService.myformSearch.get("ClassNameSearch").value.trim() + "%" || "%",  
        };
        this._PrescriptionclassService.getPrescriptionclassMasterList(vdata).subscribe((Menu) =>{
            this.DSPrescriptionClassMasterList.data = Menu as PrescriptionClassMaster[];
            this.DSPrescriptionClassMasterList.sort = this.sort;
            this.DSPrescriptionClassMasterList.paginator = this.paginator;
            console.log(this.DSPrescriptionClassMasterList);
        });      
    }

     
    onClear() {
        this._PrescriptionclassService.myForm.reset({ IsDeleted: "false" });
        this._PrescriptionclassService.initializeFormGroup();
    }  
    onSubmit() {
        if (this._PrescriptionclassService.myForm.valid) {
            if ( !this._PrescriptionclassService.myForm.get("ClassId").value) {
                var m_data = {
                    "classMasterParamsInsert": {
                        "className": this._PrescriptionclassService.myForm.get("ClassName").value.trim(),
                        "addedBy": this._loggedService.currentUserValue.user.id,
                        "isActive": Boolean(
                            JSON.parse( this._PrescriptionclassService.myForm.get("IsDeleted").value
                            ) ), 
                        "addedByDate": this.datepipe.transform(new Date(), 'yyyy-MM-dd') || '1999-01-01'  
                    }
                };
                 console.log(m_data)
                this._PrescriptionclassService
                    .prescriptionTemplateMasterInsert(m_data).subscribe((data) => {
                        this.msg = m_data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getPrescriptionclassMasterList();
                        } else {
                            this.toastr.error('Prescription Class Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getPrescriptionclassMasterList();
                    }, error => {
                        this.toastr.error('Prescription Class Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
                var m_dataUpdate = {
                    "classMasterParamsUpdate": {
                        "classId":this._PrescriptionclassService.myForm.get("ClassId").value || 0,
                        "className": this._PrescriptionclassService.myForm.get("ClassName").value.trim(),
                        "updatedBy": this._loggedService.currentUserValue.user.id,
                        "isActive": Boolean(
                            JSON.parse( this._PrescriptionclassService.myForm.get("IsDeleted").value
                            ) ), 
                        "updatedByDate": this.datepipe.transform(new Date(), 'yyyy-MM-dd') || '1999-01-01' 
                    },
                };
                console.log(m_dataUpdate)
                this._PrescriptionclassService
                    .prescriptionTemplateMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getPrescriptionclassMasterList(); 
                        } else {
                            this.toastr.error('Prescription Class Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getPrescriptionclassMasterList();
                    },error => {
                        this.toastr.error('Prescription Class Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        // console.log(row);
        var m_data1 = {
            ClassId: row.ClassId,
            ClassName: row.ClassName.trim(), 
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedByName: row.UpdatedByName,
             AddedByName: row.AddedByName
        };
        console.log(m_data1);
        this._PrescriptionclassService.populateForm(m_data1);
    }
}
export class PrescriptionClassMaster {
    ClassId: number;
    ClassName: string; 
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedByName: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param PrescriptionClassMaster
     */
    constructor(PrescriptionClassMaster) {
        {
            this.ClassId = PrescriptionClassMaster.ClassId || "";
            this.ClassName = PrescriptionClassMaster.ClassName || ""; 
            this.IsDeleted = PrescriptionClassMaster.IsDeleted || "false"; 
            this.UpdatedByName = PrescriptionClassMaster.UpdatedByName || "";
            this.AddedByName = PrescriptionClassMaster.AddedByName || "";
        }
    }
}
