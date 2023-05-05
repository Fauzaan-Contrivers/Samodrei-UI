import Link from 'next/link'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { convertDateToReadableFormat } from 'src/configs/utils'

const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export const jobsListViewColumns = [
  {
    field: 'SalesforceId',
    minWidth: 200,
    headerName: 'Salesforce Id',
    renderCell: ({ row }) => (
      <Link href={`/jobs/preview/${row.SalesforceId}`} passHref>
        <StyledLink>{`${row.SalesforceId}`}</StyledLink>
      </Link>
    )
  },
  {
    minWidth: 160,
    field: 'Status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      ;<Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
        {row.Status}
      </Typography>
    }
  },
  {
    flex: 0.5,
    field: 'Prescriber',
    minWidth: 300,
    headerName: 'Prescriber',
    renderCell: ({ row }) => {
      console.log(row.prescriber)
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/prescribers/preview/${row?.prescriber?.SalesforceId}`} passHref>
              <StyledLink>{row?.Name}</StyledLink>
            </Link>
            <Typography noWrap variant='caption'>
              {row?.Street_Address}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.5,
    field: 'product_advocate_name',
    minWidth: 200,
    headerName: 'Product Advocate',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/product_advocates/preview/${row?.product_advocate[0]?.ProductAdvocateId}`} passHref>
              <StyledLink>{row?.product_advocate[0]?.ProductAdvocateName}</StyledLink>
            </Link>
            <Typography noWrap variant='caption'>
              {row?.product_advocate[0]?.ProductAdvocateEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'feedback_submitted_at',
    headerName: 'Feedback Submitted At',
    renderCell: ({ row }) => (
      <Typography variant='body2'>{convertDateToReadableFormat(row.feedback_submitted_at) || ''}</Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 70,
    field: 'difference_location_doctor',
    headerName: 'Feedback Distance',
    renderCell: ({ row }) => {
      var target = parseFloat(row.difference_location_doctor)

      return (
        <Typography style={{ color: target ? (target > 0.1 ? 'red' : 'green') : 'initial' }} variant='body2'>
          {target ? target.toFixed(2) : ''}
        </Typography>
      )
    }
  }
]
