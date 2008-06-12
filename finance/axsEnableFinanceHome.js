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
 * of the Google Finance homepage
 * @author svetoslavganov@google.com (Svetoslav Ganov)
 */

// create namespace
var axsFinance = {};

//These are strings to be spoken to the user
axsFinance.HELP = 'The following shortcut keys are available. ';

axsFinance.EMPTY_STRING = '';
axsFinance.SPACE_STRING = ' ';
axsFinance.COMPANY_STRING = 'Company ';
axsFinance.OR = ' or ';
axsFinance.MKT_CAP_STRING = ' market cap ';
axsFinance.USD_STRING = ' US dollars ';
axsFinance.VOLUME_STRING = ' volume ';
axsFinance.UP_STRING = ' up by ';
axsFinance.DOWN_STRING = ' down by ';
axsFinance.PERCENT_STRING = ' percent';
axsFinance.MILLION_STRING = ' million ';
axsFinance.BILLION_STRING = ' billion ';
axsFinance.CONSUMERS_STRING = 'Consumer ';
axsFinance.STD_AND_POOR_STRING = "Standard and Poor's 500";

axsFinance.noVolDescArray = new Array(axsFinance.COMPANY_STRING,
                                      axsFinance.SPACE_STRING,
                                      axsFinance.MKT_CAP_STRING,
                                      axsFinance.USD_STRING);

axsFinance.volDescArray = new Array(axsFinance.COMPANY_STRING,
                                    axsFinance.VOLUME_STRING,
                                    axsFinance.USD_STRING +
                                    ' ' + axsFinance.MKT_CAP_STRING,
                                    axsFinance.USD_STRING);

axsFinance.IndAndCurDescArray = new Array(axsFinance.EMPTY_STRING,
                                          axsFinance.SPACE_STRING,
                                          axsFinance.EMPTY_STRING,
                                          axsFinance.OR,
                                          axsFinance.EMPTY_STRING);
                                            
axsFinance.recQuotesDescArray = new Array(axsFinance.EMPTY_STRING,
                                          axsFinance.SPACE_STRING,
                                          axsFinance.EMPTY_STRING,
                                          axsFinance.OR,
                                          axsFinance.MKT_CAP_STRING,
                                          axsFinance.USD_STRING);

axsFinance.SECT_SUM_TMPL_STRING = '. {0} percent of this sector is ' +
		'down; {1} percent of all the companies are down by more than {2} ' +
		'percent. {3} percent of this sector is up; {4} percent  of all the ' +
		'companies are up by more than {5} percent.';
   

axsFinance.TABLE_XPATH_STRING = './descendant::table/descendant::td[@class]';

axsFinance.SNIPPET_XPATH_STRING = "./descendant::div[@class='snippet']";

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsFinance.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

