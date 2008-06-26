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

//String literals
axsStock.EMPTY_STRING = '';
axsStock.SYMBOL_STRING = 'Symbol,';
axsStock.MKT_CAP_STRING = 'Market cap,';
axsStock.P_E_STRING = 'Price earnings ratio,';
axsStock.DIVID_STRING = 'Divident yield,';
axsStock.WEEK_P_STRING = 'percent; 52 week price change,';
axsStock.PERCENT_STRING = 'percent';
axsStock.MIN_STRING = 'Min,';
axsStock.MAX_STRING = 'Max,';
axsStock.COMPANIES_FOUND_STRING = 'companies found';
axsStock.WIZ_OP_MSG_STRING = 'Criteria wizard opened';
axsStock.WIZ_CL_MSG_STRING = 'Criteria wizard closed';
axsStock.DESCENDING_STRING = 'descending';
axsStock.ASCENDING_STRING = 'ascending';
axsStock.RESULTS_FROM_STRING = 'results from';
axsStock.TO_STRING = 'to';
axsStock.STOCK_SCR_STRING = 'Stock screener';
axsStock.RESULTS_STRING = 'Results';
axsStock.CRIT_ALREADY_STRING = 'Criteria already added';
axsStock.CRIT_ADDED_STRING = 'Criteria added';
axsStock.NOT_ADDED_STRING = 'Not added';
axsStock.STATUS_STRING = 'Status';
axsStock.DEFINITION_STRING = 'Definition';

axsStock.UP_STRING = ' up by ';
axsStock.UP_ABR_STRING = '+';
axsStock.MINUS_STRING = ' minus ';
axsStock.MINUS_ABR_STRING  = '-';
axsStock.PRCNT_STRING = ' percent';
axsStock.PRCNT_ABR_STRING = '%';
axsStock.MLN_STRING = ' million';
axsStock.MLN_ABR_STRING = 'M';
axsStock.BLN_STRING = ' billion';
axsStock.BLN_ABR_STRING  = 'B';
axsStock.INC_STRING = 'Incorporated';
axsStock.INC_ABR_STRING = 'Inc.';
axsStock.CO_STRING = 'Company';
axsStock.CO_ABR_STRING = 'Co.';
axsStock.LTD_STRING = 'Limited';
axsStock.LTD_ABR_STRING = 'Ltd';
axsStock.EPS_STRING = 'E P S'; 
axsStock.EPS_ABR_STRING = 'EPS'; 
axsStock.WEEK_HIGH_STRING = 'Fifty two week high';
axsStock.WEEK_HIGH_ABR_STRING = '52w High';
axsStock.WEEK_QC_STRING = 'Quote change percent';
axsStock.WEEK_QC_ABR_STRING = 'Quote Change (%)';
axsStock.WEEK_LOW_STRING = 'Fifty two week low';
axsStock.WEEK_LOW_ABR_STRING = '52w Low';
axsStock.WEEK_PC_STRING = 'Fifty two week price change percent';
axsStock.WEEK_PC_ABR_STRING = '52w Price Change (%)';
axsStock.PE_STRING = 'P E ratio';
axsStock.PE_ABR_STRING = 'P/E Ratio';
axsStock.FWD_PE_ABR_STRING = '1y Fwd P/E';
axsStock.FWD_PE_STRING = 'One year forward P E';
axsStock.FY_PE_ABR_STRING = '5y';
axsStock.FY_PE_STRING = '5 year';
axsStock.TY_PE_ABR_STRING = '10y';
axsStock.TY_PE_STRING = '10 year';
axsStock.APP_NAME_STRING = 'Stock screener, ';
axsStock.CRITERIA_STRING = 'Criteria';
axsStock.DELETED_STRING = 'deleted';
axsStock.ST_SCR_CNR_STRING = 'Screener';
axsStock.RES_CNR_STRING = 'Results';

//XPath strings
axsStock.R_TBL_XPATH = 'id("searchresults")/table/tbody';
axsStock.SS_TBL_XPATH = 'id("criteria_rows_tbody")';
axsStock.WIZ_OP_LINK_XPATH = 'id("action_links")/a[@class="activelink"]';
axsStock.WIZ_CL_LINK_XPATH = 'id("add_criteria_wizard")/div/a[1]';
axsStock.WIZ_CL_SECTION_XPATH = 'id("action_links")';
axsStock.WIZ_EXPL_XPATH = 'id("add_criteria_wizard")//td[3]';
axsStock.SUMMARY_XPATH = 'id("searchresultssummary")';
axsStock.STOCK_SCR_XPATH = 'id("criteria_rows_tbody")/tr[1]/td[1]';
axsStock.EXPL_NODES_XPATH = '//div[@class="definition_title"]';
axsStock.CRTITERIA_MAX_XPATH = './..//following-sibling::*/input';
axsStock.COMPANIES_XPATH = 'id("searchresults")//td[1]/a';

