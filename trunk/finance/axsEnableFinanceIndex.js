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
  OR : 'or',
  STATUS : '. Status',
  RATE : 'Rate',
  DATE : 'Date',
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
  CHANGE : 'Change',
  MKT_CAP : 'Market cap',
  EXAMPLE : 'Example',
  DEFINITION : 'Definition',

  //Strings for market data
  MKT_CAP : 'Market cap',
  MKT_CAP_ABBR : 'Mkt Cap:',
  P_E : 'Price earnings ratio',
  P_E_ABBR : 'P/E:',
  F_P_E : 'Forward price to earnings ratio',
  F_P_E_ABBR : 'F P/E:',
  VOL : 'Volume',
  VOL_ABBR : 'Vol:',
  WEEKS : 'Fifty two week',
  WEEKS_ABBR : '52Wk',
  AVG_VOL : 'Average volume',
  AVG_VOL_ABBR : 'Avg Vol:',
  NA_ABBR : '-',
  NA : 'Not available',
  INST_OWN : 'Institutional Ownership',
  INST_OWN_ABBR : 'Inst. Own:',
  EPS : 'E P S',
  EPS_ABBR : 'EPS:'
};

/**
 * XPath for retrieving the current quote
 * @type string
 */
axsFinance.QUOTE_XPATH = "id('md')//span[@class='pr']/..";

/**
 * Array for building a sentence for the 'Data description' section
 * @type Array
 */
axsFinance.marketDataDescArray = new Array(axsFinance.str.RATE,
                                          axsFinance.str.CHANGE,
                                          axsFinance.str.OR,
                                          axsFinance.str.DATE);

/**
 * Map from abbreviated phrases to expanded phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.MKT_CAP_ABBR] = axsFinance.str.MKT_CAP;
axsFinance.phrasesMap[axsFinance.str.WEEKS_ABBR] = axsFinance.str.WEEKS;
axsFinance.phrasesMap[axsFinance.str.NA_ABBR] = axsFinance.str.NA;
axsFinance.phrasesMap[axsFinance.str.P_E_ABBR] = axsFinance.str.P_E;
axsFinance.phrasesMap[axsFinance.str.F_P_E_ABBR] = axsFinance.str.F_P_E;
axsFinance.phrasesMap[axsFinance.str.VOL_ABBR] = axsFinance.str.VOL;
axsFinance.phrasesMap[axsFinance.str.AVG_VOL_ABBR] = axsFinance.str.AVG_VOL;
axsFinance.phrasesMap[axsFinance.str.INST_OWN_ABBR] = axsFinance.str.INST_OWN;
axsFinance.phrasesMap[axsFinance.str.EPS_ABBR] = axsFinance.str.EPS;

/**
 * Map from prefix characters to strings 
 */
axsFinance.charPrefixMap = new Object();
axsFinance.charPrefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.charPrefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings 
 */
axsFinance.charSuffixMap = new Object();
axsFinance.charSuffixMap[axsFinance.str.BLN_ABBR] = axsFinance.str.BLN;
axsFinance.charSuffixMap[axsFinance.str.MLN_ABBR] = axsFinance.str.MLN;
axsFinance.charSuffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR 
 */
