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
 * of Amazon Search Results Web Page. 
 *
 * This is a first version of AxsJAX applied to the Amazon Search Results Web
 * Page. Just some areas of this web page were improved. Later versions will
 * cover and improve much more areas. I will appreciate any comment about this
 * script.
 *
 * @author fcanache@gmail.com (Fabio Canache)
 * 
 * @version 0.1
 */
// create namespace
var axsAmazonProductSearch = {};

//These are strings to be spoken to the user
axsAmazonProductSearch.HELP = 'The following shortcut keys are available. ';

axsAmazonProductSearch.AVERAGES_OUT_TO_STRING = ' averages out to ';
axsAmazonProductSearch.ACCEPTS_CHECKOUT_STRING = ' Accepts Google Checkout. ';
axsAmazonProductSearch.BUY_THIS_AT_STRING = ' Buy this at ';
axsAmazonProductSearch.BUY_THIS_STRING = ' Buy this ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsAmazonProductSearch.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsAmazonProductSearch.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsAmazonProductSearch.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsAmazonProductSearch.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsAmazonProductSearch.magSize = 1.5;

axsAmazonProductSearch.init = function() {
  axsAmazonProductSearch.axsJAXObj = new AxsJAX(true);
  axsAmazonProductSearch.axsNavObj = new AxsNav(axsAmazonProductSearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsAmazonProductSearch.keyHandler, true);
  
  var cnrString = "<cnr next='RIGHT l' prev='LEFT h'>" +
                  "  <list title='Search Results' next='j' prev='k' fwd='n' back='p'>" +
                  "    <item>" +
                  "      id('Results')//div[contains(@class,'result')]" +
                  "    </item>" +
                  "    <target title='Next page' trigger='listTail'>" +
                  "      id('pagnNextLink')" +
                  "    </target>" +
                  "    <target title='Previous page' trigger='listHead'>" +
                  "      id('pagnPrevLink')" + 
                  "    </target>	" +
                  "    <target title='Go to result' hotkey='ENTER'>" +
                  "      .//div[@class='productTitle']/a" +
                  "    </target>" +
                  "  </list>" +
                  "  <list title='Category List' next='DOWN j' prev='UP k'>" +
                  "    <item>" +
                  "      id('leftNavContainer')//li/a" +
                  "    </item>" +
                  "    <target title='Go to result' hotkey='ENTER'>" +
                  "      ." +
                  "    </target>" +
                  "  </list>" +
                  "  <list title='Recommendations' next='DOWN j' prev='UP k'>" +
                  "    <item>" +
                  "      id('footerRecs')//div/a/.." +
                  "    </item>" +
                  "    <target title='Go to result' hotkey='ENTER'>" +
                  "      ./a" +
                  "    </target>" +
                  "  </list>" +
                  "</cnr>";
  
  axsAmazonProductSearch.axsNavObj.navInit(cnrString, null);

  axsAmazonProductSearch.axsLensObj = new AxsLens(axsAmazonProductSearch.axsJAXObj);
  axsAmazonProductSearch.axsNavObj.setLens(axsAmazonProductSearch.axsLensObj);
  axsAmazonProductSearch.axsLensObj.setMagnification(axsAmazonProductSearch.magSize);
  axsAmazonProductSearch.axsSoundObj = new AxsSound(true);
  axsAmazonProductSearch.axsNavObj.setSound(axsAmazonProductSearch.axsSoundObj);
  
  window.setTimeout(axsAmazonProductSearch.readFirstResult, 500);
};

axsAmazonProductSearch.readFirstResult = function(){
  axsAmazonProductSearch.speakResult(axsAmazonProductSearch.axsNavObj.nextItem());
};

