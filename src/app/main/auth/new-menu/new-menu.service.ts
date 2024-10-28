import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NewMenuService {
  myformMenu: FormGroup;
  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myformMenu = this.createMenuForm(); }
 
    createMenuForm(): FormGroup {
      return this._formBuilder.group({
        Id: [''],
        UpId: [''],
        LinkName: [''],
        Icon: [''],
        LinkAction: [''],
        SortOrder: [''],
        IsActive: [],
        Display:[''],
      });
    }
    getNewMenuMasterList() {
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Menu_master", { })
    }
  
    // Insert menu Master 
    insertMenuMaster(employee) {
      return this._httpClient.post("Master/MenuMasterSave", employee)
    }
  
    // Update menu Master 
    updateMenuMaster(employee) {
      return this._httpClient.post("Master/MenuMasterUpdate", employee)
    }



       // Insert menu Master 
       insertMenuMasterNew(employee) {
        return this._httpClient.post("Master/MenuSave", employee)
      }
    
      // Update menu Master 
      updateMenuMasterNew(employee) {
        return this._httpClient.post("Master/MenuUpdate", employee)
      }
  
    populateMenu(employee) {
      this.myformMenu.patchValue(employee);
    }
}