axsFinance.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +
    '' +
    '  <target title="Stock screener" hotkey="s">' +
    '    //a[@href="/finance/stockscreener"]' +
    '  </target>' +
    '' +
    '  <target title="Read current quote" hotkey="q"' +
    '      action="CALL:axsFinance.readCurrentQuote">' +
    '    /html"]' +
    '  </target>' +
    '' +
    '  <list title="Market data" next="DOWN j" prev="UP k" fwd' +
    '="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readCurrentQuote">' +
    '      id("md")//span[@class="pr"]/..' +
    '    </item>' +
    '' +
    '    <item action="CALL:axsFinance.readMarketDataItem">' +
    '      id("md")//tr/td[@class="key"]' +
    '    </item>' +
    '' +
    '    <item action="CALL:axsFinance.readAfterHours">' +
    '      id("md")//tr//nobr' +
    '    </item>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("companyheader")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="News" next="DOWN j" prev="UP k" fwd="n" ba' +
    'ck="p" type="dynamic">' +
    '' +
    '    <item action="CALL:axsFinance.readNewsDesc">' +
    '      id("newsmovingdiv")//div[@class="inner"]//tbody' +
    '    </item>' +
    '' +
    '    <item>' +
    '      id("older_news_link")//following-sibling::a[not(./i' +
    'mg)]' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER">' +
    '      .//ancestor-or-self::a' +
    '    </target>' +
    '' +
    '    <target title="Related articles" hotkey="r" onEmpty="' +
    'No related' +
    '        articles available">' +
    '      .//a[@class="g bld" or @class="rl" or @class="rg"]' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      //li/a[text()="News"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Blogs" next="DOWN j" prev="UP k" fwd="n" ba' +
    'ck="p" type="dynamic">' +
    '' +
    '    <item action="CALL:axsFinance.readBlogsDesc">' +
    '      //div[@class="rss-item"]' +
    '    </item>' +
    '' +
    '    <target title="Go to blog" hotkey="ENTER">' +
    '      .//a[./img[@class="rssSprite"]]' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      //li/a[text()="Blogs"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Feeds" next="DOWN j" prev="UP k" fwd="n" ba' +
    'ck="p" type="dynamic">' +
    '' +
    '    <item action="CALL:axsFinance.readFeedExampleDesc">' +
    '      //div[./div[contains(@id, "rss-feed-item-snippet")]' +
    '          and not(.//b)]' +
    '    </item>' +
    '' +
    '    <item action="CALL:axsFinance.readFeedSearchResDesc">' +
    '      //div[./div[contains(@id, "rss-feed-item-snippet")]' +
    '         and .//b]' +
    '    </item>' +
    '' +
    '    <item action="CALL:axsFinance.readBlogsDesc">' +
    '      //div[@id="plot_feed_div_cont"]//' +
    '          div[@class="rss-item"]' +
    '    </item>' +
    '' +
    '    <target title="Go to feed source" hotkey="g">' +
    '      .//a[@class="g"]' +
    '    </target>' +
    '' +
    '    <target title="Try this example" hotkey="t">' +
    '      .//a[not(@class)]' +
    '    </target>' +
    '' +
    '    <target title="Go to feed" hotkey="ENTER"' +
    '        onEmpty="The current item is not a feed">' +
    '      .//a[./img[@class="rssSprite"]]' +
    '    </target>' +
    '' +
    '    <target title="Feed search" hotkey="s"' +
    '        action="CALL:axsFinance.focusOnSearchBox">' +
    '      id("rss_query_box")' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      //li/a[contains(text(), "Feeds")]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Discussions" next="DOWN j" prev="UP k" fwd' +
    '="n" back="p">' +
    '' +
    '    <item>' +
    '      id("groups")//div[@class="item"]' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER">' +
    '      .//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("groups")/div[@class="hdg"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  </cnr>';

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
axsFinance.init = function() {
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

  var func = axsFinance.DOMSubtreeModifiedEventDispatch;
  document.addEventListener('DOMSubtreeModified', func, true);

  var func = axsFinance.DOMNodeInsertedEventDispatch;
  document.addEventListener('DOMNodeInserted', func, true);

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsFinance.searchBoxKeyHandler, false);

  //read the current quote
  window.setTimeout(axsFinance.speakIntroduction, 200);
};

/**
 * Handles the DOMSubtreeModified event. This method serves as an
 * event dispatch and delegates to specialized event handlers.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.DOMSubtreeModifiedEventDispatch = function(evt) {
  var target = evt.target;

  if (target.id == 'ac-list') {

    axsFinance.announceAutoCompletionValueEventHandler(evt);

  } else if (target.className == 'goog-tab-selected') {

    axsFinance.refreshNewsBlogsFeedsListEventHandler(evt);

  }
};

/**
 * Event handler for announcing the value in an auto completion box.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.announceAutoCompletionValueEventHandler = function(evt) {
  var target = evt.target;
  for (var i = 0, child; child = target.childNodes[i]; i++){
    if (child.className == 'selected') {
      axsFinance.axsJAXObj.speakNode(child);
      return;
    }
  }
};

/**
 * Announces the title of the current feed list.
 */
axsFinance.announceFeedListTitle = function() {
  var xPath = '//div[@id="feed_list_title" and .//ancestor::div[contains' +
      '(@id, "_div_cont") and not(contains(@style, "display: none"))]]';
  var titles = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  if (titles.length > 0) {
    var text = titles[0].textContent;
    axsFinance.axsJAXObj.speakTextViaNode(text);
    axsFinance.axsJAXObj.lastFocusedNode.blur();
  }
};

