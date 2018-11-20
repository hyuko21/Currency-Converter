import React, { Component } from 'react';
import { KeyboardAvoidingView, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Buttons';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';
import { connectAlert } from '../components/Alert';

import { swapCurrency, changeCurrencyAmount, getInitialConversion } from '../actions/currency';

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    baseCurrency: PropTypes.string,
    quoteCurrency: PropTypes.string,
    amount: PropTypes.number,
    conversionRate: PropTypes.number,
    isFetching: PropTypes.bool,
    lastConvertedDate: PropTypes.object,
    primaryColor: PropTypes.string,
    alertWithType: PropTypes.func,
    error: PropTypes.string,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getInitialConversion());
  }

  componentWillReceiveProps(nextProps) {
    const { error, alertWithType } = this.props;
    if (nextProps.error && nextProps.error !== error) alertWithType('error', 'Error', nextProps.error);
  }

  handleChangeText = (text) => {
    const { dispatch } = this.props;
    dispatch(changeCurrencyAmount(text));
  };

  handlePressBaseCurrency = () => {
    const { navigation } = this.props;
    navigation.navigate('CurrencyList', {
      title: 'Base Currency',
      type: 'base',
    });
  };

  handlePressQuoteCurrency = () => {
    const { navigation } = this.props;
    navigation.navigate('CurrencyList', {
      title: 'Quote Currency',
      type: 'quote',
    });
  };

  handleSwapCurrency = () => {
    const { dispatch } = this.props;
    dispatch(swapCurrency());
  };

  handleOptionPress = () => {
    const { navigation } = this.props;
    navigation.navigate('Options');
  };

  render() {
    const {
      baseCurrency,
      quoteCurrency,
      amount,
      conversionRate,
      isFetching,
      lastConvertedDate,
      primaryColor,
    } = this.props;

    let quotePrice = (amount * conversionRate).toFixed(2);

    if (isFetching) quotePrice = '...';

    return (
      <Container backgroundColor={primaryColor}>
        <StatusBar translucent={false} barStyle="light-content" />
        <Header onPress={this.handleOptionPress} />
        <KeyboardAvoidingView behavior="padding">
          <Logo tintColor={primaryColor} />
          <InputWithButton
            buttonText={baseCurrency}
            onPress={this.handlePressBaseCurrency}
            defaultValue={amount.toString()}
            keyboardType="numeric"
            onChangeText={this.handleChangeText}
            textColor={primaryColor}
          />
          <InputWithButton
            buttonText={quoteCurrency}
            onPress={this.handlePressQuoteCurrency}
            editable={false}
            value={quotePrice}
            textColor={primaryColor}
          />
          <LastConverted
            base={baseCurrency}
            quote={quoteCurrency}
            date={lastConvertedDate}
            conversionRate={conversionRate}
          />
          <ClearButton text="Reverse Currencies" onPress={this.handleSwapCurrency} />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    baseCurrency, quoteCurrency, amount, error,
  } = state.currency;
  const conversionSelector = state.currency.conversions[baseCurrency] || {};
  const rates = conversionSelector.rates || {};
  const { primaryColor } = state.theme;

  return {
    baseCurrency,
    quoteCurrency,
    amount,
    conversionRate: rates[quoteCurrency] || 0,
    isFetching: conversionSelector.isFetching,
    lastConvertedDate: conversionSelector.date ? new Date(conversionSelector.date) : new Date(),
    primaryColor,
    error,
  };
};

export default connect(mapStateToProps)(connectAlert(Home));
