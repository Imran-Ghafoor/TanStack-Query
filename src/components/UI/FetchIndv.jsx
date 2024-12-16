import { useQuery } from "@tanstack/react-query";
import { fetchInvPost } from "../../api/api";
import { NavLink, useParams } from "react-router-dom";

export const FetchIndv = () => {
  const { id } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["post", id], /// suppose use state
    queryFn: () => fetchInvPost(id), // useEffect
  });
  console.log(data);
  if (isPending) return <h1>Loading.....</h1>;
  if (isError) return <p> Error:{error.message || "something went wrong"} </p>;
  return (
    <>
      <div className="section-accordion">
        <h1>Post ID Number - {id} </h1>
        <div>
          <p>ID: {data.id}</p>
          <p>Title: {data.title}</p>
          <p>Body: {data.body}</p>
        </div>
        <NavLink to={"/rq"}>
          <button>Go Back</button>
        </NavLink>
      </div>
    </>
  );
};
