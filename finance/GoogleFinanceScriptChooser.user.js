// Copyright 2010 Google Inc.
// All Rights Reserved.

// ==UserScript==
// @name          Google Finance Accessibility Enhancements
// @namespace     http://www.google.com/accessible/
// @description   Uses WAI-ARIA and AxsJAX to enhance accessibility for Google Finance
// @include       *
// ==/UserScript==

/**
 * @fileoverview The Google Script Loader Greasemonkey script
 * for injecting AxsJAX script into Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav Ganov)
 */
function pickScript() {
  var baseURL =
      'http://google-axsjax.googlecode.com/svn/trunk/';

  var scriptUrlsArray = new Array();
  scriptUrlsArray.push(baseURL + 'common/AxsJAX.js');
  scriptUrlsArray.push(baseURL + 'common/AxsNav.js');
  scriptUrlsArray.push(baseURL + 'common/AxsLens.js');
  scriptUrlsArray.push(baseURL + 'common/AxsSound.js');
  scriptUrlsArray.push(baseURL + 'common/PowerKey.js');

  var currentURL = document.baseURI;
  var path = document.location.pathname;
  var prefix = document.location.host;
  var search = document.location.search;

  // if not a Google URL we are done 
  if (prefix != 'www.google.com') {
        return;
  }

  if (path === '/finance' && search === '') {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceHome.js');
    injectScripts(scriptUrlsArray);
  } else if (path === '/finance' && search.indexOf(':') === 0) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceCurrency.js');
    injectScripts(scriptUrlsArray);
  } else if (path.indexOf('/finance') === 0 && search.indexOf(':') > -1) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceIndex.js');
    injectScripts(scriptUrlsArray);
  } else if (path.indexOf('/finance') === 0 && search.indexOf('?catid=') > -1) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceSector.js');
    injectScripts(scriptUrlsArray);
  } else if (path.indexOf('/finance') === 0 && search.indexOf('fstype=') > -1) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceStatement.js');
    injectScripts(scriptUrlsArray);
  } else if (path.indexOf('/finance') === 0 && search.match('q=[A-Z]+')) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceQuotes.js');
    injectScripts(scriptUrlsArray);
  } else if (path === '/finance' && search.match('q=[a-z]+')) {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceSearchResults.js');
    injectScripts(scriptUrlsArray);
  } else if (path === '/finance/stockscreener' && search === '') {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceStockScreener.js');
    injectScripts(scriptUrlsArray);
  } else if (path.match('^/finance/[a-z]+_news$') && search === '') {
    scriptUrlsArray.push(baseURL + 'finance/axsEnableFinanceNews.js');
    injectScripts(scriptUrlsArray);
  } else if (path === '/finance/historical' && search.length > 0) {
    scriptUrlsArray.push(baseURL
        + 'finance/axsEnableFinanceHistoricalPrices.js');
    injectScripts(scriptUrlsArray);
  } else if (path === '/finance/portfolio' && search.length > 0) {
    injectScripts.push(baseURL + 'finance/axsEnableFinancePortfolios.js');
    injectScripts(scriptUrlsArray);
  }
}
        
function injectScripts(scriptUrls) {
  var headElement = document.getElementsByTagName('head')[0];
  var scriptElements = document.getElementsByTagName('script');

  for (var i = 0, scriptUrl; scriptUrl = scriptUrls[i]; i++) {
    injectScript(scriptUrl, scriptElements, headElement);
  }
}

function injectScript(scriptURL, scriptElements, parent) {
  for (var i = 0, scriptElement; scriptElement = scriptElements[i]; i++) {
    if (scriptElement.src == scriptURL) {
          return;
    }
  }

  var scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.src = scriptURL;
  parent.appendChild(scriptElement);
  
  console.log("Injecting: " + scriptURL);
}

pickScript();
