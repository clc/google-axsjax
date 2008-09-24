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
 * you should do a global replace of "axsProductSearch" with 
 * "axsWhateverYourAppNameIs" and update this fileoverview.
 *
 * @author clchen@google.com (Charles L. Chen)
 */
// create namespace
var axsProductSearch = {};

//These are strings to be spoken to the user
/**
 * @type string
 */
axsProductSearch.HELP = 'The following shortcut keys are available. ';

/**
 * @type string
 */
axsProductSearch.AVERAGES_OUT_TO_STRING = ' averages out to ';
/**
 * @type string
 */
axsProductSearch.ACCEPTS_CHECKOUT_STRING = ' Accepts Google Checkout. ';
/**
 * @type string
 */
axsProductSearch.BUY_THIS_AT_STRING = ' Buy this at ';
/**
 * @type string
 */
axsProductSearch.BUY_THIS_STRING = ' Buy this ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsProductSearch.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsProductSearch.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsProductSearch.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsProductSearch.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsProductSearch.magSize = 1.5;

/**
 * Initializes the script.
 */
axsProductSearch.init = function(){
  axsProductSearch.axsJAXObj = new AxsJAX(true);
  axsProductSearch.axsNavObj = new AxsNav(axsProductSearch.axsJAXObj);

  axsProductSearch.formatAdAreaSide();

  //Add event listeners
  document.addEventListener('keypress', axsProductSearch.keyHandler, true);

  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p" hotkey="n">' +
                  '    <item>' +
                  '      /html/body/table[3]/tbody/tr[not(@class)]' +
                  '    </item>' +
                  '    <target title="Next page" trigger="listTail">' +
                  '      id("nn")/..' +
                  '    </target>' +
                  '    <target title="Previous page" trigger="listHead">' +
                  '      id("np")/..' +
                  '    </target>	' +
                  '    <target title="Go to result" hotkey="ENTER">' +
                  '      ./td[contains(@class,"ps-rcont")]//a' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Sponsored links" next="DOWN j" prev="UP k"' +
                  ' hotkey="a">' +
                  '    <item>' +
                  '      id("AXSJAX_SPONSOREDLINKS_SECTION")/span' +
                  '    </item>' +
                  '	<target title="Go to result" hotkey="ENTER">' +
                  '      .//a' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Refine by price" next="DOWN j" prev="UP k"' +
                  '>' +
                  '    <item>' +
                  '      id("attr-div")//a[contains(@href,"lnk=prsugg")]' +
                  '    </item>' +
                  '    <target title="Perform refinement" hotkey="ENTER">' +
                  '      .' +
                  '    </target>	' +
                  '	<target title = "Display prices" trigger="listEntry">' +
                  '	  id("attr-div")//a[contains(@href,"lnk=prsugg")]/../fol' +
                  'lowing-sibling::li[@class="nav"]/a[contains(text(),"More")' +
                  ']' +
                  '	</target>' +
                  '  </list>  ' +
                  '  <list title="Refine by brand" next="DOWN j" prev="UP k"' +
                  '>' +
                  '    <item>' +
                  '      id("attr-div")//a[contains(@href,"lnk=brsugg")]' +
                  '    </item>' +
                  '    <target title="Perform refinement" hotkey="ENTER">' +
                  '      .' +
                  '    </target>' +
                  '	<target title = "Display brands" trigger="listEntry">' +
                  '	  id("attr-div")//a[contains(@href,"lnk=brsugg")]/../fol' +
                  'lowing-sibling::li[@class="nav"]/a[contains(text(),"More")' +
                  ']' +
                  '	</target>' +
                  '  </list>  ' +
                  '  <list title="Refine by store" next="DOWN j" prev="UP k"' +
                  '>' +
                  '    <item>' +
                  '      id("attr-div")//a[contains(@href,"lnk=storesugg")]' +
                  '    </item>' +
                  '    <target title="Perform refinement" hotkey="ENTER">' +
                  '      .' +
                  '    </target>' +
                  '	<target title = "Display stores" trigger="listEntry">' +
                  '	  id("attr-div")//a[contains(@href,"lnk=storesugg")]/../' +
                  'following-sibling::li[@class="nav"]/a[contains(text(),"Mor' +
                  'e")]' +
                  '	</target>' +
                  '  </list>  ' +
                  '  <list title="Refine by merchant rating" next="DOWN j" p' +
                  'rev="UP k">' +
                  '    <item>' +
                  '      id("attr-div")//a[contains(@href,"lnk=merchant_revi' +
                  'ew")]' +
                  '    </item>' +
                  '    <target title="Perform refinement" hotkey="ENTER">' +
                  '      .' +
                  '    </target>' +
                  '	<target title = "Display merchant rating" trigger="listE' +
                  'ntry">' +
                  '	  id("attr-div")//a[contains(@href,"lnk=merchant_review"' +
                  ')]/../following-sibling::li[@class="nav"]/a[contains(text(' +
                  '),"More")]' +
                  '	</target>' +
                  '  </list>  ' +
                  '  <list title="Refine by related searches" next="DOWN j" ' +
                  'prev="UP k">' +
                  '    <item>' +
                  '      id("attr-div")//a[contains(@href,"lnk=qsugt")]' +
                  '    </item>' +
                  '    <target title="Perform refinement" hotkey="ENTER">' +
                  '      .' +
                  '    </target>' +
                  '	<target title = "Display related searches" trigger="list' +
                  'Entry">' +
                  '	  id("attr-div")//a[contains(@href,"lnk=qsugt")]/../foll' +
                  'owing-sibling::li[@class="nav"]/a[contains(text(),"More")]' +
                  '	</target>' +
                  '  </list>  ' +
                  '</cnr>';

  axsProductSearch.axsNavObj.navInit(cnrString, null);

  axsProductSearch.axsLensObj = new AxsLens(axsProductSearch.axsJAXObj);
  axsProductSearch.axsNavObj.setLens(axsProductSearch.axsLensObj);
  axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
  axsProductSearch.axsSoundObj = new AxsSound(true);
  axsProductSearch.axsNavObj.setSound(axsProductSearch.axsSoundObj);

  window.setTimeout(axsProductSearch.readFirstResult, 500);
};

