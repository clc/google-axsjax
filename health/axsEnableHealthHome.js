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
 * the the main page of Google Health.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsHealth = {};

/**
 * Object that contains all string literal used for enhancing the presentation 
 */
axsHealth.str = {
  REQUIRES_ATTENTION : 'requires immediate attention',
  DISCUSS_WITH_DOCTOR : 'should be discussed with you doctor soon',
  NOT_SPECIFIED : 'not specified',
  NOTICE_TEMPLATE : '{0} {4} notice from {1} with subject {2}, received on {3}',
  NOTICE_RESULT_TEMPLATE : '{0} new. Notices from {1} to {2} of {3}. {4}',
  CONDITION_TEMPLATE : '{0} from {1} to {2} treated by {3}. The entry is ' +
      '{4}. {5}',
  MEDICATION_TEMPLATE : '{0}. Dosage {1} prescribed with prescription {2}. ' +
      'The entry is {3}. {4}',
  ALLERGY_TEMPLATE : '{1} allergy to {0} from {2} to {3} treated by {4}. ' +
      'The entry is {5}. {6}',
  PROCEDURE_TEMPLATE : '{0} on {1} treated by {2}. The entry is {3}. {4}',
  TEST_RESULT_TEMPLATE : 'The result from {0} ordered by {4} and performed ' +
      'on {3} is {1} with normal range {2}. The entry is {5}. {6}',
  IMMUNIZATIONS_TEMPLATE : '{0} on {1} ordered by {2}. The entry is {3}. {4}',
  DRUG_INTERACTION_TEMPLATE : 'Interaction between {1}. This interaction ' +
      '{0}. Description: {2}',
  ADDED_TO_PROFILE : 'added to profile',
  PERSONAL_PROFILE_ACTIVE : 'Personal profile section active.',
  ADD_TO_PROFILE_ACTIVE : 'Add to profile section active.',
  SETTINGS_ACTIVE : 'Settings section active.',
  PROFILE : 'Profile, ',
  NO_EXISTING : 'No existing',
  EXISTING : 'Existing',
  POUNDS : 'pounds',
  OUNCES : 'ounces',
  FEET : 'feet',
  INCHES : 'inches',
  VALUE : 'value',
  CONFIRMED : 'confirmed',
  NO : 'No',
  WINDOW_OPENED : 'window opened',
  WINDOW_CLOSED : 'window closed',
  BEGINNING_WITH_LETTER : 'beginning with letter',
  BEGINNING_WITH_NUMBER : 'beginning with number',
  SELECTED : 'selected',
  NOT_SELECTED : 'not selected',
  ALREADY_SELECTED : 'already selected',
  CREATE_CONTACT : 'Create a medical contact',
  ADDRESS : 'Address',
  PHONE_NUMBER : 'Phone number',
  EXISTING_DRUG_INTERACTIONS : 'Warning! Drug interactions exist.',
  SET_TO : 'set to',
  ENTER_TO_EDIT : 'Press ENTER to edit',
  PRESSED : 'pressed',
  PRESS : 'Press',
  SAVE : 's to save',
  CANCEL : 'c to cancel',
  HISTORY_REC_EXPANDED : 'Historical records expanded.',
  HISTORY_REC_COLLAPSED : 'Historical records collapsed.',
  HISTORY_REC_ALREADY_EXPANDED : 'Historical records already expanded.',
  HISTORY_REC_ALREADY_COLLAPSED : 'Historical records already collapsed.',
  NO_HISTORY_REC : 'No historical records',
  AVAILABLE_ACTIONS : 'Select available action:',
  BUTTON_PRESSED : 'button pressed',
  NO_RESULTS_FOUND : 'No matching results found',
  NEXT_LIST : 'Next list',
  PREV_LIST : 'Previous list',
  GO_FORWARD : 'Go forward',
  GO_BACKWARDS : 'Go backwards',
  CYCLE_NEXT : 'Cycle next',
  CYCLE_PREV : 'Cycle previous',
  BLANK : 'blank',
  CLOSE : 'escape to close',
  DELETED : 'deleted',
  DATE_ERROR_MESSAGE : 'Please enter valid date as one or two digit month, ' +
      'one or two digit day, and four digit year.\nYou may use a slash, ' +
      'hyphen or period to separate the values. The year must be between 1900' +
      ' and 2019.',
  PLEASE_SELECT_ACTION : 'Please select an action',
  BEGIN_NEW_SEARCH : 'Press f to begin a new search.',
  DOCTORS_FOUND : 'doctors found',
  HELP : 'The following shortcut keys are available. ',
  ORDERED_BY : 'Ordered by',
  DESCENDING : 'in descending order',
  ASCENDING : 'in ascending order',
  FROM : 'From',
  SENDER : 'sender',
  SUBJECT : 'Subject',
  CONTENT : 'Content',
  ESC_TO_CLOSE : 'escape to close.',
  PLEASE_SELECT_NOTICE : 'No selected notices. Please select a notice.',
  NO_LETTER_LINKS : 'No quick letter links available.',
  EMAIL : 'email',
  NEW : 'new',
  JAN : 'Jan',
  FEB : 'Feb',
  MAR : 'Mar',
  APR : 'Apr',
  MAY : 'May',
  JUN : 'Jun',
  JUL : 'Jul',
  AUG : 'Aug',
  SEP : 'Sep',
  OCT : 'Oct',
  NOV : 'Nov',
  DEC : 'Dec'
};

/**
 * Enumeration for the possible repositioning options upon a list refresh.
 */
axsHealth.refreshMode = {
  KEEP_CURRENT : 0,
  GO_TOP : 1,
  GO_BOTTOM : 2
};

/**
 * Map from phrases to phrases
 */
axsHealth.phrasesMap = new Object();
axsHealth.phrasesMap[axsHealth.str.JAN] = 1;
axsHealth.phrasesMap[axsHealth.str.FEB] = 2;
axsHealth.phrasesMap[axsHealth.str.MAR] = 3;
axsHealth.phrasesMap[axsHealth.str.APR] = 4;
axsHealth.phrasesMap[axsHealth.str.MAY] = 5;
axsHealth.phrasesMap[axsHealth.str.JUN] = 6;
axsHealth.phrasesMap[axsHealth.str.JUL] = 7;
axsHealth.phrasesMap[axsHealth.str.AUG] = 8;
axsHealth.phrasesMap[axsHealth.str.SEP] = 9
axsHealth.phrasesMap[axsHealth.str.OCT] = 10;
axsHealth.phrasesMap[axsHealth.str.NOV] = 11;
axsHealth.phrasesMap[axsHealth.str.DEC] = 12;
axsHealth.phrasesMap[axsHealth.str.FROM] = axsHealth.str.SENDER;

/**
 * CNR for the 'Personal profile' section.
 */
axsHealth.PROFILE_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Import medical records" hotkey="i">' +
      '//div[contains(text(), "Import medical records")]' +
    '</target>' +

    '<target title="Explore health services" hotkey="x">' +
      '//div[contains(text(), "Explore health services")]' +
    '</target>' +

    '<target title="Create new profile" hotkey="t">' +
      '//div[contains(text(), "Create a new profile")]' +
    '</target>' +

    '<target title="Settings" hotkey="e" ' +
        'action="CALL:axsHealth.setActiveAxsNavObjSet">' +
      '//table[@class="weaver-header"]//div[text()="Settings"]' +
    '</target>' +

    '<target title="Health topics" hotkey="y">' +
      '//a[contains(text(), "Read about health topics")]' +
    '</target>' +

    '<list title="Profiles" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item action="CALL:axsHealth.selectProfile">' +
        '//div[contains(@class, "weaver-nav-title")]' +
      '</item>' +

    '</list>' +

    '<list title="Notices" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No notices">' +

      '<item action="CALL:axsHealth.readNotice">' +
        '//tr[contains(@class, "notices-row") or ' +
            'contains(@class, "notices-unreadrow")]' +
      '</item>' +

      '<target title="Read" hotkey="ENTER" ' +
          'action="CALL:axsHealth.readNoticeContent">' +
        '.' +
      '</target>' +

      '<target title="Delete" hotkey="DEL">' +
        '//table[@class="notices-previewTitle"]//button[text()="Delete"]' +
      '</target>' +

      '<target title="Select or unselect" hotkey="o" ' +
          'action="CALL:axsHealth.selectOrUnselectNotice">' +
        './/input' +
      '</target>' +

      '<target title="Actions" hotkey="z" ' +
          'action="CALL:axsHealth.goNoticesActionSelect">' +
        '//select[@class="gwt-ListBox notices-actionsListBox"]' +
      '</target>' +

      '<target title="Select all" hotkey="c">' +
        '//table[@class="notices-functionsPanel-line"]//div[text()="All"]' +
      '</target>' +

      '<target title="Select none" hotkey="n">' +
        '//table[@class="notices-functionsPanel-line"]//div[text()="None"]' +
      '</target>' +

      '<target title="Select read" hotkey="r">' +
        '//table[@class="notices-functionsPanel-line"]//div[text()="Read"]' +
      '</target>' +

      '<target title="Open notices section" hotkey="b" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(text(), "Notices")]' +
      '</target>' +

      '<target title="Select unread" hotkey="u">' +
        '//table[@class="notices-functionsPanel-line"]//div[text()="Unread"]' +
      '</target>' +

      '<target title="Order by sender" hotkey="1">' +
        '//table[@class="notices-list"]//u[text()="From"]' +
      '</target>' +

      '<target title="Order by subject" hotkey="2">' +
        '//table[@class="notices-list"]//u[text()="Subject"]' +
      '</target>' +

      '<target title="Order by date" hotkey="3">' +
        '//table[@class="notices-list"]//u[text()="Date"]' +
      '</target>' +

      '<target title="Search notices" hotkey="s" ' +
          'action="CALL:axsHealth.goToNoticesSearchBox">' +
        '//table[@class="notices-functionsPanel-line"]//input' +
      '</target>' +

      '<target title="Open notices section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(text(), "Notices")]' +
      '</target>' +

      '<target title="Add items to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(@class, "weaver-nav-item") and contains(text(), ' +
            '"Add to this profile")]' +
      '</target>' +

    '</list>' +

    '<list title="Drug interactions" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No drug interactions">' +

      '<item action="CALL:axsHealth.readDrugIteraction">' +
        '//table[@class="healthreport-inner"]//' +
            'table[@class="weaver-drug-interaction"]' +
      '</item>' +

      '<target title="Open drug interactions section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(text(), "Drug interactions")]' +
      '</target>' +

      '<target title="Add items to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(@class, "weaver-nav-item") and contains(text(), ' +
            '"Add to this profile")]' +
      '</target>' +

    '</list>' +

    '<list title="Biometrics" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item action="CALL:axsHealth.readBiometric">' +
        '//table[@class="profile-name-row" and not(contains(@style, ' +
            '"display: none"))]' +
      '</item>' +

      '<target title="Open biometrics section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openAndInitializeBiometrics">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Age, sex, height...")]' +
      '</target>' +

      '<target title="Add items to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(@class, "weaver-nav-item") and contains(text(), ' +
            '"Add to this profile")]' +
      '</target>' +

      '<target title="Edit biometric" hotkey="ENTER" ' +
          'action="CALL:axsHealth.focusOnFirstInputInCategory">' +
        '.' +
      '</target>' +

      '<target title="Save" hotkey="s" action="CALL:axsHealth.pressButton">' +
        '//button[text()="Save" and not(@disabled)]' +
      '</target>' +

      '<target title="Cancel" hotkey="c" action="CALL:axsHealth.pressButton">' +
        '//button[text()="Cancel" and not(@disabled)]' +
      '</target>' +

    '</list>' +

    '<list title="Conditions" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No conditions">' +

      '<item action="CALL:axsHealth.readCondition">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Open conditions section" trigger="listEntry" '+
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Conditions")]' +
      '</target>' +

      '<target title="Add conditions to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Medications" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No medications">' +

      '<item action="CALL:axsHealth.readMedication">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Add medications to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Open medications section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Medications")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Allergies" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No allergies">' +

      '<item action="CALL:axsHealth.readAllergy">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Open Allergies section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Allergies")]' +
      '</target>' +

      '<target title="Add allergies to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Procedures" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No procedures">' +

      '<item action="CALL:axsHealth.readProcedure">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Open procedures section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Procedures")]' +
      '</target>' +

      '<target title="Add procedures to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Test results" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No test results">' +

      '<item action="CALL:axsHealth.readTestResult">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Add test results to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Open test results section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Test results")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Immunizations" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No immunizations">' +

      '<item action="CALL:axsHealth.readImmunization">' +
         '//table[contains(@class, "profile-details")]//tr[(contains(@class, ' +
             '"profile-detail-item") and not(ancestor-or-self::tr[contains' +
             '(@style, "display: none")]) and not(.//div[contains(text(), ' +
             '"Notes:")]))]' +
      '</item>' +

      '<target title="Add immunizations to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(text(), "to profile")]' +
      '</target>' +

      '<target title="Open immunizations section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(@class, "weaver-nav-item") and ' +
            'contains(text(), "Immunizations")]' +
      '</target>' +

      '<target title="Add record" hotkey="r" onEmpty="Cannot ' +
          'add a record to a historical entry">' +
        './/div[contains(@class, "link") and text()="Add record"]' +
      '</target>' +

      '<target title="Edit record" hotkey="ENTER">' +
        './/div[contains(@class, "link") and text()="Edit"]' +
      '</target>' +

      '<target title="Delete record" hotkey="DEL" ' +
          'action="CALL:axsHealth.deleteRecord">' +
        './/div[contains(@class, "link") and text()="Delete"]' +
      '</target>' +

      '<target title="Expand historical records" hotkey="[" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.expandHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

      '<target title="Collapse historical records" hotkey="]" onEmpty="No his' +
          'torical records" action="CALL:axsHealth.collapseHistoryRecords">' +
        '//table[@class="profile-details"]//img[../../self::tr[not(contains' +
            '(@style, "display: none"))]]' +
      '</target>' +

    '</list>' +

    '<list title="Medical contacts" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No medical contacts">' +

      '<item action="CALL:axsHealth.readMedicalContact">' +
        '//table[contains(@class, "ContactListPanel")]//div' +
            '[string-length(text())>1]' +
      '</item>' +

      '<target title="Add items to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(@class, "weaver-nav-item") and contains(text(), ' +
            '"Add to this profile")]' +
      '</target>' +

      '<target title="Open medical contacts section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(text(), "Medical contacts")]' +
      '</target>' +

      '<target title="Create medical contact" hotkey="c">' +
        '//div[contains(text(), "Create a contact")]' +
      '</target>' +

      '<target title="Edit medical contact" hotkey="ENTER" ' +
            'action="CALL:axsHealth.openEditRecordModalWindow">' +
        '//table[contains(@class, "ContactsView")]//div[@class="DetailsSlot"]' +
            '//div[text() = "Edit"]' +
      '</target>' +

      '<target title="Delete medical contact" hotkey="DEL" >' +
        '//table[contains(@class, "ContactsView")]//div[@class="DetailsSlot"]' +
            '//div[text() = "Delete"]' +
      '</target>' +

      '<target title="Details and reviews" hotkey="d" >' +
        '//table[contains(@class, "ContactsView")]//div[@class="DetailsSlot"]' +
            '//a[text() = "Details and reviews"]' +
      '</target>' +

    '</list>' +

    '<list title="Find a doctor" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic" onEmpty="No doctors found. ' +
        'Press f to begin a new search.">' +

      '<item action="CALL:axsHealth.readDoctor">' +
         '//table[@class="DDSearchClusterPanel"]' +
      '</item>' +

      '<target title="Add items to profile" hotkey="a" ' +
          'action="CALL:axsHealth.setActiveAxsNavObjAddToProf">' +
        '//div[contains(@class, "weaver-nav-item") and contains(text(), ' +
            '"Add to this profile")]' +
      '</target>' +

      '<target title="Open found doctors section" trigger="listEntry"' +
          ' action="CALL:axsHealth.openPersonalProfileSubCategory">' +
        '//div[contains(text(), "Find a doctor")]' +
      '</target>' +

      '<target title="Go to home page" hotkey="ENTER">' +
        './/div[contains(@class, "DDSearchClusterPanel-name")]/a' +
      '</target>' +

      '<target title="Find" hotkey="f" ' +
          'action="CALL:axsHealth.findDoctor">' +
        '//select[contains(@class, "DDSearchView-specialtybox")]' +
      '</target>' +

      '<target title="Go to next page" trigger="listTail" ' +
          'action="CALL:axsHealth.goToNextDoctorSearchResutlsPage">' +
        '//a[contains(text(), "Next")]' +
      '</target>' +

      '<target title="Go to previous page" trigger="listHead" ' +
          'action="CALL:axsHealth.goToPrevDoctorSearchResutlsPage">' +
        '//a[contains(text(), "Previous")]' +
      '</target>' +

      '<target title="Directions" hotkey="d" onEmpty="No directions ' +
          'available">' +
        './/a[contains(text(), "Directions")]' +
      '</target>' +

      '<target title="Website" hotkey="w" onEmpty="No website available">' +
        './/a[contains(text(), "Website")]' +
      '</target>' +

      '<target title="Save medical contact" hotkey="s" ' +
          'onEmpty="Entry already saved">' +
        './/div[contains(text(), "Save to")]' +
      '</target>' +

      '<target title="Delete" hotkey="DEL" onEmpty="Unable to delete not ' +
          'added entry">' +
        './/div[contains(text(), "Delete")]' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * CNR for the 'Add to profile' section.
 */
