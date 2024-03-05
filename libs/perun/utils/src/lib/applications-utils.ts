import {
  Application,
  ApplicationsOrderColumn,
  RichApplication,
} from '@perun-web-apps/perun/openapi';
import { parseFullName } from './perun-utils';
import { formatDate } from '@angular/common';

export function dateToString(date: Date): string {
  // in case end date hasn't been picked yet in the date picker, show all until today
  if (!date) return formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
  return formatDate(date, 'yyyy-MM-dd', 'en-GB');
}

export function parseModifiedBy(data: Application): string {
  const index = data.modifiedBy.lastIndexOf('/CN=');
  if (index !== -1) {
    const string = data.modifiedBy
      .slice(index + 4, data.modifiedBy.length)
      .replace('/unstructuredName=', ' ')
      .toLowerCase();
    if (string.lastIndexOf('\\') !== -1) {
      return data.modifiedBy.slice(data.modifiedBy.lastIndexOf('=') + 1, data.modifiedBy.length);
    }
    return string;
  }
  return data.modifiedBy.toLowerCase();
}

export function getSortDataColumn(data: Application, column: string): string {
  switch (column) {
    case 'id':
      return data.id.toString();
    case 'createdAt':
      return data.createdAt;
    case 'type':
      return data.type;
    case 'state':
      return data.state;
    case 'user':
      return data.user
        ? data.user.lastName
          ? data.user.lastName
          : data.user.firstName ?? ''
        : data.createdBy.slice(data.createdBy.lastIndexOf('=') + 1, data.createdBy.length);
    case 'group':
      return data.group ? data.group.name : '';
    case 'modifiedBy':
      return parseModifiedBy(data);
    default:
      return '';
  }
}
export function getSortDataColumnQuery(column: string): ApplicationsOrderColumn {
  if (!column) {
    return ApplicationsOrderColumn.DATE_CREATED;
  }
  switch (column.toUpperCase()) {
    case 'ID':
      return ApplicationsOrderColumn.ID;
    case 'CREATEDAT':
      return ApplicationsOrderColumn.DATE_CREATED;
    case 'TYPE':
      return ApplicationsOrderColumn.TYPE;
    case 'STATE':
      return ApplicationsOrderColumn.STATE;
    case 'USER':
      return ApplicationsOrderColumn.SUBMITTER;
    case 'GROUPNAME':
      return ApplicationsOrderColumn.GROUP_NAME;
    case 'MODIFIEDBY':
      return ApplicationsOrderColumn.MODIFIED_BY;
    default:
      return ApplicationsOrderColumn.DATE_CREATED;
  }
}
export function getExportDataForColumn(data: Application, column: string): string {
  switch (column) {
    case 'id':
      return data.id.toString();
    case 'voId':
      return data.vo.id.toString();
    case 'voName':
      return data.vo.name;
    case 'groupId':
      return data.group?.id.toString() ?? '';
    case 'groupName':
      return data.group?.name ?? '';
    case 'type':
      return data.type;
    case 'fedInfo':
      return data.fedInfo ? deescapeMapEscapings(data.fedInfo) : '';
    case 'formData':
      return stringify((data as RichApplication).formData);
    case 'state':
      return data.state;
    case 'extSourceName':
      return data.extSourceName;
    case 'extSourceType':
      return data.extSourceType;
    case 'user':
      return data.user ? parseFullName(data.user) : '';
    case 'createdBy':
      return data.createdBy;
    case 'createdAt':
      return data.createdAt;
    case 'modifiedBy':
      return data.modifiedBy;
    case 'modifiedAt':
      return data.modifiedAt;
    default:
      return getFedValue(data.fedInfo, column);
  }
}
export function stringify(obj: object): string {
  const removeNullUndefined = (toFilter: object): object =>
    Object.entries(toFilter).reduce(
      (a, [k, v]) =>
        a[k] instanceof Object
          ? (a[k] = removeNullUndefined(a[k] as object))
          : v == null || v === 'null' || (v as string).length === 0
          ? a
          : ((a[k] = v as string), a),
      {},
    );

  let str = JSON.stringify(removeNullUndefined(obj));
  str = str.replace('{', '[');
  str = str.replace('}', ']');
  return str;
}
export function deescapeMapEscapings(value: string): string {
  let newValue = value.replace(/\\:/gi, ':');
  newValue = newValue.replace(/\\,/gi, ',');
  newValue = newValue.replace(/\\\\/gi, '\\');
  return newValue;
}
export function getFedValue(fedInfo: string, colName: string): string {
  // looking for values between {,FED_INFO_ATTR_NAME:}
  if (fedInfo === null || fedInfo.length === 0) {
    return '';
  }

  let values: string[] = [];
  if (fedInfo.startsWith(colName + ':')) {
    values = fedInfo.split(colName + ':');
  } else {
    values = fedInfo.split(',' + colName + ':');
  }
  if (values.length < 2) {
    return '';
  }
  // fedInfo should always end with comma - not escaped one though
  values[1] = values[1].replace(/\\,/gi, '#ESCAPED_COMMA');
  values = values[1].split(',');
  values[0] = values[0].replace('#ESCAPED_COMMA', '\\,');
  return deescapeMapEscapings(values[0]);
}
