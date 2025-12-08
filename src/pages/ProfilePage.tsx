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
        console.log('[ProfilePage] profile data type:', typeof res.data);
        console.log('[ProfilePage] profile data keys:', Object.keys(res.data || {}));
        
        // Детальная нормализация полей данных пользователя
        const userData = res.data;
        console.log('[ProfilePage] Raw user data structure:', userData);
        
        // Нормализация каждого поля с различными вариантами имен
        const fio = userData?.fio ||
                  (userData as any)?.FIO ||
                  (userData as any)?.fullName ||
                  (userData as any)?.full_name ||
                  (userData as any)?.firstName ||
                  (userData as any)?.first_name ||
                  '';
                  
        const login = userData?.login ||
                    (userData as any)?.Login ||
                    (userData as any)?.userLogin ||
                    (userData as any)?.username ||
                    (userData as any)?.userName ||
                    '';
                    
        const role = userData?.role ||
                   (userData as any)?.Role ||
                   (userData as any)?.userRole ||
                   (userData as any)?.user_role ||
                   '';
                   
        const contacts = userData?.contacts ||
                        (userData as any)?.Contacts ||
                        (userData as any)?.contact ||
                        (userData as any)?.contactInfo ||
                        (userData as any)?.contact_info ||
                        '';
                        
        const cargoWeight = userData?.cargoWeight ||
                             (userData as any)?.CargoWeight ||
                             (userData as any)?.cargo_weight ||
                             (userData as any)?.weight ||
                             (userData as any)?.cargo ||
                             0;
                             
        const containers20ftCount = userData?.containers20ftCount ||
                                    (userData as any)?.Containers20ftCount ||
                                    (userData as any)?.containers_20ft_count ||
                                    (userData as any)?.count20 ||
                                    (userData as any)?.container20Count ||
                                    0;
                                    
        const containers40ftCount = userData?.containers40ftCount ||
                                    (userData as any)?.Containers40ftCount ||
                                    (userData as any)?.containers_40ft_count ||
                                    (userData as any)?.count40 ||
                                    (userData as any)?.container40Count ||
                                    0;
        
        const normalizedUser = {
          fio,
          login,
          role,
          contacts,
          cargoWeight,
          containers20ftCount,
          containers40ftCount,
        };
        
        console.log('[ProfilePage] Normalized user data:', normalizedUser);
        setUser(normalizedUser)
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
