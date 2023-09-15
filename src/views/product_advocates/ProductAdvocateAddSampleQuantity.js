// ** Next Import
import Link from 'next/link'
import { forwardRef, Fragment, useState } from 'react'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** MUI Imports
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { TextField } from '@mui/material'
import { onUpdateProductAdvocateStatusUpdateHandler, updateProductAdvocateDosage } from 'src/store/product_advocates'
import { useDispatch, useSelector } from 'react-redux'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const ProductAdvocateAddSampleQuantity = ({ row, open, handleClose }) => {
  const store = useSelector(state => state)
  const dispatch = useDispatch()

  const [Stock_20, setStock_20] = useState(0)
  const [Stock_60, setStock_60] = useState(0)

  const onUpdateQuantityClickHandler = () => {
    const oldStock_20 = isNaN(row.Stock_20) || !Boolean(row.Stock_20) ? 0 : parseInt(row.Stock_20)
    const oldStock_60 = isNaN(row.Stock_60) || !Boolean(row.Stock_60) ? 0 : parseInt(row.Stock_60)
    const data = {
      product_advocate_id: row.Id,
      Stock_20: oldStock_20 + (isNaN(Stock_20) || !Boolean(Stock_20) ? 0 : parseInt(Stock_20)),
      Stock_60: oldStock_60 + (isNaN(Stock_60) || !Boolean(Stock_60) ? 0 : parseInt(Stock_60))
    }
    try {
      console.log(data)
      const _ = dispatch(updateProductAdvocateDosage(data))
      // Update the state of the quantity in the store
      var temp = store.product_advocates.data.map(s => Object.assign({}, s))

      const index = (temp.findIndex = temp.findIndex(d => d.Id == row.Id))
      console.log('Error=???????', data['Stock_20'])
      console.log('Error=???????', data['Stock_60'])

      temp[index].Stock_20 = data['Stock_20']
      temp[index].Stock_60 = data['Stock_60']

      dispatch(onUpdateProductAdvocateStatusUpdateHandler(temp))
      handleClose()
    } catch (e) {
      console.log(e, 'err')
      alert('Something went wrong. Try again later.')
    }
  }
  return (
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
      <DialogTitle id='alert-dialog-slide-title'>Add Sample Quantity</DialogTitle>
      <DialogContent style={{ paddingTop: '20px', paddingLeft: '10px' }}>
        <TextField
          value={Stock_20}
          onChange={e => {
            const value = e.target.value
            if (!isNaN(value)) {
              setStock_20(value)
            }
          }}
          sx={{ width: '100%' }}
          label='Quantity - 20 MG'
        />
        <TextField
          value={Stock_60}
          onChange={e => {
            const value = e.target.value
            if (!isNaN(value)) {
              setStock_60(value)
            }
          }}
          sx={{ width: '100%', mt: 7 }}
          label='Quantity - 60 MG'
        />
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Close</Button>
        <Button
          variant='contained'
          onClick={() => {
            onUpdateQuantityClickHandler()
          }}
        >
          Update Quantity
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductAdvocateAddSampleQuantity
