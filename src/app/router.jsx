import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import BoardPage from '../pages/BoardPage'
import OrgLayout from '../layouts/OrgLayout'
import CreateOrgPage from '../pages/CreateOrgPage'
import DashboardPage from '../pages/DashboardPage'
import HomeRedirect from '../pages/HomeRedirect'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotFoundSection from '../pages/NotFoundSection'
import PlaceholderPage from '../pages/PlaceholderPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import ProjectsPage from '../pages/ProjectsPage'
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
              { path: 'projects', element: <ProjectsPage /> },
              { path: 'projects/:projectId', element: <ProjectDetailPage /> },
              { path: 'projects/:projectId/board', element: <BoardPage /> },
              { path: 'my-tasks', element: <PlaceholderPage title="My Tasks" step={6} /> },
              {
                path: 'notifications',
                element: <PlaceholderPage title="Notifications" step={6} />,
              },
              { path: 'settings', element: <PlaceholderPage title="Settings" step={7} /> },
              { path: '*', element: <NotFoundSection /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
