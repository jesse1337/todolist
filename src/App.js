import React, { useState } from 'react';
import './App.css';

function App() {

  // Var
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  const [history, setHistory] = useState([]);

  const day = {weekday: "long"};
  const theDay = (new Date().toLocaleString("en-US", day)).toLowerCase();

  const date = {day: "numeric"};
  const theDate = (new Date().toLocaleString("en-US", date));

  const month = {month: "long"};
  const theMonth = (new Date().toLocaleString("en-US", month)).toLowerCase();


  // Functions



  const handleKeyDown = (event) => {
    if(event.key == 'Enter') {
      addItem();
    }
  }  

  function addItem() {

    //if nothing is there, alert user
    if(!newItem) {
      alert("no item");
      return;
    }

    const item = {
      id: Math.floor(Math.random() * 1000),
      value: newItem
    };

    setItems(oldList => [...oldList, item]);
    setNewItem("");
  }
  
  function deleteItem(id) {

    const doneItem = items.filter((item) => item.id == id)[0];
    setHistory(oldList => [...oldList, doneItem]);

    const newArr = items.filter((item) => item.id !== id);
    console.log('first delete arr: ' + newArr)
    setItems(newArr);    

  }

  function refresh() {
    window.location.reload(false);
  }

  //-----------------------------------
  return (
    <div className="App">
      {/* 1. Header */}
      
      <h2 className="today">today is
       <text className="date"> {theDay} <text className="dash">-</text> {theMonth} {theDate}</text>
      </h2>
      <h1 className="todo"> to do ✗ :</h1>

      <input className="input" type="text" 
        placeholder='i need to do...' 
        value={newItem}
        onChange={e => setNewItem(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className="addButton" onClick={() => addItem()} >
        <text className="addText">✎</text>
        </button>
      <button className="refreshButton" onClick={() => refresh()}>
        <text className="refreshText">☄︎</text>
      </button>


      <ul className="ul">
        {items.map(item => {
          return(
            <li className="li" key={item.id}>
              {item.value} {' '}
              <button className="deleteButton" onClick={() => deleteItem(item.id)}>  </button>
            </li>
          )
        })}
      
      </ul>


      <h2 className="done">done ✔︎ :</h2>
      <ul className="doneul">
        {history.map(item => {
          return(
            <li className="doneli" key={item.id}>
              {item.value} {' '}
            </li>
        )
        })}
      </ul>
    </div>
  );
}

export default App;
