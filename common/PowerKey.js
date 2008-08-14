/**
 * @fileoverview PowerKey - JavaScript library for providing keyboard
 * enhancements for Web 2.0 applications. The scripts support IE 6+ and
 * Firefox 2.0+. AxsJAX support provided by PowerKey is currently limited
 * to Firefox 3.0+.
 * @author chaitanyag@google.com (Chaitanya P. Gharpure)
 */


/**
 * Javascript class for providing keyboard interface enhancements for
 * Web 2.0 applications.
 * @param {string} context The user specified string value, which is the
 *     starting context of the application. This can be changed later.
 * @param {Object} axsJAX The AxsJAX object provided by the user.
 * @constructor
 */
var PowerKey = function(context, axsJAX) {
  /**
   * Holds the current application context.
   * @type {string}
   */
  this.context = context;

  /**
   * The div element holding the completion text field.
   * @type {Element?}
   */
  this.cmpFloatElement = null;

  /**
   * The completion text field element.
   * @type {Element?}
   */
  this.cmpTextElement = null;

  /**
   * Element showing the PowerKey message/status string.
   * @type {Element?}
   */
  this.statusElement = null;

  /**
   * Variable to hold the completion mode prompt string.
   * @type {string}
   * @private
   */
  this.completionPromptStr_ = 'Enter Completion';

  /**
   * Variable to hold the completion mode prompt string when the completion
   * list is empty.
   * @type {string}
   * @private
   */
  this.noCompletionStr_ = 'No completions found';

  /**
   * AxsJAX object
   * @type {Object?}
   * @private
   */
  this.axsJAX_ = null;

  /**
   * The div element which holds the text of the selected list item.
   * @type {Element?}
   * @private
   */
  this.listElement_ = null;

  /**
   * The div element inside the completion div, holding the selected list item.
   * @type {Element?}
   * @private
   */
  this.cmpDivElement_ = null;

  /**
   * The list of completions to select from.
   * @type {Array}
   * @private
   */
  this.cmpList_ = [];

  /**
   * The navigation position in the list.
   * @type {number}
   * @private
   */
  this.listPos_ = -1;


  /**
   * Whether to hide completion field on blur.
   * @type {boolean}
   * @private
   */
  this.hideCmdFieldOnBlur_ = false;


  this.idMap = {};
  this.indexList_ = {};
  if (axsJAX && PowerKey.isGecko) {
    this.axsJAX_ = axsJAX;
  }
};


/**
 * The reg exp indicating the pattern of the parameter to a completion. It 
 * should start with '<', end wit '>' and contain only characters and numbers.
 * @type {RegExp}
 */
PowerKey.CMD_PARAM = /^\<[A-Z|a-z|0-9|\-|\_]+\>$/;


/**
 * The reg exp to check if there are spaces, new lines or carriage returns at
 * the beginning of a string.
 * @type {RegExp}
 */
PowerKey.LEFT_TRIMMABLE = /^(\s|\r|\n)+/;


/**
 * The reg exp to check if there are spaces, new lines or carriage returns at
 * the end of a string.
 * @type {RegExp}
 */
PowerKey.RIGHT_TRIMMABLE = /(\s|\r|\n)+$/;


/**
 * Attaches event listener and sets the user specified handler or the
 * default handler if the action map is provided.
 * @param {Element?} target The element to attach the event listerner to.
 * @param {string} event The event to listen for.
 * @param {Function?} handler The event handler.
 * @param {Object?} actionMap The HashMap which provides a context-based
 *     mapping from keys to functions.
 */
PowerKey.prototype.attachHandlerAndListen = function(target,
                                                     event,
                                                     handler,
                                                     actionMap) {
  // Firefox
  if (PowerKey.isGecko && handler) {
    target.addEventListener(event, handler, true);
  }
  // IE
  else if (PowerKey.isIE && handler) {
    target.attachEvent(event, function(event) {
      handler(event);});
  }
  // Use default handler if the action map is provided.
  if (actionMap) {
    var handlerObj = new PowerKey.DefaultHandler(actionMap);
    var pkObj = this;
    this.attachHandlerAndListen(target, event, function(evt) {
      handlerObj.handler(evt, handlerObj, pkObj);
    }, null);
  }
};


/**
 * Detaches event listener with the user specified event and handler.
 * @param {Element} target The element to detach the event listerner from.
 * @param {string} event The event to detach.
 * @param {Function} handler The event handler to stop calling.
 */
