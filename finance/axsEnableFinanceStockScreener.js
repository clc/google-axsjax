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
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Stock screener page of Google Finance.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsStock = {};

/**
 * Object that contains all string literal used for enhancing the presentation
 * @type {Object}
 */
axsStock.str = {
  MIN : 'Min,',
  MAX : 'Max,',
  COMPANIES_FOUND : 'companies found',
  WIZ_OP_MSG : 'Criteria wizard opened',
  WIZ_CL_MSG : 'Criteria wizard closed',
  DESCENDING : 'descending',
  ASCENDING : 'ascending',
  RESULTS_FROM : 'results from',
  TO : 'to',
  STOCK_SCR : 'Stock screener',
  RESULTS : 'Results',
  CRIT_ALREADY : 'Criteria already added',
  CRIT_ADDED : 'Criteria added',
  NOT_ADDED : 'Not added',
  STATUS : 'Status',
  DEFINITION : 'Definition',
  UP : ' up by ',
  UP_ABR : '+',
  MINUS : ' minus ',
  MINUS_ABR : '-',
  PERCENT_ABR : '%',
  PERCENT : 'percent',
  MILION : ' million',
  MILLION_ABR : 'M',
  BILLION : ' billion',
  BILLION_ABR : 'B',
  EPS : 'E P S',
  EPS_ABR : 'EPS',
  WEEK_HIGH : 'Fifty two week high',
  WEEK_HIGH_ABR : '52w High',
  WEEK_QC : 'Quote change percent',
  WEEK_QC_ABR : 'Quote Change (%)',
  WEEK_LOW : 'Fifty two week low',
  WEEK_LOW_ABR : '52w Low',
  WEEK_PC : 'Fifty two week price change percent',
  WEEK_PC_ABR : '52w Price Change (%)',
  PE : 'P E ratio',
  PE_ABR : 'P/E Ratio',
  FWD_PE_ABR : '1y Fwd P/E',
  FWD_PE : 'One year forward P E',
  FIVE_YEAR_PE_ABR : '5y',
  FIVE_YEAR_PE : '5 year',
  TEN_YEAR_PE_ABR : '10y',
  TEN_YEAR_PE : '10 year',
  APP_NAME : 'Stock screener, ',
  CRITERIA : 'Criteria',
  DELETED : 'deleted',
  ST_SCR_CNR : 'Screener',
  RES_CNR : 'Results'
};

/**
 * String template
 * @type {string}
 */
axsStock.SORT_ORDER_STRING = 'Column {0} sorted in {1} order.';

/**
 * Top section of the Results CNR which is dynamically generated
 * @type {string}
 */
axsStock.CNR_RES_TOP_STRING = '<cnr next="RIGHT l" prev="LEFT h">' + '\n' +

    '<target title="Go to the stock screener section" hotkey="s" ' +
        'action="CALL:axsStock.loadStockScreenerCNRAndPosition">' +
      '/html' +
    '</target>' +

    '<target title="Search company" hotkey="f" ' +
        'action="CALL:axsStock.goToRow">' +
      '/html' +
    '</target>' +

    '<target title="Search criteria" hotkey="c" ' +
        'action="CALL:axsStock.goToColumn">' +
      '/html' +
    '</target>' +

    '<target title="Search column value" hotkey="v" ' +
        'action="CALL:axsStock.goToValueInColumn">' +
      '/html' +
    '</target>' +

    '<target title="Search row value" hotkey="z" ' +
        'action="CALL:axsStock.goToValueInRow">' +
      '/html' +
    '</target>';

/**
 * Bottom section of the Results CNR which is dynamically generated
 * @type {string}
 */
axsStock.CNR_RES_BTM_STRING = '</cnr>';

/**
 * Body section of the Results CNR which is a template applied for each column
 * @type {string}
 */
axsStock.CNR_RES_STRING = '<list title="{0}" fwd="DOWN j n" back="UP k p" ' +
    '        type="dynamic">' +

    '    <item action="CALL:axsStock.readResultCellValue">' +
    '      id("searchresults")/table[@class="results innermargi' +
    'n"]//tr/td[{1}]' +
    '          [not(@class="top_row") and not(@class="bottom_ro' +
    'w")]' +
    '    </item>' +

    '    <target title="Go to section" trigger="listEntry" ' +
    '        action="CALL:axsStock.readResultCellValueListEntry' +
    '">' +
    '      id("criteria_rows")' +
    '    </target>' +

    '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
    'link available">' +
    '      .//a' +
    '    </target>' +

    '    <target title="Next page" trigger="listTail" ' +
    '        action="CALL:axsStock.wrapAround">' +
    '      id("searchresults")//td[position() > 1]//span[@class' +
    '="navb"]/..  ' +
    '           | //div[@class="footerLinks"]' +
    '    </target>' +

    '    <target title="Previous page" trigger="listHead" ' +
    '        action="CALL:axsStock.wrapAround">' +
    '      id("searchresults")//td[1]//span[@class="navb"]/.. ' +
    '          | //div[@class="footerLinks"]' +
    '    </target>' +

    '    <target title="Reverse sorting order" hotkey="r" onEmp' +
    'ty="This column is' +
    '        not sortable" action="CALL:axsStock.clickSortLinkA' +
    'ndGoTop">' +
    '      id("searchresults")//td[{1}]/a[@class="activelink"]' +
    '    </target>' +

    '    </list>';

/**
 * CNR String for the stock screener controls section
 * @type {string}
 */
axsStock.CNR_ST_SCR_STRING = '<cnr next="RIGHT l" prev="LEFT h">' +

    '    <target title="Go to the results section" hotkey="s" ' +
    '        action="CALL:axsStock.buildAndLoadResultTableCNR">' +
    '      /html' +
    '    </target>' +

    '    <target title="Open and close criteria wizard" hotkey=' +
    '"w" ' +
    '        action="CALL:axsStock.openCloseWizard">' +
    '      id("action_links")' +
    '    </target>' +

    '    <target title="Reset to default criteria" hotkey="d">' +
    '      id("action_links")//a[not(@class)]' +
    '    </target>' +

    '    <target title="Search company" hotkey="f" ' +
    '        action="CALL:axsStock.goToRow">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search criteria" hotkey="c" ' +
    '        action="CALL:axsStock.goToColumn">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search column value" hotkey="v" ' +
    '        action="CALL:axsStock.goToValueInColumn">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search row value" hotkey="z" ' +
    '        action="CALL:axsStock.goToValueInRow">' +
    '      /html' +
    '    </target>' +

    '    <list title="Region" next="DOWN j" prev="UP k" fwd="n"' +
    ' back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("regionselect")//option' +
    '      </item>' +

    '      <target title="Focus on region" trigger="listEntry" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("regionselect")' +
    '      </target>' +

    '      <target title="Select region" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Exchange" next="DOWN j" prev="UP k" fwd="' +
    'n" back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("exchangeselect")//option' +
    '      </item>' +

    '      <target title="Focus on exchange" trigger="listEntry' +
    '" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("exchangeselect")' +
    '      </target>' +

    '      <target title="Select exchange" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Sector" next="DOWN j" prev="UP k" fwd="n"' +
    ' back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("sectorselect")//option' +
    '      </item>' +

    '      <target title="Focus on sector" trigger="listEntry" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("sectorselect")' +
    '      </target>' +

    '      <target title="Select sector" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Criteria list" next="DOWN j" prev="UP k" ' +
    'fwd="n" back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaDesc">' +
    '        id("criteria_rows_tbody")/tr[not(.//b)]' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.refreshStockCriteriaCNRAnd' +
    'AnnounceList">' +
    '        id("criteria_rows")' +
    '      </target>' +

    '      <target title="Delete criteria" hotkey="DEL" onEmpty' +
    '="This element is ' +
    '          not a criteria" action="CALL:axsStock.removeCri' +
    'teria">' +
    '        .//img[not(@id) and @class="activelink"]' +
    '      </target>' +

    '      <target title="Edit criteria" hotkey="ENTER" onEmpty' +
    '="This element is ' +
    '          not a criteria" action="CALL:axsStock.focusOnCri' +
    'teriaRangeInput">' +
    '        /html' +
    '      </target>' +

    '      <target title="Explain criteria" hotkey="e" onEmpty=' +
    '"This element is ' +
    '          not a criteria and has no explanation" ' +
    '          action="CALL:axsStock.readCriteriaHelp">' +
    '        .//img[@id and @class="activelink"]/..' +
    '      </target>' +

    '    </list>' +

    '    <list title="Popular criteria" next="DOWN j" prev="UP ' +
    'k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("popular")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[1]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Price criteria" next="DOWN j" prev="UP k"' +
    ' fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("price")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[2]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Volume criteria" next="DOWN j" prev="UP k' +
    '" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("volume")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[3]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Valuation criteria" next="DOWN j" prev="U' +
    'P k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("valuation")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[4]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Dividend criteria" next="DOWN j" prev="UP' +
    ' k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("dividend")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[5]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Balance sheet criteria" next="DOWN j" pre' +
    'v="UP k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("balancesheetratios")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[6]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Stock metrics criteria" next="DOWN j" pre' +
    'v="UP k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("stockmetrics")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[7]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Margins criteria" next="DOWN j" prev="UP ' +
    'k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("margins")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[8]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Growth criteria" next="DOWN j" prev="UP k' +
    '" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("growth")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[9]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '  </cnr>';

/**
 * Stores the last position in the stock screener section to which 
 * the focus should return after leaving the results section.
 * @type {Object?}
 */
axsStock.lastStockScreenerPosition = null;

/**
 * Stores the last list index to enable handling the multiple list that compose 
 * the results as a table i.e. traversal is performed column by column on the 
 * same row (i.e. the current row does not change)
 */
axsStock.previousIdx = -1;

/**
 * Stores the last visited criteria row. Needed for reseting the row to its
 * default visual representation upon leaving the criteria list.
 * @type {Object?}
 */
axsStock.lastCriteriaRow = null;

/**
 * Buffer for queuing TTS messages 
 * @type {string} 
 */
axsStock.searchSummary = '';

/**
 * Array for presenting the stock screener description
 * @type {Array}
 */
axsStock.stockScreenerDescArray = new Array('',
                                            axsStock.str.MIN,
                                            axsStock.str.MAX);

/**
 * Flag indicating completion of the initial loading of the page
 * @type {boolean} 
 */
axsStock.initialLoadComplete = false;

/**
 * Indicates which CNR file is currently loaded (criteria or results) 
 * @type {string}
 */
axsStock.currentCNRfile = '';

/**
 * Map from phrases to phrases
 */
axsStock.phrasesMap = new Object();
axsStock.phrasesMap[axsStock.str.PE_ABR] = axsStock.str.PE;
axsStock.phrasesMap[axsStock.str.FWD_PE_ABR] = axsStock.str.FWD_PE;
axsStock.phrasesMap[axsStock.str.EPS_ABR] = axsStock.str.EPS;
axsStock.phrasesMap[axsStock.str.WEEK_HIGH_ABR] = axsStock.str.WEEK_HIGH;
axsStock.phrasesMap[axsStock.str.WEEK_QC_ABR] = axsStock.str.WEEK_QC;
axsStock.phrasesMap[axsStock.str.WEEK_LOW_ABR] = axsStock.str.WEEK_LOW;
axsStock.phrasesMap[axsStock.str.WEEK_PC_ABR] = axsStock.str.WEEK_PC;
axsStock.phrasesMap[axsStock.str.FIVE_YEAR_PE_ABR] = axsStock.str.FIVE_YEAR_PE;
axsStock.phrasesMap[axsStock.str.TEN_YEAR_PE_ABR] = axsStock.str.TEN_YEAR_PE;

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsStock.charPrefixMap = new Object();
axsStock.charPrefixMap[axsStock.str.MINUS_ABR] = axsStock.str.MINUS;
axsStock.charPrefixMap[axsStock.str.UP_ABR] = axsStock.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsStock.charSuffixMap = new Object();
axsStock.charSuffixMap[axsStock.str.BILLION_ABR] = axsStock.str.BILLION;
axsStock.charSuffixMap[axsStock.str.MILLION_ABR] = axsStock.str.MILION;
axsStock.charSuffixMap[axsStock.str.PERCENT_ABR] = axsStock.str.PERCENT;

/**
 * Map from watched nodes to methods
 */
axsStock.watchedNodeToFuncMap = new Object();

/**
 * Map for flags idicating if a handler for an event has been triggered
 */
axsStock.watchedNodeFuncEnabledMap = new Object();

/**
 * These are strings to be spoken to the user
 */
axsStock.HELP = 'The following shortcut keys are available. ';

/**
 * Time out for processing events accepted by watched nodes
 */
axsStock.EVT_HANDL_TIMEOUT_INT = 100;

/**
 * Interval for polling if the results have been loaded
 */
axsStock.WAIT_RESULTS_RETRY_INTERVAL_INT = 200;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsStock.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsStock.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsStock.axsLensObj = null;

/**
 * The power key object used for quick search
 * @type {Object?} 
 */
axsStock.pkObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsStock.magSize = 2.5;

/**
 * Time out for announcing the initial results in ms.
 * @type number
 */
axsStock.initialResultsTimeout = 4000;

/**
 * Used to determine the direction of CNR inter list traversal. Since
 * AxsJAX still does not provide a mechanism for removing and adding lists,
 * the lists unrelated to the current section are skipped iteratively. 
 * @type string?
 */
axsStock.lastListNavigationKey = null;

/**
 * Flag idicating if the criteria wizxard is open. Some CNR lists 
 * are not relevant in teh context of open wizard and vice versa.
 * @type boolean
 */
axsStock.wizardOpened = false;

/**
 * Node observed for mutation event that occurs when the results are loaded
 * @type {Object} 
 */
axsStock.watchedNodeResults = new Object();

/**
 * Node observed for mutation event that occurs when the criteria 
 * list is loaded 
 * @type {Object}
 */
axsStock.watchedNodeCritList = new Object();

/**
 * Max timeout in wiating for data loading (obtained via AJAX call)
 * @type number
 */
axsStock.waitMaxTimeout = 2000;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsStock.init = function() {
  //Initialie the AxsJAX framework utilities
  axsStock.axsJAXObj = new AxsJAX(true);
  axsStock.axsNavObj = new AxsNav(axsStock.axsJAXObj);
  axsStock.axsLensObj = new AxsLens(axsStock.axsJAXObj);
  axsStock.axsNavObj.setLens(axsStock.axsLensObj);
  axsStock.axsLensObj.setMagnification(axsStock.magSize);

  //Add event listeners
  document.addEventListener('keypress', axsStock.keyHandler, true);
  document.addEventListener('DOMNodeRemoved',
                            axsStock.nodeInsertedOrRemovedHandler,
                            true);
  document.addEventListener('DOMNodeInserted',
                            axsStock.nodeInsertedOrRemovedHandler,
                            true);
  document.addEventListener('DOMSubtreeModified',
                            axsStock.DOMSubtreeModifiedHandler,
                            true);

  axsStock.loadStockScreenerCNR();

  //Some nodes in the page are watched for specific events
  axsStock.loadWatchedNodes();

  //Some stylesheets are modified for improving presentantion
  axsStock.customizeStyleSheets();
};

/**
 * Handler for added and removed nodes in the document. If the node,
 * source of the event, is mapped to a function, the function is
 * executed. Otherwise, no action is taken.
 * @param {Event} evt DOMNodeRemoved or DOMNodeInserted event
 */
axsStock.nodeInsertedOrRemovedHandler = function(evt) {
  var target = evt.target;
  //Add listeners to the input fields of each added criteria row (node)
  if (evt.type == 'DOMNodeInserted' && target.tagName == 'TR') {

   var minInput = target.childNodes[1].firstChild;
    minInput.addEventListener('keypress',
                               axsStock.criteriaInputKeyHandler,
                               false);

    var maxInput = target.childNodes[3].firstChild;
    maxInput.addEventListener('keypress',
                              axsStock.criteriaInputKeyHandler,
                              false);

    minInput.addEventListener('focus', axsStock.focusEventHandler, false);

    //Change inputs' titles. The screen reader will read graspable text upon TAB
    var criteria = target.childNodes[0].textContent;
    criteria = axsStock.parseSpecChrsAndTkns(criteria) + ', ';
    minInput.title = criteria + ' ' + axsStock.str.MIN;
    maxInput.title = criteria + ' ' + axsStock.str.MAX;
  }

  var watchedNode = target.parentNode;
  var functionMapping = axsStock.watchedNodeToFuncMap[watchedNode];
  if (functionMapping) {
    axsStock.executeMappedFunc(functionMapping, evt);
  }
};

/**
 * Handler for the focus event of the min edit field of the criteria.
 * Needed for avoiding reading of the first input field upon the page
 * initialziation.
 * @param {Event} evt A focus event
 */
axsStock.focusEventHandler = function(evt) {
  if (!axsStock.initialLoadComplete) {
    //Iterrupt the screen reader
    axsStock.axsJAXObj.speakTextViaNode(' ');
    axsStock.axsJAXObj.lastFocusedNode.blur();
  }
};

/**
 * Hadles the ENTER key for finalizing the query i.e. to announce the search
 * resutls.
 * NOTE: These results are updated more often than are reported
 * @param {Event} evt A keypress event
 */
axsStock.criteriaInputKeyHandler = function(evt) {
  var target = evt.currentTarget;
  if (evt.keyCode == 13) { // ENTER
      axsStock.axsJAXObj.lastFocusedNode.blur();

      //We finalize after ENTER - the application finalizes on lost fucus
      window.setTimeout(function() {
                          axsStock.searchSummary = '';
                          axsStock.generateSummary();
                          axsStock.announceSummary();
                        },
                        200);
  }
};

/**
 * Handles the DOMSubtreeModified event.
 * This event happens when the selected node for the
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event
 */
axsStock.DOMSubtreeModifiedHandler = function(evt) {
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if (target.id == 'ac-list') {
    for (var i = 0, child; child = target.childNodes[i]; i++) {
      if (child.className == 'selected') {
        axsStock.axsJAXObj.speakNode(child);
      return;
      }
    }
  }
};

/**
 * Loads the CNR for the stock screener section and moves to
 * the last postition in the list (if such exist) or to the
 * beginning of the list.
 */
axsStock.loadStockScreenerCNRAndPosition = function() {
  axsStock.loadStockScreenerCNR();

  //Go to the last position in the Stock screener CNR
  axsStock.restoreLastPosition();
};

/**
 * This mehtod idnetifies and registers nodes watched for specific events.
 * For each watched node a mapping to a hadndling function is set.
 * NOTE: In this script we observe node removal and insertion events.
 */
axsStock.loadWatchedNodes = function() {
  //Watched node for the Stock Screener section
  var axsJAXObj = axsStock.axsJAXObj;
  var xpath = 'id("criteria_rows_tbody")';
  var stockScrParents = axsJAXObj.evalXPath(xpath, document.body);

  //Listeners which should be executed upon event in intervals 
  //(after a timeout)
  axsStock.watchedNodeResults = stockScrParents[0];
  var funcMapping = function() {
                          axsStock.refreshStockCriteria();
                        };
  axsStock.watchedNodeToFuncMap[axsStock.watchedNodeResults] = funcMapping;

  //Watched node for resuts change
  xpath = 'id("searchresultssummary")';
  var summaryParents = axsJAXObj.evalXPath(xpath, document.body);
  axsStock.watchedNodeCritList = summaryParents[0];

  funcMapping = function() {
                  if (axsStock.currentCNRfile == axsStock.str.RES_CNR) {
                    axsStock.refreshAllResultLists();
                  }

                  axsStock.generateSummary();
                  /*
                   * In the page init result summary is spoken as soon as
                   * it is generated. We explicitly control when the summary
                   * is spoken.
                   */
                  if (!axsStock.initialLoadComplete) {
                    axsStock.searchSummary = axsStock.str.APP_NAME +
                        axsStock.searchSummary;
                    axsStock.announceSummary();
                    axsStock.initialLoadComplete = true;
                  }
                };
  axsStock.watchedNodeToFuncMap[axsStock.watchedNodeCritList] = funcMapping;
};

/**
 * Change some properties of the stylesheets to improve 
 * presentation for people with reduced vision.
 */
axsStock.customizeStyleSheets = function() {
  var cssRule = document.styleSheets[0].cssRules[36];
  cssRule.style.font = '30px arial';
};

/**
 * Focuses on a drop down list and skips it if the list is not
 * relevant in the current context (if the criteria wizard is open).
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.focusOnDropDownList = function(item) {
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }
  var element = item.elem;
  axsStock.axsLensObj.view(element.parentNode);
  var listTitle = element.previousSibling.textContent;
  listTitle = axsStock.normalizeString(listTitle);
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Reads the values in a drop down lists (Region, Exchange, Sector)
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readDropDownListItem = function(item) {
  //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }
  var element = item.elem;
  axsStock.axsLensObj.view(element);
  axsStock.axsJAXObj.speakNode(element);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Selects an option from a drop down list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.selectDropDownListOption = function(item) {
  var option = axsStock.axsNavObj.currentItem().elem;
  option.selected = true;
  axsStock.axsLensObj.view(null);
};

/**
 * Refreshes the Stock criteria list.
 */
axsStock.refreshStockCriteria = function() {
  axsStock.axsNavObj.refreshList(axsStock.str.STOCK_SCR);
  window.setTimeout(function() {
                      var lastFocusedNode = axsStock.axsJAXObj.lastFocusedNode;
                      if (lastFocusedNode && lastFocusedNode.blur) {
                        lastFocusedNode.blur();
                      }
                    },
                    0);

  axsStock.restoreLastPosition();
};

/**
 * Adds a new selected criteria to the criteria list
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.addCriteria = function(item) {
  var element = item.elem;
  //The button is not disabled and made invisible but is moved to (0, 0)
  var text = axsStock.str.CRIT_ALREADY;
  if (element.offsetTop > 0) {
    //We want to stay in the criteria wizard
    axsStock.lastStockScreenerPosition = null;

    axsStock.axsJAXObj.clickElem(element, false);
    axsStock.axsJAXObj.speakTextViaNode('');
    text = axsStock.str.CRIT_ADDED;
  }
  axsStock.searchSummary = text + ', ' + axsStock.searchSummary;

  var func = function() {
               axsStock.axsLensObj.view(null);
               axsStock.axsJAXObj.lastFocusedNode.blur();
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeCritList,
                                             new Date(),
                                             func);
};

/**
 * Removes a criteria and announces the deletion
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.removeCriteria = function(item) {
  axsStock.searchSummary = '';
  axsStock.lastStockScreenerPosition = null;

  var element = item.elem;
  axsStock.axsJAXObj.clickElem(element, false);
  var criteriaName = element.parentNode.parentNode.firstChild.textContent;

  var func = function() {
               axsStock.axsLensObj.view(null);
               var text = axsStock.str.CRITERIA;
               text = text + ' ' + criteriaName;
               text = text + ' ' + axsStock.str.DELETED + '. ';
               axsStock.searchSummary = text + ' ' + axsStock.searchSummary;
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeCritList,
                                             new Date(),
                                             func);
};

/**
 * Reads the description of a criteria from the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaDesc = function(item) {
   //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var element = item.elem;

  axsStock.cacheLastPosition();

  //Remove the section explaining the criteria from the view (if present)
  axsStock.axsJAXObj.clickElem(element, false);

  //Rest the the last criteria row
  axsStock.resetCriteriaRow();
  axsStock.lastCriteriaRow = element;

  var criteria = element.childNodes[0].textContent;
  criteria = axsStock.parseSpecChrsAndTkns(criteria) + ', ';
  var min = element.childNodes[1].childNodes[0].value;
  min = axsStock.parseSpecChrsAndTkns(min) + ', ';
  var max = element.childNodes[3].childNodes[0].value;
  max = axsStock.parseSpecChrsAndTkns(max) + ', ';

  var columnsText = new Array(criteria, min, max);
  var rowText = axsStock.buildTableRowText(columnsText,
      axsStock.stockScreenerDescArray);
  axsStock.speakAndGo(element.firstChild, rowText);
};

/**
 * Reads the explanation of a certain criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaExplanation = function(item) {
  if (!axsStock.wizardOpened) {
    return;
  }

  axsStock.axsLensObj.view(null);
  var element = item.elem;
  var text = '';
  var xpath = 'id("add_criteria_wizard")//td[3]';
  axsStock.axsJAXObj.clickElem(element, false);
  var descriptions = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var descriptionSection = descriptions[0];
  var definition = document.getElementById('criteria_definition').textContent;
  var statusNode = descriptionSection.childNodes[5];
  var criteriaStatus = axsStock.str.NOT_ADDED;

  if (statusNode.className.indexOf('displaynone') == -1) {
    criteriaStatus = statusNode.textContent;
  }

  text = element.textContent + ' ';
  text = text + ' ' + axsStock.str.STATUS + ' ' + criteriaStatus;
  text = text + ', ' + axsStock.str.DEFINITION + ' ' + definition;
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(descriptions[0]);
};

/**
 * Moves the focus in the input fields for the currently edited criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.focusOnCriteriaRangeInput = function(item) {
  var rowElement = axsStock.axsNavObj.currentItem().elem;

  //Trigger the page event hadler for mouse over a criteria row
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseover',
                       false,
                       false,
                       window,
                       1,
                       0,
                       0,
                       0,
                       0,
                       false,
                       false,
                       false,
                       false,
                       0,
                       null);
  rowElement.dispatchEvent(event);

  var minInput = rowElement.childNodes[1].firstChild;

  //Remove the section explaining the criteria from the view (if present)
  axsStock.axsJAXObj.clickElem(minInput, false);
  minInput.focus();
  minInput.select();

  //TODO: Refactor tab key fix
  axsStock.axsJAXObj.tabKeyFixOn = false;
};

/**
 * Reads the current criteria list (in the criteria wizard) and skips
 * lists irrelevant in the criteria wizard context
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCurrentCrtieriaList = function(item) {
  //Reset the last criteria row (in the criteria list) to its default state
  axsStock.resetCriteriaRow();

  //Skip and do not announce lists not accessible if the wizard is closed
  if (!axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var element = item.elem;
  axsStock.axsJAXObj.clickElem(element, false);
  var listTitle = axsStock.axsNavObj.currentList().title;
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  axsStock.axsLensObj.view(element.parentNode.parentNode);
};

/**
 * Resets the last visited criteria row (if such exists) to its default
 * visual representation which is modified when the user focuses on that row.
 */
axsStock.resetCriteriaRow = function() {
  //TODO: Refactor tab key fix
  axsStock.axsJAXObj.tabKeyFixOn = true;
  if (axsStock.lastCriteriaRow !== null) {
    axsStock.simulateMouseOutEvent(axsStock.lastCriteriaRow);
  }
};

/**
 * Reads the help (explanation) description for a criteria in the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaHelp = function(item) {
  var element = item.elem;
  var descTitleNode = element.childNodes[0];
  var linkNode = element.childNodes[1];
  axsStock.axsJAXObj.clickElem(linkNode, false);
  var xpath = '//div[@class="definition_title"]';
  var explNodes = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  for (var i = 0, node; node = explNodes[i]; i++) {
    var explTitleNode = explNodes[i].firstChild;
    var descTitleText = axsStock.normalizeString(descTitleNode.textContent);
    var explTitleText = axsStock.normalizeString(explTitleNode.textContent);
    if (descTitleText == explTitleText) {
      var explTextNode = explNodes[i].nextSibling;
      axsStock.axsJAXObj.speakTextViaNode(explTextNode.textContent);
      break;
    }
  }
};

/**
 * Refreshes the stock criteria list and announces its title.
 */
axsStock.refreshStockCriteriaCNRAndAnnounceList = function() {
  //Rest the the last criteria row - current row in the criteria list
  axsStock.resetCriteriaRow();

  //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var listTitle = axsStock.axsNavObj.currentList().title;
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  var xpath = 'id("criteria_rows_tbody")/tr[1]/td[1]';
  var critHeaders = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var critHeader = critHeaders[0];
  axsStock.axsLensObj.view(critHeader);
  critHeader.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(critHeader);
};

/**
 * Loads the CNR for the stock screener
 */
axsStock.loadStockScreenerCNR = function() {
  axsStock.currentCNRfile = axsStock.str.ST_SCR_CNR;
  axsStock.axsNavObj.navInit(axsStock.CNR_ST_SCR_STRING, null);
};

/**
 * Generates a summary of the search results.
 */
axsStock.generateSummary = function() {
  var axsJAXObj = axsStock.axsJAXObj;
  var xPath = 'id("searchresultssummary")';
  var summaryParents = axsJAXObj.evalXPath(xPath, document.body);
  var suffix = '';
  var summaryResult = summaryParents[0].childNodes[5];
  if (summaryResult == undefined) {
    summaryResult = summaryParents[0].childNodes[0];
  } else {
    suffix = axsStock.str.COMPANIES_FOUND + ', ';
    suffix = suffix + ' ' + axsStock.str.RESULTS_FROM;
    suffix = suffix + ' ' + summaryParents[0].childNodes[1].textContent;
    suffix = suffix + ' ' + axsStock.str.TO;
    suffix = suffix + ' ' + summaryParents[0].childNodes[3].textContent;
  }

  var text = summaryResult.textContent;
  text = axsStock.normalizeString(text + ' ' + suffix);
  axsStock.searchSummary = text + ', ' + axsStock.searchSummary;
};

/**
 * Reads the search summary message
 */
axsStock.announceSummary = function() {
  axsStock.axsJAXObj.speakTextViaNode(axsStock.searchSummary);
  axsStock.searchSummary = '';
};

/**
 * Executes a function mapped to a watched node. Since some events are generated
 * too frequently, taking actions on each occurence may cause significant
 * overhed. The method is setting a triggered flag after an execution of
 * the function is requested. The flag is cleared upon a certain timeout and
 * execution of the mapped function. During the timeout no further
 * execution requests for the same function are accepted.
 * @param {Function} handlingFunction The function to execute .
 * @param {Event} evt Event to be propageted to the handlingFunction.
 */
axsStock.executeMappedFunc = function(handlingFunction, evt) {
  var funcString = handlingFunction.toString();
  if (axsStock.watchedNodeFuncEnabledMap[funcString]) {
    return;
  }
  axsStock.watchedNodeFuncEnabledMap[funcString] = true;
  var delegatingFunction = function() {
    handlingFunction(evt);
    axsStock.watchedNodeFuncEnabledMap[funcString] = false;
  };
  window.setTimeout(delegatingFunction, axsStock.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Executes a function after the function mapped to a watched node
 * has been executed.
 * @param {Object} node The watched DOM node.
 * @param {Date} time The time of the function call.
 * @param {Function} func The function to be executed.
 * NOTE: Passing the current time is necessary to avoid infinite looping.
 * due to incomplete execution of the function mapped to the watched node.
 */
axsStock.executeAfterWatchedNodeMappedFunc = function(node, time, func) {
  var mappedFunc = axsStock.watchedNodeToFuncMap[node];
  var completed = axsStock.watchedNodeFuncEnabledMap[mappedFunc.toString()];

  if ((completed === undefined || !completed) &&
      (new Date() - time <= axsStock.waitMaxTimeout)) {
    var selfFunc = function(){
          axsStock.executeAfterWatchedNodeMappedFunc(node, time, func);
        };
    window.setTimeout(selfFunc, axsStock.WAIT_RESULTS_RETRY_INTERVAL_INT);
  } else {
    window.setTimeout(func, 0);
  }
};

/**
 * Opens and closes the criteria wizard.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.openCloseWizard = function(item) {
  var element = item.elem;
  var visible = false;
  var text = axsStock.str.WIZ_OP_MSG;
  var xPath = 'id("action_links")/a[@class="activelink"]';
  axsStock.wizardOpened = true;

  if (element.style.display == 'none') {
     xPath = 'id("add_criteria_wizard")/div/a[1]';
     text = axsStock.str.WIZ_CL_MSG;
     axsStock.wizardOpened = false;
  }

  var links = axsStock.axsJAXObj.evalXPath(xPath, document.body);
  axsStock.axsJAXObj.clickElem(links[0], false);
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(null);
};

/**
 * Builds dynamically a CNR for the result section. Each column is a list
 * and the order of criteria in the Stock criteria section detemines
 * (potentially changes) the order of columns in the result table.
 * @param {boolean} opt_readFirstResult If the first result in the table
 * should be read. If the paremeter is ommited the default behavior is
 * reading the first result.
 */
axsStock.buildAndLoadResultTableCNR = function(opt_readFirstResult) {
  axsStock.currentCNRfile = axsStock.str.RES_CNR;

  //Remeber the last position in the CNR before switching it
  axsStock.cacheLastPosition();

  //Build dynamically the CNR file
  var xpath = 'id("searchresults")/table/tbody';
  var tables = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  
  if (tables[0] === undefined) {
  	return;
  }
  
  var topRow = tables[0].childNodes[0];
  var columns = topRow.childNodes;
  var cnrString = axsStock.CNR_RES_TOP_STRING;

  for (var i = 0, column; column = columns[i]; i++) {
    var columnCaption = axsStock.normalizeString(column.textContent);
    if (i == 1) {
       columnCaption = axsStock.addSpaceBetweenChars(columnCaption);
     }
     if (columnCaption.length > 0) {
      var values = new Array(column.textContent, i + 1);
      var filledTmpl;
      filledTmpl = axsStock.populateTemplate(axsStock.CNR_RES_STRING, values);
      cnrString = cnrString + filledTmpl;
     }
  }

  cnrString = cnrString + axsStock.CNR_RES_BTM_STRING;
  axsStock.axsNavObj.navInit(cnrString, null);

  if (opt_readFirstResult === undefined || opt_readFirstResult) {
    axsStock.readResultCellValue(axsStock.axsNavObj.nextItem());
  }
};

/**
 * Focuses on and reads the appropriate entry in the results table. Since each
 * columns is managesd as a list changing columns should keep the user
 * on the same row.
 */
axsStock.readResultCellValueListEntry = function() {
  //Rest the the last criteria row
  axsStock.resetCriteriaRow();

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsStock.axsNavObj.navListIdx;
  if (axsStock.previousIdx > -1) {
    axsStock.axsNavObj.navItemIdxs[navListIdx] = axsStock.previousIdx;
  }

  var element = axsStock.axsNavObj.currentItem().elem;
  var text = '';
  var columnValue = axsStock.getCellValue(element);
  var title = axsStock.axsNavObj.navArray[navListIdx].title;
  title = axsStock.parseSpecChrsAndTkns(title);
  text = title + ' ' + columnValue;
  axsStock.speakAndGo(element, text);
};

/**
 * Reads the value for a certain criteria from the results table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readResultCellValue = function(item) {
  var element = item.elem;
  var company = element.parentNode.childNodes[0].textContent;
  company = axsStock.normalizeString(company);
  var text = company;

  if (element != element.parentNode.childNodes[0]) {
    var columnValue = axsStock.getCellValue(element);
    text = text + ', ' + columnValue;
  }

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsStock.axsNavObj.navListIdx;
  axsStock.previousIdx = axsStock.axsNavObj.navItemIdxs[navListIdx];
  axsStock.speakAndGo(item.elem, text);
};

/**
 * Returns the current value in a table cell.
 * @param {Object} tdElement A DOM node object representing the table cell.
 * @return {string} The value of the table cell.
 */
axsStock.getCellValue = function(tdElement) {
  var columnValue = tdElement.textContent;
  if (tdElement == tdElement.parentNode.childNodes[1]) {
    columnValue = axsStock.addSpaceBetweenChars(columnValue);
  } else if (tdElement == tdElement.parentNode.childNodes[0]) {
    columnValue = axsStock.normalizeString(columnValue);
  } else {
    columnValue = axsStock.parseSpecChrsAndTkns(columnValue);
  }
  return columnValue;
};

/**
 * Clicks on the link for sorting the current column and positions at the 
 * top of the results list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.clickSortLinkAndGoTop = function(item) {
  var element = item.elem;
  axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  axsStock.axsJAXObj.clickElem(element, false);

  //Wait until the new data is loaded
  var func = function() {
               //The result table is replaced => need locate the node
               var id = element.previousSibling.previousSibling.id;
               var sortImage = document.getElementById(id);
               var sortOrder = '';
               if (sortImage.src.indexOf('up') > -1) {
                 sortOrder = axsStock.str.ASCENDING;
               } else {
                 sortOrder = axsStock.str.DESCENDING;
               }

               var templateParameters = new Array(element.textContent,
                                                  sortOrder);
               var template = axsStock.SORT_ORDER_STRING;
               var text = axsStock.populateTemplate(template,
                                                    templateParameters);

               axsStock.searchSummary = text + ' ' + axsStock.searchSummary;
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeResults,
                                             new Date(),
                                             func);
};

/**
 * Positions the focus on the row with company name found by PowerKey.
 * We treat the company name as a row title.
 * NOTE: The column in which the user is does not change.
 */
axsStock.goToRow = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
  }
  var items = axsStock.axsNavObj.navArray[0].items;
  var elementNames = new Array();
  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }
  axsStock.goToItem(axsStock.pkVerticalSearchHandler, elementNames);
};

/**
 * Positions the focus on the column with criteria name found by PowerKey.
 * We use the table column names.
 * NOTE: The row in which the user is does not change.
 */
axsStock.goToColumn = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
    //Initialize to the first item in the list
    axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  }
  var xpath = 'id("searchresults")//tr[1]/td[@class="top_row"]';
  var elements = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var elementNames = new Array();
  for (var i = 0, element; element = elements[i]; i++) {
    elementNames[i] = element.textContent;
  }
  axsStock.goToItem(axsStock.pkHorizontalSearchHandler, elementNames);
};

/**
 * Positions the focus on a column cell with value found by PowerKey.
 * NOTE: The column in which the user is does not change.
 */
axsStock.goToValueInColumn = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
  }
  var items = axsStock.axsNavObj.currentList().items;
  var elementNames = new Array();
  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }
  axsStock.goToItem(axsStock.pkVerticalSearchHandler, elementNames);
};

/**
 * Positions the focus on a row cell with value found by PowerKey.
 * NOTE: The row in which the user is does not change.
 */
axsStock.goToValueInRow = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
    axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  }
  var rowIndex = axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx];
  var elementNames = new Array();
  for (var i = 0, list; list = axsStock.axsNavObj.navArray[i]; i++) {
    elementNames[i] = list.items[rowIndex].elem.textContent;
  }
  axsStock.goToItem(axsStock.pkHorizontalSearchHandler, elementNames);
};

/**
 * Enables PowerKey search from element names and in case of a successful
 * search delegates to a handler.
 * @param {Object} handler Hadler to process the found element.
 * @param {Array} elementNames The array of names searched by PowerKey.
 */
axsStock.goToItem = function(handler, elementNames) {
  //Initialize
  axsStock.pkObj = new PowerKey('list', axsStock.axsJAXObj);
  var body = axsStock.axsJAXObj.getActiveDocument().body;
  axsStock.pkObj.createCompletionField(body,
                                       30,
                                       handler,
                                       null,
                                       elementNames,
                                       false);
  axsStock.pkObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  axsStock.pkObj.updateCompletionField('visible', true, 40, 20);
};

/**
 * Positions the user in a result table column with index found by PowerKey
 * and at the same time keeps the current row.
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsStock.pkHorizontalSearchHandler = function(command, index, id, args) {
  axsStock.axsNavObj.lastItem = null;
  var itemIndex = axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx];
  axsStock.axsNavObj.navListIdx = index;
  axsStock.axsNavObj.navItemIdxs[index] = itemIndex;

  var item = axsStock.axsNavObj.currentItem();
  axsStock.axsNavObj.actOnItem(item);

  axsStock.pkObj.updateCompletionField('hidden', true, 40, 20);
};

/**
 * Positions the user in a row cell that contains value that found
 * during the power key search. (i.e. search by column value)
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsStock.pkVerticalSearchHandler = function(command, index, id, args) {
  axsStock.axsNavObj.lastItem = null;
  axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = index;

  var item = axsStock.axsNavObj.currentItem();
  axsStock.axsNavObj.actOnItem(item);

  axsStock.pkObj.updateCompletionField('hidden', true, 40, 20);
};

/**
 * Refreshes all lists in the CNR. Such an action is required upon
 * a dynamic change in the data presented by these lists.
 */
