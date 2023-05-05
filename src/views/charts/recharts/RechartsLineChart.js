// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

const data = [
  { pv: 280, name: '7/12' },
  { pv: 200, name: '8/12' },
  { pv: 220, name: '9/12' },
  { pv: 180, name: '10/12' },
  { pv: 270, name: '11/12' },
  { pv: 250, name: '12/12' },
  { pv: 70, name: '13/12' },
  { pv: 90, name: '14/12' },
  { pv: 200, name: '15/12' },
  { pv: 150, name: '16/12' },
  { pv: 160, name: '17/12' },
  { pv: 100, name: '18/12' },
  { pv: 150, name: '19/12' },
  { pv: 100, name: '20/12' },
  { pv: 50, name: '21/12' }
]

const CustomTooltip = props => {
  // ** Props
  const { active, payload } = props
  if (active && payload) {
    return <div className='recharts-custom-tooltip'>{<span>{`${payload[0]?.value}`}</span>}</div>
  }

  return null
}

const RechartsLineChart = ({ direction, visitMonthly }) => {
  // console.log(visitMonthly)
  return (
    <Card>
      <CardHeader
        title='Prescribers Visited per Month'
        titleTypographyProps={{ variant: 'h6' }}
        // subheader='Commercial networks & enterprises'
        // subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { marginBottom: 0 },
          '& .MuiCardHeader-content': { marginBottom: [2, 0] }
        }}
      />
      <CardContent>
        <Box sx={{ height: 389 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={visitMonthly.reverse()} style={{ direction }} margin={{ left: -20 }}>
              <CartesianGrid />
              <XAxis dataKey='month' reversed={direction === 'ltr'} />
              <YAxis orientation={direction === 'ltr' ? 'right' : 'left'} />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='visit' stroke='#ff9f43' strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
