// Copyright 2008 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//    http://www.apache.org/licenses/LICENSE-2.0
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
var axsFinance = {};


/**
 * Object that contains all string literal used for enhancing the presentation
 * @type {Object}
 */
axsFinance.str = {
  MIN : 'Min,',
  MAX : 'Max,',
  CRIT_SECT_ACTIVE : 'Criteria section active',
  RES_SECT_ACTIVE : 'Result section active',
  WIZ_SECT_ACTIVE : 'Add criteria wizard section active',
  TO : 'to',
  CRITERIA_LIST : 'Criteria list',
  CRIT_ALREADY_ADDED : 'Criteria already added',
  CRIT_ADDED : 'Criteria added',
  CRIT_DELETED : 'Criteria deleted',
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
  FIVE_Y_PE_ABR : '5y',
  FIVE_Y_PE : '5 year',
  TEN_Y_PE_ABR : '10y',
  TEN_Y_PE : '10 year',
  APP_NAME : 'Stock screener, ',
  ST_SCR_CNR : 'Screener',
  RES_CNR : 'Results',
  SELECTED : 'selected',
  ENTER_TO_EDIT : 'Press ENTER to edit',
  SEARCH_COMPANY : 'Search for row by company name',
  SEARCH_CRITERIA : 'Search for a criteria',
  SEARCH_CRITERIA_VALUE : 'Search for a criteria value',
  SEARCH_CRITERIA_BY_VALUE : 'Search for a criteria by value',
  ITEM_SND : 'item',
  WRAP_SND : 'wrap',
  SORTED_BY : 'sorted by',
  IN_DESCENDING_ORDER : 'in descending order',
  IN_ASCENDING_ORDER : 'in ascending order',
  COMPANIES_FOUND : 'companies found',
  RESULTS_FROM : 'results from'
};

/**
 * Top section of the 'Results' CNR which is dynamically generated
 * @type {string}
 */
axsFinance.RESULTS_CNR_TOP = '<cnr next="RIGHT l" prev="LEFT h">' + '\n' +

  '<target title="Go to the criteria section" hotkey="s" ' +
    'action="CALL:axsFinance.setActiveAxsNavObjCrit">' +
    '/html' +
  '</target>' +

  '<target title="Open add criteria wizard" hotkey="w" ' +
      'action="CALL:axsFinance.setActiveAxsNavObjWiz">' +
    '/html' +
  '</target>' +

  '<target title="Search for row by company name" hotkey="f" ' +
    'action="CALL:axsFinance.goToRow">' +
    '/html' +
  '</target>' +

  '<target title="Search for a criteria" hotkey="c" ' +
    'action="CALL:axsFinance.goToColumn">' +
    '/html' +
  '</target>' +

  '<target title="Search for a criteria value" hotkey="v" ' +
    'action="CALL:axsFinance.goToValueInColumn">' +
    '/html' +
  '</target>' +

  '<target title="Search criteria by value" hotkey="z" ' +
    'action="CALL:axsFinance.goToValueInRow">' +
    '/html' +
  '</target>';

/**
 * Bottom section of the 'Results' CNR which is dynamically generated
 * @type {string}
 */
axsFinance.RESULTS_CNR_BOTTOM = '</cnr>';

/**
 * Body section of the 'Results' CNR which is a template applied for each column
 * @type {string}
 */
axsFinance.RESULTS_CNR_BODY = '<list title="{0}" fwd="DOWN j n" ' +
      'back="UP k p" type="dynamic">' +

    '<item action="CALL:axsFinance.readResultCellValue">' +
      'id("searchresults")/table[@class="results innermargi' +
          'n"]//tr/td[{1}]' +
          '[not(@class="top_row") and not(@class="bottom_row")]' +
    '</item>' +

    '<target title="Go to section" trigger="listEntry" ' +
        'action="CALL:axsFinance.readResultCellValueListEntry">' +
      'id("criteria_rows")' +
    '</target>' +

    '<target title="Go to link" hotkey="ENTER" onEmpty="No link available">' +
      './/a' +
    '</target>' +

    '<target title="Next page" trigger="listTail" ' +
        'action="CALL:axsFinance.wrapAround">' +
      'id("searchresults")//td[position() > 1]//span[@class="navb"]/..  ' +
          '| //div[@class="footerLinks"]' +
    '</target>' +

    '<target title="Previous page" trigger="listHead" ' +
        'action="CALL:axsFinance.wrapAround">' +
        'id("searchresults")//td[1]//span[@class="navb"]/.. ' +
        '| //div[@class="footerLinks"]' +
    '</target>' +

    '<target title="Reverse sorting order" hotkey="r" ' +
        'onEmpty="This column is not sortable">' +
      'id("searchresults")//td[{1}]/a[@class="activelink"]' +
    '</target>' +

  '</list>';

/**
 * CNR String for the 'Criteria' section
 * @type {string}
 */
