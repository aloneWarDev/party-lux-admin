import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeTournament, getRewards, beforeTournamentRewards, getTournament, deleteTournament, editTournament, createTournament, getGameTournaments, editGameTournament, deleteGameTournament } from './Tournament.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import validator from 'validator';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg'
import { useParams } from 'react-router';
import Select from 'react-select';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import DatePicker from 'react-date-picker';


var CryptoJS = require("crypto-js");

const Tournament = (props) => {
    const dispatch = useDispatch()
    const { gameId } = useParams()
    const pathname = window.location.pathname

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : 'black',
            backgroundColor: state.isSelected ? "red" : 'white'
        }),
        menu: (provided, state) => ({
            ...provided,
            color: "transparent",
        }),
        multiValue: (provided, state) => {
            return { ...provided, backgroundColor: state.isSelected ? "red" : "red" };
        }
    }
    const [permissions, setPermissions] = useState({})
    const [isGame, setIsGame] = useState(false)
    const [searchTitle, setSearchTitle] = useState('')
    const [tournaments, setTournaments] = useState(null)
    const [pagination, setPagination] = useState(null)
    // const [paginationProduction, setPaginationProduction] = useState(null)
    const [tournamentModal, setTournamentModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [tournament, setTournament] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    const [formValid, setFormValid] = useState(false)
    const [isPractice, setIsPractice] = useState(false)
    const [isRematchAllowed, setIsRematchAllowed] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [player, setPlayers] = useState('')
    const [playerMsg, setPlayerMsg] = useState('')
    const [fee, setFee] = useState('')
    const [maxNoOfPlayers, setMaxNoOfPlayers] = useState('')
    const [feeMsg, setFeeMsg] = useState('')
    const [description, setDescription] = useState('')
    const [descriptionMsg, setDescriptionMsg] = useState('')
    const [tname, setName] = useState('')

    const [isImageChange, setIsImageChange] = useState(false)
    const [tournamentImage, setTournamentImage] = useState('')
    const [tournamentImageMsg, setTournamentImageMsg] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [nameMsg, setNameMsg] = useState('')
    const [gameParameter, setGameParameter] = useState([{ key: "", value: "" }])
    const [gameParameterMsg, setGameParameterMsg] = useState([{ key: "", value: "" }])
    const [dateRangeMsg, setDateRangeMsg] = useState("")

    const getRewards = async (type, callback = null) => {
        props.getRewards(null, { type: parseInt(type) }, null, callback)
    }

    const submit = (Id) => {
        let check = true

        if (validator.isEmpty(tournamentImage ? tournamentImage + '' : '')) {
            setTournamentImageMsg('Image is Required');
            check = false
        } else setTournamentImageMsg('')

        if (validator.isEmpty(tname.trim())) {
            setNameMsg('Name is Required.')
            check = false
        }
        if (validator.isEmpty(description.trim())) {
            setDescriptionMsg('Description is required')
            check = false
        }
        if (validator.isEmpty(String(fee))) {
            setFeeMsg('Fee is Required.')
            check = false
        } else if (fee < 0) {
            setFeeMsg('Fee must be positive value.')
            check = false
        }
        if (validator.isEmpty(String(player))) {
            setPlayerMsg('Number of Players is Required.')
            check = false
        }
        if (startDate == null || endDate == null) {
            setDateRangeMsg('Select the date range for the event.')
            check = false
        }

        if (check) {
            setFormValid(false)

            let payload = { name: tname, description: description }

            if (fee) {
                payload.fee = parseFloat(fee)
            }
            if (player) {
                payload.players = parseInt(player)
            }
            if (maxNoOfPlayers) {
                payload.maxNoOfPlayers = parseInt(maxNoOfPlayers)
            }
            payload.isRematchAllowed = isRematchAllowed
            if (tournamentImage) {
                payload.image = tournamentImage
            }
            if (!isImageChange) {
                delete payload.image
            }

            payload.startDate = moment(startDate).format('YYYY-MM-DD')
            payload.endDate = moment(endDate).format('YYYY-MM-DD')
            if (modalType === 3) { // add modal type
                if (gameId) {
                    setLoader(true)
                    dispatch(editGameTournament(Id, payload))
                } else {
                    dispatch(editTournament(Id, payload));
                }
            }

            if (modalType === 1) { // add modal type
                dispatch(createTournament(payload));
            }
            setTournamentModal(!tournamentModal)
        }
        else {
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
            if (files[0].type.split('/')[0] === 'image') {
                setIsImageChange(true)
                setPreviewImage(reader.result);
            }
            else {
                setTournamentImageMsg('Invalid File Format')
                setPreviewImage('');
            }
        };
        reader.readAsDataURL(files[0]);
    };
    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])


    useEffect(() => {
        window.scroll(0, 0)
        reset()
        const filter = {}
        if (searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.name = searchTitle
        if (pathname === `/admin/game-tournament/${gameId}`) {
            filter.gameId = gameId
            setIsGame(true)
            props.getGameTournaments('', filter)
        } else {
            props.getTournament('', filter)
        }
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)
    }, [])

    //getTournamentsAuth
    useEffect(() => {
        if (props.tournament.getTournamentsAuth) {
            const { tournaments, pagination } = props.tournament
            setTournaments(tournaments)
            setPagination(pagination)
            setLoader(false)
            props.beforeTournament()
        }
    }, [props.tournament.getTournamentsAuth])

    //gameTournaments
    useEffect(() => {
        if (props.tournament.getGameTournamentsAuth) {
            const { gameTournaments } = props.tournament
            setTournaments(gameTournaments.tournament)
            setPagination(gameTournaments.pagination)
            props.beforeTournament()
        }
    }, [props.tournament.getGameTournamentsAuth])

    //editGameTournamentAuth 
    useEffect(() => {
        if (props.tournament.editGameTournamentAuth) {
            setLoader(true)
            let filtered = tournaments ? tournaments.filter((item) => {
                if (item._id != props.tournament.gameTournament.data._id) {
                    return item
                }
            }) : null
            setTournaments([props.tournament.gameTournament.data, ...filtered])
            props.beforeTournament()
        }
    }, [props.tournament.editGameTournamentAuth])

    //deleteGameTournamentAuth
    useEffect(() => {
        if (props.tournament.deleteGameTournamentAuth) {
            props.getGameTournaments('', { gameId: gameId })
        }
    }, [props.tournament.deleteGameTournamentAuth])

    useEffect(() => {
        if (props.tournament.deleteTournamentAuth) {
            const filter = {}
            if (searchTitle && searchTitle !== '') {
                filter.name = searchTitle
                localStorage.setItem('tournamentTitle', searchTitle)
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            window.scroll(0, 0)
            props.getTournament(qs, filter)
        }
    }, [props.tournament.deleteTournamentAuth])

    useEffect(() => {
        if (tournaments) {
            setLoader(false)
        }
    }, [tournaments])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    //add or edit
    useEffect(() => {
        if (props.tournament.upsertTournamentAuth) {
            setLoader(true)
            let filtered = tournaments ? tournaments.filter((item) => {
                if (item._id != props.tournament.tournament.data._id) {
                    return item
                }
            }) : null
            const filter = {}
            if (searchTitle && searchTitle !== '') {
                filter.name = searchTitle
                localStorage.setItem('tournamentTitle', searchTitle)
            }
            setTournaments([props.tournament.tournament.data, ...filtered])
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getTournament(qs, filter)
            // setLoader(false)
            props.beforeTournament()
        }
    }, [props.tournament.upsertTournamentAuth])

    // set modal type
    const setModal = (type = 0, tournamentId = null) => {
        setNameMsg('')
        setFeeMsg('')
        setPlayerMsg('')
        setDescriptionMsg('')
        setPreviewImage('')

        setTournamentModal(!tournamentModal)
        setModalType(type)
        setLoader(false)
        // add tournament
        if (type === 1) {
            let tournament = {
                name: '', description: '', player: '', fee: '', image: ''
            }
            setName('')
            setFee('')
            setMaxNoOfPlayers('')
            setPlayers('')
            setDescription('')
            setPreviewImage('')
            setTournament(tournament)
            setStartDate(null)
            setEndDate(null)
            setGameParameter([{ key: '', value: '' }])

        }
        // edit or view tournament
        else if ((type === 2 || type === 3) && tournamentId)
            getTournament(tournamentId)
    }

    const getTournament = async (tournamentId) => {
        setLoader(true)
        let tournamentData;
        tournamentData = await tournaments.find((elem) => String(elem._id) === String(tournamentId));
        if (tournamentData) {
            setTournament({ ...tournamentData })
        }
        setTournamentImage(tournamentData.image ? tournamentData.image : '')
        setIsPractice(tournamentData.isPractice ? tournamentData.isPractice : false)
        setIsRematchAllowed(tournamentData.isRematchAllowed ? tournamentData.isRematchAllowed : false)
        setStartDate(tournamentData.startDate ? new Date(tournamentData.startDate) : false)
        setEndDate(tournamentData.endDate ? new Date(tournamentData.endDate) : false)
        setPlayers(tournamentData.players ? tournamentData.players : '')
        setFee(tournamentData.fee ? tournamentData.fee : '')
        setMaxNoOfPlayers(tournamentData.maxNoOfPlayers ? tournamentData.maxNoOfPlayers : '')
        setDescription(tournamentData.description ? tournamentData.description : '')
        setName(tournamentData.name ? tournamentData.name : '')
        setPreviewImage(tournamentData.image ? tournamentData.image : '')
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('tournamentTitle', searchTitle)
        }

        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getTournament(qs, filter, true)
    }

    const deleteTournament = (tournamentId, tournamentType) => {
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
                if (isGame) {
                    props.deleteGameTournament(tournamentId)
                } else {
                    props.deleteTournament(tournamentId)
                }

            }
        })
    }

    const applyFilters = async () => {
        setLoader(true)
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('tournamentTitle', searchTitle)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        await props.beforeTournament()
        if (gameId) {
            filter.gameId = gameId
            props.getGameTournaments('', filter)
        }
        else {
            props.getTournament(qs, filter, true, true)
        }


    }
    const reset = () => {
        setSearchTitle('')
        setLoader(true)
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        if (gameId) {
            props.getGameTournaments('', { gameId: gameId })
        }
        else {
            props.getTournament(qs)
        }

        localStorage.removeItem('tournamentTitle')
        localStorage.removeItem('tournamentEnvironmentType')
        localStorage.removeItem('showthemesFilter')
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
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className='align-items-baseline'>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Name</label>
                                                    <Form.Control value={searchTitle} type="text" placeholder="Name" onChange={(e) => setSearchTitle(e.target.value)} maxLength={50} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button className='m-0' variant="info" disabled={!searchTitle} onClick={applyFilters}>Search</Button>
                                                        <Button className='m-0' variant="warning" hidden={!searchTitle} onClick={reset}>Reset</Button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>{isGame ? "Game" : ''} Tournaments </Card.Title>

                                            {!isGame ?
                                                permissions && permissions.addTournament &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right mb-0"
                                                    onClick={() => setModal(1)}>
                                                    Add Tournament
                                                </Button>
                                                : null
                                            }

                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy  tournaments ">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='name text-center  '>Name</th>
                                                        <th className='free text-center '>$ Fees</th>
                                                        <th className='player text-center '>Players</th>
                                                        <th className="td-actions text-center ">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        tournaments && tournaments.length ?
                                                            tournaments.map((tournament, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                        <td className='text-center '>
                                                                            {
                                                                                tournament.name
                                                                                    ?
                                                                                    tournament.name.length >= 29 ?
                                                                                        `${tournament.name.slice(0, 29)}...`
                                                                                        :
                                                                                        tournament.name
                                                                                    :
                                                                                    "N/A"
                                                                            }
                                                                        </td>

                                                                        <td className='text-center '>
                                                                            $ {tournament.fee}
                                                                        </td>

                                                                        <td className='text-center '>
                                                                            {tournament.players ? tournament.players : "N/A"}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">
                                                                                {permissions && permissions.viewTournament &&
                                                                                    <li className="d-inline-block align-top" >
                                                                                        <div className='trigger'>
                                                                                            <a
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(2, tournament._id)}

                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </a>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {permissions && permissions.editTournament &&
                                                                                    <li className="d-inline-block align-top" >
                                                                                        <div className='trigger'>
                                                                                            <a
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(3, tournament._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </a>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                                {permissions && permissions.deleteTournament &&
                                                                                    <li className="d-inline-block align-top" >
                                                                                        <div className='trigger'>
                                                                                            <a
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => deleteTournament(tournament._id, tournament.environmentType === "1" ? "sandbox" : "production")}
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
                                                                <td colSpan="6" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Tournament Found</div>
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
                            modalType == 2 && tournament &&
                            <Modal className="modal-primary" onHide={() => setTournamentModal(!tournamentModal)} show={tournamentModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 2 ? 'View' : ''} Tournament
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill align-items-center">
                                                <label className="label-font mr-2 text-center">Tournament Image: </label>
                                                <div className='user-view-image'><img src={tournament?.image} className="w-100" /></div>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Tournament Name: </label><span className="field-value text-white">{tournament.name}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-top'>
                                                <label className="label-font mr-2">Description:</label><span className="field-value text-white"> {tournament.description ? tournament.description : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2" >Fee: </label><span className="field-value text-white">{tournament.fee ? tournament.fee : 'N/A'}$</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2" >Max No Of Players: </label><span className="field-value text-white">{tournament.maxNoOfPlayers ? tournament.maxNoOfPlayers : 'N/A'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">No of Players: </label>
                                                {tournament.players && <>
                                                    {tournament.players == 2 && <span className="field-value text-white">Brackets (2 Players)</span>}
                                                    {tournament.players == 4 && <span className="field-value text-white">Head to Head (4 Players)</span>}
                                                </>}
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Is Practice Tournament: </label><span className="field-value text-white">{tournament.isPractice ? 'Yes' : 'No'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Is Rematch Allowed: </label><span className="field-value text-white">{tournament.isRematchAllowed ? 'Yes' : 'No'}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Event Start Date: </label><span className="field-value text-white">{moment(tournament.startDate).format('DD-MM-YYYY')}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className='d-flex align-items-center'>
                                                <label className="label-font mr-2">Event End Date: </label><span className="field-value text-white">{moment(tournament.endDate).format('DD-MM-YYYY')}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => setTournamentModal(!tournamentModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }


                        {(modalType == 3 || modalType == 1) && tournament &&
                            <Modal className="modal-primary" onHide={() => setTournamentModal(!tournamentModal)} show={tournamentModal}>
                                {
                                    formValid ?
                                        <div className="text-danger ml-3">Please fill the required fields</div> : null
                                }
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add' : modalType === 3 ? 'Edit' : ''} Tournament
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>tournament Image<span className="text-danger"> *</span></label>
                                                <div className='mb-4 user-view-image'>
                                                    {(previewImage !== undefined || previewImage !== '') && <img src={previewImage ? previewImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />}
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <Form.Control
                                                        className='text-white'
                                                        onChange={async (e) => {
                                                            fileSelectHandler(e);
                                                            if (e.target.files[0].type.split('/')[0] === 'image') {
                                                                setTournamentImage(e.target.files[0])
                                                            }
                                                            else {
                                                                setTournamentImage('')
                                                            }

                                                        }}
                                                        // placeholder="Title"
                                                        type="file"
                                                    ></Form.Control>

                                                </div>
                                                <span className={tournamentImageMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{tournamentImageMsg}</label>
                                                </span>
                                            </Form.Group>
                                            <Form.Group>
                                                <label>Tournament Name <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    placeholder="Enter Name"
                                                    disabled={props.modalType === 2}
                                                    type="text"
                                                    name="name"
                                                    onChange={(e) => { setNameMsg(''); setName(e.target.value); }}
                                                    value={tname}
                                                    required
                                                />
                                                <span className={nameMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{nameMsg}</label>
                                                </span>
                                            </Form.Group>
                                        </div>
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Description <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    placeholder="Enter Description"
                                                    disabled={props.modalType === 2}
                                                    as="textarea"
                                                    rows={3}
                                                    name="name"
                                                    onChange={(e) => {
                                                        setDescriptionMsg('')
                                                        setDescription(e.target.value)
                                                    }}
                                                    value={description}
                                                    required
                                                />
                                                <span className={descriptionMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{descriptionMsg}</label>
                                                </span>
                                            </Form.Group>
                                        </div>
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Fee <span className="text-danger">*</span></label>
                                                <Form.Control
                                                    placeholder="Enter Fee"
                                                    disabled={props.modalType === 2}
                                                    type="number"
                                                    name="name"
                                                    min="0"
                                                    onChange={(e) => {
                                                        setFeeMsg('');
                                                        let value = e.target.value;
                                                        setFee(value < 0 ? 0 : value);
                                                    }}
                                                    value={fee}
                                                    required
                                                />
                                                <span className={feeMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{feeMsg}</label>
                                                </span>
                                            </Form.Group>
                                        </div>
                                        {/* {!isEvent ?  */}
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>No of Players: <span className="text-danger">*</span></label>
                                                <Form.Control as="select" className="form-select pr-3 mr-3"
                                                    value={player} onChange={(e) => setPlayers(e.target.value)}
                                                >
                                                    <option value={''}>Select Players:</option>
                                                    <option value={4}>Head To Head (4 Players)</option>
                                                    <option value={2}>Brackets (2 Players)</option>
                                                </Form.Control>
                                                <span className={playerMsg ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{playerMsg}</label>
                                                </span>
                                            </Form.Group>
                                        </div>
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Max No of Players: </label>
                                                <Form.Control
                                                    placeholder="Max No of Players"
                                                    disabled={props.modalType === 2}
                                                    type="number"
                                                    name="name"
                                                    min="0"
                                                    onChange={(e) => {
                                                        let value = e.target.value;
                                                        value = value < 0  ? 0 : value;
                                                        value = value % 2 != 0 ? parseFloat(value) + 1 : value;
                                                        setMaxNoOfPlayers(value < 0 ? 0 : value);
                                                    }}
                                                    value={maxNoOfPlayers}
                                                />
                                            </Form.Group>
                                        </div>
                                        {/* {isEvent ?  */}
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Start Date for Event: </label>
                                                <DatePicker onChange={(e) => {
                                                    setStartDate(e)
                                                }
                                                }
                                                    value={startDate ? startDate : null}
                                                />

                                            </Form.Group>
                                            <Form.Group>
                                                <label>End Date for Event:</label>
                                                <DatePicker onChange={(e) => {
                                                    setEndDate(e)
                                                }
                                                }
                                                    value={endDate ? endDate : null}
                                                    minDate={startDate ? startDate : new Date()}
                                                />

                                            </Form.Group>
                                            <span className={dateRangeMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{dateRangeMsg}</label>
                                            </span>
                                        </div>

                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Is Rematch Allow:</label>
                                                <Form.Check
                                                    type='radio'
                                                    label={`Yes`}
                                                    name={`isRematchAllowed`}
                                                    checked={isRematchAllowed ? 'checked' : ''}
                                                    onChange={(e) => setIsRematchAllowed(true)}
                                                />
                                                <Form.Check
                                                    type='radio'
                                                    label={`No`}
                                                    name={`isRematchAllowed`}
                                                    checked={!isRematchAllowed ? 'checked' : ''}
                                                    onChange={(e) => setIsRematchAllowed(false)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className=" name-email">
                                            <Form.Group>
                                                <label>Is Practice Tournament:</label>
                                                <Form.Check
                                                    type='radio'
                                                    label={`Yes`}
                                                    name={`isPractice`}
                                                    checked={isPractice ? 'checked' : ''}
                                                    onChange={(e) => setIsPractice(true)}
                                                />
                                                <Form.Check
                                                    type='radio'
                                                    label={`No`}
                                                    name={`isPractice`}
                                                    checked={!isPractice ? 'checked' : ''}
                                                    onChange={(e) => setIsPractice(false)}
                                                />
                                            </Form.Group>
                                        </div>



                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => setTournamentModal(!tournamentModal)}>Close</Button>
                                    {
                                        modalType === 3 &&
                                        <Button className="btn btn-info" onClick={() => submit(tournament._id)} /* disabled={isLoader} */>Update</Button>
                                    }
                                    {
                                        modalType === 1 &&
                                        <Button className="btn btn-info" onClick={() => submit(tournament._id)} /* disabled={isLoader} */>Save</Button>
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
    tournament: state.tournament,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, { beforeTournament, getRewards, beforeTournamentRewards, getTournament, deleteTournament, getGameTournaments, deleteGameTournament, getRole })(Tournament);