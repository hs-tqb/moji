/**
 * Created by realm on 2017/5/11.
 */

import Homepage from './page/Homepage.vue';
import Checkout from './page/Checkout.vue';
import Receipt from './page/Receipt.vue';
import Faq from './page/Faq.vue';
import Welcome from './page/Welcome.vue';

let routes = [
  {
    path: '/',
    name: 'homepage',
    component: Homepage
  },
  {
    path: '/faq',
    name: 'faq',
    component: Faq
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout
  },
  {
    path: '/receipt',
    name: 'receipt',
    component: Receipt
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: Welcome
  }
];
export default routes;