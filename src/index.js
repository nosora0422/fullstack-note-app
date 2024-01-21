import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom"; 
import './index.css';
import './reset.css';
import App from './App';
import Note from './Views/Note/Note';
import ToDoList from './Views/ToDoList/ToDoList';
import Images from './Views/Images/Images';
import Login from './Login/Login';
import Signup from './Signup/Signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Login />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="app" element={<App />}>
        <Route index element={<ToDoList />} />
        <Route path="to-do-list" element={<ToDoList />} />
        <Route path="note" element={<Note />} />
        <Route path="image" element={<Images />} />
      </Route>
    </Routes>
  </HashRouter>
);

