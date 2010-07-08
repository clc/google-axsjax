// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview AxsJAX to enhance accessibility
 * of the Google Finance home page.
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */


// create namespace
var axsFinance = {};

/**
 * Strings to be spoken to the user
 */
axsFinance.str = {
  HELP : 'The following shortcut keys are available. ',
  UP : 'up by',
  DOWN : 'down by',
  PRCNT : 'percent',
  MILLION : 'million',
  BILLION : 'billion',
  TRILLION : 'trillion',
  CONSUMERS : 'Consumer',
  UP_ABBR : '+',
  MINUS_ABBR : '-',
  PRCNT_ABBR : '%',
  MILLION_ABBR : 'M',
  BILLION_ABBR : 'B',
  TRILLION_ABBR : 'T',
  SECTOR_SUMMARY_TEMPLATE : '{0} percent of this sector is ' +
    'down. {1} percent of all the companies are down by more than {2} ' +
    'percent. {3} percent of this sector is up. {4} percent  of all the ' +
    'companies are up by more than {5} percent.',
  VOLUME_TEMPLATE : 'Company {0}, change {1}, market capitalization {2}.',
  NO_VOLUME_TEMPLATE : 'Company {0} {1} market capitalization {2}.',
  QUOTE_TEMPLATE : '{0}, {1}, {2}, or {3}.',
  PORTFOLIO_TEMPLATE : '{0}, {1}, {2}, or {3} market capitalization {4}.',
  RECENT_QUOTES_TEMPLATE : '{0}, {1}, or {2}.',
  TRENDS_TEMPLATE : '{0}, {1}, change {2}, market capitalization {3}.',
  GOOGLE_FINANCE_HOME : 'Google Finance home.'
};

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();

/**
 * Map from prefixes to strings
 * @type {Object}
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.MINUS_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffixes to strings
 * @type {Object}
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.BILLION_ABBR] = axsFinance.str.BILLION;
axsFinance.suffixMap[axsFinance.str.MILLION_ABBR] = axsFinance.str.MILLION;
axsFinance.suffixMap[axsFinance.str.TRILLION_ABBR] = axsFinance.str.TRILLION;
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR
 */
