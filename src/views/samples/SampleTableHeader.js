// ** Next Import
import Link from 'next/link'
import { forwardRef, Fragment, useState } from 'react'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import moment from 'moment'

// ** MUI Imports
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { useDispatch, useSelector } from 'react-redux'
import { convertTimeZoneToReadableDate, convertTimeZoneToReadableTime } from 'src/configs/utils'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { FormControl, InputLabel } from '@mui/material'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const DialogBox = ({ onDownloadClickHandler, open, setOpen, handleClickOpen, handleClose }) => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [date, setDate] = useState([])

  const [productAdvocate, setProductAdvocate] = useState('')
  const [sampleStatus, setSampleStatus] = useState()

  const store = useSelector(state => state)
  const CustomInput = forwardRef((props, ref) => {
    const startDate = Boolean(props.start) ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = Boolean(props.end) ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`
    props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
    const updatedProps = { ...props }
    delete updatedProps.setDates
    return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  })

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDate(date)
    }
    setStart(start)
    setEnd(end)
  }

  const setDatesHandler = val => {
    setDate(val)
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        sx={{
          '& .MuiPaper-root': {
            width: '700px',
            height: '580px'
          }
        }}
      >
        <DialogTitle id='alert-dialog-slide-title'>Select The Options</DialogTitle>
        <DialogContent style={{ paddingTop: '20px', paddingLeft: '10px' }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='product-advocate'>Product Advocate</InputLabel>
            <Select
              fullWidth
              value={productAdvocate}
              sx={{ mr: 4, mb: 2 }}
              label='Product Advocate'
              onChange={e => setProductAdvocate(e.target.value)}
              labelId='product-advocate'
              defaultValue={productAdvocate}
            >
              <MenuItem value=''>none</MenuItem>
              {store.product_advocates.data
                .filter(val => val.Active__c)
                .map(val => {
                  return (
                    <MenuItem key={val.id} value={val.id}>
                      {val.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='product-advocate-s'>Sample Status</InputLabel>
            <Select
              fullWidth
              value={sampleStatus}
              sx={{ mr: 4, mb: 2 }}
              label='Sample Status'
              onChange={e => setSampleStatus(e.target.value)}
              labelId='product-advocate-s'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value={'requested'}>{'Requested'}</MenuItem>
              <MenuItem value={'cancelled'}>{'Cancelled'}</MenuItem>
              <MenuItem value={'delivered'}>{'Delivered'}</MenuItem>
            </Select>
          </FormControl>
          <DatePickerWrapper>
            <DatePicker
              isClearable
              selectsRange
              monthsShown={2}
              endDate={end}
              selected={start}
              startDate={start}
              shouldCloseOnSelect={false}
              id='date-range-picker-months'
              onChange={handleOnChangeRange}
              customInput={
                <CustomInput
                  dates={date}
                  setDates={setDatesHandler}
                  label='Select Delivery Date'
                  end={end}
                  start={start}
                />
              }
            />
          </DatePickerWrapper>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
          <Button variant='contained' onClick={() => onDownloadClickHandler(start, end, productAdvocate, sampleStatus)}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

const SampleTableHeader = props => {
  const store = useSelector(state => state)

  const downloadCSV = (start, end, productAdvocate, sampleStatus) => {
    let samples = store.samples.data
    if (start) {
      samples = samples.filter(val => moment(val.Post_Sign_Date__c).isSameOrAfter(moment(start), 'D'))
    }
    if (end) {
      samples = samples.filter(val => moment(val.Post_Sign_Date__c).isSameOrBefore(moment(end), 'D'))
    }
    if (productAdvocate) {
      samples = samples.filter(val => val.Product_Advocate__r.Id == productAdvocate)
    }
    if (sampleStatus) {
      samples = samples.filter(val => val.Status__c == sampleStatus)
    }
    let csv =
      'Product Advocate,Quantity 20 MG,Quantity 60 MG,Prescriber Name,Prescriber Street,Prescriber City,Prescriber State,Prescriber Zip,Prescriber NPI,Request Date,Deliver Date,Status\n'

    samples.forEach(function (row) {
      const preSignDate =
        String(row.Pre_Sign_Date__c) == 'null' ? 'N.A.' : moment(row.Pre_Sign_Date__c).format('YYYY-MM-DD')
      const postSignDate =
        String(row.Post_Sign_Date__c) == 'null' ? 'N.A.' : moment(row.Post_Sign_Date__c).format('YYYY-MM-DD')

      csv += `${row.Product_Advocate__r.Name},`
      csv += `${row.Quantity_20__c},`
      csv += `${row.Quantity_60__c},`
      csv += `${row.Prescriber_Name__c},`
      csv += `${row.Prescriber_Street__c},`
      csv += `${row.Prescriber_City__c},`
      csv += `${row.Prescriber_State__c},`
      csv += `${row.Prescriber_Zip__c},`
      csv += `${row.Prescriber_Npi__c},`
      csv += `${preSignDate},`
      csv += `${postSignDate},`
      csv += `${String(row.Status__c).toUpperCase()},`
      csv += '\n'
    })

    var hiddenElement = document.createElement('a')
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
    hiddenElement.target = '_blank'

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = 'Samples Data.csv'
    hiddenElement.click()
  }

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box></Box>
      <DialogBox
        open={open}
        setOpen={setOpen}
        onDownloadClickHandler={downloadCSV}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
      <Box>
        <Button sx={{ mb: 2 }} onClick={() => setOpen(true)} variant='contained'>
          Download Samples CSV
        </Button>
      </Box>
    </Box>
  )
}

export default SampleTableHeader