PowerKey.prototype.detachHandler = function(target, event, handler) {
  // Firefox
  if (PowerKey.isGecko) {
    target.removeEventListener(event, handler, true);
  }
  // IE
  else if (PowerKey.isIE) {
    target.detachEvent(event, handler);
  }
};


/**
 * Creates a floating element for holding the completion shell's text field.
 * @param {Element} parent The element whose child this element will be.
 * @param {number} size The size of the completion text field in # of 
 *     characters.
 * @param {Function?} handler The completion handler.
 *     handler = function(completion, index, elementId, args) {}
 * @param {Object?} actionMap The object consisting of completion strings as
 *     keys and functions as values.
 * @param {Array?} completionList The array of completions.
 * @param {boolean} browseOnly Whether the completion list is browse-only.
 */
PowerKey.prototype.createCompletionField = function(parent,
                                                 size,
                                                 handler,
                                                 actionMap,
                                                 completionList,
                                                 browseOnly) {
  var self = this;
  var floatId, fieldId, oldCmdNode, divId;
  // If the completion field already exists, remove it and create a new one.
  if (this.cmpFloatElement) {
    // TODO: remove the handlers attached to cmpTextElement before removing
    // the completion field. The inline handler needs to be moved outside.
    this.cmpFloatElement.parentNode.removeChild(this.cmpFloatElement);
  }
  do {
    floatId = 'completionField_' + Math.floor(Math.random() * 1001);
    fieldId = 'txt_' + floatId;
    divId = 'div_' + floatId;
    oldCmdNode = document.getElementById(floatId);
  } while (oldCmdNode);

  var cmpNode = document.createElement('div');
  cmpNode.id = floatId;
  cmpNode.style.position = 'absolute';

  var txtNode = document.createElement('input');

  txtNode.type = 'text';
  txtNode.id = fieldId;
  txtNode.size = size;
  txtNode.value = '';
  txtNode.setAttribute('onkeypress',
      'if (event.keyCode == PowerKey.keyCodes.TAB){return false;}');
  txtNode.readOnly = browseOnly;

  if (browseOnly) {
    txtNode.style.fontSize = 0;
  }

  var divNode = document.createElement('div');
  divNode.id = divId;
  divNode.setAttribute('tabindex', 0);
  divNode.setAttribute('role', 'row');

  cmpNode.appendChild(divNode);
  cmpNode.appendChild(txtNode);
  parent.appendChild(cmpNode);

  this.cmpFloatElement = cmpNode;
  this.cmpTextElement = txtNode;
  this.cmpDivElement_ = divNode;

  this.cmpFloatElement.className = 'pkHiddenStatus';
  this.cmpTextElement.className = 'pkOpaqueCompletionText';

  if (completionList) {
    this.cmpList_ = completionList;
    this.filterList_ = this.cmpList_;
    for (var i = 0, cmp; cmp = this.cmpList_[i]; i++) {
      this.indexList_[cmp.toLowerCase()] = i;
    }
    this.listPos_ = -1;
  }

  // filter the completion list on keyup if it is not UP or DOWN arrow.
  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYUP,
      function(evt) {
        self.handleCompletionKeyUp_.call(self, evt, actionMap, handler);
      }, null);

  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYDOWN,
      function(evt) {
        self.handleCompletionKeyDown_.call(self, evt);
      }, null);

  this.attachHandlerAndListen(this.cmpTextElement, 'blur',
      function(evt) {
        if (self.hideCmdFieldOnBlur_) {
          self.updateCompletionField('hidden');
        }
      }, null);
};


/**
 * Handle keyup events. If the key is not an arrow key, filter the list by the
 * contents of the completion text field.
 * @param {Object} evt The key event object.
 * @param {Object} actionMap The object consisting of completion strings as
 *     keys and functions as values.
 * @param {Function?} handler The completion handler.
 *     handler = function(completion, index, elementId, args) {}
 * @private
 */
