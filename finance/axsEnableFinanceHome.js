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
 * of the Google Finance home page
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Strings to be spoken to the user
 */
axsFinance.str = {
  HELP : 'The following shortcut keys are available. ',
  COMPANY : 'Company ',
  OR : ' or ',
  MARKET_CAP : ' market cap ',
  USD : ' US dollars ',
  VOLUME : ' volume ',
  UP : ' up by ',
  DOWN : ' down by ',
  PRCNT : ' percent',
  MILLION : ' million ',
  BILLION : ' billion ',
  CONSUMERS : 'Consumer ',
  STD_AND_POOR : "Standard and Poor's 500",
  UP_ABBR : '+',
  MINUS_ABBR : '-',
  PRCNT_ABBR : '%',
  MILLION_ABBR : 'M',
  BILLION_ABBR : 'B',
  GOOGLE_FINANCE : 'Google Finance'
};

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsFinance.charPrefixMap = new Object();
axsFinance.charPrefixMap[axsFinance.str.MINUS_ABBR] = axsFinance.str.DOWN;
axsFinance.charPrefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsFinance.charSuffixMap = new Object();
axsFinance.charSuffixMap[axsFinance.str.BILLION_ABBR] = axsFinance.str.BILLION;
axsFinance.charSuffixMap[axsFinance.str.MILLION_ABBR] = axsFinance.str.MILLION;
axsFinance.charSuffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;


/**
 * Phrase array for building the utterances for trends section without the 
 * volume sub-section.
 * @type{Array}
 */
axsFinance.noVolDescArray = new Array(axsFinance.str.COMPANY,
                                        ' ',
                                      axsFinance.str.MARKET_CAP,
                                      axsFinance.str.USD);

/**
 * Phrase array for building the utterances for the volume sub-section
 * of the trends section
 * @type{Array}
 */
axsFinance.volDescArray = new Array(axsFinance.str.COMPANY,
                                    axsFinance.str.VOLUME,
                                    axsFinance.str.USD +
                                    ' ' + axsFinance.str.MARKET_CAP,
                                    axsFinance.str.USD);

/**
 * Phrase array for building the utterances for indices and currencies section.
 * @type{Array}
 */
axsFinance.IndAndCurDescArray = new Array('',
                                            ' ',
                                            '',
                                          axsFinance.str.OR,
                                            '');
/**
 * Phrase array for building the utterances for recent quotes section.
 * @type{Array}
 */
axsFinance.recQuotesDescArray = new Array('',
                                            ' ',
                                            '',
                                          axsFinance.str.OR,
                                          axsFinance.str.MARKET_CAP,
                                          axsFinance.str.USD);

/**
 * Template for presenting the sector status bar of the market summary section.
 * @type {string}
 */
axsFinance.SECT_SUM_TMPL = '{0} percent of this sector is ' +
      'down. {1} percent of all the companies are down by more than {2} ' +
      'percent. {3} percent of this sector is up. {4} percent  of all the ' +
      'companies are up by more than {5} percent.';

/**
 * CNR
 */
