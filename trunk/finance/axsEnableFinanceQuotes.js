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
 * @fileoverview AxsJAX script intended to enhance accessibility of the Quotes
 * page of Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Help string to be spoken to the user
 * @type string
 */
axsFinance.HELP = 'The following shortcut keys are available. ';

/**
 * Strings for enhancing the presentation
 */
axsFinance.str = {
  UP : ' up by ',
  UP_ABBR : '+',
  DOWN : ' down by ',
  DOWN_ABBR : '-',
  PRCNT : ' percent',
  PRCNT_ABBR : '%',
  MLN : ' million',
  MLN_ABBR : 'M',
  BLN : ' billion',
  BLN_ABBR : 'B',
  NYSE : 'New York Stock Exchange',
  NYSE_ABBR : 'NYSE',
  NASDAQ : 'NASDAQ Stock Market',
  NASDAQ_ABBR : 'NASDAQ',
  LON : 'London Stock Exchange',
  LON_ABBR : 'LON',
  OTC : 'Over the counter',
  OTC_ABBR : 'OTC',
  AMEX : 'American Stock Exchange',
  AMEX_ABBR : 'AMEX',
  EPA : 'Euronext Paris Stock Exchange',
  EPA_ABBR : 'EPA',
  ASX : 'Australian Securities Exchange',
  ASX_ABBR : 'ASX',
  P_E : 'Price to earnings',
  P_E_ABBR : 'P/E',
  F_P_E : 'Forward price to earnings',
  F_P_E_ABBR : 'F P/E:',
  VOL : 'Volume',
  VOL_ABBR : 'Vol:',
  SELECTED : 'selected',
  NOT_SELECTED : 'not selected',
  DASH : 'dash',
  DASH_ABBR : '-',
  CHANGE_ABBR : 'Chg',
  CHANGE : 'Change',
  LONG_TERM_ABBR : 'Lt',
  LONG_TERM : 'Long term',
  MARKET_ABBR : 'Mkt',
  MARKET : 'Market',
  CAP_ABBR : 'Cap',
  CAP : 'capitalization',
  AVRG_ABBR : 'avg',
  AVRG : 'average',
  EBITD_ABBR : 'EBITD',
  EBITD : 'Earnings before interest, tax, and depreciation',
  EBITDA_ABBR : 'EBITDA',
  EBITDA : 'Earnings before interest, tax, depreciation and amortization',
  GOOGLE_FINANCE_QUOTES : 'Google Finance Quotes',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  KEY_STATISTIC_TEMPLATE : '{0}, last quarter {1}, last year {2}.',
  SELECT_COLUMNS : 'Select which columns to be shown and press Enter when ' +
      'ready.',
  V_TO_SAVE_C_TO_CANCEL : 'Press v to save or c to cancel.',
  DISCLAIMER : '- Disclaimer',
  PM : 'PM',
  AM : 'AM',
  OR : 'or'
};

