import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchService from './fetch-service.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from './get-refs.js';
import photoCardTpl from '../templates/photo-card.hbs';

const fetchService = new FetchService();
// const refs = getRefs();

const refs = ({ searchFormRef, gelleryRef, loadMoreBtnRef, galleryWrapperRef } =
  getRefs());

console.log(searchFormRef);
let lightbox;

searchFormRef.addEventListener('submit', onSearch);
loadMoreBtnRef.addEventListener('click', onLoadMore);
HideMarkup(loadMoreBtnRef, 'is-hidden');
HideMarkup(galleryWrapperRef, 'gallery-wrapper__is-hidden');

async function onSearch(evt) {
  HideMarkup(loadMoreBtnRef, 'is-hidden');
  HideMarkup(galleryWrapperRef, 'gallery-wrapper__is-hidden');
  evt.preventDefault();
  clearGalleryList();
  fetchService.query = evt.currentTarget.elements.searchQuery.value;
  fetchService.resetPage();

  if (fetchService.query.trim() === '') {
    return Notify.failure('Please fill the field!');
  }
  const hits = await fetchService.fetchData();
  try {
    if (hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    showMarkup(loadMoreBtnRef, 'is-hidden');
    showMarkup(galleryWrapperRef, 'gallery-wrapper__is-hidden');
    createImgList(hits);
    fetchService.totalHitsMessage();
    lightbox = getlightbox();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  const hits = await fetchService.fetchData();
  try {
    createImgList(hits);
    lightbox.refresh();
    addScroll();
    if (gelleryRef.children.length >= fetchService.totalHits) {
      HideMarkup(loadMoreBtnRef, 'is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
  }
}

function createImgList(hits) {
  gelleryRef.insertAdjacentHTML('beforeend', photoCardTpl(hits));
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

function showMarkup(element, sellector) {
  return element.classList.remove(sellector);
}

function HideMarkup(element, sellector) {
  return element.classList.add(sellector);
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
