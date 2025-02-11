import { Router } from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { VerifiedUserRoutes } from "../modules/VerifiedUser/vUser.route";
import { CrimeRoutes } from "../modules/CrimeReport/crime.route";
import { AdminRoutes } from "../modules/Admin/admin.route";

const router=Router()

type TModuleRoutes={
    path:string,
    route:Router,
}

const moduleRoutes:TModuleRoutes[]=[
    {
        path:"/users",
        route:UserRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/verified-users",
        route:VerifiedUserRoutes
    },
    {
        path:"/crimes",
        route:CrimeRoutes
    },
    {
        path:"/admin",
        route:AdminRoutes
    }
]

moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router