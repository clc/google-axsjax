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
var axsQuotes = {};

/**
 * Help string to be spoken to the user
 * @type string
 */
axsQuotes.HELP = 'The following shortcut keys are available. ';

/**
 * Strings for enhancing the presentation
 */
axsQuotes.str = {
  BIO : 'Bio',
  GT : '>',
  OR : ' or ',
  STATUS : '. Status',
  PRICE : ' Price ',
  DATE : ' Date ',
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
  EXCHANGE : '. Traded on ',
  SYMBOL : '. Symbol ',
  LAST_TRADE : '.  Last trade ',
  CHANGE : ' Change ',
  MKT_CAP : '. Market cap ',
  DELAY : ' Note that the last trade is delayed ' +
    'up to 20 minutes. ',
  USD : ' US dollars. ',
  TTM : 'TTM',
  TTM_SPACES : 'T T M',

//Strings for stock excahnges
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
  AVG_ABR_VOL : 'Avg Vol:',
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
axsQuotes.QUOTE_XPATH = "id('md')//span[@class='pr']/..";

/**
 * Array for building a sentence for the Data description section
 * @type Array
 */
axsQuotes.marketDataDescArray = new Array(axsQuotes.str.PRICE,
                                          axsQuotes.str.CHANGE,
                                          axsQuotes.str.OR,
                                          axsQuotes.str.DATE);
/**
 * Array for building a sentence for the Related companies section  
 * @type Array
 */
axsQuotes.relatedCompaniesDescArray = new Array('',
                                                axsQuotes.str.EXCHANGE,
                                                axsQuotes.str.SYMBOL,
                                                axsQuotes.str.LAST_TRADE,
                                                axsQuotes.str.CHANGE,
                                                axsQuotes.str.OR,
                                                axsQuotes.str.MKT_CAP,
                                                axsQuotes.str.USD);
/**
 * Array for building a sentence for the Financials section
 * @type Array
 */
axsQuotes.financialsDescArray = new Array();

/**
 * Array for building a sentence for the Ratios and Stats section
 * @type Array
 */
axsQuotes.ratAndStatDescArray = new Array();

/**
 * Map from abbreviated phrases to expanded phrases
 */
axsQuotes.phrasesMap = new Object();
axsQuotes.phrasesMap[axsQuotes.str.TTM] = axsQuotes.str.WEEKS;
axsQuotes.phrasesMap[axsQuotes.str.NYSE_ABBR] = axsQuotes.str.NYSE;
axsQuotes.phrasesMap[axsQuotes.str.NASDAQ_ABBR] = axsQuotes.str.NASDAQ;
axsQuotes.phrasesMap[axsQuotes.str.LON_ABBR] = axsQuotes.str.LON;
axsQuotes.phrasesMap[axsQuotes.str.OTC_ABBR] = axsQuotes.str.OTC;
axsQuotes.phrasesMap[axsQuotes.str.AMEX_ABBR] = axsQuotes.str.AMEX;
axsQuotes.phrasesMap[axsQuotes.str.EPA_ABBR] = axsQuotes.str.EPA;
axsQuotes.phrasesMap[axsQuotes.str.ASX_ABBR] = axsQuotes.str.ASX;
axsQuotes.phrasesMap[axsQuotes.str.MKT_CAP_ABBR] = axsQuotes.str.MKT_CAP;
axsQuotes.phrasesMap[axsQuotes.str.WEEKS_ABBR] = axsQuotes.str.WEEKS;
axsQuotes.phrasesMap[axsQuotes.str.NA_ABBR] = axsQuotes.str.NA;
axsQuotes.phrasesMap[axsQuotes.str.P_E_ABBR] = axsQuotes.str.P_E;
axsQuotes.phrasesMap[axsQuotes.str.F_P_E_ABBR] = axsQuotes.str.F_P_E;
axsQuotes.phrasesMap[axsQuotes.str.VOL_ABBR] = axsQuotes.str.VOL;
axsQuotes.phrasesMap[axsQuotes.str.AVG_VOL_ABBR] = axsQuotes.str.AVG_VOL;
axsQuotes.phrasesMap[axsQuotes.str.INST_OWN_ABBR] = axsQuotes.INST_OWN;
axsQuotes.phrasesMap[axsQuotes.str.EPS_ABBR] = axsQuotes.str.EPS;

/**
 * Map from prefix characters to strings 
 */
axsQuotes.charPrefixMap = new Object();
axsQuotes.charPrefixMap[axsQuotes.str.DOWN_ABBR] = axsQuotes.str.DOWN;
axsQuotes.charPrefixMap[axsQuotes.str.UP_ABBR] = axsQuotes.str.UP;

/**
 * Map from suffix characters to strings 
 */
axsQuotes.charSuffixMap = new Object();
axsQuotes.charSuffixMap[axsQuotes.str.BLN_ABBR] = axsQuotes.str.BLN;
axsQuotes.charSuffixMap[axsQuotes.str.MLN_ABBR] = axsQuotes.str.MLN;
axsQuotes.charSuffixMap[axsQuotes.str.PRCNT_ABBR] = axsQuotes.str.PRCNT;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsQuotes.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsQuotes.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsQuotes.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsQuotes.magSize = 2.5;

/**
 * Flag indicating if the page is initialized
 * @type boolean
 */
axsQuotes.searchBoxFocusEnabled = false;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsQuotes.init = function(){
  axsQuotes.axsJAXObj = new AxsJAX(true);
  axsQuotes.axsNavObj = new AxsNav(axsQuotes.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsQuotes.keyHandler, true);
  document.addEventListener('DOMSubtreeModified',
                            axsQuotes.DOMSubtreeModifiedHandler,
                            true);

  //Content navigation rule is hardcoded for efficiency
  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +

  "<target title='Stock screener' hotkey='s'>" +
    "//body//tbody//td[2]/form/a" +
  "</target>" +

  "<list title='Market data' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readCurrentQuote'>" +
      "id('md')//tr[1]/td[1]" +
    "</item>" +
    "<item action='CALL:axsQuotes.readMarketDataRow'>" +
      "id('md')//tr" +
    "</item>" +
    "<item action='CALL:axsQuotes.readAfterHours'>" +
      "id('md')//tr//nobr" +
    "</item>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('companyheader')" +
    "</target>" +
  "</list>" +

  "<list title='News' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readNewsDesc'>" +
      "id('newsmovingdiv')//div[@class='inner']//tbody" +
    "</item>" +
    "<item>" +
      "id('older_news_link')//following-sibling::a[not(./img)]" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
       ".//ancestor-or-self::a" +
    "</target>" +
    "<target title='Related articles' hotkey='r' onEmpty='No related " +
        "articles available'>" +
      "./../../..//a[@class='g bld' or @class='rl' or @class='rg']" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('companyheader')" +
    "</target>" +
  "</list>" +

  "<list title='Related companies' next='DOWN j' prev='UP k' fwd='n' " +
      "back='p'>" +
    "<item action='CALL:axsQuotes.readRelCompDesc'>" +
      "id('related')//tbody//tr" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
       ".//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('related')/div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='Discussions' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item>" +
      "id('groups')//div[@class='item']" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
       ".//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('groups')/div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='Blog posts' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item>" +
      "id('blogs')//div[@class='item']" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER' onEmpty='No link available.'>" +
      ".//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('blogs')/div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='Events' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readEventsDesc'>" +
      "id('events')//tr" +
    "</item>" +
    "<item>" +
      "id('events')/following-sibling::*//a" +
    "</item>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('blogs')/following-sibling::div[@class='content']/div[@class='hdg']" +
    "</target>" +
    "<target title='Go to link' hotkey='ENTER' onEmpty='No link available.'>" +
      ".//descendant-or-self::a" +
    "</target>" +
  "</list>" +

  "<list title='Summary' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readSummaryTextCompDesc'>" +
      "id('summary')//div[@class='item companySummary']" +
    "</item>" +
    "<item>" +
      "id('summary')//div[@class='content']//td[1]" +
    "</item>" +
    "<item action='CALL:axsQuotes.readSummarylinksCompDesc'>" +
      "id('summary')//div[@class='content']//a[@id='fs-chome' or @id='fs-']" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER' onEmpty='No link available.'>" +
      ".//descendant-or-self::a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('summary')/div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='Income statement in millions of US dollars' next='DOWN j' " +
      "prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readFinancialCompDesc'>" +
      "id('fd')//tr[position() &gt; 1 and position() &lt; 6]" +
    "</item>" +
    "<target title='Income statement section' trigger='listEntry'>" +
      "id('fd')//tr[1]//td[1]axsQuotes.str.BIO" +
    "</target>" +
    "<target title='Go to link' hotkey='ENTER'>" +
      "./../tr[1]//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('fd')//tr[1][//a]" +
    "</target>" +
  "</list>" +
  
  "<list title='Balance sheet in millions of US dollars' " +
      "next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readFinancialCompDesc'>" +
      "id('fd')//tr[position() &gt; 6 and position() &lt; 12]" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
      "./../tr[6]//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('fd')//tr[6][//a]" +
    "</target>" +
  "</list>" +

  "<list title='Cash flow in millions of US dollars' next='DOWN j' " +
      "prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readFinancialCompDesc'>" +
      "id('fd')//tr[position() &gt; 12 and position() &lt; 18]" +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
      "./../tr[12]//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('fd')//tr[12][//a]" +
    "</target>" +
  "</list>" +

  "<list title='Key statistics and ratios' next='DOWN j' prev='UP k' " +
      "fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readRatAndStatsCompDesc'>" +
      "id('keyratios')//tr[@class]" +
    "</item>" +
    "<item>" +
      "id('keyratios')//a" +
    "</item>" +
    "<target title='More ratios' hotkey='ENTER' onEmpty='No link available.'>" +
      "." +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('keyratios')/div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='More resources' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item>" +
      "id('m-analyst')/.. | id('m-sec')/.. | id('m-hold')/.. | " +
      "id('m-options')/.. | id('m-research')/.. | id('m-wiki')/.. | " +
      "id('m-transcripts')/.." +
    "</item>" +
    "<target title='Go to link' hotkey='ENTER'>" +
      ".//a" +
    "</target>" +
    "<target title='Go to section' trigger='listEntry' >" +
      "id('keyratios')/following-sibling::div[@class='hdg']" +
    "</target>" +
  "</list>" +

  "<list title='Officers and directors' next='DOWN j' prev='UP k' fwd='n' " +
      "back='p'>" +
    "<item action='CALL:axsQuotes.readManagementDescription'>" +
      "id('management')//tr[not(@id='hide') and @id]" +
    "</item>" +
    "<item>" +
      "id('management')//td/a" +
    "</item>" +
    "<target title='Biography and compensation' hotkey='b'>" +
      ".//following-sibling::tr[1]//a[@id='e-p']" +
    "</target>" +
    "<target title='Trading activity' hotkey='t' onEmpty='No trading " +
        "activity available.'>" +
      ".//following-sibling::tr[1]//a[@id='e-t']" +
    "</target>" +
    "<target title='Go to link' hotkey='ENTER' onEmpty='No link available.'>" +
      "." +
    "</target>" +
    "<target title='Go to section' trigger='listEntry'>" +
      "id('mgmtdiv')" +
    "</target>" +
  "</list>" +

  "</cnr>";

  axsQuotes.axsNavObj.navInit(cnrString, null);
  axsQuotes.axsLensObj = new AxsLens(axsQuotes.axsJAXObj);
  axsQuotes.axsNavObj.setLens(axsQuotes.axsLensObj);
  axsQuotes.axsLensObj.setMagnification(axsQuotes.magSize);

  //Table columns are static for the page but change over time
  axsQuotes.populateFinancialsDescArray();
  axsQuotes.populateRatAndStatDescArray();

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsQuotes.searchBoxKeyHandler, false);

  //read the current quote
  window.setTimeout(axsQuotes.speakIntroduction, 200);
};

