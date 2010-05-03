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
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Sector page of Google Finance.
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
  UP : 'up by',
  UP_ABBR : '+',
  DOWN : 'down by',
  DOWN_ABBR : '-',
  NOT_ANN : 'Not announced',
  NOT_ANN_ABBR : '-',
  PRCNT : 'percent',
  PRCNT_ABBR : '%',
  MILION : ' million',
  MILLION_ABR : 'M',
  BILLION : 'billion',
  BILLION_ABR : 'B',
  TRILION : 'trillion',
  TRILION_ABR : 'T',
  SORTED_BY : 'Sorted by',
  IN_DESCENDING_ORDER : 'in descending order',
  IN_ASCENDING_ORDER : 'in ascending order',
  GOOGLE_FINANCE_SECTOR : 'Google Finance Sector',
  TO : 'to',
  SEARCH_COMPANY : 'Search for row by company name',
  SEARCH_CRITERIA : 'Search for a criteria',
  SEARCH_CRITERIA_VALUE : 'Search for a criteria value',
  SEARCH_CRITERIA_BY_VALUE : 'Search for a criteria by value',
  SECTOR_SECTION_ACTIVE : 'Sector section active.',
  COMPANY_SECTION_ACTIVE : 'Companies section active',
  SUB_CATEGORY : 'sub category',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  MOVER_TEMPLATE : '{0}, {1}, was last traded at {2} with change {3} or {4}.' +
       ' Market capitalization {5}/'
};

/**
 * Map from abbreviated phrases to expanded phrases.
 * @type {Object}
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.NOT_ANN_ABBR] = axsFinance.str.NOT_ANN;

/**
 * Map from prefix characters to strings.
 * @type {Object}
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings.
 * @type {Object}
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;
axsFinance.suffixMap[axsFinance.str.TRILION_ABR] = axsFinance.str.TRILION;
axsFinance.suffixMap[axsFinance.str.BILLION_ABR] = axsFinance.str.BILLION;
axsFinance.suffixMap[axsFinance.str.MILLION_ABR] = axsFinance.str.MILION;
axsFinance.suffixMap[axsFinance.str.PERCENT_ABR] = axsFinance.str.PERCENT;

/**
 * CNR for the 'Sector' section.
 * @type {string}
 */
axsFinance.SECTOR_CNR =
    '<cnr next="RIGHT l" prev="LEFT h">' +

      '<target title="Go to the companies section" hotkey="y" ' +
          'action="CALL:axsFinance.setActiveCompaniesSection">' +
        '/html' +
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

      '<target title="Go to link" hotkey="ENTER">' +
        './/descendant-or-self::a' +
      '</target>' +

      '<target title="Create portfolio from quotes" hotkey="t" ' +
           'onEmpty="No recent quotes.">' +
        'id("rq-create")' +
      '</target>' +

      '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
          ' type="dynamic" onEmpty="No recent quotes">' +

        '<item action="CALL:axsFinance.readRecentQuote">' +
          'id("rq")//tr' +
        '</item>' +

      '</list>' +

       '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" type="dynamic" onEmpty="No recent activities">' +

        '<item>' +
          '//li[@class="ra-entry"]' +
        '</item>' +

      '</list>' +

      '<list title="News" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readNews">' +
          'id("category-news")//div[@class="title"]' +
        '</item>' +

        '<target title="View all news" hotkey="a">' +
          'id("category-news")/div[not(@class)]//a' +
        '</target>' +

      '</list>' +

      '<list title="Top movers gainers" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readTopMover">' +
          '//table[@class="topmovers"]//tr[.//a and not(./preceding-sibling' +
              '::tr[@class="beginsec"])]' +
        '</item>' +

      '</list>' +

      '<list title="Top movers losers" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item action="CALL:axsFinance.readTopMover">' +
          '//table[@class="topmovers"]//tr[.//a and ' +
            './preceding-sibling::tr[@class="beginsec"] and ' +
            './following-sibling::tr[@class="beginsec"]]' +
        '</item>' +

      '</list>' +

      '<list title="Most active" next="DOWN j" prev="UP k" ' +
          'fwd="n" back="p">' +

        '<item action="CALL:axsFinance.readTopMover">' +
          '//table[@class="topmovers"]//tr[.//a and not(./following-sibling' +
              '::tr[@class="beginsec"])]' +
        '</item>' +

      '</list>' +

      '<list title="Subcategories" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p">' +

        '<item>' +
          'id("subcategory")//a' +
        '</item>' +

      '</list>' +

    '</cnr>';

