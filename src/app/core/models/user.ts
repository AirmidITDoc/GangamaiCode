export class User {
    user: LoginUser;
    token: string;
    expires: string;
}

export class LoginUser {
    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;

    UserId : number;
    FirstName: string; 
    LastName: string;
    UserName: string;
    IsActive :boolean;
    RoleId : number;
    storeId : number;
    IsDoctorType :boolean;
    DoctorID : number;
    IsPOVerify :boolean;
    IsGRNVerify :boolean;
    IsCollection :boolean;
    IsBedStatus :boolean;
    IsCurrentStk :boolean;
    IsPatientInfo :boolean;
    IsDateInterval :boolean;
    IsDateIntervalDays :number;
    MailId :string; 
    MailDomain :string;
    LoginStatus :boolean; 
    AddChargeIsDelete :boolean;
    IsIndentVerify :boolean;
    IsPOInchargeVerify :boolean;
    IsRefDocEditOpt :boolean;
    IsInchIndVfy :boolean;
    IsPharBalClearnace :boolean;
    pharExtOpt :number;
    pharOPOpt :number;
    pharIPOpt :number;
}
