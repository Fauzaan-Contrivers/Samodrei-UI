import Script from 'next/script'
import { forwardRef, Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Input from '@mui/material/Input'

import { useDispatch } from 'react-redux'
import { updatePrescriberAddress } from 'src/store/prescribers'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const getLocationData = async location => {
  let premise = ''
  let Street_Address = ''
  let City = ''
  let State = ''
  let Zip = ''
  let subpremise = ''
  const { lat, lng } = await getLatLng(location)
  location.address_components.forEach(componenet => {
    if (componenet.types.includes('premise') || componenet.types.includes('street_number')) {
      premise = componenet.long_name
    }
    if (componenet.types.includes('sublocality') || componenet.types.includes('route')) {
      Street_Address = Street_Address == '' ? componenet.long_name : Street_Address + ', ' + componenet.long_name
    }

    if (componenet.types.includes('locality')) {
      City = componenet.long_name
    }

    if (componenet.types.includes('administrative_area_level_1')) {
      State = componenet.short_name
    }

    if (componenet.types.includes('postal_code')) {
      Zip = componenet.long_name
    }

    if (componenet.types.includes('subpremise')) {
      subpremise = componenet.short_name
    }
  })

  if (Boolean(subpremise)) {
    Street_Address += ' ' + subpremise
  }

  return {
    prescriber_id: '',
    Street_Address: premise + ', ' + Street_Address,
    City: City,
    State: State,
    Zip: Zip,
    Location__Latitude: lat,
    Location__Longitude: lng
  }
}
const PrescriberEditDialog = ({ prescriber, open, handleClose, onPrescriberUpdate }) => {
  const dispatch = useDispatch()
  const handleSelect = address => {
    setValue(address)
  }

  const [value, setValue] = useState('')

  const onUpdateAddressHandler = async () => {
    const result = await geocodeByAddress(value)
    let d = await getLocationData(result[0])
    d['prescriber_id'] = prescriber.Id
    dispatch(updatePrescriberAddress(d))
    onPrescriberUpdate()
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
            height: '320px'
          }
        }}
      >
        <DialogTitle id='alert-dialog-slide-title'>Edit Prescriber Address</DialogTitle>
        <DialogContent style={{ paddingTop: '20px', paddingLeft: '10px' }}>
          <PlacesAutocomplete
            value={value}
            onChange={e => {
              setValue(e)
            }}
            onSelect={handleSelect}
            // searchOptions={{types: ["street_address"]}}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <Input
                  {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input'
                  })}
                  fullWidth
                />
                <div className='autocomplete-dropdown-container'>
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item'
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' }
                    return (
                      <div
                        key={`suggestion-${index}`}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
          <Button variant='contained' onClick={() => onUpdateAddressHandler()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default PrescriberEditDialog