/**
 * Map from abbreviated phrases to expanded phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.TTM] = axsFinance.str.WEEKS;
axsFinance.phrasesMap[axsFinance.str.NYSE_ABBR] = axsFinance.str.NYSE;
axsFinance.phrasesMap[axsFinance.str.NASDAQ_ABBR] = axsFinance.str.NASDAQ;
axsFinance.phrasesMap[axsFinance.str.LON_ABBR] = axsFinance.str.LON;
axsFinance.phrasesMap[axsFinance.str.OTC_ABBR] = axsFinance.str.OTC;
axsFinance.phrasesMap[axsFinance.str.AMEX_ABBR] = axsFinance.str.AMEX;
axsFinance.phrasesMap[axsFinance.str.EPA_ABBR] = axsFinance.str.EPA;
axsFinance.phrasesMap[axsFinance.str.ASX_ABBR] = axsFinance.str.ASX;
axsFinance.phrasesMap[axsFinance.str.WEEKS_ABBR] = axsFinance.str.WEEKS;
axsFinance.phrasesMap[axsFinance.str.P_E_ABBR] = axsFinance.str.P_E;
axsFinance.phrasesMap[axsFinance.str.F_P_E_ABBR] = axsFinance.str.F_P_E;
axsFinance.phrasesMap[axsFinance.str.VOL_ABBR] = axsFinance.str.VOL;
axsFinance.phrasesMap[axsFinance.str.AVG_VOL_ABBR] = axsFinance.str.AVG_VOL;
axsFinance.phrasesMap[axsFinance.str.INST_OWN_ABBR] = axsFinance.str.INST_OWN;
axsFinance.phrasesMap[axsFinance.str.EPS_ABBR] = axsFinance.str.EPS;
axsFinance.phrasesMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;
axsFinance.phrasesMap[axsFinance.str.DASH_ABBR] = axsFinance.str.DASH;
axsFinance.phrasesMap[axsFinance.str.CHANGE_ABBR] = axsFinance.str.CHANGE;
axsFinance.phrasesMap[axsFinance.str.LONG_TERM_ABBR] = axsFinance.str.LONG_TERM;
axsFinance.phrasesMap[axsFinance.str.MARKET_ABBR] = axsFinance.str.MARKET;
axsFinance.phrasesMap[axsFinance.str.CAP_ABBR] = axsFinance.str.CAP;
axsFinance.phrasesMap[axsFinance.str.AVRG_ABBR] = axsFinance.str.AVRG;
axsFinance.phrasesMap[axsFinance.str.EBITD_ABBR] = axsFinance.str.EBITD;
axsFinance.phrasesMap[axsFinance.str.EBITDA_ABBR] = axsFinance.str.EBITDA;
axsFinance.phrasesMap[axsFinance.str.PM] = axsFinance.str.PM;
axsFinance.phrasesMap[axsFinance.str.AM] = axsFinance.str.AM;

/**
 * Map from prefix characters to strings
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.BLN_ABBR] = axsFinance.str.BLN;
axsFinance.suffixMap[axsFinance.str.MLN_ABBR] = axsFinance.str.MLN;
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR
 */
