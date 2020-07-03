import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService, ResourcesManagerService, ServicesManagerService } from '@perun-web-apps/perun/openapi';
import { MembersService } from '@perun-web-apps/perun/services';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { TranslateService } from '@ngx-translate/core';
let FacilityServiceConfigComponent = class FacilityServiceConfigComponent {
    constructor(route, facilityManager, resourceManager, serviceManager, membersManager, namePipe, translate) {
        this.route = route;
        this.facilityManager = facilityManager;
        this.resourceManager = resourceManager;
        this.serviceManager = serviceManager;
        this.membersManager = membersManager;
        this.namePipe = namePipe;
        this.translate = translate;
        this.selectedService = 'NOT_SELECTED';
        this.attrNames = [];
        this.serviceField = new FormControl();
        this.resourceField = new FormControl();
        this.groupField = new FormControl();
        this.memberField = new FormControl();
        this.translate.get('FACILITY_DETAIL.SERVICE_CONFIG.ALL').subscribe(value => this.serviceAllTranslation = value);
        this.translate.get('FACILITY_DETAIL.SERVICE_CONFIG.NOT_SELECTED').subscribe(value => this.serviceNotSelectedTranslation = value);
    }
    ngOnInit() {
        this.route.parent.params.subscribe(parentParams => {
            const facilityId = parentParams['facilityId'];
            this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
                this.facilityManager.getAssignedResourcesForFacility(facility.id)
                    .subscribe(resources => this.resources = resources);
                this.serviceManager.getAssignedServices(facility.id).subscribe(services => this.services = services);
            });
        });
        this.filteredServices = this.serviceField.valueChanges
            .pipe(startWith(''), map(value => this._filterServices(value)));
        this.filteredResources = this.resourceField.valueChanges
            .pipe(startWith(''), map(value => this._filterResources(value)));
        this.filteredGroups = this.groupField.valueChanges
            .pipe(startWith(''), map(value => this._filterGroups(value)));
        this.filteredMembers = this.memberField.valueChanges
            .pipe(startWith(''), map(value => this._filterMembers(value)));
    }
    onSelectedService(s) {
        this.selectedService = s;
    }
    onSelectedResource(r) {
        this.selectedResource = r;
        if (this.selectedResource !== undefined) {
            this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(groups => this.groups = groups);
            this.selectedGroup = undefined;
            this.selectedMember = undefined;
        }
        else {
            this.groups = undefined;
        }
    }
    onOfferAllServices(event) {
        if (!event.checked) {
            this.serviceManager.getAssignedServices(this.facility.id).subscribe(services => this.services = services);
        }
    }
    onSelectedGroup(g) {
        this.selectedGroup = g;
        if (this.selectedGroup !== undefined) {
            this.membersManager.getCompleteRichMembersForGroup(this.selectedGroup.id, this.attrNames).subscribe(members => this.members = members);
            this.selectedMember = undefined;
        }
        else {
            this.members = undefined;
        }
    }
    onSelectedMember(m) {
        this.selectedMember = m;
    }
    _filterServices(value) {
        const filterValue = value.toString().toLowerCase();
        return this.services.filter(service => service.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
    }
    _filterResources(value) {
        const filterValue = value.toString().toLowerCase();
        return this.resources.filter(resource => resource.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
    }
    _filterGroups(value) {
        const filterValue = value.toString().toLowerCase();
        return this.groups.filter(group => group.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
    }
    _filterMembers(value) {
        const filterValue = value.toString().toLowerCase();
        return this.members.filter(member => this.namePipe.transform(member.user).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
    }
    serviceDisplayFn(service) {
        if (service !== null) {
            if (service === 'ALL') {
                return this.serviceAllTranslation;
            }
            if (service === 'NOT_SELECTED') {
                return this.serviceNotSelectedTranslation;
            }
            return service.name;
        }
    }
    resourceDisplayFn(resource) {
        if (resource !== null) {
            return resource.name;
        }
    }
    groupDisplayFn(group) {
        if (group !== null) {
            return group.name;
        }
    }
    memberDisplayFn(member) {
        if (member !== null) {
            return this.namePipe.transform(member.user);
        }
    }
    updatedSerVal(e) {
        if (e.target.value === '') {
            this.selectedService = "NOT_SELECTED";
        }
    }
    updatedResVal(e) {
        if (e.target.value === '') {
            this.groups = undefined;
            this.members = undefined;
        }
    }
    updatedGroupVal(e) {
        if (e.target.value === '') {
            this.members = undefined;
        }
    }
    updatedMemVal(e) {
        if (e.target.value === '') {
        }
    }
};
FacilityServiceConfigComponent = __decorate([
    Component({
        selector: 'app-facility-service-config',
        templateUrl: './facility-service-config.component.html',
        styleUrls: ['./facility-service-config.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        FacilitiesManagerService,
        ResourcesManagerService,
        ServicesManagerService,
        MembersService,
        UserFullNamePipe,
        TranslateService])
], FacilityServiceConfigComponent);
export { FacilityServiceConfigComponent };
//# sourceMappingURL=facility-service-config.component.js.map