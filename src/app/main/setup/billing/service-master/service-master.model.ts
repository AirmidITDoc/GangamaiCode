import { FuseUtils } from '@fuse/utils';

export class ServiceMaster {
    CreditedtoDoctor: boolean;
    DoctorId: number;
    EmgAmt: number;
    EmgPer: number;
    GroupId: number;
    GroupName: string;
    IsActive: boolean;
    IsDocEditable: boolean;
    IsEditable: boolean;
    IsEmergency: boolean;
    IsPathology: number;
    IsRadiology: number;
    Price: number;
    PrintOrder: number;
    ServiceId: number;
    ServiceName: string;
    ServiceShortDesc: string;
    SubGroupId: number;
    TariffId: number;
    TariffName: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.ServiceName = contact.ServiceName || '';
            this.GroupName = contact.GroupName || '';
            this.ServiceShortDesc = contact.ServiceShortDesc || '';
            this.TariffName = contact.TariffName || '';
            this.ServiceId = contact.ServiceId || '';
            this.IsPathology = contact.IsPathology || '';
            this.IsRadiology = contact.IsRadiology || '';
            this.IsActive = contact.IsActive || '';
            this.IsEditable = contact.IsEditable || '';
        }
    }
}
