// Copyright 2007 Google Inc.
// All Rights Reserved.

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
axsReader.ITEM_SHARED_STRING = 'Shared.';
axsReader.ITEM_UNSHARED_STRING = 'Not shared.';
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
                        'Shift + S, share the current article. ' +
                        'E, e-mail the current article. ' +
                        'T, edit tags for the current article.';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsReader.axsJAXObj = null;

/** Array and index for the feed bundles */
axsReader.feedBundlesArray = null;
axsReader.currentFeedBundle = -1;

/** Array and index for the feed search results */
axsReader.currentFeedResult = -1;
axsReader.feedResultsArray = null;

/**
 *  Track whether or not an input element is focused to determine if the
 *  hot keys should be active
 */
axsReader.inputFocused = false;
axsReader.lastFocusedObject = null;


axsReader.tagSelectorTopDivId = null;




/**
 * Initializes the scripts for Google Reader
 */
axsReader.init = function(){
  axsReader.feedResultsArray = new Array();
  axsReader.feedBundlesArray = new Array();
  axsReader.axsJAXObj = new AxsJAX();
  window.addEventListener('DOMNodeInserted', axsReader.domInsertionHandler,
                          true);
  window.addEventListener('DOMAttrModified', axsReader.domAttrModifiedHandler,
                          true);
  window.addEventListener('keypress', axsReader.extraKeyboardNavHandler, true);
  window.addEventListener('focus', axsReader.focusHandler, true);
  window.addEventListener('blur', axsReader.blurHandler, true);
};


/**
 * When the feed search results are loaded, this will tell users that they can
 * proceed.
 * @param {event} A DOM Node Insertion event
 */
