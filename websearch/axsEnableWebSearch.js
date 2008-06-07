// Copyright 2007 Google Inc.
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
 * @fileoverview Greasemonkey JavaScript to enhance accessibility
 * of Google Web Search. 
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// Create namespace
var axsWebSearch = {};

// Strings for the URLs
/**
 * @type {string}
 */
axsWebSearch.ACCESSIBLE_SEARCH_URL =
    'http://www.google.com/cse?cx=000183394137052953072%3Azc1orsc6mbq&q=';
/**
 * @type {string}
 */
axsWebSearch.WEB_SEARCH_URL = 'http://www.google.com/search?q=';

//These are strings to be spoken to the user
/**
 * @type {string}
 */
axsWebSearch.HELP_STRING_PRE = 'The following shortcut keys are available. ';
/**
 * @type {string}
 */
axsWebSearch.HELP_STRING_POST = 'Slash, enter search field. ' +
                                'Escape, leave search field. ' +
                                'Equals, enlarge the current item. ' +
                                'Minus, shrink the current item. ';
/**
 * @type {string}
 */
axsWebSearch.PAGECONTENT_RELATED_SEARCH_STRING = 'Searches related to:';
/**
 * @type {string}
 */
axsWebSearch.ON_ACCESSIBLE_SEARCH =
    'You are already on Google accessible search.';
/**
 * @type {string}
 */
axsWebSearch.ON_WEB_SEARCH = 'You are already on Google web search.';
/**
 * @type {string}
 */
axsWebSearch.SPONSORED_LINK = 'Sponsored link. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsWebSearch.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsWebSearch.axsNavObj = null;


/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsWebSearch.axsLensObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type number
 */
axsWebSearch.magSize = 1.5;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsWebSearch.axsSoundObj = null;



/**
 * Initializes the web search script by starting up the AxsNav object
 * and attaching keyboard handlers. 
 */
axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX(true);
  axsWebSearch.axsNavObj = new AxsNav(axsWebSearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler,
                             true);

  //Do any necessary preparations for browsing here
  axsWebSearch.formatAdAreaSide();

  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +
      "<list title='One Box' hotkey='1' next='DOWN j' prev='UP k' " +
      "onEmpty='There is no one box on this page.'>" +
      "<item count='1'>" +
      "id('res')/p[*]" +
      "</item>" +
      "<item count='1'>" +
      "id('res')/div[@class='e']" +
      "</item>" +
      "</list>" +
      "<list title='Results' hotkey='n' next='DOWN j' prev='UP k' " +
      "fwd='n' back='p'>" +
      "<item count='1'>" +
      "id('res')//td[@class='j']/ul/li[text()='Make sure all words are " +
      "spelled correctly.']/../.." +
      "</item>" +
      "<item>" +
      "id('res')//div[@class='g']" +
      "</item>" +
      "<target title='Next page' trigger='listTail'>" +
      "id('nn')/.." +
      "</target>" +
      "<target title='Prev page' trigger='listHead'>" +
      "id('np')/.." +
      "</target>" +
      "</list>" +
      "<list title='Sponsored Links' hotkey='a' next='DOWN j' prev='UP k' " +
      "onEmpty='There are no sponsored links on this page.'>" +
      "<item>" +
      "id('tads')/div" +
      "</item>" +
      "<item>" +
      "id('mbEnd')/tbody/tr[*]/td/span" +
      "</item>" +
      "</list>" +
      "<list title='Related Searches' hotkey='s' next='DOWN j' prev='UP k' " +
      "onEmpty='There are no related searches.'>" +
      "<item>" +
      "id('res')/table[*]/tbody/tr[*]/td[*]/a" +
      "</item>" +
      "<item>" +
      "body/table[*]/tbody/tr[*]/td[*]/a/b/.." +
      "</item>" +
      "</list>" +
      "<list title='Alternate Search Categories' hotkey='c' next='DOWN j' " +
      "prev='UP k' " +
      "onEmpty='There are no other categories to search within.'>" +
      "<item>" +
      "body/table[*]/tbody/tr/td[*]/font/a[@class='q']" +
      "</item>" +
      "</list>" +
      "<target title='Next page' hotkey='PGDOWN'>" +
      "id('nn')/.." +
      "</target>" +
      "<target title='Previous page' hotkey='PGUP'>" +
      "id('np')/.." +
      "</target>" +
      "</cnr>";

  axsWebSearch.axsNavObj.navInit(cnrString, null);
  axsWebSearch.HELP_STRING_POST = axsWebSearch.axsNavObj.globalHelpString() +
                                  axsWebSearch.HELP_STRING_POST;

  axsWebSearch.axsLensObj = new AxsLens(axsWebSearch.axsJAXObj);
  axsWebSearch.axsNavObj.setLens(axsWebSearch.axsLensObj);
  axsWebSearch.axsLensObj.setMagnification(axsWebSearch.magSize);
  
  axsWebSearch.axsSoundObj = new AxsSound();
  axsWebSearch.axsSoundObj.setVerbosity('none');
  axsWebSearch.axsSoundObj.init();
  axsWebSearch.axsNavObj.setSound(axsWebSearch.axsSoundObj);

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsWebSearch.readTheFirstThing, 100);
};

