import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { toast } from 'react-toastify';
import { ENV } from '../../../config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import validator from 'validator';
import { addStaffAdmin, updateAdmin, getUserVerify, beforeVerify } from 'views/Admin/Admin.action';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");



const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [userId, setUserId] = useState('')
    const [roleId, setRole] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState('')
    const [password, setPasssword] = useState('')
    const [confirmPassword, setConfirmPass] = useState('')
    const [status, setStatus] = useState(true)
    const [selectedRole, setSelectedRole] = useState(null)
    const [showPass, setShowPass] = useState({
        current: false,
        confirm: false
    })

    let optionArray = []
    if(props.roles){
        props.roles.map((role)=>{
            if(role.status){
                optionArray.push({label:role.title, value:role._id})
            }
            
        })
    }

    const [phone, setPhone] = useState('')
    const [nameMsg, setNameMsg] = useState('')
    const [phoneMsg, setPhoneMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [passwordMsg, setPassMsg] = useState('')
    const [roleMsg, setRoleMsg] = useState('')
    const [confirmPassMsg, setConfirmPassMsg] = useState('')

    const addAdminRes = useSelector(state => state.admin.addAdminRes)
    const updateAdminRes = useSelector(state => state.admin.updateAdminRes)


    useEffect(() => {
        if (Object.keys(addAdminRes).length > 0) {
            // props.setroleModal(!props.roleModal)
            props.setModalType(1)
            setEmpty()
            if (addAdminRes.success) {
                toast.success(addAdminRes.message)
            }
            else {
                toast.error(addAdminRes.message)
            }
        }
    }, [addAdminRes])

    useEffect(() => {
        if (Object.keys(updateAdminRes).length > 0) {
            props.setModalType(1)
            setEmpty()
        }
    }, [updateAdminRes])

    useEffect(() => {
        if (Object.keys(props.admin).length > 0) {
            if (props.modalType === 1) {
                setEmpty()
            }
            else if (props.modalType === 2 || props.modalType === 3) {
                setUserId(props.admin._id)
                setName(props.admin.name)
                setRole(props.admin.roleId)
                setEmail(props.admin.email)
                setPhone(props.admin.phone)
                setStatus(props.admin.status)
                setPasssword('')
                optionArray.map(option => {
                    if(option.value == props.admin.roleId){
                        setSelectedRole(option)
                    }
                })
            }

        }
        else{
            if (props.modalType === 1) {
                setEmpty()
            }
        }
    }, [props.admin])

    
   


    const setEmpty = () => {
        setName('')
        setRole('')
        setEmail('')
        setSelectedRole('')
        setPasssword('')
        setConfirmPass('')
        setPhone('')
        setStatus(true)

        setNameMsg('')
        setRoleMsg('')
        setEmailMsg('')
        setPassMsg('')
        setPhoneMsg('')
        setConfirmPassMsg('')
    }

    const submit = (e) => {
        let check = true
        if (validator.isEmpty(name.trim())) {
            setNameMsg('Name is Required.')
            check = false
        }
        if (!validator.isEmpty(name.trim())) {
            setNameMsg('')

        }

        if (validator.isEmpty(roleId)) {
            setRoleMsg('Please select a role')
            check = false
        }

        if (!validator.isEmpty(roleId)) {
            setRoleMsg('')
        }


        if (validator.isEmpty(email.trim())) {
            setEmailMsg('Email is Required.')
            check = false
        }
        else {
            if (!validator.isEmail(email)) {
                setEmailMsg('Please enter a valid email address')
                check = false
            }
            else {
                setEmailMsg('')
            }
        }


        if (!validator.isEmpty(phone.trim()) && !validator.isDecimal(phone)) {
            setPhoneMsg('Please enter a valid phone number')
            check = false
        }
        else {
            setPhoneMsg('')
        }

        if(props.modalType == 1){
            if (validator.isEmpty(password.trim())) {
                setPassMsg('Password is Required.')
                check = false
            }
            else {
                setPassMsg('')
            }
    
            if (validator.isEmpty(confirmPassword.trim())) {
                setConfirmPassMsg('Confirm password is Required.')
                check = false
            }
        }
        // else {
        // if (!validator.isEmpty(password.trim()) || !validator.isEmpty(confirmPassword.trim())) {
        //     if (!validator.equals(password, confirmPassword)) {
        //         setConfirmPassMsg('Passwords do not match')
        //         check = false
        //     }
        //     else {
        //         setPassMsg('')
        //     }
        // }

        if (!validator.isEmpty(password) || !password.replace(/\s/g, '').length) {
            if ( (validator.isEmpty(password) || !password.replace(/\s/g, '').length) &&  props.modalType == 1 ) {
                setPassMsg('New Password is Required.')
                check = false
            } 

            else if (!validator.equals(password, confirmPassword)) {
                setConfirmPassMsg('Password and Confirm Password do not match')
                check = false
            }
            if(password.replace(/\s/g, '').length && confirmPassword.replace(/\s/g, '').length && validator.equals(password, confirmPassword) ){
                console.log("!ENV.validatePassword(password): ",!ENV.validatePassword(password) )
                if(!ENV.validatePassword(password)){
                    check = false
                    setConfirmPassMsg("Password should consist of 8 character Minimum , one UpperCase Letter , one LowerCase Letter and on Special Character ")
                }
            }

        }else { setPassMsg('') }
        
        if (check) {

            let payload = { name : name.trim() , email, password, status, phone, roleId }

            if (props.modalType === 1) { // add modal type
                dispatch(addStaffAdmin(payload));
            }
            else if (props.modalType === 3) { // update modal type
                if (!payload.password) {
                    delete payload.password
                }
                payload._id = userId
                dispatch(updateAdmin(payload));
            }

            props.setLoader(true)
            props.getData(payload)
            props.setroleModal(!props.roleModal)
            setEmpty()

        }
        else {
            $('#modal-primary').scrollTop(0, 0)
        }

    }

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        setEmpty()
    }

    return (
        <Container fluid>
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" id="admin-modal" onHide={() => { onCloseHandler(); props.setAdmin({}) }} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff User
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <label>Name <span className="text-danger">*</span></label>
                                <Form.Control
                                    placeholder="Enter name"
                                    disabled={props.modalType === 2}
                                    type="text"
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    maxLength={50}
                                    required
                                />
                                <span className={nameMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{nameMsg}</label>
                                </span>

                            </Form.Group>

                            <Form.Group>
                                <label>User Role <span className="text-danger">*</span></label>
                                {console.log("props.modalType: ",props.modalType)}
                                <Select
                                    options={optionArray}
                                    classNamePrefix="deskillz-select"
                                    isDisabled={props.modalType === 2}
                                    value={selectedRole}
                                    onChange={(value) => {
                                        setSelectedRole(value)
                                        setRole(value.value) 
                                    }}
                                />
                                <span className={roleMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{roleMsg}</label>
                                </span>
                            </Form.Group>

                            <Form.Group>
                                <label>Email <span className="text-danger">*</span></label>
                                <Form.Control
                                    placeholder="xyz@example.com"
                                    disabled={props.modalType === 2}
                                    type="text"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    maxLength={254}
                                    required
                                />
                                <span className={emailMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{emailMsg}</label>
                                </span>

                            </Form.Group>
                            {
                                props.modalType !== 2 ?
                                    <Form.Group>
                                        <Form.Group >
                                            <label>Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                            <Form.Control
                                                placeholder="Password"
                                                disabled={props.modalType === 2}
                                                type={showPass.current ? "text" : "password"}
                                                autoComplete="off"
                                                name="password"
                                                onChange={(e) => setPasssword(e.target.value)}
                                                value={password}
                                                required
                                            />
                                            {
                                                password.length ?
                                                    <div className="eye-icon">
                                                        <FontAwesomeIcon onClick={(e) => { setShowPass({ ...showPass, current: !showPass.current }) }} icon={showPass.current ? faEyeSlash : faEye} />
                                                    </div>
                                                    :
                                                    ""
                                            }

                                        </Form.Group>
                                        <span className={passwordMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{passwordMsg}</label>
                                        </span>

                                        <Form.Group >
                                            <label>Confirm Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                            <Form.Control
                                                placeholder="Confirm Password"
                                                disabled={props.modalType === 2}
                                                type={showPass.confirm ? "text" : "password"}
                                                autoComplete="off"
                                                name="confirmPassword"
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                                value={confirmPassword}
                                                required
                                            />
                                            {
                                                confirmPassword.length ?
                                                    <div className="eye-icon">
                                                        <FontAwesomeIcon onClick={(e) => { setShowPass({ ...showPass, confirm: !showPass.confirm }) }} icon={showPass.confirm ? faEyeSlash : faEye} />
                                                    </div>
                                                    :
                                                    ""
                                            }

                                        </Form.Group>
                                            <span className={confirmPassMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{confirmPassMsg}</label>
                                            </span>
                                    </Form.Group>
                                    :
                                    null
                            }

                            <Form.Group>
                                <label>Phone</label>
                                <Form.Control
                                    placeholder="+921111111111"
                                    disabled={props.modalType === 2}
                                    type="number"
                                    name="phone"
                                    onChange={(e) => {
                                        if ((e.target.value).length < 21) {
                                            setPhone(e.target.value)
                                        }
                                    }}
                                    value={phone}
                                />
                                <span className={phoneMsg ? `` : `d-none`}>
                                    <label className="pl-1 text-danger">{phoneMsg}</label>
                                </span>
                            </Form.Group>
                            <FormGroup >

                                {/* <label className="right-label-checkbox">Select All
                                                <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll} />
                                                <span className="checkmark"></span>
                                            </label> 
                                */}
                                <label className='d-block'>Status</label>
                                <label className="right-label-radio mr-3 mb-2">

                                    <div > <input disabled={props.modalType === 2} name="status" type="checkbox" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                        <span className="checkmark"></span>
                                    </div>

                                    <span className='ml-2 d-inline-block' onChange={(e) => setStatus(true)} ><i />Active

                                    </span>
                                </label>
                                <label className="right-label-radio mr-3 mb-2">
                                    <span className="checkmark"></span>
                                    <div> <input disabled={props.modalType === 2} name="status" type="checkbox" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                        <span className="checkmark"></span>
                                    </div>
                                    <span className='ml-2' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                </label>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-warning" onClick={() => { onCloseHandler(); props.setAdmin({}) }}>Close</Button>
                        {
                            props.modalType === 2 ? '' :
                                <Button className="btn btn-info" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;