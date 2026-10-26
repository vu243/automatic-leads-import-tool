import { App as AntApp, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import LeadImport from './pages/LeadImport';

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AntApp>
        <LeadImport />
      </AntApp>
    </ConfigProvider>
  );
}
