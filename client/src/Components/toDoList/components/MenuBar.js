import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../DataContext";
import axios from "axios";

const MenuBar = (props) => {
  const { userData, userToken } = useContext(DataContext);
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");

  function createNewList() {
    if (newList.length <= 2) {
      alert("List name must be at least 3 characters");
    } else {
      const body = {
        listName: newList,
        belongTo: userData ? userData._id : null,
      };

      const config = {
        headers: { Authorization: `Bearer ${userToken}` },
      };

      axios
        .post("/toDoList/newList", body, config)
        .then((res) => {
          console.log(res.data);
          setNewList("");
        })
        .catch((err) => console.log(err));
    }
  }

  function removeList() {
    const body = {
      listId: props.sellectedList,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("/toDoList/removeList", body, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  //Get all user lists from the db
  useEffect(() => {
    const body = {
      belongTo: userData ? userData._id : null,
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    const unsub = () => {
      axios
        .post("/toDoList/userLists", body, config)
        .then((res) => {
          setLists(res.data);

          if (props.sellectedList === "" && res.data.length > 0) {
            props.setSellectedList(res.data[0]._id);
          }
        })
        .catch((err) => console.log(err));
    };
    return unsub();
  }, [lists]);
  return (
    <div
      className="ToDoTask"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <input
        className="toDoItems"
        style={{ width: "40%", borderRadius: "8px" }}
        type="text"
        value={newList}
        onChange={(e) => setNewList(e.target.value)}
      />
      <button
        style={{
          border: "1px solid grey",
          borderRadius: "5px",
          margin: "0 0.3em",
          backgroundColor: "lightgreen",
        }}
        onClick={createNewList}
      >
        Create List
      </button>
      <select
        className="toDoItems"
        style={{ width: "15%", marginRight: "0.3em" }}
        onChange={(v) => props.setSellectedList(v.target.value)}
      >
        {lists.map((each) => (
          <option key={each._id} value={each._id}>
            {each.listName}
          </option>
        ))}
      </select>

      <button
        style={{
          border: "1px solid grey",
          borderRadius: "5px",
          backgroundColor: "#fc6d6d",
        }}
        onClick={removeList}
      >
        Remove List
      </button>
    </div>
  );
};

export default MenuBar;
