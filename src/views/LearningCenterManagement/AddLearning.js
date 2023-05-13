import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addLearning, beforeLearning } from './learning.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import validator from 'validator';
import { ENV } from 'config/config';
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import { Link } from 'react-router-dom'



const AddLearning = (props) => {

    const [data, setData] = useState({
        title: '',
        link: '',
        image: '',
        status: true,
        linkType: true,
        dashboard: true,
        gameIntegration: false,
    })

    const [titleMsg, setTitleMsg] = useState('')
    const [linkMsg, setLinkMsg] = useState('')
    const [previewImage, setPreviewImage] = useState('')




    const [loader, setLoader] = useState(true)
    const setMsgState = (obj) => {
        setMsg(obj)
        return;
    }
    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
    }, [])

    useEffect(() => {
        if (props.learnings.createAuth) {
            setLoader(false)
            props.beforeLearning()
            props.history.push(`/learning-center`)
        }
    }, [props.learnings.createAuth])

    const add = async () => {
        let check = true
        if (validator.isEmpty(data.title.trim())) {
            setTitleMsg('Title is Required')
            check = false
        }
        if (isValidURL(data.link)) {
            setLinkMsg('')
        }
        if (!validator.isEmpty(data.title.trim())) {
            setTitleMsg('')
        }
        if (!isValidURL(data.link)) {
            setLinkMsg('must include https:// or http://')
            check = false

        }
        //if no error occured
        if (check) {
            setLoader(true)
            props.addLearning(data)
        }
    }
    function isValidURL(string) {
        var expression = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        // var expression = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/
        var regex = new RegExp(expression);
        if (string.match(regex)) {
            return true
        } else {
            return false
        }
    };
    const fileSelectHandler = async (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = async () => {
            // 
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };


    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as="h4">Add Learning</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* <Row>
                                            <Col md="12" sm="6">

                                                <label>Image</label>
                                                <div className='mb-2'>
                                                    {<img src={previewImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} className="img-thumbnail" style={{ width: '100px' }} />}
                                                </div>
                                                <Form.Control className='text-white m-0 upload-img-file mb-3'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        setData({ ...data, image: e.target.files[0] });
                                                    }}
                                                    // placeholder="Title"
                                                    type="file"
                                                ></Form.Control>


                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.title ? data.title : ''}
                                                        onChange={(e) => {
                                                            setTitleMsg('')
                                                            setData({ ...data, title: e.target.value });
                                                        }}
                                                        placeholder="Title"
                                                        maxLength={50}
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={titleMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{titleMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Link<span className="text-danger">* must include https:// or http://</span></label>
                                                    <Form.Control
                                                        value={data.link ? data.link : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, link: e.target.value });
                                                        }}
                                                        placeholder="Link"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={linkMsg ? `` : `d-none`}>
                                                        {(data.link !== undefined || data.link !== '' || linkMsg) && <label className="pl-1 text-danger">{linkMsg}</label>}
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Link<span className="text-danger">* must include https:// or http://</span></label>
                                                    <Form.Control
                                                        value={data.link ? data.link : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, link: e.target.value });
                                                        }}
                                                        placeholder="Link"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={linkMsg ? `` : `d-none`}>
                                                        {(data.link !== undefined || data.link !== '' || linkMsg) && <label className="pl-1 text-danger">{linkMsg}</label>}
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Show in Dashboard<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2 ">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="dashboard" type="radio" checked={data.dashboard} value={data.dashboard} onChange={(e) => { setData({ ...data, dashboard: true }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, dashboard: true });
                                                            }} ><i />Yes</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="dashboard" type="radio" checked={!data.dashboard} value={!data.dashboard} onChange={(e) => { setData({ ...data, dashboard: false }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, dashboard: false });
                                                            }} ><i />No</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Show in Game Integration<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2 ">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="gameIntegration" type="radio" checked={data.gameIntegration} value={data.gameIntegration} onChange={(e) => { setData({ ...data, gameIntegration: true }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, gameIntegration: true });
                                                            }} ><i />Yes</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="gameIntegration" type="radio" checked={!data.gameIntegration} value={!data.gameIntegration} onChange={(e) => { setData({ ...data, gameIntegration: false }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, gameIntegration: false });
                                                            }} ><i />No</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Link Type<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="linkType" type="radio" checked={data.linkType} value={data.linkType} onChange={(e) => { setData({ ...data, linkType: true }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, linkType: true });
                                                            }} ><i />Video</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="linkType" type="radio" checked={!data.linkType} value={!data.linkType} onChange={(e) => { setData({ ...data, linkType: false }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, linkType: false });
                                                            }} ><i />Image</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => { setData({ ...data, status: true }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, status: true });
                                                            }} ><i />Active</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={!data.status} value={!data.status} onChange={(e) => { setData({ ...data, status: false }) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' onChange={(e) => {
                                                                setData({ ...data, status: false });
                                                            }} ><i />Inactive</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="6">
                                                <Button
                                                    className="btn-fill pull-right mt-3"
                                                    type="submit"
                                                    variant="info"
                                                    onClick={add}
                                                >
                                                    Add
                                                </Button>
                                                <Link to={'/learning-center'} className="float-right" >
                                                    <Button className="btn-fill pull-right mt-3" variant="info">
                                                        Back
                                                    </Button>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    learnings: state.learnings,
    error: state.error
});

export default connect(mapStateToProps, { addLearning, beforeLearning })(AddLearning);