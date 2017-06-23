
'use strict';

goog.provide('Blockly.Genesis.math');

goog.require('Blockly.Genesis');


Blockly.Genesis['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order = code < 0 ? Blockly.Genesis.ORDER_UNARY :
              Blockly.Genesis.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Genesis['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    ADD: [' + ', Blockly.Genesis.ORDER_ADDITIVE],
    MINUS: [' - ', Blockly.Genesis.ORDER_ADDITIVE],
    MULTIPLY: [' * ', Blockly.Genesis.ORDER_MULTIPLICATIVE],
    DIVIDE: [' / ', Blockly.Genesis.ORDER_MULTIPLICATIVE],
    POWER: [' ^ ', Blockly.Genesis.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Genesis.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Genesis.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Genesis['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.Genesis.valueToCode(block, 'NUM',
        Blockly.Genesis.ORDER_UNARY) || '0';
    return ['-' + arg, Blockly.Genesis.ORDER_UNARY];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.Genesis.valueToCode(block, 'NUM',
        Blockly.Genesis.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.Genesis.valueToCode(block, 'NUM',
        Blockly.Genesis.ORDER_NONE) || '0';
  }
  switch (operator) {
    case 'ABS':
      code = '//To be completed';
      break;
    case 'ROOT':
      code = 'square root of (' + arg + ')';
      break;
    case 'LN':
      code = '//To be completed';
      break;
    case 'LOG10':
      code = '//To be completed';
      break;
    case 'EXP':
      code = '//To be completed';
      break;
    case 'POW10':
      code = '//To be completed';
      break;
    case 'ROUND':
      // This rounds up.  Blockly does not specify rounding direction.
      code = 'integer(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = '//To be completed';
      break;
    case 'ROUNDDOWN':
      code = '//To be completed';
      break;
    case 'SIN':
      code = 'math.sin(math.rad(' + arg + '))';
      break;
    case 'COS':
      code = 'math.cos(math.rad(' + arg + '))';
      break;
    case 'TAN':
      code = 'math.tan(math.rad(' + arg + '))';
      break;
    case 'ASIN':
      code = 'math.deg(math.asin(' + arg + '))';
      break;
    case 'ACOS':
      code = 'math.deg(math.acos(' + arg + '))';
      break;
    case 'ATAN':
      code = 'math.deg(math.atan(' + arg + '))';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Genesis.ORDER_HIGH];
};


Blockly.Genesis['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.Genesis.valueToCode(block, 'NUMBER_TO_CHECK',
      Blockly.Genesis.ORDER_MULTIPLICATIVE) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
      case 'PRIME':
      code = '//To be completed';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Genesis.valueToCode(block, 'DIVISOR',
          Blockly.Genesis.ORDER_MULTIPLICATIVE);
      // If 'divisor' is some code that evals to 0, Genesis will produce a nan.
      // Let's produce nil if we can determine this at compile-time.
      if (!divisor || divisor == '0') {
        return ['nil', Blockly.Genesis.ORDER_ATOMIC];
      }
      // The normal trick to implement ?: with and/or doesn't work here:
      //   divisor == 0 and nil or number_to_check % divisor == 0
      // because nil is false, so allow a runtime failure. :-(
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Genesis.ORDER_RELATIONAL];
};

Blockly.Genesis['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.Genesis.valueToCode(block, 'DELTA',
      Blockly.Genesis.ORDER_ADDITIVE) || '0';
  var varName = Blockly.Genesis.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'let '+varName + ' name ' + varName + ' + ' + argument0 + '\n';
};

// Rounding functions have a single operand.
Blockly.Genesis['math_round'] = Blockly.Genesis['math_single'];
// Trigonometry functions have a single operand.
Blockly.Genesis['math_trig'] = Blockly.Genesis['math_single'];

