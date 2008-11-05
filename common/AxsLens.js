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
  this.axsJAXObj = axsJAXObj;
  this.multiplier = 1.5;
  this.padding = -1;

  this.scrollMode = 0;

  this.activeDoc = axsJAXObj.getActiveDocument();
  this.lens = this.activeDoc.createElement('span');

  this.lens.style.backgroundColor = '#CCE6FF';
  this.lens.style.borderColor = '#0000CC';
  this.lens.style.borderWidth = 'medium';
  this.lens.style.borderStyle = 'groove';
  this.lens.style.position = 'absolute';

  this.lens.style.display = 'none';
  this.activeDoc.body.appendChild(this.lens);

  //Initialize this with a dummy function for js compilation
  var dummyObject;
  this.callback = function(dummyObject){};
};

/**
 * Enums for the scroll modes
 */
AxsLens.ScrollMode = {
  NONE: 0, //Default
  FORCE_TO_LENS: 1
};

/**
 * Sets the type of scrolling to use.
 * By default, no scrolling will be done.
 * However, scrolling can be forced by setting the scrollMode to
 * AxsLens.ScrollMode.FORCE_TO_LENS
 * This may introduce some side effects such as screen flashing,
 * so only set this if you really need it.
 * @param {number} scrollMode The scrollMode to be used when magnifying.
 * @param {Array} paramsArray Params for scroll modes that require parameters.
 */
AxsLens.prototype.setScrollMode = function(scrollMode, paramsArray){
  this.scrollMode = scrollMode;
};

/**
 * View the targetNode through AxsLens.
 * This method will create a copy of the 
 * targetNode, apply the lens' transformation
 * to the copy, and place the copy in an
 * element floating above the targetNode.
 * If targetNode is set to null, the lens will stop being displayed.
 * @param {Object?} targetNode The DOM node to be viewed.
 */
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

  this.lens.style.top = top + 'px';
  this.lens.style.left = left + 'px';
  this.lens.style.zIndex = 999;
  this.lens.style.display = 'block';

  this.magnify();
};

/**
 * Sets the multiplication factor of the lens
 * @param {Number} multiplier The multiplication factor to be used 
 * by the lens when magnifying content.
 */
AxsLens.prototype.setMagnification = function(multiplier){
  this.multiplier = multiplier;
  this.magnify();
};

/**
 * Magnifies the lens object by enlarging its text and images.
 */
AxsLens.prototype.magnify = function() {
  //Detach to avoid propagation of events generated during the magnification
  this.activeDoc.body.removeChild(this.lens);
  this.magnifyText();
  this.enlargeImages();
  this.addPadding();
  //Attach the lens object back to the document
  this.activeDoc.body.appendChild(this.lens);
  //Invoke callback if there is one
  if (this.callback){
    this.callback(this.lens);
  }
  if (this.scrollMode == AxsLens.ScrollMode.FORCE_TO_LENS){
    var self = this;
    window.setTimeout(function(){self.lens.scrollIntoView(true);}, 0);
  }
};

/**
 * Sets the padding in pixels between the magnified nodes.
 * Setting this to -1 will leave the padding as it was on the original element.
 * @param {Number} numberOfPixels The padding value to apply (in pixels).
 */
AxsLens.prototype.setPadding = function(numberOfPixels) {
  this.padding = numberOfPixels;
};

/**
 * Adds padding to the leaf-level children of the lens.
 */
AxsLens.prototype.addPadding = function() {
  if (this.padding < 0){
    return;
  }
  //Get all leafs of the lens
  var xPath = '//*[not(.//*)]';
  var leafNodes = this.axsJAXObj.evalXPath(xPath, this.lens);

  for (var i = 0, leafNode; leafNode = leafNodes[i]; i++) {
    leafNode.style.padding = this.padding + 'px';
  }
};

/**
 * Enlarges the images of the content being viewed in the lens.
 */
AxsLens.prototype.enlargeImages = function(){
  var images = this.lens.getElementsByTagName('img');
  for (var i = 0, image; image = images[i]; i++){
    if (!image.hasAttribute('Axs_OrigHeight')){
      image.setAttribute('Axs_OrigHeight', image.height);
      image.setAttribute('Axs_OrigWidth', image.width);
    }
    image.height = image.getAttribute('Axs_OrigHeight') * this.multiplier;
    image.width = image.getAttribute('Axs_OrigWidth') * this.multiplier;
  }
};

/**
 * Enlarges the text of the content being viewed in the lens.
 */
AxsLens.prototype.magnifyText = function(){
  // Use fontSizeAdjust if possible, but fallback to using just font-size 
  // and a percentage if there is no choice.
  // fontSizeAdjust is based on the aspect value of the font.
  // The default aspect value of Arial is .52
  var hasFontSizeAdjust = 'fontSizeAdjust' in this.lens.style;
  if (hasFontSizeAdjust){
    var fontSizeAdjust = this.multiplier * 0.52;
    this.lens.style.fontSizeAdjust = fontSizeAdjust;
  } else {
    var adjustment = (this.multiplier * 100) + '%';
    this.lens.style.setProperty('font-size', adjustment, 'important');
  }

  // Force the line-height to normal so that multiline text does
  // not collide with itself.
  // Also, remove individual fontSize settings if that was used
  //  instead of fontSizeAdjust
  var subnodes = this.lens.getElementsByTagName('*');
  for (var i = 0, node; node = subnodes[i]; i++){
    node.style.setProperty('line-height', 'normal', 'important');
    if (!hasFontSizeAdjust){
      node.style.setProperty('font-size', '100%', 'important');
    }
  }

};

/**
 * Sets a callback to be invoked when magnification is performed.
 * The callback will be called with the lens node as the parameter.
 * Such callbacks could be useful when dealing with special cases such
 * as CSS spriting where the positioning needs to be recomputed in a way
 * that is specific to the particular web app.
 *
 * @notypecheck {Function?} callback.
 *
 * @param {Function?} callback to be called when magnification is performed.
 * Set this to null to disable using the callback.
 */
AxsLens.prototype.setMagnificationCallback = function(callback) {
  this.callback = callback;
};
