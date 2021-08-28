import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');

import countryCardTp from '../templates/country-card.hbs';
import API from './api';
import getRefs from './get-refs';

const refs = getRefs();

refs.searchForm.addEventListener('input', debounce(onSearch, 1000));

function clearInput() {
  refs.cardCont.innerHTML = '';
  refs.inputText.innerHTML = '';
  refs.list.innerHTML = '';
}

function onSearch(e) {
  e.preventDefault();
  const searchQuery = e.target.value.trim();
  if (!searchQuery) {
    return;
  }
  clearInput();
  API.fetchCountry(searchQuery).then(renderCountry).catch(enterLetters);
}
function enterLetters() {
  error({
    text: '← Oops something wrong on your side',
    delay: 2000,
  });
}
function renderCountry(country) {
  if (country.length < 2) {
    const markup = countryCardTp(country);
    refs.cardCont.innerHTML = markup;
  }
  if (country.length >= 2 && country.length <= 10) {
    clearInput();
    country.map(country => {
      refs.list.insertAdjacentHTML('beforeEnd', `<li>${country.name}</li>`);
    });
  }
  if (country.length > 10) {
    clearInput();
    onFatchError();
  }
}
function onFatchError() {
  error({
    text: 'Specify more accurate country name',
    delay: 2000,
  });
}
