import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {  createPromo, beforePromo, getPromo, updatePromo} from './Promos.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import validator from 'validator';
import { useParams } from 'react-router';
import { ENV } from "../../config/config";
import { Link } from 'react-router-dom'

const AddPromos = (props) => {
    //
    const { promoId } = useParams()
    const [Id, setId] = useState(promoId ? promoId : "")
    const [detail, setDetail] = useState({
        code:'',
        name:'',
        description:'',
        discountType:'',
        discountValue:''
    })
    const [balancer, setBalancer] = useState(true)
    const [msg, setMsg] = useState({
        code:'',
        name:'',
        description:'',
        discountType:'',
        discountValue:''
    })
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
    }, [])

    //If Id exist then edit News
    useEffect(() => {
        if (promoId) {
            setId(promoId)
            
            props.getPromo(promoId)
        }
        else {
            setBalancer(!balancer)
        }
    }, [promoId])


    useEffect(() => {
        if (props.promos.getpromoAuth) {
            
            let { code,name,description,discountType,discountValue} = props.promos.promo
            
            code = code ? code : ''
            name = name ? name : ''
            description = description ? description : ''
            discountType = discountType ? discountType : ''
            discountValue = discountValue ? discountValue : ''

            setDetail({ code, name, description, discountType,discountValue })
            setBalancer(!balancer)
            props.beforePromo()
            setLoader(false)
        }
    }, [props.promos.getpromoAuth])

    useEffect(() => {
        if (props.promos.createAuth) {
            setLoader(false)
            props.beforePromo()
            props.history.push(`/promos`)
        }
    }, [props.promos.createAuth])

    //edit complete
    useEffect(() => {
        if (props.promos.editpromoAuth) {
            setLoader(false)
            props.beforePromo()
            props.history.push(`/promos`)
        }
    }, [props.promos.editpromoAuth])

    const add = () => {
        const discountValueValidation =/^\d+$/.test(detail?.discountValue)
        
        if (!validator.isEmpty(detail?.code) && 
            !validator.isEmpty(detail?.name) && 
            !validator.isEmpty(detail?.description + "") &&
            !validator.isEmpty(detail?.discountValue + "") &&
            !validator.isEmpty(detail?.discountType + "") && discountValueValidation  ) {
            
            setMsg({
                code:'',
                name:'',
                description:'',
                discountType:'',
                discountValue:''
            })
            setLoader(true)
            const callback=()=>{
                setLoader(false)
            }
            if (Id) {
                props.updatePromo(Id, detail,callback)
            }
            else {
                let formData = new FormData()
                for (const key in detail) {
                    formData.append(key, detail[key])
                }
                props.createPromo({ code: detail.code, name: detail.name, description: detail.description, discountType: detail.discountType ,discountValue:detail.discountValue },callback)
            }
        }
        else {
            let code = ''
            let name = ''
            let description = ''
            let discountType = ''
            let discountValue=''
            if (validator.isEmpty(detail.code)) {
                code = 'Code Required.'
            }
            if (validator.isEmpty(detail.name)) {
                name = 'Name Required.'
            }
            if (validator.isEmpty(detail.description + "")) {
                description = 'Description Required.'
            }
            if (validator.isEmpty(detail.discountType)) {
                discountType = 'Discount Type Required.'
            }
            if (validator.isEmpty(detail.discountValue)  ) {
                discountValue = 'Discount Value  Required.'
            }
            if (!discountValueValidation) {
                discountValue = 'Discount Value only contain Numeric value.'
            }
            setMsg({ code, name, description, discountType ,discountValue })
        }
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
                                        <Card.Title as="h4">{Id ? "Edit " : "Add "}Promos</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                     
                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Promo Name<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.name ? detail.name : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, name: e.target.value });
                                                        }}
                                                        placeholder="Name"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.name ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.name}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Promo Code<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.code ? detail.code : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, code: e.target.value });
                                                        }}
                                                        placeholder="Promo Code"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.code ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.code}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                      
                                        <Row className="mb-2">
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <Form.Control
                                                        value={detail.description ? detail.description : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, description: e.target.value });
                                                        }}
                                                        placeholder="Description"
                                                        type="text"
                                                    ></Form.Control>
                                                <span className={msg.description ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.description}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Discount Type<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.discountType ? detail.discountType : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, discountType: e.target.value });
                                                        }}
                                                        placeholder="Discount Type"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.discountType ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.discountType}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Discount Value<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.discountValue ? detail.discountValue : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, discountValue: e.target.value });
                                                        }}
                                                        placeholder="Discount Value"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.discountValue ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.discountValue}</label>
                                                    </span>
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
                                                    {Id ? "Update" : "Add"}
                                                </Button>
                                                <Link to={'/promos'} className="float-right" >
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
  
    promos:state.promos,
    error: state.error
});

export default connect(mapStateToProps, { createPromo, beforePromo, getPromo, updatePromo })(AddPromos);