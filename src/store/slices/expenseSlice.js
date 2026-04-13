import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as expenseApi from '../../api/expenses'

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const res = await expenseApi.getExpenses()
  return res.data
})

export const fetchSummary = createAsyncThunk('expenses/fetchSummary', async () => {
  const res = await expenseApi.getSummary()
  return res.data
})

export const addExpense = createAsyncThunk('expenses/add', async (data) => {
  const res = await expenseApi.createExpense(data)
  return res.data
})

export const editExpense = createAsyncThunk('expenses/edit', async ({ id, data }) => {
  const res = await expenseApi.updateExpense(id, data)
  return res.data
})

export const removeExpense = createAsyncThunk('expenses/remove', async (id) => {
  await expenseApi.deleteExpense(id)
  return id
})

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: { list: [], summary: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true })
      .addCase(fetchExpenses.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchExpenses.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
      .addCase(fetchSummary.fulfilled, (state, action) => { state.summary = action.payload })
      .addCase(addExpense.fulfilled, (state, action) => { state.list.unshift(action.payload) })
      .addCase(editExpense.fulfilled, (state, action) => {
        const idx = state.list.findIndex(e => e.id === action.payload.id)
        if (idx !== -1) state.list[idx] = action.payload
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.list = state.list.filter(e => e.id !== action.payload)
      })
  }
})

export default expenseSlice.reducer
