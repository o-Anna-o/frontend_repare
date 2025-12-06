// src/components/AuthLink.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, clearToken } from '../auth'

export default function AuthLink() {
  const token = getToken()
  console.log('[AuthLink] token:', token)

  return (
    <div
      className="breadcrumbs"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {token ? (
        <a
          onClick={() => {
            clearToken()
            window.location.reload()
          }}
          style={{
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Выход
        </a>
      ) : (
        <Link
          to="/login"
          style={{
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Вход
        </Link>
      )}
    </div>
  )
}
