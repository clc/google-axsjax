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
 * @fileoverview AxsJAX to enhance the accessibility of the Craigslist Home page.
 *
 * URL: http://www.craigslist.org/about/sites
 *
 * @author borislav.ganov@gmail.com (Borislav R. Ganov)
 */
// create namespace
var axsCraigsList = {};

/**
 * String constants
 */
axsCraigsList.str = {
  ENTER_LOCATION : 'Please select a location'
};

/**
 * These are strings to be spoken to the user
 * @type string
 */
axsCraigsList.HELP = 'The following shortcut keys are available. '

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsCraigsList.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsCraigsList.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsCraigsList.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsCraigsList.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsCraigsList.magSize = 1.5;

/**
 * The PowerKey object that will provide a quick search
 * @type PowerKey?
 */
axsCraigsList.pkResultSearchObj = null;

/**
 * The PowerKey object used by the AxsNavObj.
 * @type PowerKey?
 */
axsCraigsList.powerKeyObj = null;

/**
 * CNR
 */
axsCraigsList.cnrString = '<cnr next="RIGHT l" prev="LEFT h"> ' +

                    '<target title="Go to link" hotkey="ENTER" ' +
                    '   onEmpty="No link available">' +
                    '    ./descendant-or-self::a' +
                    '</target>' +

                    '<target title="Help Pages" hotkey="H"> ' +
                    '//a[@href="/about/help/"]' +
                    '</target>' +

                    '<target title="Login" hotkey="L"> ' +
                    '//a[@href="https://accounts.craigslist.org/"]' +
                    '</target>' +

                    '<target title="FactSheet" hotkey="F"> ' +
                    '//a[@href="/about/factsheet"]' +
                    '</target>' +

                    '<target title="Avoid Scams" hotkey="A"> ' +
                    '//a[@href="/about/scams"]' +
                    '</target>' +

                    '<target title="Your Safety" hotkey="Y"> ' +
                    '//a[@href="/about/safety"]' +
                    '</target>' +

                    '<target title="Best-ofs" hotkey="B"> ' +
                    '//a[@href="/about/best/all/"]' +
                    '</target>' +

                    '<target title="Job Boards" hotkey="J"> ' +
                    '//a[@href="/about/job_boards_compared"]' +
                    '</target>' +

                    '<target title="Movie" hotkey="M"> ' +
                    '//a[@href="http://24hoursoncraigslist.com/subs/nowplaying.html"]' +
                    '</target>' +

                    '<target title="Tshirts" hotkey="T"> ' +
                    '//a[@href="http://www.craigslistfoundation.org/index.php?page=Craigslist_Foundation_Store"]' +
                    '</target>' +

                    '<target title="Foundation" hotkey="F"> ' +
                    '//a[@href="http://www.craigslistfoundation.org/"]' +
                    '</target>' +

                    '<target title="Net Neutrality" hotkey="N"> ' +
                    '//a[@href="http://savetheinternet.com/=faq"]' +
                    '</target>' +

                    '<target title="System Status" hotkey="S"> ' +
                    '//a[@href="/about/help/system-status.html"]' +
                    '</target>' +

                    '<target title="Terms Of Use" hotkey="U"> ' +
                    '//a[@href="/about/terms.of.use"]' +
                    '</target>' +

                    '<target title="Privacy" hotkey="P"> ' +
                    '//a[@href="/about/privacy"]' +
                    '</target>' +

                    '<target title="About Us" hotkey="`"> ' +
                    '//a[@href="/about/"]' +
                    '</target>' +

                    '<target title="Search Locations" hotkey="/" ' +
                    ' action="CALL:axsCraigsList.showSearchBox">' +
                    '/html' +
                    '</target>' +

                    '<list title="Craigslist Info Links" next="DOWN j" prev=' +
                    '"UP k" fwd="n" back="p" >' +
                    '    <item>' +
                    '        //table[@class="wwl"]//a' +
                    '    </item>' +
                    '</list>' +

                    '<list title="US Cities" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" >' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[2]//a ' +
                    '    </item>' +
                    '</list>' +

                    '<list title="United States" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[3]//a |' +
                    '        //table[@class="www"]//tr[2]/td[4]//a ' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Canada" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[5]/a' +
                    '[following-sibling::b[text()="ca cities"]]' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Canada Cities" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[5]/a[prece' +
                    'ding-sibling::b[text()="ca cities"] and following-sib' +
                    'ling::p/b[text()="au/nz"]] ' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Australia and New Zealand" next="DOWN j" ' +
                    'prev="UP k" fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[5]/p/a' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Asia" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[6]/a' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Americas" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[6]/p/a' +
                    '    </item>' +
                    '</list>' +

                    '<list title="Europe" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[7]/a' +
                    '[following-sibling::b[text()="africa"]] ' +
                    '    </item>' +
                    '</list>' +

                    '<list title="africa" next="DOWN j" prev="UP k" ' +
                    '    fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[7]/a' +
                    '[preceding-sibling::b[text()="africa"]] ' +
                    '    </item>' +
                    '</list>' +

                    '<list title="International Cities" next="DOWN j" ' +
                    'prev="UP k" fwd="n" back="p" > ' +
                    '    <item>' +
                    '        //table[@class="www"]//tr[2]/td[8]/a' +
                    '    </item>' +
                    '</list>' +

                    '</cnr>';