axsFinance.CNR =
    '<cnr next="RIGHT l" prev="LEFT h">' +

      '<target title="Go to link" hotkey="ENTER" ' +
          'onEmpty="No link available">' +
        './descendant-or-self::a' +
      '</target>' +

      '<target title="News" hotkey="e">' +
        '(//li[@class="nav-item"])[1]//a' +
      '</target>' +

      '<target title="Portfolios" hotkey="o">' +
        '(//li[@class="nav-item"])[2]//a' +
      '</target>' +

      '<target title="Stock screener" hotkey="s">' +
        '(//li[@class="nav-item"])[3]//a' +
      '</target>' +

      '<target title="Google domestic trends" hotkey="g">' +
        '(//li[@class="nav-item"])[4]//a' +
      '</target>' +

      '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
          ' type="dynamic">' +

        '<item action="CALL:axsFinance.readRecentQuoteTemplate">' +
          'id("rq")//tr' +
        '</item>' +

        '<target title="Create portfolio from quotes"  hotkey="c" ' +
            'onEmpty="No recent quotes.">' +
          'id("rq-create")' +
        '</target>' +

      '</list>' +

      '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" type="dynamic">' +

        '<item>' +
          '//li[@class="ra-entry"]' +
        '</item>' +

      '</list>' +

      '<list title="Market summary" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readTopStory">' +
          '//div[@class="news major"]' +
        '</item>' +

        '<item>' +
          '//div[@class="news major"]//div[@class="rel-article" and .//a ' +
              'and not(.//a[contains(@class,"rel")])]' +
        '</item>' +

        '<target title="Related articles"  hotkey="r" ' +
            'onEmpty="No related articles available.">' +
          '//div[@class="news major"]//a[@class="more-rel"]' +
        '</target>' +

      '</list>' +

      '<list title="Market summary indices" next="DOWN j" prev="UP k" ' +
          'fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readIndexCurrencyBondTemplate">' +
          '//tr[@class="indices"]' +
        '</item>' +

      '</list>' +

      '<list title="Market top stories" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" >' +

        '<item>' +
          'id("market-news-stream")//div[@class="cluster"]' +
        '</item>' +

        '<target title = "Market top stories" trigger="listEntry">' +
          '(id("mk-news")//div[@role="tab"])[1]' +
        '</target>' +

        '<target title="Related articles"  hotkey="r" ' +
            'onEmpty="No related articles available.">' +
          './/a[@class="more-rel"]' +
        '</target>' +

        '<target title="More market news"  hotkey="a">' +
          'id("market-news")//div[@class="section-link"]/a' +
        '</target>' +

      '</list>' +

      '<list title="Portfolio related top stories" next="DOWN j" prev="UP k" ' +
          'fwd="n" back="p">' +

        '<item>' +
          'id("portfolio-news-stream")//div[@class="cluster"]' +
        '</item>' +

        '<target title = "Portfolio related top stories" trigger="listEntry">' +
          '(id("mk-news")//div[@role="tab"])[2]' +
        '</target>' +

        '<target title="Related articles"  hotkey="r" onEmpty="No related ' +
            'articles available.">' +
          './/a[@class="more-rel"]' +
        '</target>' +

        '<target title="More market news"  hotkey="a">' +
          'id("market-news")//div[@class="section-link"]/a' +
        '</target>' +

      '</list>' +

      '<list title="Portfolios" next="DOWN j" prev="UP k" ' +
          'onEmpty="No portfolios" fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readPortfolioTemplate">' +
          'id("home-portfolios")//div[@class="miniPort"]' +
        '</item>' +

      '</list>' +

      '<list title="World markets" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readIndexCurrencyBondTemplate">' +
          'id("markets")//table[@class="quotes"]//tr[count(./*) > 0]' +
        '</item>' +

      '</list>' +

      '<list title="Currencies" next="DOWN j" prev="UP k" fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readIndexCurrencyBondTemplate">' +
          'id("currencies")//table[@class="quotes"]//tr' +
        '</item>' +

      '</list>' +

      '<list title="Bonds" next="DOWN j" prev="UP k" fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readIndexCurrencyBondTemplate">' +
          'id("bonds")//table[@class="quotes"]//tr[count(./*) > 0]' +
        '</item>' +

      '</list>' +

      '<list title="Sector summary" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readTableRowSectorSummaryDesc">' +
          'id("secperf")/table/tbody/tr[not(@class="colHeader")]' +
        '</item>' +

      '</list>' +

      '<list title="Popular trends" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_zeitgeist")//td[@class="symbol"]/..' +
        '</item>' +

        '<target title = "Popular trends" trigger="listEntry">' +
          'id("l_tm_zeitgeist")' +
        '</target>' +

      '</list>' +

      '<list title="Price trends gainers" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_price_0")//td[@class="change chg"]/..' +
        '</item>' +

        '<target title = "Price trends gainers" trigger="listEntry">' +
          'id("l_tm_price")' +
        '</target>' +

      '</list>' +

      '<list title="Price trends losers" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_price_0")//td[@class="change chr"]/..' +
        '</item>' +

        '<target title = "Price trends losers" trigger="listEntry">' +
          'id("l_tm_price")' +
        '</target>' +

      '</list>' +

      '<list title="Market capitalization trends gainers" next="DOWN j" ' +
          'prev="UP k" fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_mcap_0")//td[@class="change chg"]/..' +
        '</item>' +

        '<target title = "Market capitalization trends gainers" ' +
            'trigger="listEntry">' +
          'id("l_tm_mcap")' +
        '</target>' +

      '</list>' +

      '<list title="Market capitalization trends losers" next="DOWN j" ' +
          'prev="UP k" fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_mcap_0")//td[@class="change chr"]/..' +
        '</item>' +

        '<target title = "Market capitalization trends losers" ' +
            'trigger="listEntry">' +
          'id("l_tm_mcap")' +
        '</target>' +

      '</list>' +

      '<list title="Volume trends" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">' +
          'id("tm_volume_0")//td[@class="name"]/..' +
        '</item>' +

        '<target title = "Volume trends" trigger="listEntry">' +
          'id("l_tm_volume")' +
        '</target>' +

      '</list>' +

    '</cnr>';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type {AxsJAX?}
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsNav object that will handle navigation.
 * @type {AxsNav?}
 */
