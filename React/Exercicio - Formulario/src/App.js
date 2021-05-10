import React from "react"

import Header from "./components/Header.js"
import Main from "./components/Main.js"
import Footer from "./components/Footer.js"

import "./index.css"

export default function app (){
  return (
    <>
      <Header/>
      <Main/>
      <Footer/>
    </>
  )
}