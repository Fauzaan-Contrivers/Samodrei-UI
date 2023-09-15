
import { useDispatch, useSelector } from 'react-redux'

// ** Demo Components Imports
import Preview from './index'

const InvoicePreview = ({ id }) => {
  return <Preview id={id} />
}

export const getStaticPaths = async () => {
  const paths = [];

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      id: params?.id
    }
  }
}

export default InvoicePreview
