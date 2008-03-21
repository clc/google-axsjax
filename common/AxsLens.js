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
 * @fileoverview AxsLens - JavaScript library for applying a lens
 * to content on web pages.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class for applying a lens to content on web pages.
 * Lenses can be used to magnify the content, change the font color,
 * change the background color, and more.
 * @param {Object} axsJAXObj  An instance of an AxsJAX object.
 * @constructor
 */
var AxsLens = function(axsJAXObj){
  var activeDoc = axsJAXObj.getActiveDocument();
  this.lens = activeDoc.createElement('div');
  this.lens.style.backgroundColor = '#CCE6FF';
  this.lens.style.fontSizeAdjust = 0.70;
  this.lens.style.borderColor = '#0000CC';
  this.lens.style.borderWidth = 'medium';
  this.lens.style.borderStyle = 'groove';
  this.lens.style.position = 'absolute';

  this.lens.style.display = 'none';

  activeDoc.body.appendChild(this.lens);
};

AxsLens.prototype.view = function(targetNode){
  var left = 0;
  var top = 0;
  var obj = targetNode;
  if (obj.offsetParent) {
		left = obj.offsetLeft;
		top = obj.offsetTop;
    obj = obj.offsetParent;
    while (obj !== null) {
			left += obj.offsetLeft;
			top += obj.offsetTop;
      obj = obj.offsetParent;
    }
	}

  while (this.lens.firstChild){
    this.lens.removeChild(this.lens.firstChild);
  }

  this.lens.appendChild(targetNode.cloneNode(true));

  this.lens.style.display = 'block';
  this.lens.style.top = top;
  this.lens.style.left = left;
};

AxsLens.prototype.setMagnification = function(newSize){
  this.lens.style.fontSizeAdjust = newSize;
};