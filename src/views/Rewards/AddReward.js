import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createReward, beforeReward, getReward, updateReward } from './Rewards.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";

import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import validator from 'validator';
import { useParams } from 'react-router';
import { ENV } from "../../config/config";

import { Link } from 'react-router-dom'
const AddNews = (props) => {
    //
    const { rewardId } = useParams()
    //
    const [Id, setId] = useState(rewardId ? rewardId : "")
    const [image, setImage] = useState("")
    const [detail, setDetail] = useState({
        rewardName: '',
        rewardDescription: '',
        image: '',
        price: '',
        type:''
    })
    const [balancer, setBalancer] = useState(true)

    const [msg, setMsg] = useState({
        rewardName: '',
        rewardDescription: '',
        image: '',
        price: '',
        type:''
    })
    const [previewImage, setPreviewImage] = useState('')
    const [loader, setLoader] = useState(true)
    const [typeArray, setTypeArray] = useState({ "1": "Real Currency", "2": "Virtual Currency", })

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
    }, [])

    //If Id exist then edit News
    useEffect(() => {
        if (rewardId) {
            setId(rewardId)
            
            props.getReward(rewardId)
        }
        else {
            setBalancer(!balancer)
        }
    }, [rewardId])


    // useEffect(()=>{  
    //     
    // }, [detail])
    //getNewAuth
    useEffect(() => {
        if (props.rewards.getRewardAuth) {
            
            let { rewardName, rewardDescription, image, price,type } = props.rewards.reward
            rewardName = rewardName ? rewardName : ''
            rewardDescription = rewardDescription ? rewardDescription : ''
            image = image ? image : ''
            price = price ? price : ''
            type = type ? type : ''

            setDetail({ rewardName, rewardDescription, image, price,type })
            setBalancer(!balancer)
            props.beforeReward()
            setLoader(false)
        }
    }, [props.rewards.getRewardAuth])
    useEffect(() => {
        if (props.rewards.createAuth) {
            setLoader(false)
            props.beforeReward()
            props.history.push(`/reward`)
        }
    }, [props.rewards.createAuth])

    //edit complete
    useEffect(() => {
        if (props.rewards.editRewardAuth) {
            setLoader(false)
            props.beforeReward()
            props.history.push(`/reward`)
        }
    }, [props.rewards.editRewardAuth])
    const add = () => {
        if (!validator.isEmpty(detail?.rewardName) && 
        !validator.isEmpty(detail?.rewardDescription) && 
        !validator.isEmpty(detail?.image + "") &&
         validator.isNumeric(String(detail?.price)) && 
         !validator.isEmpty(detail?.type + "")) {
            setMsg({
                rewardName: '',
                rewardDescription: '',
                image: '',
                price: '',
                type:''
            })
            setLoader(true)
            if (Id) {
                props.updateReward(Id, detail)
            }
            else {
                let formData = new FormData()
                for (const key in detail) {
                    formData.append(key, detail[key])
                }
                props.createReward({ rewardName: detail.rewardName, rewardDescription: detail.rewardDescription, image: detail.image, price: detail.price ,type:detail.type })
            }
        }
        else {
            let rewardName = ''
            let rewardDescription = ''
            let image = ''
            let price = ''
            let type=''
            if (validator.isEmpty(detail.rewardName)) {
                rewardName = 'Title Required.'
            }
            if (validator.isEmpty(detail.rewardDescription)) {
                rewardDescription = 'Description Required.'
            }
            if (validator.isEmpty(detail.image + "")) {
                image = 'Image Required.'
            }
            if (validator.isEmpty(String(detail.price))) {
                price = 'Price Required.'
            }
            if (validator.isEmpty(detail.type)) {
                type = 'Type Required.'
            }
            setMsg({ rewardName, rewardDescription, image, price,type })
        }
    }

    const onEditorChange = (event, editor) => {
        if (!balancer) {
            let editorData = editor.getData();
            setDetail({ ...detail, rewardDescription: editorData });
        }
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
            setPreviewImage(reader.result);
        };
        // setImageFile(files[0]);
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
                                        <Card.Title as="h4">{Id ? "Edit " : "Add "}Reward</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Image<span className="text-danger"> *</span></label>
                                                <div className='mb-2'>
                                                    {<img src={previewImage ? previewImage : detail.image} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} className="img-thumbnail" style={{ width: '100px' }} />}
                                                </div>
                                                <Form.Control className='text-white m-0 mb-3 upload-img-file'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        setDetail({ ...detail, image: e.target.files[0] });
                                                    }}
                                                    // placeholder="Title"
                                                    type="file"
                                                ></Form.Control>
                                                <span className={msg.image ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.image}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Name<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.rewardName ? detail.rewardName : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, rewardName: e.target.value });
                                                        }}
                                                        placeholder="Name"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.rewardName ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.rewardName}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="6">
                                                <Form.Group >
                                                    <label>Type:</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={detail.type ? detail.type : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, type: e.target.value });
                                                        }}
                                                    >
                                                        <option value={''}>Select Type:</option>
                                                        {renderOption(typeArray)}
                                                    </Form.Control>
                                                    <span className={msg.type ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.type}</label>
                                                    </span>
                                                </Form.Group>

                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md="12" sm="6">
                                                <label>Text / Description<span className="text-danger"> *</span></label>
                                                <TinyMCE 
                                                    // initialValue={detail.description ? detail.description : ''}
                                                    value={detail.rewardDescription ? detail.rewardDescription : ''}
                                                    onEditorChange={(content) => setDetail({ ...detail, rewardDescription: content })}
                                                />
                                                <span className={msg.rewardDescription ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.rewardDescription}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Price<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={detail.price ? detail.price : ''}
                                                        onChange={(e) => {
                                                            setDetail({ ...detail, price: e.target.value });
                                                        }}
                                                        placeholder="0.01ETH"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={msg.price ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.price}</label>
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
                                                <Link to={'/reward'} className="float-right" >
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
    rewards: state.rewards,
    error: state.error
});

export default connect(mapStateToProps, { createReward, beforeReward, getReward, updateReward })(AddNews);