/**
 * Reads the first thing on the page.
 */
axsWebSearch.readTheFirstThing = function(){
  var firstElem = axsWebSearch.axsNavObj.nextItem().elem;
  axsWebSearch.axsLensObj.view(firstElem);
  axsWebSearch.axsJAXObj.goTo(firstElem);
};


//************
//Functions for handling links
//************

/**
 * Opens the current URL
 */
axsWebSearch.goToCurrentLink = function(){
  var linkUrl = axsWebSearch.getCurrentLink();
  if (linkUrl === ''){
    return;
  }
  document.location = linkUrl;
};

/**
 * Opens the current URL link in a new window
 */
axsWebSearch.goToCurrentLinkInNewWindow = function(){
  var linkUrl = axsWebSearch.getCurrentLink();
  if (linkUrl === ''){
    return;
  }
  window.open(linkUrl);
};

/**
 * Retrieves the current URL link
 * @return {string} The current URL hyperlink as a string
 */
axsWebSearch.getCurrentLink = function(){
  var currentItem = axsWebSearch.axsNavObj.currentItem();
  if (typeof(currentItem) == 'undefined'){
    return '';
  }
  var currentElem = currentItem.elem;
  if (currentElem.tagName == 'A'){
    return currentElem.href;
  } else {
    return currentElem.getElementsByTagName('a')[0].href;
  }
};


//************
//Functions for Ads
//************

/**
 * Formats the sponsored links section on the right of the search results.
 * The Ads area on the right side is inside one big FONT tag.
 * There is no structure that groups the individual ads.
 * Add this structure to make it possible to speak these ads individually.
 */
axsWebSearch.formatAdAreaSide = function(){
  var adTable = window.content.document.getElementById('mbEnd');
  if (!adTable){
    return;
  }
  //This is the FONT tag that contains all the ads
  var xpath = ".//span[@class='a']/..";
  var adArea = axsWebSearch.axsJAXObj.evalXPath(xpath, adTable)[0];

  if (!adArea){
    return;
  }

  var currentAdAnchor = adArea.firstChild;
  var adSpan = window.content.document.createElement('span');

  while (currentAdAnchor){
    var nextAnchor = currentAdAnchor.nextSibling;
    if (currentAdAnchor.tagName && currentAdAnchor.tagName == 'FONT'){
      var newAdSpan = window.content.document.createElement('span');
      newAdSpan.appendChild(currentAdAnchor.cloneNode(true));
      adArea.replaceChild(adSpan, currentAdAnchor);
      adSpan = newAdSpan;
    } else {
      adSpan.appendChild(currentAdAnchor.cloneNode(true));
      adArea.removeChild(currentAdAnchor);
    }
    currentAdAnchor = nextAnchor;
  }
  adArea.appendChild(adSpan);
  //Clean up by deleting the first child which is a blank node
  adArea.removeChild(adArea.firstChild);
  axsWebSearch.adAreaSideId = axsWebSearch.axsJAXObj.assignId(adArea);
};


