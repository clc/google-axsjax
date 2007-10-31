// Copyright 2007 Google Inc.
// All Rights Reserved.

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

//These are strings to be spoken to the user
axsWebSearch.NO_ONE_BOX_STRING = 'There is no one box on this page.';
axsWebSearch.NO_ADS_STRING = 'There are no advertisements on this page.';
axsWebSearch.NO_NEXT_PAGE_STRING = 'There is no next page.';
axsWebSearch.NO_PREV_PAGE_STRING = 'There is no previous page.';
axsWebSearch.SEARCH_WITHIN_STRING = 'Search within ';
axsWebSearch.NO_ALT_SEARCH_CAT_STRING = 'There are no other categories to ' +
                                        'search within.'
axsWebSearch.NO_RELATED_SEARCHES_STRING = 'There are no related searches.'
axsWebSearch.HELP_STRING = 'The following shortcut keys are available. ' +
                        'G, use guided mode. ' +   
                        'Down arrow or N, go to the next result. ' +
                        'Up arrow or P, go to the previous result. ' +
                        'Right arrow or J, cycle to the next result. ' +
                        'Left arrow or K, cycle to the previous result. ' +
                        'Enter, open the current item. ' +
                        'Shift and Enter, open the current item ' +
                        'in a new window. ' +
                        'Slash, jump to search blank. ' +
                        'Escape, leave search blank. ' +
                        '1, read the one box. ' +
                        'A, cycle through advertisements. ' +
                        'C, cycle through alternate categories to search in. ' +
                        'R, cycle through related searches. ' +
                        'Page up, go to the previous page. ' +
                        'Page down, go to the next page. ';
axsWebSearch.GUIDE_MODE_END = 'You have reached the end of this page. ' +
                              'Press the page down key to go to the next page. ' +
                              'Or press G again to go back to the start of this page.';
axsWebSearch.PAGECONTENT_RELATED_SEARCH_STRING = 'Searches related to:';

axsWebSearch.ON_ACCESSIBLE_SEARCH = 'You are already on Google accessible search.'
axsWebSearch.ON_WEB_SEARCH = 'You are already on Google web search.'
axsWebSearch.SPONSORED_LINK = 'Sponsored link. '



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsWebSearch.axsJAXObj = null;

axsWebSearch.resultsArray = null;
axsWebSearch.resultsIndex = 0;

axsWebSearch.adAreaSideId = null;
axsWebSearch.adsArray = null;
axsWebSearch.adsIndex = 0;

axsWebSearch.inputFocused = false;
axsWebSearch.lastFocusedNode = null;

axsWebSearch.currentLink = null;

axsWebSearch.altSearchCatArray = null;
axsWebSearch.altSearchCatIndex = 0;


axsWebSearch.relatedSearchesArray = null;
axsWebSearch.relatedSearchesIndex = 0;

axsWebSearch.guideModeArray = null;
axsWebSearch.guideModeIndex = 0;


axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX();

  //Add event listeners
  document.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsWebSearch.focusHandler, true);
  document.addEventListener('blur', axsWebSearch.blurHandler, true);

  //Do any necessary preparations for browsing here
  axsWebSearch.buildResultsArray();
  axsWebSearch.buildAdsArray();
  axsWebSearch.buildAltSearchCatArray();
  axsWebSearch.buildRelatedSearchesArray();
  axsWebSearch.buildGuideModeArray();

};

/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsWebSearch.focusHandler = function(evt){
  axsWebSearch.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWebSearch.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsWebSearch.blurHandler = function (evt){
  axsWebSearch.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWebSearch.inputFocused = false;
  }
};


