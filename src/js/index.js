import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchImg from './fetchImg.js';

const searchFormRef = document.querySelector('#search-form');
const gelleryRef = document.querySelector('.gallery');



searchFormRef.addEventListener('submit', e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  const category = searchQuery.value;

  if (category.trim() === "" ) {
    return Notify.failure("Please fill the field!");
  }

 

  fetchImg(category).then(({hits}) => {
    console.log(hits)

    if(hits.length === 0) {
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    createImgList(hits)}).catch(error => {
console.log(error)
      
    });
});



function createImgList(cards) {
console.log(cards.length)
  const markup = cards.map(card => {
    return `<div class="photo-card">
    <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${card.likes}</b>
      </p>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
      </p>
    </div>
  </div>`
  })
 gelleryRef.innerHTML = markup.join('');
}