PowerKey.prototype.handleCompletionKeyUp_ = function(evt,
                                                     actionMap,
                                                     handler) {
  if (this.cmpTextElement.value.length === 0) {
    this.filterList_ = this.cmpList_;
  }
  if (evt.keyCode != PowerKey.keyCodes.KEYUP &&
      evt.keyCode != PowerKey.keyCodes.KEYDOWN &&
      evt.keyCode != PowerKey.keyCodes.ENTER &&
      evt.keyCode != PowerKey.keyCodes.TAB) {

    if (this.cmpTextElement.value.length) {
      this.filterList_ = this.getWordFilterMatches_(this.cmpList_,
          this.cmpTextElement.value, 50);
      this.listPos_ = -1;
      if (this.filterList_.length > 0) {
        this.setListElement_(this.filterList_[0]);
        this.listPos_ = 0;
      } else {
        this.setListElement_(this.noCompletionStr_);
      }
    }
    else {
      this.setListElement_(this.completionPromptStr_);
    }
  }
  // Handle ENTER key pressed in the completion field.
  if (evt.keyCode == PowerKey.keyCodes.ENTER) {
    if (this.cmpTextElement.readOnly) {
      return;
    }
    // Select current filtered list item.
    if (this.filterList_ &&
        this.filterList_.length > 0 &&
        this.cmpTextElement.value != this.filterList_[this.listPos_] &&
        // Does not have parameters or is incomplete
        (this.filterList_[this.listPos_].indexOf('<') < 0 ||
            (this.filterList_[this.listPos_].indexOf('<') >= 0 &&
             this.filterList_[this.listPos_].split(' ').length >
                 this.cmpTextElement.value.split(' ').length))) {
      this.selectCurrentListItem_();
      return;
    }
    var str = this.cmpTextElement.value;
    var originalCmd = (PowerKey.isIE ? this.listElement_.innerText :
          this.listElement_.textContent).toLowerCase();
    // Change only the basic portion (non-argument) of the selection to lower
    // case. For ex: In 'Watch Video funnySeries', only 'Watch Video' is
    // changed to lower case.
    var pos = originalCmd.indexOf('<');
    var baseCmd;
    if (pos >= 0) {
      baseCmd = str.substr(0, pos - 1).toLowerCase();
      str = baseCmd + ' ' + str.substr(pos);
    } else {
      str = str.toLowerCase();
      baseCmd = str;
    }
    var handled = false;
    if (actionMap) {
      handled = this.actionHandler_.call(this, str,
          originalCmd, actionMap);
    }
    if (handler && !handled) {
      var args = this.getArguments_(str, originalCmd);
      handler(baseCmd, this.indexList_[originalCmd],
          this.idMap[originalCmd], args);
    }
    this.cmpTextElement.value = '';
  }
};


/**
 * Handle keydown events. If the key is an UP/DOWN arrow key, navigates to the
 *     previous and next item in the filtered list.
 * @param {Object} evt The key event object.
 * @private
 */
PowerKey.prototype.handleCompletionKeyDown_ = function(evt) {
  // Handle UP arrow key
  if (evt.keyCode == PowerKey.keyCodes.KEYUP &&
           this.filterList_ &&
           this.filterList_.length > 0) {
    this.prevListItem_();
  }
  // Handle DOWN arrow key
  else if (evt.keyCode == PowerKey.keyCodes.KEYDOWN &&
           this.filterList_ &&
           this.filterList_.length > 0) {
    this.nextListItem_();
  }
  // On TAB, keep the focus in the completion field.
  else if (evt.keyCode == PowerKey.keyCodes.TAB) {
    if (this.filterList_ && this.filterList_.length > 0) {
      this.selectCurrentListItem_();
    }
  }
};


/**
 * Tells whether to hide the completion field when focus is lost.
 * @param {boolean} hide If true, hide the completion field on blur.
 */
PowerKey.prototype.setAutoHideCompletionField = function(hide) {
  this.hideCmdFieldOnBlur_ = hide;
};


/**
 * Sets the label to be displayed and spoken, when the
 * completion field is made visible.
 * @param {string} str The string to display.
 */
PowerKey.prototype.setCompletionPromptStr = function(str) {
  this.completionPromptStr_ = str;
};


/**
 * Sets the label to be displayed and spoken, when there are no completions
 * in the completion list.
 * @param {string} str The string to display.
 */
PowerKey.prototype.setNoCompletionStr = function(str) {
  this.noCompletionStr_ = str;
};


/**
 * Sets the completion list.
 * @param {Array} list The array to be used as the completion list.
 */
PowerKey.prototype.setCompletionList = function(list) {
  this.cmpList_ = list;
  this.filterList_ = this.cmpList_;
  this.indexList_ = {};
  for (var i = 0, cmp; cmp = this.cmpList_[i]; i++) {
    this.indexList_[cmp.toLowerCase()] = i;
  }
  this.listPos_ = -1;
};


