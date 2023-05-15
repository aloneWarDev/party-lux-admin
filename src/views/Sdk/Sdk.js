import react, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from 'config/config';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import validator from 'validator';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TinyMCE from '../../components/TinyMCE/tinyMCE'

import moment from 'moment';
import DatePicker from 'react-date-picker';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import  userImage from './../../../src/assets/img/icons8-xcode-48.png';
// import defaultImage from '../../assets/img/placeholder.jpg'

import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { beforeSdk, getSdks, createSdk, editSdk, deleteSdk } from './Sdk.action';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");


const Sdk = (props) => {
    const [permissions, setPermissions] = useState({})
    const [sdks, setSdks] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    const [sdkModal, setSdkModal] = useState(false)
    const [sdk, setSdk] = useState(null)
    const [modalType, setModalType] = useState(0)
    //Sdk Properties
    const [name, setSdkName] = useState('')
    const [link, setSdkLink] = useState('')
    const [sdkAndroidLink, setSdkAndroidLink] = useState('')
    const [sdkIosLink, setSdkIosLink] = useState('')
    const [sdkUnityLink, setSdkUnityLink] = useState('')
    const [sdkVersion, setSdkVersion] = useState('')
    const [sdkInstruction, setSdkInstruction] = useState('')
    const [sdkReleaseNotes, setSdkReleaseNotes] = useState('')
    const [sdkReleaseDate, setSdkReleaseDate] = useState('')

    const [sdkLatest, setSdkLatest] = useState(true)
    const [sdkStatus, setSdkStatus] = useState(1) // for time being {"1" : Beta , "2": Stable}

    //

    //filter
    const [searchName, setSearchName] = useState('')
    const [searchPlatformType, setSearchPlatformType] = useState('')
    const [searchDevelopmentEnv, setSearchDevelopmentEnv] = useState('')
    const [searchLatest, setSearchLatest] = useState('')
    //filter-Select-options
    const [platformTypeArray, setPlatformTypeArray] = useState({ "1": 'Android', "2": 'iOS', "3": 'Cross Platform' })
    const [developmentEnvArray, setDevelopmentEnvArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })

    const [platformType, setPlatformType] = useState('')
    const [developmentEnv, setDevelopmentEnv] = useState('')
    //Msg
    const [sdkMsgs, setSdkMsgs] = useState({
        nameMsg: '',
        sdklinkMsg: '',
        sdkVersionMsg: '',
        sdkInstructionMsg: '',
        platformTypeMsg: '',
        developmentEnvMsg: '',
        releaseNotesMsg: '',
    })

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }

    useEffect(() => {
        toast.dismiss()
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])


    const submit = (Id) => {

        let check = true;
        let error = {}

        if (validator.isEmpty(name.trim())) {
            error.nameMsg = 'Name field is Required.'
            check = false
        } else { error.nameMsg = '' }

        if (!isValidURL(link)) {
            error.sdklinkMsg = 'Invalid SDK Link.'
            check = false
        } else { error.sdklinkMsg = '' }

        if (validator.isEmpty(sdkVersion.trim())) {
            error.sdkVersionMsg = 'Version is Required.'
            check = false
        } else { error.sdkVersionMsg = '' }

        if (!isValidURL(sdkInstruction)) {
            error.sdkInstructionMsg = 'Invalid Instruction Link'
            check = false
        } else { error.sdkInstructionMsg = '' }

        if (validator.isEmpty(platformType + "")) {
            error.platformTypeMsg = "Must Choose one Field"
            check = false
        } else { error.platformTypeMsg = "" }

        if (validator.isEmpty(developmentEnv + "")) {
            error.developmentEnvMsg = 'Must Choose one Field'
            check = false
        } else { error.developmentEnvMsg = '' }
        console.log("check: ", check)

        setSdkMsgs(error)
        if (check) {
            let payload = { name, platformType, developmentEnv }

            if (link) {
                payload.link = link
            }

            if (sdkVersion) {
                payload.version = sdkVersion
            }

            if (sdkInstruction) {
                payload.instruction = sdkInstruction
            }
            if (sdkStatus) {
                payload.versionStatus = sdkStatus
            }
            if (sdkReleaseNotes) {
                payload.releaseNotes = sdkReleaseNotes
            }
            if (sdkReleaseDate) {
                payload.releaseDate = new Date(sdkReleaseDate)
            }
            if (sdkAndroidLink) {
                payload.androidLink = sdkAndroidLink
            }
            if (sdkIosLink) {
                payload.iosLink = sdkIosLink
            }
            if (sdkUnityLink) {
                payload.unityLink = sdkUnityLink
            }
            payload.latest = sdkLatest


            if (modalType === 3) { // edit modal type
                // console.log("EDIT payload: ", payload)
                // console.log("Id: ", Id)
                props.editSdk(Id, payload)
            }
            if (modalType === 1) { // add modal type
                // console.log("Add payload: ", payload)
                props.createSdk(payload);
            }
            setSdkModal(!sdkModal)
        }
    }

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setSdkReleaseNotes(editorData);
    }


    function isValidURL(string) {
        // var expression = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        var regex = new RegExp(expression);
        if (string.match(regex)) {
            return true
        } else {
            return false
        }
    };

    useEffect(() => {
        window.scroll(0, 0)
        reset()
        // const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = {}
        if (searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName
        if (searchPlatformType !== undefined && searchPlatformType !== null && searchPlatformType !== '')
            filter.platformType = searchPlatformType
        if (searchDevelopmentEnv !== undefined && searchDevelopmentEnv !== null && searchDevelopmentEnv !== '')
            filter.developmentEnv = searchDevelopmentEnv
        if (searchLatest !== undefined && searchLatest !== null && searchLatest !== '')
            filter.latest = searchLatest === 'true' ? true : false
        props.getSdks('', filter);

        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)

    }, [])
    //sdks
    useEffect(() => {
        if (props.sdks.getSdksAuth) {
            // console.log("props.sdks.sdks: ",props.sdks.sdks)
            const { sdks, pagination } = props.sdks;
            // console.log("sdks: ",sdks )
            // console.log("pagination: ",pagination)
            setSdks(sdks)
            setPagination(pagination)
            props.beforeSdk()
            setLoader(false)
        }
    }, [props.sdks.getSdksAuth])
    //createAuth 
    useEffect(() => {
        if (props.sdks.createAuth) {
            // console.log("createAuth: ",props.sdks.sdk)
            props.getSdks('')
        }
    }, [props.sdks.createAuth])
    //editSdkAuth
    useEffect(() => {
        if (props.sdks.editSdkAuth) {
            // console.log("upsertAuth : ",props.sdks.sdk)
            props.getSdks('')
        }
    }, [props.sdks.editSdkAuth])
    //deleteSdk
    useEffect(() => {
        if (props.sdks.deleteSdkAuth) {
            const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
            window.scroll(0, 0)
            props.getSdks(qs)
            props.beforeSdk()
        }
    }, [props.sdks.deleteSdkAuth])
    //set modal type
    const setModal = (type = 0, sdkId = null) => {
        // console.log("sdkId: ",sdkId)
        // console.log("type: ",type)
        // console.log("sdkmodal: ",sdkModal)
        setSdkModal(!sdkModal)
        setModalType(type)
        setLoader(false)
        setSdkMsgs({ nameMsg: '', sdklinkMsg: '', sdkVersionMsg: '', sdkInstructionMsg: '', platformTypeMsg: '', developmentEnvMsg: '' })
        //add sdk
        if (type === 1) {
            let sdk = {
                name: '', link: '', version: '', instruction: '', developmentEnv: '', platformType: ''
            }
            setSdk(sdk)
            setSdkName('')
            setSdkLink('')
            setSdkVersion('')
            setSdkInstruction('')
            setSdkAndroidLink('')
            setSdkUnityLink('')
            setSdkIosLink('')
            setSdkReleaseNotes('')
            setSdkReleaseDate('')
            setSdkStatus(1)
            setPlatformType('')
            setDevelopmentEnv('')
        }
        //edit Sdk
        else if ((type === 2 || type === 3) && sdkId) {
            getSdk(type, sdkId)
        }
    }

    const getSdk = async (type, sdkId) => {
        setLoader(true)
        const sdkData = await sdks.find((elem) => String(elem._id) === String(sdkId))
        if (sdkData) {
            console.log("sdkData: ", sdkData)

            setSdk({ ...sdkData })
            setSdkName(sdkData.name ? sdkData.name : '')
            setSdkLink(sdkData.link ? sdkData.link : '')
            setSdkVersion(sdkData.version ? sdkData.version : '')
            setSdkInstruction(sdkData.instruction ? sdkData.instruction : '')
            setSdkAndroidLink(sdkData.androidLink ? sdkData.androidLink : '')
            setSdkUnityLink(sdkData.unityLink ? sdkData.unityLink : '')
            setSdkIosLink(sdkData.iosLink ? sdkData.iosLink : '')
            setSdkReleaseNotes(sdkData.releaseNotes ? sdkData.releaseNotes : '')
            setSdkReleaseDate(sdkData.releaseDate ? new Date(sdkData.releaseDate) : '')
            setSdkStatus(sdkData.versionStatus ? sdkData.versionStatus : 1) //default value {1 : Beta , 2 : Stable}
            setSdkLatest(sdkData.latest)
            setPlatformType(sdkData?.envsdk?.platformType ? sdkData.envsdk.platformType : '')
            setDevelopmentEnv(sdkData?.envsdk?.developmentEnv ? sdkData.envsdk.developmentEnv : '')

        }
        setLoader(false)
    }


    const deleteSdk = (sdkId) => {
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
                await props.deleteSdk(sdkId)
                setLoader(false)
            }
        })
    }

    const onPageChange = (page) => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('sdkName', searchName)
        }
        if (searchPlatformType) {
            filter.platformType = searchPlatformType
            localStorage.setItem('sdkPlatformType', searchPlatformType)
        }
        if (searchDevelopmentEnv) {
            filter.developmentEnv = searchDevelopmentEnv
            localStorage.setItem('sdkDevelopmentEnv', searchDevelopmentEnv)
        }
        if (searchLatest !== '') {
            filter.latest = searchLatest === 'true' ? true : false
            localStorage.setItem('sdkLatest', searchLatest)
        }

        setLoader(true)
        setPage(page)
        // console.log("filter in OnPageChange: ",filter)
        const qs = ENV.objectToQueryString({ page, limit: 10 })
        props.getSdks(qs, filter)
    }
    const applyFilters = () => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('sdkName', searchName)
        }
        if (searchPlatformType) {
            filter.platformType = searchPlatformType
            localStorage.setItem('sdkPlatformType', searchPlatformType)
        }
        if (searchDevelopmentEnv) {
            filter.developmentEnv = searchDevelopmentEnv
            localStorage.setItem('sdkDevelopmentEnv', searchDevelopmentEnv)
        }
        if (searchLatest !== '') {
            filter.latest = searchLatest === 'true' ? true : false
            localStorage.setItem('sdkLatest', searchLatest)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
        console.log("filter: ", filter)
        setLoader(true)
        props.getSdks(qs, filter);
    }

    const reset = () => {
        setLoader(true)
        setSearchName('')
        setSearchPlatformType('')
        setSearchDevelopmentEnv('')
        setSearchLatest('')
        const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
        props.getSdks(qs);
        localStorage.removeItem('sdkName')
        localStorage.removeItem('sdkPlatformType')
        localStorage.removeItem('sdkDevelopmentEnv')
        localStorage.removeItem('sdkLatest')
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        {/* filter */}
                        <Row className="pb-3">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Name</label>
                                                <Form.Control value={searchName} type="text" placeholder="Name" onChange={(e) => setSearchName(e.target.value)} />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Platform Type</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={searchPlatformType} onChange={(e) => setSearchPlatformType(e.target.value)}
                                                    >
                                                        <option value={''}>Select Platform Type</option>
                                                        {renderOption(platformTypeArray)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>


                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Development Environment</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={searchDevelopmentEnv} onChange={(e) => setSearchDevelopmentEnv(e.target.value)}
                                                    >
                                                        <option value={''}>Select Environment:</option>
                                                        {renderOption(developmentEnvArray)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Latest</label>
                                                <Form.Group>
                                                    <select value={searchLatest} onChange={(e) => setSearchLatest(e.target.value)}>
                                                        <option value="">Select Latest</option>
                                                        <option value='true'>Yes</option>
                                                        <option value='false'>No</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchName && !searchDevelopmentEnv && !searchPlatformType && !searchLatest} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchName && !searchDevelopmentEnv && !searchPlatformType && !searchLatest} onClick={reset}>Reset</Button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {/* table */}
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>SDKs</Card.Title>
                                            {
                                                permissions && permissions.addSdk &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right mb-0"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add SDK
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='td-name text-center'>Name</th>
                                                        <th className='td-name text-center'>platform Type</th>
                                                        <th className='td-name text-center'>Development Environment</th>
                                                        <th className='td-name text-center'>version</th>
                                                        <th className='td-name text-center'>latest</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        sdks && sdks.length ?
                                                            sdks.map((sdk, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination?.limit * pagination?.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name text-center">
                                                                            {
                                                                                sdk?.name
                                                                                    ?
                                                                                    sdk.name.length >= 29
                                                                                        ?
                                                                                        `${sdk.name.slice(0, 29)}...`
                                                                                        :
                                                                                        sdk?.name
                                                                                    :
                                                                                    "N/A"
                                                                            }
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {sdk?.envsdk?.platformType ? platformTypeArray[`${sdk?.envsdk?.platformType}`] : 'N/A'}
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {sdk?.envsdk?.developmentEnv ? developmentEnvArray[`${sdk?.envsdk?.developmentEnv}`] : 'N/A'}
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {sdk?.version ? sdk?.version : 'N/A'}
                                                                        </td>
                                                                        <td className="text-center td-actions">
                                                                            <span className={` status ${sdk?.latest ? `bg-success` : `bg-danger`
                                                                                }`}>
                                                                                <span className='lable lable-success'> {sdk?.latest ? 'Yes' : 'No'}</span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.addSdk &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                onClick={() => setModal(2, sdk?._id)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.editSdk &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => setModal(3, sdk._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteSdk &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-danger btn-action"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => deleteSdk(sdk._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
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
                                                                <td colSpan="12" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Sdk Found</div>
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
                            modalType === 2 && sdk &&
                            <Modal className="modal-primary" onHide={() => setSdkModal(!sdkModal)} show={sdkModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {/* {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''}  */}
                                                View Sdk
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill  d-flex align-items-center">
                                                <label className="label-font mr-2">Name: </label><span className="field-value text-white">{sdk?.name ? sdk?.name : 'N/A'}</span>
                                            </Form.Group>
                                        </div>

                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2" >Platform Type: </label><span className="field-value text-white">{sdk?.envsdk?.platformType ? platformTypeArray[`${sdk?.envsdk?.platformType}`] : 'N/A'}</span>
                                            </Form.Group>
                                        </div>

                                        <div className="">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Development Environment: </label><span className="field-value text-white">{sdk?.envsdk?.developmentEnv ? developmentEnvArray[`${sdk?.envsdk?.developmentEnv}`] : 'N/A'}</span>
                                            </Form.Group>
                                        </div>

                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center'>
                                                <label className="label-font mr-2">Version: </label><span className="field-value text-white">{sdk?.version ? sdk?.version : 'N/A'}</span>
                                            </Form.Group>
                                        </div>

                                        <div className="d-flex name-email">
                                            <Form.Group className=' d-flex align-items-center' >
                                                <label className="label-font mr-2">latest: </label><span className="field-value text-white">{sdk?.latest ? 'Yes' : 'No'}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setSdkModal(!sdkModal)}
                                    >Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }

                        {
                            (modalType === 1 || modalType === 3) && sdk &&
                            <Modal className="modal-primary" onHide={() => setSdkModal(!sdkModal)} show={sdkModal}>
                                {/* {
                                formValid ?
                                    <div className="text-danger">Please fill the required fields</div> : null
                            } */}
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''}
                                                SDK Information
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label>Name <span className="text-danger">*</span></label>
                                            <Form.Control
                                                placeholder="Enter SDK Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="name"
                                                onChange={(e) => { setSdkMsgs({ ...sdkMsgs, nameMsg: '' }); setSdkName(e.target.value) }}
                                                value={name}
                                                maxLength={30}
                                                required
                                            />
                                            <span className={sdkMsgs.nameMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs.nameMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>SDK Link <span className="text-danger">* must include https:// or http://</span></label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="sdkLink"
                                                onChange={(e) => setSdkLink(e.target.value)}
                                                value={link}
                                                required
                                            />
                                            <span className={sdkMsgs?.sdklinkMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs?.sdklinkMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>SDK Version <span className="text-danger">*</span></label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="sdkVersion"
                                                onChange={
                                                    (e) => {
                                                        // if(/(\d+)\.(\d+)\.(\d+)/.test(e.target.value)){
                                                        setSdkVersion(e.target.value)
                                                        // } 
                                                    }
                                                }
                                                value={sdkVersion}
                                                required
                                            />
                                            <span className={sdkMsgs?.sdkVersionMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs?.sdkVersionMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>SDK Instruction Link<span className="text-danger">*</span></label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="instruction"
                                                onChange={(e) => setSdkInstruction(e.target.value)}
                                                value={sdkInstruction}
                                            />
                                            <span className={sdkMsgs?.sdkInstructionMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs?.sdkInstructionMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Android Link</label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="androidLink"
                                                onChange={(e) => setSdkAndroidLink(e.target.value)}
                                                value={sdkAndroidLink}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <label>IOS Link</label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="iosLink"
                                                onChange={(e) => setSdkIosLink(e.target.value)}
                                                value={sdkIosLink}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Unity Link</label>
                                            <Form.Control
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="unityLink"
                                                onChange={(e) => setSdkUnityLink(e.target.value)}
                                                value={sdkUnityLink}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Release Notes</label>
                                            <TinyMCE
                                                // initialValue={detail.description ? detail.description : ''}
                                                value={sdkReleaseNotes ? sdkReleaseNotes : ''}
                                                onEditorChange={(content) => setSdkReleaseNotes(content)}
                                            />

                                            <span className={sdkMsgs.releaseNotesMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs.releaseNotesMsg}</label>
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Release Date </label>  {/*moment(sdkReleaseDate).format('l') */}
                                            <DatePicker
                                                disabled={props.modalType === 2}
                                                onChange={(e) => setSdkReleaseDate(e)}
                                                maxDate={new Date()}
                                                value={sdkReleaseDate ? sdkReleaseDate : null}
                                            />

                                        </Form.Group>
                                        <Form.Group>
                                            <label> Select distribution platforms <span className="text-danger">*</span></label>
                                            <div className='icon d-sm-flex'>
                                                <div className="mr-2">
                                                    <Button className='icon apple d-flex align-items-center' onClick={() => { setPlatformType(2); if (platformType != 2) setDevelopmentEnv('') }} style={platformType === 2 ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                        <i className="fab fa-apple mr-2" aria-hidden="true"></i>
                                                        <span>IOS</span>
                                                    </Button>
                                                </div>
                                                <div className="mr-2">
                                                    <Button className='icon android d-flex align-items-center' onClick={() => { setPlatformType(1); if (platformType != 1) setDevelopmentEnv('') }} style={platformType === 1 ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                        <i className="fab fa-android mr-2" aria-hidden="true"></i>
                                                        <span>Android</span>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button className='icon android d-flex align-items-center' onClick={() => { setPlatformType(3); if (platformType != 3) setDevelopmentEnv('') }} style={platformType === 3 ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                        <i className="fab fa-android mr-2" ></i>
                                                        <i className="fab fa-apple mr-2" aria-hidden="true"></i>
                                                        <span>Cross-Platform</span>
                                                    </Button>
                                                </div>

                                            </div>
                                            <span className={sdkMsgs?.platformTypeMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs?.platformTypeMsg}</label>
                                            </span>
                                        </Form.Group>
                                        <Form.Group>
                                            <label>What is your development environment?<span className="text-danger" >*</span></label>
                                            <div className="icons d-flex">
                                                {
                                                    platformType === 3 &&
                                                    <>
                                                        <div className='icon mr-2'>
                                                            <Button className='icon apple' onClick={() => { setDevelopmentEnv(1) }} style={(platformType === 3 && developmentEnv === 1) ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                                <i className="fab fa-unity" aria-hidden="true"></i>
                                                                <span>Unity</span>
                                                            </Button>
                                                        </div>
                                                    </>

                                                }
                                                {
                                                    platformType === 2 &&
                                                    <>
                                                        <div className='icon mr-2'>
                                                            <Button className='icon apple' onClick={() => { setDevelopmentEnv(5) }} style={(platformType === 2 && developmentEnv === 5) ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                                <i className="fab fa-unity" aria-hidden="true"></i>
                                                                <span>Unity</span>
                                                            </Button>
                                                        </div>
                                                        <div className='icon'>
                                                            <Button className='icon apple' onClick={() => { setDevelopmentEnv(3) }} style={(platformType === 2 && developmentEnv === 3) ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }}>
                                                                <i className="fab fa-unity" aria-hidden="true"></i>
                                                                <span>Xcode</span>
                                                            </Button>
                                                        </div>
                                                    </>
                                                }

                                                {
                                                    platformType === 1 &&
                                                    <>
                                                        <div className='icon mr-2'>
                                                            <Button className='icon apple' onClick={() => { setDevelopmentEnv(4) }} style={(platformType === 1 && developmentEnv === 4) ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }} >
                                                                <i className="fab fa-unity" aria-hidden="true"></i>
                                                                <span>Unity</span>
                                                            </Button>
                                                        </div>
                                                        <div className='icon'>
                                                            <Button className='icon apple' onClick={() => { setDevelopmentEnv(2) }} style={(platformType === 1 && developmentEnv === 2) ? { backgroundColor: "#fff" } : { backgroundColor: "#A05ED4", border: "#A05ED4" }} >
                                                                <i className="fab fa-unity" aria-hidden="true"></i>
                                                                <span>Android Studio</span>
                                                            </Button>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            <span className={sdkMsgs?.developmentEnvMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{sdkMsgs?.developmentEnvMsg}</label>
                                            </span>


                                        </Form.Group>

                                        <Form.Group>
                                            <label className='mr-2'>Latest<span className="text-danger"> *</span></label>
                                            <label className="right-label-radio mb-2 mr-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="latest" type="radio" checked={sdkLatest} value={sdkLatest} onChange={(e) => { setSdkLatest(true) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setSdkLatest(true);
                                                    }} ><i />Yes</span>
                                                </div>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="latest" type="radio" checked={!sdkLatest} value={!sdkLatest} onChange={(e) => { setSdkLatest(false) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setSdkLatest(false);
                                                    }} ><i />No</span>
                                                </div>
                                            </label>
                                        </Form.Group>

                                        <Form.Group>
                                            <label className='mr-2'>Status</label>
                                            <label className="right-label-radio mb-2 mr-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="status" type="radio" checked={sdkStatus === 1 ? true : false} value={sdkStatus === 1 ? true : false} onChange={(e) => { setSdkStatus(1) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setSdkStatus(1);
                                                    }} ><i />Beta</span>
                                                </div>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="status" type="radio" checked={sdkStatus === 2 ? true : false} value={sdkStatus === 2 ? true : false} onChange={(e) => { setSdkStatus(2) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setSdkStatus(2);
                                                    }} ><i />Stable</span>
                                                </div>
                                            </label>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setSdkModal(!sdkModal)}
                                    >Close</Button>
                                    {
                                        modalType === 3 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(sdk._id)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(sdk._id)} /* disabled={isLoader} */>Update</Button>
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
    sdks: state.sdks,
    getRoleRes: state.role.getRoleRes,
    error: state.error
})
export default connect(mapStateToProps, { beforeSdk, getSdks, createSdk, editSdk, deleteSdk, getRole })(Sdk);