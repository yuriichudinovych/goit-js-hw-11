import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';

export default class FetchService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    this.flag = false;
  }
  fetchData() {
    const options = new URLSearchParams({
      key: '29162524-01f0dd46893302e996c3171e6',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    return fetch(`${BASE_URL}?${options}`)
      .then(r => {
        if (!r.ok) {
          throw new Error(r.status);
        }
        return r.json();
      })
      .then(data => {
        this.incrementPage();
        if (data.hits.length === 0) {
          this.flag = true;
          return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        this.totalHits = data.totalHits;
        return data.hits;
      });
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
