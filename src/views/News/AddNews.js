import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createNews, beforeNew, getNew, updateNews } from './News.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import validator from 'validator';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom'
import TinyMCE from '../../components/TinyMCE/tinyMCE'
const AddNews = (props) => {
    //
    const { newsId } = useParams()
    //
    const [Id, setId] = useState(newsId ? newsId : "")
    const [previewImage, setPreviewImage] = useState("")
    const [detail, setDetail] = useState({
        title: '',
        description: '',
        thumbnail: '',
        homepage: true,
        status: true
    })
    const [description, setDescription] = useState(null)
    const [balancer, setBalancer] = useState(true)

    const [msg, setMsg] = useState({
        title: '',
        description: '',
        thumbnail: ''
    })

    const [loader, setLoader] = useState(true)
    const [viewCheck, setViewCheck] = useState(false)

    useEffect(() => {
        window.scroll(0, 0)
        if (window.location.href.split('/')[4] === 'view-news') {
            setViewCheck(true)
        }
        setLoader(false)
    }, [])

    //If Id exist then edit News
    useEffect(() => {
        if (newsId) {
            setId(newsId)
            props.getNew(newsId)
        }
        else {
            setBalancer(!balancer)
        }
    }, [newsId])


    // useEffect(()=>{  
    //     
    // }, [detail])

    //getNewAuth
    useEffect(() => {
        if (props.news.getNewAuth) {
            const { title, thumbnail, description, homepage, status } = props.news.new.news
            setDetail({ title, thumbnail, description, homepage, status })
            setBalancer(!balancer)
            props.beforeNew()
            setLoader(false)
        }
    }, [props.news.getNewAuth])
    useEffect(() => {
        if (props.news.createAuth) {
            setLoader(false)
            props.beforeNew()
            props.history.push(`/news`)
        }
    }, [props.news.createAuth])

    //edit complete
    useEffect(() => {
        if (props.news.editNewAuth) {
            setLoader(false)
            props.beforeNew()
            props.history.push(`/news`)
        }
    }, [props.news.editNewAuth])
    const add = () => {
        if (!validator.isEmpty(detail.title.trim()) && !validator.isEmpty(detail.description.trim()) && !validator.isEmpty(detail.thumbnail ? detail.thumbnail + "" : "")) {
            setMsg({
                title: '',
                description: '',
                thumbnail: ''
            })
            setLoader(true)
            if (Id) {
                props.updateNews(Id, detail)
            }
            else {

                props.createNews({ title: detail.title, thumbnail: detail.thumbnail, description: detail.description, status: detail.status, homepage: detail.homepage })
            }

        }
        else {
            let title = ''
            let description = ''
            let thumbnail = ''
            if (validator.isEmpty(detail.title.trim())) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(detail.description.trim())) {
                description = 'Description Required.'
            }
            if (!detail.thumbnail) {
                thumbnail = 'Thumnail Required.'
            }
            setMsg({ title, description, thumbnail })
        }
    }

    useEffect(()=>{
    },[description])
  
    const handleImageUploadBefore = (files, info, uploadHandler) => {
        // uploadHandler is a function
        console.log(files, info)
    }
    const fileSelectHandler = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            // 
            if( files[0].type.split('/')[0] === 'image' ){
                setPreviewImage(reader.result);
                setMsg({ ...msg , thumbnail : '' })
            }
            else{
                setMsg({ ...msg , thumbnail : 'Invalid File Format'  })
                setPreviewImage('');
            }
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
                                        <Card.Title as="h4">{ Id ? (viewCheck ? "View ": "Edit ") : "Add "}News</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Thumbnail<span className="text-danger"> *</span></label>
                                                <div className='mb-2'>
                                                    {<img src={previewImage ? previewImage : detail.thumbnail} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} className="img-thumbnail" style={{ width: '100px' }} />}

                                                </div>
                                                <Form.Control className='text-white m-0 upload-img-file mb-3'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        if(e.target.files[0].type.split('/')[0] === 'image'){
                                                            setDetail({ ...detail, thumbnail: e.target.files[0] });
                                                        }
                                                        else{
                                                            setDetail({ ...detail, thumbnail: '' });
                                                        }
                                                    }}
                                                    // placeholder="Title"
                                                    disabled={viewCheck}
                                                    type="file"
                                                >
                                                </Form.Control>
                                                <span className={msg.thumbnail ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.thumbnail}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.title ? detail.title : ''}
                                                        onChange={(e) => {

                                                            setDetail({ ...detail, title: e.target.value });
                                                        }}
                                                        maxLength={50} //50 character
                                                        disabled={viewCheck}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <TinyMCE 
                                                    // initialValue={detail.description ? detail.description : ''}
                                                    value={detail.description ? detail.description : ''}
                                                    onEditorChange={(content) => setDetail({ ...detail, description: content })}
                                                />
                                                <span className={msg.description ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.description}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Show in HomePage<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="homepage" type="radio" checked={detail.homepage} value={detail.homepage} onChange={(e) => { setDetail({ ...detail, homepage: true }) }} disabled={viewCheck}/>
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' ><i />Yes</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="homepage" type="radio" checked={!detail.homepage} value={!detail.homepage} onChange={(e) => { setDetail({ ...detail, homepage: false }) }} disabled={viewCheck}/>
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1'><i />No</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={detail.status} value={detail.status} onChange={(e) => { setDetail({ ...detail, status: true }) }} disabled={viewCheck} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' ><i />Active</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={!detail.status} value={!detail.status} onChange={(e) => { setDetail({ ...detail, status: false }) }} disabled={viewCheck}/>
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' ><i />Inactive</span>
                                                        </div>
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
                                                            onClick={() => { add() }}
                                                        >
                                                            {Id ? "Update" : "Add"}
                                                        </Button>
                                                        : ''
                                                }
                                                <Link to={'/news'} className="float-right" >

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
    news: state.news,
    error: state.error
});

export default connect(mapStateToProps, { createNews, beforeNew, getNew, updateNews })(AddNews);