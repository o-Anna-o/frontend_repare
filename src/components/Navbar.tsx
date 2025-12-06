// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../auth'

import ShipListIcon from '../components/ShipListIcon'
import AuthLink from '../components/AuthLink'
import UserLoginLink from './UserLoginLink'

const CART_ICON_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAn0lEQVR4nO3QMQ4BURSF4ckUEol1qGgobIGFaaxIi0ah0lAohE0QkU9GRvcGY15iIv72nXv+d2+S/BzoYq08a3RelTex8zl7tJ4JxnlwhbTE1imW+eykKNTGCVcM3i1/gH4+e0EvFJiKxywkyH4fi3NIcCepiKKerwnQwDZwhkVMwSYgmEcRlOUveMlfUG/BUTwOIcEoe4hRjmHVS9SHGxku7S0HDKVsAAAAAElFTkSuQmCC'

export default function Navbar() {
  const [count, setCount] = useState<number | null>(null)
  const [requestId, setRequestId] = useState<number | null>(null)
  const [authState, setAuthState] = useState({})

async function fetchBasket() {
  const tkn = getToken();
  if (!tkn) {
    setCount(null);
    setRequestId(null);
    return;
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tkn,
    };

    const res = await fetch('/api/request_ship/basket', {
      method: 'GET',
      headers,
    });

    // если не авторизован
    if (res.status === 401) {
      setCount(null);
      setRequestId(null);
      return;
    }

    const json = await res.json().catch(() => null);
    if (!json || typeof json !== 'object') {
      setCount(null);
      setRequestId(null);
      return;
    }

    let id = null;
    let c = null;

    if (json.data && typeof json.data === 'object') {
      id = json.data.request_ship_id
        ?? json.data.requestShipId
        ?? json.data.requestShipID
        ?? null;

      c = json.data.ships_count
        ?? json.data.shipsCount
        ?? json.count
        ?? null;
    }

    // ставим число, если оно есть
    if (c !== null && c !== undefined) {
      setCount(Number(c));
    } else {
      setCount(0);
    }

    setRequestId(id ? Number(id) : null);
  } catch (e) {
    console.error(e);
    setCount(null);
    setRequestId(null);
  }
}



  useEffect(() => {
    fetchBasket()
    const handler = () => {
      fetchBasket()
      // Force re-render of auth components
      setAuthState({})
    }
    window.addEventListener('lt:basket:refresh', handler)
    return () => window.removeEventListener('lt:basket:refresh', handler)
  }, [])

  return (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
    <div style={{ position: 'absolute', left: 12, top: 12 }}>

      {typeof count === 'number' && count > 0 ? (
        <Link
          to={requestId ? `/request_ship/${requestId}` : '/request_ship'}
          className="cart-link"
          style={{ textDecoration: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          <img
            className="loading_time-img cart-link-icon"
            src={'data:image/png;base64,' + CART_ICON_BASE64}
            alt="busket"
          />
          <span className="cart-count">{count}</span>
        </Link>
      ) : (
        <span className="cart-link cart-link--disabled">
          <img
            className="loading_time-img cart-link-icon--disabled"
            src={'data:image/png;base64,' + CART_ICON_BASE64}
            alt="busket"
          />
        </span>
      )}

    </div>

    <div style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
      <ShipListIcon />
      <UserLoginLink key={localStorage.getItem('lt_token') || 'logged-out'} />
      <AuthLink />
    </div>

  </div>
)

}
