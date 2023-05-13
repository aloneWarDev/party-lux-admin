import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addFaq, beforeFaq , getAllFaqCategories } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import TinyMCE from '../../components/TinyMCE/tinyMCE'


import validator from 'validator';
import { Link } from 'react-router-dom';
import Select from 'react-select';

const AddFaq = (props) => {

    const [categories , setCategories] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const [faqTypeArray , setFaqTypeArray] = useState({"1": "Developer" , "2":"Player"});
    const [data, setData] = useState({
        title: '',
        desc: '',
        category: [],
        type: '' ,
        status: true , 
    })

    const [msg, setMsg] = useState({
        title: '',
        desc: '' ,
        category: '',
        type: ''
    })

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
        props.getAllFaqCategories()
    }, [])

    useEffect(()=>{
        if(props.faqs.getCategoriesAuth){
            // 
            const { categories } = props.faqs
            // 
            setCategories(renderOption(categories))
        }
    },[props.faqs.getCategoriesAuth])

    useEffect(() =>{
        if(props.faqs.createAuth){
            props.beforeFaq()
            props.history.push(`/faq`)
        }
    }, [props.faqs.createAuth])

        // when an error is received
        useEffect(() => {
            if (props.error.error){
                console.log("are you here: ",props.error)
                setLoader(false)
            }

        }, [props.error.error])

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            // 
            rows.push({label : `${value[v].name}` ,value : `${value[v]._id}`});
        }
        // 
        return rows;
    }

    const renderOptions = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }

     
    const add = () => {
        // 
        if (!validator.isEmpty(data.title.trim()) && !validator.isEmpty(data.desc.trim()) && !validator.isEmpty(data.type) && data.category.length > 2 ) {
            setMsg({
                title: '',
                desc: '' ,
                category: '',
                type: ''
            })

            
            if(data.title){
                data.title = data.title.trim()
            }
            let formData = new FormData()
            for (const key in data){
                formData.append(key, data[key])      
            }
            props.addFaq(formData)
        }
        else {
            let title = ''
            let desc = ''
            let category = ''
            let type = ''
            
            if (validator.isEmpty(data.title.trim())) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(data.desc.trim())) {
                desc = 'Description Required.'
            }
            if(!data.category.length || data.category.length <= 2){
                category = 'Category Required'
            }
            if(validator.isEmpty(data.type)){
                type = 'Faq Type is Required'
            }
            setMsg({ title, desc , category , type})
        }
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setData({ ...data, desc: editorData });
    }

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
                                        <Card.Title as="h4">Add FAQ</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.title ? data.title : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, title: e.target.value });
                                                        }}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Select Category<span className="text-danger"> *</span></label>
                                                    <Select
                                                        // defaultValue={[{value:'' , label:'Select'}]}
                                                        value ={selectedOption}
                                                        isMulti
                                                        name="colors"
                                                        options={categories}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange ={
                                                            (e)=>{
                                                                let selectedCat = []
                                                                for (let i=0;i<e?.length;i++)
                                                                {
                                                                    selectedCat.push(e[i].value)
                                                                }
                                                                setData({...data , category: JSON.stringify(selectedCat)})
                                                                setSelectedOption(e)
                                                            }
                                                        }
                                                        menuPortalTarget={document.body} 
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                    />
                                                    <span className={msg.category ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.category}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* <Row>
                                            <Col md="12" sm="6">
                                                <Form.Group>
                                                    <label>Select Category<span className="text-danger"> *</span></label>
                                                    <Select
                                                        // defaultValue={[{value:'' , label:'Select'}]}
                                                        value ={selectedOption}
                                                        isMulti
                                                        name="colors"
                                                        options={categories}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange ={
                                                            (e)=>{
                                                                let selectedCat = []
                                                                for (let i=0;i<e?.length;i++)
                                                                {
                                                                    selectedCat.push(e[i].value)
                                                                }
                                                                setData({...data , category: JSON.stringify(selectedCat)})
                                                                setSelectedOption(e)
                                                            }
                                                        }
                                                    />
                                                    <span className={msg.category ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.category}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row> */}

                                        <Row className="mb-2">
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <TinyMCE 
                                                    // initialValue={detail.description ? detail.description : ''}
                                                    value={data.desc? data.desc: ''}
                                                    onEditorChange={(content) => setData({ ...data, desc: content })}
                                                />
                                                <span className={msg.desc ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.desc}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md="4">
                                                <label>FAQ's Type<span className="text-danger">*</span></label>
                                                <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                    value={data.type ? data.type : '' } onChange={(e) => { setData({...data , type: e.target.value});}}
                                                >
                                                    <option value={''}>Select FAQ Type</option>
                                                    {renderOptions(faqTypeArray)}
                                                </Form.Control>
                                                <span className={msg.type ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.type}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                        <input name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => {setData({ ...data, status: true })}} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, status: true });
                                                        }} ><i />Active</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                        <input name="status" type="radio" checked={!data.status} value={!data.status} onChange={(e) => {setData({ ...data, status: false })}}  />
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
                                                <Link to={'/faq'}  className="float-right" >
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
    faqs: state.faqs,
    error: state.error
});

export default connect(mapStateToProps, { addFaq, beforeFaq , getAllFaqCategories})(AddFaq);