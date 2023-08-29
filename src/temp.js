import React, { useState, useEffect } from "react";
import { db } from "./firestore";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import "./App.css";

function App() {
  // Var
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  const [history, setHistory] = useState([]);

  const day = { weekday: "long" };
  const theDay = new Date().toLocaleString("en-US", day).toLowerCase();

  const date = { day: "numeric" };
  const theDate = new Date().toLocaleString("en-US", date);

  const month = { month: "long" };
  const theMonth = new Date().toLocaleString("en-US", month).toLowerCase();

  const string = "nothing to do !";
  // Functions

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      addItem();
    }
  };

  useEffect(() => {
    const itemsCollection = collection(db, "items");

    const unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    });

    return () => unsubscribe();
  }, []);

  async function addItem() {
    //if nothing is there, alert user
    console.log("added item");
    if (!newItem) {
      alert("no item");
      return;
    }

    const item = {
      id: Math.floor(Math.random() * 1000),
      value: newItem,
    };

    try {
      await addDoc(collection(db, "items"), item);
      console.log("Item added!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setItems((oldList) => [...oldList, item]);
    setNewItem("");
    console.log("items length: " + items.length);
  }

  async function deleteItem(id) {
    const doneItem = items.filter((item) => item.id == id)[0];
    setHistory((oldList) => [...oldList, doneItem]);

    const newArr = items.filter((item) => item.id !== id);
    setItems(newArr);

    // Remove from Firestore
    try {
      const itemDoc = doc(db, "items", id);
      await deleteDoc(itemDoc);
      console.log("Item deleted!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  function displayMsg() {
    if (items.length == 0) {
      return string;
    }
  }

  function refresh() {
    window.location.reload(false);
  }

  //-----------------------------------
  return (
    <div className="App">
      {/* 1. Header */}
      {console.log(items.length)}
      <h2 className="today">
        today is
        <text className="date">
          {" "}
          {theDay} <text className="dash">-</text> {theMonth} {theDate}
        </text>
      </h2>
      <h1 className="todo"> to do ✗ :</h1>

      <input
        className="input"
        type="text"
        placeholder="i need to do..."
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className="addButton" title="add" onClick={() => addItem()}>
        <text className="addText">✎</text>
      </button>
      <button
        className="refreshButton"
        title="refresh"
        onClick={() => refresh()}
      >
        <text className="refreshText">☄︎</text>
      </button>

      <ul className="ul">
        {items.map((item) => {
          return (
            <li className="li" key={item.id}>
              {item.value}{" "}
              <button
                className="deleteButton"
                title="finished !"
                onClick={() => deleteItem(item.id)}
              >
                {" "}
              </button>
            </li>
          );
        })}
      </ul>

      <br />
      <text className="msg">{displayMsg()}</text>
      <h2 className="done">done ✔︎ :</h2>
      <ul className="doneul">
        {history.map((item) => {
          return (
            <li className="doneli" key={item.id}>
              {item.value}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