/**
 * Handles the DOMNodeInserted event. This method serves as an
 * event dispatch and delegates to specialized event handlers.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.DOMNodeInsertedEventDispatch = function(evt) {
  var target = evt.target;

  if (target.parentNode.parentNode.parentNode.id == 'scrollingListTd') {

    axsFinance.refreshNewsBlogsFeedsListEventHandler(evt);

  }
};

/**
 * Event handler for refreshing the current list using the current refresh 
 * mode of the list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.refreshNewsBlogsFeedsListEventHandler = function(evt) {
  var func = function() {
               axsFinance.refreshCurrentList();
               axsFinance.announceFeedListTitle();
  };
  axsFinance.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Handles the focus event of the search box. Avoids focusing of
 * this element performed by the page scripts
 * @param {Event} evt The focus event
 */
axsFinance.searchBoxKeyHandler = function(evt) {
  if (!axsFinance.searchBoxFocusEnabled) {
    axsFinance.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
  }
};

/**
 * Reads the company name and the current quote.
 */
axsFinance.speakIntroduction = function() {
    var text = '';
    var xpath = 'id("companyheader")//h1';
    var headerElems = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
    var quoteElems = axsFinance.axsJAXObj.evalXPath(axsFinance.QUOTE_XPATH,
        document.body);

    text = headerElems[0].textContent + ' ';
    text = text + axsFinance.parseCurrentQuote(quoteElems[0]);

    axsFinance.speakAndGo(quoteElems[0], text);
};

/**
 * Callback handler for reading criteria items in the 'Market data' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsFinance.readMarketDataItem = function(item) {
  var criteria = item.elem;
  var xPath = './/following-sibling::td[1]';
  var value = axsFinance.axsJAXObj.evalXPath(xPath, criteria)[0];

  var criteriaText = axsFinance.parseSpecChrsAndTkns(criteria.textContent);
  var valueText = axsFinance.parseSpecChrsAndTkns(value.textContent);

  var text = criteriaText + ' ' + valueText + '.';
  axsFinance.speakAndGo(criteria, text);
};

/**
 * Callback handler for reading the after hours information in 
 * the 'Market data' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readAfterHours = function(item) {
  var text = '';
  var element = item.elem;
  var afterHours = element.childNodes[0].textContent;
  afterHours = axsFinance.parseSpecChrsAndTkns(afterHours);
  afterHours = afterHours + ' ' + axsFinance.str.OR + ' ';
  var percent = element.childNodes[2].textContent;
  percent = axsFinance.parseSpecChrsAndTkns(percent);
  percent = percent + ', ';
  var time = element.childNodes[4].textContent;
  text = afterHours + percent + time;

  axsFinance.speakAndGo(element, text);
};

/**
 * Reads the current quote.
 */
axsFinance.readCurrentQuote = function() {
  var elements = axsFinance.axsJAXObj.evalXPath(axsFinance.QUOTE_XPATH,
      document.body);
  var text = axsFinance.parseCurrentQuote(elements[0]);
  axsFinance.speakAndGo(elements[0], text);
};

/**
 * Parses the current quote (the first element in the first and second items 
 * in the Market data list and read via pressing the 'q' key) and generates
 * a readable string.
 * @param {Node} element The current DOM node 
 * @return {string} The readable text generated from the quote 
 */
axsFinance.parseCurrentQuote = function(element) {
  var text = '';
  var rate = element.childNodes[1].textContent;
  rate = axsFinance.parseSpecChrsAndTkns(rate) + ', ';

  var change = element.childNodes[4].textContent;
  change = axsFinance.parseSpecChrsAndTkns(change) + ' ';

  var percent = element.childNodes[6].textContent;
  percent = axsFinance.parseSpecChrsAndTkns(percent) + ', ';

  var dateAndStatus = element.childNodes[8].textContent;
  dateAndStatus = dateAndStatus.replace(' -', axsFinance.str.STATUS);
  dateAndStatus = axsFinance.parseSpecChrsAndTkns(dateAndStatus) + ', ';

  var time = '';
  if (element.childNodes.length > 9) {
    time = element.childNodes[9].textContent;
  }

  var docTextPhrases = new Array(rate, change, percent, dateAndStatus, time);
  text = axsFinance.buildTableRowText(docTextPhrases,
      axsFinance.marketDataDescArray);

  return text;
};

