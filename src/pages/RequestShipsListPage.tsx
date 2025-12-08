// src/pages/RequestShipsListPage.tsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { DsRequestShip } from '../api/Api'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Breadcrumbs from '../components/Breadcrumbs'
import { getToken } from '../auth'
import '../../resources/request_ship_style.css'

export default function RequestShipsListPage() {
  const [requests, setRequests] = useState<DsRequestShip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Проверка авторизации при монтировании компонента
  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log('[RequestShipsListPage] Токен отсутствует, перенаправляем на страницу входа');
      navigate('/login');
      return;
    }
    
    // Установка токена в заголовки API
    api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[RequestShipsListPage] Токен установлен в заголовках API');
  }, [navigate]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log('[RequestShipsListPage] Начинаем загрузку заявок')
        
        // Проверяем токен перед запросами
        const token = getToken();
        if (!token) {
          console.log('[RequestShipsListPage] Токен отсутствует, перенаправляем на страницу входа');
          navigate('/login');
          return;
        }
        
        // Получаем данные пользователя для проверки ID
        console.log('[RequestShipsListPage] Отправляем запрос usersProfileList...');
        const userProfileResponse = await api.api.usersProfileList()
        console.log('[RequestShipsListPage] Данные профиля пользователя получены:', userProfileResponse.data)
        console.log('[RequestShipsListPage] ID пользователя:', userProfileResponse.data.userID)
        console.log('[RequestShipsListPage] Полные данные профиля:', userProfileResponse);
        
        // Получаем все заявки
        console.log('[RequestShipsListPage] Отправляем запрос requestShipList...');
        const response = await api.api.requestShipList()
        console.log('[RequestShipsListPage] Все заявки получены:', response.data)
        
        // Добавим подробный лог для анализа структуры данных заявок
        response.data.forEach((request, index) => {
          console.log(`[RequestShipsListPage] Заявка ${index}:`, request);
          // Нормализация названий полей для логгирования
          const requestId = request.requestShipID || (request as any).RequestShipID || (request as any).request_ship_id || (request as any).id;
          const userId = request.userID || (request as any).UserID || (request as any).user_id || (request as any).userId;
          const status = request.status || (request as any).Status;
          const creationDate = request.creationDate || (request as any).CreationDate;
          const completionDate = request.completionDate || (request as any).CompletionDate;
          
          console.log(`[RequestShipsListPage] Заявка ${index} requestShipID:`, requestId);
          console.log(`[RequestShipsListPage] Заявка ${index} userID:`, userId);
          console.log(`[RequestShipsListPage] Заявка ${index} status:`, status);
          console.log(`[RequestShipsListPage] Заявка ${index} creationDate:`, creationDate);
          console.log(`[RequestShipsListPage] Заявка ${index} completionDate:`, completionDate);
        });
        
        // Фильтруем заявки по текущему пользователю
        const userRequests = response.data.filter(request => {
          // Нормализация названий полей для заявки
          const requestId = request.requestShipID || (request as any).RequestShipID || (request as any).request_ship_id || (request as any).id;
          const userId = request.userID || (request as any).UserID || (request as any).user_id || (request as any).userId;
          const status = request.status || (request as any).Status;
          const creationDate = request.creationDate || (request as any).CreationDate;
          const completionDate = request.completionDate || (request as any).CompletionDate;
          
          console.log(`[RequestShipsListPage] Проверяем заявку ID: ${requestId}, UserID: ${userId}`)
          // Проверяем правильное поле для userID в данных профиля (нормализация названий)
          const profileUserId = userProfileResponse.data.userID ||
                                (userProfileResponse.data as any).UserID ||
                                (userProfileResponse.data as any).user_id ||
                                (userProfileResponse.data as any).UserId ||
                                (userProfileResponse.data as any).userId;
          console.log('[RequestShipsListPage] Profile user ID (нормализация):', profileUserId);
          
          console.log(`[RequestShipsListPage] Request user ID (нормализация):`, userId);
          
          return userId === profileUserId;
        })
        
        console.log('[RequestShipsListPage] Отфильтрованные заявки пользователя:', userRequests)
        setRequests(userRequests)
        setLoading(false)
      } catch (err: any) {
        console.error('[RequestShipsListPage] Ошибка при загрузке заявок:', err)
        console.error('[RequestShipsListPage] Детали ошибки:', {
          message: err?.message,
          response: err?.response,
          status: err?.response?.status,
          data: err?.response?.data
        });
        
        // Если ошибка авторизации, перенаправляем на страницу входа
        if (err?.response?.status === 401) {
          console.log('[RequestShipsListPage] Ошибка 401, перенаправляем на страницу входа');
          navigate('/login');
          return;
        }
        
        setError(err?.response?.data?.detail || err?.message || 'Ошибка загрузки заявок')
        setLoading(false)
      }
    }

    // Проверяем токен перед загрузкой заявок
    const token = getToken();
    if (token) {
      fetchRequests();
    }
  }, [navigate])

  // Функция для определения, является ли заявка черновиком
  const isDraft = (status: string) => {
    const normalizedStatus = status?.toLowerCase().trim();
    return normalizedStatus === 'черновик' || normalizedStatus === 'draft';
  };

  // Функция для обработки нажатия на кнопку "Открыть"
  const handleOpenRequest = (requestId: number) => {
    navigate(`/request_ship/${requestId}`);
  };

  if (loading) return <div className="loading">Загрузка...</div>
  if (error) return <div className="error">Ошибка: {error}</div>

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      
      <div className="request">
        <h1>Мои заявки</h1>
        
        {requests.length === 0 ? (
          <p>У вас пока нет заявок.</p>
        ) : (
          <div className="request__cards">
            {requests.map((request) => {
              // Нормализация названий полей для отображения
              const requestId = request.requestShipID || (request as any).RequestShipID || (request as any).request_ship_id || (request as any).id;
              const status = request.status || (request as any).Status || 'Не указан';
              const creationDate = request.creationDate || (request as any).CreationDate || (request as any).created_at || 'Не указана';
              const completionDate = request.completionDate || (request as any).CompletionDate || (request as any).completed_at || 'Не завершена';
              
              // Проверяем, является ли заявка черновиком
              const isRequestDraft = isDraft(status);
              
              return (
                <div className="request__card" key={requestId}>
                  <div className="request__card__title">
                    <p>Заявка №{requestId}</p>
                  </div>
                  <div className="request__card__status">
                    <p>Статус: {status}</p>
                  </div>
                  <div className="request__card__creation-date">
                    <p>Создана: {creationDate}</p>
                  </div>
                  <div className="request__card__completion-date">
                    <p>Завершена: {completionDate}</p>
                  </div>
                  <div className="request__card__open-button">
                    <button 
                      className={`btn ${isRequestDraft ? 'btn-active' : 'btn-inactive'}`}
                      onClick={() => handleOpenRequest(requestId)}
                      disabled={!isRequestDraft}
                    >
                      Открыть
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  )
}