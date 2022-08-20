import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import NewsApiService from '../js/helpers/axiosGetGallery';
import { renderSingleCountryInfo } from '../js/gallery/galleryUI';
import LoadMoreBtn from '../js/components/load-more-btn';

import 'simplelightbox/dist/simple-lightbox.min.css';
import '../sass/main.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchFormInput: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
};

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});
function onSimpleLightbox() {
  let galery = new SimpleLightbox('.gallery a');
  return galery;
}

refs.searchForm.addEventListener('submit', onSearchValue);
loadMoreBtn.refs.button.addEventListener('click', onSearchMore);

async function onSearchValue(e) {
  e.preventDefault();

  newsApiService.query = refs.searchFormInput.value;

  if (newsApiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  try {
    newsApiService.resetPage();
    const items = await newsApiService.getPicture();

    if (items.data.totalHits >= 1) {
      Notiflix.Notify.success(`Hooray! We found ${items.data.totalHits} images.`);
    }
    loadMoreBtn.hide();
    clearGalleryContainer();
    showGalletyItems(items.data.hits);

    if (items.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      loadMoreBtn.hide();
      return;
    }
  } catch (error) {
    console.log('Error');
  }
  loadMoreBtn.show();
}

async function onSearchMore() {
  newsApiService.incrementPage();
  const items = await newsApiService.getPicture();
  const limitPage = items.data.totalHits / newsApiService.limit;

  if (newsApiService.page > limitPage && limitPage >= 1) {
    return infoNotify();
  } else if (newsApiService.page === 2 && newsApiService.page > limitPage) {
    return infoNotify();
  }
  onSimpleLightbox().refresh();
  showGalletyItems(items.data.hits);
}

function showGalletyItems(items) {
  const cards = items.map(item => renderSingleCountryInfo(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', cards);

  onSimpleLightbox();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function infoNotify() {
  loadMoreBtn.hide();
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}