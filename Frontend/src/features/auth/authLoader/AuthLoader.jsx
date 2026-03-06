import React from 'react'
import './AuthLoader.scss'

const AuthLoader = ({ words = ['initializing','preparing workspace','creating account','almost ready'] }) => {
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

export default AuthLoader