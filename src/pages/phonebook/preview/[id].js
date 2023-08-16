import { useContext } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AbilityContext } from "src/layouts/components/acl/Can";
// ** Demo Components Imports
import Preview from "./index";

const InvoicePreview = ({ id }) => {
  const ability = useContext(AbilityContext);

  return (
    <div>{ability?.can("read", "acl-page") ? <Preview id={id} /> : null}</div>
  );
};

export const getStaticPaths = async () => {
  const paths = [];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = ({ params }) => {
  return {
    props: {
      id: params?.id,
    },
  };
};

InvoicePreview.acl = {
  action: "read",
  subject: "acl-page",
};

export default InvoicePreview;
