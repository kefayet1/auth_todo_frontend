import React, { useEffect, useState, useCallback } from "react";
import AuthUser from "../AuthUser";
import axios from "axios";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import TodoTable from "../components/TodoTable";

const Todo = () => {
  const navigator = useNavigate();
  const { getToken, getUser } = AuthUser();
  const [userName, setUserName] = useState("");
  const [img, setImg] = useState("");
  const [todo, setTodo] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [updateFlag, setUpdateFlag] = useState(false);
  const [search, setSearch] = useState();
  const [manuOpen, setManuOpen] = useState(false);
  const token = getToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://127.0.0.1:8000/todo-create", {
      title: todoTitle,
      token: token,
    });
    console.log(response);
    setTodoTitle("");
    setUpdateFlag((prevFlag) => !prevFlag);
  };

  useEffect(() => {
    const userInfo = getUser();

    if (!token) {
      navigator("/login");
    }

    setUserName(userInfo[0].name);
    setImg("http://127.0.0.1:8000/uploads/" + userInfo[0].user_img);
  }, [getToken, getUser, navigator]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/todo-list", {
          token: token,
        });

        setTodo(response.data.todos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [updateFlag]);

  const clearCompletedHandler = async () => {
    const response = await axios.post(
      "http://127.0.0.1:8000/todo-clear-completed",
      {
        token,
      }
    );
    setUpdateFlag((prevFlag) => !prevFlag);
    console.log(response);
  };

  const completeAll = async () => {
    const response = await axios.post(
      "http://127.0.0.1:8000/todo-all-complete",
      {
        token,
      }
    );
    setUpdateFlag((prevFlag) => !prevFlag);
    console.log(response);
  };

  const handleLogout = () =>{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigator("/login");
  }

  console.log(todo);

  return (
    <div className="flex items-center justify-center px-5 py-5">
      <div
        className="bg-gray-100 text-gray-500  shadow-xl overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        <nav className="relative flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-4">
          <div className="flex w-full flex-wrap items-center justify-between px-3">
            {/* <!-- Left elements --> */}
            <div className="flex">
              <img
                className="mr-2"
                src="https://cdn-icons-png.flaticon.com/128/9099/9099135.png"
                style={{ height: "20px" }}
                alt="TE Logo"
                loading="lazy"
              />
              <form className="hidden md:flex">
                <input
                  type="search"
                  className="relative m-0 block w-[250px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-500 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary motion-reduce:transition-none"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="button-addon2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* <!--Search icon--> */}
                <span
                  className="input-group-text flex items-center whitespace-nowrap rounded px-3 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                  id="basic-addon2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </form>
            </div>
            <ul
              className="list-style-none ml-auto flex flex-row pl-0 md:pl-4"
              data-te-navbar-nav-ref
            >
              <li className="px-2" data-te-nav-item-ref>
                <div
                  className="text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 sm:flex [&.active]:text-black/90 dark:[&.active]:text-zinc-400 motion-reduce:transition-none cursor-pointer"
                  href="#"
                  data-te-nav-link-ref
                >
                  <img
                    src={img}
                    className="rounded-full"
                    style={{ height: "25px", width: "25px" }}
                    alt="TE Avatar"
                    loading="lazy"
                  />

                  <div className="ml-2 dropdown dropdown-end" onClick={()=> setManuOpen((manuOpen) => !manuOpen)}>
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost rounded-btn"
                    >
                      {userName}
                    </div>
                    {manuOpen && (
                      <ul tabIndex={0} className="absolute bg-white top-4 left-60 menu dropdown-content z-[100] p-2 shadow  rounded-box w-52 mt-4">
                      <li onClick={handleLogout}>logout</li>
                    </ul>
                    )}
                  </div>
                </div>
              </li>
            </ul>
            {/* <!-- Right elements --> */}
          </div>
        </nav>

        {/* Add todo input field */}

        <div className=" pt-5">
          <form className="" onSubmit={handleSubmit}>
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  enableBackground="new 0 0 50 50"
                  height="25px"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 50 50"
                  width="25px"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <rect fill="none" height="50" width="50" />
                  <line
                    fill="none"
                    stroke="#6366F1"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    x1="9"
                    x2="41"
                    y1="25"
                    y2="25"
                  />
                  <line
                    fill="none"
                    stroke="#6366F1"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    x1="25"
                    x2="25"
                    y1="9"
                    y2="41"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Title"
                required
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                style={{ backgroundColor: "#6366F1" }}
              >
                Add Todo
              </button>
            </div>
          </form>
        </div>

        {/* nav  */}

        <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <button
              className="py-1.5 px-1.5 rounded-lg text-sm font-medium bg-red-500 text-white"
              onClick={clearCompletedHandler}
            >
              Clear completed
            </button>

            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-solid-bg"
            >
              <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                <li>
                  <button
                    className="py-1 px-1 rounded-lg text-sm font-medium border-blue text-blue-500"
                    style={{ border: "2px solid blue" }}
                    onClick={completeAll}
                  >
                    complete all
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* todo table */}

        <div className="max-w-2xl mx-auto ">
          <div className="flex flex-col">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700 ">
                    <TodoTable
                      todos={todo}
                      setUpdateFlag={setUpdateFlag}
                      search={search}
                    />
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