axsFinance.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type {AxsLens?}
 */
axsFinance.axsLensObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsFinance.powerKeyObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsFinance.axsSound = null;

/**
 * Flag indicating if the page is initialized
 * @type {boolean}
 */
axsFinance.searchBoxFocusEnabled = false;

/**
 * Initializes the AxsJAX script for Google Finance - main page.
 */
axsFinance.init = function() {
  //Initialize AxsJAX object
  axsFinance.axsJAXObj = new AxsJAX(true);

  //Initialize AxsNAv object
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.navInit(axsFinance.CNR, null);

  //Initialize AxsLens object
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);

  //Initialize AxsSound object
  axsFinance.axsSound = new AxsSound(true);
  axsFinance.axsNavObj.setSound(axsFinance.axsSound);

  //Initialize PowerKey object
  axsFinance.powerKeyObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setPowerKey(axsFinance.powerKeyObj, '.');

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);
  document.addEventListener('DOMSubtreeModified',
                            axsFinance.DOMSubtreeModifiedHandler,
                            true);

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsFinance.searchBoxKeyHandler, false);

  //Blur the element selected by default
  document.getElementById('searchbox').blur();

  // announce the current list
  window.setTimeout(function() {
        var text = axsFinance.str.GOOGLE_FINANCE_HOME + ' ' +
            axsFinance.axsNavObj.currentList().title;
        axsFinance.axsJAXObj.speakText(text);
      },
      0);
};

/**
 * Handles the DOMSubtreeModified event.
 * This event happens when the selected node for the
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event.
 */
