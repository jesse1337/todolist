import React, { useState, useEffect } from "react";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import useAuth from "./useAuth";

import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, googleProvider, db } from "./firestore";
import "./App.css";

function App() {
  const { user } = useAuth();

  const [state, setState] = useState({
    user: user,
    userId: user ? user.uid : null,
    newItem: "",
    items: [],
    history: [],
  });

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setState((prevState) => ({
        ...prevState,
        user: result.user,
        userId: result.user.uid,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setState((prevState) => ({ ...prevState, user: null, userId: null }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      addItem();
    }
  };

  function fetchDataForUser(userId) {
    const itemsQuery = query(
      collection(db, "users", userId, "items"),
      orderBy("createdAt")
    );
    const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState((prevState) => ({ ...prevState, items: itemsData }));
    });

    const doneItemsQuery = query(
      collection(db, "users", userId, "doneItems"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeDoneItems = onSnapshot(doneItemsQuery, (snapshot) => {
      const doneItemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState((prevState) => ({ ...prevState, history: doneItemsData }));
    });

    // Remember to unsubscribe when the component unmounts.
    return () => {
      unsubscribeItems();
      unsubscribeDoneItems();
    };
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState((prevState) => ({ ...prevState, user, userId: user.uid }));
        fetchDataForUser(user.uid);
      } else {
        setState((prevState) => ({ ...prevState, user: null, userId: null }));
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  async function addItem() {
    if (!state.newItem) {
      alert("no item");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // Handle the user not logged in scenario.
      return;
    }

    const item = {
      value: state.newItem,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "users", user.uid, "items"), item);
      // setNewItem("");
      setState((prevState) => ({ ...prevState, newItem: "" }));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function deleteItem(id) {
    if (!state.userId) {
      alert("Please log in first.");
      return;
    }

    const doneItem = state.items.find((item) => item.id === id);
    if (doneItem) {
      try {
        // Add the done item to the user's doneItems collection
        await addDoc(
          collection(db, "users", state.userId, "doneItems"),
          doneItem
        );
        console.log("Added item to doneItems collection.");

        // Delete the item from the user's items collection
        await deleteDoc(doc(db, "users", state.userId, "items", id));
        console.log("Deleted item from items collection.");
      } catch (e) {
        console.error("Error processing item: ", e);
      }
    }
  }

  async function deleteAllItems() {
    if (!state.userId) {
      alert("Please log in first.");
      return;
    }

    const itemsCollection = collection(db, "users", state.userId, "items");
    const allItemsSnapshot = await getDocs(itemsCollection);

    const doneItemsCollection = collection(
      db,
      "users",
      state.userId,
      "doneItems"
    );
    const allDoneItemsSnapshot = await getDocs(doneItemsCollection);

    const deletePromises = [];

    allItemsSnapshot.forEach((document) => {
      deletePromises.push(
        deleteDoc(doc(db, "users", state.userId, "items", document.id))
      );
    });

    allDoneItemsSnapshot.forEach((document) => {
      deletePromises.push(
        deleteDoc(doc(db, "users", state.userId, "doneItems", document.id))
      );
    });

    try {
      await Promise.all(deletePromises);
      console.log("All items deleted from db.");
    } catch (e) {
      console.error("Error deleting all documents: ", e);
    }
    setState((prevState) => ({ ...prevState, History: [] }));
  }

  function displayMsg() {
    if (state.items.length == 0) {
      return "all done !";
    }
  }

  const formatDate = (options) => {
    return new Date().toLocaleString("en-US", options).toLowerCase();
  };

  //-----------------------------------
  return (
    <div className="App">
      {!user ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <>
          <p className="welcText">{user.displayName}</p>
          <div cassName="signOutCont">
            <button className="signOut" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </>
      )}

      <h2 className="today">
        today is
        <text className="date">
          {" "}
          {formatDate({ weekday: "long" })} <text className="dash">-</text>{" "}
          {formatDate({ month: "long" })} {formatDate({ day: "numeric" })}
        </text>
      </h2>
      <h1 className="todo"> to do ✗ :</h1>

      <input
        className="input"
        type="text"
        placeholder="i need to do..."
        value={state.newItem}
        onChange={(e) =>
          setState((prevState) => ({ ...prevState, newItem: e.target.value }))
        }
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
        {state.items.map((item) => {
          return (
            <li className="li" key={item.id}>
              {item.value}
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
        {state.history.map((item) => {
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
