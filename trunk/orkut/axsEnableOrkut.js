// Copyright 2007 Google IncList.
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
 * of orkut.com.
 *
 * @author reema@google.com (Reema Sardana)
 */
// create namespace
var axsOrkut = {};

//These are strings to be spoken to the user
axsOrkut.HELP_STRING = 'The following shortcut keys are available. ' +
  's, to go to the search bar. ' +
  'b, to go to the scrapbook. ' +
  'w, to go to the scrap text box and ' +
  'Escape plus z to post it. ' +
  'c, to go to the community list. ' +
  'e, to edit the status and Escape plus u to update it or ' +
  'Escape plus x to cancel the update. ' +
  't, to go to the testimonials. ' +
  'v, to view all topics in a thread in the community. ' +
  'l to logout.';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsOrkut.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsOrkut.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsOrkut.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsOrkut.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsOrkut.magSize = 1.5;

axsOrkut.init = function(){
  axsOrkut.axsJAXObj = new AxsJAX(true);
  axsOrkut.axsNavObj = new AxsNav(axsOrkut.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsOrkut.keyHandler, true);

  var cnrString = '<cnr>' +
                  '  <list title="Cycle through results" next="DOWN j" prev=' +
                  '"UP k">' +
                  '    <item>' +
                  '     /html/body/div[5]/form/div[3]/table[2]/tbody/tr/td/d' +
                  'iv/div/h3/a' +
                  '    </item>' +
                  '    <target title="Next page" trigger="listTail">' +
                  '      /html/body/div[5]/form/div[3]/table[2]/tbody/tr/td/' +
                  'div/span/a[contains(., "next")]' +
                  '    </target>' +
                  '    <target title="Previous page" trigger="listHead">' +
                  '      /html/body/div[5]/form/div[3]/table[2]/tbody/tr/td/' +
                  'div[6]/span/a[contains(., "previous")]' +
                  '    </target>' +
                  '    <target title="Go to result" hotkey="ENTER">' +
                  '      .' +
                  '    </target>' +
                  '  </list>' +
                  '' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item action="CALL:axsOrkut.readTestimonial">' +
                  '      /html/body/div[5]/div[3]/table/tbody/tr[2]/td[@clas' +
                  's="boxmidlrg"]/div[@class="listitem"]' +
                  '    </item>' +
                  '    <target title="Delete testimonial" hotkey="d">' +
                  '      .//a[contains(@onclick, "_submitForm")]' +
                  '    </target>' +
                  '  </list>' +
                  '' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item action="CALL:axsOrkut.readSearchResult">' +
                  '      id("mbox")//div[@class="listitem"]' +
                  '    </item>' +
                  '  </list>' +
                  '' +
                  '  <list title="Cycle through posts" next="DOWN j" prev="U' +
                  'Pk" fwd="n" back="p">' +
                  '    <item action="CALL:axsOrkut.readTopic">' +
                  '      id("mboxfull")//tr[contains(@class, "list")]' +
                  '    </item>' +
                  '    <target title="Go to thread" hotkey="ENTER">' +
                  '      .//a[contains(@href, "CommMsgs.aspx")]' +
                  '    </target>' +
                  '  </list>' +
                  '' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item action="CALL:axsOrkut.readScrap">' +
                  '      id("mboxfull")//div[contains(@class, "listitemchk")' +
                  ']' +
                  '    </item>' +
                  '    <target title="Delete scrap" hotkey="d">' +
                  '      ./span/span/a' +
                  '    </target>' +
                  '    <target title="Reply to this scrap" hotkey="r">' +
                  '      ./*/*/*[@class="rbs"]' +
                  '    </target>' +
                  '    <target title="Post scrap" hotkey="p">' +
                  '      .//a[contains(@onclick, "ReplySubmit")]' +
                  '    </target>' +
                  '    <target title="Cancel" hotkey="x">' +
                  '      .//a[contains(@onclick, "ReplyCloseAll")]' +
                  '    </target>' +
                  '  </list>' +
                  '' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item action="CALL:axsOrkut.readCommunity">' +
                  '      id("subPage0")//tbody/tr' +
                  '    </item>' +
                  '    <target title="Go to community" hotkey="ENTER">' +
                  '      .//a[contains(@href, "Community.aspx")]' +
                  '    </target>' +
                  '  </list>' +
                  '' +
                  '  <target title="Home" hotkey="h" onEmpty="Home is not av' +
                  'ailable">' +
                  '    id("headerin")//a[contains(@href, "Home.aspx")]' +
                  '  </target>' +
                  '  <target title="Scrapbook" hotkey="b" onEmpty="Scrapbook' +
                  ' is not available">' +
                  '    id("lbox")//a[contains(@href, "Scrapbook.aspx")]' +
                  '  </target>' +
                  '  <target title="Testimonials" hotkey="t" onEmpty="Testim' +
                  'onials are not available">' +
                  '    id("lbox")//a[contains(@href, "ProfileT.aspx")]' +
                  '  </target>' +
                  '  <target title="Communities" hotkey="c" onEmpty="Communi' +
                  'ties are not available">' +
                  '    id("headerin")//a[contains(@href, "Communities.aspx")' +
                  ']' +
                  '  </target>' +
                  '  <target title="Friends" hotkey="f" onEmpty="Friends are' +
                  ' not available">' +
                  '    id("headerin")//a[contains(@href, "Friends.aspx")]' +
                  '  </target>' +
                  '  <target title="Logout" hotkey="l" onEmpty="Logout butto' +
                  'n is not available">' +
                  '    id("headerin")//a[contains(@href, "GLogin.aspx")]' +
                  '  </target>' +
                  '  <target title="Edit status" hotkey="e" onEmpty="Edit bu' +
                  'tton is not available">' +
                  '    id("sm_edbtn")//a[contains(@onclick, "edit")]' +
                  '  </target>' +
                  '  <target title="Update status" hotkey="u" onEmpty="Updat' +
                  'e button is not available">' +
                  '    id("sm_sbtns")//a[contains(@onclick, "submit")]' +
                  '  </target>' +
                  '  <target title="Cancel update" hotkey="x" onEmpty="Cance' +
                  'l button is not available">' +
                  '    id("sm_sbtns")//a[contains(@onclick, "reset")]' +
                  '  </target>' +
                  '  <target title="Next page" hotkey="PGDOWN">' +
                  '    /html/body/div[5]/form/div[3]/table[2]/tbody/tr/td/di' +
                  'v/span/a[contains(., "next")]' +
                  '  </target>' +
                  '  <target title="Previous page" hotkey="PGUP">' +
                  '    /html/body/div[5]/form/div[3]/table[2]/tbody/tr/td/di' +
                  'v[6]/span/a[contains(., "previous")]' +
                  '  </target>' +
                  '  <target title="Post scrap" hotkey="z">' +
                  '    id("scrapInputContainer")//a[contains(@onclick, "writ' +
                  'e")]' +
                  '  </target>' +
                  '  <target title="View all topics" hotkey="v">' +
                  '    id("mbox")//a[contains(@href, "CommTopics.aspx")]' +
                  '  </target>' +
                  '</cnr>' +
                  '' +
                  '';

  axsOrkut.axsNavObj.navInit(cnrString, null);
  axsOrkut.axsLensObj = new AxsLens(axsOrkut.axsJAXObj);
  axsOrkut.axsNavObj.setLens(axsOrkut.axsLensObj);
  axsOrkut.axsLensObj.setMagnification(axsOrkut.magSize);
  axsOrkut.axsSoundObj = new AxsSound(true);
  axsOrkut.axsNavObj.setSound(axsOrkut.axsSoundObj);
};

