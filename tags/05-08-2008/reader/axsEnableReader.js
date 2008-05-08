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
 * of Google Reader. 
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */




// create namespace
var axsReader = {};

/** Messages to be spoken to the user */
axsReader.ARTICLES_LOADED_STRING = 'Articles loaded.';
axsReader.BUNDLES_LOADED_STRING = 'Bundles loaded.';
axsReader.RECOMMENDATIONS_LOADED_STRING = 'Recommendations loaded.';
axsReader.RESULTS_LOADED_STRING = 'Results loaded.';
axsReader.NO_RESULTS_STRING = 'Your search did not match any feeds. ' +
    'Please make sure all words are spelled correctly, ' +
    'or try different keywords, or try more general keywords. ';
axsReader.SUBSCRIBED_STRING = ' Already subscribed. ';
axsReader.NOT_SUBSCRIBED_STRING = ' Not subscribed. ';
axsReader.SUBSCRIBING_STRING = 'Subscribing.';
axsReader.GOTO_PREV_PAGE_STRING = 'Go to the previous page.';
axsReader.GOTO_NEXT_PAGE_STRING = 'Go to the next page.';
axsReader.ITEM_STARRED_STRING = 'Star added.';
axsReader.ITEM_UNSTARRED_STRING = 'Star removed.';
axsReader.MARKED_READ_STRING = 'Marked red.';
axsReader.MARKED_UNREAD_STRING = 'Marked unred.';
axsReader.ITEM_SHARED_STRING = 'Shared.';
axsReader.ITEM_UNSHARED_STRING = 'Not shared.';
axsReader.THERE_ARE_STRING = 'There are ';
axsReader.HELP_STRING = 'N, read the next item. ' +
                        'P, read the previous item. ' +
                        'Shift plus N, navigate to the next feed. ' +
                        'Shift plus P, navigate to the previous feed. ' +
                        'Shift plus O, open the current feed. ' +
                        'B, browse for feeds. ' +
                        'Enter, subscribe to the current feed bundle or ' +
                        'feed search result. ' +
                        'Period, unsubscribe from the currently opened feed. ' +
                        'S, when browsing for feeds, jump to the search ' +
                        'for feeds blank. ' +
                        'Slash, search for articles in subscribed feeds.' +
                        'S, when reading articles, star the current article. ' +
                        'M, mark the current article as red. ' +
                        'Shift + S, share the current article. ' +
                        'E, e-mail the current article. ' +
                        'T, edit tags for the current article.';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsReader.axsJAXObj = null;


axsReader.loadingBundles = false;

/** Array and index for the feed bundles */
axsReader.feedBundlesArray = null;
axsReader.currentFeedBundle = -1;

/** Array and index for the feed search results */
axsReader.currentFeedResult = -1;
axsReader.feedResultsArray = null;


axsReader.tagSelectorTopDivId = null;

/**
 * Initializes the scripts for Google Reader
 */
axsReader.init = function(){
  axsReader.feedResultsArray = new Array();
  axsReader.feedBundlesArray = new Array();
  axsReader.axsJAXObj = new AxsJAX(false);
  window.addEventListener('DOMNodeInserted', axsReader.domInsertionHandler,
                          true);
  window.addEventListener('DOMAttrModified', axsReader.domAttrModifiedHandler,
                          true);
  window.addEventListener('keypress', axsReader.extraKeyboardNavHandler, true);
};


/**
 * DOM nodes are inserted when the articles/search results are loaded,
 * when bundles are shown, when the email form is brought up, and
 * when tag navigation is used.
 * @param event {event} A DOM Node Insertion event
 */

axsReader.domInsertionHandler = function(event){
  var target = event.target;
  // When the feed search results are loaded, this will tell users that they can
  // proceed.
  if (target.firstChild &&
      target.firstChild.id == 'directory-search-results'){
    axsReader.inputFocused = false; //There is no blur event when the
                                    //search results get loaded
    axsReader.findFeedResults();
    if (axsReader.feedResultsArray.length > 0){
      axsReader.axsJAXObj.speakTextViaNode(axsReader.RESULTS_LOADED_STRING);
    } else {
      axsReader.axsJAXObj.speakTextViaNode(axsReader.NO_RESULTS_STRING);
    }
  }
  //Click on bundles tab to synchronize what is on screen with what the user
  //is hearing.
  if (target.firstChild &&
      target.firstChild.id == 'directory-box'){
    if (axsReader.loadingBundles){
      axsReader.loadingBundles = false;
      window.setTimeout(function(){
        var bundlesTab = document.getElementById('bundles-tab-header');
        axsReader.axsJAXObj.clickElem(bundlesTab,false);
      },100);
    }
  }
  //Autofocus on the email input blank if the email this story function is used.
  if (target.className == 'action-area'){
    var inputArray = target.getElementsByTagName('INPUT');
    for (var i=0; i<inputArray.length; i++){
      if (inputArray[i].className == 'email-this-to'){
        inputArray[i].focus();
        return;
      }
    }
  }
  //Handle tag navigation
  if (target.className ==
          'banner banner-background label-keyboard-selector'){
    axsReader.axsJAXObj.assignId(target);
    axsReader.tagSelectorTopDivId = target.id;
    //Must be done as a timeout as the childNodes do not exist at this point
    window.setTimeout(axsReader.announceSelectedTag,100);
  }

};

