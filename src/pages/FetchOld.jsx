import { useEffect, useState } from "react";
import { fetchPosts } from "../api/api";

export const FetchOld = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState();

  const getPostsData = async () => {
    try {
      const res = await fetchPosts();

      res.status === 200 ? setPosts(res.data) : [];
      setIsLoading(false); // turn off loading state
    } catch (error) {
      console.log(error);
      setIsError(true); // set error state
      setIsLoading(false); // turn off loading state
      return [];
    }
  };

  useEffect(() => {
    getPostsData();
  }, []);

  if (isLoading) return <h1>Loading.....</h1>;
  if (isError) return <p>something went wrong</p>;
  return (
    <div>
      <h1>Fetch-With-Old</h1>
      <ul className="section-accordion">
        {posts.map((curElement) => {
          const { id, title, body } = curElement;
          return (
            <li key={id}>
              <p>{title}</p>
              <p>{body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
