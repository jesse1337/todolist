import React, { useState, useEffect } from "react";
import { db } from "./firestore";
import { serverTimestamp } from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";

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
    const itemsQuery = query(collection(db, "items"), orderBy("createdAt"));
    const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    });

    const doneItemsQuery = query(
      collection(db, "doneItems"),
      orderBy("createdAt")
    );
    const unsubscribeDoneItems = onSnapshot(doneItemsQuery, (snapshot) => {
      const doneItemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(doneItemsData);
    });

    return () => {
      unsubscribeItems();
      unsubscribeDoneItems();
    };
  }, []);

  async function addItem() {
    if (!newItem) {
      alert("no item");
      return;
    }

    const item = {
      value: newItem,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "items"), item);
      setNewItem("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function deleteItem(id) {
    const doneItem = items.find((item) => item.id === id);
    if (doneItem) {
      try {
        // Add the done item to the doneItems collection
        await addDoc(collection(db, "doneItems"), doneItem);
        console.log("Added item to doneItems collection.");

        // Delete the item from the items collection
        await deleteDoc(doc(db, "items", id));
        console.log("Deleted item from items collection.");
      } catch (e) {
        console.error("Error processing item: ", e);
      }
    }
  }

  async function deleteAllItems() {
    const itemsCollection = collection(db, "items");
    const allItemsSnapshot = await getDocs(itemsCollection);

    const doneItemsCollection = collection(db, "doneItems");
    const allDoneItemsSnapshot = await getDocs(doneItemsCollection);

    const deletePromises = [];

    allItemsSnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, "items", document.id)));
    });

    allDoneItemsSnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, "doneItems", document.id)));
    });

    try {
      await Promise.all(deletePromises);
      console.log("All items deleted from db.");
    } catch (e) {
      console.error("Error deleting all documents: ", e);
    }
    setHistory([]);
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
        onClick={() => deleteAllItems()}
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