//String templates
axsStock.SORT_ORDER_STRING = 'Column {0} sorted in {1} order.';

//Top section of the Results CNR which is dynamically generated
axsStock.CNR_RES_TOP_STRING = "<cnr next='RIGHT l' prev='LEFT h'>" + '\n' +
    
    "<target title='Go to the stock screener section' hotkey='s' " +
        "action='CALL:axsStock.loadStockScreenerCNRAndScroll'>" +
      "/html" +
    "</target>" +
    
    "<target title='Search company' hotkey='f' " +
        "action='CALL:axsStock.goToCompanyRow'>" +
      "/html" +
    "</target>";
    
//Bottom section of the Results CNR which is dynamically generated
axsStock.CNR_RES_BTM_STRING = "</cnr>";

//Body section of the Results CNR which is a template applied for each column
axsStock.CNR_RES_STRING = "<list title='{0}' fwd='DOWN j n' back='UP k p' " +
		    "type='dynamic'>" +

    "<item action='CALL:axsStock.readCriteriaValue'>" +
      "id('searchresults')/table[@class='results innermargin']//tr/td[{1}]" +
      "[not(@class='top_row') and not(@class='bottom_row')]" +
    "</item>" +

    "<target title='Go to section' trigger='listEntry' " +
        "action='CALL:axsStock.focusOnCurrentTableCell'>" +
      "id('criteria_rows')" +
    "</target>" +

    "<target title='Go to link' hotkey='ENTER' onEmpty='No link available'>" +
      ".//a" +
    "</target>" +

    "<target title='Next page' trigger='listTail' " +
        "action='CALL:axsStock.wrapAround'>" +
      "id('searchresults')//td[position() > 1]//span[@class='navb']/..  " +
          " | //div[@class='footerLinks']" +
    "</target>" +

    "<target title='Previous page' trigger='listHead' " +
        "action='CALL:axsStock.wrapAround'>" +
      "id('searchresults')//td[1]//span[@class='navb']/.. " +
          "| //div[@class='footerLinks']" +
    "</target>" +

    "<target title='Reverse sorting order' hotkey='r' onEmpty='This column is" +
        "not sortable' action='CALL:axsStock.gotToTopOfListAndClickLink'>" +
      "id('searchresults')//td[{1}]/a[@class='activelink']" +
    "</target>" +

  "</list>";

