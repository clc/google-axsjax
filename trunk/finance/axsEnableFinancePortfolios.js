// Copyright 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Portfolios page of Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Object that contains all string literal used for enhancing the presentation.
 * @type {Object}
 */
axsFinance.str = {
  UP_ABBR : '+',
  UP : 'up by ',
  DOWN_ABBR : '-',
  DOWN : 'down by ',
  PRCNT_ABBR : '%',
  PRCNT : 'percent',
  MILLION_ABBR : 'M',
  MILLION : 'million',
  BILLION : 'billion',
  BILLION_ABBR : 'B',
  TRILLION_ABBR : 'T',
  TRILLION : 'trillion',
  MARKET_ABBR : 'Mkt',
  MARKET : 'Market',
  CAP_ABBR : 'cap',
  CAP : 'capitalization',
  AVRG_ABBR : 'Avg',
  AVRG : 'average',
  VOL_ABBR : 'vol',
  VOL : 'volume',
  WEEK_HIGH_ABBR : '52wk',
  WEEK_HIGH : '52 week',
  EPS_ABBR : 'EPS',
  EPS : 'earnings per share',
  PE_ABBR : 'P/E',
  PE : 'price to earnings',
  ONE_WEEK_ABBR : '1w',
  ONE_WEEK : 'one week',
  FOUR_WEEK_ABBR : '4w',
  FOUR_WEEK : 'four week',
  THREE_MONTH_ABBR : '3m',
  THREE_MONTH : 'three month',
  YTD_ABBR : 'YTD',
  YTD : 'year to date',
  ONE_YEAR_ABBR : '1y',
  ONE_YEAR : 'one year',
  THREE_YEAR_ABBR : '3y',
  THREE_YEAR : 'three year',
  FIVE_YEAR_ABBR : '5y',
  FIVE_YEAR : 'five year',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  GOOGLE_FINANCE : 'Google Finance',
  ENTER_TO_EDIT_AND_CONFIRM : 'Press Enter to edit, Tab to traverse, and ' +
      'Enter to confirm.',
  TRANSACTION_CONFIRMED : 'Transaction confirmed',
  TAB_ACTIVE : 'tab active'
};

/**
 * The CNR for the page.
 * @type {string}
 */