axsWebSearch.extraKeyboardNavHandler = function(evt){
  if (evt.keyCode == 27){ // ESC
    axsWebSearch.lastFocusedNode.blur();
  }
  if (axsWebSearch.inputFocused){
    return;
  }
  if (evt.charCode == 49){ // 1
    axsWebSearch.readOneBox();
  }
  if (evt.charCode == 97){ // a
    axsWebSearch.cycleThroughAds();
  }
  if (evt.charCode == 65){ // A
    axsWebSearch.switchToAccessibleSearch();
  }
  if (evt.charCode == 99){ // c
    axsWebSearch.cycleThroughAltSearchCat();
  }
  if (evt.charCode == 103){ // g
    axsWebSearch.cycleThroughGuideMode();
  }
  if (evt.charCode == 106){ // j
    axsWebSearch.goToNextResult(true);
  }
  if (evt.charCode == 107){ // k
    axsWebSearch.goToPrevResult(true);
  }
  if (evt.charCode == 110){ // n
    axsWebSearch.goToNextResult(false);
  }
  if (evt.charCode == 112){ // p
    axsWebSearch.goToPrevResult(false);
  }
  if (evt.charCode == 114){ // r
    axsWebSearch.cycleThroughRelatedSearches();
  }
  if (evt.charCode == 87){ // W
    axsWebSearch.switchToWebSearch();
  }
  if (evt.charCode == 47){ // / (slash symbol)
    document.getElementsByName('q')[0].focus();  //Focus on the top search blank
    document.getElementsByName('q')[0].select(); //and select all text
  }
  if ((evt.keyCode == 13) && axsWebSearch.currentLink){ // Enter
    if (evt.shiftKey){
      axsWebSearch.goToCurrentLinkInNewWindow();
    } else{
      axsWebSearch.goToCurrentLink();
    }
  }
  if (evt.keyCode == 33){ // Page Up
    axsWebSearch.goToPrevPage();
  }
  if (evt.keyCode == 34){ // Page Down
    axsWebSearch.goToNextPage();
  }
  if (evt.keyCode == 38){ // Up arrow
    axsWebSearch.goToPrevResult(false);
  }
  if (evt.keyCode == 37){ // Left arrow
    axsWebSearch.goToPrevResult(true);
  }
  if (evt.keyCode == 40){ // Down arrow
    axsWebSearch.goToNextResult(false);
  }
  if (evt.keyCode == 39){ // Right arrow
    axsWebSearch.goToNextResult(true);
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.HELP_STRING);
  }

};



//************
//Functions for OneBox
//************

axsWebSearch.getOneBoxNode = function(){
  var resDiv = document.getElementById('res');
  for (var child = resDiv.firstChild; child; child = child.nextSibling){
    if ((child.tagName == 'P') && child.textContent){
      return child
    }
  }
  return null;
}

axsWebSearch.readOneBox = function(){
  var oneBox = axsWebSearch.getOneBoxNode();
  if (oneBox){
    oneBox.scrollIntoView(true);
    axsWebSearch.axsJAXObj.speakNode(oneBox);
  } else{
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ONE_BOX_STRING);
  }
  axsWebSearch.currentLink = oneBox.getElementsByTagName('a')[0].href;
};



//************
//Functions for Ads
//************



axsWebSearch.buildAdsArray = function(){
  axsWebSearch.formatAdAreaSide();
  axsWebSearch.adsArray = new Array();
  var adAreaTop = document.getElementById('tads');
  if (adAreaTop){
    for (var child = adAreaTop.firstChild; child; child = child.nextSibling){
      if(child.tagName == 'DIV'){
        axsWebSearch.adsArray.push(child);
      }
    }
  }
  var adAreaSide = document.getElementById(axsWebSearch.adAreaSideId);
  if(adAreaSide){
     for (var child = adAreaSide.firstChild; child; child = child.nextSibling){
       axsWebSearch.adsArray.push(child);
     }
  }
  axsWebSearch.adsIndex = -1;
};

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


axsWebSearch.cycleThroughAds = function(){
  if (axsWebSearch.adsArray.length < 1){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ADS_STRING);
    return;
  }
  axsWebSearch.adsIndex++;
  if (axsWebSearch.adsIndex >= axsWebSearch.adsArray.length){
    axsWebSearch.adsIndex = 0;
  }  
  var currentAd = axsWebSearch.adsArray[axsWebSearch.adsIndex];
  currentAd.scrollIntoView(true);
  axsWebSearch.currentLink = currentAd.getElementsByTagName('a')[0].href;
  axsWebSearch.axsJAXObj.speakNode(currentAd);
};



//************
//Functions for results
//************

axsWebSearch.buildResultsArray = function(){
  axsWebSearch.resultsArray = new Array();
  axsWebSearch.resultsIndex = -1;
  var resDiv = document.getElementById('res');
  var divsArray = resDiv.getElementsByTagName('DIV');
  for (var i=0, currentDiv; currentDiv = divsArray[i]; i++){
    if (currentDiv.className == 'g'){
      axsWebSearch.resultsArray.push(currentDiv);
    }
  }
  //There were no results
  if (axsWebSearch.resultsArray.length == 0){
    var noResultsTD = resDiv.getElementsByTagName('TD')[0];
    if (noResultsTD && (noResultsTD.className == 'j')){
      axsWebSearch.resultsArray.push(noResultsTD);
      noResultsTD.tabIndex = -1;
      noResultsTD.focus();
    }
  }

};

