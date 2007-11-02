//AxsJAX script for Jawbreaker game at:
//http://www.minijuegosgratis.com/juegos/jawbreaker/jawbreaker.htm

var axsJb_row = 0;
var axsJb_col = 0;
var axsJb_axsJaxObj = new AxsJAX();


function axsJb_getCurrentPosition(){
  if (axsJb_row < 0){
    axsJb_row = 0;
  }
  if (axsJb_row > 11){
    axsJb_row = 11;
  }
  if (axsJb_col < 0){
    axsJb_col = 0;
  }
  if (axsJb_col > 10){
    axsJb_col = 10;
  }
  var ballImg = axsJb_getCurrentBallImgNode();
  var color = '';
  var ImgSrcString = ballImg.src.toString();
  if (ImgSrcString.indexOf('s_green.gif') != -1){ color = 'Selected. Green. '; }
  if (ImgSrcString.indexOf('s_blue.gif') != -1){ color = 'Selected. Blue. '; }
  if (ImgSrcString.indexOf('s_purple.gif') != -1){ color = 'Selected. Purple. '; }
  if (ImgSrcString.indexOf('s_red.gif') != -1){ color = 'Selected. Red. '; }
  if (ImgSrcString.indexOf('s_yellow.gif') != -1){ color = 'Selected. Yellow. '; }
  if (ImgSrcString.indexOf('p_green.gif') != -1){ color = 'Green. '; }
  if (ImgSrcString.indexOf('p_blue.gif') != -1){ color = 'Blue. '; }
  if (ImgSrcString.indexOf('p_purple.gif') != -1){ color = 'Purple. '; }
  if (ImgSrcString.indexOf('p_red.gif') != -1){ color = 'Red. '; }
  if (ImgSrcString.indexOf('p_yellow.gif') != -1){ color = 'Yellow. '; }
  if (ImgSrcString.indexOf('p_white.gif') != -1){ color = 'Blank. '; }
  var message = color + axsJb_row + ', ' + axsJb_col + '.';
  ballImg.alt = message;
  axsJb_axsJaxObj.speakNode(ballImg);
}

function axsJb_getCurrentBallImgNode(){
  var rowString = axsJb_row.toString();
  var colString = axsJb_col.toString();
  if (rowString.length < 2){
    rowString = '0' + rowString;
  }
  if (colString.length < 2){
    colString = '0' + colString;
  }
  var targetId = 'r'+ rowString + 'c' + colString;
  return document.getElementById(targetId);
}

function axsJb_sayStats(){
  var blockCount = document.getElementById('blockcount').textContent;
  var blockScore = document.getElementById('blockscore').textContent;
  var totalScore = document.getElementById('userscore').textContent;
  axsJb_axsJaxObj.speakText('Block count: ' + blockCount + '. Block score: ' + blockScore + '. Total score: ' + totalScore + '.');
}

function axsJb_keyboardHandler(evt){
  if (evt.keyCode == 38){ // Up arrow
    axsJb_row--;
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 37){ // Left arrow 
    axsJb_col--;
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 40){ // Down arrow
    axsJb_row++;
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 39){ // Right arrow
 
    axsJb_col++;
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 32){ // Space
    axsJb_axsJaxObj.clickElem(axsJb_getCurrentBallImgNode());
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 115){ // s
    axsJb_sayStats();
  }
  if (evt.charCode == 110){ // n
    axsJb_row = 0;
    axsJb_col = 0;
    axsJb_axsJaxObj.clickElem(document.getElementById('menu-start'));
    axsJb_getCurrentPosition();
  }  
}


document.addEventListener('keypress', axsJb_keyboardHandler, true);