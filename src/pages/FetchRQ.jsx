import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, fetchPosts, updatePost } from "../api/api";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export const FetchRQ = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const queryClient = useQueryClient();
  // const getPostsData = async () => {
  //   try {
  //     const res = await fetchPosts();
  //     console.log(res);
  //     return res.status === 200 ? res.data : [];
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // };

  // useEffect(() => {
  //   getPostsData();
  // }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber], /// suppose use state
    queryFn: () => fetchPosts(pageNumber), // useEffect
    placeholderData: keepPreviousData,

    // staleTime: 5000,
    // refetchInterval: 1000,
    // refetchIntervalInBackground: true,
  });

  //! mutaion function to Delete the post
  const deleteMutaion = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["posts", pageNumber], (curElement) => {
        return curElement?.filter((post) => post.id !== id);
      });
    },
  });

  //! mutaion function to Update the post
  const updateMutaion = useMutation({
    mutationFn: (id) => updatePost(id),
    onSuccess: (apiData, postId) => {
      console.log(apiData, postId);

      queryClient.setQueryData(["posts", pageNumber], (postData) => {
        // queryClient is used to access to cache_data
        return postData.map((curPost) => {
          return curPost.id === postId
            ? { ...curPost, title: apiData.data.title, body: apiData.data.body }
            : curPost;
        });
      });
    },
  });

  if (isPending) return <h1>Loading.....</h1>;
  if (isError) return <p> Error:{error.message || "something went wrong"} </p>;
  return (
    <div>
      <h1>Fetch with React Query</h1>
      <ul className="section-accordion">
        {data?.map((curElement) => {
          const { id, title, body } = curElement;
          return (
            <li key={id}>
              <NavLink to={`/rq/${id}`}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{body}</p>
              </NavLink>
              <button onClick={() => deleteMutaion.mutate(id)}>Delete</button>
              <button onClick={() => updateMutaion.mutate(id)}>Update</button>
            </li>
          );
        })}
      </ul>
      <div className="pagination-section container">
        <button
          disabled={pageNumber === 0 ? true : false}
          onClick={() => setPageNumber((prev) => prev - 3)}
        >
          prev
        </button>
        <h2> {pageNumber / 3 + 1} </h2>
        <button onClick={() => setPageNumber((prev) => prev + 3)}>Next</button>
      </div>
    </div>
  );
};
