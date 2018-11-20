import {
  takeEvery, select, call, put,
} from 'redux-saga/effects';

import {
  SWAP_CURRENCY,
  CHANGE_BASE_CURRENCY,
  GET_INITIAL_CONVERSION,
  CONVERSION_RESULT,
  CONVERSION_ERROR,
} from '../actions/currency';

const getLatestRate = currency => fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`);

function* fetchLatestConversionRates(action) {
  try {
    let { currency } = action;
    if (!currency) currency = yield select(state => state.currency.baseCurrency);

    const response = yield call(getLatestRate, currency);
    const result = yield response.json();

    if (result.error) yield put({ type: CONVERSION_ERROR, error: result.error });
    else yield put({ type: CONVERSION_RESULT, result });
  } catch (err) {
    yield put({ type: CONVERSION_ERROR, error: err.message });
  }
}

export default function* rootSaga() {
  yield takeEvery(GET_INITIAL_CONVERSION, fetchLatestConversionRates);
  yield takeEvery(SWAP_CURRENCY, fetchLatestConversionRates);
  yield takeEvery(CHANGE_BASE_CURRENCY, fetchLatestConversionRates);
}