axsHealth.ADD_TO_PROFILE_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Personal profile section" hotkey="ESC r" ' +
        'action="CALL:axsHealth.activatePersonalProfileSection">' +
      '/html' +
    '</target>' +

    '<target title="Import medical records" hotkey="i">' +
      '//div[contains(text(), "Import medical records")]' +
    '</target>' +

    '<target title="Explore health services" hotkey="x">' +
      '//div[contains(text(), "Explore health services")]' +
    '</target>' +

    '<target title="Create new profile" hotkey="c">' +
      '//div[contains(text(), "Create a new profile")]' +
    '</target>' +

    '<list title="Add conditions" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Go to previous letter" trigger="listHead" ' +
          'action="CALL:axsHealth.clickPreviousLetterLink">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Go to next letter" trigger="listTail" ' +
          'action="CALL:axsHealth.clickNextLetterLink">' +
       '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Open add conditions section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Conditions"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search condition or symptom" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Explain item" hotkey="e" onEmpty="No explanation ' +
          'available">' +
        './/a' +
      '</target>' +

      '<target title="Conditions summary" hotkey="u" ' +
          'action="CALL:axsHealth.readConditionsSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

    '<list title="Add medications" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Go to previous letter" trigger="listHead" ' +
          'action="CALL:axsHealth.clickPreviousLetterLink">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Go to next letter" trigger="listTail" ' +
          'action="CALL:axsHealth.clickNextLetterLink">' +
       '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Open add medications section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Medications"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search medication" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Medications summary" hotkey="u" ' +
          'action="CALL:axsHealth.readMedicationsSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

    '<list title="Add allergies" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Go to previous letter" trigger="listHead" ' +
          'action="CALL:axsHealth.clickPreviousLetterLink">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Go to next letter" trigger="listTail" ' +
          'action="CALL:axsHealth.clickNextLetterLink">' +
       '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Open add allergies section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Allergies"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search allergy" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Allergies summary" hotkey="u" ' +
          'action="CALL:axsHealth.readAllergiesSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

    '<list title="Add procedures" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Go to previous letter" trigger="listHead" ' +
          'action="CALL:axsHealth.clickPreviousLetterLink">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Go to next letter" trigger="listTail" ' +
          'action="CALL:axsHealth.clickNextLetterLink">' +
       '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Open add procedures section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Procedures"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search procedure or surgery" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Procedures summary" hotkey="u" ' +
          'action="CALL:axsHealth.readProceduresSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

    '<list title="Add test results" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Go to previous letter" trigger="listHead" ' +
          'action="CALL:axsHealth.clickPreviousLetterLink">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Go to next letter" trigger="listTail" ' +
          'action="CALL:axsHealth.clickNextLetterLink">' +
       '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//td[./div[@class="quickAdd-link-selected"]] ' +
      '</target>' +

      '<target title="Open add test section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Test results"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search test" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Test results summary" hotkey="u" ' +
          'action="CALL:axsHealth.readTestResultsSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

    '<list title="Add immunizations" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readCandidateItem">' +
         '//div[@class="gwt-TabPanelBottom"]/div' +
             '[not(contains(@style, "display: none"))]' +
             '//table[@class="quickAdd-item"]//td[1]' +
      '</item>' +

      '<target title="Open add immunization section" trigger="listEntry" ' +
          'action="CALL:axsHealth.initializeAddToProfileSection">' +
        '//div[@class="quickAdd-TabBarItemText" and text()="Immunizations"]' +
      '</target>' +

      '<target title="Add item" hotkey="ENTER" ' +
          'action="CALL:axsHealth.addCandidateItem">' +
        './..//div[@class="gwt-Hyperlink"]/a' +
      '</target>' +

      '<target title="Search immunization" hotkey="s" ' +
          'action="CALL:axsHealth.goToSearchBox">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//input' +
      '</target>' +

      '<target title="Immunizations summary" hotkey="u" ' +
          'action="CALL:axsHealth.readImmunizationsSumnmary">' +
        '//html' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * CNR for the 'Modal dialog' section.
 */
axsHealth.MODAL_DIALOG_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<list title="Modal dialog" fwd="DOWN j n" back="UP k p" type="dynamic">' +

      '<item action="CALL:axsHealth.readModalDialogInput">' +
        '//table[@class="weaver-DialogWidget"]/tbody/tr/td/table/tbody/tr' +
          '/td/table/tbody/tr[.//input or .//select or .//textarea]' +
      '</item>' +

      '<item action="CALL:axsHealth.readModalDialogInput">' +
        '//table[@class="weaver-DialogWidget"]/tbody/tr[(.//input or ' +
            './/select or .//textarea) and not(.//table)]' +
      '</item>' +

      '<target title="Edit dialog input" hotkey="ENTER" ' +
          'action="CALL:axsHealth.focusOnFirstInputInCategory">' +
        '.' +
      '</target>' +

      '<target title="Save" hotkey="s">' +
        '//*[@class="tk-ModalDialog"]//button[text()="Save"]' +
      '</target>' +

      '<target title="Cancel" hotkey="c">' +
        '//*[@class="tk-ModalDialog"]//button[text()="Cancel"]' +
      '</target>' +

      '<target title="OK" hotkey="ESC">' +
        '//*[@class="tk-ModalDialog"]//button[text()="OK"]' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * CNR for the 'Settings' section
 */
axsHealth.SETTINGS_CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Personal profile section" hotkey="ESC r" ' +
        'action="CALL:axsHealth.closeSettingsSection">' +
      '/html' +
    '</target>' +

    '<list title="General" fwd="DOWN j n" back="UP k p" type="dynamic">' +

      '<item action="CALL:axsHealth.readSetting">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//table[@class="h9-settings-smallTable"]/tbody' +
            '/tr[not(.//div[contains(@class, "columnHeader")])]' +
      '</item>' +

      '<target title="Initialize settings section" trigger="listEntry" ' +
          'action="CALL:axsHealth.openSettingsSubCategory">' +
        '//td[@class="gwt-TabBarItem-wrapper"]//div[text()="General"]' +
      '</target>' +

      '<target title="Edit setting" hotkey="ENTER" ' +
          'action="CALL:axsHealth.focusOnFirstInputInCategory">' +
        '.' +
      '</target>' +

      '<target title="Save" hotkey="s" ' +
          'action="CALL:axsHealth.pressButton">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//button[text()="Save changes"]' +
      '</target>' +

      '<target title="Cancel" hotkey="c" action="CALL:axsHealth.pressButton">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//button[text()="Cancel"]' +
      '</target>' +

    '</list>' +

    '<list title="Profiles" fwd="DOWN j n" back="UP k p" type="dynamic">' +

      '<item action="CALL:axsHealth.readProfile">' +
        '//div[@class="gwt-TabPanelBottom"]/div[not(contains(@style, ' +
            '"display: none"))]//table[@class="h9-settings-smallTable"]/tbody' +
            '/tr[not(.//div[contains(@class, "columnHeader")])]' +
      '</item>' +

      '<target title="Open profiles settings" trigger="listEntry"' +
          ' action="CALL:axsHealth.openSettingsSubCategory">' +
        '//td[@class="gwt-TabBarItem-wrapper"]//div[text()="Profiles"]' +
      '</target>' +

      '<target title="Edit profile" hotkey="ENTER" ' +
          'action="CALL:axsHealth.editProfileSettings">' +
        './/div[contains(@class, "h9-settings-boldlink")]' +
      '</target>' +

      '<target title="Hide" hotkey="e" action="CALL:axsHealth.pressButton">' +
        './/a[text()="Hide"]' +
      '</target>' +

      '<target title="Delete" hotkey="DEL" ' +
          'action="CALL:axsHealth.pressButton">' +
        './/div[text()="Delete"]' +
      '</target>' +

      '<target title="Show" hotkey="s" action="CALL:axsHealth.pressButton">' +
        './/a[text()="Show"]' +
      '</target>' +

    '</list>' +

    '<list title="Profile details" fwd="DOWN j n" back="UP k p" ' +
        'type="dynamic">' +

      '<item action="CALL:axsHealth.readProfileDetail">' +
        '//table[@class="h9-settings-profileDetails"]//tr[.//input]' +
      '</item>' +

      '<target title="Initialize profile details" trigger="listEntry" ' +
          'action="CALL:axsHealth.openProfileDetailsSubCategory">' +
        '/html' +
      '</target>' +

      '<target title="Edit personal profile category" hotkey="ENTER" ' +
          'action="CALL:axsHealth.focusOnFirstInputInCategory">' +
        '.' +
      '</target>' +

      '<target title="Save" hotkey="s" ' +
          'action="CALL:axsHealth.pressSettingsProfileDetailsButton">' +
        '//table[@class="h9-settings-tabFooter-table"]//button[contains' +
            ' (text(), "Save")]' +
      '</target>' +

      '<target title="Cancel" hotkey="c" ' +
          'action="CALL:axsHealth.pressSettingsProfileDetailsButton">' +
        '//table[@class="h9-settings-tabFooter-table"]//button[contains' +
            '(text(), "Cancel")]' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * Map for flags indicating if a handler for an event has been triggered
 * @type {Object}
 */
axsHealth.eventHandlerToEventMap = new Object();

/**
 * Time out for processing events.
 * @type {Number}
 */
axsHealth.EVT_HANDL_TIMEOUT_INT = 350;


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type {AxsJAX?}
 */
axsHealth.axsJAXObj = null;

/**
 * The AxsJAX navigation object for the 'Personal record' section.
 * @type {AxsNav?}
 */
axsHealth.axsNavObjPersProf = null;

/**
 * The AxsJAX navigation object for the 'Add to profile' section.
 * @type {AxsNav?}
 */
axsHealth.axsNavObjAddToProf = null;

/**
 * The AxsJAX navigation object for the modal dialogs.
 * @type {AxsNav?}
 */
axsHealth.axsNavObjModWin = null;

/**
 * The AxsJAX navigation object for the 'Setting' section.
 * @type {AxsNav?}
 */
axsHealth.axsNavObjSet = null;

/**
 * Handle to the currently active AxsNav object.
 * @type {AxsNav?}
 */
axsHealth.activeAxsNavObj = null;

/**
 * Handle to the previously active AxsNav object. Modal windows
 * have a separate AxsNav object and after closing should return the
 * control to the AxsNav that was active before their opening.
 * @type {AxsNav?}
 */
axsHealth.previousAxsNavObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsHealth.axsSound = null

/**
 * The AxsLens object that will magnify content.
 * @type {AxsLens?}
 */
