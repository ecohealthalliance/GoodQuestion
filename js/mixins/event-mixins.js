import React from 'react-native'
import he from 'he' // HTML entity encode and decode

export default {
  decodeText(txt) {
    if (txt) {
      return he.decode(txt);
    }
    return '';
  },

  defaultChangeHandler(name, value) {
    if (typeof this.schema === 'undefined' || !this.schema.hasOwnProperty(name)) {
      console.error('Invalid validation schema');
      return;
    }
    if (!this.hasOwnProperty('joiCheckError')) {
      console.error('Invalid joi mixin');
      return;
    }
    const schema = {};
    schema[name] = this.schema[name];
    const object = {};
    object[name] = value;
    this.joiCheckError(object, schema);
    const state = {};
    state[name] = value;
    this.setState(state);
  },

  textFieldChangeHandler(name, text) {
    if (typeof text !== 'string') {
      console.error('Invalid text field value');
      return;
    }
    this.defaultChangeHandler(name, text);
  },

  checkboxChangeHandler: function(name, value) {
    if (typeof value !== 'boolean') {
      console.error('Invalid checkbox value');
      return;
    }
    this.defaultChangeHandler(name, value);
  },

  scrollToViewWrapper(scrollRef, viewWrapperRef, offset, syntheticEvent) {
    const scrollElement = this.refs[scrollRef];
    const viewWrapperElement = this.refs[viewWrapperRef];
    if (typeof scrollElement === 'undefined') {
      console.warn('The <ScrollView> must have a ref assigned');
      return;
    }
    if (typeof viewWrapperElement === 'undefined') {
      console.warn('The <View> wrapper must have a ref assigned');
    }
    if (typeof offset !== 'number') {
      syntheticEvent = offset
      offset = 0;
    }
    const scrollResponder = scrollElement.getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(viewWrapperElement),
      offset,
      true
    );
  },

};
