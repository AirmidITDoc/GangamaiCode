import { FuseUtils } from '@fuse/utils';

export class MenuMaster {
      Id:number;
      menu_master_id:number ;
      menu_master_link_name: string;
      menu_master_icon: string;
      menu_master_controller:string ;
      menu_master_action: string;
      menu_master_display_sr_no: number;
      menu_master_block:number ;

      Menu_SubID:number;
      menu_master_detail_master_id: number;
      menu_master_detail_sr_no: number;
      menu_master_detail_display_sr_no: number;
      menu_master_detail_block: number; 
      menu_master_detail_link_name: string;
      menu_master_detail_action: string;
    

    /**
     * Constructor
     *
     * @param menuMaster
     */
    constructor(menuMaster) {
        {
            this.Id = menuMaster. Id || '';
            this.menu_master_id = menuMaster. menu_master_id || '';
            this.menu_master_link_name = menuMaster.menu_master_link_name || '';
            this. menu_master_icon= menuMaster. menu_master_icon|| '';
            this.menu_master_controller = menuMaster.menu_master_controller || '';
            this.menu_master_action = menuMaster.menu_master_action || '';
            this.menu_master_display_sr_no = menuMaster. menu_master_display_sr_no|| '';
            this.menu_master_block = menuMaster.menu_master_block || '';

            this.Menu_SubID = menuMaster. Menu_SubID || '';
            this.menu_master_detail_master_id = menuMaster.menu_master_detail_master_id || '';
            this.menu_master_detail_sr_no = menuMaster.menu_master_detail_sr_no || '';
            this.menu_master_detail_display_sr_no = menuMaster.menu_master_detail_display_sr_no || '';
            this.menu_master_detail_block = menuMaster.menu_master_detail_block || '';
            this.menu_master_detail_link_name = menuMaster.menu_master_detail_link_name || '';
            this.menu_master_detail_action = menuMaster.menu_master_detail_action || '';
            
        }
    }
}

export class Sub_SubMenuMaster {
    menu_master_detail_detail_master_id :number;
    menu_master_detail_detail_master_sr_no :number; 
    menu_master_detail_detail_sr_no :number;
    menu_master_detail_detail_link_name:string; 
    menu_master_detail_detail_action:string;
    menu_master_detail_detail_block: number; 
    menu_master_detail_detail_display_sr_no: number; 
    Menu_Sub_SubID: number;
    menu_master_detail_detail_icon: string;

  /**
   * Constructor
   *
   * @param menuMaster
   */
  constructor(Sub_SubMenuMaster) {
      {
          this.menu_master_detail_detail_master_id = Sub_SubMenuMaster.menu_master_detail_detail_master_id || '';
          this.menu_master_detail_detail_master_sr_no = Sub_SubMenuMaster.menu_master_detail_detail_master_sr_no || '';
          this.menu_master_detail_detail_sr_no = Sub_SubMenuMaster.menu_master_detail_detail_sr_no || '';
          this.menu_master_detail_detail_link_name= Sub_SubMenuMaster.menu_master_detail_detail_link_name|| '';
          this.menu_master_detail_detail_action = Sub_SubMenuMaster.menu_master_detail_detail_action || '';
          this.menu_master_detail_detail_block = Sub_SubMenuMaster.menu_master_detail_detail_block || '';
          this.menu_master_detail_detail_display_sr_no = Sub_SubMenuMaster.menu_master_detail_detail_display_sr_no|| '';
          this.menu_master_detail_detail_icon = Sub_SubMenuMaster.menu_master_detail_detail_icon || '';
          this.Menu_Sub_SubID = Sub_SubMenuMaster.Menu_Sub_SubID || '';
      }
  }
}