axsFinance.CRITERIA_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

  '<target title="Go to the results section" hotkey="s" ' +
      'action="CALL:axsFinance.setActiveAxsNavObjRes">' +
    '/html' +
  '</target>' +

  '<target title="Open add criteria wizard" hotkey="w" ' +
      'action="CALL:axsFinance.setActiveAxsNavObjWiz">' +
    '/html' +
  '</target>' +

  '<target title="Reset to default criteria" hotkey="d">' +
    'id("action_links")//a[not(@class)]' +
  '</target>' +

  '<list title="Criteria list" next="DOWN j" prev="UP k" ' +
      'fwd="n" back="p" type="dynamic">' +

    '<item action="CALL:axsFinance.readCriteriaDesc">' +
      'id("criteria_rows_tbody")/tr[not(.//b)]' +
    '</item>' +

    '<target title="Load CNR and go to section" trigger="listEntry" ' +
        'action="CALL:axsFinance.refreshStockCriteriaCNRAndAnnounceList">' +
      'id("criteria_rows")' +
    '</target>' +

    '<target title="Delete criteria" hotkey="DEL" ' +
        'onEmpty="This element is not a criteria" ' +
        'action="CALL:axsFinance.removeCriteria">' +
      './/img[not(@id) and @class="activelink"]' +
    '</target>' +

    '<target title="Edit criteria" hotkey="ENTER" ' +
        'onEmpty="This element is not a criteria" ' +
        'action="CALL:axsFinance.focusOnCriteriaRangeInput">' +
      '/html' +
    '</target>' +

    '<target title="Explain criteria" hotkey="e" ' +
        'onEmpty="This element is not a criteria and has no explanation" ' +
        'action="CALL:axsFinance.readCriteriaHelp">' +
      './/img[@id and @class="activelink"]/..' +
    '</target>' +

  '</list>' +

  '<list title="Sector" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic">' +

    '<item action="CALL:axsFinance.readDropDownListItem">' +
      'id("sectorselect")//option' +
    '</item>' +

    '<target title="Focus on sector" trigger="listEntry" '+
        'action="CALL:axsFinance.focusOnDropDownList">' +
      'id("sectorselect")' +
    '</target>' +

    '<target title="Select sector" hotkey="ENTER" '+
        'action="CALL:axsFinance.selectDropDownListOption">' +
      '/html' +
    '</target>' +

  '</list>' +

  '<list title="Exchange" next="DOWN j" prev="UP k" fwd="n" '+
      'back="p" type="dynamic">' +

    '<item action="CALL:axsFinance.readDropDownListItem">' +
      'id("exchangeselect")//option' +
    '</item>' +

    '<target title="Focus on exchange" trigger="listEntry" ' +
        'action="CALL:axsFinance.focusOnDropDownList">' +
      'id("exchangeselect")' +
    '</target>' +

    '<target title="Select exchange" hotkey="ENTER" '+
        'action="CALL:axsFinance.selectDropDownListOption">' +
      '/html' +
    '</target>' +

  '</list>' +

'</cnr>';

/**
 * CNR for the 'Add criteria wizard' section.
 * @type {string}
 */
axsFinance.WIZARD_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Close add criteria wizard" hotkey="w" ' +
        'action="CALL:axsFinance.setActiveAxsNavObjCrit">' +
      '/html' +
    '</target>' +

    '<list title="Popular criteria" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("popular")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[1]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
        'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Price criteria" next="DOWN j" ' +
        'prev="UP k" fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("price")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[2]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Volume criteria" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("volume")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[3]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Valuation criteria" next="DOWN j" ' +
        'prev="UP k" fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("valuation")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[4]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Dividend criteria" next="DOWN j" ' +
        'prev="UP k" fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("dividend")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[5]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Balance sheet criteria" next="DOWN j" ' +
        'prev="UP k" fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("balancesheetratios")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[6]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Stock metrics criteria" next="DOWN j" ' +
        'prev="UP k" fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("stockmetrics")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[7]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Margins criteria" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("margins")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[8]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

    '<list title="Growth criteria" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readCriteriaExplanation">' +
        'id("growth")//a' +
      '</item>' +

      '<target title="Load CNR and go to section" ' +
          'trigger="listEntry" ' +
          'action="CALL:axsFinance.readCurrentCriteriaList">' +
        '//table[@class="searchtabs"]//tr[9]//a' +
      '</target>' +

      '<target title="Add selected criteria" hotkey="ENTER" ' +
          'action="CALL:axsFinance.addCriteria">' +
        'id("criteria_button")/button' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * Stores the last list index to enable handling the multiple list that compose 
 * the results as a table i.e. traversal is performed column by column on the 
 * same row (i.e. the current row does not change)
 */
axsFinance.previousIdx = -1;

/**
 * Stores the last visited criteria row. Needed for reseting the row to its
 * default visual representation upon leaving the criteria list.
 * @type {Object?}
 */
axsFinance.lastCriteriaRow = null;

/**
 * Buffer for queuing TTS messages 
 * @type {string} 
 */
axsFinance.messageBuffer = '';

/**
 * Array for presenting the stock screener description
 * @type {Array}
 */
axsFinance.stockScreenerDescArray = new Array('',
                                            axsFinance.str.MIN,
                                            axsFinance.str.MAX);

/**
 * Flag indicating completion of the initial loading of the page
 * @type {boolean} 
 */