axsReader.domInsertionHandler = function(event){
  if (event.target.firstChild &&
      event.target.firstChild.id == 'directory-search-results'){
    axsReader.inputFocused = false; //There is no blur event when the
                                    //search results get loaded
    axsReader.findFeedResults();
    if (axsReader.feedResultsArray.length > 0){
      axsReader.axsJAXObj.speakText(axsReader.RESULTS_LOADED_STRING);
    } else {
      axsReader.axsJAXObj.speakText(axsReader.NO_RESULTS_STRING);
    }
  }
  //Handle tag navigation
  if (event.target.className ==
          'banner banner-background label-keyboard-selector'){
    axsReader.axsJAXObj.assignId(event.target);
    axsReader.tagSelectorTopDivId = event.target.id;
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
  axsReader.axsJAXObj.speakNode(selectedTag);
};


axsReader.findSelectedTag = function(tagSelectorTopDiv){
  var allTagsArray = tagSelectorTopDiv.getElementsByTagName('li');
  for (var i=0; i < allTagsArray.length; i++){
    if (allTagsArray[i].className == 'selected'){
      return allTagsArray[i];
    }
  }
  return null;
};



/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsReader.focusHandler = function(event){
  if ((event.target.tagName == 'INPUT') ||
      (event.target.tagName == 'TEXTAREA')){
    axsReader.inputFocused = true;
  }
  axsReader.lastFocusedObject = event.target;
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsReader.blurHandler = function (event){
  if ((event.target.tagName == 'INPUT') ||
      (event.target.tagName == 'TEXTAREA')){
    axsReader.inputFocused = false;
  }
};

/**
 * Reader will modify the className or id attributes of a node to cause
 * CSS to highlight it. These highlights indicate the current thing the user
 * is interested in and what is highlighted should be spoken.
 * Reader will unhide the articles viewer-box when the user opens a feed; the
 * user should be informed when this happens.
 * @param {event} A DOM Attribute Modified event
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
    axsReader.axsJAXObj.putNullForNoAltImages(target);
    axsReader.axsJAXObj.speakNode(target);
    //Alert users when articles are loaded
  } else if( (target.id == 'viewer-box')
             && (attrib == 'class')
             && (oldVal == 'hidden')){
    axsReader.axsJAXObj.speakText(axsReader.ARTICLES_LOADED_STRING);
    //Star and unstar articles
  } else if( (attrib == 'class')
             && (newVal == 'item-star-active star link')
             && (oldVal == 'item-star star link')){
    axsReader.axsJAXObj.speakText(axsReader.ITEM_STARRED_STRING);
  } else if( (attrib == 'class')
             && (newVal == 'item-star star link')
             && (oldVal == 'item-star-active star link')){
    axsReader.axsJAXObj.speakText(axsReader.ITEM_UNSTARRED_STRING);
    //Share and unshare articles
  } else if( (attrib == 'class')
             && (newVal == 'broadcast-active broadcast link')
             && (oldVal == 'broadcast-inactive broadcast link')){
    axsReader.axsJAXObj.speakText(axsReader.ITEM_SHARED_STRING);
  } else if( (attrib == 'class')
             && (newVal == 'broadcast-inactive broadcast link')
             && (oldVal == 'broadcast-active broadcast link')){
    axsReader.axsJAXObj.speakText(axsReader.ITEM_UNSHARED_STRING);
    //Alert for when email messages are not sent
  } else if( (attrib == 'class')
             && (oldVal == 'form-error-message email-this-to-error hidden')){
    axsReader.axsJAXObj.speakNode(target);
    //Info messages
  } else if( (attrib == 'class')
             && (newVal == 'info-message')
             && (oldVal == 'info-message hidden')){
    axsReader.axsJAXObj.speakNode(target);
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
 * @param {event} A Keypress event
 */
axsReader.extraKeyboardNavHandler = function(event){
  //Handle navigation in the tag selector
  if (axsReader.tagSelectorTopDivId){
    if ((event.keyCode >= 37) || (event.keyCode <= 40)){     //Is an arrow key
      //Must be done as a timeout as the "selected" class
      //has not been set at this point
      window.setTimeout(axsReader.announceSelectedTag,100);
    }
  }


  //**The following code corrects broken keyboard handling
  if (axsReader.inputFocused){
    //Fix the "cc me" checkbox
    if (axsReader.lastFocusedObject &&
        (axsReader.lastFocusedObject.name == 'ccMe')){
      if (event.keyCode == 9){   //Tab
        axsReader.navigateToClosestSendButton(event.target);
      }
      if (event.keyCode == 13){  //Enter - workaround for broken check/uncheck
        axsReader.axsJAXObj.clickElem(event.target);
        axsReader.axsJAXObj.assignId(event.target);
        window.setTimeout("document.getElementById('"
                           + event.target.id + "').focus();",0);
      }
    }
    //For all other inputs, do nothing
    return;
  }

  //Fix the "Send" article email button
  if (axsReader.lastFocusedObject &&
       (axsReader.lastFocusedObject.textContent == 'Send')){
    if (event.keyCode == 9){      //Tab
      axsReader.navigateToClosestCancelButton(axsReader.lastFocusedObject);
    }
    if (event.keyCode == 13){      //Enter
      axsReader.axsJAXObj.clickElem(axsReader.lastFocusedObject);
    }
    return;
  }

  //Fix the "Cancel" article email button
  if (axsReader.lastFocusedObject &&
       (axsReader.lastFocusedObject.textContent == 'Cancel')){
    if (event.keyCode == 13){      //Enter
      axsReader.axsJAXObj.clickElem(axsReader.lastFocusedObject);
    }
    return;
  }
  //**The following code adds keyboard shortcuts that do not exist

  if (event.charCode == 98){      // b
    axsReader.browseFeedBundles();
  }

  if (event.charCode == 46){      // .
    axsReader.unsubscribeFromFeedCurrentlyOpen();
  }

  if (event.charCode == 63){      // ?
    axsReader.axsJAXObj.speakText(axsReader.HELP_STRING);
  }

  //**The following code is specific to certain contexts
  //**and should not be done all the time.

  //Only on the feed bundles page
  var viewerPageContainer = document.getElementById('viewer-page-container');
  var containerContent = null;
  if (viewerPageContainer.firstChild){
    containerContent = viewerPageContainer.firstChild.firstChild;
  }
  if ( (viewerPageContainer.className != 'hidden') &&
       (containerContent.id == 'directory-box') ){
    if (event.charCode == 110 ){   // n
      axsReader.navigateToNextFeedBundle();
    }
    if (event.charCode == 112){   // p
      axsReader.navigateToPrevFeedBundle();
    }
    if (event.charCode == 115){   //  s
      window.setTimeout(axsReader.focusFeedsSearch,10);
    }
    if (event.keyCode == 13){         // Enter
      axsReader.subscribeToCurrentFeedBundle();
    }
  }
  //Only on the feed search results page
  if ( (viewerPageContainer.className != 'hidden') &&
       (containerContent.id == 'directory-search-results') ){
    if (event.charCode == 110){    // n
      axsReader.navigateToNextResult();
    }
    if (event.charCode == 112 ){   //  p
      axsReader.navigateToPrevResult();
    }
    if (event.keyCode == 13){      // Enter
      axsReader.actOnCurrentResult();
    }
  }

};

/**
 * Find the active feed bundle and unsubscribe the user from it.
 */
axsReader.unsubscribeFromFeedCurrentlyOpen = function(){
  var prefsControl = document.getElementById('stream-prefs-menu-contents');
  if ( prefsControl &&
      (prefsControl.className.indexOf('single-feed-menu') != -1)){
    var unsubscribeMenuItem = document.getElementById('stream-unsubscribe');
    axsReader.axsJAXObj.clickElem(unsubscribeMenuItem);
  }
}


/**
 * Start: Code for working with Feed Bundles
 **/

/**
 * Open the "Browse feed bundles" panel
 */
axsReader.browseFeedBundles = function(){
  document.location =
    'http://www.google.com/reader/view/#directory-page';
  axsReader.axsJAXObj.speakText(axsReader.BUNDLES_LOADED_STRING);
  axsReader.feedBundlesArray = new Array();
}

 /**
 * Load the feed bundles that are shown into an array that can be more easily
 * traversed.
 */
axsReader.findFeedBundles = function(){
  axsReader.feedBundlesArray = new Array();
  var bundlesList = document.getElementById('bundles-list');
  for (var i = 0, bundle; bundle = bundlesList.childNodes[i]; i++) {
    if ( (bundle.nodeType == 1) &&
         (bundle.id != 'show-more-bundles-container') ){
      axsReader.feedBundlesArray.push(bundle);
    }
  }
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
  axsReader.axsJAXObj.speakText(announcementString);
};

/**
 * Subscribe to the current feed bundle. Note that subscribing to an already
 * subscribed feed bundle will do nothing.
 */
axsReader.subscribeToCurrentFeedBundle = function(){
  var currentFeedBundleNode =
      axsReader.feedBundlesArray[axsReader.currentFeedBundle];
  var subscribeButton = currentFeedBundleNode.getElementsByTagName('table')[0];
  axsReader.axsJAXObj.clickElem(subscribeButton);
  axsReader.axsJAXObj.speakText(axsReader.SUBSCRIBING_STRING);
};

/**
 * End: Code for working with Feed Bundles
 */


/**
 * Start: Code for working with Feed Search
 */
axsReader.focusFeedsSearch = function(){
  document.getElementById('directory-search-query').focus();
}

 /**
 * Load the results that are shown into an array that can be more easily.
 * traversed. Consider the next/prev page links as part of this array.
 */
axsReader.findFeedResults = function(){
  axsReader.feedResultsArray = new Array();
  var resultsList = document.getElementById('directory-search-results');
  var divArray = resultsList.getElementsByTagName('div');
  for (var i = 0, result; result = divArray[i]; i++) {
    if (result.className == 'row'){
      axsReader.feedResultsArray.push(result);
    }
  }
  var prevPage =
    document.getElementById('directory-search-results-previous-page');
  var nextPage = document.getElementById('directory-search-results-next-page');
  if (prevPage){axsReader.feedResultsArray.push(prevPage);}
  if (nextPage){axsReader.feedResultsArray.push(nextPage);}
  axsReader.currentFeedResult = -1;
};

/**
 * Navigate to the next feed search result and announce what it is and
 * whether or not the user has subscribed to it already.
 */
axsReader.navigateToNextResult = function(){
  if (axsReader.feedResultsArray.length === 0){
    axsReader.findFeedResults();
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
    axsReader.findFeedResults();
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
      axsReader.feedResultsArray[axsReader.currentFeedResult].childNodes[2];
  var announcementString = "";
  if(currentFeedResultNode.id == 'directory-search-results-previous-page'){
    announcementString = axsReader.GOTO_PREV_PAGE_STRING;
  } else if (currentFeedResultNode.id == 'directory-search-results-next-page'){
    announcementString = axsReader.GOTO_NEXT_PAGE_STRING;
  } else {
    var subscriptionStatus = axsReader.SUBSCRIBED_STRING;
    if (currentFeedResultNode.className.indexOf('result-subscribed') == -1){
      subscriptionStatus = axsReader.NOT_SUBSCRIBED_STRING;
      }
    announcementString = subscriptionStatus
                         + currentFeedResultNode.childNodes[0].textContent
                         + ' '
                         + currentFeedResultNode.childNodes[2].textContent
                         + ' '
                         + currentFeedResultNode.childNodes[4].textContent;
    }
  axsReader.axsJAXObj.speakText(announcementString);
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
    axsReader.axsJAXObj.clickElem(currentFeedResultNode);
    axsReader.feedResultsArray = new Array();
    axsReader.currentFeedResult = -1;
  } else {
    var subscribeButton = currentFeedResultNode.childNodes[8];
    axsReader.axsJAXObj.clickElem(subscribeButton);
    axsReader.axsJAXObj.speakText(axsReader.SUBSCRIBING_STRING);
  }
}

/**
 * End: Code for working with Feed Search
 */




axsReader.navigateToClosestSendButton = function(checkboxNode){
  var emailBodyArea = checkboxNode.parentNode.parentNode.parentNode;//Expect TD
  var tablesArray = emailBodyArea.getElementsByTagName('table');
  var sendButton = tablesArray[0].getElementsByTagName('span')[0];
  sendButton.tabIndex = 0;
  sendButton.setAttribute('role','wairole:button');
  sendButton.focus();
};


axsReader.navigateToClosestCancelButton = function(enterButtonSpan){
  var enterButtonRow = enterButtonSpan.parentNode.parentNode.parentNode;
  var enterButtonTable = enterButtonRow.parentNode.parentNode; //Expect TD
  var cancelButtonTable = enterButtonTable.nextSibling;
  var cancelButton = cancelButtonTable.getElementsByTagName('span')[0]
  cancelButton.tabIndex = 0;
  cancelButton.setAttribute('role','wairole:button');
  cancelButton.focus();
};

/** Start the Greasemonkey script for Reader accessibility */
axsReader.init();
