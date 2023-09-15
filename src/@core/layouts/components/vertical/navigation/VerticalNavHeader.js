// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons
import Close from 'mdi-material-ui/Close'
import CircleOutline from 'mdi-material-ui/CircleOutline'
import RecordCircleOutline from 'mdi-material-ui/RecordCircleOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    menuUnlockedIcon: userMenuUnlockedIcon,
    verticalNavMenuBranding: userVerticalNavMenuBranding
  } = props

  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userVerticalNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }

  const MenuLockedIcon = () =>
    userMenuLockedIcon || (
      <RecordCircleOutline
        sx={{
          fontSize: '1.25rem',
          pointerEvents: 'none',
          ...menuCollapsedStyles,
          transition: 'opacity .25s ease-in-out'
        }}
      />
    )

  const MenuUnlockedIcon = () =>
    userMenuUnlockedIcon || (
      <CircleOutline
        sx={{
          fontSize: '1.25rem',
          pointerEvents: 'none',
          ...menuCollapsedStyles,
          transition: 'opacity .25s ease-in-out'
        }}
      />
    )

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
            <img height={40} alt={"logo"} src="/images/favicon.png" />
            <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 3 }) }}>
              {themeConfig.templateName}
            </HeaderTitle>
          </StyledLink>
        </Link>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ padding: 0, backgroundColor: 'transparent !important' }}
        >
          <Close fontSize='small' />
        </IconButton>
      ) : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ padding: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
