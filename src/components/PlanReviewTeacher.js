import {
  Col, Row, Form, Input, Upload, Button, Select, Typography, message,
  Modal, Image
} from 'antd';
import React, { useState } from 'react';
import '../styles/plan-form.css';
import {
  PlusOutlined, SendOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import Routes from '../constants/routes';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../providers/Auth';
import withAuth from '../hocs/withAuth';
import { useTeachers } from '../data/useTeachers';
import Loading from './Loading';
import API from '../data';
import { usePlanContent } from '../data/usePlan';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

const getBase64 = ( file, callback ) => {
  console.log( 'file', file );
  const reader = new FileReader();
  reader.addEventListener( 'load', () => callback( reader.result ) );
  reader.readAsDataURL( file );
};

const PlanFormTeacher = ( {
  visible,
  update,
  idPlan
} ) => {

  const [ form ] = Form.useForm();

  const getProjectData = () => {
    const formData = form.getFieldsValue();
    return formData.bibliography !== undefined && formData.general_objective !== undefined && formData.hypothesis !== undefined && formData.justification !== undefined && formData.knowledge_area !== undefined && formData.methodology !== undefined && formData.problem !== undefined && formData.project_type !== undefined && formData.research_line !== undefined && formData.specifics_objectives !== undefined && formData.work_plan !== undefined;
  };

  let location = useLocation();
  // const { projects, isError, isLoading } = useProject();
  const { plan, isLoading } = usePlanContent( idPlan );
  const { teachers } = useTeachers();
  const [ imageUrl, setImageUrl ] = useState( null );
  const [ fileList, setFileList ] = useState( [] );
  const [ sending, setSending ] = useState( false );
  const [ isFinished, setIsFinished ] = useState( () => getProjectData() );

  console.log( plan, isFinished );

  const [ menuState, setMenuState ] = useState( {
    current: location.pathname, // set the current selected item in menu, by default the current page
    collapsed: false,
    openKeys: []
  } );

  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16
    },
  };

  const validateMessages = {
    required: '${label} es requerido!',
    types: {
      email: '${label} is not validate email!',
      number: '${label} is not a validate number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };



  const onSentComments = async( values ) => {
    setSending( true );
    const data = { ...values };

    console.log( 'DATOS', data );

    try {
      await API.post( `/projects/${ plan.id }`, data ); // put data to server
      setSending( false );
      message.success( 'Cambios guardados correctamente!' );
    } catch( e ) {
      console.log( 'ERROR', e );
      message.error( `No se guardaron los datos:¨${ e }` );
    }
  };

  const onCompleteForm = () => {
    const formData = form.getFieldsValue();
    if( formData.bibliography !== undefined && formData.general_objective !== undefined && formData.hypothesis !== undefined && formData.justification !== undefined && formData.knowledge_area !== undefined && formData.methodology !== undefined && formData.problem !== undefined && formData.project_type !== undefined && formData.research_line !== undefined && formData.specifics_objectives !== undefined && formData.work_plan !== undefined ) {
      setIsFinished( true );
    }
    console.log( 'FORM', formData );
  };

  const modal = () => {
    confirm( {
      icon: <ExclamationCircleOutlined />,
      title: '¿Estás seguro de mandar el plan?',
        content: 'Una vez aprobado se enviará a la comisión de titulación para su revisión.',
      okText: 'Si',
      cancelText: 'No',
      onOk() {
        onFinish();
      },
      onCancel() {
        console.log( 'Cancel' );
      },
      okButtonProps: { style: { backgroundColor: '#034c70' } }
    } );
  };

  const onFinish = async() => {
    const data = form.getFieldsValue();
    let dataToSent = {
      ...data,
      status: 'plan_approved_director'
    };
    try {
      await API.post( `/projects/${ plan.id }`, dataToSent ); // put data to server
      setSending( false );
      confirm( {
        icon: <CheckCircleOutlined />,
        title: <Title level={ 3 } style={ { color: '#034c70' } }>¡Buen trabajo!</Title>,
        content:
          <>
            <Row justify='center'>
              <Col>
                <Image src='boy.png' width={ 100 } /><Image src='girl.png' width={ 100 } />
              </Col>
            </Row>

            <Row>
              <Col>
                <p style={ { color: '#034c70' } }>
                  Gracias por tu esfuerzo en revisar el plan,
                  <br />
                  <strong>ha sido enviado a la comisión</strong>.
                </p>
              </Col>
            </Row>
          </>,
        okText: 'Entendido',
        okButtonProps: {
          href: Routes.HOME,
          style: {
            backgroundColor: '#034c70',
            marginRight: 125
          }
        },
        cancelButtonProps: { hidden: true }
      } );
    } catch( e ) {
      console.log( 'ERROR', e );
      message.error( `No se guardaron los datos:¨${ e }` );
    }

  };


  const normPhotoFile = e => {
    console.log( 'Upload event:', e );
    const file = e.file;
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if( !isJpgOrPng ) {
      message.error( 'La imagen debe tener formato JPG o PNG' );
      setFileList( [] );
      setImageUrl( null );
      return null;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if( !isLt2M ) {
      message.error( 'La imagen debe ser menor a 2MB' );
      setFileList( [] );
      setImageUrl( null );
      return null;
    }

    if( file.status === 'removed' ) {
      setFileList( [] );
      setImageUrl( null );
      return null;
    }

    getBase64( e.file, imageUrl => setImageUrl( imageUrl ) );

    if( Array.isArray( e ) ) {
      return e;
    }

    console.log( 'e.file', e.file );
    console.log( 'e.fileList', e.fileList );
    setFileList( [ file ] );

    return e && [ e.file ];
  };

  const { isAuthenticated } = useAuth();

  React.useEffect( () => {
    setMenuState( {
      ...menuState,
      current: location.pathname
    } );
  }, [ location, isAuthenticated ] );


  if( isLoading ) {
    return <Loading />;
  }

  return (
    <>

      <Row>
        <Col>
          <Title level={ 4 }>{ plan[ 'students' ].length > 0
            ? plan[ 'students' ][ 0 ][ 'name' ]
            : '' }</Title>
          <Title level={ 5 }>{ plan.title }</Title>
        </Col>
      </Row>


      <Row>
        <Col span={ 24 }>
          <Title level={ 4 }
                 style={ {
                   color: '#034c70',
                   marginLeft: 30,
                   marginTop: 40
                 } }>Datos Generales</Title>
          <Form.Provider onFormChange={ onCompleteForm }>
            <Form { ...layout }
                  name='nest-messages'
                  onFinish={ onSentComments }
                  initialValues={ plan }
                  validateMessages={ validateMessages }
                  form={ form }
            >
              <Row justify='center'>
                <Col>
                  <Form.Item name='teacher_id'
                             label='Seleccione su director'
                             rules={ [ { required: true } ] }>
                    <Select placeholder='Seleccione'
                            style={ { width: 300 } }
                            loading={ isLoading }
                            disabled={ true }>
                      {
                        teachers && teachers.map( ( teacher, index ) =>
                          <Option value={ teacher.id } key={ index }>{ teacher.name }</Option>
                        )
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item name='codirector'
                             label='Seleccione su co-director'>
                    <Input
                      style={ { width: 300 } }
                      placeholder='Nombre del co-director'
                    />
                  </Form.Item>
                  <Form.Item name='partner' label='Seleccione su compañero'>
                    <Select placeholder='Seleccione' style={ { width: 300 } }>
                      <Option value='jack'>Jack</Option>
                      <Option value='lucy'>Lucy</Option>
                      <Option value='Yiminghe'>yiminghe</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='project_type' label='Tipo de proyecto'>
                    <Select placeholder='Seleccione' style={ { width: 300 } }>
                      <Option value='areaInvestigation'>Investigación de campo</Option>
                      <Option value='documentalInvestigation'>Investigación documental</Option>>
                    </Select>
                  </Form.Item>
                  <Form.Item name='research_line'
                             label='Línea de investigación'>
                    <Select placeholder='Seleccione' style={ { width: 300 } }>
                      <Option value='jack'>Jack</Option>
                      <Option value='lucy'>Lucy</Option>
                      <Option value='Yiminghe'>yiminghe</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name='knowledge_area'
                             label='Área de investigación'>
                    <Select placeholder='Seleccione' style={ { width: 300 } }>
                      <Option value='jack'>Jack</Option>
                      <Option value='lucy'>Lucy</Option>
                      <Option value='Yiminghe'>yiminghe</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Title justify={ 'left' }
                         level={ 4 }
                         style={ {
                           color: '#034c70',
                           marginLeft: 30,
                           marginTop: 50
                         } }>Plan</Title>
                </Col>
              </Row>

              <Row justify={ 'left' }>
                <Col>
                  <Form.Item name='title' label='Título' rules={ [ { required: true } ] }>
                    <TextArea
                      style={ { width: 600 } }
                      placeholder='Máximo 15 palabras'
                      autoSize={ {
                        minRows: 1,
                        maxRows: 4
                      } }
                    />
                  </Form.Item>
                  <Form.Item name='problem'
                             label='Planteamiento del problema'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='justification' label='Justificación'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='hypothesis' label='Hipótesis'>
                    <TextArea style={ { width: 600 } }
                              placeholder='Si no aplica escribir N/A'
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='general_objective'
                             label='Objetivo General'
                  >
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='specifics_objectives' label='Objetivos Específicos'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='methodology' label='Metodología'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='work_plan' label='Plan de trabajo'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item name='schedule' label='Cronograma' getValueFromEvent={ normPhotoFile }>
                    <Upload name='files'
                            accept='image/jpeg,image/png'
                            listType='picture-card'
                            multiple={ false }
                            showUploadList={ false }
                            beforeUpload={ () => false }
                            fileList={ fileList }
                    >
                      { imageUrl
                        ? <img src={ imageUrl } alt='Foto' style={ { width: '180px' } } />
                        : <div>
                          <PlusOutlined />
                          <div className='ant-upload-text'>Subir imagen</div>
                        </div> }
                    </Upload>
                  </Form.Item>
                  <Form.Item name='bibliography' label='Bibliografía'>
                    <TextArea style={ { width: 600 } }
                              autoSize={ {
                                minRows: 2,
                                maxRows: 6
                              } }
                    />
                  </Form.Item>
                  <Form.Item { ...tailLayout }>
                    <Button className={ 'submit' } htmlType='submit' loading={ sending }>
                      Enviar Comentarios
                    </Button>
                    <Button className={ 'submit' }
                            onClick={ modal }
                            disabled={ !isFinished }>
                      <SendOutlined /> Aprobar Plan
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Form.Provider>
        </Col>
      </Row>


    </>
  );
};

export default withAuth( PlanFormTeacher );