axsFinance.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +
    '' +
    '  <target title="Go to link" hotkey="ENTER"' +
    '      onEmpty="No link available">' +
    '    ./descendant-or-self::a' +
    '  </target>' +
    '' +
    '  <target title="Stock screener" hotkey="s">' +
    '    //a[@href="/finance/stockscreener"]' +
    '  </target>' +
    ''+
    '  <target title="Portfolios" hotkey="o">' +
    '    id("guser")//a[text()="Portfolios"]' +
    '  </target>' +
    '' +
    '  <list title="Market summary" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item index="0" count="1"' +
    '        action="CALL:axsFinance.handleMarketSummaryDescri' +
    'ption">' +
    '      id("home-main")//div[contains(@class, "news major")' +
    ']//a' +
    '    </item>' +
    '' +
    '    <item index="1">' +
    '      id("home-main")//div[contains(@class, "news major")]' +
    '          //a[not(@class="more-rel")]' +
    '    </item>' +
    '' +
    '    <target title="Related articles"  hotkey="r"' +
    '        onEmpty="No related articles available.">' +
    '      //div[contains(@class, "news major")]//a[@class="more-rel"]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Market summary indices and currencies"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowIndicesAndC' +
    'urrencies">' +
    '       id("sfe-mktsumm")//tr[*/*]' +
    '    </item>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Market top stories" next="DOWN j" prev="UP' +
    ' k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readMktTopStAndPortfRelTopStDesc">' +
    '      id("market-news")//span[@class="name"]//a' +
    '    </item>' +
    '' +
    '    <target title="Related articles"  hotkey="r"' +
    '        onEmpty="No related articles available.">' +
    '      ./../following-sibling::div' +
    '          [@class="g-section g-tpl-65 sfe-break-bottom" or' +
    '          @class="byline sfe-break-bottom"]' +
    '          [1]/descendant::a[@class="more-rel"]' +
    '    </target>' +
    '' +
    '    <target title = "Market top stories" trigger="listEnt' +
    'ry">' +
    '      id("market-news-title")' +
    '    </target>' +
    '' +
    '    <target title="View all daily news"  hotkey="a"' +
    '        onEmpty="No more daily news">' +
    '      id("market-news")//a[contains(text(), "View all of today")]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Portfolio related top stories"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readMktTopStAndPortfRel' +
    'TopStDesc">' +
    '       id("portfolio-news")//span[@class="name"]//a' +
    '    </item>' +
    '' +
    '    <target title="Related articles" hotkey="r"' +
    '        onEmpty="No related articles available.">' +
    '      ./../following-sibling::div[@class="sfe-break-botto' +
    'm" or' +
    '          @class="byline sfe-break-bottom"][1]/' +
    '          descendant::a[@class="more-rel"]' +
    '    </target>' +
    '' +
    '    <target title = "Portfolio related top stories"' +
    '        trigger="listEntry">' +
    '      id("portfolio-news-title")' +
    '    </target>' +
    '' +
    '    <target title="View all daily news"  hotkey="a"' +
    '        onEmpty="No more daily news">' +
    '      id("portfolio-news-title")//a[contains(text(), ' +
    '"View all of today")]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Video top stories" next="DOWN j" prev="UP ' +
    'k" fwd="n"' +
    '      back="p" type="dynamic">' +
    '' +
    '    <item action="CALL:axsFinance.readVideoDesc">' +
    '      id("video-news")//a[@class]' +
    '    </item>' +
    '' +
    '    <target title = "Video top stories" trigger="listEntr' +
    'y">' +
    '      id("video-news-title")' +
    '    </target>' +
    '' +
    '    <target title="More finance videos on Google video"  hotkey="a"' +
    '        onEmpty="No more finance videos">' +
    '      id("video-news")//a[not(@class)]' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Recent quotes" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p" type="dynamic">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowRecentQuote' +
    'sDesc">' +
    '      id("home-main")//table[@class="quotes"]//' +
    '      td[@class="symbol"]/..[not(@class="colHeader")]' +
    '    </item>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Sector summary" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowSectorSumma' +
    'ryDesc">' +
    '       id("secperf")/table/tbody/tr[not(@class="colHeader' +
    '")]' +
    '    </item>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Popular trends" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsNoVol' +
    'umeDesc">' +
    '       id("tm_zeitgeist")//td[@class="symbol"]/..' +
    '    </item>' +
    '' +
    '    <target title = "Popular trends" trigger="listEntry">' +
    '      id("l_tm_zeitgeist")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Price trends gainers" next="DOWN j"' +
    '      prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsNoVol' +
    'umeDesc">' +
    '      id("tm_price_0")//td[@class="change chg"]/..' +
    '    </item>' +
    '' +
    '    <target title = "Price trends gainers" trigger="listE' +
    'ntry">' +
    '      id("l_tm_price")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Price trends losers" next="DOWN j" prev="U' +
    'P k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsNoVol' +
    'umeDesc">' +
    '      id("tm_price_0")//td[@class="change chr"]/..' +
    '    </item>' +
    '' +
    '    <target title = "Price trends losers" trigger="listEn' +
    'try">' +
    '      id("l_tm_price")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Market capitalization trends gainers"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsNoVol' +
    'umeDesc">' +
    '     id("tm_mcap_0")//td[@class="change chg"]/..' +
    '    </item>' +
    '' +
    '    <target title = "Market capitalization trends gainers' +
    '"' +
    '        trigger="listEntry">' +
    '      id("l_tm_mcap")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Market capitalization trends losers"' +
    '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsNoVol' +
    'umeDesc">' +
    '     id("tm_mcap_0")//td[@class="change chr"]/..' +
    '    </item>' +
    '' +
    '    <target title = "Market capitalization trends losers"' +
    ' ' +
    '        trigger="listEntry">' +
    '      id("l_tm_mcap")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
    '  <list title="Volume trends" next="DOWN j" prev="UP k"' +
    '      fwd="n" back="p">' +
    '' +
    '    <item action="CALL:axsFinance.readTableRowTrendsVolum' +
    'eDesc">' +
    '      id("tm_volume_0")//td[@class="name"]/.. |' +
    '          id("tm_volume_0")/div' +
    '    </item>' +
    '' +
    '    <target title = "Volume trends" trigger="listEntry">' +
    '      id("l_tm_volume")' +
    '    </target>' +
    '' +
    '  </list>' +
    '' +
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
axsFinance.init = function(){
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
};

