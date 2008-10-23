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
  BIO : 'Bio',
  GT : '>',
  OR : 'or',
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
  EXCHANGE : 'Traded on',
  SYMBOL : 'Symbol',
  LAST_TRADE : 'Last trade',
  CHANGE : 'Change',
  MKT_CAP : 'Market cap',
  DELAY : ' Note that the last trade is delayed ' +
    'up to 20 minutes. ',
  USD : 'US dollars',
  TTM : 'TTM',
  TTM_SPACES : 'T T M',
  EXAMPLE : 'Example',
  DEFINITION : 'Definition',

  //Strings for stock exchanges
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
  UNDEFINED_ABBR : '-',
  UNDEFINED : 'undefined',

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
axsFinance.marketDataDescArray = new Array(axsFinance.str.PRICE,
                                          axsFinance.str.CHANGE,
                                          axsFinance.str.OR,
                                          axsFinance.str.DATE);
/**
 * Array for building a sentence for the Related companies section  
 * @type Array
 */
axsFinance.relatedCompaniesDescArray = new Array('',
                                                axsFinance.str.EXCHANGE,
                                                axsFinance.str.SYMBOL,
                                                axsFinance.str.LAST_TRADE,
                                                '',
                                                axsFinance.str.OR,
                                                axsFinance.str.MKT_CAP,
                                                axsFinance.str.USD);
/**
 * Array for building a sentence for the 'Financials' section
 * @type Array
 */
axsFinance.financialsDescArray = new Array();

/**
 * Array for building a sentence for the 'Ratios and Stats' section
 * @type Array
 */
