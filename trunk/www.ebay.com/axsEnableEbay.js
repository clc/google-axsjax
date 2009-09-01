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
 * of Skel. 
 *
 * This is a skeleton AxsJAX script - when you start using it,
 * you should do a global replace of "axsEnableEbaySearch" with 
 * "axsWhateverYourAppNameIs" and update this fileoverview.
 *
 * @author sankar.aditya+axsjax@gmail.com (Sankar Aditya Tanguturi)
 */
// create namespace
var axsEnableEbaySearch = {};

/**
 * These are strings to be spoken to the user
 * @type string
 */
axsEnableEbaySearch.HELP = 'The following shortcut keys are available. ' +
  'a, to go to All Items page.' +
  'u, to go to Auctions only page.' +
  'b - Go to Buy It now page.' ;

axsEnableEbaySearch.BLANK_STRING = '';
axsEnableEbaySearch.DETAILS_STRING = ' Details ';
axsEnableEbaySearch.TOP_RATE_SELLER_STRING = ' Top Rated Seller ';
axsEnableEbaySearch.BIDS_STRING = ' Bids ';
axsEnableEbaySearch.PRICE_STRING = ' Price ';
axsEnableEbaySearch.TIME_REMAINING_STRING = ' Time Remaining ';
axsEnableEbaySearch.DOT_STRING = ' . ';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsEnableEbaySearch.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsEnableEbaySearch.axsNavObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsEnableEbaySearch.axsSoundObj = null;

/**
 * The PowerKey object that will provide a quick search
 * @type PowerKey?
 */
axsEnableEbaySearch.pkObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsEnableEbaySearch.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsEnableEbaySearch.magSize = 1.5;

/**
 * Initializes the AxsJAX script
 */
axsEnableEbaySearch.init = function(){
  axsEnableEbaySearch.axsJAXObj = new AxsJAX(true);
  axsEnableEbaySearch.axsNavObj = new AxsNav(axsEnableEbaySearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsEnableEbaySearch.keyHandler, true);

  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" fw' +
                  'd="n" back="p">' +
                  '    <item action="CALL:axsEnableEbaySearch.speakResult">' +
                  '      //table[@class="nol"]/tbody/tr' +
                  '    </item>' +
                  '    <target title="Next page" trigger="listTail">' +
                  '      //td[@class="next"]/a[2]/img ' +
                  '    </target>' +
                  '    <target title="Previous page" trigger="listHead">' +
                  '      //td[@class="prev"]/a[1]/img ' +
                  '    </target>	' +
                  '    <target title="Go to result" hotkey="ENTER">' +
                  '      ./td[@class="details"]/div[1]/a[1]' +
                  '    </target>' +                  
                  '  </list>' +
                  '  <target title="All Items" hotkey="a" onEmpty="' +
                  'All Items is not available">' +
                  '    id("searchtabs_tab_rgt_1")/a[1]' +
                  '  </target>' +                  
                  '  <target title="Auctions only" hotkey="u" onEmpty="' +
                  'Auctions only is not available">' +
                  '    id("searchtabs_tab_rgt_2")/a[1]' +
                  '  </target>' +                  
                  '  <target title="Buy It Now Only" hotkey="b" onEmpty="' +
                  'Buy It Now Only is not available">' +
                  '    id("searchtabs_tab_rgt_3")/a[1]' +
                  '  </target>' +                  
                  '</cnr>';

  axsEnableEbaySearch.axsNavObj.navInit(cnrString, null);

  axsEnableEbaySearch.axsLensObj = new AxsLens(axsEnableEbaySearch.axsJAXObj);
  axsEnableEbaySearch.axsNavObj.setLens(axsEnableEbaySearch.axsLensObj);
  axsEnableEbaySearch.axsLensObj.setMagnification(axsEnableEbaySearch.magSize);

  axsEnableEbaySearch.axsSoundObj = new AxsSound(true);
  axsEnableEbaySearch.axsNavObj.setSound(axsEnableEbaySearch.axsSoundObj);

  //Delete the next line when you are done with your script.
  window.setTimeout(axsEnableEbaySearch.readFirstResult, 500);
  
};

axsEnableEbaySearch.readFirstResult = function(){
  axsEnableEbaySearch.speakResult(axsEnableEbaySearch.axsNavObj.nextItem());
};