/**
 * Handles the DOMSubtreeModified event. 
 * This event happens when the selected node for the 
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event
 */
axsQuotes.DOMSubtreeModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if (target.id == 'ac-list'){
    for (var i = 0, child; child = target.childNodes[i]; i++){
      if (child.className == 'selected'){
        axsFinance.axsJAXObj.speakNode(child);
        return;
      }
    }
  }
};

/**
 * Handles the focus event of the searchbox. Avoids focusing of
 * this element performed by the page scripts
 * @param {Event} evt The focus event
 */
axsQuotes.searchBoxKeyHandler = function(evt) {
  if (!axsQuotes.searchBoxFocusEnabled) {
    axsQuotes.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
  }
};

/**
 * Reads the company name and the current quote.
 */
axsQuotes.speakIntroduction = function() {
    var text = '';
    var xpath = 'id("companyheader")//h1';
    var headerElems = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
    var quoteElems = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH,
        document.body);

    text = headerElems[0].textContent + ' ';
    text = text + axsQuotes.parseCurrentQuote(quoteElems[0]);

    axsQuotes.speakAndGo(quoteElems[0], text);
};

/**
 * Populates the array used for building a sentence for presenting the
 * 'Balance sheet in millions of US dollars', Cash flow in millions
 * of US dollars' lists (Financial section). 
 * NOTE: The array is built dynamically since the captions of the Financials
 * table vary over time.
 */