axsFinance.CNR_PORTFOLIOS = '<cnr next="RIGHT l" prev="LEFT h">' +

  '<target title="Add transaction" hotkey="a" ' +
      'action="CALL:axsFinance.focusOnTransactionSection">' +
    'id("add_symbols")' +
  '</target>' +

  '<target title="Markets" hotkey="m">' +
    '(//li[@class="nav-item"])[1]//a' +
  '</target>' +

  '<target title="News" hotkey="e">' +
    '(//li[@class="nav-item"])[2]//a' +
  '</target>' +

  '<target title="Stock screener" hotkey="s">' +
    '(//li[@class="nav-item"])[3]//a' +
  '</target>' +

  '<target title="Google domestic trends" hotkey="g">' +
    '(//li[@class="nav-item"])[4]//a' +
  '</target>' +

  '<target title="Go to link" hotkey="ENTER">' +
    './/descendant-or-self::a' +
  '</target>' +

  '<list title="Portfolios" next="DOWN j" prev="UP k" fwd="n" back="p"' +
      ' type="dynamic">' +

    '<item>' +
      '//li[@class="navsub"]/a' +
    '</item>' +

  '</list>' +

  '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
      ' type="dynamic" onEmpty="No recent quotes">' +

    '<item action="CALL:axsFinance.readRecentQuote">' +
      'id("rq")//tr' +
    '</item>' +

    '<target title="Create portfolio from quotes" hotkey="t" ' +
        'onEmpty="No recent quotes.">' +
      'id("rq-create")' +
    '</target>' +

  '</list>' +

  '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic" onEmpty="No recent activities">' +

    '<item>' +
      '//li[@class="ra-entry"]//a' +
    '</item>' +

  '</list>' +

  '<list title="Transactions" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic">' +

    '<item action="CALL:axsFinance.readTransaction">' +
      'id("pf-view-table")/table/tbody/tr' +
    '</item>' +

    '<target title="Overview" hotkey="o">' +
      'id("pf-overview")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Fundamentals" hotkey="f">' +
      'id("pf-fundamentals")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Performance" hotkey="p">' +
      'id("pf-perf")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Returns" hotkey="r">' +
      'id("pf-returns")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Transactions" hotkey="t">' +
      'id("pf-trans")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Edit transactions" hotkey="x">' +
      // inconsistency in the DOM - some sibling links have id
      '(//div[contains(@class,"gf-table-control-plain")]//a)[2]' +
    '</target>' +

    '<target title="Edit portfolio" hotkey="y">' +
      // inconsistency in the DOM - some sibling links have id
      '(//div[contains(@class,"gf-table-control-plain")]//a)[3]' +
    '</target>' +

    '<target title="Delete portfolio" hotkey="DEL">' +
      'id("delete-portfolio-link")' +
    '</target>' +

    '<target title="Download to spread sheet" hotkey="d">' +
      'id("download")' +
    '</target>' +

    '<target title="Download to OFX" hotkey="w">' +
      'id("download_ofx")' +
    '</target>' +

  '</list>' +

  '<list title="Portfolio related news" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p">' +

    '<item>' +
      '//div[@class="sfe-section news"]/div' +
    '</item>' +

    '<target title="All portfolio related news" hotkey="n">' +
      '//div[@class="sfe-section news"]/a' +
    '</target>' +

    '<target title="Related articles" hotkey="r">' +
      './/a[@class="more-rel"]' +
    '</target>' +

  '</list>' +

  '<list title="Events" next="DOWN j" prev="UP k" fwd="n" back="p" ' +
      'type="dynamic" noEmpty="No events">' +

    '<item>' +
      'id("upcoming_div")[not(contains(@style,"display: none;"))]' +
          '//div[@class="event"]' +
    '</item>' +

    '<item>' +
      'id("past_div")[contains(@style,"display:") and ' +
          'not(contains(@style,"display: none;"))]//div[@class="event"]' +
    '</item>' +

    '<item>' +
      '//div[@id="upcoming_div" and not(contains(@style,"display: ' +
          'none;"))]//a[@id="add-events-to-calendar" and not(./img)]' +
    '</item>' +

    '<target title="Upcoming" hotkey="u">' +
      'id("upcoming")[@class="nac"]' +
    '</target>' +

    '<target title="Past" hotkey="p">' +
      'id("past")[@class="nac"]' +
    '</target>' +

  '</list>' +

  '<list title="Edit transactions" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic" noEmpty="No transactions">' +

    '<item action="CALL:axsFinance.readEditableTransaction">' +
      '//tr[contains(@id,"tedit_")]' +
    '</item>' +

    '<target title="Save" hotkey="v">' +
      // no better way to identify the node
      '//input[@value="Save changes"]' +
    '</target>' +

    '<target title="Cancel" hotkey="c">' +
      // no better way to identify the node
      '//input[@value="Cancel"]' +
    '</target>' +

    '<target title="Overview" hotkey="o">' +
      'id("pf-overview")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Fundamentals" hotkey="f">' +
      'id("pf-fundamentals")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Performance" hotkey="p">' +
      'id("pf-perf")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Returns" hotkey="r">' +
      'id("pf-returns")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Transactions" hotkey="t">' +
      'id("pf-trans")[not(parent::div[contains' +
          '(@class,"goog-tab-selected")])]' +
    '</target>' +

    '<target title="Edit transactions" hotkey="x">' +
      // inconsistency in the DOM - some sibling links have id
      '(//div[contains(@class,"gf-table-control-plain")]//a)[1]' +
    '</target>' +

    '<target title="Edit portfolio" hotkey="y">' +
      // inconsistency in the DOM - some sibling links have id
      '(//div[contains(@class,"gf-table-control-plain")]//a)[2]' +
    '</target>' +

    '<target title="Delete portfolio" hotkey="DEL">' +
      'id("delete-portfolio-link")' +
    '</target>' +

    '<target title="Download to spread sheet" hotkey="d">' +
      'id("download")' +
    '</target>' +

    '<target title="Download to OFX" hotkey="w">' +
      'id("download_ofx")' +
    '</target>' +

  '</list>' +

  '<list title="Edit portfolio" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic" noEmpty="No transactions">' +

    '<item action="CALL:axsFinance.focusOnProfileCategory">' +
      'id("pform")[.//textarea]' +
    '</item>' +

  '</list>' +

