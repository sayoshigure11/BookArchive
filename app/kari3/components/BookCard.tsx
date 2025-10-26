type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  purchased: boolean;
  prices: {
    place: string;
    values: number[];
  }[];
};
type Props = { book: Book };

export const BookCard: React.FC<Props> = ({ book }) => {
  const { title, author, coverUrl, rating, purchased, prices } = book;
  const allPrices = prices.flatMap((p) => p.values);
  const minPrice = Math.min(...allPrices);
  const mainPlace = prices[0]?.place ?? "-";

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl shadow-sm items-center relative">
      <img
        src={coverUrl}
        alt={title}
        className="w-16 h-24 object-cover rounded-md flex-shrink-0"
      />

      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-gray-500 text-xs">{author}</p>

        <div className="text-yellow-500 text-xs mt-1">
          {"⭐".repeat(rating)}{" "}
          <span className="text-gray-400">{`(${rating})`}</span>
        </div>

        {/* <p className="text-xs text-gray-700 mt-1 truncate">
          最安 ¥{minPrice}（{mainPlace}ほか{prices.length}件）
        </p> */}

        <div className="flex flex-wrap gap-1 mt-1">
          {book.prices.map((price, i) => (
            <div
              key={i}
              className="bg-amber-100 rounded-xl py-1 px-2 flex items-center gap-x-2"
            >
              <div className="flex flex-col gap-y-1px">
                {price.values.map((value, index) => (
                  <div className="text-[10px]" key={index}>
                    ¥{value}
                  </div>
                ))}
              </div>
              <p>|</p>
              <div className="text-[10px]">{price.place}</div>
            </div>
          ))}
        </div>

        {purchased && (
          <span className="bg-green-600  text-[10px] absolute bottom-3 left-3 w-16">
            <p className="text-white text-center">購入済み</p>
          </span>
        )}
      </div>
    </div>
  );
};
