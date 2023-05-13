import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { beforeAdmin, login } from '../Admin/Admin.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { NavLink } from "react-router-dom";
import AnnexMainLogo from "../../assets/img/part-lux-logo.png";
import { getRoles } from 'views/AdminStaff/permissions/permissions.actions';
import validator from 'validator';
import { toast } from 'react-toastify';
var CryptoJS = require("crypto-js");

// react-bootstrap components
import { Badge, Button, Card, Form, Navbar, Nav, Container, Col } from "react-bootstrap";

function Login(props) {
    const [user, setUser] = useState({ email: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [msg ,setMsg] = useState({
        emailMsg: "",
        passMsg: ''
    })

    // when response from login is received
    useEffect(() => {
        if (props.admin.loginAdminAuth) {
            let roleId = props.admin.admin?.data?.roleId
            var encryptedRole = CryptoJS.AES.encrypt(roleId, 'secret key 123').toString();
            localStorage.setItem('role', encryptedRole);
            localStorage.setItem('userID', props.admin.admin?.data?._id);
            localStorage.setItem('userName', props.admin.admin?.data?.name);
            localStorage.setItem('userImage', props.admin.admin?.data?.image);
            props.history.push('/dashboard')

        }
    }, [props.admin.loginAdminAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0) {
            setPermissions(props.getRolesRes.data)
        }
    }, [props.getRolesRes])

    useEffect(() => {
        if (localStorage.getItem('admin-accessToken'))
            props.getRoles()
    }, [])

    const onChange = (e) => {
        let { name, value } = e.target
        let data = user
        data[name] = value
        setUser({ ...data })
    }

    const submit = async () => {
        
        if(user.email && user.password){
            setLoader(true)
            props.login(user)
        }
        // if (validator.isEmail(user.email ) && user.password.trim()) {
        //     setLoader(true)
        //     props.login(user)
        // }
        // else{
        //     let error={}
        //     if(!validator.isEmail(user.email )){
        //         error.emailMsg = 'Email is Required.'
        //     }else error.emailMsg = ''
        //     if(validator.isEmpty(user.password.trim()) ){
        //         error.passMsg = 'Password is Required.'
        //     }else error.passMsg = ''

        //     setMsg(error)
        // }

    }

    const clickHandler = (e) => {
        setShowPass(!showPass)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <div className="" data-color="black" data-image={require("assets/img/full-screen-image-2.jpg").default}>
                        <div className="content d-flex align-items-center p-0">
                            <Container>
                                <Col className="mx-auto" lg="4" md="8">
                                    <Form action="" className="form" method="">
                                        <Card className="card-login">
                                            {/* <h3 className="header text-center">Login</h3> */}
                                            <Card.Header className="text-center">
                                                <div className="logo-holder d-inline-block align-top">
                                                    <img src={AnnexMainLogo} />
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Body>
                                                    <Form.Group>
                                                        <label>Email Address <span className="text-danger">*</span></label>
                                                        <Form.Control placeholder="Enter Email" type="email" name="email" onChange={(e) => { setMsg({ ...msg , emailMsg:''  }); onChange(e) }} defaultValue={user.email} required />
                                                        {/* <span className={ msg.emailMsg ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{ msg.emailMsg }</label>
                                                        </span> */}
                                                    </Form.Group>
                                                    <Form.Group className='custom-input'>
                                                        <label>Password <span className="text-danger">*</span></label>
                                                        <Form.Control placeholder="Enter Password" type={showPass ? "text" : "password"} name="password" onChange={(e) => { setMsg({ ...msg , passMsg:''  }); onChange(e)} } defaultValue={user.password} required />
                                                        {
                                                            user.password ?
                                                                <div className="eye-icon">
                                                                    <FontAwesomeIcon style={{color : 'white' }} onClick={(e) => clickHandler(e)} icon={showPass ? faEyeSlash : faEye} />
                                                                </div>
                                                                :
                                                                ""
                                                        }
                                                        {/* <span className={ msg.passMsg ? `` : `d-none`}>
                                                            <label className="pl-1 text-danger">{ msg.passMsg }</label>
                                                        </span> */}
                                                    </Form.Group>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Form.Check className="pl-0"></Form.Check>
                                                        <NavLink to="/forgot-password" className="btn-no-bg" type="submit" variant="warning">
                                                            Forgot Password ?
                                                        </NavLink>
                                                    </div>
                                                </Card.Body>
                                            </Card.Body>
                                            <Card.Footer className="ml-auto mr-auto">
                                                <Button className="btn-wd btn-info" type="submit" disabled={loader} onClick={() => submit()}>Login</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Form>
                                </Col>
                            </Container>
                        </div>
                        <div className="full-page-background" style={{ backgroundImage: "url(" + require("assets/img/full-screen-image-2.jpg").default + ")", }}></div>
                    </div>

            }
        </>
    );
}

const mapStateToProps = state => ({
    admin: state.admin,
    error: state.error,
    getRolesRes: state.role.getRolesRes

});

export default connect(mapStateToProps, { beforeAdmin, login, getRoles })(Login);