import { FuseUtils } from '@fuse/utils';

export class ServiceMaster {
    VendorId : number; 
    VendorName: string; 
    MobileNo: string;
    EmailId: string;
    AccountNo: string;
    IFSCCode: string;
    BankId : number;
    BankName : string;
    CategoryID : number;
    IsDeleted : boolean;
    AddedBy : number; 
    UpdatedBy : number;


    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.VendorId = contact.VendorId || '';
            this.VendorName = contact.VendorName || '';
            this.BankName = contact.BankName || '';
            this.AccountNo = contact.AccountNo || '';
            this.IsDeleted = contact.IsDeleted || '';
        }
    }
}
