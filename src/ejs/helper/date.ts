/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import moment, { isMoment } from 'moment-timezone';
import { postResult } from '../../node/cache-post';
import config from '../../types/_config';

/**
 * get date local
 * @param page
 * @returns
 */
export function date_local(page: postResult) {
  if (page.language) {
    moment.locale(page.language);
  } else if (page.lang) {
    moment.locale(page.lang);
  } else if (config.lang) {
    moment.locale(config.lang);
  } else {
    moment.locale('en');
  }
  return page.lang || 'en';
}

/**
 * date format ejs helper
 * @param str
 * @param pattern
 * @returns
 * @example
 * <%- date_format(page.date, 'LLLL') %>
 */
export function date_format(str: string | Date | moment.MomentInput, pattern: 'MMMM Do YYYY, h:mm:ss a', page: postResult = null) {
  if (!str) {
    console.log('invalid date variable');
    return null;
  }
  const imoment = getMoment(str, date_local(page), config.timezone);
  return imoment.format(pattern);
}

/**
 * check date is valid
 * @param value
 * @returns
 */
export const isDate = (value: moment.MomentInput) => typeof value === 'object' && value instanceof Date && !isNaN(value.getTime());

/**
 * get moment instance of date
 * @param date
 * @param lang
 * @param timezone
 * @returns
 */
export function getMoment(date: any, lang: any, timezone: string) {
  let imoment: moment.Moment;
  if (date == null) imoment = moment();
  if (!isMoment(date)) imoment = moment(isDate(date) ? date : new Date(date));
  lang = toMomentLocale(lang);

  if (lang) imoment = imoment.locale(lang);
  if (timezone) imoment = imoment.tz(timezone);

  return imoment;
}

export function toISOString(date) {
  if (date == null) {
    return new Date().toISOString();
  }

  if (date instanceof Date || isMoment(date)) {
    return date.toISOString();
  }

  return new Date(date).toISOString();
}

export function dateHelper(date, format) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.date_format);
}

export function timeHelper(date, format) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.time_format);
}

export function fullDateHelper(date, format) {
  if (format) {
    const moment = getMoment(date, getLanguage(this), this.config.timezone);
    return moment.format(format);
  }

  return `${this.date(date)} ${this.time(date)}`;
}

export function relativeDateHelper(date) {
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.fromNow();
}

export function timeTagHelper(date, format) {
  return `<time datetime="${toISOString(date)}">${this.date(date, format, getLanguage(this), config.timezone)}</time>`;
}

export function getLanguage(ctx) {
  return ctx.page.lang || ctx.page.language || ctx.config.language;
}

/**
 * Convert Hexo language code to Moment locale code.
 * examples:
 *   default => en
 *   zh-CN => zh-cn
 *
 * Moment defined locales: https://github.com/moment/moment/tree/master/locale
 */
export function toMomentLocale(lang: string) {
  if (lang === undefined) {
    return undefined;
  }

  // moment.locale('') equals moment.locale('en')
  // moment.locale(null) equals moment.locale('en')
  if (!lang || lang === 'en' || lang === 'default') {
    return 'en';
  }
  return lang.toLowerCase().replace('_', '-');
}