axsHealth.axsLensObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions
 * in the AxsNav object for the 'Personal profile' section.
 * @type {PowerKey?}
 */
axsHealth.powerKeyObjPersProf = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions
 * in the AxsNav object for the 'Add to profile' section.
 * @type {PowerKey?}
 */
axsHealth.powerKeyObjAddToProf = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsHealth.powerKeyObjModWin = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsHealth.powerKeyObjSet = null;

/**
 * The magnification factor for the AxsLens object.
 * @type {Number}
 */
axsHealth.magSize = 1.5;

/**
 * Map from images style (string) to message (string)
 * @type {Object?}
 */
axsHealth.imageStyleToMessageMap = null;

/**
 * Flag that indicates if opening of the 'Add to record' section tab should
 * be announced.
 * @type {boolean}
 */
axsHealth.announceAddToRecordSectionOpened = false;

/**
 * Message for buffer for queuing messages.
 * @type {string}
 */
axsHealth.messageBuffer = '';

/**
 * Array of inputs for the currently edited category.
 * @type {Object?}
 */
axsHealth.categoryInputElements = null;

/**
 * Flag indicating if a user input section is opened.
 * @type {boolean}
 */
axsHealth.userInputSectionOpened = false;

/**
 * Used to determine the direction of CNR inter-list traversal. Since
 * AxsJAX still does not provide a mechanism for removing and adding lists,
 * the lists unrelated to the current section are skipped iteratively. 
 * @type {string?}
 */
axsHealth.lastListNavigationKey = null;

/**
 * The transparency level of the background of the PowerKey
 * @type {number} 
 */
axsHealth.powerKeyBackgroundTransparency = 40;

/**
 * Initializes the AxsJAX script.
 */
axsHealth.init = function() {
  var func = axsHealth.initEventHandler;
  document.addEventListener('DOMSubtreeModified', func, true);
};

/**
 * Event handler for the initialization of the script.
 * @param {Event} evt A DOMSubtreeModified event.
 * 
 * NOTE: We are looking for the last event generated when the page is loaded to
 * guarantee that the script is executed last. The handler will be removed after
 * the integration with Health since the initAxsJax method will be called
 * explicitly by the initialization routine of the application.
 */
axsHealth.initEventHandler = function(evt) {
  var target = evt.target;
  var className = 'weaver-canvas-header canvas-header-default-bgcolor';
  if (target.className == className) {
    axsHealth.initAxsJAX();
  }
};

/**
 * Initializes the AxsJAX framework. Adds event listeners required for
 * handling dynamic content. Synchronizes the AxsJAX state with the page.
 */
axsHealth.initAxsJAX = function() {
  //Initialize AxsJAX
  if (axsHealth.axsJAXObj === null) {
    axsHealth.axsJAXObj = new AxsJAX(true);
  }

  //Not all data loaded (no current profile)
  if (axsHealth.getCurrentProfile() === null) {
    return;
  }

  //In production the handler is not called in the init phase but still present
  var func = axsHealth.initEventHandler;
  document.removeEventListener('DOMSubtreeModified', func, true);

  //Initialize the AxsJAX framework utilities
  axsHealth.axsLensObj = new AxsLens(axsHealth.axsJAXObj);
  axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
  axsHealth.axsLensObj.setPadding(25);
  axsHealth.axsSound = new AxsSound(true);

  //All PowerKey instances have Health specific style
  axsHealth.modifyPowerKeyDefaultCssStyle();
  var transp = axsHealth.powerKeyBackgroundTransparency;

  //AxsNav for the 'Personal profile' section
  axsHealth.axsNavObjPersProf = new AxsNav(axsHealth.axsJAXObj);
  axsHealth.axsNavObjPersProf.setLens(axsHealth.axsLensObj);
  axsHealth.axsNavObjPersProf.navInit(axsHealth.PROFILE_CNR, null);
  axsHealth.axsNavObjPersProf.setSound(axsHealth.axsSound);
  axsHealth.powerKeyObjPersProf = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.axsNavObjPersProf.setPowerKey(axsHealth.powerKeyObjPersProf, '.');
  axsHealth.powerKeyObjPersProf.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.powerKeyObjPersProf.setCompletionFieldStyle('black',
                                                        20,
                                                        'white',
                                                        100,
                                                        'normal',
                                                        'Arial, Sans-serif');
  axsHealth.axsNavObjPersProf.disableNavKeys();

  //AxsNav for the 'Add to profile' section
  axsHealth.axsNavObjAddToProf = new AxsNav(axsHealth.axsJAXObj);
  axsHealth.axsNavObjAddToProf.setLens(axsHealth.axsLensObj);
  axsHealth.axsNavObjAddToProf.navInit(axsHealth.ADD_TO_PROFILE_CNR, null);
  axsHealth.axsNavObjAddToProf.setSound(axsHealth.axsSound);
  axsHealth.powerKeyObjAddToProf = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.axsNavObjAddToProf.setPowerKey(axsHealth.powerKeyObjAddToProf, '.');
  axsHealth.powerKeyObjAddToProf.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.powerKeyObjAddToProf.setCompletionFieldStyle('black',
                                                         20,
                                                         'white',
                                                         100,
                                                         'normal',
                                                         'Arial, Sans-serif');
  axsHealth.axsNavObjAddToProf.disableNavKeys();

  //AxsNav for 'Settings' section
  axsHealth.axsNavObjSet = new AxsNav(axsHealth.axsJAXObj);
  axsHealth.axsNavObjSet.setLens(axsHealth.axsLensObj);
  axsHealth.axsNavObjSet.navInit(axsHealth.SETTINGS_CNR, null);
  axsHealth.axsNavObjSet.setSound(axsHealth.axsSound);
  axsHealth.powerKeyObjSet = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.axsNavObjSet.setPowerKey(axsHealth.powerKeyObjSet, '.');
  axsHealth.powerKeyObjSet.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.powerKeyObjSet.setCompletionFieldStyle('black',
                                                   20,
                                                   'white',
                                                   100,
                                                   'normal',
                                                   'Arial, Sans-serif');
  axsHealth.axsNavObjSet.disableNavKeys();

  //AxsNav for 'Modal dialogs'
  axsHealth.axsNavObjModWin = new AxsNav(axsHealth.axsJAXObj);
  axsHealth.axsNavObjModWin.setLens(axsHealth.axsLensObj);
  axsHealth.axsNavObjModWin.navInit(axsHealth.MODAL_DIALOG_CNR, null);
  axsHealth.axsNavObjModWin.setSound(axsHealth.axsSound);
  axsHealth.powerKeyObjModWin = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.axsNavObjModWin.setPowerKey(axsHealth.powerKeyObjModWin, '.');
  axsHealth.powerKeyObjModWin.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.powerKeyObjModWin.setCompletionFieldStyle('black',
                                                       20,
                                                       'white',
                                                       100,
                                                       'normal',
                                                       'Arial, Sans-serif');
  axsHealth.axsNavObjModWin.disableNavKeys();

  //Add event listeners
  var func = axsHealth.keyHandler;
  document.addEventListener('keypress', func, true);

  func = axsHealth.domNodeInsertedEventDispatch;
  document.addEventListener('DOMNodeInserted', func, true);

  func = axsHealth.domNodeRemovedEventDispatch;
  document.addEventListener('DOMNodeRemoved', func, true);

  func = axsHealth.documentDOMSubtreeModifiedEventDispatch;
  document.addEventListener('DOMSubtreeModified', func, true);

  func = axsHealth.announceButtonClickEventHandler;
  document.addEventListener('click', func, true);

  //Modify style sheets for improved presentation
  axsHealth.customizeStyleSheetsToEnableMagnification();

  //Set the active document section
  axsHealth.setActiveAxsNavObjPersProf();

  //Sync the AxsNav object with the page
  axsHealth.synchronizeProfileList();
  axsHealth.synchronizeAxsNavObjPersProf();
};

/**
 * Synchronizes the 'Profile' list with the loaded profile.
 */
axsHealth.synchronizeProfileList = function() {
  var element = axsHealth.getCurrentProfile();
  axsHealth.synchronizeListViaTextContent('Profiles', element.textContent);
};

/**
 * Gets the current profile.
 * @return {Node?} The current profile if it exists.
 */
axsHealth.getCurrentProfile = function() {
  var xPath = '//table[@class="weaver-nav"]//tr[.//table[@class="' +
      'profile-nav-wrapper"]]//div[contains(@class, "weaver-nav-title")]';
  var profile = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0] || null;

  return profile;
};

/**
 * Synchronizes a list of the active AxsNav object to be positioned on an 
 * item with a given text content.
 * @param {string} title The title of the list.
 * @param {string} text The text content of the item with which to syncronize.  
 */
axsHealth.synchronizeListViaTextContent = function(title, text) {
  //Find the list
  var currentList = null;
  var lists = axsHealth.activeAxsNavObj.navArray;

  for (var i = 0, list; list = lists[i]; i++) {
    if (list.title == title) {
      currentList = list;
      break;
    }
  }

  //Sync if list found
  if (currentList) {
    var items = currentList.items;
    for (var i = 0, item; item = items[i]; i++) {
      if (item.elem.textContent == text) {
        var navListIdx = axsHealth.activeAxsNavObj.navListIdx;
        axsHealth.activeAxsNavObj.navItemIdxs[navListIdx] = i;
        axsHealth.activeAxsNavObj.lastItem = item;
        break;
      }
    }
  }
};

/**
 * Synchronizes the list with the selected category in the current profile.
 */
axsHealth.synchronizeAxsNavObjPersProf = function() {
  var func = function() {
               var xPath = '//div[@class="weaver-nav-item noWrap caption-' +
                   'padding weaver-nav-title-selected" or @class="weaver-' +
                   'nav-item noWrap weaver-nav-title-selected"]';
               var rootNode = document.body;
               var element = axsHealth.axsJAXObj.evalXPath(xPath, rootNode)[0];

               if (element) {
                 var elementText = element.textContent;

                 var lists = axsHealth.axsNavObjPersProf.navArray;
                 for (var i = 0, list; list = lists[i]; i++) {
                   if (list.title == elementText) {
                     axsHealth.axsNavObjPersProf.navListIdx = i;
                     break;
                   }
                 }
               }
             };

  window.setTimeout(func, 0);
};

/**
 * Opens the current profile.
 */
axsHealth.openCurrentProfile = function() {
  axsHealth.setActiveAxsNavObjPersProf();
  axsHealth.axsNavObjPersProf.navListIdx = 0;
  axsHealth.synchronizeProfileList();
  axsHealth.announceCurrentProfile();
};

/**
 * Synchronizes the 'Add to profile' list with the selected category in the
 * 'Personal profile' section.
 */
axsHealth.synchronizeAddToProfileSection = function() {
  var navListIdx = axsHealth.axsNavObjPersProf.navListIdx;

  if (navListIdx > 3 && navListIdx < 10) {
    axsHealth.axsNavObjAddToProf.navListIdx = navListIdx - 4;
  }
};

/**
 * Callback handler for selecting an item from the 'Profiles' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.selectProfile = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
};

/**
 * Announces the current profile.
 */