/**
 * Creates a floating element for displaying various PowerKey messages.
 * @param {Element} parent The element whose child this element will be.
 */
PowerKey.prototype.createStatusElement = function(parent) {
  if (!parent) {
    return;
  }
  // If the status element already exists, remove it and create a new one.
  if (this.statusElement) {
    this.statusElement.parentNode.removeChild(this.statusElement);
  }
  var statusId, statusTxtId, oldStatusNode = null;
  do {
    statusId = 'statusNode_' + Math.floor(Math.random() * 1001);
    statusTxtId = 'txt_' + statusId;
    oldStatusNode = document.getElementById(statusId);
  } while (oldStatusNode);

  var statusNode = document.createElement('div');
  statusNode.id = statusId;
  statusNode.setAttribute('class', 'pkHiddenStatus');
  statusNode.style.position = 'absolute';

  var txtNode = document.createElement('div');
  txtNode.id = statusTxtId;
  txtNode.setAttribute('class', 'pkOpaqueStatusText');

  statusNode.appendChild(txtNode);

  parent.appendChild(statusNode);
  this.statusElement = statusNode;
  this.statusTxtElement = txtNode;

  if (PowerKey.isGecko) {
    this.statusTxtElement.textContent = '';
  }
  else if (PowerKey.isIE) {
    this.statusTxtElement.innerText = '';
  }
};


/**
 * Updates the completion field element with the new visibility status
 * and location parameters.
 * @param {string} status Indicates whether the completion field should be
 *     made 'visible' or 'hidden'.
 * @param {boolean} opt_resize Indicates whether resizing is necessary.
 * @param {number} opt_top The y-coordinate pixel location of the top
 *     border of the element.
 * @param {number} opt_left The x-coordinate pixel location of the left
 *     border of the element.
 */
PowerKey.prototype.updateCompletionField = function(status,
                                                 opt_resize,
                                                 opt_top,
                                                 opt_left) {
  if (status == 'visible') {
    if (this.cmpFloatElement.className == 'pkHiddenStatus') {
      this.setListElement_(this.completionPromptStr_);
    }
    this.cmpFloatElement.className = 'pkVisibleStatus';
    // Need to do this for IE. Setting focus immediately after making it
    // visible generates an error. Hence have to set the timeout.
    var elem = this.cmpTextElement;
    window.setTimeout(function() {elem.focus();}, 0);
  }
  else if (status == 'hidden') {
    if (PowerKey.isIE && this.listElement_) {
      this.listElement_.innerText = '';
    }
    else if (this.listElement_) {
      this.listElement_.textContent = '';
    }
    this.cmpFloatElement.className = 'pkHiddenStatus';
    this.cmpTextElement.value = '';
    this.listPos_ = -1;
  }
  if (opt_resize) {
    var viewportSz = PowerKey.getViewportSize();
    if (!opt_top) {
      opt_top = viewportSz.height - this.cmpFloatElement.offsetHeight;
    }
    if (!opt_left) {
      opt_left = 0;
    }
    this.cmpFloatElement.style.top = opt_top;
    this.cmpFloatElement.style.left = opt_left;
  }
};


/**
 * Updates the status element with the new display text, visibility status
 * and location parameters.
 * @param {string} text The new display text.
 * @param {string} status Indicates whether the status element should be
 *     made 'visible' or 'hidden'.
 * @param {boolean} opt_resize Indicates whether resizing is necessary.
 * @param {number} opt_top The y-coordinate pixel location of the top
 *     border of the element.
 * @param {number} opt_left The x-coordinate pixel location of the left
 *     border of the element.
 */
PowerKey.prototype.updateStatusElement = function(text,
                                                  status,
                                                  opt_resize,
                                                  opt_top,
                                                  opt_left) {
  if (text) {
    if (PowerKey.isGecko) {
      this.statusTxtElement.textContent = text;
    }
    else if (PowerKey.isIE) {
      this.statusTxtElement.innerText = text;
    }
  }
  if (status) {
    if (status == 'visible') {
      this.statusElement.className = 'pkVisibleStatus';
      if (this.axsJAX_ && PowerKey.isGecko) {
        this.axsJAX_.speakNode(this.statusElement);
      }
    }
    else if (status == 'hidden') {
      this.statusElement.className = 'pkHiddenStatus';
    }
  }
  if (opt_resize) {
    var viewportSz = PowerKey.getViewportSize();
    if (!opt_top) {
      opt_top = viewportSz.height - this.statusElement.offsetHeight;
    }
    if (!opt_left) {
      opt_left = 0;
    }
    this.statusElement.style.top = opt_top;
    this.statusElement.style.left = opt_left;
  }
};