axsStock.CNR_ST_SCR_STRING = "<cnr next='RIGHT l' prev='LEFT h'>" +

    "<target title='Go to the results section' hotkey='s' " +
        "action='CALL:axsStock.buildAndLoadResultTableCNR'>" +
      "/html" +
    "</target>" +

    "<target title='Open and close criteria wizard' hotkey='w' " +
        "action='CALL:axsStock.openCloseWizard'>" +
      "id('action_links')" +
    "</target>" +

    "<target title='Reset to default criteria' hotkey='d'>" +
      "id('action_links')//a[not(@class)]" +
    "</target>" +
    
    "<target title='Search company' hotkey='f' " +
        "action='CALL:axsStock.goToCompanyRow'>" +
      "/html" +
    "</target>" +

    "<list title='Region' next='DOWN j' prev='UP k' fwd='n' back='p' " +
        "type='dynamic'>" +

      "<item action='CALL:axsStock.readDropDownListItem'>" +
        "id('regionselect')//option" +
      "</item>" +

      "<target title='Focus on region' trigger='listEntry' " +
          "action='CALL:axsStock.focusOnDropDownList'>" +
        "id('regionselect')" +
      "</target>" +

      "<target title='Select region' hotkey='ENTER' " +
          "action='CALL:axsStock.selectDropDownListOption'>" +
        "/html" +
      "</target>" +

    "</list>" +

    "<list title='Exchange' next='DOWN j' prev='UP k' fwd='n' back='p' " +
        "type='dynamic'>" +

      "<item action='CALL:axsStock.readDropDownListItem'>" +
        "id('exchangeselect')//option" +
      "</item>" +

      "<target title='Focus on exchange' trigger='listEntry' " +
          "action='CALL:axsStock.focusOnDropDownList'>" +
        "id('exchangeselect')" +
      "</target>" +

      "<target title='Select exchange' hotkey='ENTER' " +
          "action='CALL:axsStock.selectDropDownListOption'>" +
        "/html" +
      "</target>" +

    "</list>" +

    "<list title='Sector' next='DOWN j' prev='UP k' fwd='n' back='p' " +
        "type='dynamic'>" +

      "<item action='CALL:axsStock.readDropDownListItem'>" +
        "id('sectorselect')//option" +
      "</item>" +

      "<target title='Focus on sector' trigger='listEntry' " +
          "action='CALL:axsStock.focusOnDropDownList'>" +
        "id('sectorselect')" +
      "</target>" +

      "<target title='Select sector' hotkey='ENTER' " +
          "action='CALL:axsStock.selectDropDownListOption'>" +
        "/html" +
      "</target>" +

    "</list>" +

    "<list title='Criteria list' next='DOWN j' prev='UP k' fwd='n' back='p' " +
        "type='dynamic'>" +

      "<item action='CALL:axsStock.readStockScreenrDesc'>" +
        "id('criteria_rows_tbody')/tr[not(.//b)]" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.refreshStockCriteriaCNRAndAnnounceList'>" +
        "id('criteria_rows')" +
      "</target>" +

      "<target title='Delete criteria' hotkey='DEL' onEmpty='This element is " +
          "not a criteria' action='CALL:axsStock.deleteCriteria'>" +
        ".//img[not(@id) and @class='activelink']" +
      "</target>" +

      "<target title='Edit criteria' hotkey='ENTER' onEmpty='This element is " +
          "not a criteria' action='CALL:axsStock.focusOnCriteriaRangeInput'>" +
        "/html" +
      "</target>" +
 
      "<target title='Explain criteria' hotkey='e' onEmpty='This element is " +
          "not a criteria and has no explanation' " +
          "action='CALL:axsStock.readHelpDesc'>" +
        ".//img[@id and @class='activelink']/.." +
      "</target>" +

    "</list>" +

    "<list title='Popular criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('popular')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[1]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Price criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('price')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[2]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Volume criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('volume')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[3]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Valuation criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('valuation')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[4]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Dividend criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('dividend')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[5]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Balance sheet criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('balancesheetratios')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[6]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Stock metrics criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('stockmetrics')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[7]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Margins criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('margins')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[8]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

    "<list title='Growth criteria' next='DOWN j' prev='UP k' fwd='n' " +
        "back='p' type='dynamic'>" +

      "<item action='CALL:axsStock.readCriteriaExplanation'>" +
        "id('growth')//a" +
      "</item>" +

      "<target title='Load CNR and go to section' trigger='listEntry' " +
          "action='CALL:axsStock.readCurrentCrtieriaList'>" +
        "//table[@class='searchtabs']//tr[9]//a" +
      "</target>" +

      "<target title='Add selected criteria' hotkey='ENTER' " +
          "action='CALL:axsStock.addSelectedCriteria'>" +
        "id('criteria_button')/button" +
      "</target>" +

    "</list>" +

  "</cnr>";

/**
 * Stores the last position in the stock screener section to which 
 * the focus should return after leaving the results section.
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
 */
axsStock.lastCriteriaRow = null;

/**
 * Buffer for queuing TTS messages 
 */
axsStock.searchSummary = '';

/**
 * Array for presenting the stock screener description
 */
axsStock.stockScreenerDescArray = new Array(axsStock.EMPTY_STRING,
                                            axsStock.MIN_STRING,
                                            axsStock.MAX_STRING);
                                            
/**
 * Flag indicating completion of the initial loading of the page
 */
axsStock.initialLoadComplete = false;

/**
 * Indicates which CNR file is currently loaded (criteria or results)
 */
axsStock.currentCNRfile = '';

/**
 * Map from phrases to phrases
 */