axsWebSearch.goToNextResult = function(cycleBool){
  axsWebSearch.resultsIndex++;
  if(axsWebSearch.resultsIndex >= axsWebSearch.resultsArray.length){
    if (!cycleBool){
      axsWebSearch.resultsIndex = -1;
      axsWebSearch.goToNextPage();
      return;
    } else{
      axsWebSearch.resultsIndex = 0;
    }
  }
  var currentResult = axsWebSearch.resultsArray[axsWebSearch.resultsIndex];
  currentResult.scrollIntoView(true);
  axsWebSearch.axsJAXObj.speakNode(currentResult);
  axsWebSearch.currentLink = currentResult.getElementsByTagName('a')[0].href;
};

axsWebSearch.goToPrevResult = function(cycleBool){
  axsWebSearch.resultsIndex--;
  if(axsWebSearch.resultsIndex < 0){
    if (!cycleBool){
      axsWebSearch.resultsIndex = -1;
      axsWebSearch.goToNextPage();
      return;
    } else{
      axsWebSearch.resultsIndex = axsWebSearch.resultsArray.length-1;
    }
  }
  var currentResult = axsWebSearch.resultsArray[axsWebSearch.resultsIndex];
  currentResult.scrollIntoView(true);
  axsWebSearch.axsJAXObj.speakNode(currentResult);
  axsWebSearch.currentLink = currentResult.getElementsByTagName('a')[0].href;
};


axsWebSearch.goToNextPage = function(){
  var nextPageDiv = document.getElementById('nn');
  if (!nextPageDiv){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_NEXT_PAGE_STRING);
    return;
  }
  document.location = nextPageDiv.parentNode.href;
};

axsWebSearch.goToPrevPage = function(){
  var prevPageDiv = document.getElementById('np');
  if (!prevPageDiv){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_PREV_PAGE_STRING);
    return;
  }
  document.location = prevPageDiv.parentNode.href;
};

axsWebSearch.goToCurrentLink = function(){
  document.location = axsWebSearch.currentLink;
};

axsWebSearch.goToCurrentLinkInNewWindow = function(){
  window.open(axsWebSearch.currentLink);
};


//************
//Functions for alternative search categories
//************

axsWebSearch.buildAltSearchCatArray = function(){
  axsWebSearch.altSearchCatArray = new Array();
  axsWebSearch.altSearchCatIndex = -1;
  var altSearchCatArea = document.getElementById('sd').nextSibling;
  if (altSearchCatArea){
    for (var child = altSearchCatArea.firstChild; child;
            child = child.nextSibling){
      if (child.tagName=='A'){
        axsWebSearch.altSearchCatArray.push(child);
      }
    }
  }
};


axsWebSearch.cycleThroughAltSearchCat = function(){
  if (axsWebSearch.altSearchCatArray.length < 1){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ALT_SEARCH_CAT_STRING);
    return;
  }
  axsWebSearch.altSearchCatIndex++;
  if (axsWebSearch.altSearchCatIndex >= axsWebSearch.altSearchCatArray.length){
    axsWebSearch.altSearchCatIndex = 0;
  }
  var currentAltSearch =
      axsWebSearch.altSearchCatArray[axsWebSearch.altSearchCatIndex];
  currentAltSearch.scrollIntoView(true);
  axsWebSearch.currentLink = currentAltSearch.href;
  axsWebSearch.axsJAXObj.speakText(axsWebSearch.SEARCH_WITHIN_STRING +
                                   currentAltSearch.textContent);
};


//************
//Functions for related searches
//************

axsWebSearch.buildRelatedSearchesArray = function(){
  axsWebSearch.relatedSearchesArray = new Array();
  axsWebSearch.relatedSearchesIndex = -1;
  var relatedSearchesH2 = null;
  var resDiv = document.getElementById('res');
  for (var child = resDiv.firstChild; child; child = child.nextSibling){
    if ( (child.tagName =='H2') &&
         (child.className =='r') &&
         (child.firstChild.textContent ==
             axsWebSearch.PAGECONTENT_RELATED_SEARCH_STRING)){
      relatedSearchesH2 = child;
    }
  }
  if (relatedSearchesH2){
    axsWebSearch.relatedSearchesArray =
        relatedSearchesH2.nextSibling.getElementsByTagName('A');
  }
};


