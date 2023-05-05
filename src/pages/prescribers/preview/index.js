// ** React Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material/Button'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import { fetchPrescriberData } from 'src/store/prescribers'
// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import UserViewLeft from 'src/views/prescribers/UserViewLeft'
import UserViewRight from 'src/views/prescribers/UserViewRight'

const Preview = ({ id, invoiceData }) => {
  const store = useSelector(state => state)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const fetchData = async id => {
    setLoading(true)
    setError(null)
    try {
      await dispatch(fetchPrescriberData({ id: id }))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    console.log('USe effect Id', id)
    fetchData(id)
  }, [id])

  useEffect(() => {
    setData(store.prescribers.jobsData)
    console.log('JOBS BY Prescribers', store.prescribers.jobsData)
  }, [store.prescribers.jobsData])

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>{error}</Alert>
          <Button variant='contained' color='primary' onClick={fetchData}>
            Retry
          </Button>
        </Grid>
      </Grid>
    )
  } else if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='info'>Loading....</Alert>
        </Grid>
      </Grid>
    )
  } else if (data) {
    console.log('DATA==>', data)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={data.result[0]} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight data={data} />
        </Grid>
      </Grid>
    )
  } else {
    return <div>No data available.</div>
  }
}

export default Preview