axsFinance.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Read current quote" hotkey="q" ' +
        'action="CALL:axsFinance.readCurrentQuote">' +
      'id("price-panel")' +
    '</target>' +

    '<target title="Markets" hotkey="m">' +
      '(//li[@class="nav-item"])[1]//a' +
    '</target>' +

    '<target title="News" hotkey="e">' +
      '(//li[@class="nav-item"])[2]//a' +
    '</target>' +

    '<target title="Portfolios" hotkey="o">' +
      '(//li[@class="nav-item"])[3]//a' +
    '</target>' +

    '<target title="Stock screener" hotkey="s">' +
      '(//li[@class="nav-item"])[4]//a' +
    '</target>' +

    '<target title="Google domestic trends" hotkey="g">' +
      '(//li[@class="nav-item"])[5]//a' +
    '</target>' +

    '<target title="Financials" hotkey="f">' +
      'id("nav-cf")' +
    '</target>' +

    '<target title="Go to link" hotkey="ENTER">' +
      './/descendant-or-self::a' +
    '</target>' +

    '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
        ' type="dynamic" onEmpty="No recent quotes">' +

      '<item action="CALL:axsFinance.readRecentQuote">' +
        'id("rq")//tr' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("rq-box")' +
      '</target>' +

      '<target title="Create portfolio from quotes" hotkey="p" ' +
          'onEmpty="No recent quotes.">' +
        'id("rq-create")' +
      '</target>' +

    '</list>' +

    '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item>' +
        '//li[@class="ra-entry"]//a' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("rq-src")' +
      '</target>' +

    '</list>' +

    '<list title="Market data" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p">' +

      '<item action="CALL:axsFinance.readMarketData">' +
        'id("snap-data")/li' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("companyheader")' +
      '</target>' +

    '</list>' +

    '<list title="News" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item>' +
        '//div[@class="cluster"]' +
      '</item>' +

      '<target title="View all news" hotkey="a">' +
        '(id("news-sidebar-footer")//a[text()])[1]' +
      '</target>' +

      '<target title="Subscribe" hotkey="u">' +
        '(id("news-sidebar-footer")//a[text()])[2]' +
      '</target>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("companyheader")' +
      '</target>' +

    '</list>' +

    '<list title="Related companies" next="DOWN j" prev="UP k" fwd="n" ' +
        'type ="dynamic" back="p">' +

      '<item action="CALL:axsFinance.readRelCompDesc">' +
        'id("cc-table")//tr[./td]' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("related")' +
      '</target>' +

      '<target title="Add or remove columns" hotkey="a" ' +
          'action="CALL:axsFinance.focusOnColumnSelectionCategry">' +
        'id("related-edit-col")' +
      '</target>' +

      '<target title="Cancel" hotkey="v">' +
        'id("related-save")' +
      '</target>' +

      '<target title="Cancel" hotkey="c">' +
        'id("related-cancel")' +
      '</target>' +

    '</list>' +

    '<list title="Discussed on blogs" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p">' +

      '<item>' +
        'id("blogs")//div[@class="item"]' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("blogs")' +
      '</target>' +

      '<target title="All blog discussions" hotkey="a" ' +
          'onEmpty="No more blog discussions">' +
        'id("b-m-")' +
      '</target>' +

    '</list>' +

    '<list title="Events" next="DOWN j" prev="UP k" fwd="n" back="p">' +

      '<item>' +
        '//div[@class="event"]' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        '//div[@class="g-section g-tpl-25-75 g-split hdg"]' +
      '</target>' +

      '<target title="All events from AOL" hotkey="a" ' +
          'onEmpty="No more events">' +
        '//div[@class="events sfe-section"]//table//a' +
      '</target>' +

    '</list>' +

    '<list title="Discussions" next="DOWN j" prev="UP k" fwd="n" back="p">' +

      '<item>' +
        'id("groups")//div[@class="item"]' +
      '</item>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("groups")' +
      '</target>' +

      '<target title="All discussions" hotkey="a" ' +
          'onEmpty="No more discussions">' +
        'id("groups")//div[@class="sfe-break-top"]//a' +
      '</target>' +

    '</list>' +

    '<list title="Key statistics and ratios" next="DOWN j" prev="UP k" ' +
      'fwd="n" back="p">' +

      '<item action="CALL:axsFinance.readKeyStatisticAndRatio">' +
        '//table[@class="quotes rgt nwp"]//tbody/tr' +
      '</item>' +

      '<target title="More ratios from Thomson Reuters" hotkey="a" ' +
          'onEmpty="No more ratios">' +
        'id("m-rratio")' +
      '</target>' +

      '<target title="Go to section" trigger="listEntry">' +
        '//table[@class="quotes rgt nwp"]' +
      '</target>' +

      '<target title="All ratios" hotkey="a" ' +
          'onEmpty="No more ratios">' +
        'id("m-rratio")' +
      '</target>' +

    '</list>' +

    '<list title="Address" next="DOWN j" prev="UP k" fwd="n" back="p">' +

      // fragile - no suitable attribute via which to recognize the node
      '<item>' +
        '(//div[@class="hdg" and .//h3[contains(text(),"Address")]]' +
            '//following-sibling::div)[1]' +
      '</item>' +

      // fragile - no suitable attribute via which to recognize the node
      '<target title="Go to section" trigger="listEntry">' +
        '//div[@class="hdg"]//h3[contains(text(),"Address")]' +
      '</target>' +

    '</list>' +

    '<list title="Description" next="DOWN j" prev="UP k" fwd="n" back="p">' +

      '<item>' +
        'id("summary")' +
      '</item>' +

      '<target title="More from Reuters" hotkey="a">' +
        'id("m-rprofile")' +
      '</target>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("summary-section")' +
      '</target>' +

    '</list>' +

    '<list title="Officers and directors" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p">' +

      '<item>' +
        'id("management")//tr[@class]' +
      '</item>' +

      '<target title="Full list on Reuters" hotkey="a">' +
        'id("management")//div[@class="gb"]//a' +
      '</target>' +

      '<target title="Go to section" trigger="listEntry">' +
        'id("management")' +
      '</target>' +

    '</list>' +

    '<list title="Website links" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p">' +

      // fragile - no suitable attribute via which to recognize the node
      '<item>' +
        '(//div[@class="hdg" and .//h3[contains(text(),"Website links")]]' +
            '//following-sibling::div)[1]//a' +
      '</item>' +

      // fragile - no suitable attribute via which to recognize the node
      '<target title="Go to section" trigger="listEntry">' +
        '//div[@class="hdg"]//h3[contains(text(),"Website links")]' +
      '</target>' +

    '</list>' +

    '<list title="External links" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p">' +

      // fragile - no suitable attribute via which to recognize the node
      '<item>' +
        '(//div[@class="hdg" and .//h3[contains(text(),"External links")]]' +
            '//following-sibling::div)[1]//div[@class="item"]' +
      '</item>' +

      // fragile - no suitable attribute via which to recognize the node
      '<target title="Go to section" trigger="listEntry">' +
        '//div[@class="hdg"]//h3[contains(text(),"External links")]' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsFinance.axsLensObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsFinance.axsSound = null;

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
 * Flag indicating if the page is initialized
 * @type boolean
 */
