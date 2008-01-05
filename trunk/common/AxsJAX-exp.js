// Copyright 2007 Google Inc.


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
 * @fileoverview AxsJAX-exp - JavaScript library for enhancing the accessibility 
 * of AJAX apps through WAI-ARIA.
 * This module contains portions of the AxsJAX namespace
 * that are still considered experimental.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Removes the actual body of the page from view and replaces it with
 * a drill down view that only contains the subtree of the targetNode.
 * @param {Node} targetNode The HTML node to force the AT to sync to
 */
AxsJAX.prototype.enterDrillDownView = function(targetNode){
  if (this.currentView == 1){
    return;
  }
  if (!this.htmlNode){
    this.origBody = document.body;
    this.htmlNode = this.origBody.parentNode;
  }
  this.drillDownBody = document.createElement('BODY');
  this.drillDownBody.appendChild(targetNode.cloneNode(true));
  this.drillDownBody.firstChild.setAttribute('tabindex',0);
  this.htmlNode.insertBefore(this.drillDownBody, this.origBody);
  this.origBody.style.display="none";
  this.currentView = 1;
  this.drillDownBody.firstChild.focus();
};

/**
 * Restores the original body after entering the drill down view.
 */
AxsJAX.prototype.restoreOriginalView = function(){
  if (this.currentView === 0){
    return;
  }
  this.origBody.style.display="";
  this.htmlNode.removeChild(this.drillDownBody);
  this.drillDownBody = null;
  this.currentView = 0;
};
