import { useEffect, useState } from "react";
import useData from "../Hooks/useData";
import SearchBar from "./SearchBar";

interface Times {
  id: string;
  title: string;
  abstract: string;
  type: string;
  url: string;
  uri: string;
  published_date: string;
  subsection: string;
  multimedia: [{ url: string }];
  snippet: string;
  pub_date: string;
}

const NewYorkTimes = () => {
  const [stories, setStories] = useState<Times[]>([]);
  const [filteredStories, setFilteredStories] = useState<Times[]>([]);
  const [selectedStory, setSelectedStory] = useState<Times | null>(null);
  const [selectedStoriesIds, setSelectedStoriesIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);


  const { data, error, isLoading } = useData<Times>(
    searchTerm
      ? `search/v2/articlesearch.json?q=${searchTerm}&page=${page}`
      : "topstories/v2/home.json"
  );

  useEffect(() => {
    if (data) {
      setStories(data);
      setFilteredStories(data);
    } else if (error) {
      console.error("An unknown error has occurred on home page");
    }
  }, [data]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredStories(
        stories.filter((story) => story.subsection === selectedCategory)
      );
    } else {
      setFilteredStories(stories);
    }
  });

  const handleSearch = () => {
    if (query.trim() === "") {
      setSearchTerm("");
    } else {
      setSearchTerm(query.trim());
    }
  };

  const handleNextPage = () => {
    if (stories.length > 0) {
      setPage((nextPage) => nextPage + 1);
      console.log("This is firing");
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      console.log("this is minus firing");
    }
  };

  return (
    <div className="p-8 font-serif text-gray-900 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-center border-b pb-4">
        The New York Times
      </h1>

      {isLoading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-6 border-b border-gray-300 pb-4">
            <label className="text-xl font-semibold text-gray-800">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-400 bg-white text-gray-900 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              {[...new Set(stories.map((story) => story.subsection))].map(
                (category, index) =>
                  category ? (
                    <option
                      className="capitalize font-semibold"
                      key={index}
                      value={category}
                    >
                      {category}
                    </option>
                  ) : null
              )}
            </select>
            <SearchBar
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-6">
              {filteredStories.map((story, index) => (
                <li
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4 cursor-pointer hover:shadow-xl transition"
                  onClick={() => setSelectedStory(story)}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setSelectedStoriesIds(
                        e.target.checked
                          ? [...selectedStoriesIds, story.id]
                          : selectedStoriesIds.filter(
                              (storyId) => storyId !== story.id
                            )
                      )
                    }
                  />
                  <div className="flex-1">
                    <img
                      src={
                        searchTerm
                          ? `https://static01.nyt.com/${story.multimedia[0]?.url}`
                          : story.multimedia[0]?.url
                      }
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />

                    <h2 className="text-xl font-semibold">
                      {searchTerm ? story.snippet : story.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                      {searchTerm ? story.pub_date : story.published_date}
                    </p>
                    <p className="uppercase text-gray-600 text-xs font-medium">
                      {story.subsection}
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStories(stories.filter((s) => s.id !== story.id));
                    }}
                  >
                    ✖
                  </button>
                  <BsCopy />
                </li>
              ))}
            </ul>

            {selectedStory ? (
              <div className="bg-white shadow-lg rounded-xl p-6 sticky top-16">
                <h2 className="text-3xl font-bold mb-4">
                  {selectedStory.title}
                </h2>
                <p className="text-gray-700 text-lg">
                  {selectedStory.abstract}
                </p>
                <a
                  href={selectedStory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 mt-4 inline-block hover:underline text-lg font-medium"
                >
                  Read full article →
                </a>
              </div>
            ) : (
              <div className="text-gray-500 text-lg italic">
                Select a story to read more.
              </div>
            )}
          </div>
          {searchTerm && (
            <div>
              {page > 1 && (
                <button
                  className="bg-gray-200 text-gray-900 text-1xl px-4 py-2 font-semibold my-8 cursor-pointer"
                  onClick={handlePrevPage}
                >
                  ← Prev Page
                </button>
              )}

              <button
                className="bg-gray-900 text-white text-1xl px-4 py-2 font-semibold my-8 cursor-pointer"
                onClick={handleNextPage}
              >
                Next Page →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewYorkTimes;