//-------------------------------------------------------------------------
// Functions to read the scrapbook in a more intelligent way
//-------------------------------------------------------------------------

/**
 * Speaks the given CNR item in an intelligent way by reformatting
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result
 */
axsOrkut.readScrap = function(item) {
  if (item) {
    var resultRow = item.elem;
    var scrap = axsOrkut.getScrap(resultRow);
    var author = axsOrkut.getAuthor(resultRow);
    var when = axsOrkut.getWhen(resultRow);

    var message = author + ' says ' + scrap + ' at ' + when + '. Press' +
                  ' d to delete this scrap, r to reply, and then' +
                  ' escape plus p to post it or escape plus c to cancel';
    axsOrkut.focusAndRead(resultRow, message);
  }
};

/**
 * Given a results row, returns the scrap.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The scrap
 */
axsOrkut.getScrap = function(resultRow) {
  var scrapXPath = './div';
  var scrap = axsOrkut.axsJAXObj.evalXPath(scrapXPath, resultRow)[0];
  return scrap.childNodes[0].textContent;
};

/**
 * Given a results row, returns the author.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The author
 */
axsOrkut.getAuthor = function(resultRow) {
  var authorXPath = './h3/a';
  var author = axsOrkut.axsJAXObj.evalXPath(authorXPath, resultRow)[0];
  return author.textContent;
};

/**
 * Given a results row, returns the time.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The time
 */
axsOrkut.getWhen = function(resultRow) {
  var whenXPath = './span[contains(@class, "rfdte") and contains(., "ago")]';
  var when = axsOrkut.axsJAXObj.evalXPath(whenXPath, resultRow)[0];
  return when.textContent;
};


