import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import axios from 'axios'
import UserViewLeft from 'src/views/product_advocates/UserViewLeft'
import UserViewRight from 'src/views/product_advocates/UserViewRight'
import { fetchProductAdvocateData } from 'src/store/product_advocates'

const Preview = ({ id, invoiceData }) => {
  const store = useSelector(state => state)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ID, setID] = useState('')
  const dispatch = useDispatch()

  const fetchData = async id => {
    setLoading(true)
    setError(null)
    try {
      await dispatch(fetchProductAdvocateData({ id: id }))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData(id)
  }, [id])

  useEffect(() => {
    setData(store.product_advocates.jobsData)
  }, [store.product_advocates.jobsData])

  // useEffect(() => {
  //   setID(id)
  //   fetchData()
  // }, [])

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
    console.log('DATA', data?.samplesDistributed.result)
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={data?.result[0]} jobsData={data?.jobs} samplesData={data?.samplesDistributed.result} />
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
