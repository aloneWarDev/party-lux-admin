
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router';
import { ENV } from '../../config/config';
import { beforeUser, getUsers, deleteUser, createUser, editUser } from './UserManagement.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg'
import validator from 'validator';
import DatePicker from 'react-date-picker';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';

var CryptoJS = require("crypto-js");

const PlayerUser = (props) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [permissions, setPermissions] = useState({})
    const [Page, setPage] = useState(1)
    const [users, setUsers] = useState(null)
    const [formValid, setFormValid] = useState(false)
    ///Msg
    const [profileImageMsg, setProfileImageMsg] = useState('')

    const [usernameMsg, setUsernameMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('')
    const [facebookLinkMsg, setFacebookLinkMsg] = useState('')
    const [twitterLinkMsg, setTwitterLinkMsg] = useState('')
    const [gPlusLinkMsg, setGplusLinkMsg] = useState('')
    const [vineLinkMsg, setVineLinkMsg] = useState('')
    const [status, setStatus] = useState(false)
    //user properties
    const [previewImage, setPreviewImage] = useState('')
    const [isImageChange, setIsImageChange] = useState(false)
    const [profileImage, setProfileImage] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPass, setShowPass] = useState({
        current: false,
        confirm: false
    })
    const [facebookLink, setFacebookLink] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [gPlusLink, setGplusLink] = useState('')
    const [vineLink, setVineLink] = useState('')
    //General
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [user, setUser] = useState(null)
    const [loader, setLoader] = useState(true)

    const [searchUsername, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [searchAddress, setSearchAddress] = useState('')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState('')
    const [searchAtTo, setSearchCreatedAtTo] = useState('')
    const [minOfSearchAtTo, setMinOfSearchAtTo] = useState("")
    const [maxOfSearchAtTo, setMaxOfSearchAtTo] = useState("")

    const [minOfSearchAtFrom, setMinOfSearchAtFrom] = useState("")
    const [maxOfSearchAtFrom, setMaxOfSearchAtFrom] = useState("")
    const [isOpenCalenderFrom, setIsOpenCalenderFrom] = useState(false)
    const [isOpenCalenderAtTo, setIsOpenCalenderAtTo] = useState(false)

    useEffect(() => {
        // const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        const filter = { type: '2' }
        reset()
        // if (searchUsername !== undefined && searchUsername !== null && searchUsername !== '')
        //     filter.username = searchUsername
        // if (searchEmail !== undefined && searchEmail !== null && searchEmail !== '')
        //     filter.email = searchEmail
        // if (searchAddress !== undefined && searchAddress !== null && searchAddress !== '')
        //     filter.walletAddress = searchAddress
        // if (searchAtFrom !== undefined && searchAtFrom !== null && searchAtFrom !== '')
        //     filter.createdAtFrom = searchAtFrom
        // if (searchAtTo !== undefined && searchAtTo !== null && searchAtTo !== '')
        //     filter.createdAtTo = searchAtTo

        window.scroll(0, 0)
        props.getUsers('', filter)
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])


    useEffect(() => {
        if (props.user.getUserAuth) {
            const { users, pagination } = props.user
            setUsers(users)
            setPagination(pagination)
            props.beforeUser()
        }
    }, [props.user.getUserAuth])

    useEffect(() => {
        if (props.user.upsertUserAuth) {
            setLoader(true)
            
            let filtered = users.filter((item) => {
                if (item._id !== props.user.userId)
                    return item
            })
            
            setUsers([...filtered, props.user.user])
            setLoader(false)
            const filter = { type: '2' }
            if (searchUsername) {
                filter.username = searchUsername
                localStorage.setItem('playerUser_name', searchUsername)

            }
            if (searchEmail) {
                filter.email = searchEmail
                localStorage.setItem('playerUsers_email', searchEmail)
            }
            if (searchAddress) {
                filter.walletAddress = searchAddress
                localStorage.setItem('userWalletAddress', searchAddress)

            }
            if (searchAtFrom) {
                filter.createdAtFrom = searchAtFrom
                localStorage.setItem('CreatedAtFrom', searchAtFrom)

            }
            if (searchAtTo) {
                filter.createdAtTo = searchAtTo
                localStorage.setItem('CreatedAtTo', searchAtTo)
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getUsers(qs, filter, '', false, false)
            props.beforeUser()
        }
    }, [props.user.upsertUserAuth])

    useEffect(() => {
        if (props.user.deleteUserAuth) {
            // let filtered = users.filter((item) => {
            //     if (item._id !== props.user.userId)
            //         return item
            // })
            // setUsers(filtered)
            const filter = { type: '2' }
            if (searchUsername) {
                filter.username = searchUsername
                localStorage.setItem('playerUser_name', searchUsername)
            }
            if (searchEmail) {
                filter.email = searchEmail
                localStorage.setItem('playerUsers_email', searchEmail)
            }
            if (searchAddress) {
                filter.walletAddress = searchAddress
                localStorage.setItem('userWalletAddress', searchAddress)
            }
            if (searchAtFrom) {
                filter.createdAtFrom = searchAtFrom
                localStorage.setItem('CreatedAtFrom', searchAtFrom)
            }
            if (searchAtTo) {
                filter.createdAtTo = searchAtTo
                localStorage.setItem('CreatedAtTo', searchAtTo)
            }
            
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            window.scroll(0, 0)
            props.getUsers(qs, filter)
            props.beforeUser()
        }
    }, [props.user.deleteUserAuth])

    useEffect(() => {
        if (users) {
            setLoader(false)
            if (window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                setModal(3, urlParams.get('userId'))
            }
        }
    }, [users])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const initalizeStates = () => {
        setPreviewImage('')
        setProfileImage('')
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setFacebookLink('')
        setTwitterLink('')
        setGplusLink('')
        setVineLink('')
        setStatus(false)

        setProfileImageMsg('')
        setUsernameMsg('')
        setEmailMsg('')
        setPasswordMsg('')
        setConfirmPasswordMsg('')
        setFacebookLinkMsg('')
        setTwitterLinkMsg('')
        setGplusLinkMsg('')
        setVineLinkMsg('')
        setFormValid(false)
    }

    // set modal type
    const setModal = (type = 0, userId = null) => {
        initalizeStates()
        setUserModal(!userModal)
        setModalType(type)
        setLoader(false)
        // add user
        if (type === 1) {
            let user = {
                profileImage: '', username: '', email: '', password: '', facebookLink: '', twitterLink: '', gPlusLink: '', vineLink: '', status: false
            }
            setUser(user)
        }
        // edit or view user
        else if ((type === 2 || type === 3) && userId)
            getUser(userId)
    }

    const getUser = async (userId) => {
        setLoader(true)
        const userData = await users.find((elem) => String(elem._id) === String(userId))
        if (userData) {
            
            setUser({ ...userData })
            setPreviewImage(userData.profileImage ? userData.profileImage : '')
            setProfileImage(userData.profileImage ? userData.profileImage : '')
            setUsername(userData.username ? userData.username : '')
            setPassword('')
            setConfirmPassword('')
            setEmail(userData.email)
            setFacebookLink(userData.facebookLink ? userData.facebookLink : '')
            setTwitterLink(userData.twitterLink ? userData.twitterLink : '')
            setGplusLink(userData.gPlusLink ? userData.gPlusLink : '')
            setVineLink(userData.vineLink ? userData.vineLink : '')
            setStatus(userData?.status !== undefined ? userData?.status : false)
        }
        setLoader(false)
    }

    const submit = (Id , type) => {
        
        let check = true
        // 
        if (validator.isEmpty(profileImage + "")) {
            setProfileImageMsg('Profile Image is empty.')
            check = false
        } else setProfileImageMsg('')

        if (validator.isEmpty(username.trim())) {
            setUsernameMsg('Username is required')
            check = false
        } else setUsernameMsg('')

        if (validator.isEmpty(email.trim())) {
            setEmailMsg('Email is Required.')
            check = false
        }
        else {
            if (!validator.isEmail(email)) {
                setEmailMsg('Please enter a valid email address.')
                check = false
            } else { setEmailMsg('') }
        }

        if(type === 1){
            if (validator.isEmpty(password)) {
                if (modalType !== 3) {
                    setPasswordMsg('Password is Required.')
                    check = false
                }
            }
            else {
                setPasswordMsg('')
            }
    
            if (validator.isEmpty(confirmPassword)) {
                if (modalType !== 3 || !validator.isEmpty(password)) {
                    setConfirmPasswordMsg('Confirm password is Required.')
                    check = false
                }
            }
        }

        // else {
        // if (!validator.isEmpty(password) || !validator.isEmpty(confirmPassword)){
        //     if (!validator.equals(password, confirmPassword)) {
        //         setConfirmPasswordMsg('Passwords do not match')
        //         check = false
        //     }
        //     else {
        //         // setPasswordMsg('')
        //         setConfirmPasswordMsg('')
        //     }
        // }
        // }

        if (!validator.isEmpty(password) || !password.replace(/\s/g, '').length) {
            if ( ( validator.isEmpty(password) || !password.replace(/\s/g, '').length ) &&  modalType === 1) {
                setPasswordMsg('New Password is Required.')
                check = false
            }
            else if (!validator.equals(password, confirmPassword) ) {
                setConfirmPasswordMsg('Password and Confirm Password do not match')
                check = false
            }
            if(password.replace(/\s/g, '').length && confirmPassword.replace(/\s/g, '').length && validator.equals(password, confirmPassword) ){
                console.log("ENV.validatePassword(password): ",ENV.validatePassword(password) )

                if(!ENV.validatePassword(password) ){
                    check = false
                    setConfirmPasswordMsg("Password must contain Upper Case, Lower Case , a Special Character , a Number and must be at least 8 characters in length.")
                }
            }
        }else { setPassMsg('') }        



        if (check) {
            setFormValid(false)

            let payload = { profileImage, username : username.trim(), email, password, facebookLink, twitterLink, gPlusLink, vineLink, type: '2', status }

            // if (profileImage) {
            //     payload.profileImage = profileImage
            // } 

            if (modalType === 3) { // add modal type
                
                if (!isImageChange) {
                    delete payload.profileImage
                }
                if (!payload.password) {
                    delete payload.password
                }
                dispatch(editUser(Id, payload));
            }

            
            if (modalType === 1) { // add modal type
                
                dispatch(createUser(payload));
            }
            setUserModal(!userModal)
        }
        else {
            // $('#modal-primary').scrollTop(0, 0)
            setFormValid(true)
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
            if( files[0].type.split('/')[0] === 'image'){
                setProfileImageMsg('')
                setPreviewImage(reader.result);
                setIsImageChange(true)
            }else{
                setProfileImageMsg('Invalid File Format')
                setPreviewImage('')
            }
            // setPreviewImage(reader.result);
            // setIsImageChange(true)
        };
        // setImageFile(files[0]);
        reader.readAsDataURL(files[0]);
    };
    const onPageChange = async (page) => {
        const filter = { type: '2' }
        if (searchUsername) {
            filter.username = searchUsername
            localStorage.setItem('playerUser_name', searchUsername)

        }
        if (searchEmail) {
            filter.email = searchEmail
            localStorage.setItem('playerUsers_email', searchEmail)
        }
        if (searchAddress) {
            filter.walletAddress = searchAddress
            localStorage.setItem('userWalletAddress', searchAddress)

        }
        if (searchAtFrom) {
            filter.createdAtFrom = searchAtFrom
            localStorage.setItem('CreatedAtFrom', searchAtFrom)

        }
        if (searchAtTo) {
            filter.createdAtTo = searchAtTo
            localStorage.setItem('CreatedAtTo', searchAtTo)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getUsers(qs, filter, "PlayerUser", true)
    }

    const deleteUser = (userId) => {
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
                props.deleteUser(userId)
            }
        })
    }

    const applyFilters = () => {
        const filter = { type: '2' }
        if (searchUsername) {
            filter.username = searchUsername
            localStorage.setItem('playerUser_name', searchUsername)

        }
        if (searchEmail) {
            filter.email = searchEmail
            localStorage.setItem('playerUsers_email', searchEmail)
        }
        if (searchAddress) {
            filter.walletAddress = searchAddress
            localStorage.setItem('userWalletAddress', searchAddress)

        }
        if (searchAtFrom) {
            filter.createdAtFrom = new Date(searchAtFrom)
            localStorage.setItem('CreatedAtFrom', searchAtFrom)
        }
        if (searchAtTo) {
            filter.createdAtTo = new Date(searchAtTo) //
            localStorage.setItem('CreatedAtTo', searchAtTo)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        
        props.getUsers(qs, filter, "PlayerUser", true)
        setLoader(true)
    }

    const reset = () => {
        setSearchCreatedAtFrom('')
        setSearchCreatedAtTo('')
        setSearchAddress('')
        setSearchName('')
        setSearchEmail('')
        setMinOfSearchAtFrom("")
        setMaxOfSearchAtFrom("")
        setMinOfSearchAtTo("")
        setMaxOfSearchAtTo("")
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getUsers(qs, { type: '2' })
        setLoader(true)
        localStorage.removeItem('playerUser_name')
        localStorage.removeItem('playerUsers_email')
        localStorage.removeItem('userWalletAddress')
        localStorage.removeItem('CreatedAtFrom')
        localStorage.removeItem('CreatedAtTo')
        localStorage.removeItem('showUsersFilter')
    }

    useEffect(() => {
        if (searchAtFrom) {
            
            setIsOpenCalenderFrom(false)
        }
    }, [searchAtFrom])
    const handleDate = (e, state, num = '') => {
        
        if (e) {
            if (num === 1) { // From
                setMinOfSearchAtFrom("")
                setMaxOfSearchAtFrom("")
                setMinOfSearchAtTo(e)
                setMaxOfSearchAtTo("")
                setIsOpenCalenderFrom(false)
            }
            if (num === 2) { //To
                setMinOfSearchAtFrom("")
                setMaxOfSearchAtFrom("")
                setMinOfSearchAtTo("")
                setMaxOfSearchAtTo("")
                setIsOpenCalenderAtTo(false)
            }
            state(e)
        }
        else {
            state('')
            setMinOfSearchAtTo('')
            setIsOpenCalenderFrom(false)
        }
    }
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className="pb-3">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className='align-items-baseline'>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Name</label>
                                                    <Form.Control value={searchUsername} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Wallet Address</label>
                                                <Form.Control value={searchAddress} type="text" placeholder="Wallet Address" onChange={(e) => setSearchAddress(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Email</label>
                                                <Form.Control value={searchEmail} type="text" placeholder="john@gmail.com" onChange={(e) => setSearchEmail(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Created At From</label>

                                                <Form.Group>
                                                    <DatePicker onChange={(e) => { handleDate(e, setSearchCreatedAtFrom, 1) }} closeCalendar={isOpenCalenderFrom} value={searchAtFrom ? searchAtFrom : null} maxDate={searchAtTo ? new Date(searchAtTo) : new Date()} minDate={minOfSearchAtTo ? new Date(minOfSearchAtTo) : new Date("1800-01-01")} />
                                                    {/* <Form.Control value = {searchAtFrom} type="date" placeholder="mm/dd/yyyy" min={minOfSearchAtFrom ? minOfSearchAtFrom : ""} max={maxOfSearchAtFrom ? moment().format(maxOfSearchAtFrom , "YYYY-MM-DD") : moment().format("YYYY-MM-DD")} onChange={(e) =>{ setSearchCreatedAtFrom(e.target.value) }}/* onChange={} onKeyDown={}  */}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Created At To</label>

                                                <Form.Group>
                                                    <DatePicker onChange={(e) => { handleDate(e, setSearchCreatedAtTo, 2) }} closeCalendar={isOpenCalenderAtTo} value={searchAtTo ? searchAtTo : null} maxDate={new Date()} minDate={searchAtFrom ? new Date(searchAtFrom) : new Date("1800-01-01")} />
                                                    {/* <Form.Control value = {searchAtTo} type="date" placeholder="mm/dd/yyyy" min={minOfSearchAtTo ? minOfSearchAtTo : ""} max={ maxOfSearchAtTo ? moment().format(maxOfSearchAtTo , "YYYY-MM-DD") : moment().format("YYYY-MM-DD")} onChange={(e) =>{ setSearchCreatedAtTo(e.target.value)}}/* onChange={} onKeyDown={}  */}
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='m-0' variant="info" disabled={!searchUsername && !searchEmail && !searchAddress && !searchAtFrom && !searchAtTo} onClick={applyFilters}>Search</Button>
                                                        <Button className='m-0' variant="warning" hidden={!searchUsername && !searchEmail && !searchAddress && !searchAtFrom && !searchAtTo} onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col>
                                <span style={{color : 'white'}}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>Player Users</Card.Title>
                                            {
                                                permissions && permissions.addPlayerUser &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right mb-0"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add User
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start serial-col">#</th>
                                                        <th className="td-image text-center">Image</th>
                                                        <th className="td-name text-center">Username</th>
                                                        <th className="td-email text-center">Email</th>
                                                        <th className="td-address text-center">Wallet Address</th>
                                                        <th className="td-created text-center">Created At</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users && users.length ?
                                                            users.map((user, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className='table-img-center'>
                                                                            <div className="user-image">
                                                                                {/* {} */}
                                                                                <img className="img-fluid" alt="User Image" src={user.profileImage ? user.profileImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {
                                                                                user.username ?
                                                                                    user.username.length >= 29 ?
                                                                                        `${user.username.slice(0, 29)}...`
                                                                                        :
                                                                                        user.username
                                                                                    : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            {user.email ? user.email : 'N/A'}
                                                                        </td>
                                                                        <td className="td-address td-address-in text-center">
                                                                            {user.walletAddress ? user.walletAddress : 'N/A'}
                                                                        </td>
                                                                        <td className="td-number text-center">{moment(user.createdAt).format('DD MMM YYYY')}</td>

                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">
                                                                                {
                                                                                    permissions && permissions.viewPlayerUsers &&
                                                                                    <li className="d-flex align-items-center">
                                                                                        <div className='trigger'>
                                                                                            <a
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(2, user._id)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </a>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                                {
                                                                                    permissions && permissions.editPlayerUser &&

                                                                                    <li className="d-flex align-items-center">
                                                                                        <div className='trigger' >
                                                                                            <a
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(3, user._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </a>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                                {
                                                                                    permissions && permissions.deletePlayerUser &&

                                                                                    <li className="d-flex align-items-center">
                                                                                        <div className='trigger' >
                                                                                            <a
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => deleteUser(user._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </a>
                                                                                            <div className='tooltip'>Delete</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No User Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="pb-4">
                                                {pagination &&
                                                    <Pagination
                                                        className="m-3"
                                                        defaultCurrent={1}
                                                        pageSize // items per page
                                                        current={Page > pagination.pages ? pagination.pages : Page} // current active page
                                                        total={pagination.pages} // total pages
                                                        onChange={onPageChange}
                                                        locale={localeInfo}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>


                        {
                            modalType === 2 && user &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {/* {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''} User */}
                                                View
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label className="label-font mr-2">Profile Image: </label>
                                            <div>
                                                <div className="user-view-image">
                                                    <img src={user.profileImage ? user.profileImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <div className='view-players mb-3 d-sm-flex'>
                                            <Link
                                                className="btn-action btn-primary mr-0 mr-sm-3 mb-sm-0 mb-3 d-flex"
                                                type="button"
                                                variant="info"
                                                target="_blank"
                                                to={`/tournament-participation/${user._id}`}
                                            >
                                                View Tournament Participation
                                            </Link>
                                            <Link
                                                className="btn-action btn-primary mr-0 d-flex"
                                                type="button"
                                                variant="info"
                                                target="_blank"
                                                to={`/player-participation-payment/${user._id}`}
                                            >
                                                Participation Payment
                                            </Link>
                                        </div>
                                        <div className=' view-players mb-3'>
                                            <Link
                                                className="btn-action btn-primary"
                                                type="button"
                                                variant="info"
                                                target="_blank"
                                                to={`/refund/${user._id}`}
                                            >
                                                Refund
                                            </Link>
                                        </div>



                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Username: </label><span className="field-value text-white">{user.username ? user.username : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="d-flex align-items-center">
                                                <label className="label-font mr-2">Email: </label><span className="field-value text-white">{user.email ? user.email : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="d-flex align-items-center">
                                                <label className="label-font mr-2">Wallet Address: </label><span className="field-value text-white">{user.walletAddress ? user.walletAddress : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        {/* <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Description:</label><span className="field-value"> {user.description ? user.description : 'N/A'}</span>
                                            </Form.Group>
                                        </div> */}
                                        {/* <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Facebook: </label><span className="field-value text-white">{user.facebookLink ? user.facebookLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Twitter: </label><span className="field-value text-white">{user.twitterLink ? user.twitterLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">G Plus: </label><span className="field-value text-white">{user.gPlusLink ? user.gPlusLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Vine: </label><span className="field-value text-white">{user.vineLink ? user.vineLink : 'N/A'}</span>
                                            </Form.Group>
                                        </div> */}
                                        <div>
                                            <label className='d-block'>Status</label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div>
                                                    <input disabled={true} name="status" type="checkbox" checked={status} value={status} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2 d-inline-block' ><i />Active</span>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <span className="checkmark"></span>
                                                <div>
                                                    <input disabled={true} name="status" type="checkbox" checked={!status} value={!status} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2'  ><i />Inactive</span>
                                            </label>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {/*  */}
                        {
                            (modalType === 1 || modalType === 3) && user &&

                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                {/* {
                                    formValid ?
                                        <div className="text-danger">Please fill the required fields</div> : null
                                } */}
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''}
                                                User Information
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label>Profile Image<span className="text-danger"> *</span></label>
                                            <div className='mb-4 user-view-image'>
                                                {(previewImage !== undefined || previewImage !== '') && <img src={previewImage ? previewImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />}
                                            </div>
                                            <Form.Control
                                                className='text-white'
                                                onChange={async (e) => {
                                                    fileSelectHandler(e);
                                                    if(e.target.files[0].type.split('/')[0] === 'image'){
                                                        setProfileImage(e.target.files[0])
                                                    }
                                                    else{
                                                        setProfileImage('')
                                                    }
                                                    // const res = await ENV.uploadImage(e);
                                                    // setProfileImage(e.target.files[0])
                                                    // setDetail({ ...detail, image: res ? ENV.uploadedImgPath+res  : "" });
                                                }}
                                                // placeholder="Title"
                                                type="file"
                                            ></Form.Control>
                                            <span className={profileImageMsg ? `` : `d-none`}>
                                                {(profileImageMsg) && <label className="pl-1 text-danger">{profileImageMsg}</label>}
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Username <span className="text-danger">*</span></label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="username"
                                                onChange={(e) =>{
                                                    setUsernameMsg('')
                                                    setUsername(e.target.value)
                                                } }
                                                value={username}
                                                maxLength={50}
                                                required
                                            />
                                            <span className={usernameMsg ? `` : `d-none`}>
                                                {(username === '' || username === null || usernameMsg) && <label className="pl-1 text-danger">{usernameMsg}</label>}
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Email <span className="text-danger">*</span></label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="email"
                                                onChange={(e) =>{ setEmailMsg(''); setEmail(e.target.value); } }
                                                value={email}
                                                required
                                            />
                                            <span className={emailMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{emailMsg}</label>
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>password { modalType === 1 ?  <span className="text-danger">*</span> : ''}</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type={showPass.current ? "text" : "password"}
                                                name="description"
                                                onChange={(e) =>{setPasswordMsg(''); setPassword(e.target.value)} }
                                                value={password}
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
                                                {<label className="pl-1 text-danger">{passwordMsg}</label>}
                                            </span>
                                        <Form.Group>
                                            <label>Confirm password { modalType === 1 ?  <span className="text-danger">*</span> : ''}</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type={showPass.confirm ? "text" : "password"}
                                                name="description"
                                                onChange={(e) =>{ setConfirmPasswordMsg(''); setConfirmPassword(e.target.value)} }
                                                value={confirmPassword}
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
                                            <span className={confirmPasswordMsg ? `` : `d-none`}>
                                                {(confirmPassword === '' || confirmPassword === null) ? <label className="pl-1 text-danger">{confirmPasswordMsg}</label> : confirmPasswordMsg ? <label className="pl-1 text-danger">{confirmPasswordMsg}</label> : ''}
                                                {/* {(confirmPassword === ''  || confirmPassword === null || password!==confirmPassword) && <label className="pl-1 text-danger">{confirmPasswordMsg}</label>} */}
                                            </span>
                                        {/* <Form.Group>
                                            <label>Facebook </label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="facebookLink"
                                                onChange={(e) => setFacebookLink(e.target.value)}
                                                value={facebookLink}

                                            />
                                            <span className={facebookLinkMsg ? `` : `d-none`}>
                                                {(facebookLink === '' || facebookLink === null) && <label className="pl-1 text-danger">{facebookLinkMsg}</label>}
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Twitter </label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="twitterLink"
                                                onChange={(e) => setTwitterLink(e.target.value)}
                                                value={twitterLink}

                                            />
                                            <span className={twitterLinkMsg ? `` : `d-none`}>
                                                {(twitterLink === '' || twitterLink === null) && <label className="pl-1 text-danger">{twitterLinkMsg}</label>}
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>G Plus</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="gPlusLink"
                                                onChange={(e) => setGplusLink(e.target.value)}
                                                value={gPlusLink ? gPlusLink : ''}

                                            />
                                            <span className={gPlusLinkMsg ? `` : `d-none`}>
                                                {(gPlusLink === '' || gPlusLink === null) && <label className="pl-1 text-danger">{gPlusLinkMsg}</label>}
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Vine</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="vineLink"
                                                onChange={(e) => setVineLink(e.target.value)}
                                                value={vineLink ? vineLink : ''}

                                            />
                                            <span className={vineLinkMsg ? `` : `d-none`}>
                                                {(vineLink === '' || vineLink === null) && <label className="pl-1 text-danger">{vineLinkMsg}</label>}
                                            </span>
                                        </Form.Group> */}

                                        <Form.Group >
                                            <label className='d-block'>Status</label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div>
                                                    <input disabled={modalType === 2} name="status" type="checkbox" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2 d-inline-block' onChange={(e) => setStatus(true)} ><i />Active</span>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <span className="checkmark"></span>
                                                <div>
                                                    <input disabled={modalType === 2} name="status" type="checkbox" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                            </label>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setUserModal(!userModal)}
                                    >Close</Button>
                                    {
                                        modalType === 3 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(user._id , 1)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(user._id , 3)} /* disabled={isLoader} */>Update</Button>
                                    }

                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});


export default connect(mapStateToProps, { beforeUser, getUsers, deleteUser, createUser, editUser, getRole })(PlayerUser);