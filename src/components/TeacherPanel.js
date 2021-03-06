import { Col, Layout, Menu, Row, Typography } from "antd";
import React, { useState } from "react";
import "../styles/teacher-panel.css";
import Table from "antd/es/table";
import Tag from "antd/es/tag";
import { useProjectsList } from "../data/useProjectsList";
import ShowError from "./ShowError";
import Loading from "./Loading";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/Auth";
import Routes from "../constants/routes";
import "../styles/home-teacher.css";
import SearchColumnFilter from "./SearchColumnFilter";
import PlanReview from "./PlansReviewCollapse";

const { Content, Sider } = Layout;
const { Title } = Typography;

const TeacherPanel = () => {
  const [state, setState] = useState({
    idPlan: null,
    status: null,
    showPlanReview: false,
  });
  let location = useLocation();
  const { isAuthenticated, isCheckingAuth, currentUser } = useAuth();
  const { teachersProjects, meta, isLoading, isError } = useProjectsList();

  const [menuState, setMenuState] = useState({
    current: location.pathname, // set the current selected item in menu, by default the current page
    collapsed: false,
    openKeys: [],
  });
  const handleClick = (e) => {
    console.log("click ", e);
    setMenuState({
      ...menuState,
      current: e.key,
    });
  };
  //
  React.useEffect(() => {
    setMenuState({
      ...menuState,
      current: location.pathname,
    });
  }, [location, isAuthenticated]);

  const columns = [
    {
      title: "Nombre del Estudiante",
      dataIndex: "student_name",
      key: "student_name",
      width: 250,
      ...SearchColumnFilter("student_name"),
    },
    {
      title: "Tema",
      dataIndex: "title",
      key: "title",
      width: 800,
      ...SearchColumnFilter("title"),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 125,
      render: (status) => {
        let color = "";
        let name = "";
        {
          if (
            status === "plan_sent" ||
            status === "plan_corrections_done" ||
            status === "plan_saved"
          ) {
            color = "blue";
            name = "Por revisar";
          } else if (status === "plan_review_teacher") {
            color = "red";
            name = "Correcciones enviadas";
          } else if (
            status === "plan_approved_director" ||
            status === "san_curriculum_1" ||
            status === "plan_review_commission" ||
            status === "plan_corrections_done2"
          ) {
            color = "green";
            name = "Plan aprobado";
          } else if (status === "plan_approved_commission") {
            color = "purple";
            name = "Plan Aprobado por comisión";
          }
          return (
            <Tag color={color} key={status}>
              {name.toUpperCase()}
            </Tag>
          );
        }
      },
    },
  ];

  let pagination = {
    current: 1,
    pageSize: 10,
    total: 10,
    showSizeChanger: false,
  };
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError error={isError} />;
  }

  console.log(teachersProjects);

  const data = teachersProjects.map((project, index) => {
    return {
      key: index,
      title: project.title,
      student_name: project.student_name,
      status: project.status,
      id: project.id,
    };
  });

  if (meta) {
    pagination = {
      current: meta.current_page,
      pageSize: meta.per_page,
      total: meta.total,
      showSizeChanger: false,
    };
  }

  let content = "";
  let titleTable = "";
  if (!state.showPlanReview) {
    titleTable = (
      <Title level={3} style={{ color: "#034c70" }}>
        Planes y proyectos de titulación
      </Title>
    );

    content = (
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(data) => data.id}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.stopPropagation();
              setState({
                idPlan: record.id,
                status: record.status,
                showPlanReview: true,
              });
            },
          };
        }}
      />
    );
  } else {
    content = <PlanReview planId={state.idPlan} status={state.status} />;
  }

  // console.log("Pilas",getDataSource());

  return (
    <>
      <Row>
        <Col>
          <Title
            level={3}
            style={{
              color: "#034c70",
              marginLeft: -30,
            }}
          >
            Director:
          </Title>
        </Col>
      </Row>
      <Row>
        <Col>{titleTable}</Col>
      </Row>
      <Row>
        <Col>{content}</Col>
      </Row>
    </>
  );

  // <div style={ { height: 1500 } }>
  //   {/*<Menu mode='horizontal' className={ 'menus' } onClick={ handleClick }>*/}
  //     <Menu mode='horizontal' className={ 'menus' }>
  //     <Menu.Item key='notification' icon={ <BellOutlined /> } />
  //     {
  //       isAuthenticated
  //         ? <SubMenu icon={ <UserOutlined /> } title={ currentUser && currentUser.name }>
  //           <Menu.Item key='password'>Cambiar clave</Menu.Item>
  //
  //           <Menu.Item key={ Routes.LOGIN }>
  //             <Link to={ Routes.LOGOUT } className='logout-link'>
  //               {
  //                 isCheckingAuth
  //                   ? <LoadingOutlined />
  //                   : <><LogoutOutlined /> Cerrar sesión </>
  //               }
  //             </Link>
  //           </Menu.Item>
  //         </SubMenu>
  //         : <Menu.Item key={ Routes.LOGIN }>
  //           <Link to={ Routes.LOGIN }>
  //             {
  //               isCheckingAuth
  //                 ? <LoadingOutlined />
  //                 : <><LoginOutlined /> Ingresar</>
  //             }
  //           </Link>
  //         </Menu.Item>
  //     }
  //   </Menu>
  //   <Card className={ 'statistics' }>
  //     <h1 className={ 'titles' }>Director</h1>
  //     <Card className={ 'statistics-content' } title='Tesis dirigidas' bordered={ false }>
  //       <p className={ 'numbers' }>10</p>
  //     </Card>
  //
  //     <Card className={ 'statistics-content2' } title='Planes por revisar' bordered={ false }>
  //       <p className={ 'numbers' }>2</p>
  //     </Card>
  //
  //     <Card className={ 'statistics-content2' } title='Proyectos por revisar' bordered={ false }>
  //       <p className={ 'numbers' }>2</p>
  //     </Card>
  //
  //     <h1 className={ 'jury' }>Jurado</h1>
  //
  //     <Card className={ 'jury-statistics' } title='Proyectos por revisar' bordered={ false }>
  //       <p className={ 'numbers' }>1</p>
  //     </Card>
  //   </Card>
  //
  //   <Row className='principal'>
  //
  //     <h1 className={ 'title' }>
  //       Director
  //     </h1>
  //
  //     <h1 className={'subtitle1'}>
  //       Planes y proyectos de titulación
  //     </h1>
  //
  //     <br />
  //     <Search className={'searchInput'} placeholder="Búsqueda de tema o estudiante(s)" enterButton />
  //     <br />
  //
  //     <Col span={ 24 }>
  //
  //       <Row justify='center' >
  //         <Table
  //                dataSource={getDataSource()}
  //                columns={columns}
  //                locale={
  //                  {
  //                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
  //                                      description={<span>No hay proyectos ni planes registrados</span>}
  //                    />
  //                  }
  //                }
  //         />;
  //       </Row>
  //     </Col>
  //   </Row>
  //
  //   <Row className='resources'>
  //
  //     <h1 className={ 'title2' }>
  //       Otros recursos:
  //     </h1>
  //
  //     <Col span={ 24 }>
  //
  //       <Row justify='center' className={ 'principal-options' }>
  //         <Col span={ 6 }>
  //           <Card className={ 'options-resources' } bordered={ false }>
  //             <br />
  //             Mira las normativas de titulación de la EPN<br /><br />
  //             <Button
  // href={'https://esfot.epn.edu.ec/index.php/unidad-titulacion/normativa-proyectos-titulacion'}>Ver
  // normativas</Button> </Card> </Col> <Col span={ 6 }> <Card className={ 'options-resources' } bordered={ false }>
  // <br /> Mira los formatos de titulación de la EPN<br /><br /> <Button
  // href={'https://esfot.epn.edu.ec/index.php/solicitudes/documentos-solicitudes'}>Ver formatos</Button> </Card>
  // </Col> <Col span={ 6 } /> </Row> </Col> </Row>  <Row className='commission'>  <h1 className={ 'title3' }> Comisión
  // titulación: </h1>  <Col span={ 24 }>  <Row justify='center' className={ 'principal-options' }> <Col span={ 6 }>
  // <Card className={ 'options-commission' } title='Planes Comisión' bordered={ false }> <div> <SelectOutlined
  // className={ 'big-icon' } /> </div> <br /> Revisa los planes que llegan a la comisión de titulación<br /><br />
  // <Button>Ver planes</Button> </Card> </Col> <Col span={ 6 } /> <Col span={ 6 } /> </Row> </Col> </Row> </div>
};

export default TeacherPanel;
