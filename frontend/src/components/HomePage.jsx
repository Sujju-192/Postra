import React from 'react'
import LeftPanel from './LeftPanel'
import FeedPanel from './FeedPanel'
import RightPanel from './RightPanel'

export default function HomePage() {
  return (
    <div className='flex h-screen w-screen justify-evenly'>
        {/* Is components mein left panel right panel aur wo panel ko call krna hai, jisme cards dikhenege scrollable hoga wo */}
        <LeftPanel/>
        <FeedPanel/>
        <RightPanel/>
    </div>
  )
}
