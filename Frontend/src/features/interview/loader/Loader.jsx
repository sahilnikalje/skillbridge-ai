import React from 'react'
import './Loader.scss'

const Loader = ({ words = ['analyzing','evaluating','generating','refining'] }) => {
  return (
    <main className="loader-wrapper">
      <div className="card">
        <div className="loader">
          <p>loading</p>
          <div className="words">
            {words.map((word, i) => (
              <span className="word" key={i}>{word}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Loader