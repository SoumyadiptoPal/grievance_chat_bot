import React from 'react'
import ComplainList from "./ComplainList";
import MessageContainer from "./MessageContainer";

const Home = () => {
  return (
    <div>
    <div className="container">
      <div className="cont1">
        <ComplainList />
      </div>
      <div className="cont2">
        <MessageContainer />
      </div>
    </div>
  </div>
  )
}

export default Home