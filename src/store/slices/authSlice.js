import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, username, email } = action.payload
      state.token = token
      state.user = { username, email }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ username, email }))
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.clear()
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
