import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import ShowMoreText from "react-show-more-text";
import { beforeSupport, getSupports, updateSupport, getSupportGames } from './Support.actions';
// import { beforePlayer, getPlayers, updatePlayer , getPlayerSupportGames } from './Player.action';

import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
var CryptoJS = require("crypto-js");


const PlayerSupport = (props) => {
    const [supports, setSupports] = useState(null)
    const [Page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [playerModel, setPlayerModel] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [support, setSupport] = useState(null)
    const [loader, setLoader] = useState(true)
    const [playerGames, setPlayerGames] = useState([])
    const [title, setTitle] = useState('Select Status')
    const [permissions, setPermissions] = useState({})
    const [searchContactId, setSearchContactId] = useState('')
    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [searchGame, setSearchGame] = useState('')
    // const [envirementArray, setEnvirementArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [searchStatus, setSearchStatus] = useState('')



    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={value[v]?._id}>{value[v]?.name}</option>);
        }
        return rows;
    }

    useEffect(() => {
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = { type: '1' }
        reset()
        // if (searchContactId !== undefined && searchContactId !== null && searchContactId !== '')
        //     filter.contactId = searchContactId
        // if (searchName !== undefined && searchName !== null && searchName !== '')
        //     filter.name = searchName
        // if (searchEmail !== undefined && searchEmail !== null && searchEmail !== '')
        //     filter.email = searchEmail
        // if (searchGame !== undefined && searchGame !== null && searchGame !== '')
        //     filter.game = searchGame
        // if (searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
        //     filter.status = searchStatus

        props.getSupports('', filter)///get API
        props.getSupportGames()
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
        if (props.supports.getGamesAuth) {
            setPlayerGames(props.supports.games)
        }
    }, [props.supports.getGamesAuth])

    useEffect(() => {
        if (props.supports.supportsAuth) {
            // 
            const { contact, pagination } = props.supports.supports
            setSupports(contact)
            setPagination(pagination)
            props.beforeSupport()
        }
    }, [props.supports.supportsAuth])

    useEffect(() => {
        if (supports) {
            setLoader(false)
        }
    }, [supports])

    useEffect(async () => {
        if (props.supports.updateAuth) {
            setLoader(true)
            const supportData = await supports.find((elem) => String(elem._id) === String(support._id))
            supportData.remarks = support.remarks
            supportData.status = support.status
            if (supportData) {
                setSupport({ ...supportData })
            }
            setLoader(false)
            props.beforeSupport()
        }
    }, [props.supports.updateAuth])

    const setModal = (type = 0, playerId = null) => {
        setPlayerModel(!playerModel)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && playerId)
            getPlayer(playerId)
    }


    const getPlayer = async (playerId) => {
        setLoader(true)
        const supportData = await supports.find((elem) => String(elem._id) === String(playerId))
        if (supportData)
            setSupport({ ...supportData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = { type: '1' }
        if (searchContactId) {
            filter.contactId = searchContactId
            localStorage.setItem('playerContactId', searchContactId)
        }
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('playerName', searchName)
        }
        if (searchEmail) {
            filter.email = searchEmail
            localStorage.setItem('playerEmail', searchName)
        }
        if (searchGame) {
            filter.game = searchGame
            localStorage.setItem('playerGame', searchGame)
        }
        if (searchStatus) {
            filter.status = searchStatus
            localStorage.setItem('PlayerStatus', searchStatus)
        }

        setLoader(true)
        setPage(page)
        const qs = ENV.objectToQueryString({ page, limit: 10 })
        props.getSupports(qs, filter)
    }

    const applyFilters = () => {
        const filter = { type: '1' }
        if (searchContactId) {
            filter.contactId = searchContactId.trim()
            localStorage.setItem('playerContactId', searchContactId)
        }
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('playerName', searchName)
        }
        if (searchEmail) {
            filter.email = searchEmail.trim()
            localStorage.setItem('playerEmail', searchEmail)

        }
        if (searchGame) {
            filter.game = searchGame.trim()
            localStorage.setItem('playerGame', searchGame)
        }
        if (searchStatus) {
            filter.status = searchStatus
            localStorage.setItem('playerStatus', searchStatus)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getSupports(qs, filter, 'playerContact', true) //(true is for search)
        setLoader(true)
    }

    const reset = () => {
        setSearchContactId('')
        setSearchEmail('')
        setSearchGame('')
        setSearchStatus('')
        setSearchName('')


        localStorage.removeItem('playerContactId')
        localStorage.removeItem('playerName')
        localStorage.removeItem('playerEmail')
        localStorage.removeItem('playerGame')
        localStorage.removeItem('playerStatus')

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getSupports(qs, { type: '1' })
        setLoader(true)
    }

    const formattedAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`
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
                                                    <label style={{ color: 'white' }}>Contact Id</label>
                                                    <Form.Control value={searchContactId} type="text" placeholder="ContactId" onChange={(e) => setSearchContactId(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Name</label>
                                                <Form.Control value={searchName} type="text" placeholder="Name" onChange={(e) => setSearchName(e.target.value)} />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Email</label>
                                                <Form.Control value={searchEmail} type="text" placeholder="name@mail.com" onChange={(e) => setSearchEmail(e.target.value)} />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Game</label>
                                                    <Form.Control
                                                        as="select"
                                                        className="form-select pr-3 mr-3"
                                                        aria-label="Default select example"
                                                        value={searchGame}
                                                        type="text"
                                                        onChange={(e) => setSearchGame(e.target.value)}
                                                    >
                                                        <option value={''}>Select Game</option>
                                                        {renderOption(playerGames)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Status</label>
                                                <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={0}>In Progress</option>
                                                    <option value={1}>Pending</option>
                                                    <option value={2}>Closed</option>

                                                </select>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='m-0' variant="info" disabled={!searchContactId && !searchName && !searchEmail && !searchGame && !searchStatus} onClick={applyFilters}>Search</Button>
                                                        <Button className='m-0' variant="warning" hidden={!searchContactId && !searchName && !searchEmail && !searchGame && !searchStatus} onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span style={{ color: 'white' }}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Players Support</Card.Title>
                                            {/* <p className="card-user">List Of Contacts</p> */}
                                        </div>
                                    </Card.Header>

                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy players-support">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className="text-center">Contact Id</th>
                                                        <th className="text-center">Name</th>
                                                        <th className="text-center">Email</th>
                                                        <th className="text-center">Wallet Address</th>
                                                        <th className="text-center">Game</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        supports && supports.length ? supports.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td className="text-center">
                                                                        {item.contactId ? item.contactId : 'N/A'}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {
                                                                            item?.user?.username ?
                                                                                <ShowMoreText
                                                                                    lines={1}
                                                                                    more="Show more"
                                                                                    less="Show less"
                                                                                    className="content-css"
                                                                                    anchorClass="show-more-less-clickable text-theme"
                                                                                    expanded={false}
                                                                                    width={280}
                                                                                    truncatedEndingComponent={"... "}
                                                                                >
                                                                                    {item?.user?.username}
                                                                                </ShowMoreText>
                                                                                :
                                                                                'N/A'
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {item?.user?.email ? item?.user?.email : 'N/A'}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {item?.user?.walletAddress ? item?.user?.walletAddress : 'N/A'}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {item.game ? item.game?.name : 'N/A'}
                                                                    </td>
                                                                    {/* <td>
                                                                        {item.deviceModel ? item.deviceModel : 'N/A' }
                                                                    </td>
                                                                    <td>
                                                                        {item.deviceOs ? item.deviceOs : 'N/A'}
                                                                    </td>
                                                                    <td>
                                                                        {item.description ? item.description : 'N/A'}
                                                                    </td> */}
                                                                    <td className="text-center">
                                                                        <span className={`text-white  status p-1 ${item.status === 1 ? `bg-danger` : item.status === 0 ? `bg-success` : item.status === 2 ? `badge-success` : ``}`}>
                                                                            {item.status === 0 ? 'In Progress' : item.status === 1 ? 'Pending' : item.status === 2 ? 'Closed' : 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions">
                                                                        <ul className="list-unstyled mb-0">
                                                                            <li className="d-inline-block align-top">
                                                                                <div className='trigger'>
                                                                                    <Button
                                                                                        className="btn-action btn-warning"
                                                                                        type="button"
                                                                                        // variant="info"
                                                                                        onClick={() => setModal(2, item._id)}
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </Button>
                                                                                    <div className='tooltip'>View</div>
                                                                                </div>
                                                                            </li>

                                                                            {
                                                                                permissions && permissions.editPlayerContact &&
                                                                                <li className="d-inline-block align-top">
                                                                                    <div className='trigger'>
                                                                                        <Button
                                                                                            className="btn-action btn-warning"
                                                                                            type="button"
                                                                                            variant="success"
                                                                                            onClick={
                                                                                                () => {
                                                                                                    setModal(3, item._id);
                                                                                                    setTitle('Select Status')
                                                                                                }
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                        <div className='tooltip'>Edit</div>
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
                                                                <td colSpan="9" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Player Support Found</div>
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
                            modalType > 0 && support &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setPlayerModel(!playerModel)} show={playerModel}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 3 ? 'Edit' : ''} Player Support
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Contact Id:</strong>
                                                    <span>{support.contactId ? support.contactId : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Name: </label><span className="ml-2">{contact.name}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Name:</strong>
                                                    <span>{support?.user?.username ? support?.user?.username : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Email: </label><span className="ml-2">{contact.email}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Email:</strong>
                                                    <span>{support?.user?.email ? support?.user?.email : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Email: </label><span className="ml-2">{contact.email}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Game:</strong>
                                                    <span>{support.game ? support.game?.name : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Device Model:</strong>
                                                    <span>{support?.deviceModel ? support?.deviceModel : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Device OS:</strong>
                                                    <span>{support?.deviceOs ? support?.deviceOs : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">ScreenShot:</strong>
                                                    {support?.screenShot ? <div onClick={() => window.open(support?.screenShot, "_blank")}>{support?.screenShot ? support?.screenShot : 'N/A'}</div> : <span>N/A</span>}
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Wallet Address:</strong>
                                                    <span>{support?.user?.walletAddress ? support?.user?.walletAddress : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>

                                            {modalType === 2 ?
                                                <Form.Group>
                                                    <div className="nft-detail-holder d-flex">
                                                        <strong className="mr-2">Remarks:</strong>
                                                        <span>{support.remarks ? support.remarks : 'N/A'}</span>
                                                    </div>
                                                </Form.Group>
                                                :
                                                <Form.Group>
                                                    <label>Remarks</label>
                                                    <FormControl as="textarea"
                                                        value={support.remarks ? support.remarks : ''}
                                                        placeholder="Remarks"
                                                        type='text'
                                                        onChange={(e) => {
                                                            setSupport({ ...support, remarks: e.target.value })
                                                        }}
                                                    ></FormControl>
                                                </Form.Group>
                                            }

                                            {/* <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Type:</strong>
                                                    <span>{support?.type}</span>
                                                </div>
                                            </Form.Group> */}
                                            <Form.Group>
                                                <div className="nft-detail-holder d-sm-flex justify-content-between align-items-center ">
                                                    <strong className="mr-2 d-flex">Status:</strong>
                                                    <span className={`ml-sm-2 ml-0 badge d-flex ${support.status === 1 && modalType === 2 ? `badge-danger p-1` : support.status === 0 && modalType === 2 ? `badge-warning p-1` : support.status === 2 && modalType === 2 ? `badge-success p-1` : ``}`}>
                                                        {modalType === 2 ?
                                                            (support.status === 0 ? 'In Progress' : support.status === 1 ? 'Pending' : support.status === 2 ? 'Closed' : 'N/A')
                                                            : <InputGroup className="float-right">
                                                                <DropdownButton
                                                                    variant="outline-secondary"
                                                                    title={support?.status === 0 ? 'In Progress' : support?.status === 1 ? 'Pending' : support?.status === 2 ? 'Closed' : 'Select Status'}
                                                                    id="status-dropDown"
                                                                    className="status-dropDown"
                                                                >
                                                                    <Dropdown.Item onClick={
                                                                        () => {
                                                                            setSupport({ ...support, status: 0 })
                                                                        }
                                                                    }>In Progress</Dropdown.Item>
                                                                    <Dropdown.Item onClick={
                                                                        () => {
                                                                            setSupport({ ...support, status: 1 })
                                                                        }
                                                                    }>Pending</Dropdown.Item>
                                                                    <Dropdown.Item onClick={
                                                                        () => {
                                                                            setSupport({ ...support, status: 2 })
                                                                        }
                                                                    }>Closed</Dropdown.Item>
                                                                </DropdownButton>
                                                            </InputGroup>
                                                        }</span>
                                                </div>
                                            </Form.Group>
                                            {/* <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Message:</strong>
                                                    <span>{support?.message}</span>
                                                </div>
                                            </Form.Group> */}
                                        </div>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => setPlayerModel(!playerModel)}>Close</Button>
                                    {modalType === 3 ?
                                        <Button className="btn btn-info"
                                            onClick={() => {
                                                setPlayerModel(!playerModel);
                                                let formData = new FormData()
                                                for (const key in support)
                                                    formData.append(key, support[key])
                                                props.updateSupport(support._id, formData);
                                                setTitle("Select Status");
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
    supports: state.supports,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeSupport, getSupports, updateSupport, getSupportGames, getRole })(PlayerSupport);