//************
//Functions switching to accessible search experiment
//************

/**
 * Retrieves the query from the current URL
 * @return {string} The query part of the current URL string
 */
axsWebSearch.getCurrentURLQueryString = function(){
  var URL = document.baseURI;
  var searchQueryStart = URL.indexOf('q=') + 2;
  var searchQueryEnd = URL.indexOf('&', searchQueryStart);
  if (searchQueryEnd == -1){
    searchQueryEnd = URL.length;
  }
  return URL.substring(searchQueryStart, searchQueryEnd);
};

/**
 * Switches to accessible web search
 */
axsWebSearch.switchToAccessibleSearch = function(){
  if ((document.baseURI.indexOf('http://www.google.com/custom') === 0) ||
      (document.baseURI.indexOf('http://www.google.com/cse') === 0)){
    axsWebSearch.axsJAXObj.speakTextViaNode(axsWebSearch.ON_ACCESSIBLE_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.ACCESSIBLE_SEARCH_URL + searchQuery;
};

/**
 * Switches to regular web search
 */
axsWebSearch.switchToWebSearch = function(){
  if (document.baseURI.indexOf('http://www.google.com/search') === 0){
    axsWebSearch.axsJAXObj.speakTextViaNode(axsWebSearch.ON_WEB_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.WEB_SEARCH_URL + searchQuery;
};


//************
//Functions for highlighting results
//************

/**
 * Increases the magnification by 10%
 */
axsWebSearch.increaseMagnification = function(){
  axsWebSearch.magSize += 0.10;
  axsWebSearch.axsLensObj.setMagnification(axsWebSearch.magSize);
};

/**
 * Decreases the magnification by 10%
 */
axsWebSearch.decreaseMagnification = function(){
  axsWebSearch.magSize -= 0.10;
  axsWebSearch.axsLensObj.setMagnification(axsWebSearch.magSize);
};

//************
//Functions for keyboard handling
//************

/**
 * Provides keyboard handling
 * @param {Object} evt A keypress event
 * @return {boolean} Indicates whether the keypress was handled
 */
axsWebSearch.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsWebSearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }
  if (axsWebSearch.axsJAXObj.inputFocused){
    return true;
  }
  if (evt.keyCode == 13){ // Enter
    if (evt.shiftKey){
      axsWebSearch.goToCurrentLinkInNewWindow();
    } else{
      axsWebSearch.goToCurrentLink();
    }
    return false;
  }
  
  var command =  axsWebSearch.charCodeMap[evt.charCode];

  if (command)  return  command();

  return true;
};

axsWebSearch.charCodeMap = {
  // ? (question mark)
  63 : function () {
         var helpStr = axsWebSearch.HELP_STRING_PRE +
                       axsWebSearch.axsNavObj.localHelpString() +
                       axsWebSearch.HELP_STRING_POST;
                       axsWebSearch.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }, 
  // - (minus symbol)
  45 : function () {
         axsWebSearch.decreaseMagnification();
	     return false;
       }, 
  // = (equal symbol) 	   
  61 : function () {
         axsWebSearch.increaseMagnification();
	     return false;
       }, 
  // / (slash symbol)	   
  47 : function () {
         document.getElementsByName('q')[0].focus();
         document.getElementsByName('q')[0].select();
	     return false;
       }, 
  // A	   
  65 : function () {
         axsWebSearch.switchToAccessibleSearch();
	     return false;
       },
  // W	   
  87 : function () {
         axsWebSearch.switchToWebSearch();
	     return false;
       }
};


axsWebSearch.init();
