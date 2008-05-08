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
  var cmd_GetImgText = '#AxsJAX_Cmd=GetImgText(';
  var cmd_Img = 'AxsJAX_Img=';
  var cmd_Parent = 'AxsJAX_ParentURL=';

  var params = document.location.toString();
  var params_start = params.indexOf(cmd_GetImgText) + cmd_GetImgText.length;
  params = params.substr(params_start);

  var imgUrl_start = params.indexOf(cmd_Img)+cmd_Img.length;
  var imgURL_end = params.indexOf(cmd_Parent)-1;
  var imgUrl = params.substring(imgUrl_start,imgURL_end);
  var parentUrl_start = params.indexOf(cmd_Parent)+cmd_Parent.length;
  var parentUrl_end = params.length-1;
  var parentUrl = params.substring(parentUrl_start,parentUrl_end);

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