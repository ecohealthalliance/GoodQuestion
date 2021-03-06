import React from 'react';
import {
  Text,
  ScrollView,
  View,
} from 'react-native';

import TermsOfService from '../data/TermsOfService';
import Styles from '../styles/Styles';

const TermsOfServicePage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.default, {flex: 1}]}>
        <ScrollView
         contentContainerStyle={Styles.container.informational}
         horizontal={false}
         keyboardShouldPersistTaps={true}
         keyboardDismissMode='on-drag'>
          <Text>
            {TermsOfService}
          </Text>
        </ScrollView>
      </View>
    );
  },
});

module.exports = TermsOfServicePage;
