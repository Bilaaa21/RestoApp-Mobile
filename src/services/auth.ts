import api from './api'
import { Storage } from '@ionic/storage'

const storage = new Storage()

// 🔑 INIT SEKALI, DIJAMIN SIAP
export async function initAuthStorage() {
  await storage.create()
}

export async function login(email: string, password: string) {
  const res = await api.post('/login', { email, password })

  await storage.set('token', res.data.token)

  return res.data
}

export async function getToken() {
  return await storage.get('token')
}

export async function getMe() {
  const token = await getToken()

  return api.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export async function logout() {
  const token = await getToken()
  if (token) {
    try {
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (e) {
      console.error('Logout API error', e)
    }
  }
  await storage.remove('token')
}
