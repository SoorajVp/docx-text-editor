import React from 'react'
import Profile from '../components/Profile'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
  const { user_data } = useSelector((store) => store.user)

  return (
    <Profile {...user_data} />
  )
}

export default ProfilePage