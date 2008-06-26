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

//Strings for enhancing the presentation
axsQuotes.BIO_STRING = 'Bio';
axsQuotes.GT_STRING = '>';
axsQuotes.OR_STRING = ' or ';
axsQuotes.EMPTY_STRING = '';
axsQuotes.STATUS_STRING = '. Status';
axsQuotes.PRICE_STRING = ' Price ';
axsQuotes.DATE_STRING = ' Date ';
axsQuotes.UP_STRING = ' up by ';
axsQuotes.UP_ABR_STRING = '+';
axsQuotes.DOWN_STRING = ' down by ';
axsQuotes.DOWN_ABR_STRING = '-';
axsQuotes.PRCNT_STRING = ' percent';
axsQuotes.PRCNT_ABR_STRING = '%';
axsQuotes.MLN_STRING = ' million';
axsQuotes.MLN_ABR_STRING = 'M';
axsQuotes.BLN_STRING = ' billion';
axsQuotes.BLN_ABR_STRING  = 'B';
axsQuotes.EXCHANGE_STRING = '. Traded on ';
axsQuotes.SYMBOL_STRING = '. Symbol ';
axsQuotes.LAST_TRADE_STRING = '.  Last trade ';
axsQuotes.CHANGE_STRING = ' Change ';
axsQuotes.MKT_CAP_STRING = '. Market cap ';
axsQuotes.DELAY_STRING = ' Note that the last trade is delayed ' +
    'up to 20 minutes. ';
axsQuotes.USD_STRING = ' US dollars. ';
axsQuotes.TTM_STRING = 'TTM';
axsQuotes.TTM_SPACES_STRING = 'T T M';

//Strings for stock excahnges
axsQuotes.NYSE_STRING = 'New York Stock Exchange';
axsQuotes.NYSE_ABR_STRING = 'NYSE';
axsQuotes.NASDAQ_STRING = 'NASDAQ Stock Market';
axsQuotes.NASDAQ_ABR_STRING = 'NASDAQ';
axsQuotes.LON_STRING = 'London Stock Exchange';
axsQuotes.LON_ABR_STRING = 'LON';
axsQuotes.OTC_STRING = 'Over the counter';
axsQuotes.OTC_ABR_STRING = 'OTC';
axsQuotes.AMEX_STRING = 'American Stock Exchange';
axsQuotes.AMEX_ABR_STRING = 'AMEX';
axsQuotes.EPA_STRING = 'Euronext Paris Stock Exchange';
axsQuotes.EPA_ABR_STRING = 'EPA';
axsQuotes.ASX_STRING = 'Australian Securities Exchange';
axsQuotes.ASX_ABR_STRING = 'ASX';

//Strings for market data
axsQuotes.MKT_CAP_STRING = 'Market cap';
axsQuotes.MKT_ABR_CAP_STRING = 'Mkt Cap:';
axsQuotes.P_E_STRING = 'Price earnings ratio';
axsQuotes.P_E_ABR_STRING = 'P/E:';
axsQuotes.F_P_E_STRING = 'Forward price to earnings ratio';
axsQuotes.F_P_E_ABR_STRING = 'F P/E:';
axsQuotes.VOL_STRING = 'Volume';
axsQuotes.VOL_ABR_STRING = 'Vol:';
axsQuotes.WEEKS_STRING = 'Fifty two week';
axsQuotes.WEEKS_ABR_STRING = '52Wk';
axsQuotes.AVG_VOL_STRING = 'Average volume';
axsQuotes.AVG_ABR_VOL_STRING = 'Avg Vol:';
axsQuotes.NA_ABR_STRING  = '-';
axsQuotes.NA_STRING = 'Not available';
axsQuotes.INST_OWN_STRING = 'Institutional Ownership';
axsQuotes.INST_OWN_ABR_STRING = 'Inst. Own:';
axsQuotes.EPS_STRING = 'E P S';
axsQuotes.EPS_ABR_STRING = 'EPS:';

//XPath expressions
axsQuotes.NEWS_XPATH_STRING = './/td[@class="title" or @class="source"]';
axsQuotes.FIN_XPATH_STRING = 'id("fd")//tr[1]';
axsQuotes.R_AND_S_XPATH_STRING = 'id("keyratios")//tr[1]';
axsQuotes.M_DAT_XPATH_STRING = './td[@class="key" or @class="val"]';
axsQuotes.QUOTE_XPATH_STRING = 'id("md")//tr[1]/td[1]';
axsQuotes.HOURS_XPATH_STRING = './/nobr';
axsQuotes.COMP_XPATH_STRING = 'id("companyheader")//h1';

/**
 * {Array} for building a sentence for the Data description section
 */
axsQuotes.marketDataDescArray = new Array(axsQuotes.PRICE_STRING,
                                          axsQuotes.CHANGE_STRING,
                                          axsQuotes.OR_STRING,
                                          axsQuotes.DATE_STRING);
