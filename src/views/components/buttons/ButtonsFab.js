// ** MUI Imports
import Fab from '@mui/material/Fab'

// ** Icons Import
import Plus from 'mdi-material-ui/Plus'
import Heart from 'mdi-material-ui/Heart'
import Pencil from 'mdi-material-ui/Pencil'
import NavigationOutline from 'mdi-material-ui/NavigationOutline'

const ButtonsFab = () => {
  return (
    <div className='demo-space-x'>
      <Fab aria-label='add'>
        <Plus />
      </Fab>
      <Fab color='primary' aria-label='edit'>
        <Pencil />
      </Fab>
      <Fab color='secondary' variant='extended'>
        <NavigationOutline sx={{ marginRight: 1 }} />
        Navigate
      </Fab>
      <Fab disabled aria-label='like'>
        <Heart />
      </Fab>
    </div>
  )
}

export default ButtonsFab
