import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import validator from 'validator';
import { beforeGenre } from 'views/Genre/Genre.action';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const GenrePermissionModal = (props) => {
    const dispatch = useDispatch()
    const [genre, setGenre] = useState({
        title: '',
        icon: '',
        status: ''
    })


    useEffect(()=>{
        if(Object.keys(addAdminRes).length > 0){
            props.setModalType(1)
            setEmpty()
           if(addAdminRes.success){
            toast.success(addAdminRes.message)
           }
           else{
            toast.error(addAdminRes.message)  
           }

           
        }
    },[addAdminRes])

    useEffect(()=>{
        if(Object.keys(updateAdminRes).length > 0){
            // props.setroleModal(!props.roleModal)
            props.setModalType(1)
            setEmpty()
            // props.setLoader(false)
            // props.getData()
        }
    },[updateAdminRes])

    useEffect(()=>{
        if(Object.keys(props.admin).length > 0){
            if(props.modalType === 1){
                setEmpty()
            }
            else if(props.modalType === 2 || props.modalType === 3){
                setUserId(props.admin._id)
                setName(props.admin.name)
                setRole(props.admin.roleId)
                setEmail(props.admin.email)
                setPhone(props.admin.phone)
                setStatus(props.admin.status)
                setPasssword('')
            }
            
        }
    },[props.admin])

    useEffect(()=>{
        if(props.roles){
            setRoles(props.roles)
        }
    },[props.roles])

    
    const setEmpty = () =>{
        setName('')
        setRole('')
        setEmail('')
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

    const submit = (e) =>{
        let check = true
        if(validator.isEmpty(name.trim())){
            setNameMsg('Name is Required.')
            check = false
        }
        if(!validator.isEmpty(name.trim())){
            setNameMsg('')

        }

        if(validator.isEmpty(roleId)){
            setRoleMsg('Please select a role')
            check = false
        }

        if(!validator.isEmpty(roleId)){
            setRoleMsg('')
        }


        if(validator.isEmpty(email.trim())){
            setEmailMsg('Email is Required.')
            check = false
        }
        else{
            if(!validator.isEmail(email)){
                setEmailMsg('Please enter a valid email address')
                check = false
            }
            else{
                setEmailMsg('')
            }
        }

       
            if(!validator.isEmpty(phone.trim()) && !validator.isDecimal(phone)){
                setPhoneMsg('Please enter a valid phone number')
                check = false
            }
            else{
            setPhoneMsg('')
        }
       
        
        if(validator.isEmpty(password.trim()) && props.modalType !== 3){
            setPassMsg('Password is Required.')
            check = false
        }
        else{
            setPassMsg('')
        }

        if(validator.isEmpty(confirmPassword.trim()) && props.modalType !== 3){
            setConfirmPassMsg('Confirm password is Required.')
            check = false
        }
        else {
            if(!validator.equals(password, confirmPassword) && props.modalType !== 3){
                setConfirmPassMsg('Passwords do not match')
                check = false
            }
            else{
                setPassMsg('')
            }
        }
        if(check){
            setFormValid(false)
            
            let payload = {name, email, password, status, phone, roleId}

            if (props.modalType === 1){ // add modal type
                dispatch(addStaffAdmin(payload));
            }
            else if (props.modalType === 3){ // update modal type
                // 
                if(!payload.password){
                    delete payload.password
                }
                payload._id = userId
                dispatch(updateAdmin(payload));
            }

                props.setLoader(true)
                props.getData(payload)
                props.setroleModal(!props.roleModal)

        }
        else{
            $('#modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }

    }

    const onCloseHandler = () =>{
        props.setroleModal(!props.roleModal)
        setEmpty()
    }
   
    return (
        <Container fluid>
                {/* {
                        formValid ?
                            <div className="text-danger">Please fill the required fields</div> : null
                    } */}
                {
                    props.modalType > 0 &&
                    <Modal className="modal-primary" id="admin-modal" onHide={() => {onCloseHandler();props.setAdmin({})}} show={props.roleModal}>
                        <Modal.Header className="justify-content-center">
                            <Row>
                                <div className="col-12">
                                    <h4 className="mb-0 mb-md-3 mt-0">
                                        {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff User
                                    </h4>
                                </div>
                            </Row>
                        </Modal.Header>
                        <Modal.Body className = "modal-body">
                           <Form>
                                <Form.Group>
                                    <label>Name <span className="text-danger">*</span></label>
                                    <Form.Control
                                        placeholder="Enter name"
                                        disabled = {props.modalType === 2}
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
                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example" name="roleId" disabled={props.modalType === 2} value={roleId} onChange={(e) => setRole(e.target.value)} >
                                        <option value={''}>Select Role</option>
                                        {
                                            props.roles ?
                                                props.roles.length > 0 ?
                                                    props.roles.map((role, key) => {
                                                        return (<option key={key} value={role._id}>{role.title}</option>);
                                                    }) : <option value='' disabled>No role found</option>
                                                : ''
                                                }
                                    </Form.Control>
                                    <span className={roleMsg ? `` : `d-none`}>
                                        <label className="pl-1 text-danger">{roleMsg}</label>
                                    </span>
                                </Form.Group>

                                <Form.Group>
                                    <label>Email <span className="text-danger">*</span></label>
                                    <Form.Control
                                        placeholder="xyz@example.com"
                                        disabled = {props.modalType === 2}
                                        type="text"
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                    />
                                    <span className={emailMsg ? `` : `d-none`}>
                                        <label className="pl-1 text-danger">{emailMsg}</label>
                                    </span>
                                                    
                                </Form.Group>
                                {
                                    props.modalType !== 2 ?
                                        <Form.Group>
                                            <Form.Group>
                                                <label>Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                                <Form.Control
                                                    placeholder="password"
                                                    disabled = {props.modalType === 2}
                                                    type="password"
                                                    autoComplete = "off"
                                                    name="password"
                                                    onChange={(e) => setPasssword(e.target.value)}
                                                    value={password}
                                                    required
                                                />
                                                <span className={passwordMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{passwordMsg}</label>
                                                </span>
                                                                
                                            </Form.Group>

                                            <Form.Group>
                                                <label>Confirm Password <span className="text-danger">{props.modalType === 1 ? '*' : ''}</span></label>
                                                <Form.Control
                                                    placeholder="confirmPassword"
                                                    disabled = {props.modalType === 2}
                                                    type="password"
                                                    autoComplete = "off"
                                                    name="confirmPassword"
                                                    onChange={(e) => setConfirmPass(e.target.value)}
                                                    value={confirmPassword}
                                                    required
                                                />
                                                <span className={confirmPassMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{confirmPassMsg}</label>
                                                </span>
                                                                
                                            </Form.Group>
                                        </Form.Group>
                                        : 
                                        null
                                }
                                
                                <Form.Group>
                                    <label>Phone</label>
                                    <Form.Control
                                        placeholder="+921111111111" 
                                        disabled = {props.modalType === 2}
                                        type="text"
                                        name="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone}
                                        maxLength = {11}

                                    />
                                    <span className={phoneMsg ? `` : `d-none`}>
                                        <label className="pl-1 text-danger">{phoneMsg}</label>
                                    </span>
                                </Form.Group>
                                <FormGroup >
                                     
                                {/* <label className="right-label-checkbox">Select All
                                                <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll} />
                                                <span className="checkmark"></span>
                                            </label> */}
                                    <label className='d-block'>Status</label>
                                    <label className="right-label-radio mr-3 mb-2">
                                    
                                       <div > <input  disabled={props.modalType === 2} name="status" type="checkbox" checked={status} value={status} onChange={(e) => setStatus(true)} />
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
                            <Button className="btn btn-warning" onClick={() =>  {onCloseHandler();props.setAdmin({})}}>Close</Button>
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