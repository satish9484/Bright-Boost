import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./header";
import "./style.scss";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const PageLayout = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout className="site-layout">
        <div className="box-shadow">
          <AppHeader />
        </div>
        <Content>
          <div className="content-body">
            <div className="content-wrap">
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