/**
 * Callback handler for reading the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readNewsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var xpath = './/td[@class="title" or @class="source"]';
  var contents = axsFinance.axsJAXObj.evalXPath(xpath, element);
  text = contents[0].textContent + '. ';
  text = text + contents[1].childNodes[0].textContent;
  text = text + contents[1].childNodes[1].textContent;
  axsFinance.speakAndGo(item.elem, text);
};

/**
 * Callback handler for reading the 'Blogs' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readBlogsDesc = function(item) {
  var element = item.elem;
  var xPath = './/div[@class="content"]';
  var content = axsFinance.axsJAXObj.evalXPath(xPath, element)[0];

  xPath = './/div[@class="date"]';
  var date = axsFinance.axsJAXObj.evalXPath(xPath, element)[0];

  var text = content.textContent + ' ' + date.textContent;
  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for reading the examples in the 'Feeds' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readFeedExampleDesc = function(item) {
  var element = item.elem;

  var example = element.firstChild;
  var xPath = './div[contains(@id, "rss-feed-item-snippet")]';
  var definition = axsFinance.axsJAXObj.evalXPath(xPath, element)[0].firstChild;

  var text = axsFinance.str.EXAMPLE + '. ' + example.textContent + ' ';
  text = text + axsFinance.str.DEFINITION + '. ' + definition.textContent;

  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for reading the search results in the 'Feeds' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readFeedSearchResDesc = function(item) {
  var element = item.elem;

  var text = element.textContent;
  var xPath = './/a';
  var links = axsFinance.axsJAXObj.evalXPath(xPath, element);
  for (var i = 0, link; link = links[i]; i++) {
    text = text.replace(link.textContent, '');
  }

  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for focusing on the search feed box.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.focusOnSearchBox = function(item) {
  var element = item.elem;
  element.title = 'Search box';
  element.focus();
  element.select();
};

/**
 * Executes a function mapped to an event. Since some events are generated
 * too frequently, taking actions on each event may cause significant
 * overhead. This method is mapping the event in the function call to a
 * handling function. Also the event has a timestamp indicating the time for
 * planned execution (obtained by adding an offset to the current system time)
 * of the function to which it is mapped (and will potentially handle it).
 * The handling function is executed after the event timestamp expires.
 * Subsequent requests for executing the same function remap the function to the
 * event parameter in the call and the event timestamp is set as described
 * above. After execution of the mapped function its mapping to an event is
 * removed. Such an implementation ensures processing the last event mapped to
 * the handling function after a certain timeout.
 *
 * @param {Function} func The handling function to execute.
 * @param {Event} evt Event to be propagated to the handlingFunction.
 */
 axsFinance.executeFunctionAfterMostRecentEvent = function(func, evt) {
  if (axsFinance.eventHandlerToEventMap[func.toString()]) {
    evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
    axsFinance.eventHandlerToEventMap[func.toString()] = evt;
    return;
  }

  evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
  axsFinance.eventHandlerToEventMap[func.toString()] = evt;

  var delegFunc = function() {
                    var currentTime = new Date().getTime();
                    var key = func.toString();
                    var event = axsFinance.eventHandlerToEventMap[key];

                    if (event.timeToHandle > currentTime) {
                      var executionTimeout = event.timeToHandle - currentTime;
                      window.setTimeout(delegFunc, executionTimeout);
                    } else {
                      func(event);
                      axsFinance.eventHandlerToEventMap[func.toString()] = null;
                    }
  };

   window.setTimeout(delegFunc, axsFinance.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node 
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
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content. 
 * @param {Array?} textContents Array with the contents of table columns. 
 * @param {Array?} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsFinance.buildTableRowText = function(textContents, columnDesc) {
  //check inputs
  if (textContents === null) {
    return '';
  }
  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (columnDesc !== null && i < columnDesc.length) {
       rowText = rowText + ' ' + columnDesc[i];
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (columnDesc !== null && i < columnDesc.length) {
    rowText = rowText + ' ' + columnDesc[i];
  }
  return rowText;
};

/**
 * Refreshes the current list of the active AxsNav object. 
 */
axsFinance.refreshCurrentList = function() {
  var list = axsFinance.axsNavObj.currentList();
  axsFinance.axsNavObj.refreshList(list.title);
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content. 
 * @param {string} text The text to be processed  
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsFinance.parseSpecChrsAndTkns = function(text) {
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
  for (var i = 0, token; token = tokens[i]; i++) {
    //check for whole word mapping
    var tokenMapping = axsFinance.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {
      //remove parentheses
      if (token.length > 0 && token.charAt(0) === '(') {
        token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }
      //parse the first character
      var prefixMapping = axsFinance.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }
      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsFinance.charSuffixMap[lastCharacter];
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
 * @return {string} The normalized version of the text
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
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event
 * @return {boolean} If true, indicates that the event should be propagated.
 */
axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
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
    }
};

//Run the initialization routine of the script
window.addEventListener('load', axsFinance.init, true);
