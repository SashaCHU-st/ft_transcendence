import React from 'react'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const navigate = useNavigate()
  const toAuthPage =()=>
  {
    navigate("/auth")
  }
  return (
    <div>
      <button onClick={toAuthPage}>To auth page</button>
    </div>
  )
}

export default MainPage