/**
 * CNR for the 'Companies' section.
 */
axsFinance.COMPANIES_CNR =
    '<cnr next="RIGHT l" prev="LEFT h">' +

      '<target title="Go to the sector section" hotkey="s" ' +
          'action="CALL:axsFinance.setActiveSectorSection">' +
        '/html' +
      '</target>' +

      '<target title="Search for row by company name" hotkey="f" ' +
           'action="CALL:axsFinance.goToRow">' +
        '/html' +
      '</target>' +

      '<target title="Search for a criteria" hotkey="c" ' +
          'action="CALL:axsFinance.goToColumn">' +
        '/html' +
      '</target>' +

      '<target title="Search for a criteria value" hotkey="v" ' +
          'action="CALL:axsFinance.goToValueInColumn">' +
        '/html' +
      '</target>' +

      '<target title="Search criteria by value" hotkey="z" ' +
          'action="CALL:axsFinance.goToValueInRow">' +
        '/html' +
      '</target>' +

      '<target title="Go to link" hotkey="ENTER">' +
        './/descendant-or-self::a' +
      '</target>' +

      '<list title="Company" next="DOWN j" prev="UP k" fwd="n" back="p" ' +
          'type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=1 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[./b[text()="Company"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          '//a[.//u[text()="Previous"]] | //div[@class="footerLinks"]' +
        '</target>' +

      '</list>' +

      '<list title="Quote" next="DOWN j" prev="UP k" fwd="n" back="p" ' +
          'type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=2 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Quote"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

      '<list title="Change" next="DOWN j" prev="UP k" fwd="n" back="p" ' +
          'type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=3 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Change"]]' +
        '</target>' +

      '</list>' +

      '<list title="Percent change" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=4 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Change%"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

      '<list title="Market cap" next="DOWN j" prev="UP k" fwd="n" back="p" ' +
          'type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=5 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Market Cap"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

      '<list title="Price to earnings ratio T T M" next="DOWN j" ' +
          'prev="UP k" fwd="n" back="p" type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=6 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="P/E (ttm)"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

      '<list title="Annual revenue" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=7 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Ann. Revenue"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

      '<list title="Annual net income" next="DOWN j" prev="UP k" fwd="n" ' +
          'back="p" type="dynamic">' +

        '<item action="CALL:axsFinance.readCompanyTableCellValue">' +
          'id("main")/tbody/tr/td[position()=8 and @class and not' +
              '(@class="hdg")]' +
        '</item>' +

        '<target title="Go to section" trigger="listEntry" ' +
            'action="CALL:axsFinance.readCompanyTableCellValueListEntry">' +
          '/html' +
        '</target>' +

        '<target title="Reverse sorting order" hotkey="r">' +
          'id("main")//a[.//nobr[text()="Ann. Net Income"]]' +
        '</target>' +

        '<target title="Next page" trigger="listTail">' +
           'id("navbar")//a[not(./../following-sibling::*)]' +
        '</target>' +

        '<target title="Previous page" trigger="listHead">' +
          'id("navbar")//a[not(./../preceding-sibling::*)]' +
        '</target>' +

      '</list>' +

    '</cnr>';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation in
 * the 'Sector' section.
 * @type AxsNav?
 */
axsFinance.axsNavSectorObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation in
 * the 'Companies' section.
 * @type AxsNav?
 */
axsFinance.axsNavCompaniesObj = null;

/**
 * Handle to the currently active AxsNav object.
 * @type {AxsNav?}
 */
axsFinance.activeAxsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsFinance.axsLensObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsFinance.axsSoundObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsFinance.powerKeySectorObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsFinance.powerKeyCompaniesObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

/**
 * Array of DOM elements members of a category. Used for restricting the
 * TAB, Shift + TAB into this category.
 * @type {Array?}
 */
axsFinance.categoryInputElements = null;

/**
 * Flag indicating if the Currency converter is active.
 * @type {boolean}
 */
axsFinance.currencyConverterOpened = false;

/**
 * Stores the row list index to enable handling the multiple lists that compose
 * the companies as a table i.e. traversal is performed column by column on the
 * same row (i.e. the current row does not change)
 */
