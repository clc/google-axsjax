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
 * @fileoverview This script is used to fetch the text associated with
 * an image (alt text + title text).
 *
 * The location URL should be in the format:
 * http://www.picturesitefoo.com/thepage.html#AxsJAX_Cmd=GetImgText(AxsJAX_Img=http://www.picturesitefoo.com/interestingImage.jpg,AxsJAX_ParentURL=http://www.parentframeurl.com)
 *
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsJAX_ImgTextFetcher = {};



axsJAX_ImgTextFetcher.run = function(){
  var axsJAXCmd_GetImgTextStr = '#AxsJAX_Cmd=GetImgText(';
  var axsJAXCmd_ImgStr = 'AxsJAX_Img=';
  var axsJAXCmd_ParentStr = 'AxsJAX_ParentURL=';

  var axsJAXParams = document.location.toString();
  axsJAXParams = axsJAXParams.substr(axsJAXParams.indexOf(axsJAXCmd_GetImgTextStr) + axsJAXCmd_GetImgTextStr.length);

  var imgUrl = axsJAXParams.substring(axsJAXParams.indexOf(axsJAXCmd_ImgStr)+axsJAXCmd_ImgStr.length,axsJAXParams.indexOf(axsJAXCmd_ParentStr)-1);
  var parentUrl = axsJAXParams.substring(axsJAXParams.indexOf(axsJAXCmd_ParentStr)+axsJAXCmd_ParentStr.length,axsJAXParams.length-1);

  var imgText = "";

  try{
    var images = document.getElementsByTagName('IMG');
    var targetImage = null;
    for (var i = 0, currentImg; !targetImage && ( currentImg = images[i]); i++){
      if (currentImg.src == imgUrl){
        targetImage = currentImg;
      }
    }
    imgText = targetImage.alt + '. ' + targetImage.title;
  }catch(e){}

  if (imgText === ''){
    imgText = 'NULL';
  }
  parent.location = parentUrl + '#' + imgText;
};

axsJAX_ImgTextFetcher.run();