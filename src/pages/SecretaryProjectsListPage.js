import React, { useState } from "react";
import { Card, Col, Input, Row, Skeleton, Typography, Button } from "antd";
import "../styles/teacher-panel.css";
import Table from "antd/es/table";
import Tag from "antd/es/tag";
import ShowError from "../components/ShowError";
import { SearchOutlined } from "@ant-design/icons";
import "../styles/home-teacher.css";
import { useProjects } from "../data/useProjects";
import ProjectDetailSecretary from "../components/ProjectDetailSecretary";
import SubLayout from "../components/SubLayout";

const { Link } = Typography;
const { Title } = Typography;

const SecretaryProjectsListPage = () => {
  const { Search } = Input;
  const { projectsList, isLoading, isError } = useProjects();

  const [showProjectReview, setShowProjectReview] = useState(false);
  const [projectId, setProjectId] = useState(null);
  console.log("project", projectsList);

  if (isLoading) {
    return (
      <Row justify="center" gutter={30}>
        {[...new Array(9)].map((_, i) => (
          <Col xs={24} sm={12} md={8} style={{ marginBottom: 30 }} key={i}>
            <div style={{ textAlign: "center" }}>
              <Skeleton.Image style={{ width: 200 }} />
              <Card title="" extra="" cover="" loading />
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  console.log("error", isError);

  if (isError) {
    return <ShowError error={isError} />;
  }

  const columns = [
    {
      title: "Director(a)",
      dataIndex: "teacher_name",
      key: "teacher_name",
    },
    {
      title: "Estudiante(s)",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link
          onClick={() => {
            setProjectId(record.id);
            setShowProjectReview(true);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        let color;
        if (value === "plan_saved") {
          color = "green";
        } else {
          color = "blue";
        }
        return (
          <div>
            {
              <Tag color={color} key={value}>
                {value}
              </Tag>
            }
          </div>
        );
      },
    },
  ];

  let pagination = {
    current: 1,
    pageSize: 10,
    total: 10,
    showSizeChanger: false,
  };

  const getProjectsData = projectsList.map((project, index) => {
    return {
      key: index,
      id: project.id,
      teacher_name: project.teacher_name,
      student_name: "",
      title: project.title,
      status: project.status,
    };
  });

  const onSearch = (value) => console.log(value);
  let content = "";

  if (!showProjectReview) {
    content = (
      <SubLayout>
        <Row>
          <Col>
            <Title
                level={3}
                style={{
                  color: "#034c70",
                  marginLeft: -30,
                }}
            >
              Planes y proyectos de titulación:
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <Search
              placeholder="búsqueda de tema o estudiantes"
              onSearch={onSearch}
              enterButton=<Button
                style={{
                  backgroundColor: "#034c70",
                  color: "white",
                }}
                icon={<SearchOutlined />}
              />
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <Table columns={columns} dataSource={getProjectsData} />
          </Col>
        </Row>
      </SubLayout>
    );
  } else {
    content = <ProjectDetailSecretary id={projectId} />;
  }

  return content;
};

export default SecretaryProjectsListPage;
