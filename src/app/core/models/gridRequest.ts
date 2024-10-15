export class gridRequest {
    first: number = 0;
    rows: number = 10;
    sortField: string = "";
    sortOrder: number = 0;
    filters: gridFilter[] = [];
    columns: [] = [];
    exportType: gridResponseType = gridResponseType.JSON;
}
export class gridFilter {
    fieldName: string = "";
    fieldValue: string = "";
    opType: OperatorComparer = OperatorComparer.Equals;
}
export enum gridResponseType {
    JSON = 1, Excel = 2, Pdf = 3
}
export class gridModel {
    headers: string[] = [];
    columnsList: any[] = [];
    apiUrl: string = "";
    sortField: string = "";
    sortOrder: number = 0;
    filters: gridFilter[] = [];
    row: number = 10;
    mode?: string = "";
    apiType?: string = "Master";
    responseTag?: string = "";
}
export enum OperatorComparer {
    Contains='Contains',
    StartsWith='StartsWith',
    EndsWith='EndsWith',
    Equals='Equals',
    GreaterThan='GreaterThan',
    GreaterThanOrEqual='GreaterThanOrEqual',
    LessThan='LessThan',
    LessThanOrEqual='LessThanOrEqual',
    NotEqual='NotEqual',
    InClause='InClause',
    DateRange='DateRange'
}