/**
 * Handles the DOMSubtreeModified event. 
 * This event happens when the selected node for the 
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event.
 */
axsFinance.DOMSubtreeModifiedHandler = function(evt){
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
  } else if (target.id == 'video-news') {
    window.setTimeout(function() {
                        axsFinance.axsNavObj.refreshList('Video top stories');
                      },
                      0);
  }
};

/**
 * Reads the market summary description. This is only invoked
 * when the top major news story is accessed.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.handleMarketSummaryDescription = function(item) {
  var rootNode = document.getElementById('home-main');
  var xpath = "//div[contains(@class, 'news major')]";
  var newsSectionNode = axsFinance.axsJAXObj.evalXPath(xpath, rootNode)[0];
  xpath = "//span[contains(@class, 'name')]";
  var headlineNode = axsFinance.axsJAXObj.evalXPath(xpath, newsSectionNode)[0];
  xpath = "//div[contains(@class, 'byline')]";
  var bylineNode = axsFinance.axsJAXObj.evalXPath(xpath, newsSectionNode)[0];
  xpath = "//div[contains(@class, 'snippet')]";
  var snippetNode = axsFinance.axsJAXObj.evalXPath(xpath, newsSectionNode)[0];

  var text = headlineNode.textContent + '. ' +
             bylineNode.textContent + '. ' +
             snippetNode.textContent + '. ';

  axsFinance.speakAndGo(item.elem, text);
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
 * Reads rows from the indices and currencies table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowIndicesAndCurrencies = function(item) {
  //handle special characters and order columns)
  var columns = item.elem.childNodes;

  var index = columns[1].textContent;
  if (index.indexOf('S&P') != -1) {
    index = axsFinance.str.STD_AND_POOR;
  }
  var rate = axsFinance.parseSpecialChars(columns[2].textContent);
  var absoluteChange = axsFinance.parseSpecialChars(columns[3].textContent);

  //due to inconsistency in http://finance.google.com/finance
  var relativeChange = columns[4].textContent;
  if (relativeChange.charAt(1) != '-') {
    relativeChange = '+' + relativeChange.substring(1);
  }
  relativeChange = axsFinance.parseSpecialChars(relativeChange);

  var textContents = new Array(index,
                               rate,
                               absoluteChange,
                               relativeChange);

  var rowText = axsFinance.buildTableRowText(textContents,
      axsFinance.IndAndCurDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
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
 * Reads rows from the 'Market' and 'Portfolio' top stories.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readMktTopStAndPortfRelTopStDesc = function(item) {
  var element = item.elem;
  var title = element.textContent + '. ';
  var parentNode = element.parentNode;

  var xPath = './/following-sibling::div[@class="byline"]';
  var times = axsFinance.axsJAXObj.evalXPath(xPath, element);
  var time = '';
  if (times[0]) {
    time = times[0].textContent;
  }

  var snippet = '';
  if (parentNode.parentNode.className.indexOf('g-unit') == -1) {
    xPath = './/following-sibling::*//div[@class="snippet"]';
    var snippets = axsFinance.axsJAXObj.evalXPath(xPath, parentNode);
    snippet = snippets[0].textContent;
  }

  var text = title + ' ' + time + ' ' + snippet;
  axsFinance.speakAndGo(element, text);
};

