import axios from 'axios';
import { API_HOST } from '../config';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.limit = 40;
  }

  async getPicture() {
    const response = await axios.get(
      `${API_HOST}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.limit}&page=${this.page}`,
    );
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}