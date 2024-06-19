import { usePathname, useSearchParams } from "next/navigation";

const useCustomParams = () => {
  const page = useSearchParams().get("page") || "1";
  const search = useSearchParams().get("search");
  const list = useSearchParams().get("list");
  const movieId = usePathname().split("/")[2];
  const path = usePathname();

  return {
    page,
    search,
    movieId,
    list,
    path,
  };
};

export default useCustomParams;