axsFinance.init = function(){
  axsFinance.axsJAXObj = new AxsJAX(true);
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);
  
  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +
  "<list title='Market summary' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item index='0' count='1' " +
                  "action='CALL:axsFinance.handleMarketSummaryDescription'>" +
      "id('home-main')/div[3]/table/tbody/tr/td[1]/descendant::a[not(img) " +
      "and not(@class='more-rel')] " +
    "</item>" +
    "<item index='1'>" +
      "id('home-main')/div[3]/table/tbody/tr/td[1]/descendant::a[not(img) " +
      "and not(@class='more-rel')] " +
    "</item>" +
    "<target title='Related articles'  hotkey='r' onEmpty='No related " + 
                                                     "articles available.'>" +
      ". /../following-sibling::span//descendant::a[@class='more-rel']" +
    "</target>" +
  "</list>" +

  "<list title='Market summary indices and currencies' next='DOWN j' " + 
                                       "prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsFinance.handleTableRowIndicesAndCurrencies'>" +
       "id('sfe-mktsumm')/tbody/tr[*/div]" +
    "</item>" +
  "</list>" +  

  "<list title='Market top stories' next='DOWN j' prev='UP k' fwd='n' " + 
                                                            "back='p'>" +
    "<item action='CALL:axsFinance.handleMktTopStAndPortfRelTopSt'>" +
    "id('market-news')/div/div[*]/descendant::span[*]/a[not(@class)] | " + 
                                        "id('market-news')/div/div[*]/a" +
    "</item>" +
    "<target title='Related articles'  hotkey='r' onEmpty='No related " + 
                                                "articles available.'>" +
      "./../following-sibling::div[@class='g-section " + 
      "g-tpl-65 sfe-break-bottom' or @class='byline sfe-break-bottom']" + 
      "[1]/descendant::a[@class='more-rel']" +
    "</target>" +
    "<target title = 'Market top stories' trigger='listEntry'>" +
     "id('news-tab-pane')/ul/li[2]" +
    "</target>" +
  "</list>" +
  
  "<list title='Portfolio related top stories' next='DOWN j' prev='UP k' " +
                                                       "fwd='n' back='p'>" +
    "<item action='CALL:axsFinance.handleMktTopStAndPortfRelTopSt'>" +
      "id('portfolio-news')/div/div[*]/descendant::span[*]/a[not(@class)]" +
    "</item>" +
    "<target title='Related articles'  hotkey='r' onEmpty='No related " + 
                                                "articles available.'>" +
      "./../following-sibling::div[@class='sfe-break-bottom' or " + 
      "@class='byline sfe-break-bottom'][1]/" + 
      "descendant::a[@class='more-rel']" +
    "</target>" +
    "<target title = 'Portfolio related top stories' trigger='listEntry'>" +
      "id('news-tab-pane')/ul/li[3]" +
    "</target>" +
  "</list>" +
  
  "<list title='Video top stories' next='DOWN j' prev='UP k' fwd='n' " +
                                                           "back='p'>" +
    "<item action='CALL:axsFinance.handleVideoDescription'>" +
      "id('video-news')/div/div[*]/descendant::a" +
    "</item>" +
    "<target title = 'Video top stories' trigger='listEntry'>" +
      "id('news-tab-pane')/ul/li[4]" +
    "</target>" +
  "</list>" +
  
  "<list title='Recent quotes' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsFinance.handleTableRowRecentQuotes'>" +
      "id('home-main')/div[4]/div[1]/div/div[2]/table/tbody/" + 
      "tr[(td/@class='symbol') and not(@class='colHeader')]" + 
    "</item>" +
  "</list>" +
  
  "<list title='Sector summary' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
    "<item action='CALL:axsFinance.handleTableRowSectorSummary'>" +
       "id('secperf')/table/tbody/tr[not(@class='colHeader')]" +
    "</item>" +
  "</list>" +
  
  "<list title='Popular trends' next='DOWN j' prev='UP k' fwd='n' back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsNoVolume'>" +
       "id('tm_zeitgeist')/table/tbody/tr[(td[*]/@class='name') and " + 
                                           "not(@class='colHeader')]" +
    "</item>" +
    "<target title = 'Popular trends' trigger='listEntry'>" +
      "id('l_tm_zeitgeist')" +
    "</target>" +
  "</list>" +
    
  "<list title='Price trends gainers' next='DOWN j' prev='UP k' fwd='n' " + 
                                                              "back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsNoVolume'>" +
      "id('tm_price_0')/table/tbody/tr[(td[@class='change chg']) and" + 
      " not(@class='colHeader')]" +
    "</item>" +
    "<target title = 'Price trends gainers' trigger='listEntry'>" +
      "id('l_tm_price')" +
    "</target>" +
  "</list>" +

  "<list title='Price trends losers' next='DOWN j' prev='UP k' fwd='n' " + 
                                                               "back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsNoVolume'>" +
      "id('tm_price_0')/table/tbody/tr[(td[@class='change chr']) and " + 
      "not(@class='colHeader')]" +
    "</item>" +
    "<target title = 'Price trends losers' trigger='listEntry'>" +
      "id('l_tm_price')" +
    "</target>" +
  "</list>" +
    
  "<list title='Market capitalization trends gainers' next='DOWN j' " + 
                                      "prev='UP k' fwd='n' back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsNoVolume'>" +
     "id('tm_mcap_0')/table/tbody/tr[(td[@class='change chg']) and " + 
                                          "not(@class='colHeader')]" +
    "</item>" +
    "<target title = 'Market capitalization trends gainers' " + 
                                      " trigger='listEntry'>" +
      "id('l_tm_mcap')" +
    "</target>" +
  "</list>" +
  
  "<list title='Market capitalization trends losers' next='DOWN j' " + 
                                     "prev='UP k' fwd='n' back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsNoVolume'>" +
     "id('tm_mcap_0')/table/tbody/tr[(td[@class='change chr']) and " + 
                                          "not(@class='colHeader')]" +
    "</item>" +
    "<target title = 'Market capitalization trends losers' " + 
                                      "trigger='listEntry'>" +
      "id('l_tm_mcap')" +
    "</target>" +
  "</list>" +
  
  "<list title='Volume trends' next='DOWN j' prev='UP k' fwd='n' back='p'>" +  
    "<item action='CALL:axsFinance.handleTableRowTrendsVolume'>" +
      "id('tm_volume_0')/table/tbody/tr[(td/@class='name') and " + 
              "not(@class='colHeader')] | id('tm_volume_0')/div" +
    "</item>" +
    "<target title = 'Volume trends' trigger='listEntry'>" +
      "id('l_tm_volume')" +
    "</target>" +
  "</list>" +

  "</cnr>";