axsFinance.companiesRowIdx = -1;

/**
 * Stores the index of the previous list in the 'Companies' section. Each column
 * of the companies table is a separate list. However, the user can navigate in
 * the companies table using the arrows and this separation in lists is
 * transparent. This index helps identifying when to play a wrap sound while
 * switching the lists.
 */
axsFinance.prevCompaniesListIdx = 0;

/**
 * Initializes the AxsJAX script for Google Finance - Sector page.
 */
axsFinance.initAxsJAX = function() {
  //Initialize AxsJAX object
  axsFinance.axsJAXObj = new AxsJAX(true);

  //Initialize AxsNav objects
  axsFinance.axsNavSectorObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavSectorObj.navInit(axsFinance.SECTOR_CNR, null);
  axsFinance.axsNavSectorObj.disableNavKeys();

  axsFinance.axsNavCompaniesObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavCompaniesObj.navInit(axsFinance.COMPANIES_CNR, null);
  axsFinance.axsNavCompaniesObj.disableNavKeys();

  //Set the active AxsNav
  axsFinance.setActiveCompaniesSection();

  //Initialize AxsLens object
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
  axsFinance.axsNavSectorObj.setLens(axsFinance.axsLensObj);
  axsFinance.axsNavCompaniesObj.setLens(axsFinance.axsLensObj);

  //Initialize PowerKey objects
  axsFinance.powerKeySectorObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavSectorObj.setPowerKey(axsFinance.powerKeySectorObj, '.');

  axsFinance.powerKeyCompaniesObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavCompaniesObj.
      setPowerKey(axsFinance.powerKeyCompaniesObj, '.');

  //Initialize AxsSouns object
  axsFinance.axsSoundObj = new AxsSound(true);
  axsFinance.axsNavSectorObj.setSound(axsFinance.axsSoundObj);
  axsFinance.axsNavCompaniesObj.setSound(axsFinance.axsSoundObj);

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);

  document.addEventListener('DOMNodeInserted',
      axsFinance.refreshRecentQuotesEventListener, false);

  var searchBox = document.getElementById('searchbox');
  var func = axsFinance.initialFocusWorkaroundEventHandler;
  searchBox.addEventListener('keypress', func, true);

  window.setTimeout(axsFinance.announceIntroduction, 0);
};

/**
 * Announces the introduction.
 */
axsFinance.announceIntroduction = function() {
  var text = axsFinance.str.GOOGLE_FINANCE_SECTOR + '.';

  var xPath = '(//h3)[1]';
  var sectorElem = axsFinance.axsJAXObj.evalXPath(xPath, document. body)[0];
  var sector = axsFinance.normalizeString(sectorElem.textContent);
  //In case the page represents a sector sub-category
  sector = sector.replace('>', axsFinance.str.SUB_CATEGORY);
  text = text + ' ' + sector + '.';

  xPath = '(id("main")//tr)[1]';
  var resultElem = axsFinance.axsJAXObj.evalXPath(xPath, document. body)[0];
  var result = resultElem.textContent.replace('-', axsFinance.str.TO);
  result = result.substring(0, result.indexOf('in') - 1) + '.';
  text = text + ' ' + result;

  xPath = '//img[contains(@src, "sort_up.gif") or ' +
      'contains(@src, "sort_down.gif")]';
  var sortImage = axsFinance.axsJAXObj.evalXPath(xPath, document. body)[0];
  if (sortImage) {
    xPath = '//tr[@class="hdg"]/td[not(preceding-sibling::td//' +
        'img[contains(@src, "sort")])]';
    var index = axsFinance.axsJAXObj.evalXPath(xPath, document.body).length - 1;

    //Position on the top of the sorted column
    axsFinance.activeAxsNavObj.navListIdx = index;

    var criteria = axsFinance.activeAxsNavObj.navArray[index].title;
    text = text + ' ' + axsFinance.str.SORTED_BY + ' ' + criteria;
    if (sortImage.src.indexOf('up') > -1) {
      text = text + ' ' + axsFinance.str.IN_ASCENDING_ORDER;
    } else {
      text = text + ' ' + axsFinance.str.IN_DESCENDING_ORDER;
    }
  }

  axsFinance.axsJAXObj.speakTextViaNode(text);
};

