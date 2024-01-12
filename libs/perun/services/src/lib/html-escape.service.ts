import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
// import { addHook, removed, sanitize } from 'dompurify';
import { PerunTranslateService } from './perun-translate.service';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RPCError } from '@perun-web-apps/perun/models';

export interface EscapeOutput {
  escapedHtml: string;
  removedTags: string[];
  removedAttrs: AttributeOut[];
  removedStyleProps: StyleRemoved[];
}

// Types needed for EsLint errors
// interface ElementRemoved {
//   element: HTMLElement;
// }
//
// interface AttributeRemoved {
//   attribute: Attr;
//   from?: HTMLElement;
//   tag: string;
// }

interface StyleRemoved {
  style: string;
  tag: string;
}

interface AttributeOut {
  attribute: string;
  tag: string;
}

interface HtmlEscapedMessage {
  isHtmlInvalid: boolean;
  invalidMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class HtmlEscapeService {
  constructor(
    private translate: PerunTranslateService,
    private registrarManager: RegistrarManagerService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
  ) {}
  escapeDangerousHtml(html: string): EscapeOutput {
    return {
      escapedHtml: html,
      removedTags: [],
      removedAttrs: [],
      removedStyleProps: [],
    };
    // const config = {
    //   WHOLE_DOCUMENT: true,
    //   ALLOWED_TAGS: [
    //     'a',
    //     'article',
    //     'aside',
    //     'b',
    //     'blockquote',
    //     'br',
    //     'button',
    //     'caption',
    //     'center',
    //     'cite',
    //     'decorator',
    //     'del',
    //     'details',
    //     'div',
    //     'em',
    //     'footer',
    //     'h1',
    //     'h2',
    //     'h3',
    //     'h4',
    //     'h5',
    //     'h6',
    //     'header',
    //     'i',
    //     'img',
    //     'kbd',
    //     'label',
    //     'li',
    //     'ol',
    //     'p',
    //     'pre',
    //     'section',
    //     'select',
    //     'span',
    //     'strong',
    //     'sup',
    //     'table',
    //     'tbody',
    //     'td',
    //     'textarea',
    //     'tfoot',
    //     'th',
    //     'thead',
    //     'tr',
    //     'ul',
    //   ],
    //   ALLOWED_ATTR: [
    //     'align',
    //     'class',
    //     'color',
    //     'disabled',
    //     'height',
    //     'hidden',
    //     'href',
    //     'id',
    //     'label',
    //     'size',
    //     'span',
    //     'src',
    //     'srcset',
    //     'style',
    //     'width',
    //   ],
    //   ALLOWED_STYLE_PROPS: [
    //     'color',
    //     'background-color',
    //     'font-size',
    //     'font-family',
    //     'text-align',
    //     'margin',
    //     'padding',
    //     'border',
    //     'width',
    //     'height',
    //     'display',
    //     'position',
    //     'top',
    //     'bottom',
    //     'left',
    //     'right',
    //     'overflow',
    //     'float',
    //     'clear',
    //     'z-index',
    //   ],
    // };
    //
    // const removedTags: string[] = [];
    // const removedAttributes: AttributeOut[] = [];
    // const removedStyles: StyleRemoved[] = [];
    // // Sanitize CSS properties (DOMPurify does not support sanitizing of style properties)
    // addHook('uponSanitizeAttribute', (_currentNode, data) => {
    //   if (data.attrName !== 'style') return;
    //
    //   const props = data.attrValue
    //     .split(';')
    //     .map((el) => el.trim())
    //     .filter((el) => el.length > 0);
    //   for (let i = 0; i < props.length; i++) {
    //     const prop = props[i];
    //     let [name, value] = prop.split(':');
    //     if (name === undefined || value === undefined) continue;
    //     name = name.trim();
    //     value = value.trim();
    //
    //     if (!config.ALLOWED_STYLE_PROPS.includes(name)) {
    //       const tagName = _currentNode.localName;
    //
    //       removed.push({
    //         style: name,
    //         tag: tagName,
    //       });
    //       props[i] = '';
    //       continue;
    //     }
    //     props[i] = `${name}:${value};`;
    //   }
    //   data.attrValue = props.filter((el) => el.length > 0).join(' ');
    // });
    //
    // const sanitized = sanitize(html, config);
    // // Hacky way to get the sanitized HTML and removed elements
    // const d = document.createElement('html');
    // d.innerHTML = sanitized;
    // html = d.getElementsByTagName('body')[0].innerHTML;
    //
    // for (const el of removed) {
    //   if ('element' in el) {
    //     const e = el as ElementRemoved;
    //     removedTags.push(e.element.localName);
    //   } else if ('attribute' in el) {
    //     const e = el as AttributeRemoved;
    //     removedAttributes.push({
    //       attribute: e.attribute.localName,
    //       tag: e.from.localName,
    //     });
    //   } else if ('style' in el) {
    //     const e = el as StyleRemoved;
    //     removedStyles.push({
    //       style: e.style,
    //       tag: e.tag,
    //     });
    //   }
    // }
    //
    // return {
    //   escapedHtml: html,
    //   removedTags: removedTags,
    //   removedAttrs: removedAttributes,
    //   removedStyleProps: removedStyles,
    // };
  }

  generateErrorTooltip(errors: EscapeOutput): string {
    let message = '';
    if (errors.removedTags.length !== 0) {
      message += ' The following tags are not allowed: ';
      for (const tag of errors.removedTags) {
        message += tag + ', ';
      }
      message = message.slice(0, -2) + '. ';
    }
    if (errors.removedAttrs.length !== 0) {
      message += ' The following attributes are not allowed: ';
      for (const attr of errors.removedAttrs) {
        message += attr.attribute + ' in ' + attr.tag + ', ';
      }
      message = message.slice(0, -2) + '. ';
    }
    if (errors.removedStyleProps.length !== 0) {
      message += ' The following style properties are not allowed: ';
      for (const style of errors.removedStyleProps) {
        message += style.style + ' in ' + style.tag + ', ';
      }
      message = message.slice(0, -2) + '.';
    }
    return message;
  }

  checkboxValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return this.registrarManager.checkCheckboxHtml(String(control.value));
        }),
        map(() => null),
        catchError((err: RPCError) => {
          const rpcErr = err.message.substring(err.message.indexOf(':') + 1);
          return of({ invalidHtmlContent: rpcErr }) as Observable<ValidationErrors>;
        }),
      ) as Observable<ValidationErrors>;
    };
  }

  htmlContentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { isHtmlInvalid, invalidMessage } = this.checkHtmlContent(control);
      return isHtmlInvalid ? { invalidHtmlContent: invalidMessage } : null;
    };
  }

  private checkHtmlContent(control: AbstractControl): HtmlEscapedMessage {
    // Remove unsafe tags
    const { escapedHtml, removedTags, removedAttrs, removedStyleProps } = this.escapeDangerousHtml(
      String(control.value),
    );
    // Check if input is valid
    const htmlInvalidMessage = this.generateErrorTooltip({
      escapedHtml,
      removedTags,
      removedAttrs,
      removedStyleProps,
    });
    return {
      isHtmlInvalid:
        removedTags.length > 0 || removedAttrs.length > 0 || removedStyleProps.length > 0,
      invalidMessage: htmlInvalidMessage,
    };
  }
}