axsFinance.searchBoxFocusEnabled = false;

/**
 * Time out for processing events.
 * @type {Number}
 */
axsFinance.EVT_HANDL_TIMEOUT_INT = 300;

/**
 * Map for flags indicating if a handler for an event has been triggered
 * @type {Object}
 */
axsFinance.eventHandlerToEventMap = new Object();

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsFinance.initAxsJAX = function() {
  //Initialize AxsJAX object
  axsFinance.axsJAXObj = new AxsJAX(true);

  //Initialize AxsNav object
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.navInit(axsFinance.CNR, null);

  //Initialize AxsLens object
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);

  //Initialize AxsSound object
  axsFinance.axsSound = new AxsSound(true);
  axsFinance.axsNavObj.setSound(axsFinance.axsSound);

  //Initialize PowerKey object
  axsFinance.powerKeyObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setPowerKey(axsFinance.powerKeyObj, '.');

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);

  var func = axsFinance.domNodeInsertedEventDispatch;
  document.addEventListener('DOMNodeInserted', func, true);

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsFinance.searchBoxKeyHandler, false);

  //read the current quote
  axsFinance.announceIntro();
};

/**
 * Announces the page title and the index quote.
 */
axsFinance.announceIntro = function() {
  var xPath = 'id("companyheader")//h3';
  var titleNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (titleNode) {
    var title = axsFinance.parseSpecialCharsAndTokens(titleNode.textContent);
    title = axsFinance.str.GOOGLE_FINANCE_QUOTES + '. ' + title;

    var quote = axsFinance.getIndexQuote();
    var text = title + ' ' + quote;

    var conversionResult = document.getElementById('price-panel');
    axsFinance.speakAndGo(conversionResult, text);
  }
};

/**
 * Returns the index quote.
 * @return {string} The index quote.
 */
axsFinance.getIndexQuote = function() {
  var pricePanel = document.getElementById('price-panel');
  var text = axsFinance.normalizeString(pricePanel.textContent);
  // do this since the DOM has structure that would require quite fragile XPath
  // we prevent mapping the last character to suffix
  text = text.replace(axsFinance.str.DISCLAIMER, '');
  text = text.replace(axsFinance.str.AM, ' ' + axsFinance.str.AM);
  text = text.replace(axsFinance.str.PM, ' ' + axsFinance.str.PM);
  // due to inconsistency in showing up changes as percent
  // (sometimes the + is there and sometimes omitted)
  text = text.replace(' (', ' ' + axsFinance.str.OR + ' ');
  return axsFinance.parseSpecialCharsAndTokens(text);
};

