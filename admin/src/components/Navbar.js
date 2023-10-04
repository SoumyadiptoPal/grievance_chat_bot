import { Button } from '@mui/material'
import React from 'react'

const Navbar = () => {
  return (
    <div className='nav'>
        <div style={{ fontWeight: "bolder", fontSize: "2rem" }}>
        Sarva-Sevan
      </div>
      <div>
        <Button>Home</Button>
        <Button>Analytics</Button>
      </div>
    </div>
  )
}

export default Navbar