/**
 * Finds the currently selected tag and reads it
 */
axsReader.announceSelectedTag = function(){
  var topDiv = document.getElementById(axsReader.tagSelectorTopDivId);
  var selectedTag = axsReader.findSelectedTag(topDiv);
  axsReader.axsJAXObj.speakText(selectedTag.textContent);
};


axsReader.findSelectedTag = function(tagSelectorTopDiv){
  var xpath = "//li[@class='selected']";
  return axsReader.axsJAXObj.evalXPath(xpath,tagSelectorTopDiv)[0];
};



/**
 * Reader will modify the className or id attributes of a node to cause
 * CSS to highlight it. These highlights indicate the current thing the user
 * is interested in and what is highlighted should be spoken.
 * Reader will unhide the articles viewer-box when the user opens a feed; the
 * user should be informed when this happens.
 * @param evt {event} A DOM Attribute Modified event
 */
axsReader.domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  //Article, feed tree, and tag navigation
  if ( ((attrib == 'id') && (newVal == 'current-entry')) ||
       ((attrib == 'class') && ((newVal == 'link cursor') ||
                                (newVal == 'link selected cursor'))) ){
    axsReader.axsJAXObj.speakNode(target);
    //Alert users when articles are loaded
  } else if( (target.id == 'viewer-box')
             && (attrib == 'class')
             && (oldVal == 'hidden')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.ARTICLES_LOADED_STRING);
    //Star and unstar articles
  } else if( (attrib == 'class')
             && (newVal == 'item-star-active star link')
             && (oldVal == 'item-star star link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.ITEM_STARRED_STRING);
  } else if( (attrib == 'class')
             && (newVal == 'item-star star link')
             && (oldVal == 'item-star-active star link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.ITEM_UNSTARRED_STRING);
    //Share and unshare articles
  } else if( (attrib == 'class')
             && (newVal == 'broadcast-active broadcast link')
             && (oldVal == 'broadcast-inactive broadcast link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.ITEM_SHARED_STRING);
  } else if( (attrib == 'class')
             && (newVal == 'broadcast-inactive broadcast link')
             && (oldVal == 'broadcast-active broadcast link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.ITEM_UNSHARED_STRING);
    //Mark and unmark articles as read
  } else if( (attrib == 'class')
             && (newVal == 'read-state-read read-state link')
             && (oldVal == 'read-state-unread read-state link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.MARKED_READ_STRING);
  } else if( (attrib == 'class')
             && (newVal == 'read-state-unread read-state link')
             && (oldVal == 'read-state-read read-state link')){
    axsReader.axsJAXObj.speakTextViaNode(axsReader.MARKED_UNREAD_STRING);
    //Alert for when email messages are not sent
  } else if( (attrib == 'class')
             && (oldVal == 'form-error-message email-this-to-error hidden')){
    axsReader.axsJAXObj.speakNode(target);
    //Info messages
  } else if( (attrib == 'class')
             && (newVal == 'info-message')
             && (oldVal == 'info-message hidden')){
    axsReader.axsJAXObj.speakTextViaNode(target);
  } else if ( (attrib == 'class')
             && (newVal ==
                     'banner banner-background label-keyboard-selector hidden')
             && (oldVal == 'banner banner-background label-keyboard-selector')){
    axsReader.tagSelectorTopDivId = null;
  }

};

/**
 * Reader does not have full keyboard support for all important functions.
 * This key handler extends the support to cover what is missing.
 * @param event {event} A Keypress event
 */
axsReader.extraKeyboardNavHandler = function(event){
  if (event.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT.
    return true;
  }

  var lastFocusedNode = axsReader.axsJAXObj.lastFocusedNode;

  if (event.keyCode == 27){ // ESC
    lastFocusedNode.blur();
    return false;
  }

  //Don't swallow keys for input fields
  if (axsReader.axsJAXObj.inputFocused){
    return true;
  }

  //Handle navigation in the tag selector
  if (axsReader.tagSelectorTopDivId){
    if ((event.keyCode >= 37) || (event.keyCode <= 40)){     //Is an arrow key
      //Must be done as a timeout as the "selected" class
      //has not been set at this point
      window.setTimeout(axsReader.announceSelectedTag,100);
      return false;
    }
    return true;
  }

  //Fix the "Send" article email button
  if (lastFocusedNode && (lastFocusedNode.textContent == 'Send')){
    if (event.keyCode == 9){      //Tab
      axsReader.navigateToClosestCancelButton(lastFocusedNode);
      return false;
    }
  }

  //**The following code adds keyboard shortcuts that do not exist
  if ( (event.charCode == 98) || (event.charCode == 66)){      // b or B
    axsReader.browseFeedBundles();
    return false;
  }

  if (event.charCode == 82){      // R
    axsReader.browseRecommendations();
    return false;
  }

  if (event.charCode == 46){      // .
    axsReader.unsubscribeFromFeedCurrentlyOpen();
    return false;
  }

  if (event.charCode == 63){      // ?
    axsReader.axsJAXObj.speakTextViaNode(axsReader.HELP_STRING);
    return false;
  }

  //**The following code is specific to certain contexts
  //**and should not be done all the time.


  var viewerPageContainer = document.getElementById('viewer-page-container');
  var containerContent = null;
  if (viewerPageContainer.firstChild){
    containerContent = viewerPageContainer.firstChild.firstChild;
  }



  //For the discover feeds page
  if ( (viewerPageContainer.className != 'hidden') &&
       (containerContent.id == 'directory-box') ){
    var bundleContents = document.getElementById('bundles-tab-contents');
    var recommendationContents =
        document.getElementById('recommendations-tab-contents');
    //Only on the feed bundles page
    if (bundleContents.className.indexOf('hidden') == -1){
      if (event.charCode == 110 ){   // n
        axsReader.navigateToNextFeedBundle();
        return false;
      }
      if (event.charCode == 112){   // p
        axsReader.navigateToPrevFeedBundle();
        return false;
      }
      if (event.charCode == 115){   //  s
        window.setTimeout(axsReader.focusFeedsSearch,10);
        return false;
      }
      if (event.keyCode == 13){         // Enter
        axsReader.subscribeToCurrentFeedBundle();
        return false;
      }
      //Only on the recommendations page
    } else if (recommendationContents.className.indexOf('hidden') == -1){
      if (event.charCode == 110 ){   // n
        axsReader.navigateToNextResult();
        return false;
      }
      if (event.charCode == 112){   // p
        axsReader.navigateToPrevResult();
        return false;
      }
      if (event.keyCode == 13){         // Enter
        axsReader.actOnCurrentResult();
        return false;
      }
    }
  }
  //Only on the feed search results page
  if ( (viewerPageContainer.className != 'hidden') &&
       (containerContent.id == 'directory-search-results') ){
    if (event.charCode == 110){    // n
      axsReader.navigateToNextResult();
      return false;
    }
    if (event.charCode == 112 ){   //  p
      axsReader.navigateToPrevResult();
      return false;
    }
    if (event.keyCode == 13){      // Enter
      axsReader.actOnCurrentResult();
      return false;
    }
  }
  return true;
};

/**
 * Find the active feed bundle and unsubscribe the user from it.
 */
axsReader.unsubscribeFromFeedCurrentlyOpen = function(){
  var prefsControl = document.getElementById('stream-prefs-menu-contents');
  if ( prefsControl &&
      (prefsControl.className.indexOf('single-feed-menu') != -1)){
    var unsubscribeMenuItem = document.getElementById('stream-unsubscribe');
    axsReader.axsJAXObj.clickElem(unsubscribeMenuItem, false);
  }
};


/**
 * Start: Code for working with Feed Bundles
 *
 */

/**
 * Open the "Browse feed bundles" panel
 */
axsReader.browseFeedBundles = function(){
  var baseURL = document.documentURI.split('#')[0];
  document.location = baseURL + '#directory-page';
  axsReader.axsJAXObj.speakTextViaNode(axsReader.BUNDLES_LOADED_STRING);
  axsReader.feedBundlesArray = new Array();
  var bundlesTab = document.getElementById('bundles-tab-header');
  if (bundlesTab){
    axsReader.axsJAXObj.clickElem(bundlesTab,false);
  } else {
    axsReader.loadingBundles = true;
  }
};

axsReader.browseRecommendations = function(){
  var baseURL = document.documentURI.split('#')[0];
  document.location = baseURL + '#directory-page';
  axsReader.axsJAXObj.speakTextViaNode(axsReader.RECOMMENDATIONS_LOADED_STRING);
  axsReader.feedResultsArray = new Array();
  axsReader.loadingBundles = false;
  var recTab = document.getElementById('recommendations-tab-header');
  if (recTab){
    axsReader.axsJAXObj.clickElem(recTab,false);
  }
};


 /**
 * Load the feed bundles that are shown into an array that can be more easily
 * traversed.
 */
axsReader.findFeedBundles = function(){
  var xpath =
      "//div[@id='bundles-list']/div[@id!='show-more-bundles-container']";
  axsReader.feedBundlesArray =
      axsReader.axsJAXObj.evalXPath(xpath,document.body);
  axsReader.currentFeedBundle = -1;
};

 /**
 * Navigate to the next feed bundle and announce what it is and whether or not
 * the user has subscribed to it already.
 */
axsReader.navigateToNextFeedBundle = function(){
  if (axsReader.feedBundlesArray.length === 0){
    axsReader.findFeedBundles();
  }
  axsReader.currentFeedBundle++;
  if (axsReader.currentFeedBundle >= axsReader.feedBundlesArray.length){
    axsReader.currentFeedBundle = 0;
  }
  axsReader.announceCurrentFeedBundle();
};

/**
 * Navigate to the previous feed bundle and announce what it is and whether or
 * not the user has subscribed to it already.
 */
axsReader.navigateToPrevFeedBundle = function(){
  if (axsReader.feedBundlesArray.length === 0){
    axsReader.findFeedBundles();
    axsReader.currentFeedBundle = axsReader.feedBundlesArray.length;
  }
  axsReader.currentFeedBundle--;
  if (axsReader.currentFeedBundle < 0){
    axsReader.currentFeedBundle = axsReader.feedBundlesArray.length - 1;
  }
  axsReader.announceCurrentFeedBundle();
};

/**
 * Announce what the current feed bundle is and whether or not the user
 * is subscribed to it.
 */
axsReader.announceCurrentFeedBundle = function(){
  var currentFeedBundleNode =
      axsReader.feedBundlesArray[axsReader.currentFeedBundle];
  var subscriptionStatus = axsReader.SUBSCRIBED_STRING;
  if (currentFeedBundleNode.className.indexOf('bundle-added') == -1){
    subscriptionStatus = axsReader.NOT_SUBSCRIBED_STRING;
    }
  var bundleName = currentFeedBundleNode.firstChild.firstChild.textContent;
  var announcementString = bundleName + subscriptionStatus;
  axsReader.axsJAXObj.speakTextViaNode(announcementString);
};

/**
 * Subscribe to the current feed bundle. Note that subscribing to an already
 * subscribed feed bundle will do nothing.
 */
axsReader.subscribeToCurrentFeedBundle = function(){
  var currentFeedBundleNode =
      axsReader.feedBundlesArray[axsReader.currentFeedBundle];
  var subscribeButton = currentFeedBundleNode.getElementsByTagName('table')[0];
  axsReader.axsJAXObj.clickElem(subscribeButton, false);
  axsReader.axsJAXObj.speakTextViaNode(axsReader.SUBSCRIBING_STRING);
};

/**
 * End: Code for working with Feed Bundles
 */


/**
 * Start: Code for working with Feed Search
 */
axsReader.focusFeedsSearch = function(){
  document.getElementById('directory-search-query').focus();
};

 /**
 * Load the results that are shown into an array that can be more easily
 * traversed. Consider the next/prev page links as part of this array.
 */
axsReader.findFeedResults = function(){
  var xpath =
      "//div[@id='directory-search-results']//div[@class='feed-result-row']";
  var results = axsReader.axsJAXObj.evalXPath(xpath,document.body);                                                                         
  axsReader.feedResultsArray = new Array();
  for (var i = 0, result; result = results[i]; i++) {
    axsReader.feedResultsArray.push(result);
  }
  var prevPage =
    document.getElementById('directory-search-results-previous-page');
  var nextPage = document.getElementById('directory-search-results-next-page');
  if (prevPage){axsReader.feedResultsArray.push(prevPage);}
  if (nextPage){axsReader.feedResultsArray.push(nextPage);}
  axsReader.currentFeedResult = -1;
};

 /**
 * Recommendations are structured almost the same as feed search results
 */
axsReader.findRecommendations = function(){
  var xpath = "//div[@id='rec-feeds-list']/div[@class='feed-result-row']";
  axsReader.feedResultsArray =
      axsReader.axsJAXObj.evalXPath(xpath,document.body);
  axsReader.currentFeedResult = -1;
};


/**
 * Navigate to the next feed search result and announce what it is and
 * whether or not the user has subscribed to it already.
 */
axsReader.navigateToNextResult = function(){
  if (axsReader.feedResultsArray.length === 0){
    if (document.documentURI.indexOf('#directory-search') != -1){
      axsReader.findFeedResults();
    } else {
      axsReader.findRecommendations();
    }
  }
  axsReader.currentFeedResult++;
  if (axsReader.currentFeedResult >= axsReader.feedResultsArray.length){
    axsReader.currentFeedResult = 0;
  }
  axsReader.announceCurrentFeedResult();
};

/**
 * Navigate to the previous feed search result and announce what it is and
 * whether or not the user has subscribed to it already.
 */
axsReader.navigateToPrevResult = function(){
  if (axsReader.feedResultsArray.length === 0){
    if (document.documentURI.indexOf('#directory-search') != -1){
      axsReader.findFeedResults();
    } else {
      axsReader.findRecommendations();
    }
    axsReader.currentFeedResult = axsReader.feedResultsArray.length;
  }
  axsReader.currentFeedResult--;
  if (axsReader.currentFeedResult < 0){
    axsReader.currentFeedResult = axsReader.feedResultsArray.length - 1;
  }
  axsReader.announceCurrentFeedResult();
};

/**
 * Announce what the current feed search result is and whether or not the user
 * is subscribed to it.
 */
axsReader.announceCurrentFeedResult = function(){
  var currentFeedResultNode =
      axsReader.feedResultsArray[axsReader.currentFeedResult];
  var announcementString = "";
  if(currentFeedResultNode.id == 'directory-search-results-previous-page'){
    announcementString = axsReader.GOTO_PREV_PAGE_STRING;
  } else if (currentFeedResultNode.id == 'directory-search-results-next-page'){
    announcementString = axsReader.GOTO_NEXT_PAGE_STRING;
  } else {
    var theFeedStats = currentFeedResultNode.childNodes[0];
    var theFeedResult = currentFeedResultNode.childNodes[2];
    var subscriptionStatus = axsReader.SUBSCRIBED_STRING;
    if (theFeedResult.className.indexOf('result-subscribed') == -1){
      subscriptionStatus = axsReader.NOT_SUBSCRIBED_STRING;
      }
    announcementString = subscriptionStatus
                         + theFeedResult.childNodes[0].textContent
                         + ' '
                         + theFeedResult.childNodes[2].textContent
                         + ' '
                         + axsReader.THERE_ARE_STRING
                         + theFeedStats.textContent
                         + ' '
                         + theFeedResult.childNodes[4].textContent;
    }
  axsReader.axsJAXObj.speakTextViaNode(announcementString);
  currentFeedResultNode.scrollIntoView(true);
};

/**
 * Subscribe to the current feed search result or click on the current link that
 * goes to the next/prev page. Note that subscribing to an already subscribed
 * feed will do nothing.
 */
axsReader.actOnCurrentResult = function(){
  var currentFeedResultNode =
      axsReader.feedResultsArray[axsReader.currentFeedResult];
  if( (currentFeedResultNode.id == 'directory-search-results-previous-page') ||
      (currentFeedResultNode.id == 'directory-search-results-next-page')     ){
    axsReader.axsJAXObj.clickElem(currentFeedResultNode, false);
    axsReader.feedResultsArray = new Array();
    axsReader.currentFeedResult = -1;
  } else {
    var subscribeButton = currentFeedResultNode.childNodes[2].childNodes[8];
    axsReader.axsJAXObj.clickElem(subscribeButton, false);
    axsReader.axsJAXObj.speakTextViaNode(axsReader.SUBSCRIBING_STRING);
  }
};

/**
 * End: Code for working with Feed Search
 */
axsReader.navigateToClosestCancelButton = function(enterButtonSpan){
  var enterButtonRow = enterButtonSpan.parentNode.parentNode.parentNode;
  var enterButtonTable = enterButtonRow.parentNode.parentNode; //Expect TD
  var cancelButtonTable = enterButtonTable.nextSibling;
  var cancelButton = cancelButtonTable.getElementsByTagName('span')[0];
  cancelButton.focus();
};

/** Start the Greasemonkey script for Reader accessibility */
axsReader.init();
