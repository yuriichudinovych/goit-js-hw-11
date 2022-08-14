import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchService from './fetch-service.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('#search-form');
const gelleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

const fetchService = new FetchService();
console.log(fetchService.totalHits);

searchFormRef.addEventListener('submit', onSearch);
loadMoreBtnRef.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();
  clearGalleryList();
  fetchService.query = evt.currentTarget.elements.searchQuery.value;
  fetchService.resetPage();
  if (fetchService.query.trim() === '') {
    return Notify.failure('Please fill the field!');
  }

  fetchService
    .fetchData()
    .then(hits => {
      createImgList(hits);
      fetchService.totalHitsMessage();
      lightbox();
    })
    .catch(error => {
      console.log(error);
    });
}

function onLoadMore() {
  fetchService
    .fetchData()
    .then(hits => {
      createImgList(hits);
    })
    .catch(error => {
      console.log(error);
    });
}

function createImgList(cards) {
  const markup = cards.map(card => {
    return `<div class="photo-card">
    <a href='${card.largeImageURL}' >
    <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${card.likes}
      </p>
      <p class="info-item">
        <b>Views </b>
        ${card.views}
      </p>
      <p class="info-item">
        <b>Comments </b>
        ${card.comments}
      </p>
      <p class="info-item">
        <b>Downloads </b>
        ${card.downloads}
      </p>
    </div>
  </div>
  `;
  });
  gelleryRef.insertAdjacentHTML('beforeend', markup.join(''));
}
refreshlightbox(lightbox());

function clearGalleryList() {
  gelleryRef.innerHTML = '';
}
function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
  return lightbox;
}