/**
 * This is a listener that refreshed the 'Recent quotes' list
 * and is registered for the event of inserting the recent quotes
 * table.
 *
 * @param {Event} evt A DOMNodeInserted event.
 */
axsFinance.refreshRecentQuotesEventListener = function(evt) {
  if (evt.target.className === 'd-quotes') {
    axsFinance.axsNavObj.refreshList('Recent quotes');
  }
};

/**
 * Callback handler for reading the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readNews = function(item) {
  var title = item.elem;
  var xPath = './following-sibling::div';
  var description = axsFinance.axsJAXObj.evalXPath(xPath, title)[0];

  var text = axsFinance.normalizeString(title.textContent) + ' ' +
      axsFinance.normalizeString(description.textContent);
  axsFinance.speakAndGo(title, text);
};

/**
 * Focuses on and reads the appropriate entry in the results table. Since each
 * column is managed as a list changing columns should keep the user
 * on the same row.
 */
axsFinance.readCompanyTableCellValueListEntry = function() {
  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
  if (axsFinance.companiesRowIdx > -1) {
    axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx] =
        axsFinance.companiesRowIdx;
  }

  var element = axsFinance.axsNavCompaniesObj.currentItem().elem;
  var columnValue = axsFinance.getCellValue(element);
  var title = axsFinance.axsNavCompaniesObj.navArray[navListIdx].title;

  var text = title + ' ' + columnValue;
  axsFinance.speakAndGo(element, text);

  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
  var listsNmbr = axsFinance.axsNavCompaniesObj.navArray.length;
  if ((axsFinance.prevCompaniesListIdx === 0 && navListIdx === listsNmbr - 1) ||
      (axsFinance.prevCompaniesListIdx === listsNmbr - 1 && navListIdx === 0)) {
    axsFinance.axsSoundObj.play('wrap');
  } else {
    axsFinance.axsSoundObj.play('item');
  }
  axsFinance.prevCompaniesListIdx = navListIdx;
};

/**
 * Reads the value for a certain criteria from the results table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCompanyTableCellValue = function(item) {
  var element = item.elem;
  var company = element.parentNode.childNodes[1].textContent;
  company = axsFinance.normalizeString(company);

  var text = company;
  if (element !== element.parentNode.childNodes[1]) {
    var columnValue = axsFinance.getCellValue(element);
    text = text + ', ' + columnValue;
  }

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
  axsFinance.companiesRowIdx =
      axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx];

  axsFinance.speakAndGo(element, text);
};

/**
 * Reads an item from the 'Recent quotes' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuote = function(item) {
  axsFinance.readNodeDescendantsViaTemplate(item.elem, './td[not(.//b)]',
      axsFinance.str.RECENT_QUOTE_TEMPLATE);
};

/**
 * Reads an item from the 'Top gainers'/'Top losers'/'Most active' lists.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTopMover = function(item) {
  axsFinance.readNodeDescendantsViaTemplate(item.elem,
      '. //*[self::td[not(.//span)] or self::span]',
      axsFinance.str.MOVER_TEMPLATE);
};

/**
 * Reads the descendants of a given node selected via an XPath and populating
 * their values is a template.
 * @param {Node} rootNode The root node from which to evaluate the XPath.
 * @param {string} xPath The XPath.
 * @param {string} template The template.
 */
