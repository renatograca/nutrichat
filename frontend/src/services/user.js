import { USER_BASE_URL } from './config'

export async function fetchUserByEmail(email) {
  const res = await fetch(`${USER_BASE_URL}/users/${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('user not found')
  return await res.json()
}

export async function register(userData) {
  console.log('USER_BASE_URL:', USER_BASE_URL)
  const res = await fetch(`${USER_BASE_URL}/users/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      full_name: userData.fullName,
      email: userData.email,
      password: userData.password,
      date_of_birth: userData.dateOfBirth,
      phone: userData.phone
    })
  })
  if (!res.ok) throw new Error('registration failed')
  return await res.json()
}
