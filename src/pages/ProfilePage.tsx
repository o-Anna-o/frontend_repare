// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { isLoggedIn } from '../auth'
import Navbar from '../components/Navbar'
import Breadcrumbs from '../components/Breadcrumbs'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        console.log('[ProfilePage] fetching profile...')
        const res = await api.api.usersProfileList()
        console.log('[ProfilePage] profile data:', res.data)
        setUser(res.data)
      } catch (err: any) {
        console.error('[ProfilePage] failed to fetch profile', err)
        setError(err?.message || 'Ошибка при загрузке профиля')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])

  if (loading) return <div>Загрузка профиля...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <>
      <Navbar />
      <Breadcrumbs />

      <div style={{ padding: 20 }}>
        <h2>Профиль пользователя</h2>
        <p><strong>ФИО:</strong> {user?.fio}</p>
        <p><strong>Логин:</strong> {user?.login}</p>
        <p><strong>Роль:</strong> {user?.role}</p>
        <p><strong>Контакты:</strong> {user?.contacts}</p>
        <p><strong>Вес груза:</strong> {user?.cargoWeight}</p>
        <p><strong>Контейнеры 20ft:</strong> {user?.containers20ftCount}</p>
        <p><strong>Контейнеры 40ft:</strong> {user?.containers40ftCount}</p>
      </div>
    </>
  )
}