axsQuotes.populateFinancialsDescArray = function() {
  var xpath = 'id("fd")//tr[1]';
  var elements = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsQuotes.normalizeString(currentCaption) + ', ';
  var oneYearOldCaption = tableRow.childNodes[5].textContent;
  oneYearOldCaption = oneYearOldCaption.replace('(', ' ').replace(')', ' ');
  oneYearOldCaption = axsQuotes.normalizeString(oneYearOldCaption) + ', ';
  var twoYearsOldCaption = tableRow.childNodes[7].textContent;
  twoYearsOldCaption = twoYearsOldCaption.replace('(', ' ').replace(')', ' ');
  twoYearsOldCaption = axsQuotes.normalizeString(twoYearsOldCaption) + ', ';

  axsQuotes.financialsDescArray = new Array('',
                                            currentCaption,
                                            oneYearOldCaption,
                                            twoYearsOldCaption);
};

/**
 * Populates the array used for building a sentence for presenting the
 * 'Key statistics and ratios' list section (Key Stats & Ratios). 
 * NOTE: The array is built dynamically since the captions of the 'Key Stats & 
 * Ratios' table vary over time.
 */
axsQuotes.populateRatAndStatDescArray = function() {
  var xpath = 'id("keyratios")//tr[1]';
  var elements = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsQuotes.normalizeString(currentCaption) + ', ';
  var oneYearCaption = tableRow.childNodes[5].textContent;
  oneYearCaption = oneYearCaption.replace('(', ' ').replace(')', ' ');
  oneYearCaption = axsQuotes.normalizeString(oneYearCaption) + ', ';
  var twoYearsCaption = tableRow.childNodes[7].textContent;
  twoYearsCaption = twoYearsCaption.replace('(', ' ').replace(')', ' ');
  twoYearsCaption = axsQuotes.normalizeString(twoYearsCaption) + ', ';
  if (twoYearsCaption.indexOf(axsQuotes.str.TTM) != -1) {
    twoYearsCaption = twoYearsCaption.replace(axsQuotes.str.TTM,
                                              axsQuotes.str.TTM_SPACES);
  }
  axsQuotes.ratAndStatDescArray = new Array('',
                                            currentCaption,
                                            oneYearCaption,
                                            twoYearsCaption);
};

