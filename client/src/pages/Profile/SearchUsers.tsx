import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getAuthHeaders } from "./types/api";
import { UserInfo } from "./types/UserInfo";
import Avatar from "./Avatar";
import { CardWrapper } from "./types/ui";

/**
 * Username-search component.
 * Sends a POST to `/searchUsers` and shows the single match (if any)
 * in a tiny pop-up list under the header.
 */
const SearchUsers: React.FC = () => {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [isSearching,   setIsSearching]   = useState(false);

  /* -------------------------------------------------------- helpers */

  /** Run search request */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Enter a username to search");
      return;
    }

    try {
      setIsSearching(true);

      const res = await fetch("http://localhost:3000/searchUsers", {
        method : "POST",
        headers: {
          "Content-Type" : "application/json",
          ...getAuthHeaders(),
        },
        body   : JSON.stringify({ username: searchQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Search error");

      if (data.hasUser) {
        const u = data.hasUser;
        const found: UserInfo = {
          id      : String(u.id),
          username: u.username,
          email   : u.email    || "",
          name    : u.name     || "",
          avatar  :
            u.image && u.image_type
              ? `data:${u.image_type};base64,${u.image}`
              : "/prof_img/avatar1.png",
          password: "",
          wins    : u.wins   || 0,
          losses  : u.losses || 0,
          online  : !!u.online,
          history : [],
        };
        setSearchResults([found]);
        toast.success("User found!");
      } else {
        setSearchResults([]);
        toast.error("User not found");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error searching for user",
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /** Clear input & results */
  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  /** Click on a result just closes the pop-up */
  const handleUserClick = () => setSearchResults([]);

  /* ---------------------------------------------------------- render */
  return (
    <div
      className="
        flex
        items-center
        gap-4
      "
    >
      {/* input + buttons */}
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            px-3
            py-1
            rounded-lg
            bg-gray-800
            text-white
            border
            border-gray-600
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-800
            text-sm
          "
        />

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="
            px-3
            py-1
            rounded-lg
            bg-indigo-950
            hover:bg-indigo-800
            text-white
            text-sm
            font-medium
            transition
            duration-300
            disabled:opacity-50
          "
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className="
            px-3
            py-1
            rounded-lg
            bg-gray-600
            hover:bg-gray-700
            text-white
            text-sm
            font-medium
            transition
            duration-300
          "
        >
          Clear
        </button>
      </div>

      {/* pop-up results */}
      {searchResults.length > 0 && (
        <div
          className="
            absolute
            top-16
            right-8
            z-50
            bg-gray-900
            rounded-lg
            p-4
            max-h-96
            overflow-y-auto
          "
        >
          {searchResults.map((u) => (
            <CardWrapper
              key={u.id}
              onClick={handleUserClick}
              className="
                cursor-pointer
                hover:bg-gray-800
                transition
                duration-200
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Avatar
                  user={{ username: u.username, avatar: u.avatar }}
                  className="
                    w-8
                    h-8
                  "
                />
                <span
                  className="
                    font-bold
                    text-base
                  "
                >
                  {u.username}
                </span>
                <span
                  className={`
                    text-sm
                    ${u.online ? "text-green-400" : "text-gray-400"}
                  `}
                >
                  {u.online ? "Online" : "Offline"}
                </span>
              </div>
            </CardWrapper>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