axsFinance.axsNavObj.navInit(cnrString, null);
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
};

axsFinance.handleMarketSummaryDescription = function(item) {  
  var element = item.elem;
  var textContent = element.textContent + '. ';
  //gather parent sibling text content
  var currentNode = element.parentNode.nextSibling;
  currentNode = currentNode.nextSibling.nextSibling.nextSibling;

  textContent = textContent + axsFinance.trim(currentNode.textContent) + '. ';
  currentNode = currentNode.nextSibling.nextSibling;
  textContent = textContent + currentNode.textContent;

  axsFinance.speakAndGo(element, textContent);
}

axsFinance.speakAndGo = function(element, text) {
  axsFinance.axsLensObj.view(element);
  axsFinance.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsFinance.axsJAXObj.markPosition(element);
};


axsFinance.handleTableRowIndicesAndCurrencies = function(item) {
  //handle special chracters and order columns
  var textContents = new Array();
  var columns = item.elem.childNodes;
  textContents[0] = columns[1].textContent;
  if (textContents[0].indexOf('S&P') != -1) {
    textContents[0] = axsFinance.STD_AND_POOR_STRING;
  }
  textContents[1] = axsFinance.parseSpecialChars(columns[2].textContent);
  textContents[2] = axsFinance.parseSpecialChars(columns[3].textContent);
  //due to inconsistency in http://finance.google.com/finance
  var textContent = columns[4].textContent;
  if (textContent.charAt(1) != '-') {
    textContent = '+' + textContent.substring(1);
  }
  textContents[3] = axsFinance.parseSpecialChars(textContent);
  //set string values
  var rowText = axsFinance.handleTableRow(textContents,
      axsFinance.IndAndCurDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
};

axsFinance.handleMktTopStAndPortfRelTopSt = function(item) {
  var element = item.elem;
  var textContent = element.textContent + '. ';
  var currentNode = element.parentNode.nextSibling.nextSibling;
  //add source, date and snippet for the left column  
  if ((currentNode !== null) &&
      (currentNode.className !== 'byline sfe-break-bottom')) {
    currentNode = currentNode.nextSibling.nextSibling;
    //get source
    textContent = textContent + currentNode.childNodes[1].textContent + '. ';
    //get date
    textContent = textContent + currentNode.childNodes[3].textContent + '. ';
    //get snippet
    currentNode = currentNode.nextSibling.nextSibling;
    var snippet = axsFinance.axsJAXObj.evalXPath(axsFinance.SNIPPET_XPATH_STRING,
                                                 currentNode);
    textContent = textContent + snippet[0].textContent;
  }
  axsFinance.speakAndGo(element, textContent);
};

axsFinance.handleVideoDescription = function(item) {
  var element = item.elem;
  var textContent = element.textContent + '. ';
  var nodeSibling = element.nextSibling;
  //gather sibling text content
  while (nodeSibling) {
    if (nodeSibling.className == 'byline') {
      textContent = textContent +
                    axsFinance.trim(nodeSibling.textContent) +
                    '. ';
    }
    nodeSibling = nodeSibling.nextSibling;
  }
  //gather parent sibling text content
  var parentSibling = element.parentNode.nextSibling;
  while (parentSibling) {
    if (parentSibling.id != 'video player') {
      textContent = textContent + parentSibling.textContent;
    }
    parentSibling = parentSibling.nextSibling;
  }

  axsFinance.speakAndGo(element, textContent);
};

axsFinance.handleTableRowRecentQuotes = function(item) {
  //handle special chracters and order columns
  var textContents = new Array();
  var columns = item.elem.childNodes;
  textContents[0] = axsFinance.parseSpecialChars(columns[1].textContent);
  textContents[1] = axsFinance.parseSpecialChars(columns[5].textContent);
  var textContent = columns[7].childNodes[1].textContent;
  textContents[2] = axsFinance.parseSpecialChars(textContent);
  //due to inconsistency in http://finance.google.com/finance
  var textContent = columns[7].childNodes[3].textContent;
  if (textContent.charAt(1) != '-') {
    textContent = '+' + textContent.substring(1);
  }
  textContents[3] = axsFinance.parseSpecialChars(textContent);
  textContents[4] = axsFinance.parseSpecialChars(columns[9].textContent);

  var rowText = axsFinance.handleTableRow(textContents,
      axsFinance.recQuotesDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
};


axsFinance.handleTableRowSectorSummary = function(item) {
  //handle special chracters and order columns
  var text = '';
  var textContents = new Array();
  var columns = item.elem.childNodes;
  //select table elements
  textContents[0] = columns[1].textContent;
  var index = textContents[0].indexOf('Cons.');
  if (index != -1) {
    textContents[0] = axsFinance.CONSUMERS_STRING +
                      textContents[0].substring(index + 5);
  }
  textContents[1] = axsFinance.parseSpecialChars(columns[3].textContent);
  
  //select down table
  var downTable = axsFinance.axsJAXObj.evalXPath(axsFinance.TABLE_XPATH_STRING,
                                                 columns[5]);
  //extract down numeric values
  text = downTable[0].title; 
  var downPercentage1 = Number(text.substring(0, text.indexOf(' ') - 1)); 
  var treshold = Number(text.substring(text.lastIndexOf(' '), text.length - 1));
  text = downTable[1].title;    
  var downPercentage2 = Number(text.substring(0, text.indexOf(' ') - 1));  
    
  //select up table
  var upTable = axsFinance.axsJAXObj.evalXPath(axsFinance.TABLE_XPATH_STRING,
                                               columns[7]);
  //extract up numeric values
  text = upTable[0].title;
  var upPercentage1 = Number(text.substring(0, text.indexOf(' ') - 1)); 
  text= upTable[1].title;    
  var upPercentage2 = Number(text.substring(0, text.indexOf(' ') - 1)); 
       
  //array with values to be substituted in the template                                     
  var numericValues = new Array();
  numericValues[0] = downPercentage1 + downPercentage2;
  numericValues[1] = downPercentage1;
  numericValues[2] = treshold;
  numericValues[3] = upPercentage1 + upPercentage2;
  numericValues[4] = upPercentage2;
  numericValues[5] = treshold;
  //template used due to specific represenation
  textContents[2] = axsFinance.populateTemplate(axsFinance.SECT_SUM_TMPL_STRING, 
                                                numericValues);
  
  var rowText = axsFinance.handleTableRow(textContents, null);
  axsFinance.speakAndGo(item.elem, rowText);
};

axsFinance.populateTemplate = function(template, values) {
  var sentence = new String(template);
  for (var i = 0, value; i < values.length; i++) {	
    sentence = sentence.replace('{' + i + '}', values[i]);
  }
  return sentence;
};

axsFinance.handleTableRowTrendsNoVolume = function(item) {
  //handle special chracters and order columns
  var textContents = axsFinance.getTableRowContentArray(item);  
  var rowText = axsFinance.handleTableRow(textContents,
                                          axsFinance.noVolDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
};

axsFinance.handleTableRowTrendsVolume = function(item) {
  //handle special chracters and order columns
  var textContents = axsFinance.getTableRowContentArray(item);
  var rowText = axsFinance.handleTableRow(textContents, 
                                          axsFinance.volDescArray);
  axsFinance.speakAndGo(item.elem, rowText);
};

axsFinance.getTableRowContentArray = function(item) {
  //handle special chracters and order columns
  var textContents = new Array();
  var columns = item.elem.childNodes;
  textContents[0] = columns[1].textContent;
  //due to inconsistency in http://finance.google.com/finance
  var textContent = columns[4].textContent;
  if (textContent.charAt(0) != '-') {
    textContent = '+' + textContent;
  }
  textContents[1] = axsFinance.parseSpecialChars(textContent);
  textContents[2] = axsFinance.parseSpecialChars(columns[5].textContent);
  return textContents;
};

axsFinance.handleTableRow = function(textContents, columnDesriptors) {
  //check inputs
  if (textContents === null) {
    return '';
  }
  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (columnDesriptors !== null && i < columnDesriptors.length) {
      rowText = rowText + columnDesriptors[i];
    }
    rowText = rowText + textContents[i];
  }
  if (columnDesriptors !== null && i < columnDesriptors.length) {
    rowText = rowText + columnDesriptors[i];
  }
  return rowText;
};

axsFinance.parseSpecialChars = function(text) {
  var parsedText = "";
  //check input
  if (text === null || text === "") {
    return text;
  }
  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];
    //remove brackets
    if (token.length > 0 && text.charAt(0) === '(') {
        token = token.substring(1);
    }
    if (token.length > 1 && token.charAt(token.length - 1) === ')') {
      token = token.substring(0, token.length - 1);
    }
    //parse the first character
    var prefixMapping = axsFinance.specialCharPrefixMap[token.charAt(0)];
    if (prefixMapping != undefined) {
      token = prefixMapping + ' ' + token.substring(1);
    }
    //parse the last character
    var lastCharacter = token.charAt(token.length - 1);
    var suffixMapping = axsFinance.specialCharSuffixMap[lastCharacter];
    if (suffixMapping != undefined) {
      token = token.substring(0, token.length - 1) + ' ' + suffixMapping;
    }
    parsedText = parsedText + ' ' + token;
  }
  return parsedText;
};

