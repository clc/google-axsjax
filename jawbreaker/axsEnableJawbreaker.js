//AxsJAX script for Jawbreaker game at:
//http://www.minijuegosgratis.com/juegos/jawbreaker/jawbreaker.htm

var axsJb_row = 0;
var axsJb_col = 0;
var axsJb_MAXROW = 11;
var axsJb_MAXCOL = 10;
var axsJb_HELP_STRING = 'The following keys are available. ' +
                        'N, start a new game. ' +
                        'Arrow keys or H,J,K,L, navigate the board one ball at a time. ' +
                        'A,E,T,B, jump to the edges of the board. ' +
                        'R, read the current row. ' +
                        'C, read the current column. ' +
                        'S, read the current stats. ' +
                        'Space, click on the current ball. The first click selects the group and the second click confirms the selection.';

var axsJb_axsJaxObj = new AxsJAX(false);


function axsJb_getCurrentPosition(){
  var ballImg = axsJb_getBallImgNode(axsJb_row,axsJb_col);
  var color = axsJb_getColorOfBallImg(ballImg);
  var message = color + axsJb_row + ', ' + axsJb_col + '.';
  ballImg.alt = message;
  axsJb_axsJaxObj.speakNode(ballImg);
}
/*
 * Dictionary mapping  image names to color names
 */
var AxsJBImg2ColorMap = {
  's_green.gif' : 'Selected Green. ',
  's_blue.gif' : 'Selected Blue. ',
  's_purple.gif' : 'Selected Purple. ',
  's_red.gif' : 'Selected  Red. ',
  's_yellow.gif' : 'Selected Yellow. ',
  'p_green.gif' : 'Green, ',
  'p_blue.gif' : 'Blue, ',
  'p_purple.gif' : 'Purple, ',
  'p_red.gif' : 'Red, ',
  'p_yellow.gif' : 'Yellow, ',
  'p_white.gif' : 'dot, '
};

function axsJb_getColorOfBallImg(ballImg){
  var color = AxsJBImg2ColorMap[axsJb_getUrlOfBallImg(ballImg)];
  return color;
}

function axsJb_getUrlOfBallImg(ballImg){
  var url = ballImg.src.toString();
  var slashPos = url.lastIndexOf('/');
  return url.substring(slashPos+1);
}

function axsJb_getBallImgNode(row,col){
  var rowString = row.toString();
  var colString = col.toString();
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
  if (blockCount == 0 ) {
      axsJb_axsJaxObj.speakThroughPixel('  Score is   ' + totalScore );
  } else {
      axsJb_axsJaxObj.speakThroughPixel(blockCount+ 'blocks make '  + blockScore + ' to  Total ' + totalScore );
  }
}

function axsJb_speakRow(){
  var speechString = "R " +  axsJb_row + ": ";
  var startPos = axsJb_findFirstBallInRow();
  if (startPos > 1){
    speechString = speechString + startPos + ' blanks, ';
  } else {
    startPos = 0;
  }     
  for (var col = startPos; col < axsJb_MAXCOL; col++){
    speechString = speechString + axsJb_getColorOfBallImg(axsJb_getBallImgNode(axsJb_row,col));
  }
  speechString = speechString + axsJb_getColorOfBallImg(axsJb_getBallImgNode(axsJb_row,axsJb_MAXCOL));
  axsJb_axsJaxObj.speakThroughPixel(speechString);
}

function axsJb_speakCol(){
  var speechString = "C " +  axsJb_col + ": ";
  var startPos = axsJb_findFirstBallInCol();
  if (startPos > 1){
    speechString = speechString + startPos + ' blanks, ';
  } else {
    startPos = 0;
  }       
  for (var row = startPos; row < axsJb_MAXROW; row++){
    speechString = speechString + axsJb_getColorOfBallImg(axsJb_getBallImgNode(row,axsJb_col));
  }
  speechString = speechString + axsJb_getColorOfBallImg(axsJb_getBallImgNode(axsJb_MAXROW,axsJb_col));
  axsJb_axsJaxObj.speakThroughPixel(speechString);
}

function axsJb_findFirstBallInCol(){
  for (var row = 0; row < axsJb_MAXROW; row++){
    var ballImg = axsJb_getBallImgNode(row,axsJb_col);
    if (axsJb_getUrlOfBallImg(ballImg) != 'p_white.gif'){
      return row;
    }  
  }
  return -1;
}

function axsJb_findFirstBallInRow(){
  for (var col = 0; col < axsJb_MAXCOL; col++){
    var ballImg = axsJb_getBallImgNode(axsJb_row,col);
    if (axsJb_getUrlOfBallImg(ballImg) != 'p_white.gif'){
      return col;
    }  
  }
  return -1;
}



function axsJb_keyboardHandler(evt){
  if (evt.charCode == 97){      //a
    var targCol = axsJb_findFirstBallInRow();
    if (targCol != -1){    
      axsJb_col = targCol;
    }
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 101){       //e
    axsJb_col = axsJb_MAXCOL;
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 116){      //t
    var targRow = axsJb_findFirstBallInCol();
    if (targRow != -1){    
      axsJb_row = targRow;
    }
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 98){       //b
    axsJb_row = axsJb_MAXROW;
    axsJb_getCurrentPosition();
  }


  if (evt.keyCode == 38 ||
      evt.charCode == 107){ // Up arrow or k
    axsJb_row--;
    if (axsJb_row < 0){ axsJb_row = 0; }
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 37 ||
      evt.charCode == 104){ // Left arrow  or h
    axsJb_col--;
    if (axsJb_col < 0){ axsJb_col = 0; }
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 40 ||
      evt.charCode == 106){ // Down arrow or j 
    axsJb_row++;
    if (axsJb_row > axsJb_MAXROW){  axsJb_row = axsJb_MAXROW; }
    axsJb_getCurrentPosition();
  }
  if (evt.keyCode == 39 ||
      evt.charCode == 108){ // Right arrow or l
    axsJb_col++;
    if (axsJb_col > axsJb_MAXCOL){ axsJb_col = axsJb_MAXCOL; }
    axsJb_getCurrentPosition();
  }
  if (evt.charCode == 32){ // Space
    axsJb_axsJaxObj.clickElem(axsJb_getBallImgNode(axsJb_row,axsJb_col), false);
    if (axsJb_getUrlOfBallImg(axsJb_getBallImgNode(axsJb_row,axsJb_col)).indexOf('s_') === 0){
      axsJb_sayStats();
    } else {      
      var totalScore = document.getElementById('userscore').textContent;
      axsJb_axsJaxObj.speakThroughPixel('Total ' + totalScore);
    }  
  }
  if (evt.charCode == 115){ // s
    axsJb_sayStats();
  }
  if (evt.charCode == 99){ // c
    axsJb_speakCol();
  }
  if (evt.charCode == 114){ // r
    axsJb_speakRow();
  }
  if (evt.charCode == 110){ // n
    axsJb_row = 0;
    axsJb_col = 0;
    axsJb_axsJaxObj.clickElem(document.getElementById('menu-start'), false);
    axsJb_getCurrentPosition();
  }

  if (evt.charCode == 63){ // ? (question mark)
    axsJb_axsJaxObj.speakThroughPixel(axsJb_HELP_STRING);
  }

}


document.addEventListener('keypress', axsJb_keyboardHandler, true);
