"use strict";(self.webpackChunkadmin_gui=self.webpackChunkadmin_gui||[]).push([[109],{15935:(y,S,n)=>{n.d(S,{D:()=>k});var m=n(95017),h=n(96308),l=n(30671),u=n(9244),f=n(20206),e=n(94650),g=n(36895),C=n(56709),p=n(98380),A=n(18750),c=n(89383),d=n(9185),i=n(8231),s=n(14849),D=n(37677);function x(t,o){if(1&t){const a=e.EpF();e.TgZ(0,"th",16)(1,"mat-checkbox",17),e.NdJ("change",function(_){e.CHM(a);const E=e.oxw(2);return e.KtG(_?E.masterToggle():null)}),e.ALo(2,"translate"),e.ALo(3,"masterCheckboxLabel"),e.qZA()()}if(2&t){const a=e.oxw().ngIf,r=e.oxw();e.xp6(1),e.Q6J("aria-label",e.lcZ(2,3,e.lcZ(3,5,a.all)))("checked",r.selection.hasValue()&&a.all)("indeterminate",r.selection.hasValue()&&!a.all)}}const O=function(t){return{name:t}};function T(t,o){if(1&t){const a=e.EpF();e.TgZ(0,"td",18)(1,"mat-checkbox",19),e.NdJ("change",function(_){const K=e.CHM(a).$implicit,F=e.oxw(2);return e.KtG(_?F.selection.toggle(K):null)})("click",function(_){return _.stopPropagation()}),e.ALo(2,"translate"),e.ALo(3,"checkboxLabel"),e.qZA()()}if(2&t){const a=o.$implicit,r=e.oxw(2);e.xp6(1),e.Q6J("aria-label",e.xi3(2,2,e.lcZ(3,5,r.selection.isSelected(a)),e.VKq(7,O,a.name)))("checked",r.selection.isSelected(a))}}function L(t,o){1&t&&(e.ynx(0,13),e.YNc(1,x,4,7,"th",14),e.YNc(2,T,4,9,"td",15),e.BQk())}function b(t,o){1&t&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&t&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.ID")," "))}function M(t,o){if(1&t&&(e.TgZ(0,"td",21),e._uU(1),e.qZA()),2&t){const a=o.$implicit;e.xp6(1),e.Oqu(a.id)}}function R(t,o){1&t&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&t&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NAME")," "))}function v(t,o){if(1&t&&(e.TgZ(0,"td",22),e.ALo(1,"lowercase"),e._uU(2),e.qZA()),2&t){const a=o.$implicit;e.Q2q("data-cy","",e.lcZ(1,2,a.name),"-name-td"),e.xp6(2),e.hij(" ",a.name," ")}}function I(t,o){1&t&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&t&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.TYPE")," "))}function P(t,o){if(1&t&&(e.TgZ(0,"td",22),e._uU(1),e.ALo(2,"extSourceType"),e.qZA()),2&t){const a=o.$implicit;e.xp6(1),e.Oqu(e.lcZ(2,1,a.type))}}function U(t,o){1&t&&e._UZ(0,"tr",23)}function N(t,o){1&t&&e._UZ(0,"tr",24)}function Z(t,o){1&t&&(e.TgZ(0,"perun-web-apps-alert",25),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&t&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_EXT_SOURCES"),"\n"))}function w(t,o){1&t&&(e.TgZ(0,"perun-web-apps-alert",25),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&t&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_FILTER_RESULTS"),"\n"))}const B=function(t){return{all:t}};let k=(()=>{class t{constructor(a,r){this.authResolver=a,this.tableCheckbox=r,this.selection=new m.Ov,this.filterValue="",this.displayedColumns=["select","id","name","type"],this.exporting=!1,this.pageSizeOptions=u.f7}set matSort(a){this.sort=a,this.setDataSource()}static getDataForColumn(a,r){switch(r){case"id":return a.id.toString();case"type":return a.type.substring(40);case"name":return a.name;default:return""}}ngAfterViewInit(){this.setDataSource()}ngOnChanges(){this.authResolver.isPerunAdminOrObserver()||(this.displayedColumns=this.displayedColumns.filter(a=>"id"!==a)),this.dataSource=new l.by(this.extSources),this.setDataSource()}exportAllData(a){(0,u.O6)((0,u.Xn)(this.dataSource.filteredData,this.displayedColumns,t.getDataForColumn),a)}exportDisplayedData(a){const r=this.dataSource.paginator.pageIndex*this.dataSource.paginator.pageSize,_=r+this.dataSource.paginator.pageSize;(0,u.O6)((0,u.Xn)(this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).slice(r,_),this.displayedColumns,t.getDataForColumn),a)}setDataSource(){this.dataSource&&(this.dataSource.filterPredicate=(a,r)=>(0,u.Sd)(a,r,this.displayedColumns,t.getDataForColumn),this.dataSource.sortData=(a,r)=>(0,u.pR)(a,r,t.getDataForColumn),this.dataSource.sort=this.sort,this.dataSource.paginator=this.child.paginator,this.dataSource.filter=this.filterValue)}isAllSelected(){return this.tableCheckbox.isAllSelected(this.selection.selected.length,this.dataSource)}masterToggle(){this.tableCheckbox.masterToggle(this.isAllSelected(),this.selection,this.filterValue,this.dataSource,this.sort,this.child.paginator.pageSize,this.child.paginator.pageIndex,!1)}}return t.\u0275fac=function(a){return new(a||t)(e.Y36(f.x4),e.Y36(f.UA))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-ext-sources-list"]],viewQuery:function(a,r){if(1&a&&(e.Gf(u.l9,7),e.Gf(h.YE,7)),2&a){let _;e.iGM(_=e.CRH())&&(r.child=_.first),e.iGM(_=e.CRH())&&(r.matSort=_.first)}},inputs:{extSources:"extSources",selection:"selection",filterValue:"filterValue",displayedColumns:"displayedColumns",tableId:"tableId"},features:[e.TTD],decls:18,vars:15,consts:[[1,"card","mt-2",3,"hidden"],[3,"pageSizeOptions","dataLength","tableId","exportDisplayedData","exportAllData"],["mat-table","","matSort","","matSortActive","id","matSortDirection","asc","matSortDisableClear","",1,"w-100",3,"dataSource"],["matColumnDef","select",4,"ngIf"],["matColumnDef","id"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["class","static-column-size","mat-cell","",4,"matCellDef"],["matColumnDef","name"],["mat-cell","",4,"matCellDef"],["matColumnDef","type"],["mat-header-row","",4,"matHeaderRowDef"],["class","dark-hover-list-item","mat-row","",4,"matRowDef","matRowDefColumns"],["alert_type","warn",4,"ngIf"],["matColumnDef","select"],["class","align-checkbox","mat-header-cell","",4,"matHeaderCellDef"],["class","static-column-size align-checkbox","mat-cell","",4,"matCellDef"],["mat-header-cell","",1,"align-checkbox"],["color","primary",3,"aria-label","checked","indeterminate","change"],["mat-cell","",1,"static-column-size","align-checkbox"],["color","primary",3,"aria-label","checked","change","click"],["mat-header-cell","","mat-sort-header",""],["mat-cell","",1,"static-column-size"],["mat-cell",""],["mat-header-row",""],["mat-row","",1,"dark-hover-list-item"],["alert_type","warn"]],template:function(a,r){1&a&&(e.TgZ(0,"div",0)(1,"perun-web-apps-table-wrapper",1),e.NdJ("exportDisplayedData",function(E){return r.exportDisplayedData(E)})("exportAllData",function(E){return r.exportAllData(E)}),e.TgZ(2,"table",2),e.YNc(3,L,3,0,"ng-container",3),e.ALo(4,"isAllSelected"),e.ynx(5,4),e.YNc(6,b,3,3,"th",5),e.YNc(7,M,2,1,"td",6),e.BQk(),e.ynx(8,7),e.YNc(9,R,3,3,"th",5),e.YNc(10,v,3,4,"td",8),e.BQk(),e.ynx(11,9),e.YNc(12,I,3,3,"th",5),e.YNc(13,P,3,3,"td",8),e.BQk(),e.YNc(14,U,1,0,"tr",10),e.YNc(15,N,1,0,"tr",11),e.qZA()()(),e.YNc(16,Z,3,3,"perun-web-apps-alert",12),e.YNc(17,w,3,3,"perun-web-apps-alert",12)),2&a&&(e.Q6J("hidden",0===r.extSources.length||0===r.dataSource.filteredData.length),e.xp6(1),e.Q6J("pageSizeOptions",r.pageSizeOptions)("dataLength",r.dataSource.filteredData.length)("tableId",r.tableId),e.xp6(1),e.Q6J("dataSource",r.dataSource),e.xp6(1),e.Q6J("ngIf",e.VKq(13,B,e.xi3(4,10,r.dataSource,r.selection.selected.length))),e.xp6(11),e.Q6J("matHeaderRowDef",r.displayedColumns),e.xp6(1),e.Q6J("matRowDefColumns",r.displayedColumns),e.xp6(1),e.Q6J("ngIf",0===r.extSources.length),e.xp6(1),e.Q6J("ngIf",0===r.dataSource.filteredData.length&&0!==r.extSources.length))},dependencies:[g.O5,h.YE,h.nU,l.BZ,l.fO,l.as,l.w1,l.Dz,l.nj,l.ge,l.ev,l.XQ,l.Gk,C.oG,p.w,A.l,g.i8,c.X$,d.I,i.G,s.r,D.A]}),t})()},71992:(y,S,n)=>{n.d(S,{a:()=>C});var m=n(20206),h=n(13381),l=n(54004),u=n(70262),f=n(39646),e=n(94650),g=n(82761);let C=(()=>{class p{constructor(c,d,i,s,D,x,O,T){this.authResolver=c,this.routePolicyService=d,this.router=i,this.notificator=s,this.apiRequest=D,this.memberManager=x,this.groupManager=O,this.resourceManager=T}static getBeanName(c){switch(c){case"organizations":return"Vo";case"groups":return"Group";case"facilities":case"services":return"Facility";case"resources":return"Resource";case"members":return"Member";default:return""}}static parseUrl(c){const d=c.slice(1).split("/").reverse(),i={key:"",entity:{id:-1,beanName:""}};for(const s of d){if(Number(s)){if(-1===i.entity.id){i.entity.id=Number(s);continue}"services-status-"===i.key&&(i.entity.id=Number(s));break}i.key=s.concat("-",i.key)}return i.key=i.key.slice(0,i.key.length-1),i.entity.beanName=p.getBeanName(i.key.split("-")[0]),i}canActivateChild(c,d){if(this.authResolver.isPerunAdminOrObserver())return!0;const i=p.parseUrl(d.url);return i.key.startsWith("members")?(this.apiRequest.dontHandleErrorForNext(),this.memberManager.getMemberById(i.entity.id).pipe((0,l.U)(s=>(i.entity.userId=s.userId,i.entity.voId=s.voId,this.finalizeCanActivateChild(i))),(0,u.K)(s=>this.errorRedirectUrl(s)))):i.key.startsWith("groups")?(this.apiRequest.dontHandleErrorForNext(),this.groupManager.getGroupById(i.entity.id).pipe((0,l.U)(s=>(i.entity.voId=s.voId,this.finalizeCanActivateChild(i))),(0,u.K)(s=>this.errorRedirectUrl(s)))):i.key.startsWith("resources")?(this.apiRequest.dontHandleErrorForNext(),this.resourceManager.getResourceById(i.entity.id).pipe((0,l.U)(s=>(i.entity.facilityId=s.facilityId,i.entity.voId=s.voId,this.finalizeCanActivateChild(i))),(0,u.K)(s=>this.errorRedirectUrl(s)))):this.finalizeCanActivateChild(i)}finalizeCanActivateChild(c){return!!this.routePolicyService.canNavigate(c.key,c.entity)||(this.notificator.showRouteError(),this.router.parseUrl("/notAuthorized"))}errorRedirectUrl(c){if("PrivilegeException"===c.name)return this.notificator.showRouteError(),(0,f.of)(this.router.parseUrl("/notAuthorized"))}}return p.\u0275fac=function(c){return new(c||p)(e.LFG(m.x4),e.LFG(m.Ip),e.LFG(g.F0),e.LFG(m.V6),e.LFG(m.F5),e.LFG(h.uq),e.LFG(h.ff),e.LFG(h.xk))},p.\u0275prov=e.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"}),p})()}}]);