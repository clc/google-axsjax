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
 * @fileoverview AxsJAX to enhance accessibility
 * of Google Books.
 * Note that these  scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsBooksAbout = {};

//These are strings used to find specific links
axsBooksAbout.MORE_STRING = 'more';

//These are strings to be spoken to the user
axsBooksAbout.HELP =
    'The following shortcut keys are available. ' +
    'Down arrow or H, go to the next category. ' +
    'Up arrow or L, go to the previous category. ' +
    'Right arrow or J, cycle to the next item in the current category. ' +
    'Left arrow or K, cycle to the previous item in the current category. ' +
    'Enter, act on the current item. ' +
    'Slash, jump to the book search blank. ' +
    'S, jump to the "Search in this book" blank. ' +
    'Escape, leave a search blank. ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsBooksAbout.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsBooksAbout.axsNavObj = null;

axsBooksAbout.init = function(){
  axsBooksAbout.axsJAXObj = new AxsJAX(true);
  axsBooksAbout.axsNavObj = new AxsNav(axsBooksAbout.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsBooksAbout.keyHandler, true);
  // Expand all navigation sections:
  
  axsBooksAbout.expandAllMoreLinks();


  var cnrString = "<cnr next='DOWN h' prev='UP l'>" +
    "<list title='Search results' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('search')//div[@class='searchresult']" +
    "</item>" +
    "</list>" +
    "<list title='Summary' next='RIGHT j' prev='LEFT k'>" +
    "<item count='1'>" +
    "id('coverandmetadata')" +
    "</item>" +
    "<item count='1'>" +
    "id('synopsistext')" +
    "</item>" +
    "</list>" +
    "<list title='Buy or borrow this book' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('summary_content')/div[*]/table/tbody/tr[*]/td[@class='btblinks']" +
    "</item>" +
    "</list>" +
    "<list title='Reviews' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('reviews')//td" +
    "</item>" +
    "</list>" +
    "<list title='Keywords' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('keywords')//a" +
    "</item>" +
    "<item>" +
    "id('keywords_v')//a" +
    "</item>" +
    "</list>" +
    "<list title='Popular passages' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('quotes')//p[@class='quot']" +
    "</item>" +
    "</list>" +
    "<list title='Places mentioned in this book' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('gmap')/div/div[@class='result']" +
    "</item>" +
    "</list>" +
    "<list title='References from books' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('book_citations')//div[@class='resbdy']" +
    "</item>" +
    "</list>" +
    "<list title='References from scholarly works' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('scholar_citations')//p[@class='resbdy']" +
    "</item>" +
    "</list>" +
    "<list title='References from web pages' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('web_references')//p[@class='resbdy']" +
    "</item>" +
    "</list>" +
    "<list title='Other editions' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('book_other_versions')//div[@class='resbdy']" +
    "</item>" +
    "</list>" +
    "<list title='Related books' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "id('similarbooks')//div[@class='resbdy']" +
    "</item>" +
    "</list>" +
    "<list title='Sponsored links' next='RIGHT j' prev='LEFT k'>" +
    "<item>" +
    "/html/body/table[@class='lads']/tbody/tr[*]/td[1]" +
    "</item>" +
    "</list>" + 
    "</cnr>";

  axsBooksAbout.axsNavObj.navInit(cnrString, null);
  axsBooksAbout.fixAllPageLinks();

  // Speak the page title
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsBooksAbout.readTitleBar,100);
};


/**
 * Expand everything that can be expanded on the page by clicking on all
 * the "more >>" links.
 * Note that only the "more" part is matched - matching for
 * the " >>" part causes problems.
 */
axsBooksAbout.expandAllMoreLinks = function(){
  var spans = document.body.getElementsByTagName('SPAN');
  for (var i=0,currentLink; currentLink = spans[i]; i++){
    if ( (currentLink.className == 'morelesslink') &&
         (currentLink.textContent.indexOf(axsBooksAbout.MORE_STRING) === 0) ){
      axsBooksAbout.axsJAXObj.clickElem(currentLink,false);
    }
  }
};

/**
 * Reads the titlebar
 */
axsBooksAbout.readTitleBar = function(){
  var titleBarNode = document.getElementById('titlebar');
  axsBooksAbout.axsJAXObj.goTo(titleBarNode);
};


/*
 * Move to the search in book field
 */

axsBooksAbout.goFindInBook = function () {
  var searchForm = document.getElementById('search_form');
  var inputs = searchForm.getElementsByTagName('INPUT');
  for (var i=0,input; input = inputs[i]; i++){
    if (input.type == 'text'){
      input.focus();
      input.select();
      return false;
    }
  }
  return true;
};


/*
 * Move to the search field
 */

axsBooksAbout.goSearch = function () {
  // Focus on the top search field
  var f = document.getElementsByName('q')[0];
  f.focus();
  f.select(); //and select all text
  return false;
};
  

/*
 * Keyboard handler for About A Book page
 */
axsBooksAbout.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsBooksAbout.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsBooksAbout.axsJAXObj.inputFocused) return true;
  
  var command =  axsBooksAbout.keyCodeMap[evt.keyCode] ||
  axsBooksAbout.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;
  
};

//Need to perform a fix as there is a problem when the link is used as-is
//and the resulting preview page switches to a two page, plain text view
//immediately upon load.
axsBooksAbout.fixBookPageLink = function(theLink){
  theLink.onclick = null;
  var pageNumStart = theLink.href.indexOf('&pg=') + 4;
  var pageNumEnd = theLink.href.indexOf('&',pageNumStart+1);
  var pageNum = theLink.href.substring(pageNumStart, pageNumEnd);
  theLink.href = theLink.href + '&output=text#P' + pageNum + ',M2';
};

axsBooksAbout.fixAllPageLinks = function(){
  var navArray = axsBooksAbout.axsNavObj.navArray;
  for (var i=0, list; list = navArray[i]; i++){
    if ( (list.title == 'Search results') ||
         (list.title == 'Popular passages') ){
      for (var j=0,item; item=list.items[j]; j++){
        var link = item.elem.getElementsByTagName('a')[0];
        if (link) axsBooksAbout.fixBookPageLink(link);
      }
    }
  }
};

axsBooksAbout.actOnCurrentItem = function(shiftKey){
  var linkIndex = 0;
  var currentItem = axsBooksAbout.axsNavObj.currentItem().elem;

  var titleText = axsBooksAbout.axsNavObj.currentList().title;
  if (titleText == 'Places mentioned in this book'){
    linkIndex = 1;
  }
  var currentLink = null;
  if (currentItem.tagName == 'A'){
    currentLink = currentItem;
  } else {
    currentLink = currentItem.getElementsByTagName('A')[linkIndex];
  }
  if (currentLink){
    axsBooksAbout.axsJAXObj.clickElem(currentLink,shiftKey);
  }
};

axsBooksAbout.keyCodeMap = {
  // enter (tvr: lost shift)
  13 : function() {axsBooksAbout.actOnCurrentItem(false);}
};

axsBooksAbout.charCodeMap = {
  63 : function () {
         axsBooksAbout.axsJAXObj.speakTextViaNode(axsBooksAbout.HELP);}, // ?
 115 : axsBooksAbout.goFindInBook, //s
  47 : axsBooksAbout.goSearch
};

axsBooksAbout.init();
