// ** MUI Imports
import Chip from '@mui/material/Chip'

// ** Icons Imports
import Battery10 from 'mdi-material-ui/Battery10'
import BatteryCharging30 from 'mdi-material-ui/BatteryCharging30'

const ChipsIcon = () => {
  return (
    <div className='demo-space-x'>
      <Chip label='Battery Low' icon={<Battery10 fontSize='small' />} />
      <Chip label='Charging' color='primary' variant='outlined' icon={<BatteryCharging30 fontSize='small' />} />
    </div>
  )
}

export default ChipsIcon
