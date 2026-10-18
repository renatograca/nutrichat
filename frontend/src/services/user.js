import { USER_BASE_URL, logFetchError } from './config'

export async function fetchUserByEmail(email) {
  const url = `${USER_BASE_URL}/users/${encodeURIComponent(email)}`
  const res = await fetch(url)
  if (!res.ok) {
    await logFetchError(res, url)
    throw new Error('user not found')
  }
  return await res.json()
}

export async function register(userData) {
  try {
    const url = `${USER_BASE_URL}/users`
    const res = await fetch(url, {
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
    if (!res.ok) {
      await logFetchError(res, url, { action: 'register' })
      throw new Error('registration failed')
    }
    return await res.json()
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw err
    }
    throw err
  }
}
