import React from "react";

const Pagination = ({
  page,
  totalPage,
  list,
}: {
  page: string | null;
  totalPage: number | undefined;
  list: string | null;
}) => {
  const [input, setInput] = React.useState("");

  const nextPage = () => {
    if (Number(page) >= Number(totalPage)) return;

    const params = new URLSearchParams();
    list && params.append("list", list);
    params.append("page", (Number(page) + 1).toString());

    window.location.search = params.toString();
  };

  const prevPage = () => {
    if (Number(page) <= 1) return;

    const params = new URLSearchParams();
    list && params.append("list", list);
    params.append("page", (Number(page) - 1).toString());

    window.location.search = params.toString();
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    list && params.append("list", list);
    params.append("page", input?.toString() ?? "1");

    window.location.search = params.toString();
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex justify-center items-center gap-3 flex-1">
        <button
          onClick={prevPage}
          className="bg-accent-brighter hover:bg-accent-brighter/50 transition font-[500] text-white px-4 py-2 rounded-lg"
        >
          Prev
        </button>
        <p className="text-center text-sm">
          Page {page} of {totalPage}
        </p>
        <button
          onClick={nextPage}
          className="bg-accent-brighter hover:bg-accent-brighter/50 transition font-[500] text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>

      <form
        onSubmit={submit}
        className="flex flex-col gap-1 text-xs font-[500] max-w-fit justify-end items-end"
      >
        Jump to page
        <input
          type="number"
          max={totalPage}
          maxLength={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="max-w-[60px] bg-transparent border border-accent-brighter outline-none ring-0 h-[30px] px-3"
        />
      </form>
    </div>
  );
};

export default Pagination;