axsFinance.readNodeDescendantsViaTemplate = function(rootNode, xPath,
    template) {
  var childNodes = axsFinance.axsJAXObj.evalXPath(xPath, rootNode);
  var values = new Array();

  for (var i = 0, childNode; childNode = childNodes[i]; i++) {
    values[i] = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(
        childNode);
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

  for (var i = 0, count = textNodes.length; i < count; i++) {
    text = text + textNodes[i].textContent + ' ';
  }

  return text;
};

/**
 * Returns the current value in a table cell.
 * @param {Node} element A DOM node object representing the table cell.
 * @return {string} The value of the table cell.
 */
axsFinance.getCellValue = function(element) {
  var columnValue = element.textContent;
  if (element == element.parentNode.firstChild) {
    columnValue = axsFinance.normalizeString(columnValue);
  } else {
    columnValue = axsFinance.parseSpecialCharsAndTokens(columnValue);
  }
  return columnValue;
};

/**
 * Event handler for the very first 'keypress' event accepted by the
 * search box. The default implementation focuses on the search box.
 * This behavior is undesirable since we do not want a blind user to
 * get stuck in the search box.
 * @param {Event} evt A focus event.
 */
axsFinance.initialFocusWorkaroundEventHandler = function(evt) {
  //Interrupt the TTS
  axsFinance.axsJAXObj.speakTextViaNode('');

  //Swallow the event to prevent default behavior
  evt.target.blur();
  evt.stopPropagation();
  evt.preventDefault();

  //If the key was mapped to a function => execute it
  var command = axsFinance.activeAxsNavObj.getFunctionForKey(evt.keyCode,
                                                            evt.charCode);
  if (command) {
    command();
  }

  //This handler is applicable only to the first keypress event
  var func = axsFinance.initialFocusWorkaroundEventHandler;
  var searchBox = document.getElementById('searchbox');
  searchBox.removeEventListener('keypress', func, true);
};

/**
 * Sets axsNavSectorObj as active.
 */
axsFinance.setActiveSectorSection = function() {
  axsFinance.setActiveAxsNavObj(axsFinance.axsNavSectorObj);
  axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.SECTOR_SECTION_ACTIVE);
};

/**
 * Sets axsNavCompaniesObj as active.
 */
axsFinance.setActiveCompaniesSection = function() {
  axsFinance.setActiveAxsNavObj(axsFinance.axsNavCompaniesObj);
  axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.COMPANY_SECTION_ACTIVE);
};

/**
 * Sets the active AxsNav object.
 * @param {AxsNav?} axsNavObj The axsNav object to be set as active.
 */
axsFinance.setActiveAxsNavObj = function(axsNavObj) {
  if (axsFinance.activeAxsNavObj !== null) {
    axsFinance.activeAxsNavObj.disableNavKeys();
  }

  axsNavObj.enableNavKeys();
  axsFinance.activeAxsNavObj = axsNavObj;
};

/**
 * Positions the focus on the row with company name found by PowerKey.
 * We treat the company name as a row title.
 * NOTE: The column in which the user is does not change.
 */
axsFinance.goToRow = function() {
  axsFinance.setActiveAxsNavObj(axsFinance.axsNavCompaniesObj);

  var items = axsFinance.axsNavCompaniesObj.navArray[0].items;
  var elementNames = new Array();

  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = axsFinance.normalizeString(item.elem.textContent);
  }

  var promptString = axsFinance.str.SEARCH_COMPANY;
  axsFinance.goToItem(axsFinance.pkVerticalSearchHandler,
                     elementNames,
                     promptString);
};

/**
 * Positions the focus on the column with criteria name found by PowerKey.
 * We use the table column names.
 * NOTE: The row in which the user is does not change.
 */
axsFinance.goToColumn = function() {
  if (axsFinance.activeAxsNavObj !== axsFinance.axsNavCompaniesObj) {
    axsFinance.setActiveAxsNavObj(axsFinance.axsNavCompaniesObj);
    var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
    axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx] = 0;
  }

  var xPath = 'id("main")//tr[@class="hdg"]//b';
  var elements = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  var elementNames = new Array();

  for (var i = 0, element; element = elements[i]; i++) {
    elementNames[i] = axsFinance.normalizeString(element.textContent);
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA;
  axsFinance.goToItem(axsFinance.pkHorizontalSearchHandler,
                     elementNames,
                     promptString);
};

/**
 * Positions the focus on a column cell with value found by PowerKey.
 * NOTE: The column in which the user is does not change.
 */
axsFinance.goToValueInColumn = function() {
  axsFinance.setActiveAxsNavObj(axsFinance.axsNavCompaniesObj);

  var items = axsFinance.axsNavCompaniesObj.currentList().items;
  var elementNames = new Array();

  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = axsFinance.normalizeString(item.elem.textContent);
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA_VALUE;
  axsFinance.goToItem(axsFinance.pkVerticalSearchHandler,
                     elementNames,
                     promptString);
};

/**
 * Positions the focus on a row cell with value found by PowerKey.
 * NOTE: The row in which the user is does not change.
 */