/**
 * Reads the first result on the page when it is first loaded.
 */
axsProductSearch.readFirstResult = function(){
  axsProductSearch.speakResult(axsProductSearch.axsNavObj.nextItem());
};

/**
 * Speaks the given CNR item in an intelligent way by reformatting 
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result.
 */
axsProductSearch.speakResult = function(item){
  var resultRow = item.elem;
  var title = axsProductSearch.getTitle(resultRow);
  var desc = axsProductSearch.getDesc(resultRow);
  var price = axsProductSearch.getPrice(resultRow);
  var seller = axsProductSearch.getSeller(resultRow);
  var ratings = axsProductSearch.getRatings(resultRow);
  var checkout = axsProductSearch.getCheckout(resultRow);

  var message = title + '. ' +
                price + '. ' +
                desc +
                seller + '. ' +
                ratings +
                checkout;

  axsProductSearch.axsLensObj.view(resultRow);
  resultRow.scrollIntoView(true);
  axsProductSearch.axsJAXObj.speakTextViaNode(message);
};

/**
 * Given a results row, returns the title of the product.
 * @param {Node} resultRow The row that contains the result.
 * @return {string} The title.
 */
axsProductSearch.getTitle = function(resultRow){
  var titleXPath = './/h2/a';
  var title = axsProductSearch.axsJAXObj.evalXPath(titleXPath, resultRow)[0];
  return title.textContent;
};

/**
 * Given a results row, returns the description of the product.
 * @param {Node} resultRow The row that contains the result.
 * @return {string} The description.
 */
axsProductSearch.getDesc = function(resultRow){
  var desc = axsProductSearch.axsJAXObj.evalXPath('.//font', resultRow)[0];
  var descText = '';
  if (!desc){
    var xpath = ".//td[contains(@class,'ps-rcont')]";
    desc = axsProductSearch.axsJAXObj.evalXPath(xpath, resultRow)[0];
  }
  for (var i = 0, node; node = desc.childNodes[i]; i++){
    if ((node.nodeName == '#text') ||
        (node.nodeName == 'B') ||
        (node.nodeName == 'SPAN')){
      descText = descText + node.textContent;
    }
  }

  return descText;
};

/**
 * Given a results row, returns the price of the product.
 * @param {Node} resultRow The row that contains the result.
 * @return {string} The price.
 */
axsProductSearch.getPrice = function(resultRow){
  var priceXPath = ".//b[contains(@class,'ps-larger-t')]";
  var price = axsProductSearch.axsJAXObj.evalXPath(priceXPath, resultRow)[0];
  return price.textContent;
};

/**
 * Given a results row, generates a string states either how many stores 
 * are selling this product or the one store that is selling it. Which string
 * gets generated depends on what is there.
 * @param {Node} resultRow The row that contains the result.
 * @return {string} The seller information.
 */
axsProductSearch.getSeller = function(resultRow){
  var sellerXPath = './/nobr/a';
  var seller = axsProductSearch.axsJAXObj.evalXPath(sellerXPath, resultRow)[0];
  if (seller){
    return axsProductSearch.BUY_THIS_AT_STRING + seller.textContent;
  } else {
    var xpath = ".//b[contains(@class,'ps-larger-t')]/../..";
    var priceArea = axsProductSearch.axsJAXObj.evalXPath(xpath, resultRow)[0];
    var storeCount = priceArea.childNodes[3];
    return axsProductSearch.BUY_THIS_STRING + storeCount.textContent;
  }
};