axsFinance.initComplete = false;

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.PE_ABR] = axsFinance.str.PE;
axsFinance.phrasesMap[axsFinance.str.FWD_PE_ABR] = axsFinance.str.FWD_PE;
axsFinance.phrasesMap[axsFinance.str.EPS_ABR] = axsFinance.str.EPS;
axsFinance.phrasesMap[axsFinance.str.WEEK_HIGH_ABR] = axsFinance.str.WEEK_HIGH;
axsFinance.phrasesMap[axsFinance.str.WEEK_QC_ABR] = axsFinance.str.WEEK_QC;
axsFinance.phrasesMap[axsFinance.str.WEEK_LOW_ABR] = axsFinance.str.WEEK_LOW;
axsFinance.phrasesMap[axsFinance.str.WEEK_PC_ABR] = axsFinance.str.WEEK_PC;
axsFinance.phrasesMap[axsFinance.str.FIVE_Y_PE_ABR] = axsFinance.str.FIVE_Y_PE;
axsFinance.phrasesMap[axsFinance.str.TEN_Y_PE_ABR] = axsFinance.str.TEN_Y_PE;

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsFinance.charPrefixMap = new Object();
axsFinance.charPrefixMap[axsFinance.str.MINUS_ABR] = axsFinance.str.MINUS;
axsFinance.charPrefixMap[axsFinance.str.UP_ABR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsFinance.charSuffixMap = new Object();
axsFinance.charSuffixMap[axsFinance.str.BILLION_ABR] = axsFinance.str.BILLION;
axsFinance.charSuffixMap[axsFinance.str.MILLION_ABR] = axsFinance.str.MILION;
axsFinance.charSuffixMap[axsFinance.str.PERCENT_ABR] = axsFinance.str.PERCENT;

/**
 * These are strings to be spoken to the user
 */
axsFinance.HELP = 'The following shortcut keys are available. ';

/**
 * Time out for processing events accepted by watched nodes
 */
axsFinance.EVT_HANDL_TIMEOUT_INT = 300;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object for the 'Criteria' section. 
 * Provides page navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObjCrit = null;

/**
 * The AxsJAX navigation object for the 'Criteria wizard' section. 
 * Provides page navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObjWiz = null;

/**
 * The AxsJAX navigation object for the 'Results' section. 
 * Provides page navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObjRes = null;

/**
 * Handle to the currently active AxsNav object.
 * @type {AxsNav?}
 */
axsFinance.activeAxsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsFinance.axsLensObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsFinance.axsSoundObj = null;

/**
 * The power key object used for quick search
 * @type {Object?} 
 */
axsFinance.pkResultSearchObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid 
 * actions in the 'Criteria' section.
 * @type {PowerKey?}
 */
axsFinance.pkObjCrit = null;

/**
 * The PowerKey object that shows an auto completion element for valid 
 * actions in the 'Criteria wizard' section.
 * @type {PowerKey?}
 */
axsFinance.pkObjWiz = null;

/**
 * The PowerKey object that shows an auto completion element for valid 
 * actions in the 'Results' section.
 * @type {PowerKey?}
 */
axsFinance.pkObjRes = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

/**
 * Map for flags indicating if a handler for an event has been triggered
 * @type {Object}
 */
axsFinance.eventHandlerToEventMap = new Object();

/**
 * Stores the index of the previous list in the 'Results' section. Each column
 * of the results table is a separate list. However, the user can navigate in
 * the results table using the arrows and this separation in lists is
 * transparent. This index helps identifying when to play a wrap sound while
 * switching the lists.
 */
axsFinance.prevNavListIdx = 0;

/**
 * Flag indicating if the search criteria has been modified 
 * i.e. a category has been added or removed.
 */
axsFinance.searchCriteriaModified = false;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsFinance.initAxsJAX = function() {
  //Remove the handler that detects the page load
  window.removeEventListener('DOMNodeInserted', axsFinance.init, true);

  //Initialize the AxsJAX framework utilities
  axsFinance.axsJAXObj = new AxsJAX(true);
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
  axsFinance.axsSoundObj = new AxsSound(true);

  //AxsNav for the 'Criteria' section
  axsFinance.axsNavObjCrit = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObjCrit.setLens(axsFinance.axsLensObj);
  axsFinance.axsNavObjCrit.navInit(axsFinance.CRITERIA_CNR, null);
  axsFinance.axsNavObjCrit.setSound(axsFinance.axsSoundObj);
  axsFinance.pkObjCrit = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObjCrit.setPowerKey(axsFinance.pkObjCrit, '.');
  axsFinance.axsNavObjCrit.disableNavKeys();

  //AxsNav for the 'Criteria wizard' section
  axsFinance.axsNavObjWiz = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObjWiz.setLens(axsFinance.axsLensObj);
  axsFinance.axsNavObjWiz.navInit(axsFinance.WIZARD_CNR, null);
  axsFinance.axsNavObjWiz.setSound(axsFinance.axsSoundObj);
  axsFinance.pkObjWiz = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObjWiz.setPowerKey(axsFinance.pkObjWiz, '.');
  axsFinance.axsNavObjWiz.disableNavKeys();

  //AxsNav for the 'Results' section
  axsFinance.axsNavObjRes = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObjRes.setLens(axsFinance.axsLensObj);
  axsFinance.buildAndLoadResultCNRAndPowerKey(false);
  axsFinance.axsNavObjRes.setSound(axsFinance.axsSoundObj);
  axsFinance.axsNavObjRes.disableNavKeys();

  //Set the active AxsNav object
  axsFinance.setActiveAxsNavObjCrit();

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);

  var func = axsFinance.DOMSubtreeModifiedEventDispatch;
  document.addEventListener('DOMSubtreeModified', func, true);

  func = axsFinance.criteriaRowInsertedEventHandler;
  document.addEventListener('DOMNodeInserted', func, true);

  //Some style sheets are modified for improving presentation
  axsFinance.customizeStyleSheets();

  //Blur the element selected by default
  axsFinance.removeDefaultFocus();

  //Instrument the rows in the criteria list
  axsFinance.instrumentCriteriaSectionDOM();

  //Announce the initial results
  axsFinance.announceSummary();

  axsFinance.initComplete = true;
};

/**
 * Instruments a the DOM of the initially loaded rows in the 'Criteria' section.
 */
axsFinance.instrumentCriteriaSectionDOM = function() {
  var xPath = 'id("criteria_rows_tbody")/tr[@id]';
  var citeriaRows = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  for (var i = 0, citeriaRow; citeriaRow = citeriaRows[i]; i++) {
    axsFinance.instrumentCriteriaRow(citeriaRow);
  }
};

/**
 * Blurs the input focused in the default initialization scripts of the page.
 */
axsFinance.removeDefaultFocus = function() {
  var xPath = '(//input[contains(@id, "_left")])[1]';
  var input = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  input.blur();
};

/**
 * Handler for added and removed nodes in the document. If the node,
 * source of the event, is mapped to a function, the function is
 * executed. Otherwise, no action is taken.
 * @param {Event} evt DOMNodeRemoved or DOMNodeInserted event
 */
axsFinance.criteriaRowInsertedEventHandler = function(evt) {
  var target = evt.target;
  //Add listeners to the input fields of each added criteria row (node)
  if (evt.type == 'DOMNodeInserted' &&
      target.tagName == 'TR' &&
      target.id.indexOf('row_') === 0) {
    axsFinance.instrumentCriteriaRow(target);
  }
};

/**
 * Instrument the DOM of a row in the 'Criteria' list.
 * @param {Node} criteriaRow The DOM node of the row.
 */
