// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const searchData = [
  {
    id: 1,
    url: '/dashboards/crm',
    icon: 'HomeVariantOutline',
    title: 'CRM Dashboard',
    type: 'pages'
  },
  {
    id: 2,
    url: '/dashboards/analytics',
    icon: 'HomeVariantOutline',
    title: 'Analytics Dashboard',
    type: 'pages'
  },
  {
    id: 3,
    url: '/dashboards/ecommerce',
    icon: 'HomeVariantOutline',
    title: 'eCommerce Dashboard',
    type: 'pages'
  },
  {
    id: 4,
    url: '/apps/email',
    icon: 'EmailOutline',
    title: 'Email',
    type: 'pages'
  },
  {
    id: 5,
    url: '/apps/chat',
    icon: 'MessageOutline',
    title: 'Chat',
    type: 'pages'
  },
  {
    id: 6,
    url: '/apps/calendar',
    icon: 'CalendarBlankOutline',
    title: 'Calendar',
    type: 'pages'
  },
  {
    id: 7,
    url: '/apps/invoice/list',
    icon: 'FormatListNumbered',
    title: 'Invoice List',
    type: 'pages'
  },
  {
    id: 8,
    url: '/apps/invoice/preview',
    icon: 'FileDocumentOutline',
    title: 'Invoice Preview',
    type: 'pages'
  },
  {
    id: 9,
    url: '/apps/invoice/edit',
    icon: 'PencilOutline',
    title: 'Invoice Edit',
    type: 'pages'
  },
  {
    id: 10,
    url: '/apps/invoice/add',
    icon: 'Plus',
    title: 'Invoice Add',
    type: 'pages'
  },
  {
    id: 11,
    url: '/apps/user/list',
    icon: 'AccountOutline',
    title: 'User List',
    type: 'pages'
  },
  {
    id: 12,
    url: '/apps/user/view',
    icon: 'FormatListNumbered',
    title: 'User View',
    type: 'pages'
  },
  {
    id: 13,
    url: '/apps/roles',
    icon: 'ShieldOutline',
    title: 'Roles',
    type: 'pages'
  },
  {
    id: 14,
    url: '/apps/permissions',
    icon: 'LockOutline',
    title: 'Permissions',
    type: 'pages'
  },
  {
    id: 15,
    url: '/pages/auth/login-v1',
    icon: 'Login',
    title: 'Login V1',
    type: 'pages'
  },
  {
    id: 16,
    url: '/pages/auth/login-v2',
    icon: 'Login',
    title: 'Login V2',
    type: 'pages'
  },
  {
    id: 17,
    url: '/pages/auth/login-with-appbar',
    icon: 'Login',
    title: 'Login With AppBar',
    type: 'pages'
  },
  {
    id: 18,
    url: '/pages/auth/register-v1',
    icon: 'AccountPlusOutline',
    title: 'Register V1',
    type: 'pages'
  },
  {
    id: 19,
    url: '/pages/auth/register-v2',
    icon: 'AccountPlusOutline',
    title: 'Register V2',
    type: 'pages'
  },
  {
    id: 20,
    url: '/pages/auth/forgot-password-v1',
    icon: 'LockOutline',
    title: 'Forgot Password V1',
    type: 'pages'
  },
  {
    id: 21,
    url: '/pages/auth/forgot-password-v2',
    icon: 'LockOutline',
    title: 'Forgot Password V2',
    type: 'pages'
  },
  {
    id: 22,
    url: '/pages/auth/reset-password-v1',
    icon: 'LockReset',
    title: 'Reset Password V1',
    type: 'pages'
  },
  {
    id: 23,
    url: '/pages/auth/reset-password-v2',
    icon: 'LockReset',
    title: 'Reset Password V2',
    type: 'pages'
  },
  {
    id: 24,
    url: '/pages/account-settings',
    icon: 'CogOutline',
    title: 'Account Settings',
    type: 'pages'
  },
  {
    id: 25,
    url: '/pages/pricing',
    icon: 'CurrencyUsd',
    title: 'Pricing',
    type: 'pages'
  },
  {
    id: 26,
    url: '/pages/faq',
    icon: 'HelpCircleOutline',
    title: 'FAQ',
    type: 'pages'
  },
  {
    id: 27,
    url: '/pages/knowledge-base',
    icon: 'BookOpenOutline',
    title: 'Knowledge Base',
    type: 'pages'
  },
  {
    id: 28,
    url: '/pages/misc/coming-soon',
    icon: 'ClockOutline',
    title: 'Coming Soon',
    type: 'pages'
  },
  {
    id: 29,
    url: '/pages/misc/under-maintenance',
    icon: 'Screwdriver',
    title: 'Under Maintenance',
    type: 'pages'
  },
  {
    id: 30,
    url: '/pages/misc/404-not-found',
    icon: 'AlertCircleOutline',
    title: 'Page Not Found - 404',
    type: 'pages'
  },
  {
    id: 31,
    url: '/pages/misc/401-not-authorized',
    icon: 'AccountMultipleRemoveOutline',
    title: 'Not Authorized - 401',
    type: 'pages'
  },
  {
    id: 32,
    url: '/pages/misc/500-server-error',
    icon: 'AccountMultipleRemoveOutline',
    title: 'Server Error - 500',
    type: 'pages'
  },
  {
    id: 33,
    url: '/pages/dialog-examples',
    icon: 'VectorArrangeBelow',
    title: 'Dialog Examples',
    type: 'pages'
  },
  {
    id: 34,
    url: '/ui/typography',
    icon: 'FormatTextVariantOutline',
    title: 'Typography',
    type: 'pages'
  },
  {
    id: 35,
    url: '/ui/icons',
    icon: 'StarOutline',
    title: 'Icons',
    type: 'pages'
  },
  {
    id: 36,
    url: '/ui/cards/basic',
    icon: 'CardOutline',
    title: 'Card Basic',
    type: 'pages'
  },
  {
    id: 37,
    url: '/ui/cards/statistics',
    icon: 'CardTextOutline',
    title: 'Card Statistics',
    type: 'pages'
  },
  {
    id: 38,
    url: '/ui/cards/advanced',
    icon: 'CardBulletedSettingsOutline',
    title: 'Card Advanced',
    type: 'pages'
  },
  {
    id: 39,
    url: '/ui/cards/gamification',
    icon: 'CardAccountDetailsOutline',
    title: 'Card Gamification',
    type: 'pages'
  },
  {
    id: 40,
    url: '/ui/cards/actions',
    icon: 'CardPlusOutline',
    title: 'Card Actions',
    type: 'pages'
  },
  {
    id: 41,
    url: '/ui/cards/widgets',
    icon: 'ChartBoxOutline',
    title: 'Card Widgets',
    type: 'pages'
  },
  {
    id: 42,
    url: '/components/accordion',
    icon: 'FullscreenExit',
    title: 'Accordion',
    type: 'pages'
  },
  {
    id: 43,
    url: '/components/alerts',
    icon: 'AlertOutline',
    title: 'Alerts',
    type: 'pages'
  },
  {
    id: 44,
    url: '/components/avatars',
    icon: 'AccountCircleOutline',
    title: 'Avatars',
    type: 'pages'
  },
  {
    id: 45,
    url: '/components/badges',
    icon: 'CircleOutline',
    title: 'Badges',
    type: 'pages'
  },
  {
    id: 46,
    url: '/components/buttons',
    icon: 'GestureTapButton',
    title: 'Buttons',
    type: 'pages'
  },
  {
    id: 47,
    url: '/components/button-group',
    icon: 'CheckboxMultipleBlankOutline',
    title: 'Button Group',
    type: 'pages'
  },
  {
    id: 48,
    url: '/components/chips',
    icon: 'CardOutline',
    title: 'Chips',
    type: 'pages'
  },
  {
    id: 49,
    url: '/components/dialogs',
    icon: 'TextBoxOutline',
    title: 'Dialogs',
    type: 'pages'
  },
  {
    id: 50,
    url: '/components/list',
    icon: 'FormatListBulleted',
    title: 'List',
    type: 'pages'
  },
  {
    id: 51,
    url: '/components/menu',
    icon: 'Menu',
    title: 'Menu',
    type: 'pages'
  },
  {
    id: 52,
    url: '/components/pagination',
    icon: 'DotsHorizontal',
    title: 'Pagination',
    type: 'pages'
  },
  {
    id: 53,
    url: '/components/ratings',
    icon: 'StarOutline',
    title: 'Ratings',
    type: 'pages'
  },
  {
    id: 54,
    url: '/components/snackbar',
    icon: 'AlertCircleOutline',
    title: 'Snackbar',
    type: 'pages'
  },
  {
    id: 55,
    url: '/components/tabs',
    icon: 'Tab',
    title: 'Tabs',
    type: 'pages'
  },
  {
    id: 56,
    url: '/components/toast',
    icon: 'RectangleOutline',
    title: 'Toast',
    type: 'pages'
  },
  {
    id: 57,
    url: '/components/timeline',
    icon: 'TimelineOutline',
    title: 'Timeline',
    type: 'pages'
  },
  {
    id: 58,
    url: '/components/tree-view',
    icon: 'FileTreeOutline',
    title: 'Tree View',
    type: 'pages'
  },
  {
    id: 59,
    url: '/components/more',
    icon: 'ViewGridPlusOutline',
    title: 'More Components',
    type: 'pages'
  },
  {
    id: 60,
    url: '/forms/form-elements/text-field',
    icon: 'Lastpass',
    title: 'TextField',
    type: 'pages'
  },
  {
    id: 61,
    url: '/forms/form-elements/select',
    icon: 'FormatListCheckbox',
    title: 'Select',
    type: 'pages'
  },
  {
    id: 62,
    url: '/forms/form-elements/checkbox',
    icon: 'CheckboxOutline',
    title: 'Checkbox',
    type: 'pages'
  },
  {
    id: 63,
    url: '/forms/form-elements/radio',
    icon: 'RadioboxMarked',
    title: 'Radio',
    type: 'pages'
  },
  {
    id: 64,
    url: '/forms/form-elements/textarea',
    icon: 'CardTextOutline',
    title: 'Textarea',
    type: 'pages'
  },
  {
    id: 65,
    url: '/forms/form-elements/autocomplete',
    icon: 'Lastpass',
    title: 'Autocomplete',
    type: 'pages'
  },
  {
    id: 66,
    url: '/forms/form-elements/pickers',
    icon: 'CalendarRange',
    title: 'Date Pickers',
    type: 'pages'
  },
  {
    id: 67,
    url: '/forms/form-elements/switch',
    icon: 'ToggleSwitchOutline',
    title: 'Switch',
    type: 'pages'
  },
  {
    id: 68,
    url: '/forms/form-elements/file-uploader',
    icon: 'TrayArrowUp',
    title: 'File Uploader',
    type: 'pages'
  },
  {
    id: 69,
    url: '/forms/form-elements/editor',
    icon: 'SquareEditOutline',
    title: 'Editor',
    type: 'pages'
  },
  {
    id: 70,
    url: '/forms/form-elements/slider',
    icon: 'TransitConnectionHorizontal',
    title: 'Slider',
    type: 'pages'
  },
  {
    id: 71,
    url: '/forms/form-elements/input-mask',
    icon: 'Lastpass',
    title: 'Input Mask',
    type: 'pages'
  },
  {
    id: 72,
    url: '/forms/form-layouts',
    icon: 'ViewGridOutline',
    title: 'Form Layouts',
    type: 'pages'
  },
  {
    id: 73,
    url: '/forms/form-validation',
    icon: 'AlertOutline',
    title: 'Form Validation',
    type: 'pages'
  },
  {
    id: 74,
    url: '/forms/form-wizard',
    icon: 'TransitConnectionHorizontal',
    title: 'Form Wizard',
    type: 'pages'
  },
  {
    id: 75,
    url: '/tables/mui',
    icon: 'Table',
    title: 'Table',
    type: 'pages'
  },
  {
    id: 76,
    url: '/tables/data-grid',
    icon: 'Table',
    title: 'Mui DataGrid',
    type: 'pages'
  },
  {
    id: 77,
    url: '/charts/apex-charts',
    icon: 'ChartLine',
    title: 'Apex Charts',
    type: 'pages'
  },
  {
    id: 78,
    url: '/charts/recharts',
    icon: 'ChartBellCurveCumulative',
    title: 'Recharts',
    type: 'pages'
  },
  {
    id: 79,
    url: '/charts/chartjs',
    icon: 'ChartBellCurve',
    title: 'ChartJS',
    type: 'pages'
  },
  {
    id: 80,
    url: '/acl',
    icon: 'ShieldOutline',
    title: 'Access Control (ACL)',
    type: 'pages'
  },
  {
    id: 81,
    img: '/images/icons/file-icons/doc.png',
    title: 'Passport Image',
    by: 'Herman Chapman',
    size: '1.7 mb',
    type: 'files'
  },
  {
    id: 82,
    img: '/images/icons/file-icons/xls.png',
    title: 'Questions',
    by: 'Lola Waters',
    size: '52 kb',
    type: 'files'
  },
  {
    id: 83,
    img: '/images/icons/file-icons/pdf.png',
    title: 'Parenting Guide',
    by: 'Ethan Spencer',
    size: '1.5 gb',
    type: 'files'
  },
  {
    id: 84,
    img: '/images/icons/file-icons/txt.png',
    title: 'Class Notes',
    by: 'Jerry Hughes',
    size: '2.3 mb',
    type: 'files'
  },
  {
    id: 85,
    img: '/images/icons/file-icons/xls.png',
    title: 'Class Attendance',
    by: 'Jessie Rivera',
    size: ' 30 kb',
    type: 'files'
  },
  {
    id: 86,
    img: '/images/icons/file-icons/pdf.png',
    title: 'Company Salary',
    by: 'Lizzie Lawson',
    size: '52 mb',
    type: 'files'
  },
  {
    id: 87,
    img: '/images/icons/file-icons/doc.png',
    title: 'Company Logo',
    by: 'Steve Sheldon',
    size: '29 mb',
    type: 'files'
  },
  {
    id: 88,
    img: '/images/icons/file-icons/js.png',
    title: 'Crime Rates',
    by: 'Myra Hammond',
    size: '1.3 mb',
    type: 'files'
  },
  {
    id: 89,
    img: '/images/icons/file-icons/pdf.png',
    title: 'Ulysses',
    by: 'Lena Briggs',
    size: '37 kb',
    type: 'files'
  },
  {
    id: 90,
    img: '/images/avatars/6.png',
    title: 'Nora Alvarado',
    email: 'nephrod@preany.co.uk',
    time: '21/05/2019',
    type: 'contacts'
  },
  {
    id: 91,
    img: '/images/avatars/4.png',
    title: 'Betty Davidson',
    email: 'seek@sparaxis.org',
    time: '14/01/2018',
    type: 'contacts'
  },
  {
    id: 92,
    img: '/images/avatars/3.png',
    title: 'Lilly Mitchell',
    email: 'vagary@unblist.org',
    time: '10/08/2019',
    type: 'contacts'
  },
  {
    id: 93,
    img: '/images/avatars/7.png',
    title: 'Fanny Bowers',
    email: 'designed@insanely.net',
    time: '01/12/2019',
    type: 'contacts'
  },
  {
    id: 94,
    img: '/images/avatars/8.png',
    title: 'Christina Leonard',
    email: 'unwieldable@unblist.org',
    time: '21/05/2019',
    type: 'contacts'
  },
  {
    id: 95,
    img: '/images/avatars/5.png',
    title: 'Lawrence Hopkins',
    email: 'museist@anaphyte.co.uk',
    time: '15/11/2019',
    type: 'contacts'
  },
  {
    id: 96,
    img: '/images/avatars/6.png',
    title: 'Abbey Darden',
    email: 'astema@defectively.co.uk',
    time: '07/05/2019',
    type: 'contacts'
  },
  {
    id: 97,
    img: '/images/avatars/1.png',
    title: 'Sophia Manning',
    email: 'fernando@storkish.co.uk',
    time: '13/08/2017',
    type: 'contacts'
  },
  {
    id: 98,
    img: '/images/avatars/3.png',
    title: 'Lydia Howard',
    email: 'furphy@cannibal.net',
    time: '11/08/1891',
    type: 'contacts'
  },
  {
    id: 99,
    img: '/images/avatars/5.png',
    title: 'Isaac Keller',
    email: 'insignia@markab.org',
    time: '18/01/2015',
    type: 'contacts'
  }
]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData = {
    pages: [],
    files: [],
    contacts: []
  }

  const includeData = {
    pages: [],
    files: [],
    contacts: []
  }
  searchData.forEach(obj => {
    const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
    if (isMatched && exactData[obj.type].length < 4) {
      exactData[obj.type].push(obj)
    }
  })
  searchData.forEach(obj => {
    const isMatched =
      !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
    if (isMatched && includeData[obj.type].length < 4) {
      includeData[obj.type].push(obj)
    }
  })

  return [
    200,
    [
      ...exactData.pages.concat(includeData.pages).slice(0, 4),
      ...exactData.files.concat(includeData.files).slice(0, 4),
      ...exactData.contacts.concat(includeData.contacts).slice(0, 4)
    ]
  ]
})
