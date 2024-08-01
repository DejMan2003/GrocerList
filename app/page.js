"use client"
import React , {useState, useEffect} from 'react';
import { collection, addDoc, getDoc, onSnapshot, QuerySnapshot, query, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import {db} from './firebase';



export default function Home() {

  const [items, setItems] = useState(
    [
      // {name : 'Bread'},
      // {name : 'Tomatoes'},
      // {name : 'Tea'},
      // {name : 'Apples'},
      // {name : 'Syrup'},
      // {name : 'Milk'},
      // {name : 'Cereal'}
    ]); 
  const [editItemId, setEditItemId] = useState(null);
  const [newItem, setNewItem] = useState({name: ''});

  //add Item to Database
const addItem = async(e) =>
{
  e.preventDefault()
  if(newItem.name !== '')
    {
      //setNewItem([...items, newitem]);
      await addDoc(collection(db, "Groceries"),{
        name : newItem.name.trim(),
      });
      setNewItem({name : ''});
    }
};

  //Read or Edit Data from database.
  useEffect(() => 
    {
      const q = query(collection(db,'Groceries'));
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        let itemsArr = []
        QuerySnapshot.forEach((doc) => 
          {
            itemsArr.push({...doc.data(), id: doc.id});
            setItems(itemsArr);
          });
          return () => unsubscribe();
        });
    []});

  //Deletes data from database.
    const deleteItem = async(id) => 
      {
        await deleteDoc(doc(db, "Groceries",id));
      }
  // //Updates data from database
  //     const updateItem = async(id, updatedData) => 
  //       {
  //         try
  //         {
  //           const ref = doc(db, "Groceries", id);
  //           await updateDoc(ref, updatedData);

  //           // Update the local state after successful update in Firestore
  //     setItems(items.map(item => item.id === id ? { ...item, ...updatedData } : item));
  //     setEditItemId(null); // Reset the edit mode
  //           console.log("document updated successfully!")
  //         }
  //         catch(error)
  //         {
  //           console.error("Error code : ", error);
  //         }
  //       }
  //       // Handler function to trigger the update
  // const handleUpdate = (id) => {
  //   if (newName.trim() !== '') {
  //     updateItem(id, { name: newName });
  //   }
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
      <h1 className="text-4xl p-4 text-center">Grocer List</h1> 
      <div className = 'bg-slate-800 p-5 rounded-lg items-center'>
        <form className = "grid grid-cols-6 text-black mx-auto">
          <input value = {newItem.name} onChange={(e) => setNewItem({...newItem , name: e.target.value})} className = "col-span-3 p-3 border mx-5" type = "text" placeholder = "Enter Product"></input>
          <button onClick = {addItem} className = "text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type = "submit">Add</button>
        </form>
        <ul>
          {items.map((item, id) => 
          ( 
            <li key = {id} className='my-4 w-full flex justify-between bg slate-950'>
              <div className='p-4 w-full flex justify-between'>
              <span className = 'capitalize'>{item.name}</span>
              </div>
             {/* <button onClick = {() => handleUpdate(item.id,<input onChange={handleUpdate} placeholder = 'Enter New Product'></input>)} className = "text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type = "update">Edit</button> */}
              <button onClick = {() => deleteItem(item.id)}className='text-white bg-slate-950 hover:bg-slate-900 p-3 mx-4 text-xl'> Remove </button>
            </li>
            
          ) 
           )}
        </ul>
      </div>
       </div>
    </main>
  );
}