axsAmazonProductSearch.speakResult = function(item){
  var resultRow = item.elem;
  var title = axsAmazonProductSearch.getTitle(resultRow);
  var price = axsAmazonProductSearch.getPrice(resultRow);
  var ratings = axsAmazonProductSearch.getRatings(resultRow);
  
  var message = title + ". " + price + ". " + ratings ; 
  
  axsAmazonProductSearch.axsLensObj.view(resultRow);
  resultRow.scrollIntoView(true);
  axsAmazonProductSearch.axsJAXObj.speakTextViaNode(message);
};

axsAmazonProductSearch.getTitle = function(resultRow){
  var itemNumberXPath = "./table/tbody/tr/td[1]/span/text()";  
  var itemNumber = axsAmazonProductSearch.axsJAXObj.evalXPath(itemNumberXPath,resultRow)[0];
  
  var titleXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td/a/span/text()";  
  var title = axsAmazonProductSearch.axsJAXObj.evalXPath(titleXPath,resultRow)[0];

  var byXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td/text()[2]";  
  var by = axsAmazonProductSearch.axsJAXObj.evalXPath(byXPath,resultRow)[0];
  
  return itemNumber.textContent + " " + title.textContent + " " + by.textContent;
};

axsAmazonProductSearch.getPrice = function(resultRow){
  var newPriceXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span[3]/text()";
  var newPrice = axsAmazonProductSearch.axsJAXObj.evalXPath(newPriceXPath,resultRow)[0];
  
  var numberUsedNewXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span[4]/span/a/text()";
  var numberUsedNew = axsAmazonProductSearch.axsJAXObj.evalXPath(numberUsedNewXPath,resultRow)[0];
  
  var usedPriceXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span[4]/span/span/text()";
  var usedPrice = axsAmazonProductSearch.axsJAXObj.evalXPath(usedPriceXPath,resultRow)[0];
  
  return "Buy new for " + newPrice.textContent + " or check our list of  " + numberUsedNew.textContent + " from " + usedPrice.textContent;
};

axsAmazonProductSearch.getRatings = function(resultRow){
  var totalCustomersXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[5]/td/span/span/a[2]/text()";
  var totalCustomers = axsAmazonProductSearch.axsJAXObj.evalXPath(totalCustomersXPath,resultRow)[0];  
  
  var starXPath = "./table/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]/table/tbody/tr[5]/td/span/span/a[1]/img[contains(@alt,'star')]";
  var star = axsAmazonProductSearch.axsJAXObj.evalXPath(starXPath,resultRow)[0];
  
  return totalCustomers.textContent + " customers have rated this product with " + star.alt;
};

axsAmazonProductSearch.keyHandler = function(evt){  
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsAmazonProductSearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsAmazonProductSearch.axsJAXObj.inputFocused) return true;
  
  var command =  axsAmazonProductSearch.keyCodeMap[evt.keyCode] ||
                 axsAmazonProductSearch.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;  
};

axsAmazonProductSearch.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
  // (cursor up)     
  38 : function () {
         axsAmazonProductSearch.speakResult(axsAmazonProductSearch.axsNavObj.prevItem());
	 return true;
       },
  // (cursor down)     
  40 : function () {
         axsAmazonProductSearch.speakResult(axsAmazonProductSearch.axsNavObj.nextItem());
	 return true;
       }
};

axsAmazonProductSearch.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function () {
         axsAmazonProductSearch.magSize -= 0.10;
         axsAmazonProductSearch.axsLensObj.setMagnification(axsAmazonProductSearch.magSize);
	     return false;
       },
  // = (equal symbol) 	   
  61 : function () {
         axsAmazonProductSearch.magSize += 0.10;
         axsAmazonProductSearch.axsLensObj.setMagnification(axsAmazonProductSearch.magSize);
	     return false;
       },
  // ? (question mark)     
  63 : function () {
         var helpStr = axsAmazonProductSearch.HELP +
                       axsAmazonProductSearch.axsNavObj.localHelpString() +
					   axsAmazonProductSearch.axsNavObj.globalHelpString();
         axsAmazonProductSearch.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }
   
};

axsAmazonProductSearch.init();
