import React from 'react'

export default function FeedPanel() {
  return (
    <div className='w-[50%] bg-black text-center items-center'>
      <div className="choice flex justify-center-safe m-3 p-3 font-bold">
        <div id="choice1" className='bg-white rounded-3xl p-3 mx-3 text-xl min-w-11'>Followed people</div>
        <div id="choice2" className='bg-white rounded-3xl p-3 mx-3 text-xl min-w-40'>All</div>
      </div>



    </div>
  )
}
