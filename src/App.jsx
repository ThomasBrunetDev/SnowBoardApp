//Page pas authentifié
import PasAuthAccueil from "./Componnent/PasAuthComponent/PasAuthAccueil";
import LayoutPasAuth from "./Componnent/PasAuthComponent/LayoutPasAuth";

//Page authentifié
import LayoutAuth from "./Componnent/AuthComponent/LayoutAuth";
import AuthAccueil from "./Componnent/AuthComponent/AuthAccueil";
import Profil from "./Componnent/AuthComponent/Profil";
import Contact from "./Componnent/AuthComponent/Contact";
import Posts from "./Componnent/AuthComponent/Posts";
import Tracker from "./Componnent/AuthComponent/Tracker";

//Packages & Context
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from "./context/authContext";

//css
import './App.css';

function App() {
  const { user, isLoading } = useAuth();
  const routesPasAuth = [
    {
      path: "",
      element: <LayoutPasAuth />,
      children: [
        {
          index: true,
          element: <Navigate to='/accueil' replace />
        },
        {
          path: "accueil",
          element: <PasAuthAccueil />
        },
      ]
    },
    {
      path: "*",
      element: (
        <Navigate to={'/accueil'} replace />
      )
    }
  ]

  const routesAuth = [
    {
      path: "",
      element: <LayoutAuth />,
      children: [
        {
          index: true,
          element: <Navigate to={'/home'} replace />
        },
        {
          path: "home",
          element: <AuthAccueil />
        },
        {
          path: "profil",
          element: <Profil />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "posts",
          element: <Posts />
        },
        {
          path: "tracker",
          element: <Tracker />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to={'/home'} replace />
    }
  ]

  if (isLoading) {
    // setTimeout(() => {
      return <div className="spinner"></div>
    // }, 1000);
  }

  return (
    <RouterProvider router={createBrowserRouter(user ? routesAuth : routesPasAuth)} />
  )
}

export default App
