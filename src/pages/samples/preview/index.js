// ** React Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Demo Components Imports
import UserViewRight from 'src/views/prescribers/UserViewRight'
import SampleViewLeft from 'src/views/samples/SampleViewLeft'
import SampleViewPrescriber from 'src/views/samples/SampleViewPrescriber'

const Preview = ({ id }) => {
  // ** State
  // const [error, setError] = useState(true)
  const store = useSelector(state => state)

  const [data, setData] = useState(null)

  useEffect(() => {
    let flag = store.samples.data.filter(val => val.Id == id)
    if (flag) setData(flag[0])
  }, [id, store.samples.data])

  console.log(data)

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <SampleViewLeft data={data} />
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <SampleViewPrescriber data={data} />
        </Grid>
      </Grid>
    )
  } else if (!data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>Sample with the id: {id} does not exist.</Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default Preview