axsStock.refreshAllResultLists = function() {
  var navArray = axsStock.axsNavObj.navArray;
  for (var i = 0, list; list = navArray[i]; i++) {
    axsStock.axsNavObj.refreshList(list.title);
  }
};

/**
 * Wraps around an item list traversed with the fwd and back keys
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.wrapAround = function(item) {
  var element = item.elem;
  if (element.tagName == 'A') {
    axsStock.axsJAXObj.clickElem(element, false);
  } else {
    item = axsStock.axsNavObj.currentItem();
    axsStock.axsNavObj.actOnItem(item);
  }
};

/**
 * Skips a list and goes to the next or previous one depending
 * on the last inter list navigation key which was pressed.
 */
axsStock.skipList = function() {
  if (axsStock.lastListNavigationKey === null){
    return;
  }
  var key = axsStock.lastListNavigationKey.charCodeAt(0);
  var method = axsStock.axsNavObj.topCharCodeMap[key];
  method();
};

/**
 * Caches the last position in the Stock screener section.
 */
axsStock.cacheLastPosition = function() {
  var listIndex = axsStock.axsNavObj.navListIdx;
  var itemIndex = axsStock.axsNavObj.navItemIdxs[listIndex];
  var lastPosition = new Object();
  lastPosition.listIndex = listIndex;
  lastPosition.itemIndex = itemIndex;
  axsStock.lastStockScreenerPosition = lastPosition;
};

/**
 * Restores the last position in the Stock screener section.
 */
axsStock.restoreLastPosition = function() {
  if (axsStock.lastStockScreenerPosition === null) {
    return;
  }

  var listIndex = axsStock.lastStockScreenerPosition.listIndex;
  var itemIndex = axsStock.lastStockScreenerPosition.itemIndex;

  axsStock.axsNavObj.lastItem = null;
  axsStock.axsNavObj.navListIdx = listIndex;
  axsStock.axsNavObj.navItemIdxs[listIndex] = itemIndex;

  var item = axsStock.axsNavObj.currentItem();
  if (item !== undefined) {
    axsStock.axsNavObj.actOnItem(item);
  } else {
    var currentList = axsStock.axsNavObj.navArray[listIndex];
    axsStock.axsNavObj.actOnTarget(currentList.entryTarget);
  }
};

/**
 * Populates a template replacing specail tokes (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate
 * @param {Array} values The array with replacement (concrete) values
 * @return {string} The string generated from populating the template
 */
axsStock.populateTemplate = function(template, values) {
  var populated = new String(template);
  for (var i = 0, value; i < values.length; i++) {
    var regExp = new RegExp('\{(' + i + ')\}', 'g');
    populated = populated.replace(regExp, values[i]);
  }
  return populated;
};

/**
 * Simulates a mouse out event.
 * @param {Object} targetNode The DOM node which is the target (source)
 * of the event.
 */
axsStock.simulateMouseOutEvent = function(targetNode) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseout',
                        false,
                        false,
                        window,
                        1,
                        0,
                        0,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        null);
  targetNode.dispatchEvent(event);
};

/**
 * Adds white spaces beteen the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its
 * characters.
 */
axsStock.addSpaceBetweenChars = function(text) {
  var textWithSpaces = '';
  for (var i = 0; i < text.length; i++) {
    textWithSpaces = textWithSpaces + text.charAt(i);
    if (i < text.length - 1) {
      textWithSpaces = textWithSpaces + ' ';
    }
  }
  return textWithSpaces;
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node
 * @param {string} text The text to be spoken.
 * characters.
 */
axsStock.speakAndGo = function(element, text) {
  axsStock.axsLensObj.view(element);
  axsStock.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content.
 * @param {Array?} textContents Array with the contents of table columns.
 * @param {Array} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsStock.buildTableRowText = function(textContents, columnDesc) {
  //check inputs
  if (textContents === null) {
    return '';
  }

  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (i < columnDesc.length) {
      rowText = rowText + ' ' + columnDesc[i];
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (i < columnDesc.length) {
    rowText = rowText + ' ' + columnDesc[i];
  }
  return rowText;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content.
 * @param {string} text The text to be processed
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsStock.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';

  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = axsStock.normalizeString(text);

  //check for phrase word mapping
  var phraseMapping = axsStock.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //check for whole word mapping
    var tokenMapping = axsStock.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {

      //remove brackets
      if (token.length > 0 && token.charAt(0) === '(') {
          token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }

      //parse the first character
      var prefixMapping = axsStock.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }

      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsStock.charSuffixMap[lastCharacter];
      if (suffixMapping != undefined) {
        token = token.substring(0, token.length - 1) + ' ' + suffixMapping;
      }
    }
    parsedText = parsedText + ' ' + token;
  }
  return parsedText;
};

/**
 * Normalizes a string to enable correct presentation (i.e. speaking). All
 * leading and trailing spaces are truncated, all types of white space
 * characters are rplaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized version of the text
 */
axsStock.normalizeString = function(text) {
  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  text = text.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return text.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event
 * @return {boolean} If true, the event should be propagated.
 */
axsStock.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsStock.axsJAXObj.lastFocusedNode.blur();
    return false;
  } else if ((evt.charCode == 104) || (evt.charCode == 108)) { //h or l
    axsStock.lastListNavigationKey = String.fromCharCode(evt.charCode);
  }
  if (axsStock.axsJAXObj.inputFocused) {
    return true;
  }
  var command = axsStock.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *                   that the keycode has been handled.
 */
axsStock.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
       document.getElementById('searchbox').focus();
       document.getElementById('searchbox').select();
       return false;
     },
  // ? (question mark)
  63 : function() {
       var helpStr = axsStock.HELP + axsStock.axsNavObj.localHelpString() +
                     axsStock.axsNavObj.globalHelpString();
       axsStock.axsJAXObj.speakTextViaNode(helpStr);
       return false;
    }
};

//Run the initialization routine of the script
axsStock.init();
