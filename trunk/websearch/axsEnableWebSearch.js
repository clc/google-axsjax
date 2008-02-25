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



// create namespace
var axsWebSearch = {};


axsWebSearch.ACCESSIBLE_SEARCH_URL = 
    'http://www.google.com/cse?cx=000183394137052953072%3Azc1orsc6mbq&q=';

axsWebSearch.WEB_SEARCH_URL = 'http://www.google.com/search?q=';

//These are strings to be spoken to the user
axsWebSearch.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next category. ' +
    'Up arrow or P, go to the previous category. ' +
    'Right arrow or J, go to the next item. ' +
    'Left arrow or K, go to the previous item. ' +
    'Enter, open the current item. ' +
    'Shift and Enter, open the current item ' +
    'in a new window. ' +
    'Slash, jump to search blank. ' +
    'Escape, leave search blank. ' +
    '1, read the one box. ' +
    'F, go forward through the results. ' +
    'A, cycle through advertisements. ' +
    'C, cycle through alternate categories to search in. ' +
    'S, cycle through related searches. ' +
    'Page up, go to the previous page. ' +
    'Page down, go to the next page. ';

axsWebSearch.PAGECONTENT_RELATED_SEARCH_STRING = 'Searches related to:';

axsWebSearch.ON_ACCESSIBLE_SEARCH =
    'You are already on Google accessible search.';
axsWebSearch.ON_WEB_SEARCH = 'You are already on Google web search.';
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

axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX(true);
  axsWebSearch.axsNavObj = new AxsNav(axsWebSearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler,
                             true);

  //Do any necessary preparations for browsing here
  axsWebSearch.formatAdAreaSide();

  var cnlString = "<cnl next='DOWN n' prev='UP p'>" +
      "<list title='One Box' hotkey='1' next='RIGHT j' prev='LEFT k' " +
      "onEmpty='There is no one box on this page.'>" +
      "<item count='1'>" +
      "id('res')/p[*]" +
      "</item>" +
      "<item count='1'>" +
      "id('res')/div[@class='e']" +
      "</item> " +
      "</list>" +
      "<list title='Results' hotkey='f' next='RIGHT j' prev='LEFT k' fwd='f' back='b'>" +
      "<item count='1'>" +
      "id('res')//td[@class='j']/ul/li[text()='Make sure all words are spelled correctly.']/parent::*/parent::*" +
      "</item>" +
      "<item>" +
      "id('res')/div[*]/div[@class='g']" +
      "</item>" +
      "<target title='Next page' trigger='listTail'>" +
      "id('nn')/parent::*" +
      "</target>" +
      "<target title='Prev page' trigger='listHead'>" +
      "id('np')/parent::*" +
      "</target>" +
      "</list>" +
      "<list title='Sponsored Links' hotkey='a' next='RIGHT j' prev='LEFT k' " +
      "onEmpty='There are no sponsored links on this page.'>" +
      "<item>" +
      "id('tads')/div[*]" +
      "</item>" +
      "<item>" +
      "id('mbEnd')/tbody/tr[*]/td/font/span[*]" +
      "</item>" +
      "</list>" +
      "<list title='Related Searches' hotkey='s' next='RIGHT j' " +
      "prev='LEFT k' onEmpty='There are no related searches.'>" +
      "<item>" +
      "id('res')/table[*]/tbody/tr[*]/td[*]/a" +
      "</item>" +
      "</list>" +
      "<list title='Alternate Search Categories' hotkey='c' next='RIGHT j' " +
      "prev='LEFT k' onEmpty='There are no other categories to search within.'>" +
      "<item>" +
      "body/table[*]/tbody/tr/td[*]/font/a[@class='q']" +
      "</item>" +
      "</list>" +
      "<target title='Next page' hotkey='PGDOWN'>" +
      "id('nn')/parent::*" +
      "</target>" +
      "<target title='Previous page' hotkey='PGUP'>" +
      "id('np')/parent::*" +
      "</target>" +
      "</cnl>";



  axsWebSearch.axsNavObj.navInit(cnlString, null);



  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsWebSearch.readTheFirstThing,100);
};

