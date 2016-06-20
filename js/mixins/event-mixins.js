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

  /**
   * scrolls to a view within a scrollview
   *
   * @param {string} scrollRef, the reference string to the ScrollView
   * @param {string} viewWrapperRef, the reference string to the View
   * @param {number} offset, any additional offset to scroll (not including the height of the view wrapper)
   */
  scrollToViewWrapper(scrollRef, viewWrapperRef, offset, syntheticEvent) {
    const scrollElement = this.refs[scrollRef];
    const viewWrapperElement = this.refs[viewWrapperRef];
    if (typeof viewWrapperElement === 'undefined') {
      console.warn('The <View> wrapper must have a ref assigned');
      return;
    }
    viewWrapperElement.measure((ox, oy, width, height, px, py) => {
      if (typeof scrollElement === 'undefined') {
        console.warn('The <ScrollView> must have a ref assigned');
        return;
      }
      if (typeof offset !== 'number') {
        syntheticEvent = offset
        offset = 0;
      }
      offset = offset + height;
      const scrollResponder = scrollElement.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(viewWrapperElement),
        offset,
        true
      );
    });
  },

  /**
   * determines the height of an element
   *
   * @return {function} done, the callback (err, height) of the element.
   */
  calculateHeight(viewRef, done) {
    const viewElement = this.refs[viewRef];
    if (typeof viewElement === 'undefined') {
      done('The <View> must have a ref assigned');
      return;
    }
    viewElement.measure((ox, oy, width, height, px, py) => {
      done(null, height);
    });
  },

  /**
   * scrolls to a vertical position within scrollview
   *
   * @param {string} scrollRef, the reference string to the ScrollView
   * @param {number} position, the vertical position to scroll within the ScrollView
   */
  scrollTo(scrollRef, position, syntheticEvent) {
    const scrollElement = this.refs[scrollRef];
    if (typeof scrollElement === 'undefined') {
      console.warn('The <ScrollView> must have a ref assigned');
      return;
    }
    if (typeof position !== 'number') {
      syntheticEvent = position
      position = 0;
    }
    scrollElement.scrollTo(position)
  },

  /**
   * trims TextInput value of whitespace
   *
   * @param {string} inputRef, the reference of the input element
   * @return {string} txt, the trimmed text
   */
  trimText(inputRef) {
    const inputElement = this.refs[inputRef];
    if (typeof inputElement === 'undefined') {
      console.warn('The <TextInput> must have a ref assigned');
      return;
    }
    const txt = inputElement._getText();
    if (typeof txt === 'string') {
      inputElement.setNativeProps({text: txt.trim()});
      this.textFieldChangeHandler(inputRef, txt.trim());
    }
  },

};