axsStock.phrasesMap = new Object();
axsStock.phrasesMap[axsStock.INC_ABR_STRING] = axsStock.INC_STRING;
axsStock.phrasesMap[axsStock.CO_ABR_STRING] = axsStock.CO_STRING;
axsStock.phrasesMap[axsStock.LTD_ABR_STRING] = axsStock.LTD_STRING;
axsStock.phrasesMap[axsStock.PE_ABR_STRING] = axsStock.PE_STRING;
axsStock.phrasesMap[axsStock.FWD_PE_ABR_STRING] = axsStock.FWD_PE_STRING;
axsStock.phrasesMap[axsStock.EPS_ABR_STRING] = axsStock.EPS_STRING;
axsStock.phrasesMap[axsStock.WEEK_HIGH_ABR_STRING] = axsStock.WEEK_HIGH_STRING;
axsStock.phrasesMap[axsStock.WEEK_QC_ABR_STRING] = axsStock.WEEK_QC_STRING;
axsStock.phrasesMap[axsStock.WEEK_LOW_ABR_STRING] = axsStock.WEEK_LOW_STRING;
axsStock.phrasesMap[axsStock.WEEK_PC_ABR_STRING] = axsStock.WEEK_PC_STRING;
axsStock.phrasesMap[axsStock.PE_ABR_STRING] = axsStock.PE_STRING;
axsStock.phrasesMap[axsStock.FY_PE_ABR_STRING] = axsStock.FY_PE_STRING;
axsStock.phrasesMap[axsStock.TY_PE_ABR_STRING] = axsStock.TY_PE_STRING;

/*
 * Map from prefix characters to strings
 */
axsStock.charPrefixMap = new Object();
axsStock.charPrefixMap[axsStock.MINUS_ABR_STRING] = axsStock.MINUS_STRING;
axsStock.charPrefixMap[axsStock.UP_ABR_STRING] = axsStock.UP_STRING;

/**
 * Map from suffix characters to strings
 */
axsStock.charSuffixMap = new Object();
axsStock.charSuffixMap[axsStock.BLN_ABR_STRING] = axsStock.BLN_STRING;
axsStock.charSuffixMap[axsStock.MLN_ABR_STRING] = axsStock.MLN_STRING;
axsStock.charSuffixMap[axsStock.PRCNT_ABR_STRING] = axsStock.PRCNT_STRING;

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
 * @type string
 */
axsStock.lastListNavigationKey = null;

/**
 * Flag idicating if the criteria wizxard is open. Some CNR lists 
 * are not relevant in teh context of open wizard and vice versa.
 * @type boolean
 */
axsStock.wizardOpened = false;

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
  
  axsStock.loadStockScreenerCNR();

  //Some nodes in the page are watched for specific events
  axsStock.loadWatchedNodes();
  
  //Some stylesheets are modified for improving presentantion
  axsStock.customizeStyleSheets();
};

/**
 * Positions the user in the result table row that corresponds to
 * the company found during the power key search.
 */
axsStock.pkSameColumnSearchHandler = function(command, index, id, args) {
  if (axsStock.currentCNRfile == axsStock.ST_SCR_CNR_STRING) {
    axsStock.buildAndLoadResultTableCNR(); 
    axsStock.axsNavObj.navListIdx = 0;
  }
  axsStock.axsNavObj.lastItem = null;
  var listIndex = axsStock.axsNavObj.navListIdx;
  axsStock.axsNavObj.navItemIdxs[listIndex] = index;
      
  var item = axsStock.axsNavObj.currentItem();
  axsStock.axsNavObj.actOnItem(item);

  axsStock.pkObj.updateCompletionField('hidden', true, 40, 20);
};

/**
 * Positions the focus on the company found by PowerKey
 */
axsStock.goToCompanyRow = function() {
	axsStock.pkObj = new PowerKey('resultsList', axsStock.axsJAXObj);
  var body = axsStock.axsJAXObj.getActiveDocument().body;
  axsStock.pkObj.createCompletionField(body,
                                    30,
                                    axsStock.pkSameColumnSearchHandler,
                                    null,
                                    null,
                                    false);
  axsStock.pkObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
	
  var companyNameLinks = axsStock.axsJAXObj.evalXPath(axsStock.COMPANIES_XPATH,
                                                      document.body);        
  var companyNames  = new Array();
  for (var i = 0, companyName; companyName = companyNameLinks[i]; i++) {
    companyNames.push(companyName.textContent);
  }
  axsStock.pkObj.setCompletionList(companyNames);
  axsStock.pkObj.updateCompletionField('visible', true, 40, 20);
};

/**
 * This mehtod idnetifies and registers nodes watched for specific events.
 * For each watched node a mapping to a hadndling function is set.
 * NOTE: In this script we observe node removal and insertion events.
 */
