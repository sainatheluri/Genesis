
'use strict';

goog.provide('Blockly.Genesis');

goog.require('Blockly.Generator');



Blockly.Genesis = new Blockly.Generator('Genesis');


Blockly.Genesis.addReservedWords(
    '_,' +
    '__inext,assert,bit,colors,colours,coroutine,disk,dofile,error,fs,' +
    'fetfenv,getmetatable,gps,help,io,ipairs,keys,loadfile,loadstring,math,' +
    'native,next,os,paintutils,pairs,parallel,pcall,peripheral,print,' +
    'printError,rawequal,rawget,rawset,read,rednet,redstone,rs,select,' +
    'setfenv,setmetatable,sleep,string,table,term,textutils,tonumber,' +
    'tostring,turtle,type,unpack,vector,write,xpcall,_VERSION,__indext,' +
    'HTTP,' +
    'and,break,do,else,elseif,end,false,for,function,if,in,local,nil,not,or,' +
    'repeat,return,then,true,until,while,' +
    'add,sub,mul,div,mod,pow,unm,concat,len,eq,lt,le,index,newindex,call,' +
    'assert,collectgarbage,dofile,error,_G,getmetatable,inpairs,load,' +
    'loadfile,next,pairs,pcall,print,rawequal,rawget,rawlen,rawset,select,' +
    'setmetatable,tonumber,tostring,type,_VERSION,xpcall,' +
    'require,package,string,table,math,bit32,io,file,os,debug'
);


Blockly.Genesis.ORDER_ATOMIC = 0;          // literals
Blockly.Genesis.ORDER_HIGH = 1;            // Function calls, tables[]
Blockly.Genesis.ORDER_EXPONENTIATION = 2;  // ^
Blockly.Genesis.ORDER_UNARY = 3;           // not # - ~
Blockly.Genesis.ORDER_MULTIPLICATIVE = 4;  // * / %
Blockly.Genesis.ORDER_ADDITIVE = 5;        // + -
Blockly.Genesis.ORDER_CONCATENATION = 6;   // ..
Blockly.Genesis.ORDER_RELATIONAL = 7;      // < > <=  >= ~= ==
Blockly.Genesis.ORDER_AND = 8;             // and
Blockly.Genesis.ORDER_OR = 9;              // or
Blockly.Genesis.ORDER_NONE = 99;


Blockly.Genesis.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Genesis.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Genesis.functionNames_ = Object.create(null);

  if (!Blockly.Genesis.variableDB_) {
    Blockly.Genesis.variableDB_ =
        new Blockly.Names(Blockly.Genesis.RESERVED_WORDS_);
  } else {
    Blockly.Genesis.variableDB_.reset();
  }
  var defvars = [];
  var variables = workspace.variableList;
  if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.Genesis.variableDB_.getName(variables[i],
          Blockly.Variables.NAME_TYPE);
    }
  }
};

Blockly.Genesis.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Genesis.definitions_) {
    definitions.push(Blockly.Genesis.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Genesis.definitions_;
  delete Blockly.Genesis.functionNames_;
  Blockly.Genesis.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

Blockly.Genesis.scrubNakedValue = function(line) {
  return line + '\n';
};


Blockly.Genesis.quote_ = function(string) {
  return goog.string.quote(string);
};


Blockly.Genesis.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.Genesis.COMMENT_WRAP - 3);
    if (comment) {
      commentCode += Blockly.Genesis.prefixLines(comment, '-- ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.Genesis.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Genesis.prefixLines(comment, '-- ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Genesis.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
