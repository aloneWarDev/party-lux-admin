import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ENV } from '../../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import validator from 'validator';
import { addRole, updateRole, beforeRole } from './permissions.actions';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";

const StaffPermissionModal = (props) => {

    
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState(true)
    const [selectAll, setSelectAll] = useState(false)
    const [titleMsg, setTitleMsg] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [permissions, setPermissions] = useState({
        /**  system permissions **/

        // dashboard
        viewDashboard: false,

        // staff's records
        addStaff: false,
        editStaff: false,
        deleteStaff: false,
        viewStaff: false,

        // users records
        // addUser: false,
        // editUser: false,
        // deleteUser: false,
        // viewUsers: false,

        //developer users records
        addDeveloperUser: false,
        editDeveloperUser: false,
        deleteDeveloperUser: false,
        viewDeveloperUsers: false,

        // player user
        addPlayerUser: false,
        editPlayerUser: false,
        deletePlayerUser: false,
        viewPlayerUsers: false,
        

        // permissions
        addRole: false,
        editRole: false,
        deleteRole: false,
        viewRole: false,

      

        // Game
        addGame: false,
        editGame: false,
        deleteGame: false,
        viewGame: false,

         // Season
        addSeason: false,
        editSeason: false,
        deleteSeason: false,
        viewSeason: false,


          // Sdk
        addSdk: false,
        editSdk: false,
        deleteSdk: false,
        viewSdk: false,


        // Tournament
        addTournament: false,
        editTournament: false,
        deleteTournament: false,
        viewTournament: false,


        // Email Template
        editEmailTemplate: false,
        viewEmailTemplate: false,


        // Theme
        addTheme: false,
        editTheme: false,
        deleteTheme: false,
        viewTheme: false,


         // Request Sync Theme
         editRequestSyncTheme: false,
         deleteRequestSyncTheme: false,
         viewRequestSyncTheme: false,

        
        // Learning
        addLearning: false,
        editLearning: false,
        deleteLearning: false,
        viewLearning: false,

        // News
        addNews: false,
        editNews: false,
        deleteNews: false,
        viewNews: false,


        // Reward
        addReward: false,
        editReward: false,
        deleteReward: false,
        viewReward: false,


        // Promos
        addPromos: false,
        editPromos: false,
        viewPromos: false,
        deletePromos: false,

        // ReportPlayer
        viewReportedUser: false,
        editReportedUser: false ,

        //Genres
        viewGenres: false,
        addGenres: false,
        editGenres: false,
        deleteGenres: false,
        

        // FAQs / articles
        addFaq: false,
        editFaq: false,
        deleteFaq: false,
        viewFaqs: false,

        // FAQs Category / articles
        addCategoryFaq: false,
        editCategoryFaq: false,
        deleteCategoryFaq: false,
        viewCategoryFaqs: false,


        // content
        addContent: false,
        editContent: false,
        viewContent: false,
        deleteContent: false,


        // contact
        viewContact: false,
        editContact: false,


        //Player contact
        viewPlayerContact: false,
        editPlayerContact: false,


        //Developer contact
        viewDeveloperContact: false,
        editDeveloperContact: false,


        // activity
        viewActivity: false,

        // settings
        editSetting: false,
        viewSetting: false,


        // status (i.e: true for active & false for in-active)

    })
    const addRoleRes = useSelector(state => state.role.addRoleRes)
    const updateRoleRes = useSelector(state => state.role.updateRoleRes)
    const authenticate = useSelector(state => state.role.authenticate)
    const onChangeCheckbox = (name, value) => {
        let roles = permissions
        if (name === 'selectAll') {
            Object.keys(roles).forEach((val, key) => {
                if (val !== 'title' && val !== '_id' && val !== 'status' && val !== 'createdAt' && val !== 'updatedAt' && val !== '_v')
                    roles = { ...roles, [val]: value }
            });
            setSelectAll(value)
        }
        else 
        {
            roles = { ...roles, [name]: value }

            // select all state settings
            let count = 0;


            Object.keys(roles).forEach((key, index) => {
                if (roles[key] === true && key !== 'status')
                    count++;
            });
            let selectCount = count === 62 ? true : false
            setSelectAll(selectCount)
        }
        
        setPermissions(roles)
    }
    const submit = (e) => {
        if (title === undefined || !title.replace(/\s/g, '').length) {
            setTitleMsg("Title Required.")
            $('.modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }
        else {
            if (!validator.isEmpty(title.trim())) {
                setTitleMsg(title)
                setFormValid(false)

                const role = { ...permissions, title : title.trim(), status }

                if (props.modalType === 1){ // add modal type
                    dispatch(addRole(role));
                }
                else if (props.modalType === 3){ // update modal type
                    // alert("flow step 1")
                    dispatch(updateRole(role));
                }

                setPermissions(role)
                props.setData(role)
                props.setLoader(true)
                props.setroleModal(!props.roleModal)
            }
            else {
                setTitleMsg("Title Required.")
                $('.modal-primary').scrollTop(0, 0)
                setFormValid(true)
            }
        }
    }

    useEffect(()=>{

        if(props.modalType === 1 ){
            setTitle('')
            setSelectAll(false)
            props.setData(permissions)
        }
        if(props.modalType === 3){
            let newprops = { ...props };
            setPermissions(newprops.role)
            setStatus(newprops.role.status)
            setTitle(newprops.role.title)
        }

    },[props.modalType ]) //, props.roleModal

    useEffect(()=>{
        if(props.modalType === 1 ){
            setTitle('')
            setSelectAll(false)
            props.setData(permissions)
        }
        if(props.modalType === 3){
            let newprops = { ...props };
            setPermissions(newprops.role)
            setStatus(newprops.role.status)
            setTitle(newprops.role.title)
        }
        if(props.modalType === 2){
            let newprops = { ...props };
            setPermissions(newprops.role)
            setStatus(newprops.role.status)
            setTitle(newprops.role.title)
        }
        // if(Object.keys(updateRoleRes).length > 0 && authenticate === true && props.modalType === 3){
        //     
        // }
    },[props.roleModal])
    useEffect(() => {
        if (Object.keys(props.role).length > 0) {
            updateInitialData({ ...props });
        }
    }, [props.role])



    const updateInitialData = (props) => {
        let newprops = { ...props };
        if(newprops.modalType === 3){
            setPermissions(newprops.role)
            setStatus(newprops.role.status)
            setTitle(newprops.role.title)
        }
        if(newprops.modalType === 2){
            setPermissions(newprops.role)
            setStatus(newprops.role.status)
            setTitle(newprops.role.title)
        }
        if(newprops.modalType === 1){
            setTitle('')
        }
    }

    useEffect(() => {
        if (props.modalType === 2) {
            $(".modal-primary input").prop("disabled", true);
        } else {
            $(".modal-primary input").prop("disabled", false);
        }
    }, [props.modalType])

    useEffect(() => {
        if (addRoleRes.success && authenticate === true) {
            // closeModal();
            // this.props.role.removeLoader();
            // alert("roleModal step2 in useEffect addRoleRes")
            // 
            // props.setroleModal(!props.roleModal)

            // props.setModalType(1)
            props.setLoader(false)
            setEmpty()
            // setRole({})

            // toast.success(`${addRoleRes.message}`);
        }
    }, [addRoleRes])

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        // setEmpty()
    }

    // useEffect(() => {
    //     if (Object.keys(updateRoleRes).length > 0 && authenticate === true) {
    //         // alert("roleModal step2 in useEffect updateRoleRes")
    //         // 
    //         // props.setroleModal(!props.roleModal)//props.modalType ===3 ? false : 
    //         // props.setModalType(1)
    //         // props.setLoader(false)
    //         // toast.success(`Success! ${updateRoleRes.message}`);
    //         // dispatch(beforeRole());
    //     }
    // }, [updateRoleRes])

    const setEmpty = () => {
        for (let key in permissions) {
            permissions[key] = false
        }
    }


    return (
        <Container fluid>
            {
                formValid ?
                    <div className="text-danger">Please fill the required fields</div> : null
            }
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" onHide={() => { props.setroleModal(!props.roleModal); setSelectAll(false); if(props.modalType === 1 ){setEmpty();} }} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff Role
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col md={9}>
                                        <label className="label-font">Title <span className="text-danger">*</span></label>
                                        <Form.Control
                                            placeholder="Enter name"
                                            type="text"
                                            name="title"
                                            className="text-white mb-2 mb-md-0"
                                            onChange={(e) => 
                                                {
                                                    setTitleMsg('')
                                                    setTitle(e.target.value)
                                                }
                                            }
                                            disabled={props.modalType === 2}
                                            value={title}
                                            maxLength={50}
                                            required
                                        />
                                        <span className={titleMsg ? `` : `d-none `}>
                                            <label className="pl-1 text-danger">{titleMsg}</label>
                                        </span>
                                    </Col>

                                    <Col md={3}>
                                        <label className="right-label-checkbox">Select All
                                            <input type="checkbox" name="selectAll" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll} />
                                            <span className="checkmark"></span>
                                        </label>

                                        {/* <label className="label-font"></label>
                                            <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row className="align-items-start">
                                    <Col md={3}>
                                        <label className="label-font">Dashboard</label>
                                    </Col>
                                    <Col md={9}>
                                        <label className="right-label-checkbox">View
                                            <input type="checkbox" name="viewDashboard" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard} />
                                            <span className="checkmark"></span>
                                            {/* <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input>  */}

                                        </label>
                                        {/* <label className="label-font">View</label>
                                            <input type="checkbox" name="viewDashboard" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDashboard)} checked={permissions.viewDashboard}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Staff</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStaff)} checked={permissions.viewStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStaff)} checked={permissions.addStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStaff)} checked={permissions.editStaff} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteStaff" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStaff)} checked={permissions.deleteStaff} />
                                            <span className="checkmark"></span>
                                        </label>

                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Staff Roles</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRole)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Users</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewUsers" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewUsers)} checked={permissions.viewUsers} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addUser)} checked={permissions.addUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editUser)} checked={permissions.editUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteUser)} checked={permissions.deleteUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                       
                                    </Col>
                                </Row>
                            </Form.Group> */}





                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Developer Users</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewDeveloperUsers" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDeveloperUsers)} checked={permissions.viewDeveloperUsers} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addDeveloperUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addDeveloperUser)} checked={permissions.addDeveloperUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editDeveloperUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editDeveloperUser)} checked={permissions.editDeveloperUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteDeveloperUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteDeveloperUser)} checked={permissions.deleteDeveloperUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        
                                    </Col>
                                </Row>
                            </Form.Group>




                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Player Users</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewPlayerUsers" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPlayerUsers)} checked={permissions.viewPlayerUsers} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addPlayerUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addPlayerUser)} checked={permissions.addPlayerUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editPlayerUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPlayerUser)} checked={permissions.editPlayerUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deletePlayerUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deletePlayerUser)} checked={permissions.deletePlayerUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">FAQs</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewFaqs" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewFaqs" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs}></input>
                                                <span>View</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="addFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq}></input>
                                                <span>Add</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="editFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq}></input>
                                                <span>Edit</span>
                                            </label>
                                            <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="deleteFaq" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq}></input>
                                                <span>Delete</span>
                                            </label> */}
                                    </Col>
                                </Row>
                            </Form.Group>




                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">FAQs Category</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewCategoryFaqs" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCategoryFaqs)} checked={permissions.viewCategoryFaqs} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addCategoryFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCategoryFaq)} checked={permissions.addCategoryFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editCategoryFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCategoryFaq)} checked={permissions.editCategoryFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteCategoryFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCategoryFaq)} checked={permissions.deleteCategoryFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Game</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewGame" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewGame)} checked={permissions.viewGame} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addGame" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addGame)} checked={permissions.addGame} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editGame" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editGame)} checked={permissions.editGame} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteGame" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteGame)} checked={permissions.deleteGame} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Genres</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewGenres" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewGenres)} checked={permissions.viewGenres} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addGenres" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addGenres)} checked={permissions.addGenres} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editGenres" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editGenres)} checked={permissions.editGenres} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteGenres" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteGenres)} checked={permissions.deleteGenres} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            
                            
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Tournament</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewTournament" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewTournament)} checked={permissions.viewTournament} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addTournament" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addTournament)} checked={permissions.addTournament} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editTournament" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editTournament)} checked={permissions.editTournament} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteTournament" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteTournament)} checked={permissions.deleteTournament} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Theme</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewTheme)} checked={permissions.viewTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addTheme)} checked={permissions.addTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editTheme)} checked={permissions.editTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteTheme)} checked={permissions.deleteTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}



                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Request Sync Theme</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRequestSyncTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRequestSyncTheme)} checked={permissions.viewRequestSyncTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                       
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRequestSyncTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRequestSyncTheme)} checked={permissions.editRequestSyncTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRequestSyncTheme" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRequestSyncTheme)} checked={permissions.deleteRequestSyncTheme} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}
                        
                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Season</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSeason" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSeason)} checked={permissions.viewSeason} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addSeason" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addSeason)} checked={permissions.addSeason} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSeason" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSeason)} checked={permissions.editSeason} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteSeason" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteSeason)} checked={permissions.deleteSeason} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}


                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">SDK</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSdk" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSdk)} checked={permissions.viewSdk} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addSdk" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addSdk)} checked={permissions.addSdk} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSdk" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSdk)} checked={permissions.editSdk} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteSdk" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteSdk)} checked={permissions.deleteSdk} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}

                               <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Learning</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewLearning" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewLearning)} checked={permissions.viewLearning} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addLearning" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addLearning)} checked={permissions.addLearning} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editLearning" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editLearning)} checked={permissions.editLearning} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteLearning" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteLearning)} checked={permissions.deleteLearning} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>


                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">News</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewNews" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewNews)} checked={permissions.viewNews} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addNews" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addNews)} checked={permissions.addNews} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editNews" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editNews)} checked={permissions.editNews} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteNews" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteNews)} checked={permissions.deleteNews} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Reward</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewReward" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewReward)} checked={permissions.viewReward} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addReward" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addReward)} checked={permissions.addReward} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editReward" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editReward)} checked={permissions.editReward} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteReward" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteReward)} checked={permissions.deleteReward} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}


                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Email Templates</label>
                                    </Col>  
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmailTemplate)} checked={permissions.viewEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmailTemplate)} checked={permissions.editEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Contacts</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContact)} checked={permissions.viewContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContact)} checked={permissions.editContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                   
                                    </Col>
                                </Row>
                            </Form.Group> */}


                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Developer Support</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewDeveloperContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewDeveloperContact)} checked={permissions.viewDeveloperContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editDeveloperContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editDeveloperContact)} checked={permissions.editDeveloperContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>



                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Player Support</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewPlayerContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPlayerContact)} checked={permissions.viewPlayerContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editPlayerContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPlayerContact)} checked={permissions.editPlayerContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>




                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Activities</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewActivity" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewActivity)} checked={permissions.viewActivity} />
                                            <span className="checkmark"></span>
                                        </label>
                                        {/* <label className="fancy-checkbox custom-bgcolor-blue">
                                                <input type="checkbox" name="viewActivity" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewActivity)} checked={permissions.viewActivity}></input>
                                                <span>View</span>
                                            </label>            */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Settings</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Player Report</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewReportedUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewReportedUser)} checked={permissions.viewReportedUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editReportedUser" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editReportedUser)} checked={permissions.editReportedUser} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Content</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContent)} checked={permissions.viewContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addContent)} checked={permissions.addContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContent)} checked={permissions.editContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteContent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteContent)} checked={permissions.deleteContent} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Promos</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewPromos" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewPromos)} checked={permissions.viewPromos} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addPromos" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addPromos)} checked={permissions.addPromos} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editPromos" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editPromos)} checked={permissions.editPromos} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deletePromos" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deletePromos)} checked={permissions.deletePromos} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group> */}

 

                            <FormGroup>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Status</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-radio mr-3 mb-2">Active
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-radio mr-3 mb-2">InActive
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-warning" onClick={(e) => onCloseHandler()}>Close</Button>
                        {props.modalType === 2 ? '' :
                            <Button className="btn btn-info" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;