/**
 * Callback handler for reading rows of data in the 'Market data' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readMarketDataRow = function(item) {
  var element = item.elem;
  var text = '';
  var xpath = './td[@class="key" or @class="val"]';
  var columns = axsQuotes.axsJAXObj.evalXPath(xpath, element);
  var firstPhrase = '';
  var secondPhrase = '';
  for (var i = 0; i < columns.length; i = i + 2) {
    firstPhrase = columns[i].textContent;
    firstPhrase = axsQuotes.parseSpecChrsAndTkns(firstPhrase);
    secondPhrase = columns[i + 1].textContent;
    secondPhrase = axsQuotes.parseSpecChrsAndTkns(secondPhrase);
    text = text + firstPhrase + ' ' + secondPhrase + '. ';
  }
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the after hours information in 
 * the 'Market data' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readAfterHours = function(item) {
  var text = '';
  var element = item.elem;
  var afterHours = element.childNodes[0].textContent;
  afterHours = axsQuotes.parseSpecChrsAndTkns(afterHours);
  afterHours = afterHours + ' ' + axsQuotes.str.OR + ' ';
  var percent = element.childNodes[2].textContent;
  percent = axsQuotes.parseSpecChrsAndTkns(percent);
  percent = percent + ', ';
  var time = element.childNodes[4].textContent;
  text = afterHours + percent + time;

  axsQuotes.speakAndGo(element, text);
};

/**
 * Reads the current quote.
 */