/**
 * Creates the list of completions from the text content of the elements
 * obtained from the xpath which satisfy the function func.
 * @param {string} tags The tags to be selected.
 * @param {Function} func Only those elements are considered for which
 *     this function returns true.
 * @param {boolean} newList If this is true, all entries in idMap
 *     are erased, and a new mapping of completions and IDs is created.
 * @return {Array} The array of completion strings.
 */
PowerKey.prototype.createCompletionList = function(tags, func, newList) {
  var cmpList = new Array();
  var tagArray = tags.split(/\s+/);
  if (newList) {
    delete this.idMap;
    this.idMap = new Object();
  }
  for (var j = 0, tag; tag = tagArray[j]; j++) {
    var nodeArray = document.getElementsByTagName(tag);
    for (var i = 0, node; node = nodeArray[i]; i++) {
      if (func(node)) {
        var label = PowerKey.isIE ?
            node.innerText : node.textContent;
        if (label) {
          label = PowerKey.rightTrim(PowerKey.leftTrim(label));
          label = label.replace(/\n/g, '');
          if (label.toLowerCase().indexOf('ctrl+') === 0) {
            label = label.substring(6);
          }
          cmpList.push(label);
          if (String(this.idMap[label.toLowerCase()]) == 'undefined') {
            this.idMap[label.toLowerCase()] = node.id;
          }
        }
      }
    }
  }
  return cmpList;
};


/**
 * Splits token into words and filters the rows by these words.
 * @param {Array} list An array of all completions.
 * @param {string} token Token to match.
 * @param {number} maxMatches Max number of matches to return.
 * @return {Array} matches Returns the array of matching rows.
 * @private
 */
PowerKey.prototype.getWordFilterMatches_ = function(list, token, maxMatches) {
  var matches = list;
  var rows = list;
  var words = token.split(' ');
  for (var i = 0, word; word = words[i]; i++) {
    rows = matches;
    matches = [];
    if (word !== '') {
      var escapedToken = PowerKey.regExpEscape(word);
      var matcher = new RegExp('(^|\\W+)' + escapedToken, 'i');
      for (var j = 0, row; row = rows[j]; j++) {
        if (String(row).match(matcher)) {
          matches.push(row);
        }
      }
    }
  }
  rows = list;
  for (j = 0; row = rows[j]; j++) {
    var parts = row.split(' ');
    var cmpArray = [];
    var part;
    for (i = 0; part = parts[i]; i++) {
      if (part.charAt(0) == '<') {
        break;
      }
      cmpArray.push(part);
    }
    var cmp = cmpArray.join(' ');
    if (token.indexOf(cmp) === 0) {
      matches.push(row);
    }
  }
  if (matches.length > maxMatches) {
    matches.slice(0, maxMatches - 1);
  }
  return matches;
};


/**
 * Compares the original and user-entered completion and returns the array
 * of arguments if any, otherwise returns null.
 * @param {String} str The string to parse for arguments.
 * @param {String} originalCmd The original completion.
 * @return {Array} Returns an array of completion arguments.
 * @private
 */
PowerKey.prototype.getArguments_ = function(str, originalCmd) {
  str = str.replace(/\s+/g, ' ');
  originalCmd = originalCmd.replace(/\s+/g, ' ');
  var pos = originalCmd.indexOf('<');
  if (pos < 0) {
    return [];
  }
  originalCmd = originalCmd.substr(pos);
  str = str.substr(pos);
  var strTokens = str.split(',');
  var ostrTokens = originalCmd.split(',');
  if (strTokens.length != ostrTokens.length) {
    return [];
  }
  var args = [];
  for (var i = 0, j = 0, token1, token2;
       (token1 = strTokens[i]) && (token2 = ostrTokens[i]);
       i++) {
    token1 = PowerKey.leftTrim(PowerKey.rightTrim(token1));
    token2 = PowerKey.leftTrim(PowerKey.rightTrim(token2));
    if (token2.match(PowerKey.CMD_PARAM)) {
      args.push(token1);
    }
  }
  return args;
};


