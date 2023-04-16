import { FuseUtils } from '@fuse/utils';

export class ServiceMaster {
    ProductTypeId: number;
    IsDeleted: boolean;
    ProductTypeName: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.ProductTypeId = contact.ProductTypeId || '';
            this.ProductTypeName = contact.ProductTypeName || '';
            this.IsDeleted = contact.IsDeleted || '';
        }
    }
}
