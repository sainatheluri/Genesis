
'use strict';

goog.provide('Blockly.Genesis.loops');

goog.require('Blockly.Genesis');



Blockly.Genesis.CONTINUE_STATEMENT = 'goto continue\n';


Blockly.Genesis.addContinueLabel = function(branch) {
  if (branch.indexOf(Blockly.Genesis.CONTINUE_STATEMENT) > -1) {
    return branch + Blockly.Genesis.INDENT + '::continue::\n';
  } else {
    return branch;
  }
};

Blockly.Genesis['controls_repeat'] = function(block) {
  // Repeat n times (internal number).
  var repeats = parseInt(block.getFieldValue('TIMES'), 10);
  var branch = Blockly.Genesis.statementToCode(block, 'DO') || '';
  branch = Blockly.Genesis.addContinueLabel(branch);
  var loopVar = Blockly.Genesis.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' = 1, ' + repeats + ' do\n' + branch + 'end\n';
  return code;
};

Blockly.Genesis['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.Genesis.valueToCode(block, 'TIMES',
      Blockly.Genesis.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'math.floor(' + repeats + ')';
  }
  var branch = Blockly.Genesis.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Genesis.addContinueLabel(branch);
  var loopVar = Blockly.Genesis.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' = 1, ' + repeats + ' do\n' +
      branch + 'end\n';
  return code;
};

Blockly.Genesis['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Genesis.valueToCode(block, 'BOOL',
      until ? Blockly.Genesis.ORDER_UNARY :
      Blockly.Genesis.ORDER_NONE);
  var branch = Blockly.Genesis.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Genesis.addLoopTrap(branch, block.id);
  branch = Blockly.Genesis.addContinueLabel(branch);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'Generate each (n) from ' + argument0 + ' {\n' + branch + '}\n';
};

Blockly.Genesis['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.Genesis.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var startVar = Blockly.Genesis.valueToCode(block, 'FROM',
      Blockly.Genesis.ORDER_NONE) || '0';
  var endVar = Blockly.Genesis.valueToCode(block, 'TO',
      Blockly.Genesis.ORDER_NONE) || '0';
  var increment = Blockly.Genesis.valueToCode(block, 'BY',
      Blockly.Genesis.ORDER_NONE) || '1';
  var branch = Blockly.Genesis.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Genesis.addLoopTrap(branch, block.id);
  branch = Blockly.Genesis.addContinueLabel(branch);
  var code = '';
  var incValue;
  if (Blockly.isNumber(startVar) && Blockly.isNumber(endVar) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(startVar) <= parseFloat(endVar);
    var step = Math.abs(parseFloat(increment));
    incValue = (up ? '' : '-') + step;
  } else {
    code = '';
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    incValue = Blockly.Genesis.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += incValue + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + '\n';
    } else {
      code += 'math.abs(' + increment + ')\n';
    }
    code += 'if (' + startVar + ') > (' + endVar + ') then\n';
    code += Blockly.Genesis.INDENT + incValue + ' = -' + incValue + '\n';
    code += 'end\n';
  }
  code += 'for ' + variable0 + ' = ' + startVar + ', ' + endVar +
      ', ' + incValue;
  code += ' do\n' + branch + 'end\n';
  return code;
};

Blockly.Genesis['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Genesis.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Genesis.valueToCode(block, 'LIST',
      Blockly.Genesis.ORDER_NONE) || '{}';
  var branch = Blockly.Genesis.statementToCode(block, 'DO') || '\n';
  branch = Blockly.Genesis.addContinueLabel(branch);
  var code = 'for _, ' + variable0 + ' in ipairs(' + argument0 + ') do \n' +
      branch + 'end\n';
  return code;
};

Blockly.Genesis['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break\n';
    case 'CONTINUE':
      return Blockly.Genesis.CONTINUE_STATEMENT;
  }
  throw 'Unknown flow statement.';
};
