import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeFaq, getFaq, updateFaq , getAllFaqCategories} from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import TinyMCE from '../../components/TinyMCE/tinyMCE'
import validator from 'validator';
import { Link } from 'react-router-dom';
import Select from 'react-select';


const EditFaq = (props) => {

    const [categories , setCategories] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const [faqTypeArray , setFaqTypeArray] = useState({"1": "Developer" , "2":"Player"});
    const [data, setData] = useState({})

    const [msg, setMsg] = useState({
        title: '',
        desc: '',
        category: '',
        type: ''
    })

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        props.getFaq(window.location.pathname.split('/')[3])
        props.getAllFaqCategories()
    }, [])

    useEffect(()=>{
        if(props.faqs.getCategoriesAuth){
            
            const { categories } = props.faqs
            
            setCategories(renderOption(categories))
        }
    },[props.faqs.getCategoriesAuth])

    useEffect(() => {
        if (props.faqs.getFaqAuth) {
            const { title, desc,category ,type, status } = props.faqs.faq
            let catSelectedIds = []
            for (let v in category){
                catSelectedIds.push(category[v]?.category?._id)
            }
            
            setData({ title, desc, status, category: JSON.stringify(catSelectedIds) , type, _id: window.location.pathname.split('/')[3] })
            //creating options for react-select
            let selectedOptions= []
            for(let v in category){
                selectedOptions.push({label: category[v]?.category?.name , value: category[v]?.category?._id})
            }
            setSelectedOption(selectedOptions)
            props.beforeFaq()
            setLoader(false)
        }
    }, [props.faqs.getFaqAuth])

    useEffect(() =>{
        if(props.faqs.editFaqAuth){
            setLoader(false)
            props.beforeFaq()
            props.history.push(`/faq`)
        }
    }, [props.faqs.editFaqAuth])

    
    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            
            rows.push({label : `${value[v].name}` ,value : `${value[v]._id}`});
        }
        
        return rows;
    }
    const renderOptions = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }
    const update = () => {
        // 
        setLoader(true)
        if (!validator.isEmpty(data.title.trim()) && !validator.isEmpty(data.desc.trim()) && !validator.isEmpty(data.type + '') && JSON.parse(data.category).length) {
            
            setMsg({
                title: '',
                desc: '' ,
                category: '',
                type: ''
            })
            if(data.status === undefined)
                data.status = false
            if(data.title){
                data.title  = data.title.trim()
            }
            let formData = new FormData()
            // 
            for (const key in data)
                formData.append(key, data[key])
            props.updateFaq(formData)
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
            if (validator.isEmpty(data.type ? data.type + '' : "" )) {
                type = "FAQ's Type Required."
            }
            if(!JSON.parse(data.category).length){
                category = 'Category Required'
            }
            setMsg({ title, desc , category , type})
            setLoader(false)
        }
    }
    useEffect(() => {
        if (props.error.error){
            setLoader(false)
        }

    }, [props.error.error])

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
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4">Edit FAQ</Card.Title>
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
                                                        maxLength={50}
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
                                        <Row>
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
                                        <Row>
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
                                                    <label>Status<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={data.status} value={data.status} onChange={(e) => setData({ ...data, status: true })} />
                                                        <span className="checkmark"></span>
                                                        <span  onChange={(e) => {
                                                            setData({ ...data, status: true });
                                                        }} ><i />Active</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={!data.status} value={!data.status} onChange={(e) => setData({ ...data, status: false })}  />
                                                        <span className="checkmark"></span>
                                                        <span onChange={(e) => {
                                                            setData({ ...data, status: false });
                                                        }} ><i />Inactive</span>
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
                                                    onClick={update}
                                                >
                                                    Update
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

export default connect(mapStateToProps, { beforeFaq, getFaq, updateFaq ,getAllFaqCategories })(EditFaq);