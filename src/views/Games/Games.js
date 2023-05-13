import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { getGames, beforeGame, deleteGame, getUser, editGame, getAllUser, createGame } from './Games.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import validator from 'validator';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import ShowMoreText from "react-show-more-text";
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, Select, FormGroup } from "react-bootstrap";
import defaultImage from '../../assets/img/placeholder.jpg'
// import defaultImages from '../../../src/assets/img/faces/face-0.jpg';
var CryptoJS = require("crypto-js");
const Games = (props) => {
    const dispatch = useDispatch()

    const [permissions, setPermissions] = useState({})
    const [games, setGames] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [gameModal, setGameModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [game, setGame] = useState(null)
    const [users, setUsers] = useState([])
    const [previewImage, setPreviewImage] = useState('')
    const [previewBackgroundImage, setPreviewBackgroundImage] = useState('')
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    const [searchName, setSearchName] = useState('')
    const [searchGameId, setSearchGameId] = useState('')
    const [searchPlatformType, setSearchPlatformType] = useState('')
    const [searchDevelopmentEnv, setSearchDevelopmentEnv] = useState('')
    const [searchLaunchRequest, setSearchLaunchRequest] = useState('')
    const [gameID, setGameID] = useState('')
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('')
    const [backgroundImage, setBackgroundImage] = useState('')
    const [description, setDescription] = useState('')
    const [platformType, setPlatformType] = useState('')
    const [developmentEnv, setDevelopmentEnv] = useState('')
    const [user, setUser] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [orientation, setOrientation] = useState('')
    const [winningScore, setWinningScore] = useState('')
    const [gameFormat, setGameFormat] = useState('')
    const [monitizationModel, setMonitizationModel] = useState('')

    const [userMsg, setuserMsg] = useState('')
    const [nameMsg, setNameMsg] = useState('')
    const [iconMsg, setIconMsg] = useState('')
    const [descriptionMsg, setDescriptionMsg] = useState('')
    const [platformTypeMsg, setPlatformTypeMsg] = useState('')
    const [developmentEnvMsg, setDevelopmentEnvMsg] = useState('')

    const [launchRequestArray, setLaunchRequest] = useState({ "1": 'Requested', "2": 'Launched'})
    const [platformTypeArray, setPlatformTypeArray] = useState({ "1": 'Android', "2": 'iOS', "3": 'Cross Platform' })
    const [developmentEnvArray, setDevelopmentEnvArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [orientationArray, setOrientationArray] = useState({ "1": "Portrait", "2": "Landscape" })
    const [winningScoreArray, setWinningScoreArray] = useState({ "1": "Highest Score", "2": "Lowest Score", })
    const [gameFormatArray, setGameFormatArray] = useState({ "1": "Play & Compare", "2": "Real Time" })
    const [monitizationModelArray, setMonitizationModelArray] = useState({ "1": "Real Prize", "2": "Virtual Currency" })
    const [isImageChange, setIsImageChange] = useState(false)
    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }


    const submit = (Id) => {
        let check = true

        if (validator.isEmpty(name.trim())) {
            setNameMsg('Name field is Required.')
            check = false
        } else setNameMsg('')

        if (validator.isEmpty(description.trim())) {
            setDescriptionMsg('Description is required')
            check = false
        } else setDescriptionMsg('')

        if (validator.isEmpty(platformType + "")) {
            setPlatformTypeMsg('This field is Required.')
            check = false
        } else setPlatformTypeMsg('')

        if (validator.isEmpty(developmentEnv + "")) {
            setDevelopmentEnvMsg('This field is Required.')
            check = false
        } else setDevelopmentEnvMsg('')

        if (validator.isEmpty(user + "")) {
            setuserMsg('This field is Required.')
            check = false
        } else setuserMsg('')

        if (validator.isEmpty(icon + "")) {
            setIconMsg('Image is empty.')
            check = false
        } else setIconMsg('')

        {/* orientation  winningScore  gameFormat  monitizationModel
    orientationArray  winningScoreArray   gameFormatArray  monitizationModelArray */}
        {/* // orientationMsg winningScoreMsg  gameFormatMsg monitizationModelMsg */ }

        if (check) {
            setFormValid(false)

            let payload = { name, description }

            if (platformType) {
                payload.platformType = parseInt(platformType)
            }
            if (developmentEnv) {
                payload.developmentEnv = parseInt(developmentEnv)
            }
            if (orientation) {
                payload.orientation = parseInt(orientation)
            }
            if (winningScore) {
                payload.winningScore = parseInt(winningScore)
            }
            if (gameFormat) {
                payload.gameFormat = parseInt(gameFormat)
            }
            if (monitizationModel) {
                payload.monitizationModel = parseInt(monitizationModel)
            }
            if (user) {
                payload.userId = user
            }
            if (icon) {
                payload.icon = icon
            }
            if (backgroundImage) {
                payload.backgroundImage = backgroundImage
            }

            if (modalType === 3) { // edit modal type
                if (!isImageChange) {
                    delete payload.icon
                }
                dispatch(editGame(Id, payload));
                setLoader(true)
            }

            if (modalType === 1) { // add modal type
                dispatch(createGame(payload));
                setLoader(true)
            }
            setGameModal(!gameModal)
            setIsImageChange(!isImageChange)
        }
        else {
            // $('#modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }

    }

    const fileSelectHandler = (e, type) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (type == 1) {
                setPreviewImage(reader.result);
                setIsImageChange(true)
            }
            if (type == 2) {
                setPreviewBackgroundImage(reader.result);
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
        reset()

        const filter = { page: 1, limit: 10 }

        if (searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName
        if (searchGameId !== undefined && searchGameId !== null && searchGameId !== '')
            filter.gameId = searchGameId
        if (searchPlatformType !== undefined && searchPlatformType !== null && searchPlatformType !== '')
            filter.platformType = searchPlatformType
        if (searchDevelopmentEnv !== undefined && searchDevelopmentEnv !== null && searchDevelopmentEnv !== '')
            filter.developmentEnv = searchDevelopmentEnv
        if (searchLaunchRequest) 
            filter.launchRequest = searchLaunchRequest
        window.scroll(0, 0)
        props.getAllUser()
        props.getGames('', filter)
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)
    }, [])


    useEffect(() => {
        if (props.game.getGamesAuth) {
            const { games, pagination } = props.game
            setGames(games)
            setPagination(pagination)
            setLoader(false)
            props.beforeGame()
        }
    }, [props.game.getGamesAuth])

    useEffect(() => {
        if (props.game.getUsersGameAuth) {
            const { users } = props.game
            setUsers(users)
        }
    }, [props.game.getUsersGameAuth])


    useEffect(() => {
        if (props.game.insertGameAuth) {
            const filter = { page: Page, limit: 10 }

            if (searchName !== undefined && searchName !== null && searchName !== '')
                filter.name = searchName
            if (searchGameId !== undefined && searchGameId !== null && searchGameId !== '')
                filter.gameId = searchGameId
            if (searchPlatformType !== undefined && searchPlatformType !== null && searchPlatformType !== '')
                filter.platformType = searchPlatformType
            if (searchDevelopmentEnv !== undefined && searchDevelopmentEnv !== null && searchDevelopmentEnv !== '')
                filter.developmentEnv = searchDevelopmentEnv

            setLoader(true)
            let filtered = games.filter((item) => {
                if (item._id != props.game.game?._id) {
                    return item
                }
            })
            setGames([...filtered, props.game.game])
            props.getGames('', filter, false)
            setLoader(false)
            props.beforeGame()
        }
    }, [props.game.insertGameAuth])


    useEffect(() => {
        if (props.game.deleteGameAuth) {
            const qs = ENV.objectToQueryString({})
            window.scroll(0, 0)
            props.getGames(qs, { page: Page, limit: 10 }, false)
            props.beforeGame()
        }
    }, [props.game.deleteGameAuth])

    useEffect(() => {
        if (games) {
            setLoader(false)
            if (window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                setModal(3, urlParams.get('userId'))
            }
        }
    }, [games])

    //platformType


    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])



    const getGame = async (type, gameId) => {
        // alert('getGame')setUser
        setLoader(true)
        const gameData = await games.find((elem) => String(elem.gameId) === String(gameId))
        if (gameData) {
            setGame({ ...gameData })
            setGameID(gameData.gameId)
            setName(gameData.name)
            if (type === 3) {
                setIcon(gameData.icon)
            }
            setPreviewImage(gameData.icon)
            setPreviewBackgroundImage(gameData.backgroundImage)
            setDescription(gameData.description)
            setPlatformType(gameData.platformType ? gameData.platformType : '')
            setDevelopmentEnv(gameData.developmentEnv ? gameData.developmentEnv : '')
            setOrientation(gameData.orientation ? gameData.orientation : '');
            setWinningScore(gameData.winningScore ? gameData.winningScore : '');
            setGameFormat(gameData.gameFormat ? gameData.gameFormat : '');
            setMonitizationModel(gameData.monitizationModel ? gameData.monitizationModel : '');
            const user = await getUser(gameData.userId)
            setUser(user._id)
        }
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = { page: page, limit: 10 }
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('gameName', searchName)

        }
        if (searchGameId) {
            filter.gameId = searchGameId
            localStorage.setItem('GameId', searchGameId)

        }
        if (searchPlatformType) {
            filter.platformType = searchPlatformType
            localStorage.setItem('PlatformType', searchPlatformType)

        }
        if (searchDevelopmentEnv) {
            filter.developmentEnv = searchDevelopmentEnv
            localStorage.setItem('DevelopmentEnv', searchDevelopmentEnv)
        }

        setLoader(true)
        setPage(page)
        props.getAllUser()

        const qs = ENV.objectToQueryString({})
        props.getGames(qs, filter)
    }

    const deleteGame = (gameId) => {
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
                await props.deleteGame(gameId)
                setLoader(false)
            }
        })
    }

    const applyFilters = () => {
        const filter = { page: 1, limit: 10 }
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('gameName', searchName)
        }
        if (searchGameId) {
            filter.gameId = searchGameId
            localStorage.setItem('GameId', searchGameId)
        }
        if (searchPlatformType) {
            filter.platformType = searchPlatformType
            localStorage.setItem('PlatformType', searchPlatformType)
        }
        if (searchDevelopmentEnv) {
            filter.developmentEnv = searchDevelopmentEnv
            localStorage.setItem('DevelopmentEnv', searchDevelopmentEnv)
        }
        if (searchLaunchRequest) {
            filter.launchRequest = searchLaunchRequest
            localStorage.setItem('launchRequest', searchLaunchRequest)
        }
        props.getAllUser()
        setPage(1)
        const qs = ENV.objectToQueryString({})
        props.getGames(qs, filter, true, true)
        setLoader(true)
    }

    const reset = () => {
        props.getAllUser()
        setSearchName('')
        setSearchGameId('')
        setSearchPlatformType('')
        setSearchDevelopmentEnv('')
        setSearchLaunchRequest('')
        setPage(1)
        const qs = ENV.objectToQueryString({})
        props.getGames(qs, { page: 1, limit: 10 })
        setLoader(true)
        localStorage.removeItem('gameName')
        localStorage.removeItem('launchRequest')
        localStorage.removeItem('GameId')
        localStorage.removeItem('PlatformType')
        localStorage.removeItem('DevelopmentEnv')
        localStorage.removeItem('showUsersFilter')
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
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Game ID</label>
                                                    <Form.Control value={searchGameId} type="text" placeholder="Game ID" 
                                                    onChange={
                                                        (e) =>{
                                                            if( /^[0-9]*$/.test(e.target.value) ){
                                                                setSearchGameId(e.target.value)
                                                            }
                                                            
                                                        } 
                                                    } 
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Name</label>
                                                <Form.Control value={searchName} type="text" placeholder="Name" onChange={(e) => setSearchName(e.target.value)} />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Platform Type</label>
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
                                                    <label style={{ color: 'white' }}>Development Environment</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={searchDevelopmentEnv} onChange={(e) => setSearchDevelopmentEnv(e.target.value)}
                                                    >
                                                        <option value={''}>Select Environment:</option>
                                                        {renderOption(developmentEnvArray)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Launch Request</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={searchLaunchRequest} onChange={(e) => setSearchLaunchRequest(e.target.value)}
                                                    >
                                                        <option value={''}>Select launch Request</option>
                                                        {renderOption(launchRequestArray)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchDevelopmentEnv && !searchGameId && !searchName && !searchPlatformType && !searchLaunchRequest} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchDevelopmentEnv && !searchGameId && !searchName && !searchPlatformType && !searchLaunchRequest} onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>Games</Card.Title>
                                            {
                                                permissions && permissions.addGame &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right mb-0"
                                                    onClick={() => props.history.push(`/add-game`)  /*setModal(1)*/}
                                                >
                                                    Add Game
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
                                                        {/* <th className="td-image text-center">Image</th> */}
                                                        <th className="td-id text-center">GameId</th>
                                                        <th className="td-name text-center">Name</th>
                                                        {/* <th className="td-description text-center">Description</th> */}
                                                        <th className='td-name text-center'>platform Type</th>
                                                        <th className='td-development text-center'>Development Environment</th>
                                                        <th className='td-name text-center'>Game Format</th>
                                                        {/* <th className='td-name text-center'>Montization Model</th> */}
                                                        <th className='td-name text-center'>Orientation</th>
                                                        <th className='td-name text-center'>Winning Score</th>
                                                        <th className='td-name text-center'>Downloaded</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        games && games.length ?
                                                            games.map((game, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        {/* 
                                                                            <td className='table-img-center'>
                                                                                <div className="user-image ">
                                                                                    <img className="img-fluid" alt="User Image" src={game.icon ? game.icon : defaultImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />
                                                                                </div>
                                                                            </td> 
                                                                        */}
                                                                        <td className="td-number text-center">
                                                                            {game.gameId}
                                                                        </td>

                                                                        <td className="td-name text-center">
                                                                            {game.name ?
                                                                                
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
                                                                                    {game.name}
                                                                                </ShowMoreText>
                                                                                : ""
                                                                            }
                                                                        </td>
                                                                        {/* <td className="td-description text-center">
                                                                            {
                                                                                game.description ?
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
                                                                                        {game.description}
                                                                                    </ShowMoreText>
                                                                                    : ''
                                                                            } 
                                                                        </td>*/}
                                                                        <td className="td-name text-center">
                                                                            {game.platformType ? platformTypeArray[`${game.platformType}`] : 'N/A'}
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {game.developmentEnv ? developmentEnvArray[`${game.developmentEnv}`] : 'N/A'}
                                                                        </td>

                                                                        <td className="td-name text-center">
                                                                            {game.gameFormat ? gameFormatArray[`${game.gameFormat}`] : 'N/A'}
                                                                        </td>
                                                                        {/* <td className="td-name text-center">
                                                                            {game.monitizationModel ? monitizationModelArray[`${game.monitizationModel}`] : 'N/A'}
                                                                        </td> */}
                                                                        <td className="td-name text-center">
                                                                            {game.orientation ? orientationArray[`${game.orientation}`] : 'N/A'}
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {game.winningScore ? winningScoreArray[`${game.winningScore}`] : 'N/A'}
                                                                        </td>
                                                                        <td className="td-name text-center">
                                                                            {game.sdkDownload ? 'Yes' : 'No'}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.viewGame &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                // variant="info"
                                                                                                onClick={() => props.history.push(`/view-game/${game._id}`)}
                                                                                            // onClick={() => setModal(2, game.gameId)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                                {
                                                                                    permissions && permissions.editGame &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => props.history.push(`/edit-game/${game._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>}

                                                                                {permissions && permissions.deleteGame &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-danger btn-action"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => deleteGame(game._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Delete</div>
                                                                                        </div>
                                                                                    </li>}


                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="13" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Game Found</div>
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
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    game: state.game,
    error: state.error,
    getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { beforeGame, getGames, deleteGame, getAllUser, getRole })(Games);
