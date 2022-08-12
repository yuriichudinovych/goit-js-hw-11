 export default function fetchImg (category) {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '29162524-01f0dd46893302e996c3171e6';


    const options = new URLSearchParams({
      key: KEY,
      q: category,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    return fetch(`${BASE_URL}?${options}`)
      .then(r => {
        if(!r.ok) {
          throw new Error(r.status)
        }
        return r.json();
      })
  }