//-------------------------------------------------------------------------
// Functions to read the testimonials in a more intelligent way
//-------------------------------------------------------------------------

/**
 * Speaks the given CNR item in an intelligent way by reformatting
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result
 */
axsOrkut.readTestimonial = function(item) {
  if (item) {
    var resultRow = item.elem;
    var testimonial = axsOrkut.getTestimonial(resultRow);
    var author = axsOrkut.getTestimonialAuthor(resultRow);
    var when = axsOrkut.getDate(resultRow);

    var message = author + ' says ' + testimonial + ' at ' + when +
                  '. Press d to delete this testimonial.';
    axsOrkut.focusAndRead(resultRow, message);
  }
};

/**
 * Given a results row, returns the testimonial.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The testimonial
 */
axsOrkut.getTestimonial = function(resultRow) {
  var tesXPath = './div';
  var testimonial = '';
  var tes = axsOrkut.axsJAXObj.evalXPath(tesXPath, resultRow)[0];
  for (var i = 6; i < tes.childNodes.length; i++) {
    testimonial += tes.childNodes[i].textContent;
  }
  return testimonial;
};

/**
 * Given a results row, returns the author.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The author
 */
axsOrkut.getTestimonialAuthor = function(resultRow) {
  var authorXPath = './div/b/a';
  var author = axsOrkut.axsJAXObj.evalXPath(authorXPath, resultRow)[0];
  return author.textContent;
};

/**
 * Given a results row, returns the time.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The time
 */
axsOrkut.getDate = function(resultRow) {
  var whenXPath = './div/span[2]';
  var when = axsOrkut.axsJAXObj.evalXPath(whenXPath, resultRow)[0];
  return when.textContent;
};

//-------------------------------------------------------------------------
// Functions to read the community list in a more intelligent way
//-------------------------------------------------------------------------

/**
 * Speaks the given CNR item in an intelligent way by reformatting
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result
 */
axsOrkut.readCommunity = function(item) {
  if (item) {
    var resultRow = item.elem;
    var community = axsOrkut.getCommunityName(resultRow);
    var numMem = axsOrkut.getNumMembers(resultRow);

    var message = community + ' has ' + numMem + ' members';
    axsOrkut.focusAndRead(resultRow, message);
  }
};

/**
 * Given a results row, returns the community name.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The Community name
 */
axsOrkut.getCommunityName = function(resultRow) {
  var comXPath = './td';
  var com = axsOrkut.axsJAXObj.evalXPath(comXPath, resultRow)[0];
  return com.textContent;
};

/**
 * Given a results row, returns the number of memebers in a community.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The number of members
 */
axsOrkut.getNumMembers = function(resultRow) {
  var numMemXPath = './td';
  var numMem = axsOrkut.axsJAXObj.evalXPath(numMemXPath, resultRow)[2];
  return numMem.textContent;
};

//-------------------------------------------------------------------------
// Functions to read the search results in a more intelligent way
//-------------------------------------------------------------------------

/**
 * Speaks the given CNR item in an intelligent way by reformatting
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result
 */
axsOrkut.readSearchResult = function(item) {
  if (item) {
    var resultRow = item.elem;
    var name = axsOrkut.getResultName(resultRow);
    var type = axsOrkut.getResultType(resultRow);
    var detail = axsOrkut.getResultDetail(resultRow);

    var message = name + ' is a  ' + type + ' from ' + detail;
    axsOrkut.focusAndRead(resultRow, message);
  }
};

/**
 * Given a results row, returns the result (community / user) name.
 * @param {Node} resultRow The row that contains the result
 * @return {string} name
 */
axsOrkut.getResultName = function(resultRow) {
  var nameXPath = './/a[contains(@href, "ClickTracker.aspx")]';
  var name = axsOrkut.axsJAXObj.evalXPath(nameXPath, resultRow)[1];
  return name.textContent;
};

/**
 * Given a results row, returns the result (community / user) type.
 * @param {Node} resultRow The row that contains the result
 * @return {string} type - friend, friend of friend, community, user etc
 */
axsOrkut.getResultType = function(resultRow) {
  var typeXPath = './div[contains(@class, "searchunivlabel")]';
  var type = axsOrkut.axsJAXObj.evalXPath(typeXPath, resultRow)[0];
  return type.textContent;
};

/**
 * Given a results row, returns the result (community / user) details.
 * @param {Node} resultRow The row that contains the result
 * @return {string} detail - Location, Category etc
 */
