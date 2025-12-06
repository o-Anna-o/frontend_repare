// src/components/ShipListIcon.tsx

import React from 'react'
import { Link } from 'react-router-dom'

export default function ShipListIcon() {
  return (
    <div className="breadcrumbs"
      style={{
        width: '100%',
        fontSize: '',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Link to="/ships">
              Контейнеровозы
      </Link>
    </div>
  )
}
