import { combineReducers } from 'redux';

import currency from './currency';
import theme from './theme';

export default combineReducers({
  currency,
  theme,
});
