import React from "react";
import MainLayout from "./MainLayout";
import AdminLayout from "./AdminLayout";
import { getUserRole } from "../utils/auth";

const RoleBasedProfileLayout = ({ children }) => {
  const role = getUserRole(); 
  const isAdmin = role === "ADMIN";

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default RoleBasedProfileLayout;