'</cnr>';

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.MARKET_ABBR] = axsFinance.str.MARKET;
axsFinance.phrasesMap[axsFinance.str.CAP_ABBR] = axsFinance.str.CAP;
axsFinance.phrasesMap[axsFinance.str.AVRG_ABBR] = axsFinance.str.AVRG;
axsFinance.phrasesMap[axsFinance.str.VOL_ABBR] = axsFinance.str.VOL;
axsFinance.phrasesMap[axsFinance.str.WEEK_HIGH_ABBR] = axsFinance.str.WEEK_HIGH;
axsFinance.phrasesMap[axsFinance.str.EPS_ABBR] = axsFinance.str.EPS;
axsFinance.phrasesMap[axsFinance.str.PE_ABBR] = axsFinance.str.PE;

axsFinance.phrasesMap[axsFinance.str.ONE_WEEK_ABBR] = axsFinance.str.ONE_WEEK;
axsFinance.phrasesMap[axsFinance.str.FOUR_WEEK_ABBR] = axsFinance.str.FOUR_WEEK;
axsFinance.phrasesMap[axsFinance.str.THREE_MONTH_ABBR] =
    axsFinance.str.THREE_MONTH;
axsFinance.phrasesMap[axsFinance.str.YTD_ABBR] = axsFinance.str.YTD;
axsFinance.phrasesMap[axsFinance.str.ONE_YEAR_ABBR] = axsFinance.str.ONE_YEAR;
axsFinance.phrasesMap[axsFinance.str.THREE_YEAR_ABBR] =
    axsFinance.str.THREE_YEAR;
axsFinance.phrasesMap[axsFinance.str.FIVE_YEAR_ABBR] = axsFinance.str.FIVE_YEAR;

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.BILLION_ABBR] = axsFinance.str.BILLION;
axsFinance.suffixMap[axsFinance.str.MILLION_ABBR] = axsFinance.str.MILLION;
axsFinance.suffixMap[axsFinance.str.TRILLION_ABBR] = axsFinance.str.TRILLION;
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object which provides page navigation.
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
axsFinance.axsSoundObj = null;

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
 * Array with input elements for editing a transaction.
 * @type {Array}
 */
axsFinance.editTransactionInputNodes = null;

/**
 * The titles or columns in the 'Transactions' table.
 * {Array}
 */
axsFinance.transactionColumnTitles = null;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsFinance.initAxsJAX = function() {
    //Initialize AxsJAX object
    axsFinance.axsJAXObj = new AxsJAX(true);

    //Initialize AxsNav object
    axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
    axsFinance.axsNavObj.navInit(axsFinance.CNR_PORTFOLIOS, null);

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
    document.addEventListener('DOMSubtreeModified',
        axsFinance.DOMSubtreeModifiedEventDispatch, true);
    document.addEventListener('DOMNodeInserted',
            axsFinance.DOMNodeInsertedEventDispatch, true);

    axsFinance.addInitialFocusHandlingEventHandler();
    axsFinance.announceIntro();
    axsFinance.configureEditTransactionSection();
};

/**
 * Announces the introduction of the page.
 */
