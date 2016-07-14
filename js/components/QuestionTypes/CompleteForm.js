import React, {
  Text,
  View,
} from 'react-native';
import Styles from '../../styles/Styles';
import Color from '../../styles/Color';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';

const CompleteForm = React.createClass({
  /* Render */
  render() {
    let buttonText = 'Submit';
    if (this.props.nextForm) {
      buttonText = 'Submit and continue';
    }
    return (
      <View style={Styles.question.block}>
        <View style={[Styles.question.header, Styles.question.headerComplete]} >
          <Icon name='check-circle'
                size={70}
                color={Color.primary}
                style={Styles.question.headerCompleteIcon}/>
          <View style={Styles.question.headerCompleteView}>
            <Text style={Styles.question.headerCompleteViewText}>
              Form Complete
            </Text>
          </View>
        </View>
        <Button onPress={this.props.submit}
                style={[Styles.form.primaryButton, {marginTop: 30}]}
                textStyle={Styles.form.primaryButtonText}>
                {buttonText}
        </Button>
      </View>
    );
  },
});

module.exports = CompleteForm;
