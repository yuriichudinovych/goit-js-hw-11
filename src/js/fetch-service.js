import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/';
const API_KEY = '29162524-01f0dd46893302e996c3171e6';

export default class FetchService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    this.flag = false;
  }

  async fetchData() {
    const options = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    const url = `${BASE_URL}api/?${options}`;
    const response = await fetch(url);
    const data = await response.json('');

    this.incrementPage();
    this.totalHits = data.totalHits;
    return data.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  totalHitsMessage() {
    return Notify.success(`Hooray! We found ${this.totalHits} images.`);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