axsHealth.announceCurrentProfile = function() {
  var text = axsHealth.generateCurrentProfileMessage() + '. ';
  text = text + axsHealth.str.PERSONAL_PROFILE_ACTIVE;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Gather the content of a 'Found doctors' search result.
 * @param {Object} item A wrapper for the current DOM node.
 * @return {string} The text content of the search result.
 */
axsHealth.getDoctorContent = function(item) {
  var element = item.elem;
  var xPath = './/tr[not(.//table or .//div[contains(@class, "link")])]';
  var contentRows = axsHealth.axsJAXObj.evalXPath(xPath, element);

  var company = contentRows[0].textContent;
  var address = contentRows[1].textContent;
  var phone = contentRows[2].textContent;

  var text = company + '. ' + axsHealth.str.ADDRESS + ' ';
  text = text + address + '. ' + axsHealth.str.PHONE_NUMBER + ' ' + phone;
  text = text + '. ' + axsHealth.str.AVAILABLE_ACTIONS;

  //Add the available actions to the message
  var targets = axsHealth.activeAxsNavObj.currentList().targets;
  var element = axsHealth.activeAxsNavObj.currentItem().elem;
  for (var i = 0, target; target = targets[i]; i++) {
    //All targets with a hotkey act on links in the search result
    if (target.hotkeyStr != '' && 'dwsDEL'.indexOf(target.hotkeyStr) > -1) {
      if (axsHealth.axsJAXObj.evalXPath(target.xpath, element).length > 0) {
        text = text + ' ' + target.hotkeyStr + ', ' + target.title + '.';
      }
    }
  }

  return text;
};

/**
 * Generates a message for announcing the current profile.
 * @return {string} Message for announcing the current profile.
 */
axsHealth.generateCurrentProfileMessage = function() {
  var profile = axsHealth.axsNavObjPersProf.currentItem().elem;
  var message = axsHealth.str.PROFILE;
  message = message + ' ' + profile.textContent;
  message = message + ' ' + axsHealth.str.SELECTED;
  return message;
};

/**
 * Callback handler for initializing an 'Add to profile' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.initializeAddToProfileSection = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
  axsHealth.axsLensObj.view(null);

  var text = axsHealth.axsNavObjAddToProf.currentList().title;
  //We use flag since screen readers have no queuing mechanism
  if (axsHealth.announceAddToRecordSectionOpened) {
    axsHealth.announceAddToRecordSectionOpened = false;
    text = axsHealth.str.ADD_TO_PROFILE_ACTIVE + ' ' + text;
  }

  //Modify the DOM for improved presentation
  var index = axsHealth.axsNavObjAddToProf.navListIdx + 1;
  var xPath = '(//table[@class="quickAdd-holder" ]//input)[' + index + ']';
  var input = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  xPath = '(//div[@class="weaver-profile-editor-caption"])[' + index + ']';
  var inputTitle = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  input.title = inputTitle.textContent;

  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for detecting an empty criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.openPersonalProfileSubCategory = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);

  //There is no active category
  axsHealth.categoryInputElements = null;
  axsHealth.userInputSectionOpened = false;

  // Go to the top of the list for the current section only when the section
  // is opened i.e. the list is refreshed for the first time.
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
};

/**
 * Announces the title of the current 'Personal record' subsection.
 */
axsHealth.announcePersonalProfileSubSection = function() {
  axsHealth.refreshCurrentList();

  var list = axsHealth.axsNavObjPersProf.currentList();

  if (list.title == 'Drug interactions' &&
      axsHealth.imageStyleToMessageMap === null) {
    axsHealth.buildImageStyleToMessageMap();
  }

  var text = axsHealth.messageBuffer;
  axsHealth.messageBuffer = '';

  if (list.items.length === 0) {
    text = text + ' ' + axsHealth.str.NO;
  }

  if (list.title == 'Find a doctor') {
  text = text + ' ' + axsHealth.str.DOCTORS_FOUND + '.';
    text = axsHealth.normalizeString(text);
    text = text + ' ' + axsHealth.str.BEGIN_NEW_SEARCH;
  } else {
  text = text + ' ' + list.title;
  }
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Expands the history records in the 'Personal profile' section.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.expandHistoryRecords = function(item) {
  var text = '';

  if (item && item.elem.parentNode.className == 'zippy-minus-cell') {
    text = axsHealth.str.HISTORY_REC_ALREADY_EXPANDED;
  } else {
    var xPath = '//table[@class="profile-details"]//img[not(../self::td' +
        '[@class="zippy-minus-cell"])  and ../../self::tr[not(contains' +
        '(@style, "display: none"))]]';
    var expandLinks = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

    for (var i = 0, expandLink; expandLink = expandLinks[i]; i++) {
      axsHealth.axsJAXObj.clickElem(expandLink, false);
    }

    //Set property on the list to detect if it was expanded
    axsHealth.activeAxsNavObj.currentList().expanded = true;

    text = axsHealth.str.HISTORY_REC_EXPANDED;
  }

  //Announce only if called via a hotkey i.e. not called during list refreshing
  if (item) {
    axsHealth.axsJAXObj.speakTextViaNode(text);
  }
};

/**
 * Collapses the history records in the 'Personal data section'.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.collapseHistoryRecords = function(item) {
  var element = item.elem;
  var text = '';

  if (element.parentNode.className != 'zippy-minus-cell') {
    text = axsHealth.str.HISTORY_REC_ALREADY_COLLAPSED;
  } else {
    var xPath = '//table[@class="profile-details"]//img[../self::td[@class="' +
        'zippy-minus-cell"]  and ../../self::tr[not(contains(@style, ' +
        '"display: none"))]]';
    var collapsedLinks = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

    for (var i = 0, collapsedLink; collapsedLink = collapsedLinks[i]; i++) {
      axsHealth.axsJAXObj.clickElem(collapsedLink, false);
    }

    //Set property on the list to detect if it was not expanded
    axsHealth.activeAxsNavObj.currentList().expanded = false;

    text = axsHealth.str.HISTORY_REC_COLLAPSED;
  }
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for initializing an announcing the 'Biometrics' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.openAndInitializeBiometrics = function(item) {
  axsHealth.openPersonalProfileSubCategory(item);

  var xPath = '//table[@class="profile-name-row"]';
  var dataInputCategories = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

  var weight = dataInputCategories[6];
  axsHealth.modifyBiometricsInputElements(weight);

  var height = dataInputCategories[7];
  axsHealth.modifyBiometricsInputElements(height);

  //We suppress the TAB/Shift + TAB in such cases if no category is active
  axsHealth.userInputSectionOpened = true;
};

/**
 * Adds attributes to input elements to improve presentation.
 * @param {Node} parent The parent of the input elements.
 */
axsHealth.modifyBiometricsInputElements = function(parent) {
  var xPath = './/input';
  var inputs = axsHealth.axsJAXObj.evalXPath(xPath, parent);
  xPath = './/div[@class="gwt-Label"]';
  var labels = axsHealth.axsJAXObj.evalXPath(xPath, parent);
  var firstInput = inputs[0];
  firstInput.setAttribute('title', labels[1].textContent);
  var secondInput = inputs[1];
  secondInput.setAttribute('title', labels[4].textContent);
};

/**
 * Handler for confirming the value of a date input category upon
 * pressing ENTER.
 * @param {Event} evt A keypress event.
 */
axsHealth.confirmDateEntryValueEventHandler = function(evt) {
  if (evt.keyCode == 13) { //ENTER
    var target = evt.target;

    if (target.type == 'text' &&
        target.className.indexOf('readonly') > - 1 &&
        !axsHealth.enterDateViaDatePickerWidget(target)) {
      target.focus();
      target.select();
    } else {
      axsHealth.confirmCategoryValueEventHandler(evt);
    }
  }
};

/**
 * Handler for confirming the value of an input category upon pressing ENTER.
 * @param {Event} evt A keypress event.
 */
axsHealth.confirmCategoryValueEventHandler = function(evt) {
  if (evt.keyCode == 13) { //ENTER
    axsHealth.confirmCategoryValue();
  }
};

/**
 * Sets the inputs (as an array) of the current category
 * @param {Node} categoryNode The category DOM node.
 */
axsHealth.setCurrentCatogoryInputs = function(categoryNode) {
  var xPath = './/*[self::input or self::select or self::textarea]';
  var inputs = axsHealth.axsJAXObj.evalXPath(xPath, categoryNode);
  var listener = null;

  //add listeners for confirming the value of the category
  for (var i = 0, input; input = inputs[i]; i++) {
    if (input.tagName == 'INPUT' &&
        input.className == 'gwt-TextBox gwt-TextBox-readonly') {
      listener = axsHealth.confirmDateEntryValueEventHandler;
      input.removeAttribute('readonly');
    } else {
      listener = axsHealth.confirmCategoryValueEventHandler;
    }
    input.removeEventListener('keypress', listener, true);
    input.addEventListener('keypress', listener, true);
  }

  axsHealth.categoryInputElements = inputs;
};

/**
 * Confirms a category value.
 */
axsHealth.confirmCategoryValue = function() {
  var text = axsHealth.generateCategoryConfirmedMessage();

  //Modal dialogs Save/Cancel are announced during the opening
  var xPath = '//*[@class="tk-ModalDialog"]';
  var modalDialogs = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

  if (modalDialogs.length === 0) {
    //Announce Save/Cancel only if they are available and enabled
    xPath = '//button[contains(text(), "Save")]';
    var saveButton = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
    //Save/Cancel are always provided in pair
    if (saveButton && saveButton.disabled === false) {
      text = text + ' ' + axsHealth.str.PRESS + ' ' + axsHealth.str.SAVE;
      text = text + ' ' + axsHealth.str.CANCEL + '.';
    }
  }

  //Check if the page is still inputting the date => wait a bit to complete
  var timeout = 0;
  var datePicker = document.getElementsByClassName('date-input-box-popup')[0];
  if (datePicker) {
     timeout = axsHealth.EVT_HANDL_TIMEOUT_INT;
  }

  window.setTimeout(function() {
                      axsHealth.axsJAXObj.speakTextViaNode(text);
                    },
                    timeout);

  axsHealth.blurLastFocusedNode();

  //There is no active category
  axsHealth.categoryInputElements = null;
};

/**
 * Event handler for the TAB and Shift + TAB keypress events used for
 * navigation in the current category.
 * @param {Event} evt A keypress event.
 */
axsHealth.tabAndShiftTabWrapEventHandler = function(evt) {
  var target = evt.target;
  var inputs = axsHealth.categoryInputElements;
  var inputsLength = inputs.length;

  if (inputsLength == 1) {
    //For input categories with one item TAB/Shift+TAB go to next/prev category
    var item = null;

    axsHealth.confirmCategoryValue();

    if (evt.shiftKey) {
      item = axsHealth.activeAxsNavObj.prevItem();
    } else {
      item = axsHealth.activeAxsNavObj.nextItem();
    }

    axsHealth.activeAxsNavObj.actOnItem(item);
  } else {
    var nextInputIndex = -1;

    for (var i = 0, input; input = inputs[i]; i++) {
      if (target === input) {
        nextInputIndex = i;
        break;
      }
    }

    if (evt.shiftKey) {
      nextInputIndex--;
      if (nextInputIndex < 0) {
        nextInputIndex = inputsLength - 1;
      }
    } else {
      nextInputIndex++;
      if (nextInputIndex == inputsLength) {
        nextInputIndex = 0;
      }
    }

    var nextInput = inputs[nextInputIndex];
    nextInput.focus();
    if (nextInput.tagName == 'INPUT') {
      nextInput.select();
    }
  }

  //Swallow the event
  evt.stopPropagation();
  evt.preventDefault();
};

/**
 * Event handler for announcing pressing of a button.
 * @param {Event} evt A click event.
 */
axsHealth.announceButtonClickEventHandler = function(evt) {
  var target = evt.target;
  if (target.type == 'button') {
    var text = target.textContent + ' ' + axsHealth.str.BUTTON_PRESSED;
    axsHealth.axsSound.playEarcon('select');
    //button press and closing are announced in one shot
    if (axsHealth.activeAxsNavObj === axsHealth.axsNavObjModWin) {
      axsHealth.axsJAXObj.speakTextViaNode('');
      axsHealth.messageBuffer = text;
    } else {
      axsHealth.axsJAXObj.speakTextViaNode(text);
    }
  }
};

/**
 * Sets the refresh mode of the current list of the active AxsNav object.
 * @param {Number} refreshMode the refresh mode (See: axsHealth.refreshMode).
 */
axsHealth.setCurrentListRefreshMode = function(refreshMode) {
  if (axsHealth.activeAxsNavObj) {
    var list = axsHealth.activeAxsNavObj.currentList();
    list.refreshMode = refreshMode;
  }
};

/**
 * Announces the confirmed value for an input category.
 * @return {string} Confirmation message for the current input category. 
 */
axsHealth.generateCategoryConfirmedMessage = function() {
  var category = axsHealth.activeAxsNavObj.currentItem().elem;
  var message = axsHealth.str.VALUE + ' ';
  message = message + axsHealth.generateCategoryValueMessage(category);
  message = message + ' ' + axsHealth.str.CONFIRMED;
  return message;
};

/**
 * Callback handler for reading the summary of the 'Conditions' section.
 */
axsHealth.readConditionsSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
      'table[@class="weaver-profile-section"])[2]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Callback handler for reading the summary of the 'Medications' section.
 */
axsHealth.readMedicationsSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
    'table[@class="weaver-profile-section"])[3]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Callback handler for reading the summary of the 'Allergies' section.
 */
axsHealth.readAllergiesSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
    'table[@class="weaver-profile-section"])[4]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Callback handler for reading the summary of the 'Procedures' section.
 */
axsHealth.readProceduresSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
    'table[@class="weaver-profile-section"])[5]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Callback handler for reading the summary of the 'Test results' section.
 */
axsHealth.readTestResultsSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
    'table[@class="weaver-profile-section"])[6]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Callback handler for reading the summary of the 'Immunizations' section.
 */
axsHealth.readImmunizationsSumnmary = function() {
  var xPath = '(//table[@class="weaver-profile-summary"]//' +
    'table[@class="weaver-profile-section"])[7]//td/div';
  axsHealth.readSectionSummary(xPath);
};

/**
 * Reads a summary for a section given an xPath to that section.
 * @param {string} xPath XPath to the requested summary.
 */
axsHealth.readSectionSummary = function(xPath) {
  var rows = axsHealth.axsJAXObj.evalXPath(xPath, document.body);
  var text = '';

  if (rows.length == 1) {
    text = axsHealth.str.NO_EXISTING + ' ';
    text = text + axsHealth.normalizeString(rows[0].firstChild.textContent);
  } else {
    text = axsHealth.str.EXISTING;
    for (var i = 0, row; row = rows[i]; i++) {
      if (i > 0) {
        text = text + ', ';
      }
      text = text + axsHealth.normalizeString(row.firstChild.textContent);
    }
  }
  // The last focused node is the button on the dialog that is being taken away.
  // Set it to null here to avoid a race condition that causes that node to be
  // used for active descendant's focused ancestor.
  axsHealth.axsJAXObj.lastFocusedNode = null;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for reading items in the 'Found doctors' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readDoctor = function(item) {
  var element = item.elem;
  var text = axsHealth.getDoctorContent(item);
  axsHealth.speakAndGo(element, text);

  var xPath = './/div[contains(text(), "Delete")]';
  var saveLink = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];
  if (saveLink) {
    axsHealth.axsSound.playEarcon('alert');
  }
};

/**
 * Callback handler for activating the 'Personal profile' section.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.activatePersonalProfileSection = function(item) {
  axsHealth.setActiveAxsNavObjPersProf();
  var message = axsHealth.str.PERSONAL_PROFILE_ACTIVE;
  axsHealth.messageBuffer = message;
};

/**
 * Sets axsNavRecObj as active.
 */
axsHealth.setActiveAxsNavObjPersProf = function() {
  axsHealth.initializePersonalProfileSection();

  axsHealth.axsJAXObj.speakTextViaNode(axsHealth.messageBuffer);
  axsHealth.setActiveAxsNavObj(axsHealth.axsNavObjPersProf);
};

/**
 * Sets axsNavObjAddToProf as active.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.setActiveAxsNavObjAddToProf = function(item) {
  axsHealth.axsJAXObj.clickElem(item.elem, false);
  axsHealth.synchronizeAddToProfileSection();
  axsHealth.setActiveAxsNavObj(axsHealth.axsNavObjAddToProf);

  //We switched to this section - announced it
  axsHealth.announceAddToRecordSectionOpened = true;
};

/**
 * Sets axsNavObjSet as active.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.setActiveAxsNavObjSet = function(item) {
  axsHealth.axsJAXObj.clickElem(item.elem, false);
  axsHealth.axsLensObj.view(null);

  axsHealth.generateSettingsSectionActiveMessage();
  axsHealth.setActiveAxsNavObj(axsHealth.axsNavObjSet);
};

/**
 * Sets axsNavObjModWin as active.
 */
axsHealth.setActiveAxsNavObjModWin = function() {
  axsHealth.setActiveAxsNavObj(axsHealth.axsNavObjModWin);
};

/**
 * Sets the active AxsNav object.
 * @param {AxsNav?} axsNavObj The axsNav object to be set as active.
 */
axsHealth.setActiveAxsNavObj = function(axsNavObj) {
  if (axsHealth.activeAxsNavObj !== null) {
    axsHealth.activeAxsNavObj.disableNavKeys();
  }

  axsNavObj.enableNavKeys();
  axsHealth.activeAxsNavObj = axsNavObj;
};

/**
 * Callback handler for reading items in the 'Profiles' list of the
 * 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readProfile = function(item) {
  var element = item.elem;
  var profileName = element.childNodes[0];
  var linkStatus = element.childNodes[1];

  var text = axsHealth.str.PROFILE + ' ' + profileName.textContent;
  text = text + ' ' + axsHealth.str.SET_TO + ' ' + linkStatus.textContent;

  axsHealth.speakAndGo(profileName, text);
};

/**
 * Callback handler for reading items in the 'Profile details' list of the
 * 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readProfileDetail = function(item) {
  var element = item.elem;

  var xPath = './/div[contains(@class, "h9-settings-bold")]';
  var inputLabel = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];

  var text = inputLabel.textContent + '.';
  var value = axsHealth.generateCategoryValueMessage(element);

  if (value === '') {
    text = text + ' ' + axsHealth.str.BLANK;
  } else {
    text = text + ' ' + axsHealth.str.SET_TO + ' ' + value;
  }
  text = text + ' ' + axsHealth.str.ENTER_TO_EDIT;

  axsHealth.axsJAXObj.speakTextViaNode(text);
  axsHealth.axsLensObj.view(inputLabel);
};

/**
 * Callback handler for initializing the 'Profile details' section.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.openSettingsSubCategory = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);

  var text = axsHealth.axsNavObjSet.currentList().title;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for opening the 'Profile details' sub section of the
 * 'Settings' section. 
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.openProfileDetailsSubCategory = function(item) {
  var xPath = '//table[@class="gwt-TabBar"]//div[text()="Profile details"]';
  var tab = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  //Skip the list if the tab is not visible
  if (tab === undefined) {
    if (axsHealth.lastListNavigationKey == 'l')
      axsHealth.axsNavObjSet.nextList();
    else if (axsHealth.lastListNavigationKey == 'h') {
      axsHealth.axsNavObjSet.prevList();
    }
    axsHealth.axsNavObjSet.doListEntryActions();
  }
};

/**
 * Callback handler for editing records in 'Profiles' list of the 
 * 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.editProfileSettings = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
  axsHealth.nextListAndExecuteEntryTarget();
};

/**
 * Goes to the next list in the active AxsNav object and executes the 
 * onEntry target if such exists.
 * NOTE: The nextList method of AxsNav does not execute the entry targets.
 */
axsHealth.nextListAndExecuteEntryTarget = function() {
  axsHealth.activeAxsNavObj.nextList();
  var list = axsHealth.activeAxsNavObj.currentList();
  if (list.entryTarget) {
    axsHealth.activeAxsNavObj.actOnTarget(list.entryTarget);
  }
};

/**
 * Goes to the previous list in the active AxsNav object and executes the 
 * onEntry target if such exists.
 * NOTE: The prevList method of AxsNav does not execute the entry targets.
 */
axsHealth.prevListAndExecuteEntryTarget = function() {
  axsHealth.activeAxsNavObj.prevList();
  var list = axsHealth.activeAxsNavObj.currentList();
  if (list.entryTarget) {
    axsHealth.activeAxsNavObj.actOnTarget(list.entryTarget);
  }
};

/**
 * Initializes the 'Personal record' section.
 */
axsHealth.initializePersonalProfileSection = function() {
  if (axsHealth.activeAxsNavObj === axsHealth.axsNavObjAddToProf) {
    var navListIdx = axsHealth.axsNavObjAddToProf.navListIdx + 4;
    axsHealth.axsNavObjPersProf.navListIdx = navListIdx;
  }

  var target = axsHealth.axsNavObjPersProf.currentList().entryTarget;
  var xPath = null;
  if (target) {
    xPath = target.xpath;
    var subsection = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
    var xPath = axsHealth.axsJAXObj.clickElem(subsection, false);
  }
};

/**
 * Callback handler for positioning the user in the search box in 
 * the 'Notices' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.goToNoticesSearchBox = function(item) {
  item.elem.title = 'Search box';
  axsHealth.axsLensObj.view(null);
  axsHealth.goToSearchBox(item);
};

/**
 * Callback handler for positioning the user in the actions select box in 
 * the 'Notices' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.goNoticesActionSelect = function(item) {
  var element = item.elem;
  if (element.disabled) {
    axsHealth.axsJAXObj.speakTextViaNode(axsHealth.str.PLEASE_SELECT_NOTICE);
  } else {
    var func = function() {
                 element.focus();
               };
    window.setTimeout(func, 0);

    //If Actions is focused on refresh AxsJAXObj does not get updated since
    //no blur event is generated before disabling the Actions select.
    var handler = function(evt) {
                evt.target.blur();
              };
    element.addEventListener('change', handler, true);
  }
  axsHealth.axsLensObj.view(null);
};

/**
 * Callback handler for positioning the user in a search box.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.goToSearchBox = function(item) {
  var element = item.elem;
  element.focus();
  element.select();
};

/**
 * Handles the DOMSubtreeModified event. This method serves as an event dispatch
 * and delegates event processing to specialized event handlers.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.documentDOMSubtreeModifiedEventDispatch = function(evt) {
  var target = evt.target;

  //We detect special nodes by class name
  if (!target.className) {
    return;
  }

  if (target.className == 'weaver-drug-interaction-image') {

    axsHealth.announceDrugInteractionsExistenceEventHandler(evt);

  } else if (target.className.indexOf('weaver-nav-title weaver-nav-title-' +
      'selected') > -1) {

    axsHealth.openCurrentProfileEventHandler(evt);

  } else if (target.className.indexOf('weaver-nav-title-selected-backg' +
      'round') > -1) {

    if (axsHealth.activeAxsNavObj.currentList().title == 'Profiles') {

      axsHealth.refreshCurrentListGoTopEventHandler(evt);

    } else {

      axsHealth.announcePersonalProfileSubSectionEventHandler(evt);
    }

  } else if (target.className == 'notices-list') {

    axsHealth.announceNoticesSearchResultEventHandler(evt);

  } else if (target.className == 'profile-history-wrapper') {

    axsHealth.refreshPersonalProfileListEventHandler(evt);

  } else if (target.className.indexOf('gwt-TabBarItem-selected') > -1 ||
      target.className == 'weaver-profile-editor-separator') {

    axsHealth.refreshCurrentListKeepCurrentPositionEventHandler(evt);

  } else if (target.className.indexOf('DDSearchView-body') > -1) {

    axsHealth.announceDoctorSearchSummaryEventHandler(evt);

  } else if (target.className == 'gwt-Label title' &&
      target.textContent == 'Add to this profile') {

    axsHealth.openAddToProfileSectionEventHandler(evt);

  } else if (target.className.indexOf('suggestbox-Popup-row selected') > -1) {

    axsHealth.axsJAXObj.speakTextViaNode(target.textContent);

  } else if (target.className.indexOf('canvas-header-alt-bgcolor') > -1) {

    axsHealth.announceSettingsSubSectionEventHandler(evt);

  } else if (target.className == 'gwt-HTML') {

    axsHealth.refreshCurrentListEventHandler(evt);

  } else if (target.className == 'DetailsSlot') {

    axsHealth.refreshMedicalContactsListEventHandler(evt);

  }
};

/**
 * Event handler for opening the current profile.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.announceDrugInteractionsExistenceEventHandler = function(evt) {
  var currentList = axsHealth.activeAxsNavObj.currentList();
  if (currentList.title != 'Drug interactions') {
    var func = axsHealth.announceDrugInteractionsExistance;
    axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
  }
};

/**
 * Event handler for opening the current profile.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.openCurrentProfileEventHandler = function(evt) {
  var func = axsHealth.openCurrentProfile;
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for refreshing the current list
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.refreshCurrentListGoTopEventHandler = function(evt) {
  var func = axsHealth.refreshCurrentList;
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for announcing the search results in the 'Notices' list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.announceNoticesSearchResultEventHandler = function(evt) {
  var func = function() {
        axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
        axsHealth.refreshCurrentList();
        axsHealth.announceNoticesSearchResult();
     };
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for refreshing the current list and restoring the current
 * position.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.refreshCurrentListKeepCurrentPositionEventHandler = function(evt) {
  var func = axsHealth.refreshCurrentList;
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.KEEP_CURRENT);
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for announcing a 'Personal record' sub section.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.announcePersonalProfileSubSectionEventHandler = function(evt) {
  var func = axsHealth.announcePersonalProfileSubSection;
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for refreshing a 'Personal record' subsection list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.refreshPersonalProfileListEventHandler = function(evt) {
  var func = axsHealth.refreshPersonalProfileList;
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.KEEP_CURRENT);
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for announcing the 'Found doctors' search summary.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.announceDoctorSearchSummaryEventHandler = function(evt) {
  var func = function() {
        var list = axsHealth.activeAxsNavObj.currentList();
        if (list.refreshMode === axsHealth.refreshMode.GO_BOTTOM) {
          axsHealth.announceDoctorSearchSummaryAndLastResult();
        } else {
          axsHealth.announceDoctorSearchSummaryAndFirstResult();
        }
      };
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for opening the 'Add to this profile' section.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.openAddToProfileSectionEventHandler = function(evt) {
  var func = function() {
      var target = axsHealth.axsNavObjAddToProf.currentList().entryTarget;
      axsHealth.axsNavObjAddToProf.actOnTarget(target);
    };
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Handles the case of opening the 'Settings' section.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.announceSettingsSubSectionEventHandler = function(evt) {
  var func = function(evt) {
               var fun = axsHealth.announceSettingsSubSection;
               axsHealth.executeFunctionAfterMostRecentEvent(fun, evt);
             };
  window.setTimeout(func, 0);
};

/**
 * Event handler for refreshing the current list using the current refresh 
 * mode of the list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.refreshCurrentListEventHandler = function(evt) {
  var func = axsHealth.refreshCurrentList;
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Event handler for refreshing the current 'Medical contacts' list.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsHealth.refreshMedicalContactsListEventHandler = function(evt) {
  var func = function(evt) {
    axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.KEEP_CURRENT);
    axsHealth.refreshCurrentList();
  };
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Announces the existence of drug interactions, if any.
 */
axsHealth.announceDrugInteractionsExistance = function() {
  var xPath = '//table[@class="drug-interaction-indicator" and ' +
      'not(contains(@style, "display: none"))]';
  var warningImages = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

  if (warningImages.length > 0) {
    var text = axsHealth.str.EXISTING_DRUG_INTERACTIONS;
    axsHealth.axsJAXObj.speakTextViaNode(text);
  }
};

/**
 * Handles the DOMNodeInserted event. This method serves as an event dispatch 
 * and delegates event processing to specialized event handlers.
 * @param {Event} evt A DOMNodeInserted event.
 */
axsHealth.domNodeInsertedEventDispatch = function(evt) {
  var target = evt.target;

  //We detect special nodes by class names
  if (!target.className) {
    return;
  }

  if (target.className.indexOf('weaver-status-widget') > -1) {

    axsHealth.statusMessageAddedEventHandler(evt);

  } else if (target.className.indexOf('overflow-hidden orange-bg') > -1) {

    axsHealth.itemAddedToPersonalProfileEventHandler(evt);

  } else if (target.className == 'tk-ModalDialog') {

    axsHealth.openModalDialogEventHandler(evt);

  }
};

/**
 * Handles the case of showing an application status message.
 * @param {Event} evt A DOMNodeInserted event object.
 */
axsHealth.statusMessageAddedEventHandler = function(evt) {
  var target = evt.target;
  var text = target.textContent;
  axsHealth.axsJAXObj.speakTextViaNode(text);
  axsHealth.axsLensObj.view(null);
};

/**
 * Handles the case of adding an items to the personal profile.
 * @param {Event} evt DOMNodeInserted event object.
 */
axsHealth.itemAddedToPersonalProfileEventHandler = function(evt) {
  var target = evt.target;
  var text = target.firstChild.textContent;
  text = text + ' ' + axsHealth.str.ADDED_TO_PROFILE;
  axsHealth.axsJAXObj.speakTextViaNode(text);
  axsHealth.axsLensObj.view(null);
};

/**
 * Handles the case of opening a modal window.
 * @param {Event} evt A DOMNodeInserted event object.
 */
axsHealth.openModalDialogEventHandler = function(evt) {
  var dialog = evt.target;
  var xPath = './/div[@class="medterm-dialog-title"]';
  var title = axsHealth.axsJAXObj.evalXPath(xPath, dialog)[0].textContent;
  //save as an attribute to avoid evaluation of the same XPath during closing
  dialog.setAttribute('dialog_title', title);

  var xPath = './/*[self::input or self::textarea or self::select]';
  var inputElements = axsHealth.axsJAXObj.evalXPath(xPath, dialog);

  // Data input dialogs only
  var errorMsg = '';
  if (inputElements.length > 0) {
    //Case specific for the edit/create medical contact
    var xPath = './/select[./option[text()="Work"]]';
    var selects = axsHealth.axsJAXObj.evalXPath(xPath, dialog);

    for (var k = 0, select; select = selects[k]; k++) {
      select.id = 'PhoneTypeSelect' + k;

      var textNode = document.createTextNode('Type: ');

      var labelNode = document.createElement('LABEL');
      labelNode.className = 'gwt-Label FieldLabel smaller';
      labelNode.setAttribute('for', 'PhoneTypeSelect' + k);
      labelNode.appendChild(textNode);

      select.parentNode.insertBefore(labelNode, select);
    }
  } else { //Warning modal dialogs
    xPath = '//div[@class="tk-ModalDialog" and .//table//table//table' +
        '//img[@class="gwt-Image"]]';
    var messageNode = axsHealth.axsJAXObj.evalXPath(xPath, dialog)[0];
    errorMsg = messageNode.textContent;
  }

  axsHealth.announceOpenModalDialog(title, dialog, errorMsg);
  axsHealth.activeteModalDialogNavigation();
};

/**
 * Handles the DOMNodeRemoved event. This method serves as an event dispatch 
 * and delegates event processing to specialized event handlers.
 * @param {Event} evt A DOMNodeRemoved event.
 */
axsHealth.domNodeRemovedEventDispatch = function(evt) {
  var target = evt.target;

  //We detect special nodes by class name
  if (!target.className) {
    return;
  }

  if (target.className == 'tk-ModalDialog') {
    axsHealth.closeModalDialogEventHandler(evt);
  }
};

/**
 * Handles the closing of a Modal dialog.
 * @param {Event} evt A DOMNodeRemoved event object.
 */
axsHealth.closeModalDialogEventHandler = function(evt) {
  var target = evt.target;
  var func = function() {
        // The last focused node is the button on the dialog that is being
        // taken away. Set it to null here to avoid a race condition that 
        // causes that node to be used for active descendant's focused ancestor.
        axsHealth.axsJAXObj.lastFocusedNode = null;
        axsHealth.announceCloseModalDialog(target);
        axsHealth.activateModalDialogParentNavigation();
  };
  axsHealth.executeFunctionAfterMostRecentEvent(func, evt);
};

/**
 * Processes opening of a modal dialog.
 * @param {string} title The title of the modal dialog.
 * @param {Node} dialog The DOM dialog object.
 * @param {string} errorMsg Error message if the modal dialog is a warning.
 */
axsHealth.announceOpenModalDialog = function(title, dialog, errorMsg) {
  var text = title + ' ' + axsHealth.str.WINDOW_OPENED;
  text = text + ' ' + axsHealth.str.PRESS;

  var xPath = './/button[text()="Save"]';
  var save = axsHealth.axsJAXObj.evalXPath(xPath, dialog)[0];
  if (save) {
    text = text + ' ' + axsHealth.str.SAVE;
  }

  xPath = './/button[text()="Cancel"]';
  var cancel = axsHealth.axsJAXObj.evalXPath(xPath, dialog)[0];
  if (cancel) {
    text = text + ' ' + axsHealth.str.CANCEL;
  }

  xPath = './/button[text()="OK"]';
  var ok = axsHealth.axsJAXObj.evalXPath(xPath, dialog)[0];
  if (ok) {
    text = text + ' ' + axsHealth.str.ESC_TO_CLOSE;
  }

  text = text + '. ' + errorMsg;
  var func = function() {
      axsHealth.axsJAXObj.speakTextViaNode(text);
  };
  window.setTimeout(func, 0);

  //clear the lens if something is focused in the background
  axsHealth.axsLensObj.view(null);
};

/**
 * Activates the navigation of a Modal dialog. 
 */
axsHealth.activeteModalDialogNavigation = function() {
  if (axsHealth.activeAxsNavObj != axsHealth.axsNavObjModWin) {
    axsHealth.previousAxsNavObj = axsHealth.activeAxsNavObj;
  }

  axsHealth.setActiveAxsNavObjModWin();
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
  axsHealth.refreshCurrentList();

  axsHealth.userInputSectionOpened = true;
};

/**
 * Announces the closing of a modal dialog.
 * @param {Node} dialog The dialog DOM element.
 */
axsHealth.announceCloseModalDialog = function(dialog) {
  axsHealth.axsLensObj.view(null);
  var title = dialog.getAttribute('dialog_title');
  var text = axsHealth.messageBuffer;
  axsHealth.messageBuffer = '';
  text = text + ' ' + title + ' ' + axsHealth.str.WINDOW_CLOSED;
  axsHealth.axsJAXObj.speakText(text);
};

/**
 * Activates the navigation of the parent of a Modal dialog. 
 */
axsHealth.activateModalDialogParentNavigation = function() {
  var xPath = '//*[@class="tk-ModalDialog"]';
  var dialogs = axsHealth.axsJAXObj.evalXPath(xPath, document.body);
  var dialog = dialogs[dialogs.length - 1];

  if (dialog) {
    axsHealth.setActiveAxsNavObj(axsHealth.axsNavObjModWin);
    axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
  } else {
    axsHealth.setActiveAxsNavObj(axsHealth.previousAxsNavObj);
    axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.KEEP_CURRENT);
  }
  axsHealth.refreshCurrentList();

  axsHealth.blurLastFocusedNode();
  axsHealth.userInputSectionOpened = false;
};

 /**
  * Generates a message to announce opening of the 'Settings' section.
  * The message is read during the announcement of the current subsection.
  * NOTE: Such a mechanism is used due to the screen readers inability of 
  * queuing.
  */
axsHealth.generateSettingsSectionActiveMessage = function() {
  var message = axsHealth.str.SETTINGS_ACTIVE;
  axsHealth.messageBuffer = message;
};

/**
 * Blurs the last focused node if it exists and is can be blurred.
 */
axsHealth.blurLastFocusedNode = function() {
  if (axsHealth.axsJAXObj.lastFocusedNode &&
      axsHealth.axsJAXObj.lastFocusedNode.blur) {
    axsHealth.axsJAXObj.lastFocusedNode.blur();
  }
};

/**
 * Announces the result of a search in the 'Notices' sub-section of 
 * the 'Personal profile section'.
 */
axsHealth.announceNoticesSearchResult = function() {
  var count = axsHealth.str.NO;
  var xPath = '//table[@class="notice-count-indicator" and not(contains' +
      '(@style, "display: none"))]//td[2]';
  var countElement = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  if (countElement) {
    count = countElement.textContent;
  }

  xPath = '//table[@class="notices-navBar"]//nobr//b';
  var summaryElements = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

  var from = summaryElements[0].textContent;
  var to = summaryElements[1].textContent;
  var of = summaryElements[2].textContent;

  var order = '';
  xPath = '//table[@class="notices-wrapper"]//img[not(contains(@style, ' +
      '"display: none;"))]';
  var image = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (image) {
    var descendingImageStyle = '-283px -35px; width: 7px; height: 7px;';
    var criteria = image.parentNode.previousSibling.textContent;

    var mapping = axsHealth.phrasesMap[criteria];
    if (mapping) {
      criteria = mapping;
    }

    if (image.style.cssText.indexOf(descendingImageStyle) > -1) {
      order = axsHealth.str.ORDERED_BY + ' ' + criteria;
      order = order + ' ' + axsHealth.str.DESCENDING;
    } else {
      order = axsHealth.str.ORDERED_BY + ' ' + criteria;
      order = order + ' ' + axsHealth.str.ASCENDING;
    }
  }

  var phrases = new Array(count, from, to, of, order);
  var template = axsHealth.str.NOTICE_RESULT_TEMPLATE;
  var text = axsHealth.populateTemplate(template, phrases);

  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Announces the title of the current 'Personal record' subsection.
 * Also the list for the subsection is refreshed.
 */
axsHealth.announceSettingsSubSection = function() {
  var text = axsHealth.messageBuffer;
  axsHealth.messageBuffer = '';

  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.KEEP_CURRENT);
  axsHealth.refreshCurrentList();

  var list = axsHealth.activeAxsNavObj.currentList();
  text = text + ' ' + list.title;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Validates the value of a date input field. The date is in the format 
 * (dd-mm-yyyy or dd/mm/yyyy or dd.mm.yyyy or mmm dd, yyyy). Note that the
 * month and the day could be single digit numbers and mmm stands for
 * abbreviation of the month name (Ex: January => Jan).
 * @param {string} dateString A date string to be validated.
 * @return {boolean} True if the date is valid, false otherwise.
 */
axsHealth.validateDateInput = function(dateString) {
  var valid = true;

  //Template for dates entered by the user. Example: 01.01.2008 or 01/01/2008 or
  //01-01-2008
  var userEnteredTemplate = '^(?=\\d)(?:(?:(?:(?:(?:0?[13578]|1[02])' +
      '(\\/|-|\\.)31)\\1|(?:(?:0?[1,3-9]|1[0-2])(\\/|-|\\.)(?:29|30)\\2))' +
      '(?:(?:1[6-9]|[2-9]\d)?\\d{2})|(?:0?2(\\/|-|\\.)29\\3(?:(?:(?:1[6-9]|' +
      '[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|' +
      '[3579][26])00))))|(?:(?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(?:0?[1-9]' +
      '|1\\d|2[0-8])\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})))?$';

  //Template for dates generated by the date picker. Example: Jan 12, 2008
  var datePickerTempate = '^(((Jan|Mar|May|Jul|Aug|Oct|Dec)\\s(([12][0-9])|' +
      '([3][01])|([0-9]))(,\\s\\d{4})$)|((Apr|Jun|Sep|Nov)\\s(([12][0-9])|' +
      '([3][0])|([0-9]))(,\\s\\d{4})$)|(Feb\\s(([12][0-9])|([0-9]))' +
      '(,\\s\\d{4})$))';

  var regExpObj = new RegExp(userEnteredTemplate + '|' + datePickerTempate);

  if (dateString == '' || !regExpObj.test(dateString)) {
    valid = false;
  }

  return valid;
};

/**
 * Enters the date entered by the user in using a DatePicker GWT widget.
 * @param {Node} input The DOM node that contains the date to be entered.
 * @return {boolean} True if the date widget was populated successfully,
 * false otherwise.
 *
 * NOTE: The DatePicker GWT widget does not allow the user to type in
 * a date. The only mechanism for entering such a date is via the GUI which is
 * challenging for a user with impaired vision.
 */
axsHealth.enterDateViaDatePickerWidget = function(input) {
  var date = input.value;

  //Proceed only in case of valid date
  if (!axsHealth.validateDateInput(date)) {
    axsHealth.speakInvalidDateMessage();
    return false;
  }

  //Parse user input
  var delimiter = date.charAt(date.length - 5);
  var elements = date.split(delimiter);

  //month
  var month = axsHealth.phrasesMap[elements[0]];
  if (month === undefined) {
    month = elements[0];
  }
  //Convert to string
  month = month + '';
  if (month.charAt(0) == '0') {
    month = month.substring(1);
  }

  //day
  var day = (elements[1] + '').replace(',', '');
  if (day.charAt(0) == '0') {
    day = day.substring(1);
  }

  //year - the date picked widget provides selection of years after 1900
  var year = elements[2];
  if (year < 1900 || year > 2019) {
    axsHealth.speakInvalidDateMessage();
    return false;
  }

  //Open the date picker widget
  axsHealth.axsJAXObj.clickElem(input, false);

  var xPath = '//*[@class="date-input-box-popup"]';
  var datePopUp = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  xPath = './/select';
  var selects = axsHealth.axsJAXObj.evalXPath(xPath, datePopUp);

  //Select month
  var monthSelect = selects[0];
  monthSelect.selectedIndex = month - 1;
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  monthSelect.dispatchEvent(evt);

  //Select year
  var yearSelect = selects[1];
  yearSelect.selectedIndex = year - 1900;
  evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', true, true);
  yearSelect.dispatchEvent(evt);

  //Select day
  xPath = './/td[@class="weekday" or @class="weekend-start" or ' +
      '@class="weekend-end" or contains(@class, "selected")]';
  var weekDays = axsHealth.axsJAXObj.evalXPath(xPath, datePopUp);

  var dayDiv = null;
  for (var i = 0, weekDay; weekDay = weekDays[i]; i++) {
    if (weekDay.textContent == day) {
      dayDiv = weekDay.firstChild;
      break;
    }
  }
  axsHealth.axsJAXObj.clickElem(dayDiv, false);

  return true;
};

/**
 * Speaks a message announcing an invalid date and providing 
 * instructions about the correct date format;
 */
axsHealth.speakInvalidDateMessage = function() {
  var func = function() {
      axsHealth.axsJAXObj.speakTextViaNode(axsHealth.str.DATE_ERROR_MESSAGE);
  };
  window.setTimeout(func, 0);
};

/**
 * Clicks a letter link for fast navigation in the current item
 * list of the 'Add to profile' section.
 * @param {number} charCode The char code of the pressed key.
 */
axsHealth.clickLetterLinkForCharCode = function(charCode) {
  var linkText = '';
  var linkMsg = '';
  var character = String.fromCharCode(charCode);
  if (character >= 0 && character <= 9) {
    linkText = '0-9';
    linkMsg = axsHealth.str.BEGINNING_WITH_NUMBER;
  } else {
    linkText = character.toUpperCase();
    linkMsg = axsHealth.str.BEGINNING_WITH_LETTER + ' ' + linkText;
  }

  var xPath = '//table[@class="quickAdd-letters" and not(contains(@style, ' +
      '"display: none")) and not(.//ancestor::div[contains(@style, ' +
      '"display: none")])]';
  var lettersLinkTable = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (lettersLinkTable) {
    var xPath = './/div[./a[text()="' + linkText + '"] or (text()="' +
        linkText + '" and @class="quickAdd-link-selected")]';
    var letterLink = axsHealth.axsJAXObj.evalXPath(xPath, lettersLinkTable)[0];

    //If list 'Add conditions' we take 'conditions'
    var category = axsHealth.axsNavObjAddToProf.currentList().title;
    category = category.substring(category.indexOf(' '));

    var text = category + ' ' + linkMsg;
    if (letterLink) {
      if (letterLink.className == 'quickAdd-link-bold') {
        axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
        axsHealth.clickLetterLink(letterLink);
        return;
      } else if (letterLink.className == 'quickAdd-link-selected') {
        text = text + ' ' + axsHealth.str.ALREADY_SELECTED;
      }
    } else {
      text = axsHealth.str.NO + ' ' + text;
    }
  } else {
    text = axsHealth.str.NO_LETTER_LINKS;
  }
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for clicking on the next letter link in the 'Add to 
 * profile' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.clickNextLetterLink = function(item) {
  var element = item.elem;
  var nextLetterLinkParent = element.nextSibling;

  if (nextLetterLinkParent.nextSibling === null) {
    //Wrap around to the beginning
    nextLetterLinkParent = element.parentNode.firstChild;
  }
  var nextLetterLink = nextLetterLinkParent.firstChild;

  while (nextLetterLink.className.indexOf('empty') > -1) {
    if (nextLetterLinkParent.nextSibling === null) {
      //Wrap around to the beginning
      nextLetterLinkParent = element.parentNode.firstChild;
    } else {
      //Skip links sections with no data
      nextLetterLinkParent = nextLetterLinkParent.nextSibling;
    }
    nextLetterLink = nextLetterLinkParent.firstChild;
  }

  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);

  axsHealth.clickLetterLink(nextLetterLink);
};

/**
 * Callback handler for clicking on the previous letter link in 'Add to
 * profile' subsections.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.clickPreviousLetterLink = function(item) {
  var element = item.elem;
  var prevLetterLinkParent = element.previousSibling;

  if (prevLetterLinkParent === null) {
    //Skip the last link
    prevLetterLinkParent = element.parentNode.lastChild;
  }
  var prevLetterLink = prevLetterLinkParent.firstChild;

  while (prevLetterLink.className.indexOf('empty') > -1) {
    if (prevLetterLinkParent.previousSibling === null) {
      //Wrap around to the beginning
      prevLetterLinkParent = element.parentNode.lastChild;
    } else {
      //Skip links sections with no data
      prevLetterLinkParent = prevLetterLinkParent.previousSibling;
    }
    prevLetterLink = prevLetterLinkParent.firstChild;
  }

  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_BOTTOM);

  axsHealth.clickLetterLink(prevLetterLink);
};

/**
 * Clicks and announces a letter link for fast navigation in the 
 * current item list of the 'Add to profile' section.
 * @param {Node} letterLink Link DOM node.
 */
axsHealth.clickLetterLink = function(letterLink) {
  axsHealth.axsJAXObj.clickElem(letterLink, false);

  var linkText = letterLink.textContent;
  var title = axsHealth.axsNavObjAddToProf.currentList().title;
  title = title.substring(title.indexOf(' '));

  var text = title;
  if (linkText == '0-9') {
    text = text + ' ' + axsHealth.str.BEGINNING_WITH_NUMBER;
    text = text + ' ' + axsHealth.str.SELECTED;
  } else {
    text = text + ' ' + axsHealth.str.BEGINNING_WITH_LETTER;
    text = text + ' ' + linkText + ' ' + ' ' + axsHealth.str.SELECTED;
  }

  var func = function() {
      axsHealth.axsJAXObj.speakTextViaNode(text);
  };
  window.setTimeout(func, 0);
};

/**
 * Callback handler for reading candidate items (i.e. items to be added) in the
 * subsections of the 'Add to profile' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readCandidateItem = function(item) {
  var element = item.elem;
  var text = element.firstChild.textContent;
  text = axsHealth.normalizeString(text);
  axsHealth.speakAndGo(element, text);
};

/**
 * Callback handler for adding candidate items (i.e. items to be added) in the
 * subsections of the 'Add to profile' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.addCandidateItem = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
};

/**
 * Callback handler for reading notice content.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readNoticeContent = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element.childNodes[1], false);

  //Clear the list since we are now in different context
  axsHealth.refreshCurrentList();

  var className = 'gwt-Label notices-itemSubject';
  var subject = document.getElementsByClassName(className)[0].textContent;
  className = 'gwt-HTML notices-itemContent';
  var content = document.getElementsByClassName(className)[0].textContent;

  var text = axsHealth.str.SUBJECT + '. ' + subject;
  text = text + axsHealth.str.CONTENT + '. ' + content;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for selecting or unselecting notice.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.selectOrUnselectNotice = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
  axsHealth.axsLensObj.view(null);

  var text = axsHealth.str.NOT_SELECTED;
  if (element.checked) {
    text = axsHealth.str.SELECTED;
  }
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Build a map from image styles to messages that describe images.
 */
axsHealth.buildImageStyleToMessageMap = function() {
  var xPath = '//table[@class="healthreport-legend"]//img';
  var images = axsHealth.axsJAXObj.evalXPath(xPath, document.body);

  if (images.length > 0) {
    axsHealth.imageStyleToMessageMap = new Object();
    var style = images[0].style.cssText;
    axsHealth.imageStyleToMessageMap[style] = axsHealth.str.REQUIRES_ATTENTION;
    style = images[1].style.cssText;
    axsHealth.imageStyleToMessageMap[style] = axsHealth.str.DISCUSS_WITH_DOCTOR;
  }
};

/**
 * Callback handler for reading rows of data in the 'Notices' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readNotice = function(item) {
  var element = item.elem;

  var status = '';
  if (element.className.indexOf('notices-unreadrow') > -1) {
    status = axsHealth.str.NEW;
    axsHealth.axsSound.playEarcon('alert');
  }
  var from = element.childNodes[1].textContent;
  var subject = element.childNodes[2].textContent;
  var date = element.childNodes[3].textContent;
  var selected = '';
  var checkBox = element.firstChild.getElementsByTagName('INPUT')[0];
  if (checkBox.checked) {
    selected = axsHealth.str.SELECTED;
    axsHealth.axsSound.playEarcon('select');
  }

  var phrases = new Array(status, from, subject, date, selected);
  var text = axsHealth.populateTemplate(axsHealth.str.NOTICE_TEMPLATE, phrases);

  axsHealth.speakAndGo(element, text);
};

/**
 * Callback handler for reading rows of data in the 'Drug interactions' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readDrugIteraction = function(item) {
  var element = item.elem;
  var xPath = './/img';
  var image = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];

  var severity = axsHealth.imageStyleToMessageMap[image.style.cssText];

  var interaction = element.firstChild.childNodes[0].textContent;
  interaction = axsHealth.normalizeString(interaction);

  var description = element.firstChild.childNodes[1].textContent;

  var phrases = new Array(severity, interaction, description);
  var template = axsHealth.str.DRUG_INTERACTION_TEMPLATE;
  var text = axsHealth.populateTemplate(template, phrases);
  axsHealth.speakAndGo(element, text);
};

/**
 * Callback handler for reading items in the 'Biometrics' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readBiometric = function(item) {
  var element = item.elem;

  var xPath = './/div[contains(@class, "weaver-caption-bold")]';
  var boldLabel = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];

  var text = boldLabel.textContent + '.';
  var value = axsHealth.generateCategoryValueMessage(element);

  if (value == '') {
    text = text + ' ' + axsHealth.str.BLANK;
  } else {
    text = text + ' ' + axsHealth.str.SET_TO + ' ' + value;
  }
  text = text + ' ' + axsHealth.str.ENTER_TO_EDIT;
  axsHealth.speakAndGo(boldLabel, text);
};

/**
 * Callback handler for reading items in the 'Modal dialog' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readModalDialogInput = function(item) {
  var element = item.elem;

  var xPath = './/div[@class="weaver-caption-gray" or @class="gwt-Label ' +
    'FieldLabel smaller"]';
  var rowLabel = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];

  //In some cases the label is in the previous row (Ex: Notes)
  if (rowLabel === undefined) {
    xPath = './/ancestor-or-self::tr[not(.//table[@class="weaver-DialogWid' +
        'get"])]//preceding-sibling::tr[not(.//input or .//select or .' +
        '//textarea)]//div[@class="gwt-Label title" or ' +
        '@class="create-profile-caption"]';
    rowLabel = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];
  }

  var text = rowLabel.textContent + '.';
  var value = axsHealth.generateCategoryValueMessage(element);
  text = text + ' ' + axsHealth.str.SET_TO + ' ' + value;
  text = text + ' ' + axsHealth.str.ENTER_TO_EDIT;

  axsHealth.speakAndGo(rowLabel, text);
};

/**
 * Callback handler for reading records in 'General' list of 
 * the 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readSetting = function(item) {
  var element = item.elem;

  var xPath = './/td[contains(@class, "bold")]';
  var boldLabel = axsHealth.axsJAXObj.evalXPath(xPath, element)[0];

  var text = boldLabel.textContent + '.';
  var value = axsHealth.generateCategoryValueMessage(element);

  if (value == '') {
    text = text + ' ' + axsHealth.str.BLANK;
  } else {
    text = text + ' ' + axsHealth.str.SET_TO + ' ' + value;
  }
  text = text + ' ' + axsHealth.str.ENTER_TO_EDIT;
  axsHealth.speakAndGo(boldLabel, text);
};

/**
 * Generates a message for announcing the current value of a category.
 * @param {Node} categoryNode The category DOM node.
 * @return {string} The message.
 */
axsHealth.generateCategoryValueMessage = function(categoryNode) {
  var text = '';
  var xPath = './/*[self::input or self::select or self::textarea]';
  var inputNodes = axsHealth.axsJAXObj.evalXPath(xPath, categoryNode);

  for (var i = 0, inputNode; inputNode = inputNodes[i]; i++) {
    var currentValue = axsHealth.generateNodeValueMessage(inputNode);
    if (currentValue !== '') {
      text = text + '. ' + currentValue;
    }
  }

  if (text === '') {
    text = axsHealth.str.BLANK;
  } else {
    //Remove the first period
    text = text.replace('.', '');
  }

  return text;
};

/**
 * Generates a message for announcing the current value of an input element.
 * @param {Object} element The input element.
 * @return {string} The message.
 */
axsHealth.generateNodeValueMessage = function(element) {
  var description = '';
  var value;

  if (element.type.indexOf('radio') > -1 ||
      element.type.indexOf('checkbox') > -1) {
    if (element.checked) {
      description = axsHealth.getCurrentElementDescription(element);
    }
  } else if (element.type.indexOf('text') > -1) {
    description = axsHealth.getCurrentElementDescription(element);
    value = element.value;
  } else if (element.type.indexOf('select-one') > -1) {
    description = axsHealth.getCurrentElementDescription(element);
    value = element.childNodes[element.selectedIndex].text;
  }

  if (value === '') {
    value = axsHealth.str.BLANK;
  } else if (value === undefined) {
    value = '';
  }

  var text = value + ' ' + description;
  text = axsHealth.normalizeString(text);

  return text;
};

/**
 * Gets the description of an input element.
 * @param {Object} element The input element.
 * @return {string} Description of the element.
 * NOTE: Use an associated label and in case no such label exists use
 * the title attribute of the element.
 */
axsHealth.getCurrentElementDescription = function(element) {
  var text = '';

  var xPath = '//label[@for="' + element.id + '"]';
  var assocLabel = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (assocLabel !== undefined) {
    text = assocLabel.textContent;
  } else {
    text = element.title;
  }
  return text;
};

/**
 * Callback handler to begin editing items in the 'Biometrics' list or a
 * 'Modal window'.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.focusOnFirstInputInCategory = function(item) {
  axsHealth.setCurrentCatogoryInputs(item.elem);
  var firstInput = axsHealth.categoryInputElements[0];

  //clear the lens to make the edited field visible
  axsHealth.axsLensObj.view(null);
  firstInput.focus();
  if (firstInput.tagName == 'INPUT' ||
      firstInput.tagName == 'TEXTAREA') {
    firstInput.select();
  }
};

/**
 * Callback handler for pressing buttons.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.pressButton = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
  axsHealth.blurLastFocusedNode();
};

/**
 * Callback handler for pressing buttons in the 'Profile details' subsection
 * of the 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.pressSettingsProfileDetailsButton = function(item) {
axsHealth.pressButton(item);
axsHealth.prevListAndExecuteEntryTarget();
};

/**
 * Callback handler for reading rows of data in the 'Conditions' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readCondition = function(item) {
  var template = axsHealth.str.CONDITION_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Callback handler for reading rows of data in the 'Medications' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readMedication = function(item) {
  var template = axsHealth.str.MEDICATION_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Callback handler for reading rows of data in the 'Allergies' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readAllergy = function(item) {
  var template = axsHealth.str.ALLERGY_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Callback handler for reading rows of data in the 'Procedures' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readProcedure = function(item) {
  var template = axsHealth.str.PROCEDURE_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Callback handler for reading rows of data in the 'Test results' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readTestResult = function(item) {
  var template = axsHealth.str.TEST_RESULT_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Callback handler for reading rows of data in the 'Immunizations' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readImmunization = function(item) {
  var template = axsHealth.str.IMMUNIZATIONS_TEMPLATE;
  axsHealth.readCategoryRecordViaTemplate(item, template);
};

/**
 * Function to which callback handlers delegate for reading rows of data
 * in the 'Conditions', 'Medications', 'Allergies', 'Procedures',
 * 'Test results', and 'Immunizations' lists.
 *
 * @param {Object} item A wrapper for the current DOM node (category row).
 * @param {string} template Template to be populated with the column values
 * of the category row.
 */
axsHealth.readCategoryRecordViaTemplate = function(item, template) {
  var row = item.elem;
  var columns = row.childNodes;
  var columnValue = '';
  var phrases = new Array();
  var numberOfColumns = columns.length;
  var xPath = './/a';
  var links = null;
  var irrelevantText = '';

  for (var i = 0; i < numberOfColumns - 1; i++) {
    columnValue = axsHealth.normalizeString(columns[i].textContent);

    //Skip the first column if empty
    if (i === 0 && columnValue === '') {
      continue;
    }

    //Remove irrelevant content from the text
    links = axsHealth.axsJAXObj.evalXPath(xPath, columns[i]);
    if (links.length > 0) {
      irrelevantText = axsHealth.getElementArrayTextContent(links);
      columnValue = columnValue.replace(irrelevantText, '');
    }
    columnValue = axsHealth.normalizeString(columnValue);

    if (columnValue === '' || columnValue === '-') {
      columnValue = axsHealth.str.NOT_SPECIFIED;
    }

    phrases.push(columnValue);
  }

  var xPath = './/following-sibling::tr[1][.//div[contains(text(), "Notes:")]]';

  var notes = axsHealth.axsJAXObj.evalXPath(xPath, row);
  var noteText = '';
  if (notes.length > 0) {
    noteText = axsHealth.normalizeString(notes[0].textContent);
  }
  phrases.push(noteText);

  var text = axsHealth.populateTemplate(template, phrases);
  axsHealth.speakAndGo(row, text);
};

/**
 * Callback handler for deleting list records in the 'Personal profile' section.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.deleteRecord = function(item) {
  var element = item.elem;

  var xPath = './/td[@class="name-cell"]';
  var rootNode = axsHealth.axsNavObjPersProf.currentItem().elem;
  var deletedNode = axsHealth.axsJAXObj.evalXPath(xPath, rootNode)[0];
  axsHealth.axsJAXObj.clickElem(element, false);

  var text = deletedNode.textContent.replace('Reference', '');
  text = text + ' ' + axsHealth.str.DELETED;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for reading rows of data in the 'Medical contacts' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.readMedicalContact = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);

  var xPath = '//table[contains(@class, "ContactsView")]' +
      '//div[@class="DetailsSlot"]';
  var details = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  var xPath = './/div[contains(@class, "EmailAddress")]';
  var email = axsHealth.axsJAXObj.evalXPath(xPath, details)[0];
  if (email) {
    email = axsHealth.str.EMAIL + ' ' + email.textContent;
  } else {
    email = '';
  }

  xPath = './/div[contains(@class, "small pre")]';
  var address = axsHealth.axsJAXObj.evalXPath(xPath, details)[0];

  xPath = './table/tbody/tr[2]';
  var phone = axsHealth.axsJAXObj.evalXPath(xPath, details)[0];

  var text = element.textContent + ' ' + email + axsHealth.str.ADDRESS;
  text = text + ' ' + address.textContent + ' ' + axsHealth.str.PHONE_NUMBER;
  text = text + ' ' + ' ' + phone.textContent;
  text = axsHealth.normalizeString(text);

  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Callback handler for going to the next search results page 
 * in the 'Find a doctor' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.goToNextDoctorSearchResutlsPage = function(item) {
  var element = item.elem;
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_TOP);
  axsHealth.axsJAXObj.clickElem(element, false);
};

/**
 * Callback handler for going to the previous search results page 
 * in the 'Find a doctor' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsHealth.goToPrevDoctorSearchResutlsPage = function(item) {
  var element = item.elem;
  axsHealth.setCurrentListRefreshMode(axsHealth.refreshMode.GO_BOTTOM);
  axsHealth.axsJAXObj.clickElem(element, false);
};

/**
 * Concatenates the text content of an array of DOM elements.
 * @param {Array} elements An array of DOM elements.
 * @return {string} The text content of the nodes.
 */
axsHealth.getElementArrayTextContent = function(elements) {
  var text = '';
  for (var i = 0, element; element = elements[i]; i++) {
    text = text + element.textContent;
  }
  return text;
};

/**
 * Clicks on and announces a link.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.clickLink = function(item) {
  var element = item.elem;
  axsHealth.axsJAXObj.clickElem(element, false);
};

/**
 * Callback handler for finding a doctor.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.findDoctor = function(item) {
  var select = item.elem;

  //Avoid duplicate entries
  if (document.getElementById('SpecialtySelect')) {
    var func = function() {
                 select.focus();
               };
    window.setTimeout(func, 0);
    return;
  }

  //Instrument the DOM to improve presentation
  select.id = 'SpecialtySelect';

  var labelText = document.createTextNode('Select specialty: ');

  var selectLabel = document.createElement('LABEL');
  selectLabel.setAttribute('for', 'SpecialtySelect');
  selectLabel.className = 'gwt-Label title';
  selectLabel.appendChild(labelText);

  select.parentNode.insertBefore(selectLabel, select);
  select.focus();

  var xPath = '//table[@class="DDSearchView-header"]//*' +
      '[self::select or self::input]';
  var inputs = axsHealth.axsJAXObj.evalXPath(xPath, document.body);
  axsHealth.categoryInputElements = inputs;

  var xPath = '//table[@class="DDSearchView-header"]//input';
  var input = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  input.setAttribute('title', 'Search box');
};

/**
 * Refreshes the current list of the active AxsNav object. After refreshing
 * the list position is restored to the top, bottom or remains unchanged,
 * according to the first element of the arguments array. 
 * delegates to this method.
 */
axsHealth.refreshCurrentList = function() {
  if (axsHealth.activeAxsNavObj === null) {
    return;
  }

  var list = axsHealth.activeAxsNavObj.currentList();
  var navListIdx = axsHealth.activeAxsNavObj.navListIdx;
  var refreshMode = list.refreshMode;
  var currentItemIdx = -1;

  if (refreshMode === axsHealth.refreshMode.KEEP_CURRENT) {
    currentItemIdx = axsHealth.activeAxsNavObj.navItemIdxs[navListIdx];
  }

  axsHealth.activeAxsNavObj.refreshList(list.title);

  //Set the correct position in the list according to the refresh mode
  if (refreshMode === axsHealth.refreshMode.KEEP_CURRENT) {
    axsHealth.activeAxsNavObj.navItemIdxs[navListIdx] = currentItemIdx;
  } else if (refreshMode === axsHealth.refreshMode.GO_TOP) {
     axsHealth.activeAxsNavObj.navItemIdxs[navListIdx] = -1;
  } else if (refreshMode == axsHealth.refreshMode.GO_BOTTOM) {
    currentItemIdx = axsHealth.axsNavObjAddToProf.currentList().items.length;
    axsHealth.axsNavObjAddToProf.navItemIdxs[navListIdx] = currentItemIdx - 1;
  }
};

/**
 * Refreshes the current list in the 'Personal record' section. The
 * position of the list is maintained if possible.
 * NOTE: Some lists in this section can be expanded to include historical
 * records. However, after a refresh such lists are collpsed. This method
 * expands these lists if they were expanded before the refresh.
 */
axsHealth.refreshPersonalProfileList = function() {
  if (axsHealth.axsNavObjPersProf.currentList().expanded) {
    //After refreshing the list is collapsed but was expanded
    axsHealth.expandHistoryRecords(null);
  }
  axsHealth.refreshCurrentList();
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
 axsHealth.executeFunctionAfterMostRecentEvent = function(func, evt) {
  if (axsHealth.eventHandlerToEventMap[func.toString()]) {
    evt.timeToHandle = new Date().getTime() + axsHealth.EVT_HANDL_TIMEOUT_INT;
    axsHealth.eventHandlerToEventMap[func.toString()] = evt;
    return;
  }

  evt.timeToHandle = new Date().getTime() + axsHealth.EVT_HANDL_TIMEOUT_INT;
  axsHealth.eventHandlerToEventMap[func.toString()] = evt;

  var delegFunc = function() {
      var currentTime = new Date().getTime();
      var key = func.toString();
      var event = axsHealth.eventHandlerToEventMap[key];

      if (event.timeToHandle > currentTime) {
        window.setTimeout(delegFunc, event.timeToHandle - currentTime);
      } else {
        //Check if the page is still loading => wait to complete  
        var loading = document.getElementsByClassName('weaver-loading')[0];
        if (loading) {
          window.setTimeout(delegFunc, axsHealth.EVT_HANDL_TIMEOUT_INT);
        } else { //Execute the handling function
          func(event);
          axsHealth.eventHandlerToEventMap[func.toString()] = null;
        }
      }
  };

   window.setTimeout(delegFunc, axsHealth.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Announces the summary of a doctor search.
 */
axsHealth.announceDoctorSearchSummaryAndFirstResult = function() {
  var item = axsHealth.axsNavObjPersProf.nextItem();
  axsHealth.announceDoctorSearchSummaryAndOneResult(item);
  axsHealth.categoryInputElements = null;
};

/**
 * Announces the summary of a doctor search and the last search result.
 */
axsHealth.announceDoctorSearchSummaryAndLastResult = function() {
  var item = axsHealth.axsNavObjPersProf.prevItem();
  axsHealth.announceDoctorSearchSummaryAndOneResult(item);
};

/**
 * Announces the summary of a doctor search.
 * @param {Object} item The wrapper for the result DOM node to be announced.
 */
axsHealth.announceDoctorSearchSummaryAndOneResult = function(item) {
  var text = '';

  //Get the summary
  var xPath = '(//div[contains(@class, "DDSearchView-body")]//' +
      'table[@class="small"])[1]//tr';
  var searchSummary = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (searchSummary !== undefined) {
    text = axsHealth.normalizeString(searchSummary.textContent);
    text = text.replace('-', 'to') + '.';

    if (item) {
      axsHealth.blurLastFocusedNode();
      text = text + ' ' + axsHealth.getDoctorContent(item);
      var element = item.elem;
      axsHealth.axsLensObj.view(element);
      element.scrollIntoView(true);
      axsHealth.axsJAXObj.markPosition(element);
    }
  } else {
    text = axsHealth.str.NO_RESULTS_FOUND;
  }

  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Closes the 'Settings' section.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.closeSettingsSection = function(item) {
  var func = function() {
        var xPath = '//table[@class="weaver-nav"]/tbody/tr[.//table[@class="' +
           'profile-nav-wrapper"]]//div[contains(@class, "weaver-nav-title")]';
        var link = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
        axsHealth.axsJAXObj.clickElem(link, false);
      };
    window.setTimeout(func, 0);
  };

/**
 * Populates a template replacing special tokens (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} phrases The array with replacement (concrete) values.
 * @return {string} The populated template. 
 */
axsHealth.populateTemplate = function(template, phrases) {
  var populatedTemplate = new String(template);
  for (var i = 0, value; i < phrases.length; i++) {
    var regExp = new RegExp('\{(' + i + ')\}', 'g');
    populatedTemplate = populatedTemplate.replace(regExp, phrases[i]);
  }
  return populatedTemplate;
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node.
 * @param {string} text The text to be spoken.
 * characters.
 */
axsHealth.speakAndGo = function(element, text) {
  axsHealth.axsLensObj.view(element);
  axsHealth.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsHealth.axsJAXObj.markPosition(element);
};

/**
 * Normalizes a string to enable correct presentation (i.e. speaking). All
 * leading and trailing spaces are truncated, all types of white space
 * characters are rplaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized text.
 */
axsHealth.normalizeString = function(text) {
  var normalizedText = new String(text);
  //remove leading and trailing spaces
  normalizedText = normalizedText.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  normalizedText = normalizedText.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return normalizedText.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event.
 * @return {boolean} True if the event was handled, false otherwise.
 */
axsHealth.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) {
    return true;
  }

  if (evt.keyCode == 27) { // ESC
    //blur the last focused node if such exists
    axsHealth.blurLastFocusedNode();
    return false;
  }

  if (evt.keyCode == 9) {
    if (axsHealth.categoryInputElements !== null) { // TAB
      axsHealth.tabAndShiftTabWrapEventHandler(evt);
    } else if (axsHealth.userInputSectionOpened) {
       //Swallow the event
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  if (axsHealth.axsJAXObj.inputFocused) {
    return true;
  }

  if (axsHealth.activeAxsNavObj === axsHealth.axsNavObjAddToProf) {
      if (evt.charCode >= 65 && evt.charCode <= 90 ||  // a-z
          evt.charCode === 48) {   // 0
        axsHealth.clickLetterLinkForCharCode(evt.charCode);
      }
  }

  if ((evt.charCode == 104) || (evt.charCode == 108)) { // h or l
    axsHealth.lastListNavigationKey = String.fromCharCode(evt.charCode);
  }

  var command = axsHealth.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Customizes style sheets to provide magnification.
 */
axsHealth.customizeStyleSheetsToEnableMagnification = function() {
  var cssRules = document.styleSheets[0].cssRules;

  for (var j = 0, cssRule; cssRule = cssRules[j]; j++) {
    if (cssRule.cssText.indexOf('weaver-nav-title-selected') > -1 ||
        cssRule.cssText.indexOf('gwt-TabBarItem-selected') > -1) {
      cssRule.style.fontSize = 'xx-large';
      cssRule.style.paddingTop = '5px';
      cssRule.style.paddingLeft = '5px';
      cssRule.style.paddingBottom = '5px';
    }
  }
};

/**
 * Modifies the default CSS style of PowerKey to conform to the UI
 * requirements for Health. 
 */
axsHealth.modifyPowerKeyDefaultCssStyle = function() {
  var healthCssStr = '.pkVisibleStatus {' +
  'border-top-width: 8px; ' +
  'border-top-style: solid; ' +
  'border-top-color: rgb(195, 217, 255); ' +

  'border-right-width: 8px; ' +
  'border-right-style: solid; ' +
  'border-right-color: rgb(195, 217, 255); ' +

  'border-bottom-width: 8px; ' +
  'border-bottom-style: solid; ' +
  'border-bottom-color: rgb(195, 217, 255); ' +

  'border-left-width: 8px; ' +
  'border-left-style: solid; ' +
  'border-left-color: rgb(195, 217, 255);' +

  'padding: 10 !important;}';

  PowerKey.cssStr = PowerKey.cssStr + healthCssStr;
};

/**
 * Map from character codes to functions
 * @return {boolean} True if the event was handled, false otherwise.
 */
axsHealth.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
  47 : function() {
         var xPath = 'id("uid-2")/input';
         var searchBox = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
         searchBox.title = 'Search box';
         searchBox.focus();
         searchBox.select();
         return false;
       },
  // ? (question mark)
  63 : function() {
         var help = axsHealth.str.HELP +
             axsHealth.activeAxsNavObj.localHelpString() +
             axsHealth.activeAxsNavObj.globalHelpString();
         axsHealth.axsJAXObj.speakTextViaNode(help);
         return false;
       },
  // - (minus symbol)
  45 : function() {
         axsHealth.magSize -= 0.10;
         axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsHealth.magSize += 0.10;
         axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
         return false;
       }
};

//Invoke the script after all the data is loaded (development)
axsHealth.init();
//Invoke the script immediately (production)
axsHealth.initAxsJAX();