axsWebSearch.cycleThroughRelatedSearches = function(){
  if (axsWebSearch.relatedSearchesArray.length < 1){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_RELATED_SEARCHES_STRING);
    return;
  }
  axsWebSearch.relatedSearchesIndex++;
  if (axsWebSearch.relatedSearchesIndex >=
          axsWebSearch.relatedSearchesArray.length){
    axsWebSearch.relatedSearchesIndex = 0;
  }
  var currentRelSearch =
      axsWebSearch.relatedSearchesArray[axsWebSearch.relatedSearchesIndex];
  currentRelSearch.scrollIntoView(true);
  axsWebSearch.currentLink = currentRelSearch.href;
  axsWebSearch.axsJAXObj.speakNode(currentRelSearch);
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
}



axsWebSearch.switchToAccessibleSearch = function(){
  if (document.baseURI.indexOf('http://www.google.com/custom') == 0){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.ON_ACCESSIBLE_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.ACCESSIBLE_SEARCH_URL + searchQuery;
}




axsWebSearch.switchToWebSearch = function(){
  if (document.baseURI.indexOf('http://www.google.com/search') == 0){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.ON_WEB_SEARCH);
    return;
  }
  var searchQuery = axsWebSearch.getCurrentURLQueryString();
  document.location = axsWebSearch.WEB_SEARCH_URL + searchQuery;
}



//************
//Functions for guided mode experiment
//************

axsWebSearch.buildGuideModeArray = function(){
  axsWebSearch.guideModeArray = new Array();
  var oneBox = axsWebSearch.getOneBoxNode();
  if (oneBox){
    axsWebSearch.guideModeArray.push(oneBox);
  }
  var rInd = 0;
  var aInd = 0;
  var resultsAdded = 0;

  //Add search results interspersed with ads
  var result = new Object();
  result.node = axsWebSearch.resultsArray[rInd++];
  result.isAd = false;
  while (result.node){
    axsWebSearch.guideModeArray.push(result);
    if ((resultsAdded >= 3) && (axsWebSearch.adsArray[aInd])){
      resultsAdded = 0;
      result = new Object();
      result.node = axsWebSearch.adsArray[aInd++];
      result.isAd = true;
    } else {
      resultsAdded++;
      result = new Object();
      result.node = axsWebSearch.resultsArray[rInd++];
      result.isAd = false;
    }
  }

  //Add an ad here if there are still ads not added
  result = new Object();
  result.node = axsWebSearch.adsArray[aInd++];
  result.isAd = true;
  if (result.node){
    axsWebSearch.guideModeArray.push(result);
  }

  //Add related searches interspersed with ads
  rInd = 0;
  resultsAdded = 0;
  result = new Object();
  result.node = axsWebSearch.relatedSearchesArray[rInd++];
  result.isAd = false;
  while (result.node){
    axsWebSearch.guideModeArray.push(result);
    if ((resultsAdded >= 3) && (axsWebSearch.adsArray[aInd])){
      resultsAdded = 0;
      result = new Object();
      result.node = axsWebSearch.adsArray[aInd++];
      result.isAd = true;
    } else {
      resultsAdded++;
      result = new Object();
      result.node = axsWebSearch.relatedSearchesArray[rInd++];
      result.isAd = false;
    }
  }

  //Add any remaining ads
  result = new Object();
  result.node = axsWebSearch.adsArray[aInd++];
  result.isAd = true;
  while (result.node){
    axsWebSearch.guideModeArray.push(result);
    result = new Object();
    result.node = axsWebSearch.adsArray[aInd++];
    result.isAd = true;
  }
  axsWebSearch.guideModeIndex = -1;
};


axsWebSearch.cycleThroughGuideMode = function(){
  axsWebSearch.guideModeIndex++;
  if (axsWebSearch.guideModeIndex >= axsWebSearch.guideModeArray.length){
    axsWebSearch.guideModeIndex = -1;
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.GUIDE_MODE_END);
    return;
  }
  var currentGuideObj = axsWebSearch.guideModeArray[axsWebSearch.guideModeIndex];
  var currentItem = currentGuideObj.node;
  currentItem.scrollIntoView(true);
  if (currentGuideObj.isAd){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.SPONSORED_LINK + currentItem.textContent);
  }
  else {
    axsWebSearch.axsJAXObj.speakNode(currentItem);
  }
  if (currentItem.tagName == 'A'){
    axsWebSearch.currentLink = currentItem.href;
  } else {
    axsWebSearch.currentLink = currentItem.getElementsByTagName('a')[0].href;
  }
};



axsWebSearch.init();