import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import AssistantPage from '../pages/AssistantPage'
import AcceptInvitePage from '../pages/AcceptInvitePage'
import BoardPage from '../pages/BoardPage'
import OrgLayout from '../layouts/OrgLayout'
import CreateOrgPage from '../pages/CreateOrgPage'
import DashboardPage from '../pages/DashboardPage'
import HomeRedirect from '../pages/HomeRedirect'
import LoginPage from '../pages/LoginPage'
import MyTasksPage from '../pages/MyTasksPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotFoundSection from '../pages/NotFoundSection'
import NotificationsPage from '../pages/NotificationsPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import ProjectsPage from '../pages/ProjectsPage'
import RegisterPage from '../pages/RegisterPage'
import SettingsPage from '../pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      // Invite links need an account; signed-out users log in or register first.
      { path: '/invitations/accept', element: <AcceptInvitePage /> },
      { path: '/invite/:token', element: <AcceptInvitePage /> },
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
              { path: 'my-tasks', element: <MyTasksPage /> },
              { path: 'notifications', element: <NotificationsPage /> },
              { path: 'assistant/:conversationId?', element: <AssistantPage /> },
              { path: 'settings', element: <SettingsPage /> },
              { path: '*', element: <NotFoundSection /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