axsFinance.instrumentCriteriaRow = function(criteriaRow) {
  var func = function(evt) {
               if (evt.keyCode == 13) { // ENTER
                 axsFinance.axsJAXObj.lastFocusedNode.blur();
               }
             };

  var minInput = criteriaRow.childNodes[1].firstChild;
  minInput.addEventListener('keypress', func, false);

  var maxInput = criteriaRow.childNodes[3].firstChild;
  maxInput.addEventListener('keypress', func, false);

  minInput.addEventListener('focus', axsFinance.focusEventHandler, false);

  //Change inputs' titles. The screen reader will read graspable text upon TAB
  var criteria = criteriaRow.childNodes[0].textContent;
  criteria = axsFinance.parseSpecChrsAndTkns(criteria) + ', ';
  minInput.title = criteria + ' ' + axsFinance.str.MIN;
  maxInput.title = criteria + ' ' + axsFinance.str.MAX;
};

/**
 * Handler for the focus event of the main edit field of the criteria.
 * Needed for avoiding reading of the first input field upon the page
 * initialization.
 * @param {Event} evt A focus event
 */
axsFinance.focusEventHandler = function(evt) {
  if (!axsFinance.initComplete) {
    //Interrupt the screen reader
    axsFinance.axsJAXObj.speakTextViaNode(' ');
    axsFinance.axsJAXObj.lastFocusedNode.blur();
  }
};

/**
 * Handles the DOMSubtreeModified event.
 * This event happens when the selected node for the
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event
 */
axsFinance.DOMSubtreeModifiedEventDispatch = function(evt) {
  var target = evt.target;

  if (target.id == 'criteria_rows_tbody') {
    var func = axsFinance.searchCriteriaEventHandler;
    axsFinance.executeFunctionAfterMostRecentEvent(func, evt);
  } else if (target.id == 'searchresults') {
    func = axsFinance.messageBufferEventHandler;
    axsFinance.executeFunctionAfterMostRecentEvent(func, evt);
  } else if (target.id == 'ac-list') {
    axsFinance.autoCompletionEventHandler(evt);
  }
};

/**
 * Event handler for refreshing the 'Criteria list' list in the 
 * 'Criteria' section.
 * @param {Event?} evt A DOMSubtreeModified event.
 */
axsFinance.searchCriteriaEventHandler = function(evt) {
  //TODO: 
  axsFinance.axsNavObjCrit.navInit(axsFinance.CRITERIA_CNR, null);
  axsFinance.refreshStockCriteria();
};

