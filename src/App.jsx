import { useState } from 'react'
import './App.css'
import MovieList from './components/MovieList'
import NavigationBar from './components/NavigationBar/NavigationBar'
import SideBar from './components/SideBar'

function App() {
  return (
    <>
    <nav>
      <NavigationBar />
    </nav>
    <SideBar />
    <MovieList />
    </>
  )
}

export default App
