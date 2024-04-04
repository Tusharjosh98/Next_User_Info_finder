"use client"
import React from 'react'

export const UserInfo = ({ user_info_label, user_info_value }) => {
  return (
    <div className="flex text-sm">
        <div className="font-bold mr-2">{user_info_label}:</div>
        <div className="font-medium">{user_info_value}</div>
    </div>
  )
}