/**
 * The default completion handler: executes the appropriate functions
 * by looking at the action map.
 * @param {string} act The action/selection to be handled.
 * @param {string} originalCmd The original format of the completion without
 *     the final parameter values.
 * @param {Object} actionMap The HashMap consisting of completion strings
 *     as keys and functions as values.
 * @return {boolean} Whether the completion was successfully handled.
 * @private
 */
PowerKey.prototype.actionHandler_ = function(act,
                                             originalCmd,
                                             actionMap) {
  var args = this.getArguments_(act, originalCmd);
  var actionObj = actionMap[originalCmd];
  if (actionObj && actionObj[this.context]) {
    var func = actionObj[this.context] + '(args);';
    window.setTimeout(func, 0);
    return true;
  }
  else
    return false;
};


/**
 * Displays the previous item in the filtered list, and speaks it.
 * @private
 */
PowerKey.prototype.prevListItem_ = function() {
  if (this.listPos_ < 0) {
    this.listPos_ = 0;
  }
  this.listPos_ = (this.listPos_ || this.filterList_.length) - 1;
  if (this.listPos_ >= 0) {
    this.setListElement_(this.filterList_[this.listPos_]);
  }
};


/**
 * Displays the next item in the filtered list, and speaks it.
 * @private
 */
PowerKey.prototype.nextListItem_ = function() {
  this.listPos_ = (this.listPos_ + 1) % this.filterList_.length;
  if (this.listPos_ < this.filterList_.length) {
    this.setListElement_(this.filterList_[this.listPos_]);
  }
};


/**
 * Selects the current completion from the list, displays it in the completion
 * text field and speaks it.
 * @private
 */
PowerKey.prototype.selectCurrentListItem_ = function() {
  this.cmpTextElement.value =
      this.filterList_[this.listPos_ >= 0 ? this.listPos_ : 0];
  this.filterList_ = this.getWordFilterMatches_(this.cmpList_,
      this.cmpTextElement.value, 50);
  if (this.axsJAX_ && PowerKey.isGecko) {
    this.axsJAX_.speakTextViaNode(this.cmpTextElement.value);
  }
  this.listPos_ = 0;
};


/**
 * Speaks the element of the filtered list which is currently selected.
 * @param {string} text The text to be displayed as the completion field's
 *     label (usually the selected list element itself).
 * @private
 */
PowerKey.prototype.setListElement_ = function(text) {
  if (!this.listElement_) {
    this.listElement_ = document.createElement('div');
    this.listElement_.id = 'listElem_' + Math.floor(Math.random() * 1001);
    this.cmpDivElement_.appendChild(this.listElement_);
  }
  if (PowerKey.isIE) {
    this.listElement_.innerText = text;
  }
  else {
    this.listElement_.textContent = text;
  }
  if (this.axsJAX_ && PowerKey.isGecko) {
    this.axsJAX_.speakNode(this.listElement_, false);
  }
};


// Methods in the PowerKey class end here.


/**
 * A class which creates an event handler with a pre-specified action map.
 * @param {Object} map A HashMap which holds key-function bindings.
 * @constructor
 */
PowerKey.DefaultHandler = function(map) {
  /**
   * HashMap holding the key-function bindings.
   * @type {Object}
   */
  this.actionMap = map;
};


/**
 * The event handler to be called called inside the original event handler.
 * @param {Object} evt The event object passed to the event handler.
 * @param {PowerKey.DefaultHandler} handlerObj A reference to this.
 * @param {PowerKey} pkObj An object of the PowerKey class.
 */
PowerKey.DefaultHandler.prototype.handler =
    function(evt, handlerObj, pkObj) {
  if (!handlerObj.actionMap) {
    return;
  }
  if (evt.keyCode) {
    var mapkeyCode = ''+evt.keyCode;
    var mapkeyChar = String.fromCharCode(evt.keyCode).toLowerCase();
    if (evt.ctrlKey) {
      mapkeyCode = 'Ctrl+' + mapkeyCode;
      mapkeyChar = 'Ctrl+' + mapkeyChar;
    }
    if (evt.altKey) {
      mapkeyCode = 'Alt+' + mapkeyCode;
      mapkeyChar = 'Alt+' + mapkeyChar;
    }
    if (evt.shiftKey) {
      mapkeyCode = 'Shift+' + mapkeyCode;
      mapkeyChar = 'Shift+' + mapkeyChar;
    }
    var actionObj = null;
    actionObj = handlerObj.actionMap[mapkeyChar];
    if (!actionObj) {
      actionObj = handlerObj.actionMap[mapkeyCode];
    }
    if (actionObj) {
      if (actionObj[pkObj.context]) {
        var func = actionObj[pkObj.context];
        func();
      }
    }
  }
};


