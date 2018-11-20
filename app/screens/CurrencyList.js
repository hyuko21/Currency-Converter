import React, { Component } from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ListItem, Separator } from '../components/List';
import currencies from '../data/currencies';
import { changeBaseCurrency, changeQuoteCurrency } from '../actions/currency';

class CurrencyList extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    baseCurrency: PropTypes.string,
    quoteCurrency: PropTypes.string,
    primaryColor: PropTypes.string,
  };

  handlePress = (currency) => {
    const { navigation, dispatch } = this.props;
    const { type } = navigation.state.params;

    if (type === 'base') dispatch(changeBaseCurrency(currency));
    else if (type === 'quote') dispatch(changeQuoteCurrency(currency));

    navigation.pop();
  };

  render() {
    const {
      navigation, baseCurrency, quoteCurrency, primaryColor,
    } = this.props;
    const { type } = navigation.state.params;

    const currentCurrency = type === 'base' ? baseCurrency : quoteCurrency;

    return (
      <View>
        <StatusBar translucent={false} barStyle="default" />
        <FlatList
          data={currencies}
          renderItem={({ item }) => (
            <ListItem
              text={item}
              selected={item === currentCurrency}
              onPress={() => this.handlePress(item)}
              iconBackground={primaryColor}
            />
          )}
          keyExtractor={item => item}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.currency.baseCurrency,
  quoteCurrency: state.currency.quoteCurrency,
  primaryColor: state.theme.primaryColor,
});

export default connect(mapStateToProps)(CurrencyList);
