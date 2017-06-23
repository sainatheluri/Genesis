
'use strict';

goog.provide('Blockly.Genesis.texts');

goog.require('Blockly.Genesis');


Blockly.Genesis['text'] = function(block) {
  // Text value.
  var code = Blockly.Genesis.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.Genesis.ORDER_ATOMIC];
};


Blockly.Genesis['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.Genesis.valueToCode(block, 'TEXT',
      Blockly.Genesis.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ')\n';
};