axsFinance.DOMSubtreeModifiedHandler = function(evt){
  var target = evt.target;

  if (target.id == 'ac-list'){
    for (var i = 0, child; child = target.childNodes[i]; i++){
      if (child.className == 'selected'){
        axsFinance.axsJAXObj.speakNode(child);
        return;
      }
    }
  } else if (target.id == 'video-news') {
    window.setTimeout(function() {
          axsFinance.axsNavObj.refreshList('Video top stories');
        },
        0);
  }
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node.
 * @param {string} text The text to be spoken.
 * characters.
 */
axsFinance.speakAndGo = function(element, text) {
  axsFinance.axsLensObj.view(element);
  axsFinance.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsFinance.axsJAXObj.markPosition(element);
};

/**
 * Reads the top story.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTopStory = function(item) {
  // method required since the parts of the main and related news are siblings
  var element = item.elem;

  var name = element.getElementsByClassName('name')[0].textContent;
  var byline = element.getElementsByClassName('byline')[0].textContent;
  var snippet = element.getElementsByClassName('snippet')[0].textContent;

  var text = name + ' ' + byline + ' ' + snippet;
  axsFinance.speakAndGo(element, text);
};

/**
 * Reads a row from a trends table (popular/price/market capitalization/volume).
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readPopularPriceMktCapVolTemplate = function(item) {
  axsFinance.readTableRowRate(item.elem, axsFinance.str.TRENDS_TEMPLATE);
};

/**
 * Reads a row from a recent quotes table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuoteTemplate = function(item) {
  axsFinance.readTableRowRate(item.elem, axsFinance.str.RECENT_QUOTES_TEMPLATE);
};

/**
 * Reads a row from a quote table (index/currency/bond).
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readIndexCurrencyBondTemplate = function(item) {
  axsFinance.readTableRowRate(item.elem, axsFinance.str.QUOTE_TEMPLATE);
};

/**
 * Reads a row from a portfolio table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readPortfolioTemplate = function(item) {
  axsFinance.readTableRowRate(item.elem, axsFinance.str.PORTFOLIO_TEMPLATE);
};

/**
 * Reads rows from a table and populates the values in a given template.
 * @param {Node} row A TR DOM node.
 * @param {string} template The template to populate.
 */
axsFinance.readTableRowRate = function(row, template) {
  var xPath = './td[not(.//b)]';
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var values = new Array();
  var valueIndex = 0;
  var value = '';

  for (var i = 0, length = columns.length; i < length; i++) {
    var column = columns[i];
    // disregard #text nodes
    if (column.nodeType === 3) {
      continue;
    }
    value = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(column);
    value = axsFinance.normalizeString(value);
    // due to inconsistency in the DOM and the check against 0 is intentional
    if (value.indexOf('(') > 0 && value.indexOf('%') > -1) {
      var split = value.split('(');
      values[valueIndex++] = axsFinance.parseSpecialCharsAndTokens(split[0]);
      value = split[1];
    }
    values[valueIndex++] = axsFinance.parseSpecialCharsAndTokens(value);
  }

  var text = axsFinance.populateTemplate(template, values);
  axsFinance.speakAndGo(row, text);
};

/**
 * Handles the focus event of the search box. Avoids focusing of
 * this element performed by the page scripts.
 * @param {Event} evt The focus event.
 */
axsFinance.searchBoxKeyHandler = function(evt) {
  if (!axsFinance.searchBoxFocusEnabled) {
    axsFinance.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
  }
};

/**
 * Gets the text content of the DOM tree rooted at a given node selecting
 * only visible nodes (i.e. display != none). The text content of all the
 * nodes is concatenated and separated with space.
 * @param {Node} node The root node.
 * @return {string} The text content.
 */
axsFinance.getSpaceSeparatedVisibleDescendantsTextContent = function(node) {
  var text = '';
  var xPath = './/descendant-or-self::*[not(contains(@style,"display: ' +
      'none;"))]/text()';
  var textNodes = axsFinance.axsJAXObj.evalXPath(xPath, node);

  for (var i = 0, count = textNodes.length; i < count; i++) {
    text = text + textNodes[i].textContent + ' ';
  }

  return text;
};

/**
 * Reads rows from the sector summary section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowSectorSummaryDesc = function(item) {
  //handle special characters and order columns
  var textContents = new Array();
  var columns = item.elem.childNodes;

  //select table elements
  var sector = columns[1].textContent;
  var index = sector.indexOf('Cons.');
  if (index != -1) {
    sector = axsFinance.str.CONSUMERS + sector.substring(index + 5);
  }
  var absoluteChange = axsFinance.parseSpecialCharsAndTokens(
      columns[3].textContent);

  //Process the status bar
  var statusBarTableXPath = './descendant::table/descendant::td[@class]';

  //select down table
  var downTable = axsFinance.axsJAXObj.evalXPath(statusBarTableXPath,
                                                 columns[5]);

  //extract down numeric values
  var temp = downTable[0].title;
  var downPrcntAboveTreshold = Number(temp.substring(0, temp.indexOf(' ') - 1));
  var treshold = Number(temp.substring(temp.lastIndexOf(' '), temp.length - 1));
  temp = downTable[1].title;
  var downPrcntBelowTreshold = Number(temp.substring(0, temp.indexOf(' ') - 1));

  //select up table
  var upTable = axsFinance.axsJAXObj.evalXPath(statusBarTableXPath,
                                               columns[7]);
  //extract up numeric values
  temp = upTable[0].title;
  var upPrcntBelowTreshold = Number(temp.substring(0, temp.indexOf(' ') - 1));
  temp = upTable[1].title;
  var upPrcntAboveTreshold = Number(temp.substring(0, temp.indexOf(' ') - 1));

  //array with values to be substituted in the template
  var percentParameters =
      [
        downPrcntAboveTreshold + downPrcntBelowTreshold,
        downPrcntAboveTreshold,
        treshold,
        upPrcntAboveTreshold + upPrcntBelowTreshold,
        upPrcntAboveTreshold,
        treshold
      ];

  //template used due to specific representation
  var statusBarDesc = axsFinance.populateTemplate(
      axsFinance.str.SECTOR_SUMMARY_TEMPLATE,
      percentParameters);

  var rowText = sector + ' ' + absoluteChange + '. ' + statusBarDesc;
  axsFinance.speakAndGo(item.elem, rowText);
};

/**
 * Populates a template replacing special tokens (like {i} where i is is an
 * index) with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} values The array with replacement (concrete) values.
 * @return {string} The string generated from populating the template.
 */
axsFinance.populateTemplate = function(template, values) {
  var sentence = new String(template);
  for (var i = 0, value; i < values.length; i++) {
    sentence = sentence.replace('{' + i + '}', values[i]);
  }
  return sentence;
};

/**
 * Reads rows from the trends section except the volume subsection.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowTrendsNoVolumeDesc = function(item) {
  //handle special characters and order columns
  var columnValues = axsFinance.getTableRowContentArray(item);
  var rowText = axsFinance.populateTemplate(axsFinance.str.NO_VOLUME_TEMPLATE,
    columnValues);
  axsFinance.speakAndGo(item.elem, rowText);
};

/**
 * Reads rows from the volume subsection of the trends section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowTrendsVolumeDesc = function(item) {
  //handle special characters and order columns
  var columnValues = axsFinance.getTableRowContentArray(item);
  var rowText = axsFinance.populateTemplate(axsFinance.str.NO_VOLUME_TEMPLATE,
    columnValues);
  axsFinance.speakAndGo(item.elem, rowText);
};

/**
 * Returns the formatted content of a table row for all subsections of trends.
 * @param {Object} item A wrapper for the current DOM node.
 * @return {Array} The formatted content.
 */
axsFinance.getTableRowContentArray = function(item) {
  //handle special characters and order columns
  var columns = item.elem.childNodes;

  var company = columns[1].textContent;
  //due to inconsistency in http://finance.google.com/finance
  var absoluteChange = columns[4].textContent;
  if (absoluteChange.charAt(0) != '-' && columns[4].className == 'change chg') {
    absoluteChange = '+' + absoluteChange;
  }
  absoluteChange = axsFinance.parseSpecialCharsAndTokens(absoluteChange);
  var marketCap = axsFinance.parseSpecialCharsAndTokens(columns[5].textContent);

  var columnValues = new Array(company, absoluteChange, marketCap);
  return columnValues;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content.
 * @param {string} text The text to be processed.
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsFinance.parseSpecialCharsAndTokens = function(text) {
  var parsedText = '';

  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = axsFinance.normalizeString(text);

  //check for phrase word mapping
  var phraseMapping = axsFinance.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //check for whole word mapping
    var tokenMapping = axsFinance.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {

      //remove brackets
      if (token.length > 0 && token.charAt(0) === '(') {
        token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }

      // process prefix letter and suffix letter only
      // for more than a letter words
      if (token.length < 2) {
    	  continue;
      }

      //parse the first character
      var prefixMapping = axsFinance.prefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }

      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsFinance.suffixMap[lastCharacter];
      if (suffixMapping != undefined) {
        token = token.substring(0, token.length - 1) + ' ' + suffixMapping;
      }
    }
    parsedText = parsedText + ' ' + token;
  }

  return parsedText;
};

