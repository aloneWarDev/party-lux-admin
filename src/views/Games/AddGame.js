import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { getGames, beforeGame, getGame, getUser, createGame, getAllUser, getAllGenres } from './Games.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import validator from 'validator';
import defaultImage from '../../assets/img/placeholder.jpg'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Select from 'react-select';
import ReactPlayer from 'react-player/lazy';
import { ENV } from '../../config/config';

const AddGame = (props) => {
    const dispatch = useDispatch()

    const [previewImage, setPreviewImage] = useState("")
    const [previewBackgroundImage, setPreviewBackgroundImage] = useState("")
    const [previewTutorialImage, setPreviewTutorialImage] = useState("")
    const [previewSliderImage, setPreviewSliderImage] = useState("")
    const [previewSliderVideo, setPreviewSliderVideo] = useState("")

    //game properties
    const [data, setData] = useState({
        gameID: '',
        isFeatured: '',
        isBestPractice: '',
        genre: [],
        name: '',
        icon: '',
        description: '',
        platformType: '',
        developmentEnv: '',
        userId: '',
        orientation: '',
        winningScore: '',
        gameFormat: '',
        monitizationModel: '',
        sdkDownload: '',
        backgroundImage: '',
        tutorialImage: '',
        homeSliderImage: [],
        homeSliderVideo: '',
        oneToOneFee: 0,
    })
    const [users, setUsers] = useState([])
    const [genres, setGenres] = useState([])
    const [savedGenres, setSavedGenres] = useState([])
    const [allSliderImages, setAllSliderImages] = useState([])

    //Msg
    const [msg, setMsg] = useState({
        userMsg: '',
        genreMsg: '',
        nameMsg: '',
        iconMsg: '',
        backgroundImageMsg: '',
        tutorialImageMsg: '',
        homeSliderImageMsg: '',
        homeSliderVideoMsg: '',
        descriptionMsg: '',
        platformTypeMsg: '',
        developmentEnvMsg: '',
        oneToOneFeeMsg: '',
    })
    //Array
    const [platformTypeArray, setPlatformTypeArray] = useState({ "1": 'Android', "2": 'iOS', "3": 'Cross Platform' })
    const [developmentEnvArray, setDevelopmentEnvArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [orientationArray, setOrientationArray] = useState({ "1": "Portrait", "2": "Landscape" })
    const [winningScoreArray, setWinningScoreArray] = useState({ "1": "Highest Score", "2": "Lowest Score", })
    const [gameFormatArray, setGameFormatArray] = useState({ "1": "Play & Compare", "2": "Real Time" })
    const [multiplayerSelectionArray, setMultiplayerSelectionArray] = useState({ "1": "Yes", "0": "No" })
    const [monitizationModelArray, setMonitizationModelArray] = useState({ "1": "Real Prize", "2": "Virtual Currency" })
    //imageChangeHandler 
    const [isImageChange, setIsImageChange] = useState(false)
    // Loader
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
        props.getAllUser()
        props.getAllGenres()
    }, [])


    useEffect(() => {
        if (props.game.getGenresAuth) {
            let { genres } = props.game
            setGenres(genres.filter(item => item.status === true).map((item) => {
                return ({ value: item._id, label: item.name })
            }))
        }
    }, [props.game.getGenresAuth])

    useEffect(() => {
        if (props.game.getUsersGameAuth) {
            const { users } = props.game
            setUsers(users)
        }
    }, [props.game.getUsersGameAuth])

    useEffect(() => {
        if (props.game.insertGameAuth) {
            setLoader(false)
            props.beforeGame()
            props.history.push(`/games`)
        }
    }, [props.game.insertGameAuth])


    //platformType
    useEffect(() => {
        if (data.platformType) {
            //Android
            if (data.platformType === 1 || data.platformType === '1') {
                setDevelopmentEnvArray({ "2": 'Android Studio', "4": 'Unity, Android Studio' })
            }
            //IOS
            if (data.platformType === 2 || data.platformType === '2') {
                setDevelopmentEnvArray({ "3": 'Xcode', "5": 'Unity, Xcode' })
            }
            //CrossPlatform
            if (data.platformType === 3 || data.platformType === '3') {
                setDevelopmentEnvArray({ "1": 'Unity' })
            }
        }
    }, [data?.platformType])

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }

    const fileSelectHandler = async (e, type) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = async () => {

            if (type == 1) {
                if (files[0].type.split('/')[0] === 'image') {
                    e.preventDefault()
                    const callback = (result) => {
                        if (result) {
                            setData({ ...data, icon: result })
                        }
                        else {
                            setData({ ...data, icon: '' })
                        }
                        setLoader(false)
                    }
                    await uploadImage(e, 'icon', callback)
                    setPreviewImage(reader.result);
                } else {
                    setMsg({ ...msg, iconMsg: "Invalid File Format" })
                    setPreviewImage('')
                }
                setIsImageChange(true)
            }
            if (type == 2) {
                if (files[0].type.split('/')[0] === 'image') {
                    e.preventDefault()
                    const callback = (result) => {
                        if (result) {
                            setData({ ...data, backgroundImage: result })
                        }
                        else {
                            setData({ ...data, backgroundImage: '' })
                        }
                        setLoader(false)
                    }
                    await uploadImage(e, 'backgroundImage', callback)
                    setPreviewBackgroundImage(reader.result);
                    // setIsImageChange(true)
                }
                else {
                    setMsg({ ...msg, backgroundImageMsg: "Invalid File Format" })
                    setPreviewBackgroundImage('')
                }

            }
            if (type == 3) { //tutorialImage
                if (files[0].type.split('/')[0] === 'image') {
                    e.preventDefault()
                    const callback = (result) => {
                        if (result) {
                            setData({ ...data, tutorialImage: result })
                        }
                        else {
                            setData({ ...data, tutorialImage: '' })
                        }
                        setLoader(false)
                    }
                    await uploadImage(e, 'tutorialImage', callback)
                    setPreviewTutorialImage(reader.result)
                }
                else {
                    setMsg({ ...msg, tutorialImageMsg: "Invalid File Format" })
                    setPreviewTutorialImage('')
                }

            }
            if (type == 4) { //sliderImage
                if (files && files.length) {
                    let localSlider = data.homeSliderImage
                    for (let i = 0; i < files.length; i++) {
                        if (files[i].type.split('/')[0] === 'image') {
                            e.preventDefault()
                            //homeSliderImage
                            const callback = (result) => {
                                localSlider.push(result)
                                if (result) {
                                    setData({ ...data, homeSliderImage: localSlider })
                                }
                                else {
                                    setData({ ...data, homeSliderImage: '' })
                                }
                                setLoader(false)
                            }
                            await uploadImage(e, 'homeSliderImage', callback)
                            setPreviewSliderImage(reader.result)
                        }
                        else {
                            setMsg({ ...msg, homeSliderImageMsg: "Invalid File Format" })
                            setPreviewSliderImage('')
                        }
                    }
                }
            }
            if (type == 5) {
                if (files[0].type.split('/')[0] === 'video') {
                    e.preventDefault()
                    //homeSliderVideo
                    const callback = (result) => {
                        if (result) {
                            setData({ ...data, homeSliderVideo: result })
                        }
                        else {
                            setData({ ...data, homeSliderVideo: '' })
                        }
                        setLoader(false)
                    }
                    await uploadImage(e, 'homeSliderVideo', callback)
                    setPreviewSliderVideo(reader.result)
                }
                else {
                    setMsg({ ...msg, homeSliderVideoMsg: "Invalid File Format" })
                    setPreviewSliderVideo('')
                }

            }
        };
        reader.readAsDataURL(files[0]);
    };

    const submit = () => {
        let check = true

        const error = {}
        if (validator.isEmpty(data.name.trim())) {
            error.nameMsg = 'Name field is Required.'

            check = false
        } else { error.nameMsg = '' }



        if (validator.isEmpty(data.userId === undefined ? '' : data.userId)) {
            error.userMsg = 'User Name field is Required.'

            check = false
        } else { error.userMsg = '' }



        if (!savedGenres || !savedGenres.length) {
            error.genreMsg = 'Genre field is Required.'

            check = false
        }
        else if (savedGenres && savedGenres.length > 0) {
            error.genreMsg = ''
        }


        if (validator.isEmpty(data.description.trim())) {
            error.descriptionMsg = 'Description is required'

            check = false
        } else { error.descriptionMsg = '' }



        if (validator.isEmpty(data.platformType + "")) {
            error.platformTypeMsg = 'This field is Required.'

            check = false
        } else error.platformTypeMsg = ''


        if (validator.isEmpty(data.developmentEnv + "")) {
            error.developmentEnvMsg = 'This field is Required.'

            check = false
        } else { error.developmentEnvMsg = '' }




        if (validator.isEmpty(data.icon !== undefined ? data.icon : "")) {
            error.iconMsg = 'Image is Required.'

            check = false
        } else error.iconMsg = ''




        if (validator.isEmpty(data.backgroundImage !== undefined ? data.backgroundImage : "")) {
            error.backgroundImageMsg = 'Image is Required.'

            check = false
        } else error.backgroundImageMsg = ''


        if (validator.isEmpty(data.tutorialImage !== undefined ? data.tutorialImage : "")) {
            error.tutorialImageMsg = 'Image is Required.'

            check = false
        } else error.tutorialImageMsg = ''


        if (!data.homeSliderImage.length) {
            error.homeSliderImageMsg = 'Image is Required.'

            check = false
        } else error.homeSliderImageMsg = ''



        if (validator.isEmpty(data.homeSliderVideo !== undefined ? data.homeSliderVideo : "")) {
            error.homeSliderVideoMsg = 'Video is Required.'

            check = false
        } else error.homeSliderVideoMsg = ''



        if (data.oneToOneFee < -1) {
            error.oneToOneFeeMsg = 'Game fee always be positive'

            check = false
        } else error.oneToOneFeeMsg = ''


        setMsg(error)



        if (check) {
            // setFormValid(false)

            let payload = { name: data.name, description: data.description }

            if (data.platformType) {
                payload.platformType = parseInt(data.platformType)
            }
            if (data.developmentEnv) {
                payload.developmentEnv = parseInt(data.developmentEnv)
            }
            if (data.orientation) {
                payload.orientation = parseInt(data.orientation)
            }
            if (data.winningScore) {
                payload.winningScore = parseInt(data.winningScore)
            }
            if (data.gameFormat) {
                payload.gameFormat = parseInt(data.gameFormat)
            }
            if (data.monitizationModel) {
                payload.monitizationModel = parseInt(data.monitizationModel)
            }
            if (data.userId) {
                payload.userId = data.userId
            }
            if (savedGenres && savedGenres.length > 0) {
                payload.genre = JSON.stringify(savedGenres)
            }
            if (data.isFeatured) {
                payload.isFeatured = data.isFeatured
            }
            if (data.isBestPractice) {
                payload.isBestPractice = data.isBestPractice
            }
            if (data.icon) {
                payload.icon = data.icon
            }
            if (data.backgroundImage) {
                payload.backgroundImage = data.backgroundImage
            }
            if (data.tutorialImage) {
                payload.tutorialImage = data.tutorialImage
            }
            if (data.homeSliderImage) {
                payload.homeSliderImage = data.homeSliderImage
            }
            if (data.homeSliderVideo) {
                payload.homeSliderVideo = data.homeSliderVideo
            }
            if (data.isMultiplayer) {
                payload.isMultiplayer = data.isMultiplayer == '1' ? true : false
            }
            if (data.oneToOneFee) {
                payload.oneToOneFee = data.oneToOneFee
            }



            dispatch(createGame(payload));
            setLoader(true)
        }
    }

    const genreOnChange = (event) => {
        setMsg({ ...msg, genreMsg: '' })
        if (event === null) {
            setSavedGenres([])
        }
        else {
            console.log('YYYY:::: ', event)
            setData({ ...data, genre: event })
            setSavedGenres(event)
        }

    }
    const removeSliderImage = (index) => {
        let _homeSliderImage = data.homeSliderImage
        delete _homeSliderImage[index]
        _homeSliderImage.map(image => image == image)
        setData({ ...data, homeSliderImage: _homeSliderImage })
    }

    const uploadImage = async (e, field, callback) => {
        e.preventDefault()
        let data = new FormData();
        data.append(field, e.target.files[0]);
        let url = `${process.env.REACT_APP_BASE_URL}staff/upload-image`
        fetch(url, {
            method: 'POST',
            headers: {
                // 'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
                'x-auth-token': process.env.REACT_APP_X_AUTH_TOKEN
            },
            body: data
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    callback(data.data.img)
                } else {
                    // toast.error(data.message)
                    callback('')
                }

            }).catch(error => {
                if (error.response && error.response.data) {
                    const { data } = error.response
                    // if (data.message)
                    // toast.error(data.message)
                }
                // callback('')
            })
    }


    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md='12'>
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as='h4'>Add Game</Card.Title>

                                    </Card.Header>
                                    <Card.Body>

                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Name <span className="text-danger">*</span> </label>
                                                    <Form.Control
                                                        placeholder="Enter Game Name"
                                                        type="text"
                                                        name="name"
                                                        onChange={(e) => {
                                                            e.preventDefault();
                                                            setMsg({ ...msg, nameMsg: '' })
                                                            setData({ ...data, name: e.target.value })
                                                        }

                                                        }
                                                        value={data.name}
                                                        maxLength={30}
                                                        required
                                                    />
                                                    <span className={msg.nameMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.nameMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>User Name<span className="text-danger">*</span> </label>

                                                    <br></br>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.userId} onChange={(e) => {
                                                            setMsg({ ...msg, userMsg: '' })
                                                            setData({ ...data, userId: e.target.value })
                                                        }}
                                                    >
                                                        <option value={''}>Select User</option>
                                                        {users &&
                                                            users.map((u) => {
                                                                return (<option value={u._id}>{u.username}</option>)
                                                            })
                                                        }


                                                    </Form.Control>
                                                    <span className={msg.userMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.userMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Genres<span className="text-danger">*</span> </label>
                                                    {
                                                        genres && genres.length ?
                                                            <Select
                                                                isMulti
                                                                name="colors"
                                                                options={genres}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                onChange={genreOnChange}
                                                                value={data.genre}
                                                            />
                                                            : ''
                                                    }
                                                    <span className={msg.genreMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.genreMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group>
                                                    <label>Description <span className="text-danger">*</span></label>
                                                    <Form.Control
                                                        placeholder="Enter Description"
                                                        as="textarea"
                                                        rows={3}
                                                        name="name"
                                                        maxLength={500}
                                                        onChange={(e) => {
                                                            setMsg({ ...msg, descriptionMsg: '' })
                                                            setData({ ...data, description: e.target.value })
                                                        }
                                                        }
                                                        value={data.description}
                                                        required
                                                    />
                                                    <span className={msg.descriptionMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.descriptionMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Platform Type<span className="text-danger">*</span></label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.platformType} onChange={(e) => {
                                                            setMsg({ ...msg, platformTypeMsg: '' })
                                                            // setData({ ...data, platformType: e.target.value })
                                                            setData({ ...data, platformType: e.target.value, developmentEnv: '' })
                                                        }
                                                        }
                                                    >
                                                        <option value={''}>Select Platform Type</option>
                                                        {renderOption(platformTypeArray)}
                                                    </Form.Control>
                                                    <span className={msg.platformTypeMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.platformTypeMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Development Environment:<span className="text-danger">*</span></label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.developmentEnv ? data.developmentEnv : ''}
                                                        onChange={
                                                            (e) => {
                                                                setMsg({ ...msg, developmentEnvMsg: '' })
                                                                setData({ ...data, developmentEnv: e.target.value })
                                                            }
                                                        }
                                                        disabled={data.platformType ? false : true}
                                                    >
                                                        <option value={''}>{data.platformType ? `Select Environment:` : `First, Select the Platform Type`}</option>
                                                        {renderOption(developmentEnvArray)}
                                                    </Form.Control>
                                                    <span className={msg.developmentEnvMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.developmentEnvMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Orientation:</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.orientation ? data.orientation : ''} onChange={(e) => setData({ ...data, orientation: e.target.value })}
                                                    >
                                                        <option value={''}>Select Orientation:</option>
                                                        {renderOption(orientationArray)}
                                                    </Form.Control>
                                                    <span className={msg?.orientationMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg?.orientationMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Winning Score:</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.winningScore ? data.winningScore : ''} onChange={(e) => setData({ ...data, winningScore: e.target.value })}
                                                    >
                                                        <option value={''}>Select WinningScore:</option>
                                                        {renderOption(winningScoreArray)}
                                                    </Form.Control>
                                                    <span className={msg?.winningScoreMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg?.winningScoreMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Game Format:</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.gameFormat} onChange={(e) => setData({ ...data, gameFormat: e.target.value })}
                                                    >
                                                        <option value={''}>Select GameFormat:</option>
                                                        {renderOption(gameFormatArray)}
                                                    </Form.Control>
                                                    <span className={msg?.gameFormatMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg?.gameFormatMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Is Multiplayer:</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={data.isMultiplayer ? '1' : '0'} onChange={(e) => setData({ ...data, isMultiplayer: e.target.value })}
                                                    >
                                                        <option value={''}>Is Game multiplayer:</option>
                                                        {renderOption(multiplayerSelectionArray)}
                                                    </Form.Control>
                                                    <span className={msg?.isMultiplayer ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg?.isMultiplayer}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>One To One PArticipation Fee:</label>
                                                    <Form.Control
                                                        placeholder="Enter Game oneToOne Fee"
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        onChange={(e) => {
                                                            setMsg({ ...msg, oneToOneFeeMsg: '' })
                                                            setData({ ...data, oneToOneFee: e.target.value })
                                                        }}
                                                        value={data.oneToOneFee}
                                                    ></Form.Control>
                                                    <span className={msg?.oneToOneFeeMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg?.oneToOneFeeMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Image<span className="text-danger"> *</span></label>
                                                    <div className='mb-4 user-view-image add-game-image'>
                                                        {(previewImage !== undefined || previewImage !== '') && <img src={previewImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                    <Form.Control
                                                        className='text-white upload-img-file '
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            await fileSelectHandler(e, 1);
                                                            // if( e.target.files[0].type.split('/')[0] === 'image'){
                                                            //     setData({ ...data, icon: e.target.files[0] })
                                                            // }
                                                            // else{
                                                            //     setData({ ...data, icon: ''})
                                                            // }

                                                        }}
                                                        type="file"
                                                        accept="image/*"
                                                    ></Form.Control>
                                                    <span className={!previewImage && msg.iconMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.iconMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Background Image<span className="text-danger"> *</span></label>
                                                    <div className='mb-4 user-view-image add-game-image'>
                                                        {(previewBackgroundImage !== undefined || previewBackgroundImage !== '') && <img src={previewBackgroundImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                    <Form.Control
                                                        className='text-white upload-img-file '
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            await fileSelectHandler(e, 2);
                                                            // if( e.target.files[0].type.split('/')[0] === 'image' ){
                                                            //     setData({ ...data, backgroundImage: e.target.files[0] })
                                                            // }
                                                            // else{
                                                            //     setData({ ...data, backgroundImage: ''})
                                                            // }
                                                        }}
                                                        type="file"
                                                        accept="image/*"
                                                    ></Form.Control>
                                                    <span className={!previewBackgroundImage && msg.backgroundImageMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.backgroundImageMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Tutorial Image<span className="text-danger"> *</span></label>
                                                    <div className='mb-4 user-view-image add-game-image'>
                                                        {(previewTutorialImage !== undefined || previewTutorialImage !== '') && <img src={previewTutorialImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                    <Form.Control
                                                        className='text-white upload-img-file '
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            await fileSelectHandler(e, 3);
                                                            // if( e.target.files[0].type.split('/')[0] === 'image' ){
                                                            //     setData({ ...data, tutorialImage: e.target.files[0] })
                                                            // }
                                                            // else{
                                                            //     setData({ ...data, tutorialImage: ''})
                                                            // }
                                                        }}
                                                        type="file"
                                                        accept="image/*"
                                                    ></Form.Control>
                                                    <span className={!previewTutorialImage && msg.tutorialImageMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.tutorialImageMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>

                                            <Col md="4">
                                                <Form.Group>
                                                    <label>Slider Video<span className="text-danger"> *</span></label>
                                                    <div className='mb-4 user-view-image add-game-image'>
                                                        {(previewSliderVideo === undefined || previewSliderVideo === "" || previewSliderVideo === null) ? <img src={defaultImage} /> : <>      <ReactPlayer url={previewSliderVideo} playing={true} controls={true} /> </>}
                                                    </div>
                                                    <Form.Control
                                                        className='text-white upload-img-file upload-video'
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            await fileSelectHandler(e, 5);
                                                            // if( e.target.files[0].type.split('/')[0] === 'video' ){
                                                            //     setData({ ...data, homeSliderVideo: e.target.files[0] })
                                                            // }
                                                            // else{
                                                            //     setData({ ...data, homeSliderVideo: ''})
                                                            // }
                                                        }}
                                                        accept="video/mp4,video/x-m4v,video/*"
                                                        type="file"
                                                    ></Form.Control>
                                                    <span className={!previewSliderVideo && msg.homeSliderVideoMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.homeSliderVideoMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            <Col md="4">
                                                <Form.Group className="mt-4">
                                                    <label className="mt-4">Is Featured <span className="text-danger">*</span></label><br></br>
                                                    <BootstrapSwitchButton
                                                        width={200}
                                                        checked={data.isFeatured ? data.isFeatured : false}
                                                        onlabel='Featured'
                                                        offlabel='Not Featured'
                                                        onstyle="outline-success" offstyle="outline-danger"
                                                        onChange={(checked) => {
                                                            setData({ ...data, isFeatured: checked })
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <label>Is Best Practice <span className="text-danger">*</span></label><br></br>
                                                    <BootstrapSwitchButton
                                                        width={200}
                                                        checked={data.isBestPractice ? data.isBestPractice : false}
                                                        onlabel='Best Practice'
                                                        offlabel='Not Best Practice'
                                                        onstyle="outline-success" offstyle="outline-danger"
                                                        onChange={(checked) => {
                                                            setData({ ...data, isBestPractice: checked })
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group className="ImageSelectorSlider">
                                                    <label>Slider Images<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        className='text-white upload-img-file '
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            await fileSelectHandler(e, 4);
                                                            // if( e.target.files[0].type.split('/')[0] === 'image' ){
                                                            //     setData({ ...data, homeSliderImage: e.target.files[0] })
                                                            // }
                                                            // else{
                                                            //     setData({ ...data, homeSliderImage: ''})
                                                            // }
                                                        }}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                    ></Form.Control>
                                                    <span className={!previewSliderImage && msg.homeSliderImageMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.homeSliderImageMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                            {
                                                data.homeSliderImage.map((image, index) => {
                                                    return (
                                                        <Col md="3" className="slide-images-column d-flex" key={index}>
                                                            <img src={image} />
                                                            <span className="slider-remove-btn" onClick={() => { removeSliderImage(index) }}>X</span>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="d-flex justify-content-between flex-column flex-sm-row">
                                                    <Link to={'/games'} className="btn btn-fill btn-info" >
                                                        Back
                                                    </Link>
                                                    <Button className="btn-fill" type="submit" variant="info" onClick={() => { submit() }}>
                                                        {"Add"}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                        {/**/}
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
})

export default connect(mapStateToProps, { beforeGame, getGame, createGame, getAllUser, getAllGenres })(AddGame);