Blockly.Genesis['math_on_list'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.Genesis.valueToCode(block, 'LIST',
      Blockly.Genesis.ORDER_NONE) || '{}';
  var functionName;

  // Functions needed in more than one case.
  function provideSum() {
    return Blockly.Genesis.provideFunction_(
        'math_sum',
        ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
         '  local result = 0',
         '  for _, v in ipairs(t) do',
         '    result = result + v',
         '  end',
         '  return result',
         'end']);
  }

  switch (func) {
    case 'SUM':
      functionName = provideSum();
      break;

    case 'MIN':
      // Returns 0 for the empty list.
      functionName = Blockly.Genesis.provideFunction_(
          'math_min',
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  if #t == 0 then',
           '    return 0',
           '  end',
           '  local result = math.huge',
           '  for _, v in ipairs(t) do',
           '    if v < result then',
           '      result = v',
           '    end',
           '  end',
           '  return result',
           'end']);
      break;

    case 'AVERAGE':
      // Returns 0 for the empty list.
      functionName = Blockly.Genesis.provideFunction_(
          'math_average',
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  if #t == 0 then',
           '    return 0',
           '  end',
           '  return ' + provideSum() + '(t) / #t',
           'end']);
      break;

    case 'MAX':
      // Returns 0 for the empty list.
      functionName = Blockly.Genesis.provideFunction_(
          'math_max',
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  if #t == 0 then',
           '    return 0',
           '  end',
           '  local result = -math.huge',
           '  for _, v in ipairs(t) do',
           '    if v > result then',
           '      result = v',
           '    end',
           '  end',
           '  return result',
           'end']);
      break;

    case 'MEDIAN':
      functionName = Blockly.Genesis.provideFunction_(
          'math_median',
          // This operation excludes non-numbers.
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  -- Source: http://Genesis-users.org/wiki/SimpleStats',
           '  if #t == 0 then',
           '    return 0',
           '  end',
           '  local temp={}',
           '  for _, v in ipairs(t) do',
           '    if type(v) == "number" then',
           '      table.insert(temp, v)',
           '    end',
           '  end',
           '  table.sort(temp)',
           '  if #temp % 2 == 0 then',
           '    return (temp[#temp/2] + temp[(#temp/2)+1]) / 2',
           '  else',
           '    return temp[math.ceil(#temp/2)]',
           '  end',
           'end']);
      break;

    case 'MODE':
      functionName = Blockly.Genesis.provideFunction_(
          'math_modes',
          // As a list of numbers can contain more than one mode,
          // the returned result is provided as an array.
          // The Genesis version includes non-numbers.
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  -- Source: http://Genesis-users.org/wiki/SimpleStats',
           '  local counts={}',
           '  for _, v in ipairs(t) do',
           '    if counts[v] == nil then',
           '      counts[v] = 1',
           '    else',
           '      counts[v] = counts[v] + 1',
           '    end',
           '  end',
           '  local biggestCount = 0',
           '  for _, v  in pairs(counts) do',
           '    if v > biggestCount then',
           '      biggestCount = v',
           '    end',
           '  end',
           '  local temp={}',
           '  for k, v in pairs(counts) do',
           '    if v == biggestCount then',
           '      table.insert(temp, k)',
           '    end',
           '  end',
           '  return temp',
           'end']);
      break;

    case 'STD_DEV':
      functionName = Blockly.Genesis.provideFunction_(
          'math_standard_deviation',
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  local m',
           '  local vm',
           '  local total = 0',
           '  local count = 0',
           '  local result',
           '  m = #t == 0 and 0 or ' + provideSum() + '(t) / #t',
           '  for _, v in ipairs(t) do',
           "    if type(v) == 'number' then",
           '      vm = v - m',
           '      total = total + (vm * vm)',
           '      count = count + 1',
           '    end',
           '  end',
           '  result = math.sqrt(total / (count-1))',
           '  return result',
           'end']);
      break;

    case 'RANDOM':
      functionName = Blockly.Genesis.provideFunction_(
          'math_random_list',
          ['function ' + Blockly.Genesis.FUNCTION_NAME_PLACEHOLDER_ + '(t)',
           '  if #t == 0 then',
           '    return nil',
           '  end',
           '  return t[math.random(#t)]',
           'end']);
      break;

    default:
      throw 'Unknown operator: ' + func;
  }
  return [functionName + '(' + list + ')', Blockly.Genesis.ORDER_HIGH];
};

Blockly.Genesis['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.Genesis.valueToCode(block, 'DIVIDEND',
      Blockly.Genesis.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.Genesis.valueToCode(block, 'DIVISOR',
      Blockly.Genesis.ORDER_MULTIPLICATIVE) || '0';
  var code = 'remainder of ('+ argument0 + ') divided by (' + argument1 + ')';
  return [code, Blockly.Genesis.ORDER_MULTIPLICATIVE];
};

Blockly.Genesis['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  var argument0 = Blockly.Genesis.valueToCode(block, 'VALUE',
      Blockly.Genesis.ORDER_NONE) || '0';
  var argument1 = Blockly.Genesis.valueToCode(block, 'LOW',
      Blockly.Genesis.ORDER_NONE) || '-math.huge';
  var argument2 = Blockly.Genesis.valueToCode(block, 'HIGH',
      Blockly.Genesis.ORDER_NONE) || 'math.huge';
  var code = 'math.min(math.max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.Genesis.ORDER_HIGH];
};

Blockly.Genesis['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Genesis.valueToCode(block, 'FROM',
      Blockly.Genesis.ORDER_NONE) || '0';
  var argument1 = Blockly.Genesis.valueToCode(block, 'TO',
      Blockly.Genesis.ORDER_NONE) || '0';
  var code = 'random() % ( ' + argument1 + ' - ' + argument0 + ' + '+'1'+' )'+ ' + ' + argument0;
  return [code, Blockly.Genesis.ORDER_HIGH];
};

Blockly.Genesis['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  return ['math.random()', Blockly.Genesis.ORDER_HIGH];
};
