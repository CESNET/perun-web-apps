var ApiModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';
import { AttributesManagerService } from './api/attributesManager.service';
import { AuditMessagesManagerService } from './api/auditMessagesManager.service';
import { AuthzResolverService } from './api/authzResolver.service';
import { CabinetManagerService } from './api/cabinetManager.service';
import { DatabaseManagerService } from './api/databaseManager.service';
import { ExtSourcesManagerService } from './api/extSourcesManager.service';
import { FacilitiesManagerService } from './api/facilitiesManager.service';
import { GroupsManagerService } from './api/groupsManager.service';
import { MembersManagerService } from './api/membersManager.service';
import { OwnersManagerService } from './api/ownersManager.service';
import { RTMessagesManagerService } from './api/rTMessagesManager.service';
import { RegistrarManagerService } from './api/registrarManager.service';
import { ResourcesManagerService } from './api/resourcesManager.service';
import { ServicesManagerService } from './api/servicesManager.service';
import { TasksManagerService } from './api/tasksManager.service';
import { UsersManagerService } from './api/usersManager.service';
import { UtilsService } from './api/utils.service';
import { VosManagerService } from './api/vosManager.service';
let ApiModule = ApiModule_1 = class ApiModule {
    static forRoot(configurationFactory) {
        return {
            ngModule: ApiModule_1,
            providers: [{ provide: Configuration, useFactory: configurationFactory }]
        };
    }
    constructor(parentModule, http) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
                'See also https://github.com/angular/angular/issues/20575');
        }
    }
};
ApiModule = ApiModule_1 = __decorate([
    NgModule({
        imports: [],
        declarations: [],
        exports: [],
        providers: [
            AttributesManagerService,
            AuditMessagesManagerService,
            AuthzResolverService,
            CabinetManagerService,
            DatabaseManagerService,
            ExtSourcesManagerService,
            FacilitiesManagerService,
            GroupsManagerService,
            MembersManagerService,
            OwnersManagerService,
            RTMessagesManagerService,
            RegistrarManagerService,
            ResourcesManagerService,
            ServicesManagerService,
            TasksManagerService,
            UsersManagerService,
            UtilsService,
            VosManagerService
        ]
    }),
    __param(0, Optional()), __param(0, SkipSelf()),
    __param(1, Optional()),
    __metadata("design:paramtypes", [ApiModule,
        HttpClient])
], ApiModule);
export { ApiModule };
//# sourceMappingURL=api.module.js.map