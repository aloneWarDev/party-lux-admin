import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { beforePlayerReport, updatePlayerReport , playerReportlist } from "./ReportedPlayer.action";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, Modal , Dropdown , DropdownButton } from "react-bootstrap";
import { ENV } from "config/config";
var CryptoJS = require("crypto-js");


const ReportPlayer = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    const [playerReport, setPlayerReport] = useState(null)
    const [playerReportModal, setPlayerReportModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [permissions, setPermissions] = useState({})

    const [searchReporterUsername, setSearchReporterUsername,] = useState('')
    const [searchReportedUsername, setSearchReportedUsername] = useState('')
    const [searchGameName, setSearchGameName] = useState('')
    const [searchStatus, setSearchStatus] = useState('')

    useEffect(() => {
        window.scroll(0, 0)
        reset()
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        const filter = {}
        // if (searchReporterUsername !== undefined && searchReporterUsername !== null && searchReporterUsername !== '')
        //     filter.reporter = searchReporterUsername
        // if (searchReportedUsername !== undefined && searchReportedUsername !== null && searchReportedUsername !== '')
        //     filter.reported = searchReportedUsername
        // if (searchGameName !== undefined && searchGameName !== null && searchGameName !== '')
        //     filter.gameName = searchGameName
        // if(searchStatus !== undefined && searchStatus!==null && searchStatus !== '' )
        //     filter.status = searchStatus
        props.beforePlayerReport()
        props.playerReportlist(qs, filter)
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
        if (props.reports.getplayerReportsAuth) {
            let { playerReports } = props.reports

            setData(playerReports.reportedPlayer)
            setPagination(playerReports.pagination)
            props.beforePlayerReport()

            setLoader(false)

        }
    }, [props.reports.getplayerReportsAuth])

    useEffect(() => {
        if(props.reports.updateAuth){
            setLoader(true)
            const playerReportData = data.find((elem) => String(elem._id) === String(playerReport._id))
            playerReportData.status = playerReport.status
            if (playerReportData)
                setPlayerReport({ ...playerReportData })
            setLoader(false)
            props.beforePlayerReport()
        }
    },[props.reports.updateAuth])

    useEffect(() => {
        if (props.reports.delplayerReportAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.reports.playerReport._id)
                    return item
            })
            setData(filtered)
            const filter = {}
            if (searchReporterUsername && searchReporterUsername !== '') {
                filter.reporter = searchReporterUsername
                localStorage.setItem('reporterUsername', searchReporterUsername)
            }
            if (searchReportedUsername && searchReportedUsername !== '') {
                filter.reported = searchReportedUsername
                localStorage.setItem('reportedUsername', searchReportedUsername)
            }
            if (searchGameName && searchGameName !== '') {
                filter.gameName = searchGameName
                localStorage.setItem('gameName', searchGameName)
            }
            if(searchStatus){
                filter.status = searchStatus.trim()
                localStorage.setItem('playerReportStatus', searchStatus)
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.playerReportlist(qs, filter)
            setLoader(false)
            props.beforePlayerReport()
        }
    }, [props.reports.delplayerReportAuth])

    const setModal = (type = 0, reportId = null) => { //type ->  1 = add  , 2 = view , 3 = edit , 4 = delete
        setPlayerReportModal(!playerReportModal)
        setModalType(type)
        setLoader(false)
        if ((type == 2 || type == 3) && reportId) {
            getPlayerReport(reportId)
        }
    }

    const getPlayerReport = async (reportId) => {
        setLoader(true)
        const playerReportData = await data.find((elem) => String(elem._id) === String(reportId))
        if (playerReportData)
            setPlayerReport({ ...playerReportData })
        setLoader(false)
    }

    const deleteReportPlayer = (playerReportId) => {
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
                props.delete(playerReportId)
            }
        })
    }


    const onPageChange = async (page) => {
        const filter = {}
        if (searchReporterUsername && searchReporterUsername !== '') {
            filter.reporter = searchReporterUsername
            localStorage.setItem('reporterUsername', searchReporterUsername)
        }
        if (searchReportedUsername && searchReportedUsername !== '') {
            filter.reported = searchReportedUsername
            localStorage.setItem('reportedUsername', searchReportedUsername)
        }
        if (searchGameName && searchGameName !== '') {
            filter.gameName = searchGameName
            localStorage.setItem('gameName', searchGameName)
        }
        if(searchStatus){
            filter.status = searchStatus.trim()
            localStorage.setItem('playerReportStatus', searchStatus)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.playerReportlist(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchReporterUsername && searchReporterUsername !== '') {
            filter.reporter = searchReporterUsername
            localStorage.setItem('reporterUsername', searchReporterUsername)
        }
        if (searchReportedUsername && searchReportedUsername !== '') {
            filter.reported = searchReportedUsername
            localStorage.setItem('reportedUsername', searchReportedUsername)
        }
        if (searchGameName && searchGameName !== '') {
            filter.gameName = searchGameName
            localStorage.setItem('gameName', searchGameName)
        }
        if(searchStatus){
            filter.status = searchStatus.trim()
            localStorage.setItem('playerReportStatus', searchStatus)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        // 

        props.playerReportlist(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchReporterUsername('')
        setSearchReportedUsername('')
        setSearchGameName('')
        setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.beforePlayerReport()
        props.playerReportlist(qs)
        setLoader(true)
        localStorage.removeItem('reporterUsername')
        localStorage.removeItem('reportedUsername')
        localStorage.removeItem('gameName')
        localStorage.removeItem('playerReportStatus')


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
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}> Reporter Username</label>
                                                    <Form.Control value={searchReporterUsername} type="text" placeholder="Reporter Username" onChange={(e) => setSearchReporterUsername(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Reported Username</label>
                                                    <Form.Control type="text" value={searchReportedUsername} placeholder="Reported Username" onChange={(e) => setSearchReportedUsername(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Game Name</label>
                                                    <Form.Control value={searchGameName} type="text" placeholder="Game Name" onChange={(e) => setSearchGameName(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{color : 'white'}}>Status</label>
                                                <select value={searchStatus} onChange={(e) =>  setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={0}>Block Player</option>
                                                    <option value={1}>Pending</option>
                                                    <option value={2}>Match Reset</option>
                                                </select>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchReporterUsername && !searchReportedUsername && !searchGameName && !searchStatus} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchReporterUsername && !searchReportedUsername && !searchGameName && !searchStatus} onClick={reset}>Reset</Button>
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
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Reported Players</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addReportPlayer &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => {}}>
                                                    Add Report Player
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
                                                        <th className='plyer-table text-center '>Reporter Name</th>
                                                        <th className="plyer-table text-center ">Reported Name</th>
                                                        <th className='plyer-table text-center '>Tournament Name</th>
                                                        <th className='plyer-table text-center' >Game Name</th>
                                                        <th className='plyer-table text-center '>category</th>
                                                        <th className='plyer-table text-center '>Description</th>
                                                        <th className="plyer-table text-center ">Status</th>
                                                        {permissions && permissions.editReportedUser ? <th className="plyer-table text-center  td-actions text-center">Actions</th> : ''}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-center ">
                                                                            {item?.reporterUsername}
                                                                        </td>

                                                                        <td className="text-center ">
                                                                            {item?.reportedUsername}
                                                                        </td>

                                                                        <td className="text-center ">
                                                                            {item?.gameTournamentName}
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            {item?.gameName}
                                                                        </td>
                                                                        <td className="text-center " >
                                                                            {item?.category}
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            {item?.description}
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            <span className={`text-white badge p-1 status ${item.status === 1 ? `bg-danger` : item.status === 0 ? `badge-warning bg-success` : item.status === 2 ? `badge-success` : ``}`}>
                                                                                {item.status === 0 ? 'Block Player' : item.status === 1 ? 'Pending' : item.status === 2 ? 'Match Reset' : 'N/A'}                                                                        
                                                                            </span>
                                                                        </td>
                                                                        {permissions && permissions.editReportedUser ? 
                                                                            <td className="td-actions text-center">
                                                                                <ul className="list-unstyled mb-0">
                                                                                    {
                                                                                        permissions && permissions.editReportedUser &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <div className='trigger' >
                                                                                                <Button
                                                                                                    className="btn-action btn-warning"
                                                                                                    type="button"
                                                                                                    variant="success"
                                                                                                    onClick={() => { setModal(3, item._id) }}
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </Button>
                                                                                                <div className='tooltip'>Edit</div>
                                                                                            </div>
                                                                                        </li>
                                                                                    }
                                                                                    {
                                                                                        permissions && permissions.deleteReportPlayer &&
                                                                                        <li className="d-inline-block align-top">
                                                                                            <div className='trigger'>
                                                                                                <Button
                                                                                                    className="btn-action btn-danger"
                                                                                                    type="button"
                                                                                                    variant="danger"
                                                                                                    onClick={() => deleteReportPlayer(item._id)}
                                                                                                >
                                                                                                    <i className="fas fa-trash"></i>
                                                                                                </Button>
                                                                                                <div className='tooltip'>Delete</div>
                                                                                            </div>
                                                                                        </li>
                                                                                    }
                                                                                </ul>
                                                                            </td>
                                                                            : 
                                                                            ""
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="9" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Player Report Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
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
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>
                        {
                            modalType > 0 && playerReport &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setPlayerReportModal(!playerReportModal)} show={playerReportModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 3 ? 'Edit' : ''} Player Report
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Reporter Name:</strong>
                                                    <span>{playerReport?.reporterUsername ? playerReport?.reporterUsername : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Name: </label><span className="ml-2">{contact.name}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Reported Name:</strong>
                                                    <span>{playerReport?.reportedUsername ? playerReport?.reportedUsername  :'N/A'}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Game Name:</strong>
                                                    <span>{playerReport?.gameName ? playerReport?.gameName  :'N/A'}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Game Tournament Name:</strong>
                                                    <span>{playerReport?.gameTournamentName ? playerReport?.gameTournamentName  :'N/A'}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Category:</strong>
                                                    <span>{playerReport?.category ? playerReport?.category  :'N/A'}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Description:</strong>
                                                    <span>{playerReport?.description ? playerReport?.description  :'N/A'}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-sm-flex align-items-center">
                                                    <strong className="mr-2">Status:</strong>
                                                    <span className={`ml-2 text-white badge ${playerReport?.status === 1 && modalType === 2 ? `badge-danger p-1` : playerReport?.status === 0 && modalType === 2 ? `badge-warning p-1` : playerReport?.status === 2 && modalType === 2 ? `badge-success p-1` :``}`}>
                                                    {modalType === 2 ?
                                                        (playerReport?.status === 0 ? 'Block Player' : playerReport?.status === 1 ? 'Pending' : playerReport?.status === 2 ? 'Match Reset' : 'N/A')
                                                        : <div className="float-right">
                                                            <DropdownButton
                                                                variant="outline-secondary"
                                                                title={playerReport?.status === 0 ? 'Block Player' : playerReport?.status === 1 ? 'Pending' : playerReport?.status === 2 ? 'Match Reset' : 'Select Status'}
                                                                id="status-dropDown"
                                                                className="status-dropDown w-100 text-right"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    setPlayerReport({ ...playerReport , status: 0 })
                                                                }}>Block Player</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setPlayerReport({ ...playerReport , status: 1 })
                                                                    }
                                                                }>Pending</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setPlayerReport({ ...playerReport, status: 2 })
                                                                    }
                                                                }>Match Reset</Dropdown.Item>
                                                            </DropdownButton>
                                                        </div>
                                                    }</span>
                                                </div>
                                            </Form.Group>

                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button className="btn btn-warning" onClick={() => setPlayerReportModal(!playerReportModal)}>Close</Button>
                                    {modalType === 3 ?
                                        <Button className="btn btn-info"
                                            onClick={
                                                () => {
                                                    setPlayerReportModal(!playerReportModal);
                                                    let formData = new FormData()
                                                    for (const key in playerReport)
                                                        formData.append(key, playerReport[key])
                                                    props.updatePlayerReport(playerReport._id , formData);
                                                    //setTitle("Select Status");
                                                }
                                            }
                                        >
                                        Update</Button>
                                        :
                                        ''
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
    reports: state.reports,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps, { beforePlayerReport, playerReportlist,  updatePlayerReport , getRole })(ReportPlayer);