/**
 * Event handler for announcing the search summary and refreshing
 * the lists in the 'Results' section.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.messageBufferEventHandler = function(evt) {
  axsFinance.refreshAllResultLists();

  //Remove the focus and clear lens
  var lastFocusedNode = axsFinance.axsJAXObj.lastFocusedNode;
  if (lastFocusedNode && lastFocusedNode.blur) {
    axsFinance.axsLensObj.view(null);
    axsFinance.axsJAXObj.lastFocusedNode.blur();
  }

  axsFinance.announceSummary();
};

/**
 * Event handler for speaking the current option in the auto 
 * completion search box.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.autoCompletionEventHandler = function(evt) {
  var target = evt.target;
  for (var i = 0, child; child = target.childNodes[i]; i++) {
    if (child.className == 'selected') {
      axsFinance.axsJAXObj.speakNode(child);
      return;
     }
   }
};

/**
 * Executes a function mapped to an event. Since some events are generated
 * too frequently, taking actions on each event may cause significant
 * overhead. This method is mapping the event in the function call to a
 * handling function. Also the event has a timestamp indicating the time for
 * planned execution (obtained by adding an offset to the current system time)
 * of the function to which it is mapped (and will potentially handle it).
 * The handling function is executed after the event timestamp expires.
 * Subsequent requests for executing the same function remap the function to the
 * event parameter in the call and the event timestamp is set as described
 * above. After execution of the mapped function its mapping to an event is
 * removed. Such an implementation ensures processing the last event mapped to
 * the handling function after a certain timeout.
 *
 * @param {Function} func The handling function to execute.
 * @param {Event} evt Event to be propagated to the handlingFunction.
 */
 axsFinance.executeFunctionAfterMostRecentEvent = function(func, evt) {
  if (axsFinance.eventHandlerToEventMap[func.toString()]) {
    evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
    axsFinance.eventHandlerToEventMap[func.toString()] = evt;
    return;
  }

  evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
  axsFinance.eventHandlerToEventMap[func.toString()] = evt;

  var delegFunc = function() {
      var currentTime = new Date().getTime();
      var key = func.toString();
      var event = axsFinance.eventHandlerToEventMap[key];

      if (event.timeToHandle > currentTime) {
        window.setTimeout(delegFunc, event.timeToHandle - currentTime);
      } else {
        //Check if the page is still loading => wait to complete    
        var loading = document.getElementsByClassName('weaver-loading')[0];
        if (loading) {
          window.setTimeout(delegFunc, axsFinance.EVT_HANDL_TIMEOUT_INT);
        } else { //Execute the handling function
          func(event);
          axsFinance.eventHandlerToEventMap[func.toString()] = null;
        }
      }
  };

   window.setTimeout(delegFunc, axsFinance.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Change some properties of the style sheets to improve 
 * presentation for people with reduced vision.
 */
axsFinance.customizeStyleSheets = function() {
  var cssRule = document.styleSheets[0].cssRules[36];
  cssRule.style.font = '30px arial';
};

/**
 * Focuses on a drop down list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.focusOnDropDownList = function(item) {
  var element = item.elem;
  axsFinance.axsLensObj.view(element.parentNode);
  var title = axsFinance.axsNavObjCrit.currentList().title;

  axsFinance.speakAndGo(element, title);
};

/**
 * Reads the values in a drop down lists (Region, Exchange, Sector)
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readDropDownListItem = function(item) {
  var element = item.elem;
  axsFinance.speakAndGo(element, element.textContent);
};

/**
 * Selects an option from a drop down list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.selectDropDownListOption = function(item) {
  var option = axsFinance.axsNavObjCrit.currentItem().elem;
  option.selected = true;
  axsFinance.axsLensObj.view(null);

  var text = option.value + ' ' + axsFinance.str.SELECTED;
  axsFinance.axsJAXObj.speakTextViaNode(text);
};

/**
 * Refreshes the Stock criteria list.
 */
axsFinance.refreshStockCriteria = function() {
  axsFinance.axsNavObjCrit.refreshList(axsFinance.str.CRITERIA_LIST);
  window.setTimeout(function() {
      var lastFocusedNode = axsFinance.axsJAXObj.lastFocusedNode;
      if (lastFocusedNode && lastFocusedNode.blur) {
        lastFocusedNode.blur();
      }
    },
    0);
};

/**
 * Adds a new selected criteria to the criteria list
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.addCriteria = function(item) {
  var element = item.elem;

  //The button is not disabled and made invisible but is moved to (0, 0)
  var text = axsFinance.str.CRIT_ALREADY_ADDED;
  if (element.offsetTop > 0) {
    axsFinance.axsJAXObj.clickElem(element, false);
    axsFinance.searchCriteriaModified = true;

    axsFinance.axsJAXObj.speakTextViaNode('');
    text = axsFinance.str.CRIT_ADDED;
  }
  axsFinance.messageBuffer = axsFinance.messageBuffer + ' ' + text;
};

/**
 * Removes a criteria and announces the deletion
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.removeCriteria = function(item) {
  var element = item.elem;
  axsFinance.axsJAXObj.clickElem(element, false);
  axsFinance.searchCriteriaModified = true;

  var text = axsFinance.str.CRIT_DELETED;
  axsFinance.messageBuffer = axsFinance.messageBuffer + ' ' + text;
};

/**
 * Reads the description of a criteria from the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCriteriaDesc = function(item) {
  var element = item.elem;

  //Remove the section explaining the criteria from the view (if present)
  axsFinance.axsJAXObj.clickElem(element, false);

  //Rest the the last criteria row
  axsFinance.resetCriteriaRow();
  axsFinance.lastCriteriaRow = element;

  var criteria = element.childNodes[0].textContent;
  criteria = axsFinance.parseSpecChrsAndTkns(criteria) + ', ';
  var min = element.childNodes[1].childNodes[0].value;
  min = axsFinance.parseSpecChrsAndTkns(min) + ', ';
  var max = element.childNodes[3].childNodes[0].value;
  max = axsFinance.parseSpecChrsAndTkns(max) + ', ';

  var columnsText = new Array(criteria, min, max);
  var text = axsFinance.buildTableRowText(columnsText,
                                        axsFinance.stockScreenerDescArray);

  text = text + ' ' + axsFinance.str.ENTER_TO_EDIT;
  axsFinance.speakAndGo(element.firstChild, text);
};

/**
 * Reads the explanation of a certain criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCriteriaExplanation = function(item) {
  axsFinance.axsLensObj.view(null);
  var element = item.elem;
  var text = '';
  var xpath = 'id("add_criteria_wizard")//td[3]';
  axsFinance.axsJAXObj.clickElem(element, false);

  var descriptions = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
  var descriptionSection = descriptions[0];
  var definition = document.getElementById('criteria_definition').textContent;
  var statusNode = descriptionSection.childNodes[5];
  var criteriaStatus = axsFinance.str.NOT_ADDED;

  if (statusNode.className.indexOf('displaynone') == -1) {
    criteriaStatus = statusNode.textContent;
    axsFinance.axsSoundObj.play('alert');
  }

  text = element.textContent + ' ';
  text = text + ' ' + axsFinance.str.STATUS + ' ' + criteriaStatus;
  text = text + ', ' + axsFinance.str.DEFINITION + ' ' + definition;
  axsFinance.axsJAXObj.speakTextViaNode(text);
  axsFinance.axsLensObj.view(descriptions[0]);
};

/**
 * Moves the focus in the input fields for the currently edited criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.focusOnCriteriaRangeInput = function(item) {
  var rowElement = axsFinance.axsNavObjCrit.currentItem().elem;

  //Trigger the page event handler for mouse over a criteria row
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
  axsFinance.axsJAXObj.clickElem(minInput, false);

  minInput.focus();
  minInput.select();

  axsFinance.axsJAXObj.tabKeyFixOn = false;
};

/**
 * Reads the current criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCurrentCriteriaList = function(item) {
  //Reset the last criteria row (in the criteria list) to its default state
  axsFinance.resetCriteriaRow();

  var element = item.elem;
  axsFinance.axsJAXObj.clickElem(element, false);
  var listTitle = axsFinance.axsNavObjCrit.currentList().title;
  axsFinance.axsJAXObj.speakTextViaNode(listTitle);
  axsFinance.axsLensObj.view(element.parentNode.parentNode);
};

/**
 * Resets the last visited criteria row (if such exists) to its default
 * visual representation which is modified when the user focuses on that row.
 */
axsFinance.resetCriteriaRow = function() {
  axsFinance.axsJAXObj.tabKeyFixOn = true;
  if (axsFinance.lastCriteriaRow !== null) {
    axsFinance.simulateMouseOutEvent(axsFinance.lastCriteriaRow);
  }
};

/**
 * Reads the help (explanation) description for a criteria in the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCriteriaHelp = function(item) {
  var element = item.elem;
  var descTitleNode = element.childNodes[0];
  var linkNode = element.childNodes[1];
  axsFinance.axsJAXObj.clickElem(linkNode, false);

  var xpath = '//div[@class="definition_title"]';
  var explNodes = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
  for (var i = 0, node; node = explNodes[i]; i++) {
  var explTitleNode = explNodes[i].firstChild;
  var descTitleText = axsFinance.normalizeString(descTitleNode.textContent);
  var explTitleText = axsFinance.normalizeString(explTitleNode.textContent);

  if (descTitleText == explTitleText) {
    var explTextNode = explNodes[i].nextSibling;
    axsFinance.axsJAXObj.speakTextViaNode(explTextNode.textContent);
    break;
  }
  }
};

/**
 * Refreshes the stock criteria list and announces its title.
 */
axsFinance.refreshStockCriteriaCNRAndAnnounceList = function() {
  //Rest the the last criteria row - current row in the criteria list
  axsFinance.resetCriteriaRow();

  var listTitle = axsFinance.axsNavObjCrit.currentList().title;
  axsFinance.axsJAXObj.speakTextViaNode(listTitle);

  var xpath = 'id("criteria_rows_tbody")/tr[1]/td[1]';
  var critHeader = axsFinance.axsJAXObj.evalXPath(xpath, document.body)[0];
  axsFinance.axsLensObj.view(critHeader);
  critHeader.scrollIntoView(true);
  axsFinance.axsJAXObj.markPosition(critHeader);
};

/**
 * Announcers a summary of the search results.
 */
axsFinance.announceSummary = function() {
  var text = '';
  if (!axsFinance.initComplete) {
    text = axsFinance.str.APP_NAME;
  }

  var summaryElem = document.getElementById('searchresultssummary');
  var resultElem = summaryElem.childNodes[5];
  var suffix = '';

  if (resultElem == undefined) {
      resultElem = summaryElem.childNodes[0];
  } else {
    var lowerIdx = summaryElem.childNodes[1].textContent;
    var upperIdx = summaryElem.childNodes[3].textContent;

    suffix = axsFinance.str.COMPANIES_FOUND + ',';
    suffix = suffix + ' ' + axsFinance.str.RESULTS_FROM;
    suffix = suffix + ' ' + lowerIdx + ' ' + axsFinance.str.TO + ' ' + upperIdx;
  }
  text = text + ' ' + resultElem.textContent + ' ' + suffix;
  text = axsFinance.normalizeString(text);

  var xPath = '//img[contains(@src, "sort_up.gif") or ' +
      'contains(@src, "sort_down.gif")]';
  var sortImage = axsFinance.axsJAXObj.evalXPath(xPath, document. body)[0];

  if (sortImage) {
    xPath = './following-sibling::a';
    var criteriaElem = axsFinance.axsJAXObj.evalXPath(xPath, sortImage)[0];
    var criteria = criteriaElem.textContent;

    text = text + ', ' + axsFinance.str.SORTED_BY + ' ' + criteria;
    if (sortImage.src.indexOf('up') > -1) {
      text = text + ' ' + axsFinance.str.IN_ASCENDING_ORDER;
    } else {
      text = text + ' ' + axsFinance.str.IN_DESCENDING_ORDER;
    }
  }

  if (axsFinance.messageBuffer !== '') {
    text = axsFinance.messageBuffer + ', ' + text;
    axsFinance.messageBuffer = '';
  }

  var func = function() {
            axsFinance.axsJAXObj.speakTextViaNode(text);
          };
  window.setTimeout(func, 0);
};

/**
 * Builds dynamically a CNR for the result section. Each column is a list
 * and the order of criteria in the Stock criteria section determines
 * (potentially changes) the order of columns in the result table.
 * @param {boolean} opt_readFirstResult If the first result in the table
 * should be read. If the parameter is omitted the default behavior is
 * reading the first result.
 */
axsFinance.buildAndLoadResultCNRAndPowerKey = function(opt_readFirstResult) {
  //Build dynamically the CNR file
  var xpath = 'id("searchresults")/table/tbody';
  var tables = axsFinance.axsJAXObj.evalXPath(xpath, document.body);

  if (tables[0] === undefined) {
    return;
  }

  var topRow = tables[0].childNodes[0];
  var columns = topRow.childNodes;
  var cnrString = axsFinance.RESULTS_CNR_TOP;

  for (var i = 0, column; column = columns[i]; i++) {
    var columnCaption = axsFinance.normalizeString(column.textContent);
    if (i == 1) {
      columnCaption = axsFinance.addSpaceBetweenChars(columnCaption);
    }
    if (columnCaption.length > 0) {
      var values = new Array(column.textContent, i + 1);
      var filledTmpl = axsFinance.populateTemplate(axsFinance.RESULTS_CNR_BODY,
                                                   values);
      cnrString = cnrString + filledTmpl;
    }
  }
  cnrString = cnrString + axsFinance.RESULTS_CNR_BOTTOM;

  axsFinance.axsNavObjRes.navInit(cnrString, null);
  //During initialization the AxsNav object becomes active => deactivate it
  axsFinance.axsNavObjRes.disableNavKeys();

  if (opt_readFirstResult === undefined || opt_readFirstResult) {
    axsFinance.readResultCellValue(axsFinance.axsNavObjRes.nextItem());
  }

  //We reinitialize the AxsNav object => restore the key binding
  axsFinance.pkObjRes = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObjRes.setPowerKey(axsFinance.pkObjRes, '.');

  //Clear the flag - now we have a CNR in synch with the criteria
  axsFinance.searchCriteriaModified = false;
};

/**
 * Focuses on and reads the appropriate entry in the results table. Since each
 * columns is managed as a list changing columns should keep the user
 * on the same row.
 */
axsFinance.readResultCellValueListEntry = function() {
  //Reset the the last criteria row
  axsFinance.resetCriteriaRow();

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  if (axsFinance.previousIdx > -1) {
    axsFinance.axsNavObjRes.navItemIdxs[navListIdx] = axsFinance.previousIdx;
  }

  var element = axsFinance.axsNavObjRes.currentItem().elem;
  var text = '';
  var columnValue = axsFinance.getCellValue(element);
  var title = axsFinance.axsNavObjRes.navArray[navListIdx].title;
  title = axsFinance.parseSpecChrsAndTkns(title);
  text = title + ' ' + columnValue;
  axsFinance.speakAndGo(element, text);

  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  var listsNmbr = axsFinance.axsNavObjRes.navArray.length;
  if ((axsFinance.prevNavListIdx === 0 && navListIdx === listsNmbr - 1) ||
      (axsFinance.prevNavListIdx === listsNmbr - 1 && navListIdx === 0)) {
    axsFinance.axsSoundObj.play(axsFinance.str.WRAP_SND);
  } else {
    axsFinance.axsSoundObj.play(axsFinance.str.ITEM_SND);
  }
  axsFinance.prevNavListIdx = navListIdx;
};

/**
 * Reads the value for a certain criteria from the results table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readResultCellValue = function(item) {
  var element = item.elem;
  var company = element.parentNode.childNodes[0].textContent;
  company = axsFinance.normalizeString(company);
  var text = company;

  if (element != element.parentNode.childNodes[0]) {
    var columnValue = axsFinance.getCellValue(element);
    text = text + ', ' + columnValue;
  }

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  axsFinance.previousIdx = axsFinance.axsNavObjRes.navItemIdxs[navListIdx];
  axsFinance.speakAndGo(item.elem, text);
};

/**
 * Returns the current value in a table cell.
 * @param {Object} tdElement A DOM node object representing the table cell.
 * @return {string} The value of the table cell.
 */
axsFinance.getCellValue = function(tdElement) {
  var columnValue = tdElement.textContent;
  if (tdElement == tdElement.parentNode.childNodes[1]) {
    columnValue = axsFinance.addSpaceBetweenChars(columnValue);
  } else if (tdElement == tdElement.parentNode.childNodes[0]) {
    columnValue = axsFinance.normalizeString(columnValue);
  } else {
    columnValue = axsFinance.parseSpecChrsAndTkns(columnValue);
  }
  return columnValue;
};

/**
 * Positions the focus on the row with company name found by PowerKey.
 * We treat the company name as a row title.
 * NOTE: The column in which the user is does not change.
 */
axsFinance.goToRow = function() {
  var items = axsFinance.axsNavObjRes.navArray[0].items;
  var elementNames = new Array();

  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }

  var promptString = axsFinance.str.SEARCH_COMPANY;
  axsFinance.goToItem(axsFinance.pkVerticalSearchHandler,
                    elementNames,
                    promptString);
};

/**
 * Positions the focus on the column with criteria name found by PowerKey.
 * We use the table column names.
 * NOTE: The row in which the user is does not change.
 */
axsFinance.goToColumn = function() {
  var xpath = 'id("searchresults")//tr[1]/td[@class="top_row"]';
  var elements = axsFinance.axsJAXObj.evalXPath(xpath, document.body);
  var elementNames = new Array();

  for (var i = 0, element; element = elements[i]; i++) {
    elementNames[i] = element.textContent;
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA;
  axsFinance.goToItem(axsFinance.pkHorizontalSearchHandler,
                    elementNames,
                    promptString);
};

/**
 * Positions the focus on a column cell with value found by PowerKey.
 * NOTE: The column in which the user is does not change.
 */
axsFinance.goToValueInColumn = function() {
  var items = axsFinance.axsNavObjRes.currentList().items;
  var elementNames = new Array();

  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA_VALUE;
  axsFinance.goToItem(axsFinance.pkVerticalSearchHandler,
                    elementNames,
                    promptString);
};

/**
 * Positions the focus on a row cell with value found by PowerKey.
 * NOTE: The row in which the user is does not change.
 */
axsFinance.goToValueInRow = function() {
  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  var rowIndex = axsFinance.axsNavObjRes.navItemIdxs[navListIdx];
  var elementNames = new Array();

  for (var i = 0, list; list = axsFinance.axsNavObjRes.navArray[i]; i++) {
    elementNames[i] = list.items[rowIndex].elem.textContent;
  }

  var promptString = axsFinance.str.SEARCH_CRITERIA_BY_VALUE;
  axsFinance.goToItem(axsFinance.pkHorizontalSearchHandler,
                    elementNames,
                    promptString);
};

/**
 * Enables PowerKey search from element names and in case of a successful
 * search delegates to a handler.
 * @param {Function} handler Handler to process the found element.
 * @param {Array} elementNames The array of names searched by PowerKey.
 * @param {string} promptString The prompt message shown in the PowerKey
 * input box.
 */
axsFinance.goToItem = function(handler, elementNames, promptString) {
  //Initialize
  axsFinance.pkResultSearchObj = new PowerKey('list', axsFinance.axsJAXObj);
  var body = axsFinance.axsJAXObj.getActiveDocument().body;
  axsFinance.pkResultSearchObj.createCompletionField(body,
                                                   30,
                                                   handler,
                                                   null,
                                                   elementNames,
                                                   false);

  axsFinance.pkResultSearchObj.setCompletionPromptStr(promptString);
  axsFinance.pkResultSearchObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  axsFinance.pkResultSearchObj.updateCompletionField('visible', true, 40, 20);
};

/**
 * Positions the user in a result table column with index found by PowerKey
 * and at the same time keeps the current row.
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsFinance.pkHorizontalSearchHandler = function(command, index, id, args) {
  axsFinance.axsNavObjRes.lastItem = null;
  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  var itemIndex = axsFinance.axsNavObjRes.navItemIdxs[navListIdx];
  axsFinance.axsNavObjRes.navListIdx = index;
  axsFinance.axsNavObjRes.navItemIdxs[index] = itemIndex;

  var item = axsFinance.axsNavObjRes.currentItem();
  axsFinance.axsNavObjRes.actOnItem(item);
};

/**
 * Positions the user in a row cell that contains value that found
 * during the power key search. (i.e. search by column value)
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsFinance.pkVerticalSearchHandler = function(command, index, id, args) {
  axsFinance.axsNavObjRes.lastItem = null;
  var navListIdx = axsFinance.axsNavObjRes.navListIdx;
  axsFinance.axsNavObjRes.navItemIdxs[navListIdx] = index;

  var item = axsFinance.axsNavObjRes.currentItem();
  axsFinance.axsNavObjRes.actOnItem(item);
};

/**
 * Refreshes all lists in the CNR. Such an action is required upon
 * a dynamic change in the data presented by these lists.
 */
axsFinance.refreshAllResultLists = function() {
  var navArray = axsFinance.axsNavObjRes.navArray;
  for (var i = 0, list; list = navArray[i]; i++) {
    axsFinance.axsNavObjRes.refreshList(list.title);
  }
};

/**
 * Wraps around an item list traversed with the fwd and back keys
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.wrapAround = function(item) {
  var element = item.elem;
  if (element.tagName == 'A') {
    axsFinance.axsJAXObj.clickElem(element, false);
  } else {
    var currentItem = axsFinance.axsNavObjCrit.currentItem();
    axsFinance.axsNavObjCrit.actOnItem(currentItem);
  }
};

/**
 * Sets setActiveAxsNavObjCrit as active.
 */
axsFinance.setActiveAxsNavObjCrit = function() {
  axsFinance.closeCriteriaWizard();

  var currentItem = axsFinance.axsNavObjCrit.currentItem();
  if (currentItem) {
    axsFinance.axsLensObj.view(currentItem.elem);
  } else {
    axsFinance.axsLensObj.view(null);
  }

  axsFinance.setActiveAxsNavObj(axsFinance.axsNavObjCrit);
  axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.CRIT_SECT_ACTIVE);
};

/**
 * Sets setActiveAxsNavObjWiz as active.
 */
axsFinance.setActiveAxsNavObjWiz = function() {
  axsFinance.openCriteriaWizard();

  var currentItem = axsFinance.axsNavObjWiz.currentItem();
  if (currentItem) {
    axsFinance.axsLensObj.view(currentItem.elem);
  } else {
    axsFinance.axsLensObj.view(null);
  }

  axsFinance.setActiveAxsNavObj(axsFinance.axsNavObjWiz);
  axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.WIZ_SECT_ACTIVE);
};