/**
 * Initializes the AxsJAX script.
 */
axsCraigsList.init = function(){
  //Initialize AxsJAX
  axsCraigsList.axsJAXObj = new AxsJAX(true);

  //Initialize AxsLens
  axsCraigsList.axsLensObj = new AxsLens(axsCraigsList.axsJAXObj);
  axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);

  //Initialize AxsSound
  axsCraigsList.axsSoundObj = new AxsSound(true);

  //Initialize AxsNav
  axsCraigsList.axsNavObj = new AxsNav(axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.navInit(axsCraigsList.cnrString, null);
  axsCraigsList.axsNavObj.setLens(axsCraigsList.axsLensObj);
  axsCraigsList.axsNavObj.setSound(axsCraigsList.axsSoundObj);

  //Initialize AxsNav's PowerKey object
  axsCraigsList.powerKeyObj = new PowerKey('list', axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.setPowerKey(axsCraigsList.powerKeyObj, '.');

  //Search PowerKey object
  axsCraigsList.pkResultSearchObj = new PowerKey('list',
                                                 axsCraigsList.axsJAXObj);
  var completionPromptStr = axsCraigsList.str.ENTER_LOCATION;
  axsCraigsList.pkResultSearchObj.setCompletionPromptStr(completionPromptStr);
  axsCraigsList.pkResultSearchObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  var handler = axsCraigsList.searchPowerKeyHandler;
  var completionStrings = axsCraigsList.getSearchBoxCompletionStrings();
  axsCraigsList.pkResultSearchObj.createCompletionField(document.body,
                                                        30,
                                                        handler,
                                                        null,
                                                        completionStrings,
                                                        false);

  //Add event listeners
  document.addEventListener('keypress', axsCraigsList.keyHandler, true);
 };

  /**
   * Handler for processing the result of a PowerKey search.
   * @param {string?} command The selected string.
   * @param {number} index The index in the completion list of selected item.
   * @param {string?} id The id of the selected item.
   * @param {Array?} args Arguments for the function mapped to the selected 
   * item.
   * (if such a function is defined).
   */
  axsCraigsList.searchPowerKeyHandler = function(command, index, id, args) {
       var xPath = '//a[text() = "' + command + '"]';
       var link = axsCraigsList.axsJAXObj.evalXPath(xPath, document.body)[0];
       axsCraigsList.axsJAXObj.clickElem(link, false);
  };

  /**
   * Returns a list of all countries and cities searched with PowerKey.
   * @return {Array} The array of all topics.
   */
  axsCraigsList.getSearchBoxCompletionStrings = function() {
    var completionStrings = new Array();
    var lists = axsCraigsList.axsNavObj.navArray;

    for (var i = 1, list; list = lists[i]; i++){
      for (var j = 0, item; item = list.items[j]; j++) {
        completionStrings.push(item.elem.textContent);
      }
    }
    return completionStrings;
  };

  /**
   * Callback handler for showing a search box.
   * @param {Object?} item DOM node wrapper.
   */
  axsCraigsList.showSearchBox = function(item) {
    axsCraigsList.pkResultSearchObj.updateCompletionField('visible',
                                                          true,
                                                          40,
                                                          20);
  };

  /**
   * Handler for key events.
   * @param {Object} evt A keypress event.
   * @return {boolean} If true, the event should be propagated.
   */
  axsCraigsList.keyHandler = function(evt) {
    //If Ctrl is held, it must be for some AT.
    if (evt.ctrlKey) return true;

    if (evt.keyCode == 27) { // ESC
      axsCraigsList.axsJAXObj.lastFocusedNode.blur();
      return false;
    }

    if (axsCraigsList.axsJAXObj.inputFocused) return true;

    var command = axsCraigsList.keyCodeMap[evt.keyCode] ||
                  axsCraigsList.charCodeMap[evt.charCode];

    if (command) return command();

    return true;
  };

/**
 * Handler for key events.
 * @param {Object} evt A keypress event.
 * @return {boolean} If true, the event should be propagated.
 */
axsCraigsList.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsCraigsList.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsCraigsList.axsJAXObj.inputFocused) return true;

  var command = axsCraigsList.keyCodeMap[evt.keyCode] ||
                axsCraigsList.charCodeMap[evt.charCode];

  if (command) return command();

  return true;
};

/**
 * Map from key codes to functions
 */
axsCraigsList.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate
 *                   that the keycode has been handled.
 */
axsCraigsList.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function() {
         axsCraigsList.magSize -= 0.10;
         axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsCraigsList.magSize += 0.10;
         axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);
         return false;
       },
  // ? (question mark)
  63 : function() {
         var helpStr = axsCraigsList.HELP +
                       axsCraigsList.axsNavObj.localHelpString() +
                       axsCraigsList.axsNavObj.globalHelpString();
         axsCraigsList.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       }
};

// Run the script
axsCraigsList.init();