/**
 * Reads the first thing on the page.
 */
axsWebSearch.readTheFirstThing = function(evt){
  var firstElem = axsWebSearch.axsNavObj.nextItem().elem;
  axsWebSearch.axsJAXObj.goTo(firstElem);
};

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

  if (evt.charCode == 65){ // A
    axsWebSearch.switchToAccessibleSearch();
    return false;
  }
  if (evt.charCode == 87){ // W
    axsWebSearch.switchToWebSearch();
    return false;
  }
  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }
  if (evt.keyCode == 13){ // Enter
    if (evt.shiftKey){
      axsWebSearch.goToCurrentLinkInNewWindow();
    } else{
      axsWebSearch.goToCurrentLink();
    }
    return false;
  }

  if (evt.charCode == 63){ // ? (question mark)
    axsWebSearch.axsJAXObj.speakTextViaNode(axsWebSearch.HELP_STRING);
    return false;
  }
  return true;
};

//************
//Functions for handling links
//************

axsWebSearch.goToCurrentLink = function(){
  var linkUrl = axsWebSearch.getCurrentLink();
  if (linkUrl === ''){
    return;
  }
  document.location = linkUrl;
};

axsWebSearch.goToCurrentLinkInNewWindow = function(){
  var linkUrl = axsWebSearch.getCurrentLink();
  if (linkUrl === ''){
    return;
  }
  window.open(linkUrl);
};

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

//The Ads area on the right side is inside one big FONT tag.
//There is no structure that groups the individual ads.
//Add this structure to make it possible to speak these ads individually.
axsWebSearch.formatAdAreaSide = function(){
  var adTable = window.content.document.getElementById('mbEnd');
  if(!adTable){
    return;
  }
  var adArea = null; //This is the FONT tag that contains all the ads
                     //However, it is non-trivial to locate as the TR
                     //that it is under is not always the same TR.
                     //There are also very few identifiers here to key off of.
  //This is an ugly way to find the adArea, but it works reliably.
  var spanArray = adTable.getElementsByTagName('SPAN');
  for (var i=0, currentSpan; currentSpan = spanArray[i]; i++){
    if (currentSpan.className == 'a'){
      adArea = currentSpan.parentNode;
      break;
    }
  }
  if (!adArea){
    return;
  }

  var currentAdAnchor = adArea.firstChild;
  var adSpan = window.content.document.createElement('span');

  while (currentAdAnchor){
    var nextAnchor = currentAdAnchor.nextSibling;
    if (currentAdAnchor.tagName &&  currentAdAnchor.tagName == 'FONT'){
      var newAdSpan = window.content.document.createElement('span');
      newAdSpan.appendChild(currentAdAnchor.cloneNode(true));
      adArea.replaceChild(adSpan,currentAdAnchor);
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

axsWebSearch.getCurrentURLQueryString = function(){
  var URL = document.baseURI;
  var searchQueryStart = URL.indexOf('q=') + 2;
  var searchQueryEnd = URL.indexOf('&',searchQueryStart);
  if (searchQueryEnd == -1){
    searchQueryEnd = URL.length; 
  }
  return URL.substring(searchQueryStart, searchQueryEnd);
};



axsWebSearch.switchToAccessibleSearch = function(){
  if ( (document.baseURI.indexOf('http://www.google.com/custom') === 0) ||
       (document.baseURI.indexOf('http://www.google.com/cse') === 0) ){
    axsWebSearch.axsJAXObj.speakTextViaNode(axsWebSearch.ON_ACCESSIBLE_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.ACCESSIBLE_SEARCH_URL + searchQuery;
};

axsWebSearch.switchToWebSearch = function(){
  if (document.baseURI.indexOf('http://www.google.com/search') === 0){
    axsWebSearch.axsJAXObj.speakTextViaNode(axsWebSearch.ON_WEB_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.WEB_SEARCH_URL + searchQuery;
};

axsWebSearch.init();
