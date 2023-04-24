import { Outlet } from "react-router-dom";
import Header from "./Header/index";
import Footer from "./Footer/index";
import ModelLogin from "../Login/ModelLogin/index";
export default function Layout() {
    return (
        <div>
            <ModelLogin/>
            <Header/>
                <Outlet/>
            <Footer/>
        </div>
    )
}