/**
 * Normalizes a string to enable correct presentation (i.e. speaking). All
 * leading and trailing spaces are truncated, all types of white space
 * characters are replaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized version of the text.
 */
axsFinance.normalizeString = function(text) {
  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  text = text.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return text.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'ENTER' goes to a link.
 * @param {Event} evt A keypress event.
 * @return {boolean} If true, the event should be propagated.
 */
axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsFinance.axsJAXObj.inputFocused) return true;

  if (evt.charCode == 46) { // .
    axsFinance.axsNavObj.showAvailableActionsSelector();
  }

  var command = axsFinance.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }

  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate
 *                   that the keycode has been handled.
 */
axsFinance.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
  47 : function() {
         axsFinance.searchBoxFocusEnabled = true;
         document.getElementById('searchbox').focus();
         document.getElementById('searchbox').select();
         return false;
       },
  // ? (question mark)
  63 : function() {
         var helpStr = axsFinance.str.HELP +
             axsFinance.axsNavObj.localHelpString() +
             axsFinance.axsNavObj.globalHelpString();
             axsFinance.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       },
  // - (minus symbol)
  45 : function() {
         axsFinance.magSize -= 0.10;
         axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsFinance.magSize += 0.10;
         axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
         return false;
       }
};

//Run the initialization routine of the script
//window.addEventListener('load', axsFinance.init, true);
// Temporary for testing commenting the above line and adding the one below
axsFinance.init();
