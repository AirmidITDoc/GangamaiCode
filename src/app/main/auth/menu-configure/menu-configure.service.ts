import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuMaster } from './menu.model';

@Injectable()
export class MenuConfigureService
{
  employee: MenuMaster;
  myformMenu: FormGroup;
  myformMenuSubMenu: FormGroup;
  myformMenuSub_SubMenu: FormGroup;
  
    constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
      this.myformMenu = this.createMenuForm();
      this.myformMenuSubMenu = this.createMenuSubMenuForm();
      this.myformMenuSub_SubMenu = this.createMenuSub_SubMenuForm();
  }
  
  createMenuForm(): FormGroup {
    return this._formBuilder.group({
      menu_master_id: [''],
      menu_master_link_name: [''],
      menu_master_icon: [''],
      menu_master_controller: [''],
      menu_master_action: [''],
      menu_master_display_sr_no: [''],
      menu_master_block: [],
      Id:[''],
    });
  }
  createMenuSubMenuForm(): FormGroup {
    return this._formBuilder.group({
      menu_master_detail_master_id: [''],
      menu_master_detail_sr_no: [''],
      menu_master_detail_display_sr_no: [''],
      menu_master_detail_block: [''],
      menu_master_detail_link_name: [''],
      menu_master_detail_action: [''],
      Menu_SubID:[''],
    });
  }

  createMenuSub_SubMenuForm(): FormGroup {
    return this._formBuilder.group({
      menu_master_detail_detail_master_id: [''],
      menu_master_detail_detail_master_sr_no: [''],
      menu_master_detail_detail_sr_no: [''],
      menu_master_detail_detail_link_name: [''],
      menu_master_detail_detail_action: [''],
      menu_master_detail_detail_block: [''],
      menu_master_detail_detail_display_sr_no: [''],
      menu_Sub_SubID:[''],
      menu_master_detail_detail_icon:[''],
    });
  }

  initializeFormGroupMenuMaster() {
    this.createMenuForm();
  }

  initializeFormMenu_SubMenuMaster() {
    this.createMenuSubMenuForm();
  }
  
  initializeFormMenuSub_SubMenuMaster() {
    this.createMenuSubMenuForm();
  }

  // Menu Master Name Combobox List
  getMenuMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_MenuNameForCombo", {})
  }

  // Menu SubMenu Name Master Combobox List
  getMenu_SubMenuMasterCombo(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_Menu_SubMenuNameForCombo", employee)
  }

  //  ================  Menu Master  ==================================
  
  getMenuMasterList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Menu_master", { })
  }

  // Insert menu Master 
  insertMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterSave", employee)
  }

  // Update menu Master 
  updateMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterUpdate", employee)
  }

  populateMenu(employee) {
    this.myformMenu.patchValue(employee);
  }

  //  ================  Sub Menu Master  ==================================

  getSubMenuMasterList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Menu_Master_detail",employee)
  }

  // Insert Sub menu Master 
  insertSubMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterDetailsSave",employee)
  }

  // Update Sub menu Master 
  updateSubMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterDetailsUpdate",employee)
  }

  populateSubMenuForm(employee) {
    this.myformMenuSubMenu.patchValue(employee);
  }

  //  ================  Sub - Sub Menu Master  ==================================

  getSub_SubMenuMasterList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Menu_Master_detail_detail",employee)
  }

  populateSub_SubMenuForm(employee){
    this.myformMenuSubMenu.patchValue(employee);
  }
  
  populateSub_SubMenuFormEdit(employee) {
    this.myformMenuSub_SubMenu.patchValue(employee);
  }

  // Insert Sub Submenu Master 
  insertSub_SubMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterDetails_DetailsSave",employee)
  }

  // Update Sub Submenu Master 
  updateSub_SubMenuMaster(employee) {
    return this._httpClient.post("Master/MenuMasterDetails_DetailsUpdate",employee)
  }
}
