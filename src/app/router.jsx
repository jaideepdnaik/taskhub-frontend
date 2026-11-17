import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import OrgLayout from '../layouts/OrgLayout'
import CreateOrgPage from '../pages/CreateOrgPage'
import DashboardPage from '../pages/DashboardPage'
import HomeRedirect from '../pages/HomeRedirect'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RegisterPage from '../pages/RegisterPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: 'orgs/new', element: <CreateOrgPage /> },
          {
            path: 'org/:orgId',
            element: <OrgLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              // Coming next: projects, projects/:projectId/board, my-tasks, ...
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
