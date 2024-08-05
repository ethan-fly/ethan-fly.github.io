import React from 'react';
import { Col, Row, Image } from 'antd';
import OlympicCountries from './components/medals';

// 定义栅格布局属性的常量
const responsiveColProps = {
  xs: { span: 24, offset: 0 },
  sm: { span: 24, offset: 0 },
  md: { span: 20, offset: 2 },
  lg: { span: 16, offset: 4 },
  xl: { span: 12, offset: 6 },
  xxl: { span: 12, offset: 6 },
};

const App: React.FC = () => (
  <>
    <Row>
      <Col className="gutter-row" {...responsiveColProps}>
        <div style={{ position: "sticky", "top": 0, zIndex: 1000, border: 0 }}>
          <Image
            src='../header.png'
            height={111}
            width={"100%"}
            style={{ position: "sticky", "top": 0, zIndex: 1000 }}
          ></Image>
        </div>
        <OlympicCountries />
      </Col>
    </Row>
  </>
);

export default App;