/**
 * Sets setActiveAxsNavObjRes as active.
 */
axsFinance.setActiveAxsNavObjRes = function() {
  //Rebuild the CNR if the criteria has been modified
  if (axsFinance.searchCriteriaModified) {
    axsFinance.buildAndLoadResultCNRAndPowerKey(false);
    axsFinance.searchCriteriaModified = false;
  }

  var currentItem = axsFinance.axsNavObjRes.currentItem();
  if (currentItem) {
    axsFinance.axsLensObj.view(currentItem.elem);
  } else {
    axsFinance.axsLensObj.view(null);
  }

  axsFinance.setActiveAxsNavObj(axsFinance.axsNavObjRes);
  axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.RES_SECT_ACTIVE);
};

/**
 * Sets the active AxsNav object.
 * @param {AxsNav} axsNavObj The AxsNav object to be set as active.
 */
axsFinance.setActiveAxsNavObj = function(axsNavObj) {
  if (axsFinance.activeAxsNavObj !== null) {
    axsFinance.activeAxsNavObj.disableNavKeys();
  }

  axsNavObj.enableNavKeys();
  axsFinance.activeAxsNavObj = axsNavObj;
};

/**
 * Opens the 'Criteria wizard'.
 */
axsFinance.openCriteriaWizard = function() {
  var xPath = 'id("action_links")/a[@class="activelink"]';
  var wizardLink = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  axsFinance.axsJAXObj.clickElem(wizardLink, false);
  axsFinance.axsLensObj.view(null);
};

