// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'

const data = [
  { name: 'Front Desk', color: '#ffe700' },
  { name: 'Medical Assistant', color: '#FFA1A1' },
  { name: 'Nurse Practitioner', color: '#100bf8' },
  { name: 'Physician', color: '#600bf8' },
  { name: 'Office Manager', color: '#800bf8' },
  { name: 'Physician’s Assistant', color: '#899bf8' },
  { name: 'Nurse', color: '#342234' }
]
const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const RechartsPieChart = props => {
  // console.log(props.doc)
  data[0].value = props.fd
  data[1].value = props.ma
  data[2].value = props.np
  data[3].value = props.ph
  data[4].value = props.om
  data[5].value = props.pa
  data[6].value = props.nurse

  // console.log(data)
  return (
    <Card>
      <CardHeader
        title='Total Visits'
        titleTypographyProps={{ variant: 'h6' }}
        // subheader='Spending on various categories'
        // subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
      />
      <CardContent>
        <Box sx={{ height: 325 }}>
          <ResponsiveContainer>
            <PieChart height={300} style={{ direction: 'ltr' }}>
              <Pie data={data} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 4, justifyContent: 'center' }}>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#ffe700' }} />
            <Typography>Front Desk</Typography>
          </Box>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#FFA1A1' }} />
            <Typography>Madical Assistant</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#826bf8' }} />
            <Typography>Nurse Practitioner (NP)</Typography>
          </Box>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#600bf8' }} />
            <Typography>Physician</Typography>
          </Box>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#800bf8' }} />
            <Typography>Office Manager</Typography>
          </Box>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#899bf8' }} />
            <Typography>Physician’s Assistant</Typography>
          </Box>
          <Box sx={{ marginRight: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ marginRight: 1.5, fontSize: '0.75rem', color: '#342234' }} />
            <Typography>Nurse</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsPieChart
