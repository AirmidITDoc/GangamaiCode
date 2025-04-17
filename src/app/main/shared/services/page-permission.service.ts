// crypto.service.ts
import { Injectable } from '@angular/core';
import { EncryptionService } from 'app/core/services/encryption.service';

@Injectable({ providedIn: 'root' }) // Available globally
export class PagePermissionService {
    constructor(private encrService: EncryptionService) { }
    getList(): any[] {
        var permission = JSON.parse(localStorage.getItem("currentUser")).permissions;
        var permissionString = this.encrService.decrypt(permission);
        return JSON.parse(permissionString);
    }
    getPermission(pageCode: string, permission: permissionType): boolean {
        var page = this.getList().find(x => x.PageCode == pageCode) as any[];
        if (permission == permissionType.Add)
            return page["IsAdd"] ?? false;
        else if (permission == permissionType.Edit)
            return page["IsEdit"] ?? false;
        else if (permission == permissionType.Delete)
            return page["IsDelete"] ?? false;
        else if (permission == permissionType.View)
            return page["IsView"] ?? false;
        else if (permission == permissionType.Export)
            return page["IsExport"] ?? false;
    }
}
export enum permissionType {
    Add = 1, Edit = 2, Delete = 3, View = 4, Export = 5
}