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
axsProductSearch.HELP = 'The following shortcut keys are available. ';

axsProductSearch.AVERAGES_OUT_TO_STRING = ' averages out to ';
axsProductSearch.ACCEPTS_CHECKOUT_STRING = ' Accepts Google Checkout. ';
axsProductSearch.BUY_THIS_AT_STRING = ' Buy this at ';
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
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsProductSearch.magSize = 1.5;

axsProductSearch.init = function(){
  axsProductSearch.axsJAXObj = new AxsJAX(true);
  axsProductSearch.axsNavObj = new AxsNav(axsProductSearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsProductSearch.keyHandler, true);
  
  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +
                  "<list title='Cycle Results' next='DOWN j' prev='UP k' fwd='n' back='p'>" +
                  "<item action='CALL:axsProductSearch.speakResult'>" +
                  "/html/body/table[3]/tbody/tr[not(@class)]" +
                  "</item>" +
                  "<target title='Next page' trigger='listTail'>" +
                  "//img[contains(@src,'nav_next.gif')]/.." +
                  "</target>" +
                  "<target title='Previous page' trigger='listHead'>" +
                  "//img[contains(@src,'G_oogle_arrow.gif')]/.." +
                  "</target>" +
                  "<target title='Go to result' hotkey='ENTER'>" +
                  "./td/a[not(*)]" +
                  "</target>" +
                  "</list>" +
                  "</cnr>";

  axsProductSearch.axsNavObj.navInit(cnrString, null);

  axsProductSearch.axsLensObj = new AxsLens(axsProductSearch.axsJAXObj);
  axsProductSearch.axsNavObj.setLens(axsProductSearch.axsLensObj);
  axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
  
  window.setTimeout(axsProductSearch.readFirstResult, 500);
};

axsProductSearch.readFirstResult = function(){
  axsProductSearch.speakResult(axsProductSearch.axsNavObj.nextItem());
};

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
				desc  + 				
				seller + '. ' +
				ratings +
				checkout;
  
  axsProductSearch.axsLensObj.view(resultRow);
  resultRow.scrollIntoView(true);
  axsProductSearch.axsJAXObj.speakTextViaNode(message);
};

axsProductSearch.getTitle = function(resultRow){
  var titleXPath = './td/a[text()]';  
  var title = axsProductSearch.axsJAXObj.evalXPath(titleXPath,resultRow)[0];
  return title.textContent;
};

axsProductSearch.getDesc = function(resultRow){
  var desc = axsProductSearch.axsJAXObj.evalXPath('.//font',resultRow)[0];
  var descText = '';
  if (!desc){
    desc = axsProductSearch.axsJAXObj.evalXPath(".//td[contains(@class,'ps-rcont')]",resultRow)[0];
  }
  for (var i=0, node; node = desc.childNodes[i]; i++){
    if ((node.nodeName == '#text') || (node.nodeName == 'B') || (node.nodeName == 'SPAN')){
	  descText = descText + node.textContent;
	}
  }
  	
  return descText;
};

axsProductSearch.getPrice = function(resultRow){
  var priceXPath = ".//b[contains(@class,'ps-larger-t')]";  
  var price = axsProductSearch.axsJAXObj.evalXPath(priceXPath,resultRow)[0];
  return price.textContent;
};

axsProductSearch.getSeller = function(resultRow){
  var sellerXPath = './/nobr/a';  
  var seller = axsProductSearch.axsJAXObj.evalXPath(sellerXPath,resultRow)[0];
  if (seller){    
	return axsProductSearch.BUY_THIS_AT_STRING + seller.textContent;
  } else {
    var xpath = ".//b[contains(@class,'ps-larger-t')]/../..";
	var priceArea = axsProductSearch.axsJAXObj.evalXPath(xpath,resultRow)[0];
	var storeCount = priceArea.childNodes[3];
	return axsProductSearch.BUY_THIS_STRING + storeCount.textContent;
  }
};

axsProductSearch.getRatings = function(resultRow){
  var starXPath = ".//nobr/a/img[contains(@src,'star')]";
  var star = axsProductSearch.axsJAXObj.evalXPath(starXPath,resultRow)[0];
  var ratedByXPath = ".//nobr/a[contains(text(),'ratings')]";
  var ratedBy = axsProductSearch.axsJAXObj.evalXPath(ratedByXPath,resultRow)[0];
  var ratings = '';
  if (star){
    ratings = ratedBy.textContent + axsProductSearch.AVERAGES_OUT_TO_STRING + star.alt + '. ';
  }
  return ratings;
};

axsProductSearch.getCheckout = function(resultRow){
  var checkoutXPath = ".//a[contains(@class,'checkout')]";
  var checkout = axsProductSearch.axsJAXObj.evalXPath(checkoutXPath,resultRow)[0];
  if (checkout){
    return axsProductSearch.ACCEPTS_CHECKOUT_STRING;
  }
  return '';
};


axsProductSearch.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsProductSearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsProductSearch.axsJAXObj.inputFocused) return true;
  
  var command =  axsProductSearch.keyCodeMap[evt.keyCode] ||
                 axsProductSearch.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;  
};

axsProductSearch.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

axsProductSearch.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  63 : function () {
         var helpStr = axsProductSearch.HELP +
                       axsProductSearch.axsNavObj.localHelpString() +
					   axsProductSearch.axsNavObj.globalHelpString();
         axsProductSearch.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }
};

axsProductSearch.init();