/**
 * A class to store the height and width of the viewport.
 * @param {number} width The width of the browser viewport.
 * @param {number} height The height of the browser viewport,
 * @constructor
 */
PowerKey.ViewportSize = function(width, height) {
  this.width = width ? width : undefined;
  this.height = height ? height : undefined;
};


/**
 * Trims spaces and new lines from the left end of the string.
 * @param {string} str String to trim.
 * @return {string} The left-trimmed string.
 */
PowerKey.leftTrim = function(str) {
  return str.replace(PowerKey.LEFT_TRIMMABLE, '');
};


/**
 * Trims spaces and new lines from the right end of the string.
 * @param {string} str String to trim.
 * @return {string} The right-trimmed string.
 */
PowerKey.rightTrim = function(str) {
  return str.replace(PowerKey.RIGHT_TRIMMABLE, '');
};


/**
 * Escapes special characters in the string so that it can be matched against
 * a regular expression.
 * @param {string} s String from which to escape characters.
 * @return {string} Returns the escaped string.
 */
PowerKey.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
                   replace(/\x08/g, '\\x08');
};


/**
 * Gets the size of the browser viewport.
 * @return {PowerKey.ViewportSize} Returns the size of the viewport.
 */
PowerKey.getViewportSize = function() {
  var myWidth = 0, myHeight = 0;
  if (typeof(window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement &&
             (document.documentElement.clientWidth ||
              document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body &&
             (document.body.clientWidth ||
              document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return new PowerKey.ViewportSize(myWidth, myHeight);
};


/**
 * Is the user agent Internet Explorer?
 * @type {boolean}
 */
PowerKey.isIE = false;


/**
 * Is the user agent Firefox?
 * @type {boolean}
 */
PowerKey.isGecko = false;


/**
 * Detects the browser type and version.
 */
PowerKey.setBrowser = function() {
  var agt = navigator.userAgent.toLowerCase();
  PowerKey.isGecko = (agt.indexOf('gecko') != -1);
  PowerKey.isIE = ((agt.indexOf('msie') != -1) &&
      (agt.indexOf('opera') == -1));
};
// Set browser type
PowerKey.setBrowser();


/**
 * Enumeration for events.
 * @enum {string}
 */
PowerKey.Event = {
  KEYUP: PowerKey.isIE ? 'onkeyup' : 'keyup',
  KEYDOWN: PowerKey.isIE ? 'onkeydown' : 'keydown',
  KEYPRESS: PowerKey.isIE ? 'onkeypress' : 'keypress',
  CLICK: PowerKey.isIE ? 'onclick' : 'click',
  RESIZE: PowerKey.isIE ? 'onresize' : 'resize',
  FOCUS: PowerKey.isIE ? 'onfocus' : 'focus',
  BLUR: 'blur'
};


/**
 * CSS styles.
 * @type {string}
 */
PowerKey.cssStr =
'.pkHiddenStatus {display: none; position: absolute;}'+
'.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; ' +
  'line-height: 1.2em; z-index: 10000; background-color: #000000; ' +
  'padding: 2px; color: #fff; font-family: Arial, Sans-serif; ' +
  'font-size: 20px; filter: alpha(opacity=85); -moz-opacity: .80;}' +
'.pkOpaqueStatusText { background-color: transparent; ' +
  'font-family: Arial, Helvetica, sans-serif; font-size: 30px; ' +
  'color: #fff;}' +
'.pkOpaqueCompletionText {border-style: none; background-color:transparent; ' +
  'font-family: Arial, Helvetica, sans-serif; font-size: 35px; ' +
  'font-weight: bold; color: #fff; width: 1000px; height: 50px;}';


/**
 * Adds the PowerKey CSS to the page.
 */
PowerKey.setDefaultCSSStyle = function() {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = PowerKey.cssStr;
  head.appendChild(style);
};


/**
 * Constants for key codes.
 * @enum {number}
 */
PowerKey.keyCodes = {
  KEYUP : 38,
  KEYDOWN : 40,
  ENTER : 13,
  TAB : 9
};
