Blockly.Blocks['lists_insert'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendValueInput("options")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["Insert Before","OPTIONNAME"], ["Insert After","OPTIONNAME"]]), "insertoptions");
    this.appendValueInput("value")
        .setCheck(null)
        .appendField("as");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['insert_before'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendValueInput("position")
        .setCheck(null)
        .appendField("insert before");
    this.appendValueInput("value")
        .setCheck(null)
        .appendField("as");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};