axsQuotes.readCurrentQuote = function() {
  var elements = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH,
      document.body);
  var text = axsQuotes.parseCurrentQuote(elements[0]);
  axsQuotes.speakAndGo(elements[0], text);
};

/**
 * Parses the current quote (the first element in the first and second items 
 * in the Market data list and read via pressing the 'q' key) and generates
 * a readable string.
 * @param {Node} element The current DOM node 
 * @return {string} The readable text generated from the quote 
 */
axsQuotes.parseCurrentQuote = function(element) {
  var text = '';
  var rate = element.childNodes[1].textContent;
  rate = axsQuotes.parseSpecChrsAndTkns(rate) + ', ';

  var change = element.childNodes[4].textContent;
  change = axsQuotes.parseSpecChrsAndTkns(change) + ' ';

  var percent = element.childNodes[6].textContent;
  percent = axsQuotes.parseSpecChrsAndTkns(percent) + ', ';

  var dateAndStatus = element.childNodes[8].textContent;
  dateAndStatus = dateAndStatus.replace(' -', axsQuotes.str.STATUS);
  dateAndStatus = axsQuotes.parseSpecChrsAndTkns(dateAndStatus) + ', ';

  var time = '';
  if (element.childNodes.length > 9) {
    time = element.childNodes[9].textContent;
  }

  var docTextPhrases = new Array(rate, change, percent, dateAndStatus, time);
  text = axsQuotes.buildTableRowText(docTextPhrases,
      axsQuotes.marketDataDescArray);

  return text;
};

/**
 * Callback handler for reading the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readNewsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var xpath = './/td[@class="title" or @class="source"]';
  var contents = axsQuotes.axsJAXObj.evalXPath(xpath, element);
  text = contents[0].textContent + '. ';
  text = text + contents[1].childNodes[0].textContent;
  text = text + contents[1].childNodes[1].textContent;
  axsQuotes.speakAndGo(item.elem, text);
};

/**
 * Callback handler for reading the 'Related companies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readRelCompDesc = function(item) {
  var element = item.elem;
  var rowColumns = element.childNodes;
  var companyName = axsQuotes.normalizeString(rowColumns[1].textContent);
  var exchange = axsQuotes.normalizeString(rowColumns[5].textContent);
  var exchangeFullName = axsQuotes.phrasesMap[exchange];
  if (exchangeFullName !== undefined) {
    exchange = exchangeFullName;
  }
  var symbol = axsQuotes.normalizeString(rowColumns[7].textContent);
  symbol = axsQuotes.addSpaceBetweenChars(symbol);
  var lastTrade = axsQuotes.normalizeString(rowColumns[9].textContent);
  var note = '';
  if (rowColumns[11].textContent.indexOf('*') != -1) {
    note = axsQuotes.str.DELAY;
  }
  var index = rowColumns[13].textContent.indexOf('(');
  var absoluteChange = rowColumns[13].textContent.substring(0, index);
  absoluteChange = axsQuotes.parseSpecChrsAndTkns(absoluteChange);
  var relativeChange = rowColumns[13].textContent.substring(index);
  relativeChange = axsQuotes.parseSpecChrsAndTkns(relativeChange);
  var marketCap = axsQuotes.parseSpecChrsAndTkns(rowColumns[15].textContent);
  var docTextPhrases = new Array(companyName,
                                 exchange,
                                 symbol,
                                 lastTrade,
                                 absoluteChange,
                                 relativeChange,
                                 marketCap,
                                 note);
  var rowText = axsQuotes.buildTableRowText(docTextPhrases,
      axsQuotes.relatedCompaniesDescArray);
  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Income statement in millions of
 * US dollars', 'Balance sheet in millions of US dollars', Cash flow in
 * millions of US dollars' lists.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readFinancialCompDesc = function(item) {
  var element = item.elem;

  var metricName = element.childNodes[1].textContent;
  metricName = axsQuotes.normalizeString(metricName) + ', ';

  var currentValue = element.childNodes[3].textContent;
  currentValue = axsQuotes.normalizeString(currentValue) + ', ';

  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsQuotes.normalizeString(oneYearValue) + ', ';

  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsQuotes.normalizeString(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsQuotes.buildTableRowText(columnsText,
      axsQuotes.financialsDescArray);

  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Key ratios and stats' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readRatAndStatsCompDesc = function(item) {
  var element = item.elem;
  var metricName = element.childNodes[1].textContent;
  metricName = axsQuotes.parseSpecChrsAndTkns(metricName) + ', ';
  var currentValue = element.childNodes[3].textContent;
  currentValue = axsQuotes.parseSpecChrsAndTkns(currentValue) + ', ';
  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsQuotes.parseSpecChrsAndTkns(oneYearValue) + ', ';
  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsQuotes.parseSpecChrsAndTkns(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsQuotes.buildTableRowText(columnsText,
                                         axsQuotes.ratAndStatDescArray);

  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the names and information of the people
 * in the 'Officers and directors' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readManagementDescription = function(item) {
  var element = item.elem;
  var personName = element.childNodes[1].textContent;
  personName = personName.replace(axsQuotes.str.GT, '');
  var position = element.childNodes[3].textContent;
  var info = element.nextSibling.nextSibling.textContent;
  var index = info.indexOf(axsQuotes.str.BIO);
  info = info.substring(0, index);
  info = axsQuotes.normalizeString(info);
  var columnsText = new Array(personName, position, info);
  var rowText = axsQuotes.buildTableRowText(columnsText, null);
  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the events in the 'Events' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readEventsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var dateAndTime = element.childNodes[1].textContent;
  dateAndTime = axsQuotes.normalizeString(dateAndTime);
  var eventName = element.childNodes[3].childNodes[0].textContent;
  eventName = axsQuotes.normalizeString(eventName);
  text = dateAndTime + ', ' + eventName;
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company website links in the 'Summary' 
 * list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readSummarylinksCompDesc = function(item) {
  var element = item.elem;
  var text = axsQuotes.normalizeString(element.textContent);
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company description in the 'Summary' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readSummaryTextCompDesc = function(item) {
  var element = item.elem;
  var text = element.childNodes[0].textContent;
  axsQuotes.speakAndGo(element, text);
};

/**
 * Adds white spaces beteen the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its 
 * characters.
 */
