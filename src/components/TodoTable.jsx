import React, { useState } from "react";
import AuthUser from "../AuthUser";
import axios from "axios";

const TodoTable = ({ todos, setUpdateFlag, search }) => {
  const { getToken } = AuthUser();
  const token = getToken();
  const [editAble, setEditAble] = useState({ edit: false });
  const sendCheckboxUpdate = async (todoId, isChecked) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/todo-completed-update",
        {
          todo_id: todoId,
          update_completed: isChecked,
          token: token,
        }
      );
      setUpdateFlag((prevFlag) => !prevFlag);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (todoId) => {
    console.log(todoId);
    // eslint-disable-next-line react/prop-types
    const updatedTodoList = todos.map((todo) =>
      todo.id === todoId
        ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
        : todo
    );

    const updatedTodo = updatedTodoList.find((todo) => todo.id === todoId);
    sendCheckboxUpdate(todoId, updatedTodo.completed);
    return updatedTodo;
  };

  const sentUpdatedColors = async (todoId, color) => {
    const response = await axios.post(
      "http://127.0.0.1:8000/todo-color-update",
      {
        token: token,
        todo_id: todoId,
        color: color,
      }
    );

    console.log(response);
    setUpdateFlag((prevFlag) => !prevFlag);
  };

  const colorSelected = (todoId, color) => {
    const updateColors = todos.map((todo) =>
      todo.id === todoId ? { ...todo, colors: color } : todo
    );

    const updateColorSelect = updateColors.find(
      (updateColor) => updateColor.id === todoId
    );

    console.log(updateColorSelect);
    sentUpdatedColors(todoId, updateColorSelect.colors);
  };

  const todoDelete = (todoId) => {
    const response = axios.post("http://127.0.0.1:8000/todo-delete", {
      token: token,
      todo_id: todoId,
    });
    console.log(response);
    setUpdateFlag((prevFlag) => !prevFlag);
  };

  const handleTitleChange = async (value, todoId) =>{
    const response = await axios.post("http://127.0.0.1:8000/todo-title-update",{
      token: token,
      todo_id: todoId,
      new_title: value
    });
    setEditAble((prevEditAble) => ({
      ...prevEditAble,
      edit: false
    }))
    setUpdateFlag((prevFlag) => !prevFlag);
  }

  return (
    <div>
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th scope="col" className="p-4"></th>

          <th
            scope="col"
            className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
          >
            Title
          </th>
          <th
            scope="col"
            className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
          >
            Colors
          </th>
          <th
            scope="col"
            className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
          ></th>
          <th scope="col" className="p-4">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        {todos.filter((todo)=> !search || todo.title.includes(search)).map((todo) => (
          <tr
            key={todo.id}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td className="p-4 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-1"
                  checked={todo.completed === 1}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => handleCheckboxChange(todo.id)}
                />
                <label htmlFor="checkbox-table-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <td
              className={`py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white ${
                editAble?.id === todo.id && editAble.edit === true
                  ? "blink-cursor"
                  : ""
              }`}
              contentEditable={editAble?.id === todo.id && editAble?.edit}
              onBlur={(e) => handleTitleChange(e.target.innerText, todo.id)}
            >
              {todo.title}
            </td>
            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
              <div className="flex justify-center align-center">
                <div
                  className={`myWidth rounded-full border-2 border-red-500 ${
                    todo.colors === "red" && " bg-red-500"
                  }`}
                  onClick={() => colorSelected(todo.id, "red")}
                ></div>

                <div
                  className={`myWidth rounded-full border-2 border-blue-500 ${
                    todo.colors === "blue" && " bg-blue-500"
                  }`}
                  onClick={() => colorSelected(todo.id, "blue")}
                ></div>

                <div
                  className={`myWidth rounded-full border-2 border-yellow-500 ${
                    todo.colors === "yellow" && "bg-yellow-500"
                  }`}
                  onClick={() => colorSelected(todo.id, "yellow")}
                ></div>
              </div>
            </td>
            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <button
                className="py-2 px-2 rounded-lg text-sm font-medium text-white bg-teal-600"
                onClick={() => todoDelete(todo.id)}
              >
                Delete
              </button>
            </td>
            <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
              <button
                className="py-2 px-2 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
                onClick={() =>
                  setEditAble((prevEditAble) => (
                    prevEditAble.id === todo.id ? {
                      ...prevEditAble,
                      edit: !prevEditAble.edit,
                      id: todo.id,
                    } : {
                      ...prevEditAble,
                      edit: true,
                      id: todo.id,
                    }
                  ))
                }
              >
                Edite
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default TodoTable;