/**
 * Given a results row, generates a string that states the number of ratings 
 * and the average rating.
 * @param {Node} resultRow The row that contains the result.
 * @return {string} The number of raters and the averaged rating.
 */
axsProductSearch.getRatings = function(resultRow){
  var starXP = ".//nobr/a/img[contains(@src,'star')]";
  var star = axsProductSearch.axsJAXObj.evalXPath(starXP, resultRow)[0];
  var ratedByXP = ".//nobr/a[contains(text(),'ratings')]";
  var ratedBy = axsProductSearch.axsJAXObj.evalXPath(ratedByXP, resultRow)[0];
  var ratings = '';
  if (star){
    ratings = ratedBy.textContent +
              axsProductSearch.AVERAGES_OUT_TO_STRING +
              star.alt +
              '. ';
  }
  return ratings;
};

/**
 * Given a results row, generates a string that says Google Checkout is 
 * available if it is available.
 * @param {Node} resultRow The row that contains the result.
 * @return {string?} Returns the ACCEPTS_CHECKOUT_STRING if checkout is 
 *                   accepted; otherwise, returns an empty string.
 */
axsProductSearch.getCheckout = function(resultRow){
  var xpath = ".//a[contains(@class,'checkout')]";
  var checkout = axsProductSearch.axsJAXObj.evalXPath(xpath, resultRow)[0];
  if (checkout){
    return axsProductSearch.ACCEPTS_CHECKOUT_STRING;
  }
  return '';
};



/**
 * Formats the sponsored links section on the right of the search results.
 * The Ads area on the right side is inside one big FONT tag.
 * There is no structure that groups the individual ads.
 * Add this structure to make it possible to speak these ads individually.
 */
axsProductSearch.formatAdAreaSide = function(){
  //This is the FONT tag that contains all the ads
  var xpath = '//font[@class="s"]/..';
  var adArea = axsProductSearch.axsJAXObj.evalXPath(xpath, document.body)[0];
  if (!adArea){
    return;
  }

  xpath = '//font[@class="s"]/../font';
  var adAreaElems = axsProductSearch.axsJAXObj.evalXPath(xpath, document.body);
  var adElemCount = adAreaElems.length;
  var adCount = adElemCount / 3;
  //This formatting function assumes the font elements will come in sets of 3.
  //If this is not true, then the formatter will not work, so it should just 
  //give up.
  if ((adAreaElems.length % 3) != 0){
    return;
  }
  var reformattedAds = new Array();
  var i = 0;
  var brElem = window.content.document.createElement('br');
  for (i = 0; i < adElemCount; i = i + 3){
    var adSpan = window.content.document.createElement('span');
    adSpan.appendChild(adAreaElems[i].cloneNode(true));
    adSpan.appendChild(brElem.cloneNode(true));
    adSpan.appendChild(adAreaElems[i + 1].cloneNode(true));
    adSpan.appendChild(brElem.cloneNode(true));
    adSpan.appendChild(adAreaElems[i + 2].cloneNode(true));
    adSpan.appendChild(brElem.cloneNode(true));
    adSpan.appendChild(brElem.cloneNode(true));
    reformattedAds.push(adSpan);
  }

  while (adArea.firstChild){
    adArea.removeChild(adArea.firstChild);
  }

  for (i = 0; i < adCount; i++){
    adArea.appendChild(reformattedAds[i]);
  }

  adArea.id = 'AXSJAX_SPONSOREDLINKS_SECTION';
};


/**
 * Provides keyboard handling
 * @param {Object} evt A keypress event.
 * @return {boolean} Indicates whether the keypress was handled.
 */
axsProductSearch.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsProductSearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsProductSearch.axsJAXObj.inputFocused) return true;

  var command = axsProductSearch.keyCodeMap[evt.keyCode] ||
                axsProductSearch.charCodeMap[evt.charCode];

  if (command) return command();
  return true;
};

/**
 * Map from key codes to functions
 */
axsProductSearch.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *                   that the keycode has been handled.
 */
axsProductSearch.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
  47 : function() {
         document.getElementsByName('q')[0].focus();
         document.getElementsByName('q')[0].select();
         return false;
       },
  // - (minus symbol)
  45 : function() {
         axsProductSearch.magSize -= 0.10;
         axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsProductSearch.magSize += 0.10;
         axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
         return false;
       },
  // ? (question mark)
  63 : function() {
         var helpStr = axsProductSearch.HELP +
                       axsProductSearch.axsNavObj.localHelpString() +
                       axsProductSearch.axsNavObj.globalHelpString();
         axsProductSearch.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       }
};

window.addEventListener('load', axsProductSearch.init, true);
