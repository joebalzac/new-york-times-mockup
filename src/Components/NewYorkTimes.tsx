import React, { useEffect, useState } from "react";
import useData from "../Hooks/useData";

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
}

const NewYorkTimes = () => {
  const [stories, setStories] = useState<Times[]>([]);
  const [filteredStories, setFilteredStories] = useState<Times[]>([]);
  const [selectedStory, setSelectedStory] = useState<Times | null>(null);
  const [selectedStoriesIds, setSelectedStoriesIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data, error, isLoading } = useData<Times>("topstories/v2/home.json");

  useEffect(() => {
    if (data) {
      setStories(data);
      setFilteredStories(data);
    } else {
      if (error) {
        ("An unknown error has occured on home page");
      }
    }
  }, [data]);

  console.log("NewYorkTimes", data);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredStories(
        stories.filter((story) => story.subsection === selectedCategory)
      );
    } else {
      setFilteredStories(stories);
    }
  }, [selectedCategory, stories]);

  const handleSelectedStory = (story: Times) => {
    setSelectedStory(story);
  };

  const handleDeleteStory = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    setStories(stories.filter((story) => story.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setSelectedStoriesIds(
      e.target.checked
        ? [...selectedStoriesIds, id]
        : selectedStoriesIds.filter((storyId) => storyId !== id)
    );
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
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="">All Categories</option>
              {[...new Set(stories.map((story) => story.subsection))].map(
                (category, index) =>
                  category ? (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ) : null
              )}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-6">
              {filteredStories.map((story, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectedStory(story)}
                  className="bg-white rounded-xl shadow-lg p-6 flex items-start space-x-4 cursor-pointer hover:shadow-xl transition"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(e, story.id)}
                  />
                  <div className="flex-1">
                    {story.multimedia.length > 0 && (
                      <img
                        src={story.multimedia[0]?.url}
                        alt={story.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h2 className="text-xl font-semibold">{story.title}</h2>
                    <p className="text-gray-500 text-sm mt-2">
                      {story.published_date}
                    </p>
                    <p className="uppercase text-gray-600 text-xs font-medium">
                      {story.subsection}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteStory(e, story.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✖
                  </button>
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
        </div>
      )}
    </div>
  );
};

export default NewYorkTimes;
