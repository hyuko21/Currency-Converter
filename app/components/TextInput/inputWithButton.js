import React from 'react';
import {
  View, Text, TouchableHighlight, TextInput,
} from 'react-native';
import color from 'color';
import PropTypes from 'prop-types';

import styles from './styles';

const InputWithButton = (props) => {
  const {
    buttonText, onPress, editable = true, textColor,
  } = props;

  const underlayColor = color(styles.$buttonBackgroundColorBase).darken(
    styles.$buttonBackgroundColorModifier,
  );

  const containerStyles = [styles.container];
  if (!editable) containerStyles.push(styles.containerDisabled);

  const buttonTextStyles = [styles.buttonText];
  if (textColor) buttonTextStyles.push({ color: textColor });

  return (
    <View style={containerStyles}>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <Text style={buttonTextStyles}>{buttonText}</Text>
      </TouchableHighlight>
      <View style={styles.border} />
      <TextInput style={styles.input} underlineColorAndroid="transparent" {...props} />
    </View>
  );
};

InputWithButton.propTypes = {
  onPress: PropTypes.func,
  buttonText: PropTypes.string,
  editable: PropTypes.bool,
  textColor: PropTypes.string,
};

export default InputWithButton;
