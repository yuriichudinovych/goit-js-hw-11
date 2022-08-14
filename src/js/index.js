import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchService from './fetch-service.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('#search-form');
const gelleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('[data-id="load-more"]');

let lightbox;

const fetchService = new FetchService();

searchFormRef.addEventListener('submit', onSearch);
loadMoreBtnRef.addEventListener('click', onLoadMore);
changeHiddenLoadMore();
function onSearch(evt) {
  loadMoreBtnRef.classList.add('is-hidden');
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
      lightbox = getlightbox();

      changeHiddenLoadMore();
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
      lightbox.refresh();
      addScroll();
      if (gelleryRef.children.length >= fetchService.totalHits) {
        loadMoreBtnRef.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function createImgList(cards) {
  const markup = cards.map(card => {
    return `<div class="photo-card">
    <a class="photo-card-link" href='${card.largeImageURL}' >
    <img class="card-img" src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b><br>
        ${card.likes}
      </p>
      <p class="info-item">
        <b>Views </b><br>
        ${card.views}
      </p>
      <p class="info-item">
        <b>Comments </b><br>
        ${card.comments}
      </p>
      <p class="info-item">
        <b>Downloads </b><br>
        ${card.downloads}
      </p>
    </div>
  </div>
  `;
  });
  gelleryRef.insertAdjacentHTML('beforeend', markup.join(''));
}

function clearGalleryList() {
  gelleryRef.innerHTML = '';
}
function getlightbox() {
  return new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}

function changeHiddenLoadMore() {
  return loadMoreBtnRef.classList.toggle('is-hidden');
}

function addScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 11,
    behavior: 'smooth',
  });
}
