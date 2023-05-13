import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeLearning, getLearning, updateLearning } from './learning.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import validator from 'validator';
import { ENV } from 'config/config';
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import { Link } from 'react-router-dom'
const EditLearning = (props) => {

    const [data, setData] = useState({
        title: '',
        link: '',
        image: '',
        status: false,
        linkType: true,
        dashboard: true,
        gameIntegration: true,
    })

    const [titleMsg, setTitleMsg] = useState('')
    const [linkMsg, setLinkMsg] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [viewCheck, setViewCheck] = useState(false)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        if (window.location.pathname.split('/')[2] === 'view-learning') {
            setViewCheck(true)
        }
        props.getLearning(window.location.pathname.split('/')[3])
    }, [])

    useEffect(() => {
        if (props.learnings.getlearningAuth) {
            const { title, link, linkType, image, dashboard, gameIntegration, status } = props.learnings.learning
            setData({ title, link, image, linkType, dashboard, gameIntegration, status, _id: window.location.pathname.split('/')[3] })
            props.beforeLearning()
            setLoader(false)
        }
    }, [props.learnings.getlearningAuth])

    useEffect(() => {
        if (props.learnings.editlearningsAuth) {
            setLoader(false)
            // props.beforeLearning()
            props.history.push(`/learning-center`)
        }
    }, [props.learnings.editlearningsAuth])


    const update = () => {
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

        if (check) {
            setLoader(true)
            // console.log("data: ",data)
            if(data.gameIntegration === undefined){
                delete data.gameIntegration
            }
            if(data.title){
                data.title = data.title.trim()
            }
            props.updateLearning(data, data._id)
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
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4">{viewCheck ? 'View' : 'Edit'} Learning Center</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* <Row>
                                            <Col md="12" sm="6">
                                                <label>Image</label>
                                                <div className='mb-2 '>
                                                    {<img src={previewImage ? previewImage : data.image} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} className="img-thumbnail" style={{ width: '100px' }} />}
                                                </div>
                                                <Form.Control className='text-white m-0 mb-3 upload-img-file'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        setData({ ...data, image: e.target.files[0] });
                                                    }}
                                                    disabled={viewCheck}
                                                    // placeholder="Title"
                                                    type="file"
                                                ></Form.Control>

                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="12">
                                                <Form.Group >
                                                    <label >Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.title ? data.title : ''}
                                                        onChange={(e) => {
                                                            setTitleMsg('')
                                                            setData({ ...data, title: e.target.value });
                                                        }}
                                                        disabled={viewCheck}
                                                        placeholder="Title"
                                                    maxLength={50}
                                                        type="text"
                                                    ></Form.Control>
                                                    {console.log("titleMsg: ",titleMsg)}
                                                    <span className={titleMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{titleMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Link<span className="text-danger">* must include https:// or http://</span></label>
                                                    <Form.Control
                                                        value={data.link ? data.link : ''}
                                                        onChange={(e) => {
                                                            setLinkMsg('')
                                                            setData({ ...data, link: e.target.value });
                                                        }}
                                                        placeholder="Link"
                                                        disabled={viewCheck}
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={linkMsg ? `` : `d-none`}>
                                                        {(data.link !== undefined || linkMsg) && <label className="pl-1 text-danger">{linkMsg ? linkMsg : ''}</label>}
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center'>
                                                    <label>Show in dashboard<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="dashboard" type="checkbox" checked={data.dashboard} value={data.dashboard} onChange={(e) => setData({ ...data, dashboard: true })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, dashboard: true });
                                                        }} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="dashboard" type="checkbox" checked={!data.dashboard} value={!data.dashboard} onChange={(e) => setData({ ...data, dashboard: false })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, dashboard: false });
                                                        }} ><i />No</span>
                                                    </label>

                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center'>
                                                    <label>Show in Game Integration<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="gameIntegration" type="checkbox" checked={data.gameIntegration} value={data.gameIntegration} onChange={(e) => setData({ ...data, gameIntegration: true })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, gameIntegration: true });
                                                        }} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="gameIntegration" type="checkbox" checked={!data.gameIntegration} value={!data.gameIntegration} onChange={(e) => setData({ ...data, gameIntegration: false })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, gameIntegration: false });
                                                        }} ><i />No</span>
                                                    </label>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center'>
                                                    <label>Link Type<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="linkType" type="checkbox" checked={data.linkType} value={data.linkType} onChange={(e) => setData({ ...data, linkType: true })} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, linkType: true });
                                                        }} ><i />Video</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="linkType" type="checkbox" checked={!data.linkType} value={!data.linkType} onChange={(e) => setData({ ...data, linkType: false })} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, linkType: false });
                                                        }} ><i />Image</span>
                                                    </label>

                                                </Form.Group>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center'>
                                                    <label>Status<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="status" type="checkbox" checked={data.status} value={data.status} onChange={(e) => setData({ ...data, status: true })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, status: true });
                                                        }} ><i />Active</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="status" type="checkbox" checked={!data.status} value={!data.status} onChange={(e) => setData({ ...data, status: false })} disabled={viewCheck}/>
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, status: false });
                                                        }} ><i />Inactive</span>
                                                    </label>

                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                {
                                                    !viewCheck ?
                                                        <Button
                                                            className="btn-fill pull-right mt-3"
                                                            type="submit"
                                                            variant="info"
                                                            onClick={update}
                                                        >
                                                            Update
                                                        </Button>
                                                        : ''
                                                }
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

export default connect(mapStateToProps, { beforeLearning, getLearning, updateLearning })(EditLearning);