/**
 * Closes the 'Criteria wizard' if it is opened.
 */
axsFinance.closeCriteriaWizard = function() {
  var actionLinksElem = document.getElementById('action_links');

  //If the criteria wizard is opened
  if (actionLinksElem.style.display == 'none') {
    var xPath = 'id("add_criteria_wizard")/div/a[1]';
    var wizardLink = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
    axsFinance.axsJAXObj.clickElem(wizardLink, false);
  }
};

/**
 * Populates a template replacing special tokens (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate
 * @param {Array} values The array with replacement (concrete) values
 * @return {string} The string generated from populating the template
 */
axsFinance.populateTemplate = function(template, values) {
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
axsFinance.simulateMouseOutEvent = function(targetNode) {
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
 * Adds white spaces between the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its
 * characters.
 */
axsFinance.addSpaceBetweenChars = function(text) {
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
axsFinance.speakAndGo = function(element, text) {
  axsFinance.axsLensObj.view(element);
  axsFinance.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsFinance.axsJAXObj.markPosition(element);
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content.
 * @param {Array?} textContents Array with the contents of table columns.
 * @param {Array} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsFinance.buildTableRowText = function(textContents, columnDesc) {
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
axsFinance.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';

  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = axsFinance.normalizeString(text);

  //check for phrase word mapping
  var phraseMapping = axsFinance.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //check for whole word mapping
    var tokenMapping = axsFinance.phrasesMap[token];
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
      var prefixMapping = axsFinance.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }

      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsFinance.charSuffixMap[lastCharacter];
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
 * characters are replaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized version of the text
 */
axsFinance.normalizeString = function(text) {
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
axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsFinance.axsJAXObj.inputFocused) {
    return true;
  }
  var command = axsFinance.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }

  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *           that the keycode has been handled.
 */
axsFinance.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
     document.getElementById('searchbox').focus();
     document.getElementById('searchbox').select();
     return false;
   },
  // ? (question mark)
  63 : function() {
     var helpStr = axsFinance.HELP +
         axsFinance.axsNavObjCrit.localHelpString() +
         axsFinance.axsNavObjCrit.globalHelpString();
     axsFinance.axsJAXObj.speakTextViaNode(helpStr);
     return false;
  }
};

/**
 * Invokes the AxsJAX initialization routine after the last element
 * has been inserted in the DOM.
 * @param {Event} evt A DOMNodeInserted event.
 */
axsFinance.init = function(evt) {
  if (evt.target.className == 'nav') {
    axsFinance.initAxsJAX();
  }
};

//Run the initialization routine after the page loading is completed.
//NOTE: Looking for the 'load' event does not guarantee load completion.
window.addEventListener('DOMNodeInserted', axsFinance.init, true);