/**
 * {Array} for building a sentence for the Related companies section  
 */
axsQuotes.relatedCompaniesDescArray = new Array(axsQuotes.EMPTY_STRING,
                                                axsQuotes.EXCHANGE_STRING,
                                                axsQuotes.SYMBOL_STRING,
                                                axsQuotes.LAST_TRADE_STRING,
                                                axsQuotes.CHANGE_STRING,
                                                axsQuotes.OR_STRING,
                                                axsQuotes.MKT_CAP_STRING,
                                                axsQuotes.USD_STRING);
/**
 * {Array} for building a sentence for the Financials section
 */
axsQuotes.financialsDescArray = null;
axsQuotes.ratAndStatDescArray = null;

/**
 * {Map} from abbreviated phrases to expanded phrases
 */
axsQuotes.phrasesMap = new Object();
axsQuotes.phrasesMap[axsQuotes.TTM_STRING] = axsQuotes.WEEKS_STRING;
axsQuotes.phrasesMap[axsQuotes.NYSE_ABR_STRING] = axsQuotes.NYSE_STRING;
axsQuotes.phrasesMap[axsQuotes.NASDAQ_ABR_STRING] = axsQuotes.NASDAQ_STRING;
axsQuotes.phrasesMap[axsQuotes.LON_ABR_STRING] = axsQuotes.LON_STRING;
axsQuotes.phrasesMap[axsQuotes.OTC_ABR_STRING] = axsQuotes.OTC_STRING;
axsQuotes.phrasesMap[axsQuotes.AMEX_ABR_STRING] = axsQuotes.AMEX_STRING;
axsQuotes.phrasesMap[axsQuotes.EPA_ABR_STRING] = axsQuotes.EPA_STRING;
axsQuotes.phrasesMap[axsQuotes.ASX_ABR_STRING] = axsQuotes.ASX_STRING;
axsQuotes.phrasesMap[axsQuotes.MKT_ABR_CAP_STRING] = axsQuotes.MKT_CAP_STRING;
axsQuotes.phrasesMap[axsQuotes.WEEKS_ABR_STRING] = axsQuotes.WEEKS_STRING;
axsQuotes.phrasesMap[axsQuotes.NA_ABR_STRING] = axsQuotes.NA_STRING;
axsQuotes.phrasesMap[axsQuotes.P_E_ABR_STRING] = axsQuotes.P_E_STRING;
axsQuotes.phrasesMap[axsQuotes.F_P_E_ABR_STRING] = axsQuotes.F_P_E_STRING;
axsQuotes.phrasesMap[axsQuotes.VOL_ABR_STRING] = axsQuotes.VOL_STRING;
axsQuotes.phrasesMap[axsQuotes.AVG_ABR_VOL_STRING] = axsQuotes.AVG_VOL_STRING;
axsQuotes.phrasesMap[axsQuotes.INST_OWN_ABR_STRING] = axsQuotes.INST_OWN_STRING;
axsQuotes.phrasesMap[axsQuotes.EPS_ABR_STRING] = axsQuotes.EPS_STRING;

/**
 * Map from prefix characters to strings 
 */
axsQuotes.charPrefixMap = new Object();
axsQuotes.charPrefixMap[axsQuotes.DOWN_ABR_STRING] = axsQuotes.DOWN_STRING;
axsQuotes.charPrefixMap[axsQuotes.UP_ABR_STRING] = axsQuotes.UP_STRING;

/**
 * Map from suffix characters to strings 
 */
axsQuotes.charSuffixMap = new Object();
axsQuotes.charSuffixMap[axsQuotes.BLN_ABR_STRING] = axsQuotes.BLN_STRING;
axsQuotes.charSuffixMap[axsQuotes.MLN_ABR_STRING] = axsQuotes.MLN_STRING;
axsQuotes.charSuffixMap[axsQuotes.PRCNT_ABR_STRING] = axsQuotes.PRCNT_STRING;

//These are strings to be spoken to the user
axsQuotes.HELP = 'The following shortcut keys are available. ';

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

  //Content navigation rule is hardcoded for efficiency
  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +

  "<target title='Stock screener' hotkey='s'>" +
    "//body//tbody//td[2]/form/a" +
  "</target>" +

  "<list title='Market data' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsQuotes.readMarketDataDesc'>" +
      "id('md')//tr[1]/td[1]" +
    "</item>" +
    "<item action='CALL:axsQuotes.readMarketDataDesc'>" +
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
      "id('fd')//tr[1]//td[1]axsQuotes.BIO_STRING" +
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
    var headerElems = axsQuotes.axsJAXObj.evalXPath(axsQuotes.COMP_XPATH_STRING,
        document.body);
    var quoteElems = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH_STRING,
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
  var elements = axsQuotes.axsJAXObj.evalXPath(axsQuotes.FIN_XPATH_STRING, 
                                               document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsQuotes.normalizeString(currentCaption) + ', ';
  var oneYearOldCaption = tableRow.childNodes[5].textContent;
  oneYearOldCaption = oneYearOldCaption.replace('(', ' ').replace(')', ' ');
  oneYearOldCaption = axsQuotes.normalizeString(oneYearOldCaption)  + ', ';
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
  var elements = axsQuotes.axsJAXObj.evalXPath(axsQuotes.R_AND_S_XPATH_STRING,
                                               document.body);
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
  if (twoYearsCaption.indexOf(axsQuotes.TTM_STRING) != -1) {
    twoYearsCaption = twoYearsCaption.replace(axsQuotes.TTM_STRING,
                                              axsQuotes.TTM_SPACES_STRING);
  }
  axsQuotes.ratAndStatDescArray = new Array('',
                                            currentCaption,
                                            oneYearCaption,
                                            twoYearsCaption);
};