axsEnableEbaySearch.speakResult = function(item){
  var resultRow = item.elem;
  var message = '' ;
  var details = axsEnableEbaySearch.getDetails(resultRow);
  
  if (details) {
     message = message + axsEnableEbaySearch.DETAILS_STRING + axsEnableEbaySearch.DOT_STRING + details;
  }

  var isTopRatedSeller = axsEnableEbaySearch.isTopRatedSeller(resultRow);
  if (isTopRatedSeller) {
    message = message + axsEnableEbaySearch.TOP_RATE_SELLER_STRING;
  }

  var bids = axsEnableEbaySearch.getBids(resultRow);
  if (bids) {
    message = message + axsEnableEbaySearch.BIDS_STRING + axsEnableEbaySearch.DOT_STRING + bids; 
  }
  
  var price = axsEnableEbaySearch.getPrice(resultRow);
  if (price) {
    message = message + axsEnableEbaySearch.PRICE_STRING + axsEnableEbaySearch.DOT_STRING + price;  
  }

  var time = axsEnableEbaySearch.getTimeRemaining(resultRow);
  if (time) {
    message = message + axsEnableEbaySearch.TIME_REMAINING_STRING + axsEnableEbaySearch.DOT_STRING + time;
  }
  
  axsEnableEbaySearch.axsLensObj.view(resultRow);
  resultRow.scrollIntoView(true);
  axsEnableEbaySearch.axsJAXObj.speakTextViaNode(message);
};

axsEnableEbaySearch.getDetails = function(resultRow) {
  var detailsXPath = './td[@class="details"]/div[1]/a[1]';
  var details = axsEnableEbaySearch.axsJAXObj.evalXPath(detailsXPath, resultRow)[0];
  
  if (details) {
     return details.textContent;
  } else {
     return axsEnableEbaySearch.BLANK_STRING;
  }
};

axsEnableEbaySearch.isTopRatedSeller = function(resultRow) {
  var trsXPath = './td[@class="trs"]/img';
  
  return axsEnableEbaySearch.axsJAXObj.evalXPath(trsXPath, resultRow)[0];
};

axsEnableEbaySearch.getBids = function(resultRow) {
  var bidsXPath = './td[4]/img';
  var bids = axsEnableEbaySearch.axsJAXObj.evalXPath(bidsXPath, resultRow)[0];
  
  if (bids) {
     if (bids.attributes && bids.attributes.getNamedItem("title")) {
        return bids.attributes.getNamedItem("title").textContent;
     }
  } else {
     bidsXPath = './td[4]';
     bids = axsEnableEbaySearch.axsJAXObj.evalXPath(bidsXPath, resultRow)[0];
     if (bids) {
        return bids.textContent;
     }
  }
  return axsEnableEbaySearch.BLANK_STRING;
};

axsEnableEbaySearch.getPrice = function(resultRow) {
  var priceXPath = './td[@class = "prices"]/div[1]';
  var price = axsEnableEbaySearch.axsJAXObj.evalXPath(priceXPath, resultRow)[0];
  
  var shippingXPath = './td[@class = "prices"]/span[1]';
  var shipping = axsEnableEbaySearch.axsJAXObj.evalXPath(shippingXPath, resultRow)[0];

  var result = ' ';
  if (price) {
     result += price.textContent;
  } 
  
  if (shipping) {
     result += shipping.textContent;
  }
  
  return result;
};

axsEnableEbaySearch.getTimeRemaining = function(resultRow) {
  var timeRemainingXPath = './td[6]';
  var timeRemaining = axsEnableEbaySearch.axsJAXObj.evalXPath(timeRemainingXPath, resultRow)[0];
  var timeDetails = '';
  if (timeRemaining) {
    timeDetails = timeRemaining.textContent;
    timeDetails = timeDetails.replace(/w/g, " weeks ");
    timeDetails = timeDetails.replace(/d/g, " days ");
    timeDetails = timeDetails.replace(/h/g, " hours ");
    timeDetails = timeDetails.replace(/m/g, " minutes ");
    timeDetails = timeDetails.replace(/[^ ]s$/g, " seconds ");
  }
  
  return timeDetails;
}

/**
 * Handler for key events. 
 * @param {Object} evt A keypress event.
 * @return {boolean} If true, the event should be propagated.
 */
axsEnableEbaySearch.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsEnableEbaySearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsEnableEbaySearch.axsJAXObj.inputFocused) return true;

  var command = axsEnableEbaySearch.keyCodeMap[evt.keyCode] ||
                axsEnableEbaySearch.charCodeMap[evt.charCode];

  if (command) return command();

  return true;
};

/**
 * Map from key codes to functions
 */
axsEnableEbaySearch.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *                   that the keycode has been handled.
 */
axsEnableEbaySearch.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function() {
         axsEnableEbaySearch.magSize -= 0.10;
         axsEnableEbaySearch.axsLensObj.setMagnification(axsEnableEbaySearch.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsEnableEbaySearch.magSize += 0.10;
         axsEnableEbaySearch.axsLensObj.setMagnification(axsEnableEbaySearch.magSize);
         return false;
       },
  // / (slash symbol)
  47 : function() {
         document.getElementById('_nkw_id').focus();
         document.getElementById('_nkw_id').select();
         return false;
       },       
  // ? (question mark)
  63 : function() {
         var helpStr = axsEnableEbaySearch.HELP +
                       axsEnableEbaySearch.axsNavObj.localHelpString() +
                       axsEnableEbaySearch.axsNavObj.globalHelpString();
         axsEnableEbaySearch.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       }
};

axsEnableEbaySearch.init();
