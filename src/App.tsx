import { GitHubBanner, Refine, } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import dataProvider, {
  GraphQLClient,
  liveProvider,
} from "@refinedev/nestjs-query";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { App as AntdApp } from "antd";
import { createClient } from "graphql-ws";
import { BrowserRouter, Outlet ,Route, Routes } from "react-router-dom";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { 
  DashboardOutlined, 
  ShopOutlined,
  TeamOutlined
} from "@ant-design/icons";

import { Dashboard } from "./pages/dashboard";
import { 
  CompanyList, 
  CompanyCreate, 
  CompanyEdit, 
  CompanyShow
} from "./pages/companies";

import {
  ContactList,
  ContactCreate,
  ContactEdit,
  ContactShow,
} from "./pages/contacts";

const API_URL = "https://api.crm.refine.dev/graphql";
const WS_URL = "wss://api.crm.refine.dev/graphql";

const gqlClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiamltLmhhbHBlcnRAZHVuZGVybWlmZmxpbi5jb20iLCJpYXQiOjE2OTQ2ODI0OTksImV4cCI6MTg1MjQ3MDQ5OX0.4PF7-VYY4tlpuvGHmsunaH_ETLd-N_ANSjEB_NiPExw`,
  },
});
const wsClient = createClient({ url: WS_URL });

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(gqlClient)}
                liveProvider={liveProvider(wsClient)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {
                      icon: <DashboardOutlined />,
                    },
                  },
                  {
                    name: "companies",
                    list: "/companies",
                    create: "/companies/create",
                    edit: "/companies/edit/:id",
                    show: "/companies/show/:id",
                    meta: {
                        canDelete: true,
                        icon: <ShopOutlined />,
                    },
                  },
                  {
                    name: "contacts",
                    list: "/contacts",
                    create: "/contacts/create",
                    edit: "/contacts/edit/:id",
                    show: "/contacts/show/:id",
                    meta: {
                        canDelete: true,
                        icon: <TeamOutlined />,
                    },
                  }
                 ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "XVroag-sqrzUq-cKABu3",
                  liveMode: "auto",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <ThemedLayoutV2>
                        <Outlet />
                      </ThemedLayoutV2>
                    }>
                      <Route path="/">
                        <Route index element={<Dashboard />} />
                      </Route>
                      <Route path="/companies">
                        <Route index element={<CompanyList />} />
                        <Route path="create" element={<CompanyCreate />} />
                        <Route path="edit/:id" element={<CompanyEdit />} />
                        <Route path="show/:id" element={<CompanyShow />} />
                      </Route>
                      <Route path="/contacts">
                        <Route index element={<ContactList />} />
                        <Route path="create" element={<ContactCreate />} />
                        <Route path="edit/:id" element={<ContactEdit />} />
                        <Route path="show/:id" element={<ContactShow />} />
                      </Route>
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