/**
 * Reads and speaks the first two item elements in the 'Market data' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readMarketDataDesc = function(item) {
  var element = item.elem;
  var text = '';
  if (element.tagName == 'TD') {
    text = axsQuotes.parseCurrentQuote(element);
  } else {
    var columns = axsQuotes.axsJAXObj.evalXPath(axsQuotes.M_DAT_XPATH_STRING,
                                                  element);
    var firstPhrase = '';
    var secondPhrase = '';
    for (var i = 0; i < columns.length; i = i + 2) {
      firstPhrase = axsQuotes.parseSpecChrsAndTkns(columns[i].textContent);
      secondPhrase = axsQuotes.parseSpecChrsAndTkns(columns[i + 1].textContent);
      text = text + firstPhrase + ' ' + secondPhrase + '. ';
    }
  }
  axsQuotes.speakAndGo(element, text);
};

/**
 * Reads and speaks the third item elements in the 'Market data' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readAfterHours = function(item) {
  var text = '';
  var element = item.elem;
  var afterHours = element.childNodes[0].textContent;
  afterHours = axsQuotes.parseSpecChrsAndTkns(afterHours);
  afterHours = afterHours + ' ' + axsQuotes.OR_STRING + ' ';
  var percent = element.childNodes[2].textContent;
  percent = axsQuotes.parseSpecChrsAndTkns(percent);
  percent = percent + ', ';
  var time = element.childNodes[4].textContent;
  text = afterHours + percent + time;

  axsQuotes.speakAndGo(element, text);
};

/**
 * Reads and speaks the first element in the first and second items in the 
 * Market data list.
 */
axsQuotes.readCurrentQuote = function() {
  var elements = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH_STRING,
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
  dateAndStatus = dateAndStatus.replace(' -', axsQuotes.STATUS_STRING);
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
 * Reads and speaks the item elements in the 'News' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readNewsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var contents = axsQuotes.axsJAXObj.evalXPath(axsQuotes.NEWS_XPATH_STRING,
                                               element);
  text = contents[0].textContent + '. ';
  text = text + contents[1].childNodes[0].textContent;
  text = text + contents[1].childNodes[1].textContent;
  axsQuotes.speakAndGo(item.elem, text);
};

/**
 * Reads and speaks the item elements in the 'Related companies' list.
 * @param {Object?} item A wrapper for the current DOM node.
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
    note = axsQuotes.DELAY_STRING;
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
 * Reads and speaks the item elements in the 'Income statement in millions of 
 * US dollars', 'Balance sheet in millions of US dollars', Cash flow in millions
 * of US dollars' lists.
 * @param {Object?} item A wrapper for the current DOM node.
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
 * Reads and speaks the item elements in the 'Key statistics and ratios' list.
 * @param {Object?} item A wrapper for the current DOM node.
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
 * Reads and speaks the item elements in the 'Officers and directors' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readManagementDescription = function(item) {
  var element = item.elem;
  var personName = element.childNodes[1].textContent;
  personName = personName.replace(axsQuotes.GT_STRING, axsQuotes.EMPTY_STRING);
  var position = element.childNodes[3].textContent;
  var info = element.nextSibling.nextSibling.textContent;
  var index = info.indexOf(axsQuotes.BIO_STRING);
  info = info.substring(0, index);
  info = axsQuotes.normalizeString(info);
  var columnsText = new Array(personName, position, info);
  var rowText = axsQuotes.buildTableRowText(columnsText, null);
  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Reads and speaks the item elements in the 'Events' list.
 * @param {Object?} item A wrapper for the current DOM node.
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
 * Reads and speaks the third item elements in the 'Summary' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readSummarylinksCompDesc = function(item) {
  var element = item.elem;
  var text = axsQuotes.normalizeString(element.textContent);
  axsQuotes.speakAndGo(element, text);
};

/**
 * Reads and speaks the first and second item elements in the 'Summary' list.
 * @param {Object?} item A wrapper for the current DOM node.
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
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];
    //check for whole word mapping
    var tokenMapping = axsQuotes.phrasesMap[token];
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
