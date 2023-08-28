import { useDispatch, useSelector } from "react-redux";

// ** Demo Components Imports
import Preview from "./index";
// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

const InvoicePreview = ({ email }) => {
  console.log(email);
  return <Preview email={email} />;
};

export const getStaticPaths = async () => {
  const paths = [];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = ({ params }) => {
  console.log(params);
  return {
    props: {
      email: params?.email,
    },
  };
};

InvoicePreview.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
InvoicePreview.guestGuard = true;

export default InvoicePreview;
