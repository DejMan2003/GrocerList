"use client"
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot, query, deleteDoc, doc, updateDoc, where } from "firebase/firestore"; 
import { db } from './firebase';
import '../app/globals.css';


export default function Home() {
  
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Add Item to Database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '') {
      await addDoc(collection(db, "Groceries"), {
        name: newItem.name.trim(),
      });
      setNewItem({ name: '' });
    }
  };

  // Load Data from Database
  useEffect(() => {
    const q = query(collection(db, 'Groceries'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr); // Update the state with the fetched items
    });
    return () => unsubscribe();
  }, []);
  

  // Delete data from database.
  const deleteItem = async (id) => {
    try {
      const docRef = doc(db, "Groceries", id); // Create a DocumentReference
      await deleteDoc(docRef);                 // Delete the document
      console.log("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Search Items.
  const searchItems = async () => {
    if (searchQuery !== '') {
      try {
        const q = query(
          collection(db, "Groceries"),
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + '\uf8ff')
        );
    
        const querySnapshot = await getDocs(q); // Use getDocs instead of getDoc
        const searchResults = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        setItems(searchResults);
      } catch (error) {
        console.error("Error searching documents: ", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 background-image-class">
      <div className={"z-10 max-w-5xl w-full items-center justify-between font-mono text-sm "}>
        <h1 className="text-4xl p-4 text-center text-black">Grocer List</h1> 
        <input
          type="text"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border mx-5 radius"
        />
        <button onClick={searchItems} className="text-white bg-slate-950 hover:bg-slate-900 radius  p-3 text-xl">Search</button>

        <div className=' bg-slate-800 p-5 rounded-lg bg-orange items-center'>
          <form className="grid grid-cols-6 text-black mx-auto" onSubmit={addItem}>
            <input 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
              className="col-span-3 p-3 border mx-5" 
              type="text" 
              placeholder="Enter Product" 
            />
            <button className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type="submit">Add</button>
          </form>
        </div>
        <ul>
            {items
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort items alphabetically
            .map((item, id) => (
              <li key={id} className='my-4 text-black w-full flex justify-between my-5'>
                <div className='p-4 w-full flex justify-between'>
                {console.log(" Here are the items: ",items)}
                  <span className='capitalize text-4lg'>{item.name}</span>
                </div>
                <button 
                  onClick={() => deleteItem(item.id)} 
                  className='text-white bg-slate-950 hover:bg-slate-900 p-3 mx-4 text-xl'>
                  Remove
                </button>
              </li>
            ))}
          </ul>
      </div>
    </main>
  );
}
