/**
 * Created by meathill on 2017/5/15.
 */
/* global URL */

const toString = Object.prototype.toString;

function fix2(number) {
  return number > 9 ? number.toString() : '0' + number;
}

function load(url) {
  let isJS = /\.js$/i.test(url);
  let loader;
  if (isJS) {
    loader = document.createElement('script');
    loader.async = true;
    loader.src = url;
    document.body.appendChild(loader);
  } else {
    let css = document.head.getElementsByTagName('link')[0];
    loader = document.createElement('link');
    loader.rel = 'stylesheet';
    loader.href = url;
    document.head.insertBefore(loader, css);
  }
  return new Promise(resolve => {
    loader.onload = resolve;
  });
}

export function formatDate(date) {
  return date.getFullYear() + fix2(date.getMonth() + 1) + fix2(date.getDate());
}

export function toDate(date) {
  return new Date(date.substr(0, 4), parseInt(date.substr(4, 2)) - 1, date.substr(6,2));
}

export function getThresholdCaption(level) {
  if (level <= 5) {
    return '毫雨';
  } else if (level <= 15) {
    return '小雨';
  } else if (level <= 25) {
    return '中雨';
  } else if (level <= 50) {
    return '大雨';
  } else {
    return '暴雨';
  }
}

export function needFastClick() {
  let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let isRunningiOSStandalone = navigator.standalone;
  let isRunningAndroidStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return isIos && (isRunningiOSStandalone || isRunningAndroidStandalone);
}

export function isString(obj) {
  return toString.call(obj) === '[object String]';
}

export function loadScripts() {
  let links = [
    load('node_modules/tqb-component-city-picker/build/css/tqb-city-picker.min.css'),
    load('node_modules/tqb-component-date-picker/build/css/tqb-date-picker.min.css')
  ];
  let vues = [
    load('node_modules/vue-router/dist/vue-router.min.js')
  ];
  let components = [
    load('node_modules/tqb-component-date-picker/build/js/tqb-date-picker.min.js'),
    load('node_modules/tqb-component-city-picker/build/js/tqb-city-picker.min.js')
  ];
  return Promise.all(links.concat(vues).concat(components));
}

export function findFrom() {
  if ('searchParams' in URL.prototype) {
    let url = new URL(location);
    return url.searchParams.get('from');
  }

  let params = location.search.substr(1).split('&');
  for (let i = 0, len = params.length; i < len; i++) {
    let [key, ...value] = params[i].split('=');
    if (key === 'from') {
      return value.join('=');
    }
  }
}