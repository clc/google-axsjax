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
  this.multiplier = 1.5;

  var activeDoc = axsJAXObj.getActiveDocument();
  this.lens = activeDoc.createElement('span');

  this.lens.style.backgroundColor = '#CCE6FF';
  this.lens.style.borderColor = '#0000CC';
  this.lens.style.borderWidth = 'medium';
  this.lens.style.borderStyle = 'groove';
  this.lens.style.position = 'absolute';
  this.magnifyText();

  this.lens.style.display = 'none';
  activeDoc.body.appendChild(this.lens);

  // Firefox on Windows can use fontSizeAdjust which is easier
  // and more precise. Use sniffing code from example at:
  // http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
  var agt = navigator.userAgent.toLowerCase();
  this.is_win   = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );
};

AxsLens.prototype.view = function(targetNode){
  while (this.lens.firstChild){
    this.lens.removeChild(this.lens.firstChild);
  } 
  if (targetNode === null) {
    this.lens.style.display = 'none';
  	return;
  }
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
  this.lens.appendChild(targetNode.cloneNode(true));

  this.magnifyText();
  this.enlargeImages();

  this.lens.style.top = top + 'px';
  this.lens.style.left = left + 'px';
  this.lens.style.zIndex = 999;
  this.lens.style.display = 'block';  
};


AxsLens.prototype.setMagnification = function(multiplier){
  this.multiplier = multiplier;
  this.magnifyText();
  this.enlargeImages();
};

AxsLens.prototype.enlargeImages = function(){
  var images = this.lens.getElementsByTagName('img');
  for (var i=0,image; image = images[i]; i++){
    if (!image.hasAttribute('Axs_OrigHeight')){
      image.setAttribute('Axs_OrigHeight', image.height);
      image.setAttribute('Axs_OrigWidth', image.width);
    }
    image.height = image.getAttribute('Axs_OrigHeight') * this.multiplier;
    image.width = image.getAttribute('Axs_OrigWidth') * this.multiplier;
  }
};

AxsLens.prototype.magnifyText = function(){
    // fontSizeAdjust is based on the aspect value of the font.
    // The default aspect value of Arial is .52
    var fontSizeAdjust = this.multiplier * 0.52;
    this.lens.style.fontSizeAdjust = fontSizeAdjust;
/*
  if (this.is_win){
    // fontSizeAdjust is based on the aspect value of the font.
    // The default aspect value of Arial is .52
    var fontSizeAdjust = this.multiplier * 0.52;
    this.lens.style.fontSizeAdjust = fontSizeAdjust;
  } else if (this.lens.firstChild){
    var descendants = this.lens.firstChild.getElementsByTagName('*');
    for (var i=0, child; child=descendants[i]; i++){
      if (!child.Axs_OrigFontSize){
        var style = window.getComputedStyle(child, null);
        var sizeStr = style.fontSize;
        child.Axs_OrigFontSize = sizeStr.substring(0,sizeStr.length-2);
      }
    }
    for (i=0, child; child=descendants[i]; i++){
      child.style.fontSize = (child.Axs_OrigFontSize * this.multiplier)
                             + 'px !important';
    }
  }
*/
};
