import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { addContent, getContent, updateContent } from './cms.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import TinyMCE from '../../components/TinyMCE/tinyMCE'

import validator from 'validator';
var slugify = require('slugify')
import { useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom'
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';

const AddContentPage = (props) => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(true)

    const [homepage, setHomepage] = useState(true)
    const [tagLine, setTagLine] = useState('')
    const [thumbnail,setThumbnail] =useState("")

    
    const [footer, setFooter] = useState(true)
    const [contentId, setContentId] = useState('')
    let slug = useRef()
    const addContentPageRes = useSelector(state => state.content.addContentRes)
    const getContentRes = useSelector(state => state.content.getContentRes)
    const updateContentRes = useSelector(state => state.content.editContentRes)

    const [msg, setMsg] = useState({
        title: '',
        desc: '',
        tagLine:''
    })
    const [isPathEdit, setIsPathEdit] = useState(false)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
        let path = window.location.pathname.split('/')
        
        if(path.includes('edit-cms')){
            setIsPathEdit(true)
            let contentId = props.match.params.contentId
            setContentId(contentId)
            dispatch(getContent(contentId))
        }

    }, [])

    useEffect(()=>{
        if( addContentPageRes && Object.keys(addContentPageRes).length > 0){
            props.history.push('/cms')
        }
    },[addContentPageRes])

    useEffect(()=>{
        if(Object.keys(getContentRes).length > 0){
            let data = getContentRes.content
            setTitle(data.title)
            setDescription(data.description)
            setStatus(data.status)
            setFooter(data.footer)
            setHomepage(data.homepage ? data.homepage : false)
            setTagLine(data.tagLine ? data.tagLine : '')
            setPreviewImage(data.thumbnail ? data.thumbnail : '')
            slug.current.value = data.slug
        }
    },[getContentRes])

    useEffect(()=>{
        if(updateContentRes.success && Object.keys(updateContentRes.length > 0)){
            props.history.push('/cms')
            // setLoader(false)
        }
    },[updateContentRes])

    const addContentPageHandler = (type)=>{

        if (!validator.isEmpty(title.trim()) && !validator.isEmpty(description.trim()) && !validator.isEmpty(tagLine.trim())) {
            setMsg({
                title: '',
                desc: '',
                tagLine:''
            })
        
        let payload = {
            title : title.trim(),
            slug : slug.current.value,
            description,
            footer,
            status,
            tagLine : tagLine.trim(),
            homepage
        }

        if(thumbnail){
            payload.thumbnail = thumbnail
        }



        if(type === 1)
            dispatch(addContent(payload))
        if(type === 2){
            payload._id = contentId
            dispatch(updateContent(payload))
        }
        setLoader(true)
    }
    else {
            let tmp_title = ''
            let desc = ''
            let tag=''
            if (validator.isEmpty(title.trim())) {
                tmp_title = 'Title Required.'
            }
            if (validator.isEmpty(tagLine.trim())) {
                tag = 'Tag Line is  Required.'
            }
            if (validator.isEmpty(description.trim())) {
                desc = 'Description Required.'
            }
            setMsg({ title:tmp_title, desc , tagLine : tag})
        }
        
    }


    const [previewImage,setPreviewImage]=useState('')

    const fileSelectHandler = async(e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = async() => {
            // 
            // if(files[0].type.split('/')[0] === 'image'){
                setPreviewImage(reader.result);
            // }
            // else{
            //     setPreviewImage('');
            // }

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
                                        <Card.Title as="h4">{isPathEdit ? 'Edit Content Page' : 'Add Content Page'}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>

                                    <Row>
                                            <Col md="12" sm="6">
                                           
                                            <label>Thumbnail</label>
                                                    <div className='mb-2'>
                                                        {<img src={previewImage} onError={(e)=> {e.target.onerror = null ; e.target.src = defaultImage}  } className="img-thumbnail" style={{width:'100px'}}/>} 
                                                    </div>
                                                    <Form.Control className='text-white m-0 upload-img-file mb-3'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        // if(e.target.files[0].type.split('/')[0] === 'image'){
                                                            setThumbnail(e.target.files[0])
                                                        // }
                                                        // else{
                                                        //     setThumbnail('')
                                                        // }
                                                        
                                                        // setData({ ...data, image: e.target.files[0] });
                                                    }}
                                                    // placeholder="Title"
                                                    type="file"
                                                ></Form.Control>

                                              
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={title ? title : ''}
                                                        onChange={(e) =>{ 
                                                            setMsg({...msg ,title: '' })
                                                            setTitle(e.target.value) 
                                                        }}
                                                        placeholder="Title"
                                                        type="text"
                                                        maxLength={255}
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Slug<span className="text-danger"> </span></label>
                                                    <Form.Control
                                                        readOnly
                                                        value={slugify(title)}
                                                        placeholder="Slug"
                                                        type="text"
                                                        ref ={slug}
                                                    ></Form.Control>
                                                   
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Tag Line<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={tagLine ? tagLine : ''}
                                                        onChange={(e) =>{
                                                            setMsg({...msg ,tagLine: '' })
                                                            setTagLine(e.target.value)
                                                        }}
                                                        placeholder="Tag Line"
                                                        maxLength={50}
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.tagLine ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.tagLine}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col md="12" sm="6">
                                                <label>Texts / Description<span className="text-danger"> *</span></label>
                                                <TinyMCE 
                                                    // initialValue={detail.description ? detail.description : ''}
                                                    value={description ? description : ''}
                                                    onEditorChange={(content) => setDescription(content)}
                                                />
                                                <span className={msg.desc ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.desc}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center mt-4'>
                                                    <label>Show in Footer<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="footer" type="radio" checked={footer} value={footer} onChange={()=>setFooter(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='' onChange={(e) => setFooter(true)}><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="footer" type="radio" checked={!footer} value={!footer} onChange={() => setFooter(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='' onChange={(e) => setFooter(false)}><i />No</span>
                                                    </label>   
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center mt-4'>
                                                    <label>Status<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={status} value={status} onChange={()=>setStatus(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => setStatus(true)} ><i />Active</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>  
                                        {/* homepage, setHomepage */}
                                            <Col md="6">
                                                <Form.Group className='d-sm-flex align-items-center mt-4'>
                                                    <label>Homepage<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="homepage" type="radio" checked={homepage} value={homepage} onChange={()=>setHomepage(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => setHomepage(true)} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="homepage" type="radio" checked={!homepage} value={!homepage} onChange={(e) => setHomepage(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => setHomepage(false)} ><i />No</span>
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
                                                    onClick = {()=>addContentPageHandler(isPathEdit ? 2 : 1)}
                                                >
                                                    {isPathEdit ? 'Update' : 'Add'}
                                                </Button>
                                                <Link to={'/cms'}  className="float-right" >
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



export default AddContentPage;