axsOrkut.getResultDetail = function(resultRow) {
  var detailXPath = './span';
  var detailNodes = axsOrkut.axsJAXObj.evalXPath(detailXPath, resultRow);
  var detail = '';
  for (var i = 0; i < detailNodes.length; i++) {
    detail += detailNodes[i].textContent + ' ';
  }
  return detail;
};

//-------------------------------------------------------------------------
// Functions to read the community post topic list in a more intelligent way
//-------------------------------------------------------------------------

/**
 * Speaks the given CNR item in an intelligent way by reformatting
 * the text for spoken output.
 * @param {Object} item The CNR item which is a result
 */
axsOrkut.readTopic = function(item) {
  if (item) {
    var resultRow = item.elem;
    var name = axsOrkut.getTopicName(resultRow);
    var author = axsOrkut.getTopicAuthor(resultRow);
    var numPosts = axsOrkut.getNumPosts(resultRow);
    var lastPost = axsOrkut.getLastPost(resultRow);

    var message = name + ' by ' + author + ' has ' + numPosts + ' posts ' +
                  ' and the last post is dated ' + lastPost;
    axsOrkut.focusAndRead(resultRow, message);
  }
};

/**
 * Given a results row, returns the topic name.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The Topic name
 */
axsOrkut.getTopicName = function(resultRow) {
  var nameXPath = './/a[contains(@href, "CommMsgs.aspx")]';
  var name = axsOrkut.axsJAXObj.evalXPath(nameXPath, resultRow)[0];
  return name.textContent;
};

/**
 * Given a results row, returns the topic author.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The Topic author
 */
axsOrkut.getTopicAuthor = function(resultRow) {
  var authorXPath = './/a[contains(@href, "Profile.aspx")]';
  var author = axsOrkut.axsJAXObj.evalXPath(authorXPath, resultRow)[0];
  return author.textContent;
};

/**
 * Given a results row, returns the number of posts.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The number of posts in the topic
 */
axsOrkut.getNumPosts = function(resultRow) {
  var numXPath = './/td[contains(@class, "ac")]';
  var num = axsOrkut.axsJAXObj.evalXPath(numXPath, resultRow)[0];
  return num.textContent;
};

/**
 * Given a results row, returns the date of last post.
 * @param {Node} resultRow The row that contains the result
 * @return {string} The date of last post
 */
axsOrkut.getLastPost = function(resultRow) {
  var lastXPath = './/td[contains(@class, "ac")]';
  var last = axsOrkut.axsJAXObj.evalXPath(lastXPath, resultRow)[1];
  return last.textContent;
};

/**
 * Focus an item, magnify it and read the contents.
 * @param {Node} resultRow The row that contains the node to be highlighted
 * @param {String} message The message to be read
 */
axsOrkut.focusAndRead = function(resultRow, message) {
  axsOrkut.axsLensObj.view(resultRow);
  resultRow.scrollIntoView(true);
  axsOrkut.axsJAXObj.speakTextViaNode(message);
};

/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsOrkut.focusHandler = function(evt){
  axsOrkut.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsOrkut.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsOrkut.blurHandler = function (evt){
  axsOrkut.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsOrkut.inputFocused = false;
  }
};

/**
 * Handle key presses
 */
axsOrkut.keyHandler = function(evt) {
  if (evt.ctrlKey) {
    return true;
  }

  if (evt.keyCode == 27) { // ESC
    if (axsOrkut.axsJAXObj.lastFocusedNode.blur) {
      axsOrkut.axsJAXObj.lastFocusedNode.blur();
      return false;
    }
  }

  if (axsOrkut.axsJAXObj.inputFocused) return true;

  var command = axsOrkut.charCodeMap[evt.charCode];
  if (command)  return  command();
  return true;
};

axsOrkut.charCodeMap = {
  45 : function () { // - (minus symbol)
    axsOrkut.magSize -= 0.10;
    axsOrkut.axsLensObj.setMagnification(axsOrkut.magSize);
    return false;
  },
  61 : function () { // = symbol
    axsOrkut.magSize += 0.10;
    axsOrkut.axsLensObj.setMagnification(axsOrkut.magSize);
    return false;
  },
  63 : function () {
    var helpStr = axsOrkut.HELP_STRING;
    axsOrkut.axsJAXObj.speakTextViaNode(helpStr);
    return false;
  },
  115 : function () { // s - Go to search bar.
    var searchBar = document.getElementById('q_header');
    if (searchBar) {
      searchBar.focus();
      searchBar.select();
    }
    return false;
  },
  119: function() {
    var scrapText = document.getElementById('scrapText');
    if (scrapText) {
      scrapText.focus();
      scrapText.select();
    }
    return false;
  }
};

axsOrkut.init();