axsFinance.announceIntro = function() {
  var xPath = '//h3';
  var title = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  var text = axsFinance.str.GOOGLE_FINANCE + '. ' +
      axsFinance.normalizeString(title.textContent) + '. ';

  xPath = 'id("pf-tabs")//div[contains(@class,"goog-tab-selected")]//a';
  var activeCategory = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  if (activeCategory) {
    text = text + axsFinance.normalizeString(activeCategory.textContent) + ' ' +
    axsFinance.str.TAB_ACTIVE + '. ';
  }

  var xPath = 'id("pf-invalid_trans_alert")';
  var warningNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  if (warningNode) {
    text = text + axsFinance.normalizeString(warningNode.textContent);
  }

  axsFinance.axsJAXObj.speakTextViaNode(text);
};

/**
 * Installs an event handler that blurs the initially focused
 * input element as soon as the focus occurs so the user can
 * navigate around the page. This listener removes itself as
 * soon as the very first focus event is handled.
 */
axsFinance.addInitialFocusHandlingEventHandler = function() {
  var addSymbolNode = document.getElementById('add_symbols');
  var focusListener = function(evt) {
    addSymbolNode.removeEventListener('focus', focusListener, false);
    addSymbolNode.blur();
  };
  addSymbolNode.addEventListener('focus', focusListener, false);
};

/**
 * Caches the column titles in the 'Transactions' table.
 */
axsFinance.cacheTransactionColumnTitles = function() {
  var xPath = '//*[@id="pf-view-table" or @id="tedit_t"]//th[text()]';
  var titleNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  var titles = new Array();
  for (var i = 0, titleNode; titleNode = titleNodes[i]; i++) {
    titles.push(axsFinance.parseSpecialCharsAndTokens(
        titleNode.firstChild.textContent));
  }

  axsFinance.transactionColumnTitles = titles;
};

/**
 * Loads the titles of input elements for editing a transaction.
 */
axsFinance.configureEditTransactionSection = function() {
  // set reasonable title of the input nodes
  var xPath = 'id("aform")//div[./input[@id="add_symbols"]] | ' +
      'id("aform")//th | id("cash_sync_message")';
  var titleNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  xPath = 'id("aform")//*[(self::select or self::input) and ' +
      'not(@type="hidden") and not(@type="submit")]';
  var inputNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  for (var i = 0, inputNode; inputNode = inputNodes[i]; i++) {
    axsFinance.setInputNodeTitleOrLabelForAnnouncement(inputNode,
      axsFinance.normalizeString(titleNodes[i].textContent));
  }

  // we are now trapping the TAB/Shift + TAB over these nodes
  axsFinance.editTransactionInputNodes = inputNodes;

  // expand the section
  xPath = 'id("pf-add-trans-toggle-btn")//span[@class="linkbtn"]';
  var expandLink = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  window.setTimeout(function() {
        axsFinance.axsJAXObj.clickElem(expandLink, false);
      }, 0);
};

/**
 * Sets the title or label (depending on the node type) of an input node so
 * the screen reader announces it correctly while traversing via TAB.
 * @param {Node} inputNode The input node.
 * @param {string} text The text for the title/label.
 */
axsFinance.setInputNodeTitleOrLabelForAnnouncement = function(inputNode, text) {
  if (inputNode.tagName === 'SELECT') {
    var labelNode = document.createElement('LABEL');
    labelNode.setAttribute('for', inputNode.id);
    labelNode.appendChild(document.createTextNode(text));
    labelNode.style.display = 'none';
    inputNode.parentNode.insertBefore(labelNode, inputNode);
  } else {
    inputNode.setAttribute('title', text);
  }
};