axsFinance.goToValueInRow = function() {
  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;

  if (axsFinance.activeAxsNavObj !== axsFinance.axsNavCompaniesObj) {
    axsFinance.setActiveAxsNavObj(axsFinance.axsNavCompaniesObj);
    axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx] = 0;
  }

  var rowIndex = axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx];
  var elementNames = new Array();

  for (var i = 0, list; list = axsFinance.axsNavCompaniesObj.navArray[i]; i++) {
    var content = list.items[rowIndex].elem.textContent;
    elementNames[i] = axsFinance.normalizeString(content);
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA_BY_VALUE;
  axsFinance.goToItem(axsFinance.pkHorizontalSearchHandler,
                     elementNames,
                     promptString);
};

/**
 * Enables PowerKey search from element names and in case of a successful
 * search delegates to a handler.
 * @param {Function} handler Handler to process the found element.
 * @param {Array} elementNames The array of names searched by PowerKey.
 * @param {string} promptString The prompt message shown in the PowerKey
 * input box.
 */
axsFinance.goToItem = function(handler, elementNames, promptString) {
  var powerKey = new PowerKey('list', axsFinance.axsJAXObj);

  var parentElem = axsFinance.axsJAXObj.getActiveDocument().body;
  //Different handlers are used. The handler is attached via anonymous function
  //and cannot be replaced dynamically => recreating the completion field
  powerKey.createCompletionField(parentElem,
                                 30,
                                 handler,
                                 null,
                                 elementNames,
                                 false);

  powerKey.setCompletionPromptStr(promptString);
  powerKey.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();

  powerKey.updateCompletionField('visible', true, 40, 20);
};

/**
 * Positions the user in a companies table column with index found by PowerKey
 * and at the same time keeps the current row.
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsFinance.pkHorizontalSearchHandler = function(command, index, id, args) {
  axsFinance.axsNavCompaniesObj.lastItem = null;

  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
  var itemIndex = axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx];
  axsFinance.axsNavCompaniesObj.navListIdx = index;
  axsFinance.axsNavCompaniesObj.navItemIdxs[index] = itemIndex;

  var item = axsFinance.axsNavCompaniesObj.currentItem();
  axsFinance.axsNavCompaniesObj.actOnItem(item);
};

/**
 * Positions the user in a row cell that contains value that found
 * during the power key search. (i.e. search by column value)
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsFinance.pkVerticalSearchHandler = function(command, index, id, args) {
  axsFinance.axsNavCompaniesObj.lastItem = null;

  var navListIdx = axsFinance.axsNavCompaniesObj.navListIdx;
  axsFinance.axsNavCompaniesObj.navItemIdxs[navListIdx] = index;

  var item = axsFinance.axsNavCompaniesObj.currentItem();
  axsFinance.axsNavCompaniesObj.actOnItem(item);
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
 * Adds white spaces between the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its
 * characters.
 */
axsFinance.addSpaceBetweenChars = function(text) {
  var textWithSpaces = '';
  for (var i = 0; i < text.length; i++) {
    textWithSpaces = textWithSpaces + ' ' + text.charAt(i);
  }
  //Remove the first white space
  textWithSpaces = textWithSpaces.replace(' ', '');
  return textWithSpaces;
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
 * @return {string} The normalized text.
 */
axsFinance.normalizeString = function(text) {
  var normalizedStr = new String(text);
  //remove leading and trailing spaces
  normalizedStr = normalizedStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  normalizedStr = normalizedStr.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return normalizedStr.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Populates a template replacing special tokens (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} phrases The array with replacement (concrete) values.
 * @return {string} The populated template.
 */
axsFinance.populateTemplate = function(template, phrases) {
  var populatedTemplate = new String(template);
  for (var i = 0, value; i < phrases.length; i++) {
    var regExp = new RegExp('\{(' + i + ')\}', 'g');
    populatedTemplate = populatedTemplate.replace(regExp, phrases[i]);
  }
  return populatedTemplate;
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
    if (axsFinance.axsJAXObj.lastFocusedNode) {
      axsFinance.axsJAXObj.lastFocusedNode.blur();
    }
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

  var command = axsFinance.charCodeMap[evt.charCode];
  if (command) {
    return command();
  }

  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate that the keycode
 * has been handled.
 */
axsFinance.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
  47 : function() {
        document.getElementById('searchbox').focus();
        document.getElementById('searchbox').select();
        return false;
      },
  // ? (question mark)
  63 : function() {
        var helpStr = axsFinance.HELP +
            axsFinance.axsNavSectorObj.localHelpString() +
            axsFinance.axsNavSectorObj.globalHelpString();
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