/**
 * Reads the current quote.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCurrentQuote = function(item) {
  var text = axsFinance.getIndexQuote();
  axsFinance.speakAndGo(item.elem, text);
};

/**
 * Reads an item from the 'Recent quotes' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuote = function(item) {
  axsFinance.pupulateTemplateAndAnnounce(item.elem, './td[not(.//b)]',
      axsFinance.str.RECENT_QUOTE_TEMPLATE);
};

/**
 * Reads an item from the 'Key statistics and ratios' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readKeyStatisticAndRatio = function(item) {
  axsFinance.pupulateTemplateAndAnnounce(item.elem, './td',
      axsFinance.str.KEY_STATISTIC_TEMPLATE);
};

/**
 * Selects nodes with a given xPath expression starting from the node
 * wrapper by an item and populates their values in a template.
 * @param {rootNode} rootNode A wrapper for the current DOM node.
 * @param {string} xPath XPath expression for selecting nodes with values.
 * @param {string} template The template to populate.
 */
axsFinance.pupulateTemplateAndAnnounce = function(rootNode, xPath,
    template) {
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, rootNode);
  var values = new Array();

  for (var i = 0, length = columns.length; i < length; i++) {
    values[i] = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(
        columns[i]);
    values[i] = axsFinance.parseSpecialCharsAndTokens(values[i]);
  }

  var text = axsFinance.populateTemplate(template, values);
  axsFinance.speakAndGo(rootNode, text);
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

  for (var i = 0, textNode; textNode = textNodes[i]; i++) {
    text = text + textNode.textContent + ' ';
  }

  return text;
};

/**
 * Callback handler for reading elements in the 'Market data' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readMarketData = function(item) {
  var element = item.elem;
  var text = axsFinance.parseSpecialCharsAndTokens(element.textContent);
  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for reading the 'Related companies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRelCompDesc = function(item) {
  var element = item.elem;

  var xPath = 'id("cc-table")//th[contains(@class,"cth-sec") and not(./a)]';
  var headerNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  xPath = './/td[not(.//span[@class="sparkline"])]';
  var valueNodes = axsFinance.axsJAXObj.evalXPath(xPath, element);
  var text = '';

  for (var i = 0, count = headerNodes.length; i < count; i++) {
    text = text + axsFinance.parseSpecialCharsAndTokens(
        headerNodes[i].textContent) +
        ': ' +
        axsFinance.parseSpecialCharsAndTokens(valueNodes[i].textContent) + ', ';
  }

   axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for adding or removing columns in the
 * 'Related companies' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsFinance.focusOnColumnSelectionCategry = function(item) {
  // clear the lens to make the edited field visible
  axsFinance.axsLensObj.view(null);

  axsFinance.axsJAXObj.clickElem(item.elem, false);
};

/**
 * Returns the value of the currently focused header of
 * the 'Related companies' table.
 * @return {string} The header value.
 */
axsFinance.getAddRemoveColumnHeaderValue = function() {
  // we are trapping the TAB and Shift + TAB, so this is safe
  var inputNode = axsFinance.axsJAXObj.lastFocusedNode;
  var xPath = './/ancestor::th';
  var titleNode = axsFinance.axsJAXObj.evalXPath(xPath, inputNode)[0];
  var text = axsFinance.parseSpecialCharsAndTokens(titleNode.textContent);

  if (inputNode.checked) {
    text = text + ' ' + axsFinance.str.SELECTED;
  } else {
    text = text + ' ' + axsFinance.str.NOT_SELECTED;
  }

  return text;
};

/**
 * Handles the DOMNodeInserted event. This method serves as an event dispatch
 * and delegates event processing to specialized event handlers.
 * @param {Event} evt A DOMNodeInserted event.
 */