/**
 * Reads items from the 'Transactions' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTransaction = function(item) {
  var row = item.elem;
  var xPath = './/td[not(contains(@class,"chk"))]';
  var valueNodes = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var text = axsFinance.getTransactionRowValue(valueNodes);
  axsFinance.speakAndGo(row, text);
};

/**
 * Reads items from the 'Transactions' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readEditableTransaction = function(item) {
  var row = item.elem;

  var xPath = './/*[(self::a or self::select or self::input) and ' +
      'not(@type="hidden")]';
  var valueNodes = axsFinance.axsJAXObj.evalXPath(xPath, row);

  var editOrConfirmEventhandler = function(evt) {

    if (evt.keyCode === 13) { // ENTER

        // PowerKey does't swallow Enter on selection of an option - workaround
        var powerKeyFloatElement = axsFinance.powerKeyObj.cmpFloatElement;
        if (powerKeyFloatElement.className === 'pkVisibleStatus') {
          // swallow the event
          evt.stopPropagation();
          evt.preventDefault();
          return true;
        }

        // make sure only the current row is reacting or listener not needed
        if (axsFinance.axsNavObj.currentItem().elem !== row) {
          document.removeEventListener('keydown',
              editOrConfirmEventhandler, true);
          return;
         }

        if (axsFinance.categoryInputElements === null) {
          var inputs = new Array();
           for (var i = 0, valueNode; valueNode = valueNodes[i]; i++) {
            if (valueNode.tagName === 'INPUT' ||
                valueNode.tagName === 'SELECT') {
              inputs.push(valueNode);
              axsFinance.setInputNodeTitleOrLabelForAnnouncement(valueNode,
                  axsFinance.transactionColumnTitles[i]);
            }
           }
           axsFinance.categoryInputElements = inputs;
           // clear the lens
           axsFinance.axsLensObj.view(null);

           // trap the TAB/Shift + TAB over these nodes.
           axsFinance.categoryInputElements = inputs;
           inputs[0].focus();
      } else {
        axsFinance.categoryInputElements = null;

        window.setTimeout(function() {
          axsFinance.axsJAXObj.lastFocusedNode.blur();
          axsFinance.categoryInputElements = null;
          axsFinance.axsJAXObj.speakTextViaNode(
                  axsFinance.str.TRANSACTION_CONFIRMED);
        }, 0);
      }
      // swallow the event
       evt.stopPropagation();
       evt.preventDefault();
    }
  };

  // we want the event before AxsNAV so attach the listener to the document
  document.removeEventListener('keydown', editOrConfirmEventhandler, true);
  document.addEventListener('keydown', editOrConfirmEventhandler, true);

  var text = axsFinance.getTransactionRowValue(valueNodes) +
    axsFinance.str.ENTER_TO_EDIT_AND_CONFIRM;

  axsFinance.speakAndGo(row, text);
};

/**
 * Gets the value of a row in the 'Transaction' table given its cells.
 * This function is prepending the header of the column before each cell value
 * node.
 * @param {Array} valueNodes The row cell value nodes.
 * @return {string} The text value of the row.
 */
axsFinance.getTransactionRowValue = function(valueNodes) {

  if (axsFinance.transactionColumnTitles === null) {
    axsFinance.cacheTransactionColumnTitles();
  }

  var text = '';
  for (var i = 0, valueNode; valueNode = valueNodes[i]; i++) {
    var title = axsFinance.transactionColumnTitles[i];
    var value = '';

    if (valueNode.tagName === 'INPUT' && valueNode.type === 'checkbox') {
      value = valueNode.checked ? 'checked' : 'not checked';
    } else if (valueNode.tagName === 'INPUT' && valueNode.type === 'text') {
      value = valueNode.value;
    } else if (valueNode.tagName === 'SELECT') {
      var optionNodes = valueNode.getElementsByTagName('OPTION');
      value = optionNodes[valueNode.selectedIndex].textContent;
    } else {
      value = valueNode.textContent;
    }

    text = text + axsFinance.parseSpecialCharsAndTokens(title) + ' ' +
      axsFinance.parseSpecialCharsAndTokens(value) + ', ';
  }

  return text;
};