/**
 * Reads rows from the video top stories section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readVideoDesc = function(item) {
  var element = item.elem;
  var title = element.textContent + '. ';
  var parentNode = element.parentNode;

  var xPath = './/following-sibling::div[@class="byline"]';
  var times = axsFinance.axsJAXObj.evalXPath(xPath, element);
  var time = '';
  if (times[0]) {
    time = times[0].textContent;
  }

  var snippet = '';
  if (parentNode.id == 'video-header') {
    xPath = './/following-sibling::div[@id="video-footer"]';
    var snippets = axsFinance.axsJAXObj.evalXPath(xPath, parentNode);
    snippet = snippets[0].textContent;
  }

  var text = title + ' ' + time + ' ' + snippet;
  axsFinance.speakAndGo(element, text);
};

/**
 * Reads rows from the recent quotes section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowRecentQuotesDesc = function(item) {
  var element = item.elem;

  var symbol = element.getElementsByClassName('symbol')[0].textContent;
  var price = element.getElementsByClassName('price')[0].textContent;
  var changes = element.getElementsByClassName('chg');
  if (changes.length === 0) {
    changes = element.getElementsByClassName('chr');
  }
  var absoluteChange = axsFinance.parseSpecialChars(changes[0].textContent);
  var relativeChange = axsFinance.parseSpecialChars(changes[1].textContent);
  var marketCap = element.getElementsByClassName('mktCap')[0].textContent;
  marketCap = axsFinance.parseSpecialChars(marketCap);

  var textContents = new Array(symbol,
                               price,
                               absoluteChange,
                               relativeChange,
                               marketCap);

  var rowText = axsFinance.buildTableRowText(textContents,
                                             axsFinance.recQuotesDescArray);

  axsFinance.speakAndGo(item.elem, rowText);
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
  var absoluteChange = axsFinance.parseSpecialChars(columns[3].textContent);

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
  var percentParameters = new Array();
  percentParameters[0] = downPrcntAboveTreshold + downPrcntBelowTreshold;
  percentParameters[1] = downPrcntAboveTreshold;
  percentParameters[2] = treshold;
  percentParameters[3] = upPrcntAboveTreshold + upPrcntBelowTreshold;
  percentParameters[4] = upPrcntAboveTreshold;
  percentParameters[5] = treshold;

  //template used due to specific representation
  var statusBarDesc = axsFinance.populateTemplate(axsFinance.SECT_SUM_TMPL,
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
  var rowText = axsFinance.buildTableRowText(columnValues,
                                             axsFinance.noVolDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
};

/**
 * Reads rows from the volume subsection of the trends section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRowTrendsVolumeDesc = function(item) {
  //handle special characters and order columns
  var columnValues = axsFinance.getTableRowContentArray(item);
  var rowText = axsFinance.buildTableRowText(columnValues,
                                             axsFinance.volDescArray);
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
  absoluteChange = axsFinance.parseSpecialChars(absoluteChange);
  var marketCap = axsFinance.parseSpecialChars(columns[5].textContent);

  var columnValues = new Array(company, absoluteChange, marketCap);
  return columnValues;
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content.
 * @param {Array?} textContents Array with the contents of table columns. 
 * @param {Array?} columnDescriptors Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsFinance.buildTableRowText = function(textContents, columnDescriptors) {
  //check inputs
  if (textContents === null) {
    return '';
  }

  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (columnDescriptors !== null && i < columnDescriptors.length) {
      rowText = rowText + ' ' + columnDescriptors[i];
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (columnDescriptors !== null && i < columnDescriptors.length) {
    rowText = rowText + columnDescriptors[i];
  }
  return rowText;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * @param {string} text The text to be processed.
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsFinance.parseSpecialChars = function(text) {
  var parsedText = '';
  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //remove brackets
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
window.addEventListener('load', axsFinance.init, true);