axsFinance.specialCharPrefixMap = {
  '-' : axsFinance.DOWN_STRING,
  '+' : axsFinance.UP_STRING
};

axsFinance.specialCharSuffixMap = {
  'B' : axsFinance.BILLION_STRING,
  'M' : axsFinance.MILLION_STRING,
  '%' : axsFinance.PERCENT_STRING
};

axsFinance.trim = function(text) {
  return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
  }
  if (evt.keyCode == 13) { // Enter
    if (evt.shiftKey){
      axsFinance.goToCurrentLinkInNewWindow();
    } else {
      axsFinance.goToCurrentLink();
    }
    return false;
  }

  if (axsFinance.axsJAXObj.inputFocused) return true;

  var command = axsFinance.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Opens the current URL
 */
axsFinance.goToCurrentLink = function() {
  var linkUrl = axsFinance.getCurrentLink();
  if (linkUrl !== '') {
    document.location = linkUrl;
  }
};

/**
 * Opens the current URL link in a new window
 */
axsFinance.goToCurrentLinkInNewWindow = function() {
  var linkUrl = axsFinance.getCurrentLink();
  if (linkUrl === ''){
     window.open(linkUrl);
  }
};

/**
 * Retrieves the current URL link
 * @return {string} The current URL hyperlink as a string
 */
axsFinance.getCurrentLink = function() {
  var currentItem = axsFinance.axsNavObj.currentItem();
  if (typeof(currentItem) == 'undefined') {
    return '';
  }
  var currentElem = currentItem.elem;
  if (currentElem.tagName == 'A') {
    return currentElem.href;
  } else {
      return currentElem.getElementsByTagName('a')[0].href;
  }
};

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
    }
};

axsFinance.init();
