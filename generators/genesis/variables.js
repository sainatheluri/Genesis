
'use strict';

goog.provide('Blockly.Genesis.variables');

goog.require('Blockly.Genesis');


Blockly.Genesis['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Genesis.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Genesis.ORDER_ATOMIC];
};

Blockly.Genesis['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Genesis.valueToCode(block, 'VALUE',
      Blockly.Genesis.ORDER_NONE) || '0';
  var varName = Blockly.Genesis.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'let ' + varName + ' name ' + argument0 + '\n';
};
