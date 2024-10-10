import { Component, OnInit } from '@angular/core';
import { CityMasterService } from '../city-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-city',
  templateUrl: './new-city.component.html',
  styleUrls: ['./new-city.component.scss']
})
export class NewCityComponent implements OnInit {
  msg: any;
  constructor( public _CityMasterService: CityMasterService,
    public toastr: ToastrService, public _matDialog: MatDialog) { }

  ngOnInit(): void {
  }
  onSubmit() {
    if (this._CityMasterService.myform.valid) {
        if (!this._CityMasterService.myform.get("GenderId").value) {
            var m_data = {
              cityName: this._CityMasterService.myform.get("CityName").value.CityName,
              stateId:
                  this._CityMasterService.myform.get("StateId").value.StateId,
              addedBy: 1,
              isDeleted: Boolean(
                  JSON.parse(
                      this._CityMasterService.myform.get("IsDeleted").value
                  )
              ),
            };
            console.log(m_data);
            this._CityMasterService.cityMasterInsert(m_data).subscribe(
                (data) => {
                    this.msg = data;
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record Saved Successfully.",
                            "Saved !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                    
                    } else {
                        this.toastr.error(
                            "City Master Data not saved !, Please check API error..",
                            "Error !",
                            {
                                toastClass: "tostr-tost custom-toast-error",
                            }
                        );
                    }
                  
                },
                (error) => {
                    this.toastr.error(
                        "City Data not saved !, Please check API error..",
                        "Error !",
                        {
                            toastClass: "tostr-tost custom-toast-error",
                        }
                    );
                }
            );
        } else {
            var m_dataUpdate = {
              cityId: this._CityMasterService.myform.get("CityId").value,
              cityName: this._CityMasterService.myform.get("CityName").value.CityName,
              stateId:
                  this._CityMasterService.myform.get("StateId").value
                      .StateId,
              isDeleted: Boolean(
                  JSON.parse(
                      this._CityMasterService.myform.get("IsDeleted").value
                  )
              ),
              updatedBy: 1
                
            };

            this._CityMasterService.cityMasterUpdate(this._CityMasterService.myform.get("CityId").value, m_dataUpdate).subscribe(
                (data) => {
                    this.msg = data;
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                    
                    } else {
                        this.toastr.error(
                            "City Master Data not updated !, Please check API error..",
                            "Error !",
                            {
                                toastClass: "tostr-tost custom-toast-error",
                            }
                        );
                    }
                   
                },
                (error) => {
                    this.toastr.error(
                        "City Data not Updated !, Please check API error..",
                        "Error !",
                        {
                            toastClass: "tostr-tost custom-toast-error",
                        }
                    );
                }
            );
        }
        this.onClear();
    }
}

onClear() {
  this._CityMasterService.myform.reset({ isDeleted: "false" });
  this._CityMasterService.initializeFormGroup();
}
}
