// ** Icon imports
import ShieldOutline from "mdi-material-ui/ShieldOutline";

// ** Config
import authConfig from "src/configs/auth";

const navigation = () => {
  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  const navigation = [
    {
      path: "/dashboard",
      action: "read",
      icon: ShieldOutline,
      title: "Dashboard",
    },
    {
      path: "/analytics",
      action: "read",
      icon: ShieldOutline,
      title: "Analytics",
    },
    {
      path: "/jobs/list",
      action: "read",
      icon: ShieldOutline,
      title: "Jobs",
    },
    {
      path: "/prescribers/list",
      action: "read",
      icon: ShieldOutline,
      title: "Prescribers",
    },
    {
      path: "/product_advocates/list",
      action: "read",
      icon: ShieldOutline,
      title: "Product Advocates",
    },
    {
      path: "/samples/list",
      action: "read",
      icon: ShieldOutline,
      title: "Samples",
    },
    {
      path: "/flagged_addresses",
      action: "read",
      icon: ShieldOutline,
      title: "Flagged Addresses",
    },
    {
      path: "/users",
      action: "read",
      icon: ShieldOutline,
      title: "Dashboard Users",
    },
    {
      path: "/prescribers-list",
      action: "read",
      icon: ShieldOutline,
      title: "Prescriber's List",
    },
    {
      path: "/training_prescribers",
      action: "read",
      icon: ShieldOutline,
      title: "Training Prescribers",
    },
    {
      path: "/tele-marketers",
      action: "read",
      icon: ShieldOutline,
      title: "Tele-Marketers",
    },

    {
      path: "/flagged_numbers",
      icon: ShieldOutline,
      title: "Flagged Numbers",
    },
  ];

  if (userData?.roleId === 4) {
    navigation.push({
      path: "/phonebook",
      action: "read",
      subject: "acl-page",
      icon: ShieldOutline,
      title: "Phonebook",
    });
  }

  return navigation;
};

export default navigation;
