import { createHashRouter } from "react-router-dom";
import App from "../App";
import HomeLayout from "../layouts/homeLayout";
import Home from "../pages/home/home";
import Skills from "../pages/prompt/skills";
import SkillDetail from "../pages/prompt/skillDetail";
import Favorite from "../pages/favorite/favorite";
import Login from "../pages/member/login";
import NotFound from "../pages/notFound";
import FavoriteLayout from "../layouts/favoriteLayout";
import adminRoutes from "./adminRoutes";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "skills",
            element: <Skills />,
          },
          {
            path: "skills/:id",
            element: <SkillDetail />,
          },
          {
            element: <FavoriteLayout />,
            children: [
              {
                path: "favorites",
                element: <Favorite />,
              },
            ],
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
      adminRoutes,
    ],
  },
]);

export default router;
