import React from 'react';
import { Collapse, Row, Col } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import PlanFormTeacher from './PlanReviewTeacher';
import '../styles/plan-collapse.css'

const { Panel } = Collapse;

const PlanReview = ( props ) => {


  return (
    <>
      <Row>
        <Col span={24} className='planCollapse'>
          <Collapse
            bordered={ false }
            defaultActiveKey={ [ '1' ] }
            expandIcon={ ( { isActive } ) => <CaretRightOutlined rotate={ isActive
              ? 90
              : 0 } /> }
            className='site-collapse-custom-collapse'
          >
            <Panel header='Plan de titulación' key='1' className='site-collapse-custom-panel'>
              <PlanFormTeacher idPlan={ props.planId } />
            </Panel>
            <Panel header='Proyecto de titulación' key='2' className='site-collapse-custom-panel'>
              <p>Aqui va el proyecto</p>
            </Panel>
          </Collapse>
        </Col>
      </Row>

    </>
  );
};

export default PlanReview;