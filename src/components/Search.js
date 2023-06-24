import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/bazarSlice";
import { ToastContainer, toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

function Search() {
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [genreQuery, setGenreQuery] = useState("");
  const [publishDateRange, setPublishDateRange] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const batchSize = 10;

  useEffect(() => {
    if (sortOption && searchResults.length > 0) {
      const sortedResults = [...searchResults];

      switch (sortOption) {
        case "title":
          sortedResults.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "author":
          sortedResults.sort((a, b) => a.author.localeCompare(b.author));
          break;
        case "publishDate":
          sortedResults.sort((a, b) =>
            a.publishDate.localeCompare(b.publishDate)
          );
          break;
        default:
          break;
      }

      setSearchResults(sortedResults);
    }
  }, [sortOption]);

  const searchBooks = () => {
    setIsLoading(true);
    let searchUrl = "https://openlibrary.org/search.json?";

    if (titleQuery.trim() !== "") {
      searchUrl += `title=${encodeURIComponent(titleQuery)}&`;
    }

    if (authorQuery.trim() !== "") {
      searchUrl += `author=${encodeURIComponent(authorQuery)}&`;
    }

    if (genreQuery.trim() !== "") {
      searchUrl += `subject=${encodeURIComponent(genreQuery)}&`;
    }
    var cartItems = JSON.parse(localStorage.getItem("cartItems"));

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        let books = data.docs.map((book) => {
          const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
          var available = 10;
          cartItems.map((item) => {
            if (item.id === book.key) {
              available = available - item.quantity;
              console.log(book);
            }
          });
          return {
            index: book.key,
            title: book.title,
            author: book.author_name?.join(", ") || "Unknown Author",
            publishDate: book.publish_date?.[0] || "Unknown Publish Date",
            coverUrl: book.cover_i
              ? coverUrl
              : "https://upittpress.org/wp-content/themes/pittspress/images/no_cover_available.png",
            available: available,
          };
        });

        if (sortOption !== "") {
          switch (sortOption) {
            case "title":
              books.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case "author":
              books.sort((a, b) => a.author.localeCompare(b.author));
              break;
            case "publishDate":
              books.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
              break;
            default:
              break;
          }
        }
        setTotalResults(data.numFound);
        setSearchResults(books);
        setStartIndex(1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Book Search Error:", error);
        setIsLoading(false);
      });
  };

  const generateNextBatch = (data, pageIndex) => {
    const startIndex = pageIndex * batchSize;
    const endIndex = startIndex + batchSize;
    return data.slice(startIndex, endIndex);
  };

  const fetchMoreData = () => {
    const nextPage = startIndex + 1;
    const newData = generateNextBatch(searchResults, nextPage);
    setSearchResults((prevResults) => [...prevResults, ...newData]);
    setStartIndex(nextPage);

    if (newData.length < batchSize) {
      setHasMore(false);
    }
  };

  return (
    <div className="py-10">
      <div className="flex flex-col items-center gap-4 mx-20">
        <span className="w-20 h-[3px] bg-black"></span>
        <div class="grid grid-cols-2 gap-5 min-w-full mx-5">
          <input
            type="text"
            className="form-control"
            class="p-3 mt-8 rounded-xl border shadow-lg"
            placeholder="Search by Title"
            value={titleQuery}
            onChange={(event) => {
              setTitleQuery(event.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            class="p-3 mt-8 rounded-xl border shadow-lg"
            placeholder="Search by Author"
            value={authorQuery}
            onChange={(event) => {
              setAuthorQuery(event.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            class="p-3   rounded-xl border shadow-lg"
            placeholder="Search by Genre"
            value={genreQuery}
            onChange={(event) => {
              setGenreQuery(event.target.value);
            }}
          />
          <input
            type="text"
            className="form-control"
            class="p-3  rounded-xl border shadow-lg"
            placeholder="Search by Publish Date Range (e.g., 2000-2010)"
            value={publishDateRange}
            onChange={(event) => {
              setPublishDateRange(event.target.value);
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="p-3   rounded-xl border shadow-lg"
            onClick={searchBooks}
            disabled={isLoading}
          >
            Search
          </button>
          <div className="p-3 flex justify-end rounded-xl border shadow-lg">
            <select
              className="form-select"
              value={sortOption}
              onChange={(event) => {
                setSortOption(event.target.value);
              }}
            >
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publishDate">Publish Date</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="p-4 mt-4">
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={searchResults.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more items to load</p>}
        >
          <div className="w-60 ml-20">
            <p className="p-3 mt-8 rounded-xl border w-200 shadow-lg">
              Total search results: {totalResults}
            </p>
          </div>
          <div className="max-w-screen-xl mx-auto grid grid-cols-5 gap-10 py-10">
            {searchResults.map((book, index) => (
              <div key={index} className="w-full relative group">
                <div className="w-full h-90 cursor-pointer overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 duration-500"
                    src={book.coverUrl}
                    alt="productImg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://upittpress.org/wp-content/themes/pittspress/images/no_cover_available.png";
                    }}
                  />
                </div>
                <div className="w-full border-[1px] px-2 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-titleFont text-base font-bold">
                        {book.title}
                      </h2>
                    </div>
                    <div className="text-sm relative w-28 flex justify-end overflow-hidden">
                      <div className="flex gap-2 transform group-hover:translate-x-24 transition-transform duration-500">
                        <p className="font-semibold text-sm">
                          {book.available} left
                        </p>
                      </div>
                      <p
                        onClick={() => {
                          dispatch(
                            addToCart({
                              id: book.index,
                              title: book.title,
                              image: book.coverUrl,
                              price: 50,
                              quantity: 1,
                              description: book.author,
                            })
                          );
                          toast.success(`${book.title} is added`);
                        }}
                        className="absolute z-20 w-[50px] text-gray-500 hover:text-gray-900 flex items-center gap-1 top-0 transform -translate-x-32 group-hover:translate-x-0 transition-transform cursor-pointer duration-500"
                      >
                        rent
                        <span>
                          <BsArrowRight />
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>{book.author}</p>
                  </div>
                  <div>
                    <p className="text-sm">{book.publishDate}</p>
                  </div>
                </div>

                <ToastContainer
                  position="top-left"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default Search;
