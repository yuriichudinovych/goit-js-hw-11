export default function getRefs() {
  return {
    searchFormRef: document.querySelector('#search-form'),
    gelleryRef: document.querySelector('.gallery'),
    loadMoreBtnRef: document.querySelector('[data-id="load-more"]'),
    galleryWrapperRef: document.querySelector('.gallery-wrapper'),
  };
}
