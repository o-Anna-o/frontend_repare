// src/components/UserLoginLink.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isLoggedIn } from '../auth'
import { api } from '../api'

export default function UserLoginLink() {
  const [userLogin, setUserLogin] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      // Always check the current state
      const token = getToken()
      const loggedIn = isLoggedIn()
      
      console.log('[UserLoginLink] Component mounted - checking auth status:', {
        token,
        loggedIn,
        localStorageToken: localStorage.getItem('lt_token')
      })
      
      // If not logged in, hide the link
      if (!loggedIn || !token) {
        console.log('[UserLoginLink] User not logged in, hiding link')
        setUserLogin(null)
        setLoading(false)
        return
      }

      try {
        console.log('[UserLoginLink] User is logged in, fetching profile...')
        const res = await api.api.usersProfileList()
        console.log('[UserLoginLink] Profile data received:', res.data)
        
        // Детальная нормализация полей данных пользователя
        const userData = res.data;
        console.log('[UserLoginLink] Raw user data structure:', userData);
        
        // Попытка получить логин различными способами
        const login = userData?.login ||
                    (userData as any)?.Login ||
                    (userData as any)?.userLogin ||
                    (userData as any)?.username ||
                    (userData as any)?.userName ||
                    (userData as any)?.name ||
                    'Пользователь';
        
        console.log('[UserLoginLink] Extracted login value:', login);
        console.log('[UserLoginLink] Login field type:', typeof login);
        
        setUserLogin(login)
      } catch (err: any) {
        console.error('[UserLoginLink] Failed to fetch profile:', err)
        if (err.response) {
          console.error('[UserLoginLink] Response status:', err.response.status)
          console.error('[UserLoginLink] Response data:', err.response.data)
        }
        // Even if we can't fetch profile, we're still logged in
        setUserLogin('Пользователь')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchProfile()
  }, [])

  // If still loading, show nothing
  if (loading) {
    return null
  }
  
  // If not logged in, don't show anything
  if (!isLoggedIn() || !getToken()) {
    return null
  }

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
      <span
        style={{
          color: 'white',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
        onClick={() => navigate('/profile')}
      >
        {userLogin || 'Профиль'}
      </span>
    </div>
  )
}