axsStock.loadWatchedNodes = function() {
  //Watched node for the Stock Screener section
  var axsJAXObj = axsStock.axsJAXObj;
  var stockScrParents = axsJAXObj.evalXPath(axsStock.SS_TBL_XPATH,
                                            document.body);
  
  //Listeners which should be executed upon event in intervals (after a timeout)
  var stockScrParent = stockScrParents[0];
  var functionMapping = function() {                    
  	                      axsStock.refreshStockCriteria();
  	                    };
  axsStock.watchedNodeToFuncMap[stockScrParent] = functionMapping;

  //Watched node for resuts change
  var summaryParents = axsJAXObj.evalXPath(axsStock.SUMMARY_XPATH,
                                           document.body);
  var summaryParent = summaryParents[0];
  functionMapping = function() {
  	                  if (axsStock.currentCNRfile == axsStock.RES_CNR_STRING) {
  	                    axsStock.refreshAllResultLists();
  	                  }
  	                  axsStock.generateSummary();
  	                  /*
  	                   * In the init phase result summary is spoken as soon as
  	                   * it is generated. We explicitly control when the summary 
  	                   * is spoken.
  	                   */
  	                  if (!axsStock.initialLoadComplete) {
  	                  	axsStock.searchSummary = axsStock.APP_NAME_STRING + 
  	                  	    axsStock.searchSummary;
  	                  	axsStock.announceSummary();
  	                  	axsStock.initialLoadComplete = true;
  	                  }
  	                };
  axsStock.watchedNodeToFuncMap[summaryParent] = functionMapping;
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
 * relevant in the current context.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.focusOnDropDownList = function(item) {
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return; 
  }
  var element = item.elem;
  axsStock.axsLensObj.view(element.parentNode);
  var listTitle = axsStock.normalizeString(element.previousSibling.textContent);
  axsStock.axsJAXObj.speakTextViaNode(listTitle);  
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Reads the values in a drop down lists (Region, Exchange, Sector)
 * @param {Object?} item A wrapper for the current DOM node.
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
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.selectDropDownListOption = function(item) {
	var option = axsStock.axsNavObj.currentItem().elem;
	option.selected = true;
	axsStock.axsLensObj.view(null);
};

/**
 * Adds a new selected criteria to the criteria list
 */
axsStock.addSelectedCriteria = function(item) {
  var element = item.elem;
  //The button is not disabled and made invisible but is moved to (0, 0)
  var text = axsStock.CRIT_ALREADY_STRING;
  if (element.offsetTop > 0) {
  	//We want to stay in the criteria wizard
  	axsStock.lastStockScreenerPosition = null;
  	
  	axsStock.axsJAXObj.clickElem(element, false);
  	axsStock.axsJAXObj.speakTextViaNode('');
  	text = axsStock.CRIT_ADDED_STRING;
  }
  axsStock.searchSummary =  text + ', ' + axsStock.searchSummary;
  window.setTimeout(function() {
  	                  axsStock.axsJAXObj.lastFocusedNode.blur();
  	                  axsStock.announceSummary();
                     },
                     200);
};

/**
 * Reads the current criteria list (in the criterial wizard) and skips
 * lists irrelevant in the criteria wizard context
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
 * Skips a list and goes to the next or previous one depending 
 * on the last inter list navigation key which was pressed.
 */
axsStock.skipList = function() {
  var key = axsStock.lastListNavigationKey.charCodeAt(0);
  var method = axsStock.axsNavObj.topCharCodeMap[key];
  method();
};

/**
 * Generates a summary of the search results.
 */
axsStock.generateSummary = function() {
	var axsJAXObj = axsStock.axsJAXObj;
  var summaryParents = axsJAXObj.evalXPath(axsStock.SUMMARY_XPATH,
                                           document.body);
  var suffix = '';
  var summaryResult = summaryParents[0].childNodes[5];
	if (summaryResult == undefined) {
		summaryResult = summaryParents[0].childNodes[0];
	} else {
		suffix = axsStock.COMPANIES_FOUND_STRING + ', ';
		suffix = suffix + ' ' + axsStock.RESULTS_FROM_STRING;
		suffix = suffix + ' ' + summaryParents[0].childNodes[1].textContent;
		suffix = suffix + ' ' + axsStock.TO_STRING;
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
}

/**
 * Refreshes all lists in the CNR. Such an action is required upon
 * a dynamic change in the data presented by these lists.
 */
axsStock.refreshAllResultLists = function() {
	var navArray = axsStock.axsNavObj.navArray;
	for (var i = 0, l; l = navArray[i]; i++) {
	  axsStock.axsNavObj.refreshList(navArray[i].title);
	}
}

/**
 * Reads the explanation of a certain criteria.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaExplanation = function(item) {
  if (!axsStock.wizardOpened) {
    return;
  }
  axsStock.axsLensObj.view(null);
	var element = item.elem;
	var text = '';
  axsStock.axsJAXObj.clickElem(element, false);
  var descriptions = axsStock.axsJAXObj.evalXPath(axsStock.WIZ_EXPL_XPATH,
                                                     document.body);
  var descriptionSection = descriptions[0];
  var message = descriptionSection.childNodes[1].firstChild.nextSibling.textContent;
  var statusNode = descriptionSection.childNodes[5];
  var criteriaStatus = axsStock.NOT_ADDED_STRING;
  
  if (statusNode.className.indexOf('displaynone') == -1) {
  	criteriaStatus = statusNode.textContent;
  }

  text = element.textContent + ' ';
  text = text + ' ' + axsStock.STATUS_STRING + ' ' + criteriaStatus;
  text = text + ', ' + axsStock.DEFINITION_STRING + ' ' + message;
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(descriptions[0]);
};

/**
 * Moves the focus on the input fields for the currently edited criteria.
 * @param {Object?} item A wrapper for the current DOM node.
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
 * Hadles the ENTER key for finalizing the query i.e. to announce the search
 * resutls to the user.
 * NOTE: These results are updated more often than are reported
 * @param {Event?} evt A keypress event
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
 * Wraps arond an item list traversed with the fwd and back keys
 */
axsStock.wrapAround = function(item) {
	var element = item.elem;
	if (element.tagName == 'A') {
		axsStock.axsJAXObj.clickElem(element);
	} else {
    var item = axsStock.axsNavObj.currentItem();
    axsStock.axsNavObj.actOnItem(item);
	}
}

/**
 * Refreshes the Stock criteria list.
 */
axsStock.refreshStockCriteria = function() {
  axsStock.axsNavObj.refreshList(axsStock.STOCK_SCR_STRING);
  window.setTimeout(function() {
  	                  axsStock.axsJAXObj.lastFocusedNode.blur();
  	                },
                    0);
  //Refreshing loses forces the list to be positioned before the first item
  //Wait for the list to reload                  
  window.setTimeout(axsStock.restoreLastPosition, 500);
};

/**
 * Handler for added and removed nodes in the document. If the node,
 * source of the event, is mapped to a function, the functions is 
 * executed. Otherwise, no action is taken.
 */
axsStock.nodeInsertedOrRemovedHandler = function(evt) {
	var target = evt.target;
	//Add listeners to the input fields of each added criteria row (node)
	if (evt.type == 'DOMNodeInserted' && target.tagName == 'TR') {
	  //Listeners which should be executed upon every event (no timeout)
    var minInput = target.childNodes[1].firstChild;
    minInput.addEventListener('keypress',
                               axsStock.criteriaInputKeyHandler,
                               false);
    var maxInput = target.childNodes[3].firstChild;
    maxInput.addEventListener('keypress',
                              axsStock.criteriaInputKeyHandler,
                              false);
                                       
    minInput.addEventListener('focus', axsStock.handleFocusEvent, false);
                              
    //Change inputs' titles. The screen reader will read graspable text upon TAB    
    var criteria = target.childNodes[0].textContent;
    criteria = axsStock.parseSpecChrsAndTkns(criteria) + ', ';
    minInput.title = criteria + ' ' + axsStock.MIN_STRING;
    maxInput.title = criteria + ' ' + axsStock.MAX_STRING;
	}
	
  var watchedNode = target.parentNode;
  var functionMapping = axsStock.watchedNodeToFuncMap[watchedNode];
  if (functionMapping) {
    axsStock.executeMappedFunc(functionMapping, evt);
  }
};

/**
 * Handler for the focus event of the min edit fields of the criteria.
 * Needed for avoiding reading of the first input field upon the page 
 * initialziation.
 */
axsStock.handleFocusEvent = function(evt) {
	if (!axsStock.initialLoadComplete) {
		//Iterrupt the screen reader
	  axsStock.axsJAXObj.speakTextViaNode(' ');
	  axsStock.axsJAXObj.lastFocusedNode.blur();
	}
};

/**
 * Executes a function mapped to a watched node. Since some events are generated
 * too frequently, taking actions on each occurence may cause significant 
 * overhed. The method is setting a triggered flag after an execution of 
 * the function is requested. The flag is cleared after a certain timeout. 
 * Upon the timeout the function is executed. During the timeout no further
 * execution requests for the same function are accepted.
 * @param {Object?} handlingFunction The function to execute 
 */
axsStock.executeMappedFunc = function(handlingFunction, evt) {
	if (axsStock.watchedNodeFuncEnabledMap[handlingFunction]) {
	  return;
	}
	axsStock.watchedNodeFuncEnabledMap[handlingFunction] = true;
	var delegatingFunction = function() {
    axsStock.watchedNodeFuncEnabledMap[handlingFunction] = false;
    handlingFunction(evt);
  };
  window.setTimeout(delegatingFunction, axsStock.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Deletes a criteria and announces the deletion
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.deleteCriteria = function(item) {
	axsStock.searchSummary = '';
	axsStock.lastStockScreenerPosition = null;
	
	var element = item.elem;
	axsStock.axsJAXObj.clickElem(element);
	//Wait the results to load
	window.setTimeout(function() {
		                  axsStock.axsLensObj.view(null);
		                  var text = axsStock.CRITERIA_STRING + ' ';
                      text = text + element.parentNode.parentNode.firstChild.
                          textContent;
                      text = text + ' ' + axsStock.DELETED_STRING +'.';
                      axsStock.searchSummary = text + ' ' + 
                          axsStock.searchSummary;
		                  axsStock.announceSummary();
	                  },
	                  500);
};

/**
 * Opens and closes the criteria wizard.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.openCloseWizard = function(item) {
	var element = item.elem;
	var visible = false;
	var text = axsStock.WIZ_OP_MSG_STRING;
	var xPath = axsStock.WIZ_OP_LINK_XPATH ;
	axsStock.wizardOpened = true;
	
  if (element.style.display == 'none') {
		 xPath = axsStock.WIZ_CL_LINK_XPATH ;
		 text = axsStock.WIZ_CL_MSG_STRING;
		 axsStock.wizardOpened = false;
	}
	
	var links = axsStock.axsJAXObj.evalXPath(xPath, document.body);
  axsStock.axsJAXObj.clickElem(links[0], false);
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(null);
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
	var critHeaders = axsStock.axsJAXObj.evalXPath(axsStock.STOCK_SCR_XPATH,
                                                 document.body);
	var critHeader = critHeaders[0];
	axsStock.axsLensObj.view(critHeader);
	critHeader.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(critHeader);
};

/**
 * Loads the CNR for the stock screener section and moves to
 * the first list of this section.
 */
axsStock.loadStockScreenerCNRAndScroll = function() {
	axsStock.loadStockScreenerCNR();
	
	//Go to the last position in the Stock screener CNR
  axsStock.restoreLastPosition();
};

/**
 * Loads the CNR for the stock screener
 */
axsStock.loadStockScreenerCNR = function() {
	axsStock.currentCNRfile = axsStock.ST_SCR_CNR_STRING;
	axsStock.axsNavObj.navInit(axsStock.CNR_ST_SCR_STRING , null);
};

/**
 * Builds dynamically a CNR for the result section. Each column is a list
 * and the order of criteria in the Stock criteria section detemines 
 * (potentially changes) the order of columns in the result table.
 */
axsStock.buildAndLoadResultTableCNR = function() {
	axsStock.currentCNRfile = axsStock.RES_CNR_STRING;

	//Remeber the last position in the CNR before switching it
	axsStock.cacheLastPosition();

  //Build dynamically the CNR file
  var tables = axsStock.axsJAXObj.evalXPath(axsStock.R_TBL_XPATH,
                                            document.body);
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
		  var filledTempl = axsStock.populateTemplate(axsStock.CNR_RES_STRING,
		                                              values);
		  cnrString = cnrString + filledTempl;
	 	}
	}

	cnrString = cnrString + axsStock.CNR_RES_BTM_STRING;
	axsStock.axsNavObj.navInit(cnrString, null);
	axsStock.readCriteriaValue(axsStock.axsNavObj.nextItem());
};

/**
 * Populates a template replacing specail tokes (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate
 * @param values Array The array with replacement (concrete) values
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
 * Goes to the next/prevous page of results. Clicks on the link for
 * fetching the results and positions at the top of the results list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.gotToTopOfListAndClickLink = function(item) {
	var element = item.elem;
	axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
	axsStock.axsJAXObj.clickElem(element);
	//Wait until the new data is loaded
	window.setTimeout(function() {
		                  //The result table is replaced => need locate the node
		                  var id = element.previousSibling.previousSibling.id;
						          var sortImage = document.getElementById(id);						          
						          var sortOrder = '';
						          if (sortImage.src.indexOf('up') > -1) {
						            sortOrder = axsStock.ASCENDING_STRING;
						          } else {
						          	sortOrder = axsStock.DESCENDING_STRING;
						          }
						          var templateParameters = new Array(element.textContent, 
						                                             sortOrder);
						          var template = axsStock.SORT_ORDER_STRING;
					            var text = axsStock.populateTemplate(template,
					                                                 templateParameters);
					            axsStock.searchSummary = text + ' ' + 
					                axsStock.searchSummary;
					            axsStock.announceSummary();
	                  },
	                  500);
};

/**
 * Reads the value for a certain criteria from the results table.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaValue = function(item) {
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
 * Focuses on and reads the appropriate entry in the results table. Since each
 * columns is managesd as a list changing columns should keep the user
 * on the same row.
 */
axsStock.focusOnCurrentTableCell = function() {
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
 * Returns the current value in a table cell.
 * @param {Object?} A DOM node object representing the table cell.
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
 * Reads the description of a criteria from the criteria list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.readStockScreenrDesc = function(item) {
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
 * Resets the last visited table criteria row (if such exists) to its default
 * visual representation which is modified when the user focuses on that row.
 */
axsStock.resetCriteriaRow = function() {
	//TODO: Refactor tab key fix
  axsStock.axsJAXObj.tabKeyFixOn = true;
  if (axsStock.lastCriteriaRow != null) {
    axsStock.simulateMouseOutEvent(axsStock.lastCriteriaRow);
  }
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
	if (axsStock.lastStockScreenerPosition == null) {
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
 * Simulates a mouse out event.
 * @param {Object?} targetNode The DOM node which is the target (source) 
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
 * Reads the help (explanation) description for a criteria in the criteria list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsStock.readHelpDesc = function(item) {
	var element = item.elem;
	var descTitleNode = element.childNodes[0];
	var linkNode = element.childNodes[1];
	axsStock.axsJAXObj.clickElem(linkNode, false);
	var explNodes = axsStock.axsJAXObj.evalXPath(axsStock.EXPL_NODES_XPATH,
                                                  document.body);                                       
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
 * @param {Array?} columnDesriptors Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsStock.buildTableRowText = function(textContents, columnDesriptors) {  
  //check inputs
  if (textContents === null) {
    return;
  }
  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (columnDesriptors !== null && i < columnDesriptors.length) {
       rowText = rowText + ' ' + columnDesriptors[i] ;
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (columnDesriptors !== null && i < columnDesriptors.length) {
    rowText = rowText + ' ' + columnDesriptors[i];
  }
  return rowText;
}

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content. 
 * @param {string} The text to be processed  
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsStock.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';
  //check input
  if (text === null || text === '') {
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
 * @param {string} The text to be normalized. 
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
 * @param {Event?} evt A keypress event
 */
axsStock.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsStock.axsJAXObj.lastFocusedNode.blur();
    return false;
  } else if ((evt.charCode == 104) || (evt.charCode ==  108)) { //h or l 
    axsStock.lastListNavigationKey = String.fromCharCode(evt.charCode);
  }
  if (axsStock.axsJAXObj.inputFocused) {
    return true;
  }
  var command = axsStock.charCodeMap[evt.charCode];

  if (command) {
    return  command();
  }
  return true;
};

/**
 * Map from character codes to functions
 */
axsStock.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)    
 47 : function () {
       document.getElementById('searchbox').focus();
       document.getElementById('searchbox').select();
       return false;
     }, 
  // ? (question mark)       
  63 : function () {
       var helpStr = axsStock.HELP + axsStock.axsNavObj.localHelpString() +
                     axsStock.axsNavObj.globalHelpString();
       axsStock.axsJAXObj.speakTextViaNode(helpStr);
       return false;
    }
};

//Run the initialization routine of the script
axsStock.init();
