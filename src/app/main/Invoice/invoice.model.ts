
export class ServiceMaster {
    ClientName:string;
    Address1:string;
    Address2:string;
    ContactDetails:string;
    PAN:string;
    State:string;
    GSTNo:string;
    PlaceOfSupply:string;
    PlacementLocation:string;
    LockingPeriod:number;
    Notes:string;
    IsDeleted:boolean;
    UpdatedBy:string;
    UpdatedOn:Date;
    SubmitedBy:string;
    SubmitedOn:string;



    

    /**
     * Constructor
     *
     * @param invoice
     */
    constructor(invoice) {
        {
           this. ClientName= invoice.ClientName || '';
           this.Address1= invoice.Address1 || '';
           this. Address2= invoice.Address2 || '';
           this. ContactDetails= invoice.ContactDetails || '';
           this.PAN = invoice.PAN || '';
           this. State= invoice.State || '';
           this. GSTNo  = invoice.GSTNo|| '';
           this. PlaceOfSupply = invoice.PlaceOfSupply|| '';
           this. PlacementLocation = invoice.PlacementLocation|| '';
           this. LockingPeriod = invoice.LockingPeriod|| '';
           this. Notes= invoice.Notes || '';
           this. IsDeleted= invoice.IsDeleted  || '';
           this. UpdatedBy= invoice.UpdatedBy || '';
           this.UpdatedOn= invoice.UpdatedOn || '';
           this.SubmitedBy= invoice.SubmitedBy || '';
           this. SubmitedOn= invoice.SubmitedOn || '';


          
        }
    }
}
