// ** Icon imports
import ShieldOutline from "mdi-material-ui/ShieldOutline";

// ** Config
import authConfig from "src/configs/auth";

const Navigation = () => {
  const userData = JSON?.parse(
    window.localStorage.getItem(authConfig.userData)
  );

  const TeleMarketerNavigation = [
    {
      path: "/call_logs/list",
      action: "read",
      icon: ShieldOutline,
      title: "Call Logs",
    },
    {
      path: "/phonebook",
      action: "read",
      subject: "acl-page",
      icon: ShieldOutline,
      title: "Tele-Prescribers",
    },
    {
      path: "/flagged_numbers",
      icon: ShieldOutline,
      title: "Flagged Numbers",
    },
  ];

  let navigation = [
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
      title: "Training List",
    },
    {
      path: "/training_prescribers",
      action: "read",
      icon: ShieldOutline,
      title: "Training Prescribers",
    },
    {
      path: "/teams/list",
      action: "read",
      icon: ShieldOutline,
      title: "Teams",
    },
    {
      path: "/tele-marketers",
      action: "read",
      icon: ShieldOutline,
      title: "Tele-Marketers",
    },
    {
      path: "/tele-prescribers",
      action: "read",
      icon: ShieldOutline,
      title: "Tele-Prescribers",
    },
    {
      path: "/call_logs/list",
      action: "read",
      icon: ShieldOutline,
      title: "Call Logs",
    },

    {
      path: "/flagged_numbers",
      icon: ShieldOutline,
      title: "Flagged Numbers",
    },
  ];

  if (userData?.roleId === 4) {
    navigation = [];
    navigation.push(
      {
        path: "/phonebook",
        action: "read",
        subject: "acl-page",
        icon: ShieldOutline,
        title: "Tele-Prescribers",
      },

      {
        path: "/fax_logs/list",
        action: "read",
        subject: "acl-page",
        icon: ShieldOutline,
        title: "Fax Logs",
      },
      {
        path: "/call_scheduled/list",
        action: "read",
        subject: "acl-page",
        icon: ShieldOutline,
        title: "Call Scheduled",
      }
    );
  }

  if (userData?.roleId === 5) {
    return TeleMarketerNavigation;
  } else {
    return navigation;
  }
};

export default Navigation;