axsFinance.ratAndStatDescArray = new Array();

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
axsFinance.phrasesMap[axsFinance.str.MKT_CAP_ABBR] = axsFinance.str.MKT_CAP;
axsFinance.phrasesMap[axsFinance.str.WEEKS_ABBR] = axsFinance.str.WEEKS;
axsFinance.phrasesMap[axsFinance.str.NA_ABBR] = axsFinance.str.NA;
axsFinance.phrasesMap[axsFinance.str.P_E_ABBR] = axsFinance.str.P_E;
axsFinance.phrasesMap[axsFinance.str.F_P_E_ABBR] = axsFinance.str.F_P_E;
axsFinance.phrasesMap[axsFinance.str.VOL_ABBR] = axsFinance.str.VOL;
axsFinance.phrasesMap[axsFinance.str.AVG_VOL_ABBR] = axsFinance.str.AVG_VOL;
axsFinance.phrasesMap[axsFinance.str.INST_OWN_ABBR] = axsFinance.str.INST_OWN;
axsFinance.phrasesMap[axsFinance.str.EPS_ABBR] = axsFinance.str.EPS;
axsFinance.phrasesMap[axsFinance.str.UNDEFINED_ABBR] = axsFinance.str.UNDEFINED;

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
    '    /html' +
    '  </target>' +
    '' +
    '  <list title="Market data" next="DOWN j" prev="UP k" fwd' +
    '="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readCurrentQuote">' +
    '      /html' +
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
    '       id("news_tab_title")' +
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
    '      id("blogs_tab_title")' +
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
    '      id("plot_feeds_title")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Related companies" next="DOWN j" prev="UP ' +
    'k" fwd="n"' +
    '      back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readRelCompDesc">' +
    '      id("related")//tbody//tr' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER">' +
    '       .//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("related")/div[@class="hdg"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Discussions" next="DOWN j" prev="UP k" fwd' +
    '="n" back="p">' +
    '' +
    '    <item>' +
    '      id("groups")//div[@class="item"]//a[@id]' +
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
    '    <target title="All discussions" hotkey="a" ' +
    '        onEmpty="No more discussions">' +
    '      id("groups")//div[@class="item"]//a[not(@id)]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Blog posts" next="DOWN j" prev="UP k" fwd=' +
    '"n" back="p">' +
    '' +
    '    <item>' +
    '      id("blogs")//div[@class="item"]' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER" onEmpty="No' +
    ' ' +
    '        link available.">' +
    '      .//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("blogs")/div[@class="hdg"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Events" next="DOWN j" prev="UP k" fwd="n" ' +
    'back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readEventsDesc">' +
    '      id("events")//tr' +
    '    </item>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("blogs")/following-sibling::div[@class="content"' +
    ']' +
    '        /div[@class="hdg"]' +
    '    </target>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER" onEmpty="No' +
    '        link available.">' +
    '      .//descendant-or-self::a' +
    '    </target>' +
    '' +
    '    <target title="All events from AOL" hotkey="a" ' +
    '        onEmpty="No more events">' +
    '      id("all_events")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Summary" next="DOWN j" prev="UP k" fwd="n"' +
    ' back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readSummaryTextCompDesc"' +
    '>' +
    '      id("summary")//div[@class="item companySummary"]' +
    '    </item>' +
    '' +
    '    <item>' +
    '      id("summary")//div[@class="content"]//td[1]' +
    '    </item>' +
    '' +
    '    <item action="CALL:axsFinance.readSummarylinksCompDesc' +
    '">' +
    '      id("summary")//div[@class="content"]//a[contains(@i' +
    'd,"fs-")]' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER" onEmpty="No' +
    '        link available.">' +
    '      .//descendant-or-self::a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("summary")/div[@class="hdg"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Income statement in millions of US dollars' +
    '"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '    <item index="1" count="4"' +
    '        action="CALL:axsFinance.readFinancialCompDesc">' +
    '      id("fd")//tr' +
    '    </item>' +
    '' +
    '    <target title="Income statement section" trigger="lis' +
    'tEntry">' +
    '      id("fd")//tr[1]//td[1]axsFinance.str.BIO' +
    '    </target>' +
    '' +
    '    <target title="Open income statement" hotkey="ENTER">' +
    '      ./../tr[1]//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("fd")//tr[1][//a]' +
    '    </target>' +
    '' +
    '  </list> ' +
    '' +
    '  <list title="Balance sheet in millions of US dollars"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item index="7" count="5"' +
    '        action="CALL:axsFinance.readFinancialCompDesc">' +
    '      id("fd")//tr' +
    '    </item>' +
    '' +
    '    <target title="Open balance sheet" hotkey="ENTER">' +
    '      ./../tr[6]//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("fd")//tr[6][//a]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Cash flow in millions of US dollars" next=' +
    '"DOWN j" ' +
    '      prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item index="12" count="5"' +
    '        action="CALL:axsFinance.readFinancialCompDesc">' +
    '      id("fd")//tr' +
    '    </item>' +
    '' +
    '    <target title="Open cash flow" hotkey="ENTER">' +
    '      ./../tr[12]//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("fd")//tr[12][//a]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Key statistics and ratios" next="DOWN j" p' +
    'rev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readRatAndStatsCompDesc"' +
    '>' +
    '      id("keyratios")//tr[@class]' +
    '    </item>' +
    '' +
    '    <target title="More ratios from Reuters" hotkey="a"' +
    '        onEmpty="No more ratios">' +
    '      id("keyratios")//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("keyratios")/div[@class="hdg"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="More resources" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item>' +
    '      id("m-analyst")/.. | id("m-sec")/.. | id("m-hold")/' +
    '.. |' +
    '          id("m-options")/.. | id("m-research")/.. |' +
    '          id("m-wiki")/.. | id("m-transcripts")/..' +
    '    </item>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER">' +
    '      .//a' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry" >' +
    '      id("keyratios")/following-sibling::div[@class="hdg"' +
    ']' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Officers and directors" next="DOWN j"' +
    '      prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readManagementDescriptio' +
    'n">' +
    '      id("management")//tr[not(@id="hide") and @id]' +
    '    </item>' +
    '' +
    '    <item>' +
    '      id("management")//td/a' +
    '    </item>' +
    '' +
    '    <target title="Biography and compensation" hotkey="b"' +
    '>' +
    '      .//following-sibling::tr[1]//a[@class="e-p"]' +
    '    </target>' +
    '' +
    '    <target title="Trading activity" hotkey="t" onEmpty="' +
    'No trading' +
    '        activity available.">' +
    '      .//following-sibling::tr[1]//a[@class="e-t"]' +
    '    </target>' +
    '' +
    '    <target title="Go to link" hotkey="ENTER"' +
    '        onEmpty="No link available.">' +
    '      .' +
    '    </target>' +
    '' +
    '    <target title="Go to section" trigger="listEntry">' +
    '      id("mgmtdiv")' +
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

  //Table columns are static for the page but change over time
  axsFinance.populateFinancialsDescArray();
  axsFinance.populateRatAndStatDescArray();

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
    if (child.className == 'selected'){
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
 * @param {Event} evt The focus event.
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
 * Populates the array used for building a sentence for presenting the
 * 'Balance sheet in millions of US dollars', Cash flow in millions
 * of US dollars' lists (Financial section). 
 * NOTE: The array is built dynamically since the captions of the Financials
 * table vary over time.
 */
axsFinance.populateFinancialsDescArray = function() {
  var xpath = 'id("fd")//tr[1]';
  var elements = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsFinance.normalizeString(currentCaption) + ', ';
  var oneYearOldCaption = tableRow.childNodes[5].textContent;
  oneYearOldCaption = oneYearOldCaption.replace('(', ' ').replace(')', ' ');
  oneYearOldCaption = axsFinance.normalizeString(oneYearOldCaption) + ', ';
  var twoYearsOldCaption = tableRow.childNodes[7].textContent;
  twoYearsOldCaption = twoYearsOldCaption.replace('(', ' ').replace(')', ' ');
  twoYearsOldCaption = axsFinance.normalizeString(twoYearsOldCaption) + ', ';

  axsFinance.financialsDescArray = new Array('',
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
axsFinance.populateRatAndStatDescArray = function() {
  var xpath = 'id("keyratios")//tr[1]';
  var elements = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsFinance.normalizeString(currentCaption) + ', ';
  var oneYearCaption = tableRow.childNodes[5].textContent;
  oneYearCaption = oneYearCaption.replace('(', ' ').replace(')', ' ');
  oneYearCaption = axsFinance.normalizeString(oneYearCaption) + ', ';
  var twoYearsCaption = tableRow.childNodes[7].textContent;
  twoYearsCaption = twoYearsCaption.replace('(', ' ').replace(')', ' ');
  twoYearsCaption = axsFinance.normalizeString(twoYearsCaption) + ', ';
  if (twoYearsCaption.indexOf(axsFinance.str.TTM) != -1) {
    twoYearsCaption = twoYearsCaption.replace(axsFinance.str.TTM,
                                              axsFinance.str.TTM_SPACES);
  }
  axsFinance.ratAndStatDescArray = new Array('',
                                            currentCaption,
                                            oneYearCaption,
                                            twoYearsCaption);
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
 * @param {Node} element The current DOM node.
 * @return {string} The readable text generated from the quote.
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
 * Callback handler for reading the 'Related companies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRelCompDesc = function(item) {
  var element = item.elem;
  var rowColumns = element.childNodes;
  var companyName = axsFinance.normalizeString(rowColumns[1].textContent);
  var exchange = axsFinance.normalizeString(rowColumns[5].textContent);
  var exchangeFullName = axsFinance.phrasesMap[exchange];
  if (exchangeFullName !== undefined) {
    exchange = exchangeFullName;
  }
  var symbol = axsFinance.normalizeString(rowColumns[7].textContent);
  symbol = axsFinance.addSpaceBetweenChars(symbol);
  var lastTrade = axsFinance.normalizeString(rowColumns[9].textContent) ||
                  axsFinance.str.NA;
  var note = '';
  if (rowColumns[11].textContent.indexOf('*') != -1) {
    note = axsFinance.str.DELAY;
  }
  var index = rowColumns[13].textContent.indexOf('(');
  var absoluteChange = rowColumns[13].textContent.substring(0, index);
  absoluteChange = axsFinance.parseSpecChrsAndTkns(absoluteChange) ||
                   axsFinance.str.NA;
  var relativeChange = rowColumns[13].textContent.substring(index);
  relativeChange = axsFinance.parseSpecChrsAndTkns(relativeChange) ||
                   axsFinance.str.NA;
  var marketCap = axsFinance.parseSpecChrsAndTkns(rowColumns[15].textContent) ||
                  axsFinance.str.NA;
  var docTextPhrases = new Array(companyName,
                                 exchange,
                                 symbol,
                                 lastTrade,
                                 absoluteChange,
                                 relativeChange,
                                 marketCap,
                                 note);
  var rowText = axsFinance.buildTableRowText(docTextPhrases,
      axsFinance.relatedCompaniesDescArray);
  axsFinance.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Income statement in millions of
 * US dollars', 'Balance sheet in millions of US dollars', Cash flow in
 * millions of US dollars' lists.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readFinancialCompDesc = function(item) {
  var element = item.elem;

  var metricName = element.childNodes[1].textContent;
  metricName = axsFinance.parseSpecChrsAndTkns(metricName) + ', ';

  var currentValue = element.childNodes[3].textContent;
  currentValue = axsFinance.parseSpecChrsAndTkns(currentValue) + ', ';

  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsFinance.parseSpecChrsAndTkns(oneYearValue) + ', ';

  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsFinance.parseSpecChrsAndTkns(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsFinance.buildTableRowText(columnsText,
                                             axsFinance.financialsDescArray);

  axsFinance.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Key ratios and Stats' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRatAndStatsCompDesc = function(item) {
  var element = item.elem;
  var metricName = element.childNodes[1].textContent;
  metricName = axsFinance.parseSpecChrsAndTkns(metricName) + ', ';
  var currentValue = element.childNodes[3].textContent;
  currentValue = axsFinance.parseSpecChrsAndTkns(currentValue) + ', ';
  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsFinance.parseSpecChrsAndTkns(oneYearValue) + ', ';
  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsFinance.parseSpecChrsAndTkns(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsFinance.buildTableRowText(columnsText,
                                         axsFinance.ratAndStatDescArray);

  axsFinance.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the names and information of the people
 * in the 'Officers and directors' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readManagementDescription = function(item) {
  var element = item.elem;
  var personName = element.childNodes[1].textContent;
  personName = personName.replace(axsFinance.str.GT, '');
  personName = axsFinance.normalizeString(personName);
  var position = element.childNodes[3].textContent;
  var info = element.nextSibling.nextSibling.textContent;
  var index = info.indexOf(axsFinance.str.BIO);
  info = info.substring(0, index);
  info = axsFinance.normalizeString(info);
  var columnsText = new Array(personName, position, info);
  var rowText = axsFinance.buildTableRowText(columnsText, null);
  axsFinance.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the events in the 'Events' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readEventsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var dateAndTime = element.childNodes[1].textContent;
  dateAndTime = axsFinance.normalizeString(dateAndTime);
  var eventName = element.childNodes[3].childNodes[0].textContent;
  eventName = axsFinance.normalizeString(eventName);
  text = dateAndTime + ', ' + eventName;
  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company web site links in the 'Summary' 
 * list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readSummarylinksCompDesc = function(item) {
  var element = item.elem;
  var text = axsFinance.normalizeString(element.textContent);
  axsFinance.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company description in the 'Summary' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readSummaryTextCompDesc = function(item) {
  var element = item.elem;
  var text = element.childNodes[0].textContent;
  axsFinance.speakAndGo(element, text);
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
    textWithSpaces = textWithSpaces + text.charAt(i);
    if (i < text.length - 1) {
      textWithSpaces = textWithSpaces + ' ';
    }
  }
  return textWithSpaces;
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
 * @param {string} text The text to be processed.
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
window.addEventListener('load', axsFinance.init, true);