/**
 * Opens the 'Edit portfolio' category.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.focusOnProfileCategory = function(item) {
  var element = item.elem;

  var xPath = './/*[self::input[not(@type="hidden")] or self::select ' +
      'or self::textarea]';
  var inputNodes = axsFinance.axsJAXObj.evalXPath(xPath, element);

  var clearCategoryhandler = function(evt) {
    axsFinance.categoryInputElements = null;
    element.removeEventListener('blur', clearCategoryhandler, false);
  };

  element.addEventListener('blur', clearCategoryhandler, false);

  axsFinance.categoryInputElements = inputNodes;

  inputNodes[0].focus();
  inputNodes[0].select();
};

/**
 * Expands and focuses on the 'Add transaction' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.focusOnTransactionSection = function(item) {
  var element = item.elem;
  element.focus();
  element.select();

  axsFinance.categoryInputElements = axsFinance.editTransactionInputNodes;
};

/**
 * Reads rows from a table and populates the values in a given template.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuote = function(item) {
  var row = item.elem;

  var xPath = './td[not(.//b)]';
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var values = new Array();

  for (var i = 0, length = columns.length; i < length; i++) {
    values[i] = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(
        columns[i]);
    values[i] = axsFinance.parseSpecialCharsAndTokens(values[i]);
  }

  var text = axsFinance.populateTemplate(axsFinance.str.RECENT_QUOTE_TEMPLATE,
    values);
  axsFinance.speakAndGo(row, text);
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
 * Handles the DOMSubtreeModified events.
 * @param {Event} evt The DOMSubtreeModified event.
 */
axsFinance.DOMSubtreeModifiedEventDispatch = function(evt){
  var target = evt.target;

  if (target.id === 'upcoming_div' || target.id === 'past_div') {
    axsFinance.refreshCurrentListAndGoTopEventHandler(evt);
  }
};

/**
 * Handles the DOMNodeInserted events.
 * @param {Event} evt The DOMSubtreeModified event.
 */
axsFinance.DOMNodeInsertedEventDispatch = function(evt) {
  var target = evt.target;

  if (target.className === 'selected' && target.parentNode.id === 'ac-list') {
    axsFinance.axsJAXObj.speakTextViaNode(target.textContent);
  }
};

/**
 * Refreshes the current list and goes at the top.
 * @param {Event} evt A DomNodeInserted event.
 */
axsFinance.refreshCurrentListAndGoTopEventHandler = function(evt) {
  window.setTimeout(function() {
        var list = axsFinance.axsNavObj.currentList();
        axsFinance.axsNavObj.refreshList(list.title);

        var navListIdx = axsFinance.axsNavObj.navListIdx;
        axsFinance.axsNavObj.navItemIdxs[navListIdx] = -1;
      },
      0);
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
 * Event handler for the TAB and Shift + TAB keypress events used for
 * navigation in the current category.
 * @param {Event} evt A keypress event.
 */
axsFinance.tabAndShiftTabWrapEventHandler = function(evt) {
  var target = evt.target;
  var inputs = axsFinance.categoryInputElements;
  var inputsLength = inputs.length;

  if (inputsLength == 1 && axsFinance.isCategoryListItem) {
    //For input categories with one item TAB/Shift+TAB go to next/prev category
    var item = null;

    axsFinance.confirmCategoryValue();

    if (evt.shiftKey) {
      item = axsFinance.activeAxsNavObj.prevItem();
    } else {
      item = axsFinance.activeAxsNavObj.nextItem();
    }

    axsFinance.activeAxsNavObj.actOnItem(item);
  } else {
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
  }

  //Swallow the event
  evt.stopPropagation();
  evt.preventDefault();
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
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

  if (evt.keyCode == 9 && // TAB
      axsFinance.categoryInputElements !== null) {
    axsFinance.tabAndShiftTabWrapEventHandler(evt);
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
 * Map from character codes to functions.
 * @return {boolean} Always returns false to indicate that the keycode
 *         has been handled.
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
window.addEventListener('load', axsFinance.initAxsJAX, false);
