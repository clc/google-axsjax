// Copyright 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Declaration of the Accessibility prototype that is responsible to configure
// the infrastructure for injecting accessibility in Web applications on the Android
// platform. The instance of this prototype is exposed as navigator.accessibility
// for access by the custom AxsJAX scripts injected in the 
//
// @author svetoslavganov@googel.com (Svetoslav R. Ganov)
// 
// ==UserScript==
// @name          Accessibility
// @description   Initializes the accessibility layer and exposes it as navigator.accessibility
// @include       (.)+
// ==/UserScript==

AxsJAX.prototype.speakNode = function(targetNode, opt_noFocusChange) {
  this.speakText(targetNode.innerText);
};

AxsJAX.prototype.speakText = function(textString) {
  accessibility.stop();
  accessibility.speak(textString, 1, null);
};

AxsJAX.prototype.speakTextViaNode = function(textString, opt_anchorNode) {
  this.speakText(textString);
};
