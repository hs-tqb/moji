/**
 * Created by meathill on 2017/5/17.
 */

import ActionTypes from './action-types';
import MutationTypes from './mutation-types';
import Alfred from '../alfred';
import { formatDate, toDate } from '../utils';

export default {
  [ActionTypes.FETCH_DEAL] ({commit, state}) {
    state.isFetching = true;
    let end = toDate(state.end);
    end.setDate(end.getDate() + 1);
    end = formatDate(end);
    return Alfred.getContract(state.city_id, state.start, end)
      .then(json => {
        commit(MutationTypes.RESET_PRODUCT_LIST, json);
      });
  }
}