axsQuotes.addSpaceBetweenChars = function(text) {
  var textWithSpaces = '';
  for (var i = 0; i < text.length; i++) {
    textWithSpaces = textWithSpaces + text.charAt(i);
    if (i < text.length - 1) {
      textWithSpaces = textWithSpaces + ' ';
    }
  }
  return textWithSpaces;
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node 
 * @param {string} text The text to be spoken. 
 * characters.
 */
axsQuotes.speakAndGo = function(element, text) {
  axsQuotes.axsLensObj.view(element);
  axsQuotes.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsQuotes.axsJAXObj.markPosition(element);
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content. 
 * @param {Array?} textContents Array with the contents of table columns. 
 * @param {Array?} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsQuotes.buildTableRowText = function(textContents, columnDesc) {
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
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content. 
 * @param {string} text The text to be processed  
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsQuotes.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';
  //check input
  if (text === '') {
    return text;
  }
  //remove leading and trailing spaces
  text = axsQuotes.normalizeString(text);
  //check for phrase word mapping
  var phraseMapping = axsQuotes.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }
  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, token; token = tokens[i]; i++) {
    //check for whole word mapping
    var tokenMapping = axsQuotes.phrasesMap[token];
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
      var prefixMapping = axsQuotes.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }
      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsQuotes.charSuffixMap[lastCharacter];
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
 * characters are rplaced by ' ', and all carriage returns ('\r') and line 
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized. 
 * @return {string} The normalized version of the text
 */
axsQuotes.normalizeString = function(text) {
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
axsQuotes.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsQuotes.axsJAXObj.lastFocusedNode.blur();
    return false;
  }
  if (axsQuotes.axsJAXObj.inputFocused) {
    return true;
  }
  if (evt.charCode == 113) { // q
    axsQuotes.readCurrentQuote();
    return false;
  }
  var command = axsQuotes.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Map from character codes to functions
 */
axsQuotes.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
       axsQuotes.searchBoxFocusEnabled = true;
       document.getElementById('searchbox').focus();
       document.getElementById('searchbox').select();
       return false;
     },
  // ? (question mark)
  63 : function() {
       var helpStr = axsQuotes.HELP + axsQuotes.axsNavObj.localHelpString() +
                     axsQuotes.axsNavObj.globalHelpString();
       axsQuotes.axsJAXObj.speakTextViaNode(helpStr);
       return false;
    }
};

//Run the initialization routine of the script
axsQuotes.init();
