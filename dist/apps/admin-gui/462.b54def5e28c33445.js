"use strict";(self.webpackChunkadmin_gui=self.webpackChunkadmin_gui||[]).push([[462],{15935:(T,v,n)=>{n.d(v,{D:()=>K});var f=n(95017),E=n(96308),c=n(30671),l=n(9244),d=n(69723),e=n(94650),t=n(36895),D=n(56709),h=n(98380),O=n(18750),p=n(89383),g=n(9185),s=n(8231),_=n(14849),b=n(37677);function C(i,o){if(1&i){const a=e.EpF();e.TgZ(0,"th",16)(1,"mat-checkbox",17),e.NdJ("change",function(u){e.CHM(a);const m=e.oxw(2);return e.KtG(u?m.masterToggle():null)}),e.ALo(2,"translate"),e.ALo(3,"masterCheckboxLabel"),e.qZA()()}if(2&i){const a=e.oxw().ngIf,r=e.oxw();e.xp6(1),e.Q6J("aria-label",e.lcZ(2,3,e.lcZ(3,5,a.all)))("checked",r.selection.hasValue()&&a.all)("indeterminate",r.selection.hasValue()&&!a.all)}}const M=function(i){return{name:i}};function x(i,o){if(1&i){const a=e.EpF();e.TgZ(0,"td",18)(1,"mat-checkbox",19),e.NdJ("change",function(u){const W=e.CHM(a).$implicit,Y=e.oxw(2);return e.KtG(u?Y.selection.toggle(W):null)})("click",function(u){return u.stopPropagation()}),e.ALo(2,"translate"),e.ALo(3,"checkboxLabel"),e.qZA()()}if(2&i){const a=o.$implicit,r=e.oxw(2);e.xp6(1),e.Q6J("aria-label",e.xi3(2,2,e.lcZ(3,5,r.selection.isSelected(a)),e.VKq(7,M,a.name)))("checked",r.selection.isSelected(a))}}function A(i,o){1&i&&(e.ynx(0,13),e.YNc(1,C,4,7,"th",14),e.YNc(2,x,4,9,"td",15),e.BQk())}function S(i,o){1&i&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&i&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.ID")," "))}function I(i,o){if(1&i&&(e.TgZ(0,"td",21),e._uU(1),e.qZA()),2&i){const a=o.$implicit;e.xp6(1),e.Oqu(a.id)}}function P(i,o){1&i&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&i&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NAME")," "))}function L(i,o){if(1&i&&(e.TgZ(0,"td",22),e.ALo(1,"lowercase"),e._uU(2),e.qZA()),2&i){const a=o.$implicit;e.Q2q("data-cy","",e.lcZ(1,2,a.name),"-name-td"),e.xp6(2),e.hij(" ",a.name," ")}}function R(i,o){1&i&&(e.TgZ(0,"th",20),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&i&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.TYPE")," "))}function y(i,o){if(1&i&&(e.TgZ(0,"td",22),e._uU(1),e.ALo(2,"extSourceType"),e.qZA()),2&i){const a=o.$implicit;e.xp6(1),e.Oqu(e.lcZ(2,1,a.type))}}function U(i,o){1&i&&e._UZ(0,"tr",23)}function Z(i,o){1&i&&e._UZ(0,"tr",24)}function w(i,o){1&i&&(e.TgZ(0,"perun-web-apps-alert",25),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&i&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_EXT_SOURCES"),"\n"))}function B(i,o){1&i&&(e.TgZ(0,"perun-web-apps-alert",25),e._uU(1),e.ALo(2,"translate"),e.qZA()),2&i&&(e.xp6(1),e.hij(" ",e.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_FILTER_RESULTS"),"\n"))}const N=function(i){return{all:i}};let K=(()=>{class i{constructor(a,r){this.authResolver=a,this.tableCheckbox=r,this.selection=new f.Ov,this.filterValue="",this.displayedColumns=["select","id","name","type"],this.exporting=!1,this.pageSizeOptions=l.f7}set matSort(a){this.sort=a,this.setDataSource()}static getDataForColumn(a,r){switch(r){case"id":return a.id.toString();case"type":return a.type.substring(40);case"name":return a.name;default:return""}}ngAfterViewInit(){this.setDataSource()}ngOnChanges(){this.authResolver.isPerunAdminOrObserver()||(this.displayedColumns=this.displayedColumns.filter(a=>"id"!==a)),this.dataSource=new c.by(this.extSources),this.setDataSource()}exportAllData(a){(0,l.O6)((0,l.Xn)(this.dataSource.filteredData,this.displayedColumns,i.getDataForColumn),a)}exportDisplayedData(a){const r=this.dataSource.paginator.pageIndex*this.dataSource.paginator.pageSize,u=r+this.dataSource.paginator.pageSize;(0,l.O6)((0,l.Xn)(this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).slice(r,u),this.displayedColumns,i.getDataForColumn),a)}setDataSource(){this.dataSource&&(this.dataSource.filterPredicate=(a,r)=>(0,l.Sd)(a,r,this.displayedColumns,i.getDataForColumn),this.dataSource.sortData=(a,r)=>(0,l.pR)(a,r,i.getDataForColumn),this.dataSource.sort=this.sort,this.dataSource.paginator=this.child.paginator,this.dataSource.filter=this.filterValue)}isAllSelected(){return this.tableCheckbox.isAllSelected(this.selection.selected.length,this.dataSource)}masterToggle(){this.tableCheckbox.masterToggle(this.isAllSelected(),this.selection,this.filterValue,this.dataSource,this.sort,this.child.paginator.pageSize,this.child.paginator.pageIndex,!1)}}return i.\u0275fac=function(a){return new(a||i)(e.Y36(d.x4),e.Y36(d.UA))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-ext-sources-list"]],viewQuery:function(a,r){if(1&a&&(e.Gf(l.l9,7),e.Gf(E.YE,7)),2&a){let u;e.iGM(u=e.CRH())&&(r.child=u.first),e.iGM(u=e.CRH())&&(r.matSort=u.first)}},inputs:{extSources:"extSources",selection:"selection",filterValue:"filterValue",displayedColumns:"displayedColumns",tableId:"tableId"},features:[e.TTD],decls:18,vars:15,consts:[[1,"card","mt-2",3,"hidden"],[3,"pageSizeOptions","dataLength","tableId","exportDisplayedData","exportAllData"],["mat-table","","matSort","","matSortActive","id","matSortDirection","asc","matSortDisableClear","",1,"w-100",3,"dataSource"],["matColumnDef","select",4,"ngIf"],["matColumnDef","id"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["class","static-column-size","mat-cell","",4,"matCellDef"],["matColumnDef","name"],["mat-cell","",4,"matCellDef"],["matColumnDef","type"],["mat-header-row","",4,"matHeaderRowDef"],["class","dark-hover-list-item","mat-row","",4,"matRowDef","matRowDefColumns"],["alert_type","warn",4,"ngIf"],["matColumnDef","select"],["class","align-checkbox","mat-header-cell","",4,"matHeaderCellDef"],["class","static-column-size align-checkbox","mat-cell","",4,"matCellDef"],["mat-header-cell","",1,"align-checkbox"],["color","primary",3,"aria-label","checked","indeterminate","change"],["mat-cell","",1,"static-column-size","align-checkbox"],["color","primary",3,"aria-label","checked","change","click"],["mat-header-cell","","mat-sort-header",""],["mat-cell","",1,"static-column-size"],["mat-cell",""],["mat-header-row",""],["mat-row","",1,"dark-hover-list-item"],["alert_type","warn"]],template:function(a,r){1&a&&(e.TgZ(0,"div",0)(1,"perun-web-apps-table-wrapper",1),e.NdJ("exportDisplayedData",function(m){return r.exportDisplayedData(m)})("exportAllData",function(m){return r.exportAllData(m)}),e.TgZ(2,"table",2),e.YNc(3,A,3,0,"ng-container",3),e.ALo(4,"isAllSelected"),e.ynx(5,4),e.YNc(6,S,3,3,"th",5),e.YNc(7,I,2,1,"td",6),e.BQk(),e.ynx(8,7),e.YNc(9,P,3,3,"th",5),e.YNc(10,L,3,4,"td",8),e.BQk(),e.ynx(11,9),e.YNc(12,R,3,3,"th",5),e.YNc(13,y,3,3,"td",8),e.BQk(),e.YNc(14,U,1,0,"tr",10),e.YNc(15,Z,1,0,"tr",11),e.qZA()()(),e.YNc(16,w,3,3,"perun-web-apps-alert",12),e.YNc(17,B,3,3,"perun-web-apps-alert",12)),2&a&&(e.Q6J("hidden",0===r.extSources.length||0===r.dataSource.filteredData.length),e.xp6(1),e.Q6J("pageSizeOptions",r.pageSizeOptions)("dataLength",r.dataSource.filteredData.length)("tableId",r.tableId),e.xp6(1),e.Q6J("dataSource",r.dataSource),e.xp6(1),e.Q6J("ngIf",e.VKq(13,N,e.xi3(4,10,r.dataSource,r.selection.selected.length))),e.xp6(11),e.Q6J("matHeaderRowDef",r.displayedColumns),e.xp6(1),e.Q6J("matRowDefColumns",r.displayedColumns),e.xp6(1),e.Q6J("ngIf",0===r.extSources.length),e.xp6(1),e.Q6J("ngIf",0===r.dataSource.filteredData.length&&0!==r.extSources.length))},dependencies:[t.O5,E.YE,E.nU,c.BZ,c.fO,c.as,c.w1,c.Dz,c.nj,c.ge,c.ev,c.XQ,c.Gk,D.oG,h.w,O.l,t.i8,p.X$,g.I,s.G,_.r,b.A]}),i})()},60526:(T,v,n)=>{n.d(v,{b:()=>K});var f=n(32105),E=n(9244),c=n(36792),l=n(30671),d=n(69723),e=n(64080),t=n(94650),D=n(65412),h=n(89383),O=n(36895),p=n(97392),g=n(4859),s=n(51572),_=n(73546),b=n(69773),C=n(21757),M=n(38993),x=n(62383),A=n(21330);function S(i,o){1&i&&t._UZ(0,"mat-spinner",4)}function I(i,o){1&i&&t._UZ(0,"th",12)}function P(i,o){if(1&i&&(t.TgZ(0,"td",13),t._uU(1),t.qZA()),2&i){const a=o.$implicit;t.xp6(1),t.hij("",a,":")}}function L(i,o){1&i&&t._UZ(0,"th",12)}function R(i,o){if(1&i){const a=t.EpF();t.TgZ(0,"button",17),t.NdJ("click",function(){t.CHM(a);const u=t.oxw(4);return t.KtG(u.changeStatus())}),t.TgZ(1,"mat-icon"),t._uU(2,"edit"),t.qZA()()}}function y(i,o){if(1&i&&(t.TgZ(0,"div")(1,"i"),t.ALo(2,"memberStatusIconColor"),t._uU(3),t.ALo(4,"memberStatusIcon"),t.qZA(),t.TgZ(5,"b",15),t._uU(6),t.ALo(7,"transformMemberStatus"),t.qZA(),t.YNc(8,R,3,0,"button",16),t.ALo(9,"memberStatusDisabled"),t.qZA()),2&i){const a=t.oxw(3);t.xp6(1),t.Gre("material-icons vert-center mr-1 ",t.lcZ(2,6,a.member),""),t.xp6(2),t.hij(" ",t.lcZ(4,8,a.member.status)," "),t.xp6(3),t.hij(" ",t.lcZ(7,10,a.member.status)," "),t.xp6(2),t.Q6J("ngIf",a.authResolver.isThisVoAdmin(a.vo.id)&&!t.lcZ(9,12,a.member))}}function U(i,o){if(1&i){const a=t.EpF();t.TgZ(0,"button",17),t.NdJ("click",function(){t.CHM(a);const u=t.oxw(4);return t.KtG(u.changeVoExpiration(!1))}),t.TgZ(1,"mat-icon"),t._uU(2,"edit"),t.qZA()()}}function Z(i,o){if(1&i&&(t.TgZ(0,"div")(1,"i",18),t._uU(2),t.ALo(3,"parseDate"),t.qZA(),t.YNc(4,U,3,0,"button",16),t.ALo(5,"memberStatusDisabled"),t.qZA()),2&i){const a=t.oxw(3);t.xp6(2),t.hij(" ",t.lcZ(3,2,a.voExpiration)," "),t.xp6(2),t.Q6J("ngIf",a.authResolver.isThisVoAdmin(a.vo.id)&&!t.lcZ(5,4,a.member))}}function w(i,o){if(1&i&&(t.TgZ(0,"td",14),t.YNc(1,y,10,14,"div",3),t.YNc(2,Z,6,6,"div",3),t.qZA()),2&i){const a=o.$implicit;t.xp6(1),t.Q6J("ngIf","Status"===a),t.xp6(1),t.Q6J("ngIf","Expiration"===a)}}function B(i,o){1&i&&t._UZ(0,"tr",19)}function N(i,o){if(1&i&&(t.TgZ(0,"div")(1,"table",5),t.ynx(2,6),t.YNc(3,I,1,0,"th",7),t.YNc(4,P,2,1,"td",8),t.BQk(),t.ynx(5,9),t.YNc(6,L,1,0,"th",7),t.YNc(7,w,3,2,"td",10),t.BQk(),t.YNc(8,B,1,0,"tr",11),t.qZA()()),2&i){const a=t.oxw();t.xp6(1),t.Q6J("dataSource",a.voMembershipDataSource),t.xp6(7),t.Q6J("matRowDefColumns",a.displayedColumns)}}let K=(()=>{class i{constructor(a,r,u,m,W,Y){this.dialog=a,this.authResolver=r,this.apiRequest=u,this.attributesManager=m,this.translate=W,this.notificator=Y,this.voMembershipDataSource=new l.by,this.voExpiration="",this.displayedColumns=["attName","attValue"]}ngOnChanges(){this.voMembershipDataSource=new l.by(["Status","Expiration"]),this.refreshVoExpiration()}changeStatus(){const a=(0,E.kZ)();a.width="600px",a.data={member:this.member,voId:this.vo.id};const r=this.member.status;this.dialog.open(c.pf,a).afterClosed().subscribe(m=>{m&&(this.member=m,("VALID"===r&&("EXPIRED"===m.status||"DISABLED"===m.status)||"VALID"===m.status)&&this.changeVoExpiration(!0))})}changeVoExpiration(a){const r=(0,E.kZ)();r.width="400px",r.data={voId:this.vo.id,memberId:this.member.id,expirationAttr:this.voExpirationAtt,status:this.member.status,statusChanged:a},this.dialog.open(c.kZ,r).afterClosed().subscribe(m=>{m.success&&(m.member&&(this.member=m.member),this.refreshVoExpiration())})}refreshVoExpiration(){this.loading=!0,this.apiRequest.dontHandleErrorForNext(),this.attributesManager.getMemberAttributeByName(this.member.id,e.r.MEMBER_DEF_EXPIRATION).subscribe(a=>{this.voExpirationAtt=a,this.voExpiration=a.value?a.value:this.translate.instant("MEMBER_DETAIL.OVERVIEW.NEVER_EXPIRES"),this.loading=!1},a=>{"PrivilegeException"!==a.name?this.notificator.showError(a.name):this.voMembershipDataSource=new l.by(["Status"]),this.loading=!1})}}return i.\u0275fac=function(a){return new(a||i)(t.Y36(D.uw),t.Y36(d.x4),t.Y36(d.F5),t.Y36(f.H8),t.Y36(h.sK),t.Y36(d.V6))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-member-overview-membership"]],inputs:{member:"member",vo:"vo"},features:[t.TTD],decls:9,vars:5,consts:[[1,"mat-elevation-z3","membership-card"],[1,"page-subtitle"],["class","mr-auto ml-auto",4,"ngIf"],[4,"ngIf"],[1,"mr-auto","ml-auto"],["mat-table","",1,"ml-auto","mr-auto",3,"dataSource"],["matColumnDef","attName"],["mat-header-cell","",4,"matHeaderCellDef"],["class","font-weight-bold","mat-cell","",4,"matCellDef"],["matColumnDef","attValue"],["class","column-center","mat-cell","",4,"matCellDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["mat-header-cell",""],["mat-cell","",1,"font-weight-bold"],["mat-cell","",1,"column-center"],[1,"vert-top"],["mat-icon-button","",3,"click",4,"ngIf"],["mat-icon-button","",3,"click"],[1,"column-center"],["mat-row",""]],template:function(a,r){1&a&&(t.TgZ(0,"mat-card",0)(1,"mat-card-header")(2,"mat-card-title")(3,"h1",1),t._uU(4),t.ALo(5,"translate"),t.qZA()()(),t.TgZ(6,"mat-card-content"),t.YNc(7,S,1,0,"mat-spinner",2),t.YNc(8,N,9,2,"div",3),t.qZA()()),2&a&&(t.xp6(4),t.hij(" ",t.lcZ(5,3,"MEMBER_DETAIL.OVERVIEW.ORGANIZATION_MEMBERSHIP")," "),t.xp6(3),t.Q6J("ngIf",r.loading),t.xp6(1),t.Q6J("ngIf",!r.loading))},dependencies:[O.O5,p.Hw,g.lW,l.BZ,l.fO,l.w1,l.Dz,l.nj,l.ge,l.ev,l.Gk,s.Ou,_.a8,_.dk,_.dn,_.n5,h.X$,b.u,C.f,M.n,x.M,A.r],styles:[".membership-card[_ngcontent-%COMP%]{max-width:400px}.vert-center[_ngcontent-%COMP%]{vertical-align:middle!important}"]}),i})()},21330:(T,v,n)=>{n.d(v,{r:()=>E});var f=n(94650);let E=(()=>{class c{transform(d,e){return"valid"!==d.toLowerCase()||e&&"valid"!==d.toLowerCase()?d:"ACTIVE"}}return c.\u0275fac=function(d){return new(d||c)},c.\u0275pipe=f.Yjl({name:"transformMemberStatus",type:c,pure:!0}),c})()},71992:(T,v,n)=>{n.d(v,{a:()=>D});var f=n(69723),E=n(32105),c=n(54004),l=n(70262),d=n(39646),e=n(94650),t=n(94364);let D=(()=>{class h{constructor(p,g,s,_,b,C,M,x){this.authResolver=p,this.routePolicyService=g,this.router=s,this.notificator=_,this.apiRequest=b,this.memberManager=C,this.groupManager=M,this.resourceManager=x}static getBeanName(p){switch(p){case"organizations":return"Vo";case"groups":return"Group";case"facilities":case"services":return"Facility";case"resources":return"Resource";case"members":return"Member";default:return""}}static parseUrl(p){const g=p.slice(1).split("/").reverse(),s={key:"",entity:{id:-1,beanName:""}};for(const _ of g){if(Number(_)){if(-1===s.entity.id){s.entity.id=Number(_);continue}"services-status-"===s.key&&(s.entity.id=Number(_));break}s.key=_.concat("-",s.key)}return s.key=s.key.slice(0,s.key.length-1),s.entity.beanName=h.getBeanName(s.key.split("-")[0]),s}canActivateChild(p,g){if(this.authResolver.isPerunAdminOrObserver())return!0;const s=h.parseUrl(g.url);return s.key.startsWith("members")?(this.apiRequest.dontHandleErrorForNext(),this.memberManager.getMemberById(s.entity.id).pipe((0,c.U)(_=>(s.entity.userId=_.userId,s.entity.voId=_.voId,this.finalizeCanActivateChild(s))),(0,l.K)(_=>this.errorRedirectUrl(_)))):s.key.startsWith("groups")?(this.apiRequest.dontHandleErrorForNext(),this.groupManager.getGroupById(s.entity.id).pipe((0,c.U)(_=>(s.entity.voId=_.voId,this.finalizeCanActivateChild(s))),(0,l.K)(_=>this.errorRedirectUrl(_)))):s.key.startsWith("resources")?(this.apiRequest.dontHandleErrorForNext(),this.resourceManager.getResourceById(s.entity.id).pipe((0,c.U)(_=>(s.entity.facilityId=_.facilityId,s.entity.voId=_.voId,this.finalizeCanActivateChild(s))),(0,l.K)(_=>this.errorRedirectUrl(_)))):this.finalizeCanActivateChild(s)}finalizeCanActivateChild(p){return!!this.routePolicyService.canNavigate(p.key,p.entity)||(this.notificator.showRouteError(),this.router.parseUrl("/notAuthorized"))}errorRedirectUrl(p){if("PrivilegeException"===p.name)return this.notificator.showRouteError(),(0,d.of)(this.router.parseUrl("/notAuthorized"))}}return h.\u0275fac=function(p){return new(p||h)(e.LFG(f.x4),e.LFG(f.Ip),e.LFG(t.F0),e.LFG(f.V6),e.LFG(f.F5),e.LFG(E.uq),e.LFG(E.ff),e.LFG(E.xk))},h.\u0275prov=e.Yz7({token:h,factory:h.\u0275fac,providedIn:"root"}),h})()}}]);