"use strict";(self.webpackChunkadmin_gui=self.webpackChunkadmin_gui||[]).push([[644],{72488:(y,C,s)=>{s.d(C,{D:()=>K});var E=s(78337),m=s(13566),c=s(25313),u=s(64124),g=s(73615),t=s(65879),S=s(96814),D=s(75986),d=s(11186),L=s(77983),_=s(89515),p=s(93035),r=s(32596),o=s(8355),x=s(33642);function O(e,l){if(1&e){const a=t.EpF();t.TgZ(0,"th",16)(1,"mat-checkbox",17),t.NdJ("change",function(n){t.CHM(a);const h=t.oxw(2);return t.KtG(n?h.masterToggle():null)}),t.ALo(2,"translate"),t.ALo(3,"masterCheckboxLabel"),t.qZA()()}if(2&e){const a=t.oxw().ngIf,i=t.oxw();t.xp6(1),t.Q6J("aria-label",t.lcZ(2,3,t.lcZ(3,5,a.all)))("checked",i.selection.hasValue()&&a.all)("indeterminate",i.selection.hasValue()&&!a.all)}}const T=function(e){return{name:e}};function A(e,l){if(1&e){const a=t.EpF();t.TgZ(0,"td",18)(1,"mat-checkbox",19),t.NdJ("change",function(n){const f=t.CHM(a).$implicit,F=t.oxw(2);return t.KtG(n?F.selection.toggle(f):null)})("click",function(n){return n.stopPropagation()}),t.ALo(2,"translate"),t.ALo(3,"checkboxLabel"),t.qZA()()}if(2&e){const a=l.$implicit,i=t.oxw(2);t.xp6(1),t.Q6J("aria-label",t.xi3(2,2,t.lcZ(3,5,i.selection.isSelected(a)),t.VKq(7,T,a.name)))("checked",i.selection.isSelected(a))}}function b(e,l){1&e&&(t.ynx(0,13),t.YNc(1,O,4,7,"th",14),t.YNc(2,A,4,9,"td",15),t.BQk())}function M(e,l){1&e&&(t.TgZ(0,"th",20),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&e&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.ID")," "))}function I(e,l){if(1&e&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&e){const a=l.$implicit;t.xp6(1),t.Oqu(a.id)}}function P(e,l){1&e&&(t.TgZ(0,"th",20),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&e&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NAME")," "))}function R(e,l){if(1&e&&(t.TgZ(0,"td",22),t.ALo(1,"lowercase"),t._uU(2),t.qZA()),2&e){const a=l.$implicit;t.Q2q("data-cy","",t.lcZ(1,2,a.name),"-name-td"),t.xp6(2),t.hij(" ",a.name," ")}}function v(e,l){1&e&&(t.TgZ(0,"th",20),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&e&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.TYPE")," "))}function U(e,l){if(1&e&&(t.TgZ(0,"td",22),t._uU(1),t.ALo(2,"extSourceType"),t.qZA()),2&e){const a=l.$implicit;t.xp6(1),t.Oqu(t.lcZ(2,1,a.type))}}function N(e,l){1&e&&t._UZ(0,"tr",23)}function Z(e,l){1&e&&t._UZ(0,"tr",24)}function w(e,l){1&e&&(t.TgZ(0,"perun-web-apps-alert",25),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&e&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_EXT_SOURCES"),"\n"))}function B(e,l){1&e&&(t.TgZ(0,"perun-web-apps-alert",25),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&e&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_FILTER_RESULTS"),"\n"))}const k=function(e){return{all:e}};let K=(()=>{class e{constructor(a,i){this.authResolver=a,this.tableCheckbox=i,this.selection=new E.Ov,this.filterValue="",this.displayedColumns=["select","id","name","type"],this.exporting=!1,this.pageSizeOptions=u.f7}set matSort(a){this.sort=a,this.setDataSource()}static getDataForColumn(a,i){switch(i){case"id":return a.id.toString();case"type":return a.type.substring(40);case"name":return a.name;default:return""}}ngAfterViewInit(){this.setDataSource()}ngOnChanges(){this.authResolver.isPerunAdminOrObserver()||(this.displayedColumns=this.displayedColumns.filter(a=>"id"!==a)),this.dataSource=new c.by(this.extSources),this.setDataSource()}exportAllData(a){(0,u.O6)((0,u.Xn)(this.dataSource.filteredData,this.displayedColumns,e.getDataForColumn),a)}exportDisplayedData(a){const i=this.dataSource.paginator.pageIndex*this.dataSource.paginator.pageSize,n=i+this.dataSource.paginator.pageSize;(0,u.O6)((0,u.Xn)(this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).slice(i,n),this.displayedColumns,e.getDataForColumn),a)}setDataSource(){this.dataSource&&(this.dataSource.filterPredicate=(a,i)=>(0,u.Sd)(a,i,this.displayedColumns,e.getDataForColumn),this.dataSource.sortData=(a,i)=>(0,u.pR)(a,i,e.getDataForColumn),this.dataSource.sort=this.sort,this.dataSource.paginator=this.child.paginator,this.dataSource.filter=this.filterValue)}isAllSelected(){return this.tableCheckbox.isAllSelected(this.selection.selected.length,this.dataSource)}masterToggle(){this.tableCheckbox.masterToggle(this.isAllSelected(),this.selection,this.filterValue,this.dataSource,this.sort,this.child.paginator.pageSize,this.child.paginator.pageIndex,!1)}static#t=this.\u0275fac=function(i){return new(i||e)(t.Y36(g.x4),t.Y36(g.UA))};static#e=this.\u0275cmp=t.Xpm({type:e,selectors:[["app-ext-sources-list"]],viewQuery:function(i,n){if(1&i&&(t.Gf(u.l9,7),t.Gf(m.YE,7)),2&i){let h;t.iGM(h=t.CRH())&&(n.child=h.first),t.iGM(h=t.CRH())&&(n.matSort=h.first)}},inputs:{extSources:"extSources",selection:"selection",filterValue:"filterValue",displayedColumns:"displayedColumns",tableId:"tableId"},features:[t.TTD],decls:18,vars:15,consts:[[1,"card","mt-2",3,"hidden"],[3,"pageSizeOptions","dataLength","tableId","exportDisplayedData","exportAllData"],["mat-table","","matSort","","matSortActive","id","matSortDirection","asc","matSortDisableClear","",1,"w-100",3,"dataSource"],["matColumnDef","select",4,"ngIf"],["matColumnDef","id"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["class","static-column-size","mat-cell","",4,"matCellDef"],["matColumnDef","name"],["mat-cell","",4,"matCellDef"],["matColumnDef","type"],["mat-header-row","",4,"matHeaderRowDef"],["class","dark-hover-list-item","mat-row","",4,"matRowDef","matRowDefColumns"],["alert_type","warn",4,"ngIf"],["matColumnDef","select"],["class","align-checkbox","mat-header-cell","",4,"matHeaderCellDef"],["class","static-column-size align-checkbox","mat-cell","",4,"matCellDef"],["mat-header-cell","",1,"align-checkbox"],["color","primary",3,"aria-label","checked","indeterminate","change"],["mat-cell","",1,"static-column-size","align-checkbox"],["color","primary",3,"aria-label","checked","change","click"],["mat-header-cell","","mat-sort-header",""],["mat-cell","",1,"static-column-size"],["mat-cell",""],["mat-header-row",""],["mat-row","",1,"dark-hover-list-item"],["alert_type","warn"]],template:function(i,n){1&i&&(t.TgZ(0,"div",0)(1,"perun-web-apps-table-wrapper",1),t.NdJ("exportDisplayedData",function(f){return n.exportDisplayedData(f)})("exportAllData",function(f){return n.exportAllData(f)}),t.TgZ(2,"table",2),t.YNc(3,b,3,0,"ng-container",3),t.ALo(4,"isAllSelected"),t.ynx(5,4),t.YNc(6,M,3,3,"th",5),t.YNc(7,I,2,1,"td",6),t.BQk(),t.ynx(8,7),t.YNc(9,P,3,3,"th",5),t.YNc(10,R,3,4,"td",8),t.BQk(),t.ynx(11,9),t.YNc(12,v,3,3,"th",5),t.YNc(13,U,3,3,"td",8),t.BQk(),t.YNc(14,N,1,0,"tr",10),t.YNc(15,Z,1,0,"tr",11),t.qZA()()(),t.YNc(16,w,3,3,"perun-web-apps-alert",12),t.YNc(17,B,3,3,"perun-web-apps-alert",12)),2&i&&(t.Q6J("hidden",0===n.extSources.length||0===n.dataSource.filteredData.length),t.xp6(1),t.Q6J("pageSizeOptions",n.pageSizeOptions)("dataLength",n.dataSource.filteredData.length)("tableId",n.tableId),t.xp6(1),t.Q6J("dataSource",n.dataSource),t.xp6(1),t.Q6J("ngIf",t.VKq(13,k,t.xi3(4,10,n.dataSource,n.selection.selected.length))),t.xp6(11),t.Q6J("matHeaderRowDef",n.displayedColumns),t.xp6(1),t.Q6J("matRowDefColumns",n.displayedColumns),t.xp6(1),t.Q6J("ngIf",0===n.extSources.length),t.xp6(1),t.Q6J("ngIf",0===n.dataSource.filteredData.length&&0!==n.extSources.length))},dependencies:[S.O5,m.YE,m.nU,c.BZ,c.fO,c.as,c.w1,c.Dz,c.nj,c.ge,c.ev,c.XQ,c.Gk,D.oG,d.w,L.l,S.i8,_.X$,p.I,r.G,o.r,x.A]})}return e})()},91940:(y,C,s)=>{s.d(C,{a:()=>D});var E=s(73615),m=s(27618),c=s(37398),u=s(26306),g=s(22096),t=s(65879),S=s(44112);let D=(()=>{class d{constructor(_,p,r,o,x,O,T,A){this.authResolver=_,this.routePolicyService=p,this.router=r,this.notificator=o,this.apiRequest=x,this.memberManager=O,this.groupManager=T,this.resourceManager=A}static getBeanName(_){switch(_){case"organizations":return"Vo";case"groups":return"Group";case"facilities":case"services":return"Facility";case"resources":return"Resource";case"members":return"Member";default:return""}}static parseUrl(_){const p=_.slice(1).split("/").reverse(),r={key:"",entity:{id:-1,beanName:""}};for(const o of p){if(Number(o)){if(-1===r.entity.id){r.entity.id=Number(o);continue}"services-status-"===r.key&&(r.entity.id=Number(o));break}r.key=o.concat("-",r.key)}return r.key=r.key.slice(0,r.key.length-1),r.entity.beanName=d.getBeanName(r.key.split("-")[0]),r}canActivateChild(_,p){if(this.authResolver.isPerunAdminOrObserver())return!0;const r=d.parseUrl(p.url);return r.key.startsWith("members")?(this.apiRequest.dontHandleErrorForNext(),this.memberManager.getMemberById(r.entity.id).pipe((0,c.U)(o=>(r.entity.userId=o.userId,r.entity.voId=o.voId,this.finalizeCanActivateChild(r))),(0,u.K)(o=>this.errorRedirectUrl(o)))):r.key.startsWith("groups")?(this.apiRequest.dontHandleErrorForNext(),this.groupManager.getGroupById(r.entity.id).pipe((0,c.U)(o=>(r.entity.voId=o.voId,this.finalizeCanActivateChild(r))),(0,u.K)(o=>this.errorRedirectUrl(o)))):r.key.startsWith("resources")?(this.apiRequest.dontHandleErrorForNext(),this.resourceManager.getResourceById(r.entity.id).pipe((0,c.U)(o=>(r.entity.facilityId=o.facilityId,r.entity.voId=o.voId,this.finalizeCanActivateChild(r))),(0,u.K)(o=>this.errorRedirectUrl(o)))):this.finalizeCanActivateChild(r)}finalizeCanActivateChild(_){return!!this.routePolicyService.canNavigate(_.key,_.entity)||(this.notificator.showRouteError(),this.router.parseUrl("/notAuthorized"))}errorRedirectUrl(_){if("PrivilegeException"===_.name)return this.notificator.showRouteError(),(0,g.of)(this.router.parseUrl("/notAuthorized"))}static#t=this.\u0275fac=function(p){return new(p||d)(t.LFG(E.x4),t.LFG(E.Ip),t.LFG(S.F0),t.LFG(E.V6),t.LFG(E.F5),t.LFG(m.uq),t.LFG(m.ff),t.LFG(m.xk))};static#e=this.\u0275prov=t.Yz7({token:d,factory:d.\u0275fac,providedIn:"root"})}return d})()}}]);