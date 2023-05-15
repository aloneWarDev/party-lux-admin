import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../../config/config';
import { beforeRole, deleteRole, getRole, getPermission, getRoles } from './permissions.actions'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import validator from 'validator';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import PermissionsModal from './permissionsModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Overlay, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");



const StaffPermissions = (props) => {
    const [roleModal, setroleModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [isLoader, setLoader] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [currentRoleId, setCurrentRoleId] = useState('')
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [role, setRole] = useState({
        /**  system permissions **/

        // dashboard
        viewDashboard: false,

        // staff's records
        addStaff: false,
        editStaff: false,
        deleteStaff: false,
        viewStaff: false,

        // users records
        addUser: false,
        editUser: false,
        deleteUser: false,
        viewUsers: false,

        // permissions
        addRole: false,
        editRole: false,
        deleteRole: false,
        viewRole: false,


        // FAQs / articles
        addFaq: false,
        editFaq: false,
        deleteFaq: false,
        viewFaqs: false,



        // Game
        addGame: false,
        editGame: false,
        deleteGame: false,
        viewGame: false,

        // Tournament
        addTournament: false,
        editTournament: false,
        deleteTournament: false,
        viewTournament: false,

        // Theme
        addTheme: false,
        editTheme: false,
        deleteTheme: false,
        viewTheme: false,


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


        // Email Template
        editEmailTemplate: false,
        viewEmailTemplate: false,

        //Report Player
        viewReportedUser: false,
        editReportedUser: false,

        //Genres
        viewGenres: false,
        addGenres: false,
        editGenres: false,
        deleteGenres: false,

        // contact
        viewContact: false,
        editContact: false,

        // activity
        viewActivity: false,

        // settings
        editSetting: false,
        viewSetting: false,

        // content
        addContent: false,
        editContent: false,
        viewContent: false,
        deleteContent: false,


        status: true
        // status (i.e: true for active & false for in-active)

    })


    // set modal type
    const setModal = (type = 0, role = {}) => {

        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && role._id) {
            setRole(role)
        }
        if (type === 1) {
            setEmpty()
            setRole(role)
            props.getRoles()
        }
        // getCategory(catId)
    }
    const setEmpty = () => {
        for (let key in role) {
            role[key] = false
        }
    }

    const getData = (role) => {
        setRole(role)
        props.getRoles()
    }

    const deleteRoleHandler = (roleId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteRole(roleId)
            }
        })
    }

    const onSearch = () => {
        props.getRoles(1, limit, search)
        setModalType(0)
        setLoader(true)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    }

    const reset = () => {
        setLoader(true)
        setSearch('')
        props.getRoles()
    }

    const onPageChange = (page) => {
        props.getRoles(page, limit, search)
        setLoader(true)
    }

    useEffect(() => {
        props.getRoles(1, 10, "", true)
        setLoader(true)
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrepted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrepted)
            if (roleDecrepted && roleDecrepted.trim() !== "") {
                // role = JSON.parse(roleDecrepted);
                
            }
            else {
                ENV.clearStorage();
            }
        }
        setCurrentRoleId(role !== '' ? role : null)
        setLoader(true)
    }, [])

    // useEffect(()=>{
    //     if (Object.keys(props.addRoleRes).length > 0 && props.authenticate === true) {
    //         // closeModal();
    //         // this.props.role.removeLoader();
    //         setroleModal(!props.roleModal)

    //         setModalType(1)
    //         setLoader(false)
    //         // setEmpty()
    //         // setRole({})

    //         // toast.success(`Success! ${props.addRoleRes.message}`);
    //         props.beforeRole();
    //     }
    // },[props.addRoleRes])
    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0 && props.authenticate === true) {
            setLoader(false)
            // alert("are you culprit")
            
            if (modalType === 1) {
                setRole(role)
            }
            
            //updateRoleRes
            
            setRoles(props.getRolesRes.data)
            setPage(props.getRolesRes.page)
            setPages(props.getRolesRes.pages)
            setTotal(props.getRolesRes.total)
            setLimit(props.getRolesRes.limit)

            // props.beforeRole();
        }
    }, [props.getRolesRes])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])

    useEffect(() => {
        if (Object.keys(props.deleteRoleRes).length > 0 && props.authenticate === true) {
            setModalType(1)
            setLoader(false)
            // toast.success(`Success! ${props.deleteRoleRes.message}`);
            props.beforeRole();
            props.getRoles();
        }
    }, [props.deleteRoleRes])

    useEffect(() => {
        if (props.updateRoleRes.length) {
            if (props.getRolesRes.data.length > 0) {
                let remainingRoles = props.getRolesRes.data.filter((item) => {
                    if (String(item._id) !== String(props.updateRoleRes.result._id)) {
                        return item
                    }
                })
                let updatedRoles = [props.updateRoleRes.result, ...remainingRoles]
                setRoles(updatedRoles)
            }
        }
    }, [props.updateRoleRes])


    return (
        <>
            {
                isLoader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="filter-card card">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Search with Title...</Form.Label>
                                                    <Form.Control type="email" placeholder="Title" onKeyPress={handleKeyPress} name="search" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
                                                    {/* <button type="button" className="btn btn-default" onClick={onSearch} ><i className="fa fa-search" /></button> */}
                                                </Form.Group>
                                                {/* <form className="navbar-form navbar-left search-form">
                                                    <input type="text" className="form-control" placeholder="Search with title..." onKeyPress={handleKeyPress} name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                                                    <button type="button" className="btn btn-default" onClick={onSearch} ><i className="fa fa-search" /></button>
                                                </form> */}
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className="d-none d-sm-block mb-2 form-label">&nbsp;</label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <button type="button" className="btn btn-info" disabled={!search} onClick={onSearch} > {/* <i className="fa fa-search" /> */}Search </button>
                                                        <button type="button" className="btn btn-warning" hidden={!search} onClick={reset}>Reset</button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>

                                </Card>

                                {/* <Row>
                                    <Col>
                                        <span style={{ color: 'black' }}>{`Total : ${total}`}</span>
                                        <label>&nbsp;</label>
                                    </Col>
                                </Row>                                 */}
                                <Card className="table-big-boy">

                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>{`Total : ${total}`}</span>
                                        </div>

                                        <div className="d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>Permissions</Card.Title>

                                            {/* <p className="card-category">List of Categories</p> */}
                                            <Button variant="info" className="float-sm-right mb-0" onClick={() => setModal(1)}> Add New Staff Role</Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy permissions">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='td-title title-col'>Title</th>
                                                        {/* <th className=' td-perission'>Permissions</th> */}
                                                        <th className="text-center td-status">Status</th>
                                                        <th className="td-action">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        roles && roles.length > 0 ?
                                                            roles.map((val, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td className='text-center'>{((limit * page) - limit) + key + 1}</td>
                                                                        <td className='title-col'>
                                                                            <Link to='#' data-toggle="modal" data-target="modal-primary" className="text-capitalize" onClick={() => setModal(2, val)}>
                                                                                {
                                                                                    val.title ?
                                                                                        (val.title).length >= 29 ?
                                                                                            `${val.title.slice(0, 29)}...`
                                                                                            : val.title
                                                                                        : "N/A"
                                                                                }
                                                                            </Link>
                                                                        </td>
                                                                        {/* <td className="permissions-pills">
                                                                            {
                                                                                Object.entries(val).map((permission, index) => {
                                                                                    if (permission[1] === true && permission[0] !== 'status') {
                                                                                        var pVal = permission[0];
                                                                                        return (
                                                                                            <label key={index} className="label label-info" style={{ marginRight: '5px' }}>
                                                                                                {
                                                                                                    pVal.split(/(?=[A-Z])/).map((keyText, i) => {
                                                                                                        return (<span key={i} className="text-capitalized">{keyText.replace(/\b\w/g, l => l.toUpperCase())} </span>)
                                                                                                    })
                                                                                                }
                                                                                            </label>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </td> */}


                                                                        <td>
                                                                            <span className='d-flex justify-content-center align-items-center w-100 h-100'>
                                                                                <span className={`status ${val.status ? `bg-success` : `bg-danger`
                                                                                    }`}>
                                                                                    {
                                                                                        val.status ?
                                                                                            <span className="label label-success p-1">Active</span>
                                                                                            : <span className="label label-danger status p-1">Inactive</span>
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top ">
                                                                                    <div className="trigger">
                                                                                        {
                                                                                            currentUserRole?.viewRole ?
                                                                                                <button type='button'
                                                                                                    data-toggle="tooltip" data-placement="top" title="Tooltip on top"


                                                                                                    className="btn-action btn-primary" onClick={() => setModal(2, val)}><i className="fa fa-eye" /></button>
                                                                                                : <></>
                                                                                        }
                                                                                        <div className="tooltip" >View</div>
                                                                                    </div>


                                                                                </li>
                                                                                <li className="d-inline-block align-top">

                                                                                    <div className="trigger">
                                                                                        {currentUserRole?.editRole ?

                                                                                            (currentRoleId !== val._id ?
                                                                                                <button className="btn-action btn-warningval" title="Edit" onClick={() => { setModal(3, val) }}><i className="fa fa-edit" /></button>
                                                                                                :
                                                                                                <button className="btn-action btn-danger" title="Edit" disabled><i className="fa fa-edit" /></button>) : <></>
                                                                                        }
                                                                                        <div className="tooltip" >Edit</div>
                                                                                    </div>
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                    <div className='trigger' >
                                                                                        {currentUserRole?.deleteRole ?
                                                                                            (currentRoleId !== val._id ?
                                                                                                <button className="btn-action btn-danger" onClick={() => deleteRoleHandler(val._id)}><i className="fa fa-trash" /></button>
                                                                                                :
                                                                                                <button className="btn btn-danger" title="Delete" disabled><i className="fa fa-trash" /></button>) : <></>
                                                                                        }
                                                                                        <div className='tooltip'>Delete</div>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </td>

                                                                        {/* <td>


                                                                            <div className="btn-group">







                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">View</Tooltip>)} placement="top" >
                                                                                    {
                                                                                        currentUserRole?.viewRole ?
                                                                                            <button type='button' className="btn-action btn-primary" onClick={() => setModal(2, val)}><i className="fa fa-eye" /></button>
                                                                                            : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">Edit</Tooltip>)} placement="top" >
                                                                                    {currentUserRole?.editRole ?

                                                                                        (currentRoleId !== val._id ?
                                                                                            <a className="btn-action btn-warning" title="Edit" onClick={() => setModal(3, val)}><i className="fa fa-edit" /></a>
                                                                                            :
                                                                                            <a className="btn-action btn-danger" title="Edit" disabled><i className="fa fa-edit" /></a>) : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">Delete</Tooltip>)} placement="top" >
                                                                                    {currentUserRole?.deleteRole ?
                                                                                        (currentRoleId !== val._id ?
                                                                                            <a className="btn-action btn-danger" title="Delete" onClick={() => deleteRoleHandler(val._id)}><i className="fa fa-trash" /></a>
                                                                                            :
                                                                                            <a className="btn btn-danger" title="Delete" disabled><i className="fa fa-trash" /></a>) : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        </td> */}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td className="text-center px-0" colSpan="5">
                                                                    <span className="alert alert-danger d-block text-center">No Record Found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Col className="pb-4">
                                                <Pagination
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={page} // current active page
                                                    total={pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            </Col>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <PermissionsModal setData={getData} modalType={modalType} setModalType={setModalType} roleModal={roleModal} setroleModal={setroleModal} role={role} setLoader={setLoader} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    addRoleRes: state.role.addRoleRes,
    updateRoleRes: state.role.updateRoleRes,
    deleteRoleRes: state.role.deleteRoleRes,
    getRoleRes: state.role.getRoleRes,
    getRolesRes: state.role.getRolesRes,
    authenticate: state.role.authenticate,
    errors: state.errors,
    // roles and permission
    currentUserPermission: state.role,
});

export default connect(mapStateToProps, { beforeRole, deleteRole, getRole, getRoles, getPermission })(StaffPermissions);