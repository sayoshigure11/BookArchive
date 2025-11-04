export type BookLocation = {
  place: string;
  prices: number[];
};

export type Book = {
  id: string;
  isbn: string;
  title: string;
  // author: string;
  author: {
    kanji: string,
    yomi:string
  }[];
  publisher: string;
  coverImage: string;
  expectation: number;
  purchased: boolean;
  locations: BookLocation[];
  createdAt: number;
};

export type FilterOptions = {
  searchQuery: string;
  sortBy: 'title' | 'author' | 'expectation' | 'date';
  showPurchased: 'all' | 'purchased' | 'unpurchased';
  selectedLocations: string[];
  selectedPrices: number[];
};
