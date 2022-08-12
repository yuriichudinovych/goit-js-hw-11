const searchFormRef = document.querySelector('#search-form');
const containerRef = document.querySelector('.container');

const BASE_URL = 'https://pixabay.com';
const KEY = '29162524-01f0dd46893302e996c3171e6';

searchFormRef.addEventListener('submit', e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  console.log(searchQuery.value);
  const category = searchQuery.value;

  const searchParams = new URLSearchParams({
    key: KEY,
    q: category,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`https://pixabay.com/api/?${searchParams}`)
    .then(r => {
      return r.json();
    })
    .then(data => {
      console.log(data.hits);
      const imgArray = data.hits.map(el => {
        console.log(el);
        return `<img src="${el.webformatURL}" alt="${category}">`;
      });
      containerRef.innerHTML = imgArray.join('');
    })
    .catch(error => {
      console.log('dsfsldkfjdsklfj');
    });
});
