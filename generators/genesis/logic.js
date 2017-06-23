
'use strict';

goog.provide('Blockly.Genesis.logic');

goog.require('Blockly.Genesis');


Blockly.Genesis['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.Genesis.valueToCode(block, 'IF' + n,
      Blockly.Genesis.ORDER_NONE) || 'false';
    branchCode = Blockly.Genesis.statementToCode(block, 'DO' + n);
    code += (n > 0 ? '\n ' : '') +
        'select '+'\n' + conditionCode + ' -> ' + branchCode ;

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.Genesis.statementToCode(block, 'ELSE');
    code += ' \notherwise ->' + branchCode;
  }
  return code + '\n';
};

Blockly.Genesis['controls_ifelse'] = Blockly.Genesis['controls_if'];

Blockly.Genesis['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = Blockly.Genesis.valueToCode(block, 'A',
      Blockly.Genesis.ORDER_RELATIONAL) || '0';
  var argument1 = Blockly.Genesis.valueToCode(block, 'B',
      Blockly.Genesis.ORDER_RELATIONAL) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Genesis.ORDER_RELATIONAL];
};

Blockly.Genesis['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Genesis.ORDER_AND :
      Blockly.Genesis.ORDER_OR;
  var argument0 = Blockly.Genesis.valueToCode(block, 'A', order);
  var argument1 = Blockly.Genesis.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == 'and') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Genesis['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.Genesis.valueToCode(block, 'BOOL',
      Blockly.Genesis.ORDER_UNARY) || 'true';
  var code = '!' + argument0;
  return [code, Blockly.Genesis.ORDER_UNARY];
};

Blockly.Genesis['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Genesis.ORDER_ATOMIC];
};

Blockly.Genesis['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Genesis.ORDER_ATOMIC];
};

Blockly.Genesis['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Genesis.valueToCode(block, 'IF',
      Blockly.Genesis.ORDER_AND) || 'false';
  var value_then = Blockly.Genesis.valueToCode(block, 'THEN',
      Blockly.Genesis.ORDER_AND) || 'nil';
  var value_else = Blockly.Genesis.valueToCode(block, 'ELSE',
      Blockly.Genesis.ORDER_OR) || 'nil';
  var code = value_if + ' and ' + value_then + ' or ' + value_else;
  return [code, Blockly.Genesis.ORDER_OR];
};