axsFinance.domNodeInsertedEventDispatch = function(evt) {
  var target = evt.target;

  //We detect special nodes by id
  if (!target.id) {
    return;
  }

  if (target.id === 'cc-table') {

   axsFinance.addColumnHeaderListenersAndRefreshListEventHandler(evt);

  }
};

/**
 * Event handler for adding listeners to the input elements is the header
 * of of the 'Related companies' table. This handler also refreshes the
 * 'Related companies' list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.addColumnHeaderListenersAndRefreshListEventHandler = function(evt) {
  var xPath = 'id("cc-table")/thead//th//input';
  var inputNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  if (inputNodes.length > 0) {
    axsFinance.categoryInputElements = inputNodes;

    var announceValueListener = function(evt) {
      var text = axsFinance.getAddRemoveColumnHeaderValue();
      axsFinance.axsJAXObj.speakTextViaNode(text);
    };

    var stopEditListener = function(evt) {
      if (evt.keyCode == 13) { // ENTER
        evt.target.blur();
        axsFinance.axsJAXObj.speakTextViaNode(
            axsFinance.str.V_TO_SAVE_C_TO_CANCEL);

        // Swallow the event
        evt.stopPropagation();
        evt.preventDefault();
      }
    };

    // add listeners for confirming and announcing the header value
    for (var i = 0, inputNode; inputNode = inputNodes[i]; i++) {
      inputNode.removeEventListener('focus', announceValueListener, true);
      inputNode.addEventListener('focus', announceValueListener, true);

      inputNode.removeEventListener('keypress', stopEditListener, true);
      inputNode.addEventListener('keypress', stopEditListener, true);
    }

    axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.SELECT_COLUMNS);
  } else {
    axsFinance.categoryInputElements = null;
  }
};

/**
 * Handles the focus event of the search box. Avoids focusing of
 * this element performed by the page scripts
 * @param {Event} evt The focus event.
 */
axsFinance.searchBoxKeyHandler = function(evt) {
  if (!axsFinance.searchBoxFocusEnabled) {
    axsFinance.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
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
 * Populates a template replacing special tokens (like {i} where i is is an
 * index) with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} values The array with replacement (concrete) values.
 * @return {string} The string generated from populating the template.
 */
axsFinance.populateTemplate = function(template, values) {
  var sentence = new String(template);
  for (var i = 0, count = values.length; i < count; i++) {
    sentence = sentence.replace('{' + i + '}', values[i]);
  }
  return sentence;
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
 * Event handler for the TAB and Shift + TAB keypress events
 * used for navigation in the current category.
 * @param {Event} evt A keypress event.
 */
axsFinance.tabAndShiftTabWrapEventHandler = function(evt) {
  var target = evt.target;
  var inputs = axsFinance.categoryInputElements;
  var inputsLength = inputs.length;

  var nextInputIndex = -1;

  for (var i = 0, input; input = inputs[i]; i++) {
    if (target === input) {
      nextInputIndex = i;
      break;
    }
  }

  if (evt.shiftKey) {
    nextInputIndex--;
    if (nextInputIndex < 0) {
      nextInputIndex = inputsLength - 1;
    }
  } else {
     nextInputIndex++;
    if (nextInputIndex == inputsLength) {
      nextInputIndex = 0;
    }
  }

  var nextInput = inputs[nextInputIndex];
  nextInput.focus();
  if (nextInput.tagName == 'INPUT') {
    nextInput.select();
  }

  //Swallow the event
  evt.stopPropagation();
  evt.preventDefault();
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event.
 * @return {boolean} If true, indicates that the event should be propagated.
 */
axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (evt.keyCode == 9) { // TAB
    if (axsFinance.categoryInputElements !== null) {
      axsFinance.tabAndShiftTabWrapEventHandler(evt);
    }
  }

  if (axsFinance.axsJAXObj.inputFocused) {
    return true;
  }

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
        var helpStr = axsFinance.HELP + axsFinance.axsNavObj.localHelpString() +
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
window.addEventListener('load', axsFinance.initAxsJAX, true);
