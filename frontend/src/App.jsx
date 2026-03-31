import React from 'react'
import HomePage from './components/HomePage'
import axios from "axios"
import { useState } from 'react'
import { useEffect } from 'react';

export default function App() {
  const[jokes, setJokes] = useState([]);
  useEffect(() => {
    axios.get('/api/jokes')
    .then((response) => {
      setJokes(response.data);
    })
    .catch((err) => {
      console.log(`Error ${err}`)
    })
  }, [])
  return (
    <div>
      {jokes.map((value, idx) => {
        return (
        <div key={idx}>
          <h3>{value.title}</h3>
          <h4>{value.content}</h4>
        </div>
      )})}
      {console.log(jokes)}
    </div>
  )
}
