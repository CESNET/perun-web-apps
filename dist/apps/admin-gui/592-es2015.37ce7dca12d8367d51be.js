(self.webpackChunkperun_web_apps=self.webpackChunkperun_web_apps||[]).push([[592],{4359:function(e,t,a){"use strict";a.d(t,{D:function(){return E}});var i=a(31572),l=a(4230),s=a(58623),r=a(67033),c=a(27613),n=a(88426),o=a(82819),u=a(61511),h=a(29236),p=a(39571),d=a(48160),S=a(99373);function m(e,t){if(1&e){const e=i.EpF();i.TgZ(0,"th",14),i.TgZ(1,"mat-checkbox",15),i.NdJ("change",function(t){i.CHM(e);const a=i.oxw();return t?a.masterToggle():null}),i.qZA(),i.qZA()}if(2&e){const e=i.oxw();i.xp6(1),i.Q6J("aria-label",e.checkboxLabel())("checked",e.selection.hasValue()&&e.isAllSelected())("indeterminate",e.selection.hasValue()&&!e.isAllSelected())}}function g(e,t){if(1&e){const e=i.EpF();i.TgZ(0,"td",16),i.TgZ(1,"mat-checkbox",17),i.NdJ("change",function(t){const a=i.CHM(e).$implicit,l=i.oxw();return t?l.selection.toggle(a):null})("click",function(e){return e.stopPropagation()}),i.qZA(),i.qZA()}if(2&e){const e=t.$implicit,a=i.oxw();i.xp6(1),i.Q6J("aria-label",a.checkboxLabel(e))("checked",a.selection.isSelected(e))}}function f(e,t){1&e&&(i.TgZ(0,"th",18),i._uU(1),i.ALo(2,"translate"),i.qZA()),2&e&&(i.xp6(1),i.Oqu(i.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.ID")))}function x(e,t){if(1&e&&(i.TgZ(0,"td",16),i._uU(1),i.qZA()),2&e){const e=t.$implicit;i.xp6(1),i.Oqu(e.id)}}function C(e,t){1&e&&(i.TgZ(0,"th",18),i._uU(1),i.ALo(2,"translate"),i.qZA()),2&e&&(i.xp6(1),i.Oqu(i.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NAME")))}function D(e,t){if(1&e&&(i.TgZ(0,"td",19),i._uU(1),i.qZA()),2&e){const e=t.$implicit;i.xp6(1),i.Oqu(e.name)}}function T(e,t){1&e&&(i.TgZ(0,"th",18),i._uU(1),i.ALo(2,"translate"),i.qZA()),2&e&&(i.xp6(1),i.Oqu(i.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.TYPE")))}function Z(e,t){if(1&e&&(i.TgZ(0,"td",19),i._uU(1),i.ALo(2,"extSourceType"),i.qZA()),2&e){const e=t.$implicit;i.xp6(1),i.Oqu(i.lcZ(2,1,e.type))}}function A(e,t){1&e&&i._UZ(0,"tr",20)}function O(e,t){1&e&&i._UZ(0,"tr",21)}function w(e,t){1&e&&(i.TgZ(0,"app-alert",22),i._uU(1),i.ALo(2,"translate"),i.qZA()),2&e&&(i.xp6(1),i.hij(" ",i.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_EXT_SOURCES"),"\n"))}function b(e,t){1&e&&(i.TgZ(0,"app-alert",22),i._uU(1),i.ALo(2,"translate"),i.qZA()),2&e&&(i.xp6(1),i.hij(" ",i.lcZ(2,1,"SHARED.COMPONENTS.EXT_SOURCES_LIST.NO_FILTER_RESULTS"),"\n"))}let E=(()=>{class e{constructor(e,t){this.authResolver=e,this.tableCheckbox=t,this.selection=new l.Ov,this.filterValue="",this.displayedColumns=["select","id","name","type"],this.pageSize=5,this.page=new i.vpe,this.exporting=!1,this.pageSizeOptions=c.f7}set matSort(e){this.sort=e,this.setDataSource()}ngAfterViewInit(){this.setDataSource()}ngOnChanges(e){this.authResolver.isPerunAdminOrObserver()||(this.displayedColumns=this.displayedColumns.filter(e=>"id"!==e)),this.dataSource=new r.by(this.extSources),this.setDataSource()}getDataForColumn(e,t){switch(t){case"id":return e.id.toString();case"type":return e.type.substring(40);case"name":return e.name;default:return""}}exportData(e){(0,c.O6)((0,c.Xn)(this.dataSource.filteredData,this.displayedColumns,this.getDataForColumn,this),e)}setDataSource(){this.dataSource&&(this.dataSource.filterPredicate=(e,t)=>(0,c.Sd)(e,t,this.displayedColumns,this.getDataForColumn,this),this.dataSource.sortData=(e,t)=>(0,c.pR)(e,t,this.getDataForColumn,this),this.dataSource.sort=this.sort,this.dataSource.paginator=this.child.paginator,this.dataSource.filter=this.filterValue)}isAllSelected(){return this.tableCheckbox.isAllSelected(this.selection.selected.length,this.filterValue,this.pageSize,this.child.paginator.hasNextPage(),this.dataSource)}masterToggle(){this.tableCheckbox.masterToggle(this.isAllSelected(),this.selection,this.filterValue,this.dataSource,this.sort,this.pageSize,this.child.paginator.pageIndex,!1)}checkboxLabel(e){return e?`${this.selection.isSelected(e)?"deselect":"select"} row ${e.id+1}`:(this.isAllSelected()?"select":"deselect")+" all"}}return e.\u0275fac=function(t){return new(t||e)(i.Y36(n.x4),i.Y36(n.UA))},e.\u0275cmp=i.Xpm({type:e,selectors:[["app-ext-sources-list"]],viewQuery:function(e,t){if(1&e&&(i.Gf(c.l9,7),i.Gf(s.YE,7)),2&e){let e;i.iGM(e=i.CRH())&&(t.child=e.first),i.iGM(e=i.CRH())&&(t.matSort=e.first)}},inputs:{extSources:"extSources",selection:"selection",filterValue:"filterValue",displayedColumns:"displayedColumns",pageSize:"pageSize"},outputs:{page:"page"},features:[i.TTD],decls:19,vars:9,consts:[[1,"card","mt-2",3,"hidden"],[3,"dataLength","pageSizeOptions","pageSize","exportData","page"],["mat-table","","matSort","","matSortActive","id","matSortDirection","asc","matSortDisableClear","",1,"w-100",3,"dataSource"],["matColumnDef","select"],["mat-header-cell","",4,"matHeaderCellDef"],["class","static-column-size","mat-cell","",4,"matCellDef"],["matColumnDef","id"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["matColumnDef","name"],["mat-cell","",4,"matCellDef"],["matColumnDef","type"],["mat-header-row","",4,"matHeaderRowDef"],["class","dark-hover-list-item","mat-row","",4,"matRowDef","matRowDefColumns"],["alert_type","warn",4,"ngIf"],["mat-header-cell",""],["color","primary",3,"aria-label","checked","indeterminate","change"],["mat-cell","",1,"static-column-size"],["color","primary",3,"aria-label","checked","change","click"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-header-row",""],["mat-row","",1,"dark-hover-list-item"],["alert_type","warn"]],template:function(e,t){1&e&&(i.TgZ(0,"div",0),i.TgZ(1,"perun-web-apps-table-wrapper",1),i.NdJ("exportData",function(e){return t.exportData(e)})("page",function(e){return t.page.emit(e)}),i.TgZ(2,"table",2),i.ynx(3,3),i.YNc(4,m,2,3,"th",4),i.YNc(5,g,2,2,"td",5),i.BQk(),i.ynx(6,6),i.YNc(7,f,3,3,"th",7),i.YNc(8,x,2,1,"td",5),i.BQk(),i.ynx(9,8),i.YNc(10,C,3,3,"th",7),i.YNc(11,D,2,1,"td",9),i.BQk(),i.ynx(12,10),i.YNc(13,T,3,3,"th",7),i.YNc(14,Z,3,3,"td",9),i.BQk(),i.YNc(15,A,1,0,"tr",11),i.YNc(16,O,1,0,"tr",12),i.qZA(),i.qZA(),i.qZA(),i.YNc(17,w,3,3,"app-alert",13),i.YNc(18,b,3,3,"app-alert",13)),2&e&&(i.Q6J("hidden",0===t.extSources.length||0===t.dataSource.filteredData.length),i.xp6(1),i.Q6J("dataLength",t.dataSource.filteredData.length)("pageSizeOptions",t.pageSizeOptions)("pageSize",t.pageSize),i.xp6(1),i.Q6J("dataSource",t.dataSource),i.xp6(13),i.Q6J("matHeaderRowDef",t.displayedColumns),i.xp6(1),i.Q6J("matRowDefColumns",t.displayedColumns),i.xp6(1),i.Q6J("ngIf",0===t.extSources.length),i.xp6(1),i.Q6J("ngIf",0===t.dataSource.filteredData.length&&0!==t.extSources.length))},directives:[o.l,r.BZ,s.YE,r.w1,r.fO,r.Dz,r.as,r.nj,u.O5,r.ge,h.oG,r.ev,s.nU,r.XQ,r.Gk,p.w],pipes:[d.X$,S.A],styles:[""]}),e})()}}]);