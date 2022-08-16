import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchService from './fetch-service.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getREfs from './get-refs.js';
const refs = getREfs();

const fetchService = new FetchService();
let lightbox;

refs.searchFormRef.addEventListener('submit', onSearch);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);
HideLoadMore();

function onSearch(evt) {
  HideLoadMore();
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

      showLoadMore();
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
      if (refs.gelleryRef.children.length >= fetchService.totalHits) {
        HideLoadMore();
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
  refs.gelleryRef.insertAdjacentHTML('beforeend', markup.join(''));
}

function clearGalleryList() {
  refs.gelleryRef.innerHTML = '';
}

function getlightbox() {
  return new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}

function showLoadMore() {
  return refs.loadMoreBtnRef.classList.remove('is-hidden');
}

function HideLoadMore() {
  return refs.loadMoreBtnRef.classList.add('is-hidden');
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
