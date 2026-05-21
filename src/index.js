import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Routes, Route } from "react-router-dom"; 
import './index.css';
import './reset.css';
import App from './App';
import Note from './Views/Note/Note';
import ToDoList from './Views/ToDoList/ToDoList';
import Images from './Views/Images/Images';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Settings from './Settings/Settings';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<GuestRoute />}>
        <Route path="guest" element={<App />}>
          <Route index element={<Navigate to="/guest/todos" replace />} />
          <Route path="todos" element={<ToDoList />} />
          <Route path="notes" element={<Note />} />
          <Route path="images" element={<Images />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<App />}>
          <Route index element={<Navigate to="/app/todos" replace />} />
          <Route path="todos" element={<ToDoList />} />
          <Route path="notes" element={<Note />} />
          <Route path="images" element={<Images />} />
          <Route path="to-do-list" element={<Navigate to="/app/todos" replace />} />
          <Route path="note" element={<Navigate to="/app/notes" replace />} />
          <Route path="image" element={<Navigate to="/app/images" replace />} />
        </Route>
      </Route>
      <Route path="settings" element={<App />}>
        <Route index element={<Settings />} />
      </Route>
    </Routes>
  </HashRouter>
);

