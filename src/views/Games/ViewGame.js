import React, { useState, useEffect } from 'react';
import { getGames, beforeGame, getGame, getUser, editGame, getAllUser } from './Games.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import defaultImage from '../../assets/img/placeholder.jpg'
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ShowMoreText from "react-show-more-text";
import ReactPlayer from 'react-player/lazy';

const ViewGame = (props) => {
    const { gameId } = useParams()
    const [previewImage, setPreviewImage] = useState("")
    const [previewBackgroundImage, setPreviewBackgroundImage] = useState("")
    const [previewTutorialImage, setPreviewTutorialImage] = useState("")
    const [previewSliderImage, setPreviewSliderImage] = useState("")
    const [previewSliderVideo, setPreviewSliderVideo] = useState("")
    //game properties
    const [data, setData] = useState({
        gameID: '',
        name: '',
        icon: '',
        backgroundImage: '',
        tutorialImage: '',
        homeSliderImage: [],
        homeSliderVideo: '',
        description: '',
        platformType: '',
        developmentEnv: '',
        user: '',
        orientation: '',
        winningScore: '',
        gameFormat: '',
        monitizationModel: '',
        sdkDownload: '',
        genre: []
    })
    //Array
    const [platformTypeArray, setPlatformTypeArray] = useState({ "1": 'Android', "2": 'iOS', "3": 'Cross Platform' })
    const [developmentEnvArray, setDevelopmentEnvArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [orientationArray, setOrientationArray] = useState({ "1": "Portrait", "2": "Landscape" })
    const [winningScoreArray, setWinningScoreArray] = useState({ "1": "Highest Score", "2": "Lowest Score", })
    const [gameFormatArray, setGameFormatArray] = useState({ "1": "Play & Compare", "2": "Real Time" })
    const [monitizationModelArray, setMonitizationModelArray] = useState({ "1": "Real Prize", "2": "Virtual Currency" })
    // Loader
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)

        // props.getAllUser()
    }, [])

    useEffect(() => {
        if (gameId) {
            props.getGame(gameId)
        }
    }, [gameId])


    useEffect(() => {
        if (props.game.getGameAuth) {
            
            const { oneToOneFee, isMultiplayer, description, developmentEnv, gameFormat, gameId, icon, monitizationModel, name, orientation, platformType, sdkDownload, user, verified, winningScore, backgroundImage, tutorialImage, homeSliderImage, homeSliderVideo, genre } = props.game.game
            //description , developmentEnv , gameFormat , gameId , icon , monitizationModel , name , orientation , platformType, sdkDownload , userId , verified , winningScore
            setData({ oneToOneFee, isMultiplayer, gameID: gameId, name, icon, user, description, platformType, developmentEnv, orientation, winningScore, gameFormat, monitizationModel, sdkDownload, backgroundImage, genre, homeSliderImage })
            if (icon) {
                setPreviewImage(icon)
            }
            if (backgroundImage) {
                setPreviewBackgroundImage(backgroundImage)
            }
            if (tutorialImage) {
                setPreviewTutorialImage(tutorialImage)
            }
            if (homeSliderImage) {
                setPreviewSliderImage(homeSliderImage)
            }
            if (homeSliderVideo) {
                setPreviewSliderVideo(homeSliderVideo)
            }

            setLoader(false)
        }
    }, [props.game.getGameAuth])


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
                                        <Card.Title as='h4'>View Game</Card.Title>
                                        <div className="float-right" >
                                            <Button className="btn-fill pull-right mr-2" variant="info" onClick={() => window.location.replace(`/admin/game-theme/${gameId}`)}>Game Theme</Button>
                                            <Button className="btn-fill pull-right" variant="info" onClick={() => window.location.replace(`/admin/game-tournament/${gameId}`)}>Game Tournament</Button> {/* after break */}
                                        </div>
                                        {/* <div className="float-right" >
                                            <Button className="btn-fill pull-right mr-2" variant="info" onClick={() => window.location.replace(`/admin/game-theme/${gameId}`)}>Game Theme</Button>
                                            <Button className="btn-fill pull-right" variant="info" onClick={() => window.location.replace(`/admin/game-tournament/${gameId}`)}>Game Tournament</Button> 
                                        </div> */}
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl="4" lg="6"  sm="6">
                                                <Form.Group>
                                                    <label className="label-font mr-2">Icon: </label>
                                                    <div className='user-view-image icon-image-view'>
                                                        {(previewImage !== undefined || previewImage !== '') && <img src={previewImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl="4" lg="6"  sm="6">
                                                <Form.Group>
                                                    <label className="label-font mr-2">Background: </label>
                                                    <div className='user-view-image'>
                                                        {(previewBackgroundImage !== undefined || previewBackgroundImage !== '') && <img src={previewBackgroundImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl="4" lg="6"  sm="6">
                                                <Form.Group>
                                                    <label className="label-font mr-2">Tutorial: </label>
                                                    <div className='user-view-image'>
                                                        {(previewTutorialImage !== undefined || previewTutorialImage !== '') && <img src={previewTutorialImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl="4" lg="6"  sm="6">
                                                <Form.Group>
                                                    <label className="label-font mr-2">Slider: </label>
                                                    <div className='user-view-image'>
                                                        {(previewSliderImage !== undefined || previewSliderImage !== '') && <img src={previewSliderImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col xl="4" lg="6"  sm="6">
                                                <Form.Group>
                                                    <label className="label-font mr-2">Slider Video: </label>
                                                    <div className='user-view-image game-video-holder'>
                                                        {(previewSliderVideo === undefined || previewSliderVideo === '') ? <><img src={previewSliderImage} /> </> : <ReactPlayer url={previewSliderVideo} playing={true} controls={true} />}
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className="flex-fill d-flex align-items-center">
                                                        <label className="label-font mr-2">Game ID: </label>
                                                        <label><span className="field-value text-white">{data.gameID}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className="flex-fill  d-flex align-items-center">
                                                        <label className="label-font mr-2">Name: </label>
                                                        <label><span className="field-value text-white">{data.name}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className="flex-fill  d-flex align-items-center">
                                                        <label className="label-font mr-2">Genres: </label>
                                                        <label><span className="field-value text-white">
                                                            {
                                                                data.genre && data.genre.length ? data.genre.map((item, index) => {
                                                                    return <div className='p-1' key={index}>{index + 1 + '). ' + item.label}</div>
                                                                })
                                                                    : ''
                                                            }
                                                        </span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col md="12">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">Description:</label>
                                                        <label>
                                                            <span className="field-value text-white">
                                                                { data.description ?
                                                                    // <ShowMoreText
                                                                    //     lines={1}
                                                                    //     more="Show more"
                                                                    //     less="Show less"
                                                                    //     className="content-css"
                                                                    //     anchorClass="show-more-less-clickable"
                                                                    //     expanded={false}
                                                                    //     width={280}
                                                                    //     truncatedEndingComponent={"... "}
                                                                    // >
                                                                        data.description
                                                                    // </ShowMoreText>
                                                                    :
                                                                    'N/A'}
                                                            </span>
                                                        </label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className="flex-fill  d-flex align-items-center">
                                                        <label className="label-font mr-2">User Name: </label>
                                                        <label><span className="field-value text-white">{data?.user?.username ? data.user.username.replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className='d-flex align-items-center'>
                                                        <label className="label-font mr-2" >Platform Type: </label>
                                                        <label><span className="field-value text-white">{data.platformType ? platformTypeArray[`${data.platformType}`] : 'N/A'}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">Development Environment: </label>
                                                        <label><span className="field-value text-white">{data.developmentEnv ? developmentEnvArray[`${data.developmentEnv}`] : 'N/A'}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">Downloaded: </label>
                                                        <lable><span className="field-value text-white  d-flex mb-2">{data.sdkDownload ? 'Yes' : 'No'}</span></lable>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center' >
                                                        <label className="label-font mr-2">Orientation: </label>
                                                        <lable><span className="field-value text-white  d-flex mb-2">{data.orientation ? orientationArray[`${data.orientation}`] : 'N/A'}</span></lable>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">WinningScore: </label>
                                                        <lable><span className="field-value text-white d-flex mb-2">{data.winningScore ? winningScoreArray[`${data.winningScore}`] : 'N/A'}</span></lable>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">Game Format: </label>
                                                        <label><span className="field-value text-white">{data.gameFormat ? gameFormatArray[`${data.gameFormat}`] : 'N/A'}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">Is Multiplayer: </label>
                                                        <label><span className="field-value text-white">{data.isMultiplayer ? 'Yes' : 'No'}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            <Col lg="4" md="6">
                                                <div className="d-flex name-email">
                                                    <Form.Group className=' d-flex align-items-center'>
                                                        <label className="label-font mr-2">One To One fee: </label>
                                                        <label><span className="field-value text-white">{data.oneToOneFee}</span></label>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                            {/* <Col lg="4" md="6">
                                            <div className="d-flex name-email">
                                                <Form.Group className=' d-flex align-items-center'>
                                                    <label className="label-font mr-2">MonitizationModel: </label>
                                                    <label><span className="field-value text-white">{data.monitizationModel ? monitizationModelArray[`${data.monitizationModel}`] : 'N/A'}</span></label>
                                                </Form.Group>
                                            </div>
                                        </Col> */}
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Form.Group className="ImageSelectorSlider">
                                                    <label>Slider Images<span className="text-danger"> *</span></label>
                                                    {/* <Form.Control
                                                        className='text-white upload-img-file '
                                                        onChange={async (e) => {
                                                            setLoader(true)
                                                            fileSelectHandler(e, 4);
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
                                                    </span> */}
                                                </Form.Group>
                                            </Col>
                                            {
                                                data.homeSliderImage.map((image, index) => {
                                                    return (
                                                        <Col md="3" className="slide-images-column d-flex" key={index}>
                                                            <img src={image} />
                                                            {/* <span className="slider-remove-btn" onClick={() => { removeSliderImage(index) }}>X</span> */}
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Link to={'/games'} className="float-right" >
                                                    <Button className="btn-fill pull-right mt-3" variant="info">
                                                        Back
                                                    </Button>
                                                </Link>
                                            </Col>
                                        </Row>
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


export default connect(mapStateToProps, { getGame, })(ViewGame);
