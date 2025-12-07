import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home";
import Services from "../Pages/Services";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import Profile from "../Pages/Profile";
import PrivateRoute from "./PrivateRoute";
import ServicesDetails from "../Pages/ServicesDetails";
import Forgetpass from "../Pages/Forgetpass";
import Error from "../Pages/Error";
import AddServices from "../Pages/AddServices";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error></Error>,
    children:[
        {
            index: true,
            Component: Home,
        },
        {
          path: "/services",
          Component: Services,
        },
        {
          path:"/login",
          Component: Login,
        },
        {
          path: "/registration",
          Component: Registration,
        },
        {
          path: "/profile",
          element: <PrivateRoute><Profile></Profile></PrivateRoute>
        },
        {
          path: "/details/:id",
          element: <PrivateRoute><ServicesDetails></ServicesDetails></PrivateRoute>
        },
        {
          path: "/forget/:email",
          element: <Forgetpass></Forgetpass>
        },
        {
          path: "add-services",
          element: <AddServices></AddServices>
        }
    ]
  },
]);

export default router;