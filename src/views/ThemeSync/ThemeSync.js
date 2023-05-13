import React , {useState , useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from 'config/config';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { beforeGame , syncThemeList , editGame} from '../Games/Games.action';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");


const ThemeSync = (props) => {

    const [loader , setLoader] = useState(true)
    const [pagination, setPagination] = useState(null)
    const [Page , setPage] = useState(1)
    //ThemeSync
    const [syncThemes , setSyncThemes] = useState([])
    const [syncThemeModal , setSyncThemeModal] = useState(false)
    const [syncTheme , setSyncTheme] = useState('')
    const [permissions, setPermissions] = useState({})
    const [modalType, setModalType] = useState(0)
    const [syncThemeDetail , setSyncThemeDetail] = useState({
        themeRequest: false ,
        synced: false 
    })

    //search-filter GameID , gameName  , synced => true,false
    const [searchGameId , setSearchGameId] = useState(localStorage.getItem('themeSyncGameId') !== undefined && localStorage.getItem('themeSyncGameId') !== null ? localStorage.getItem('themeSyncGameId') : '' )
    const [searchGameName , setSearchGameName] = useState(localStorage.getItem('themeSyncGameName') !== undefined && localStorage.getItem('themeSyncGameName') !== null ? localStorage.getItem('themeSyncGameName') : '')
    // const [searchSyncStatus ,setSearchSyncStatus] = useState(localStorage.getItem('themeSyncStatus') !== undefined && localStorage.getItem('themeSyncStatus') !== null? localStorage.getItem('themeSyncStatus') : '')

    const [platformTypeArray, setPlatformTypeArray] = useState({ "1": 'Android', "2": 'iOS', "3": 'Cross Platform' })
    const [developmentEnvArray, setDevelopmentEnvArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [orientationArray, setOrientationArray] = useState({ "1": "Portrait", "2": "Landscape" })
    const [winningScoreArray, setWinningScoreArray] = useState({ "1": "Highest Score", "2": "Lowest Score", })
    const [gameFormatArray, setGameFormatArray] = useState({ "1": "Play & Compare", "2": "Real Time" })
    const [monitizationModelArray, setMonitizationModelArray] = useState({ "1": "Real Prize", "2": "Virtual Currency" })

    //submit
    const update = (Id)=>{
        let payload = syncTheme
        if(syncThemeDetail.synced === 'true'){
            payload.themeRequest = false
        }
        payload.synced = syncThemeDetail.synced === 'true' ? true : false

        
        props.editGame(Id , payload)
        setSyncThemeModal(!syncThemeModal)
        
    }
    //handleRejectTheme
    const handleRejectTheme = (Id) => {
        Swal.fire({
            title: 'Are you sure you want to Reject Theme?',
            html: 'If you Reject Theme item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Reject'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                setSyncThemeModal(!syncThemeModal)
                let payload = syncTheme
                payload.themeRequest = false
                await props.editGame(Id , payload)
                setLoader(false)
            }
        })
    }

    //componentDidMount
    useEffect(()=>{
        window.scroll(0,0)
        props.syncThemeList('')

        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
        
    },[])

    useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])


    //list
    useEffect(()=>{
        if(props.game.getSyncThemesAuth){
            setLoader(true)
            const { syncThemes , pagination } = props.game
            setSyncThemes( syncThemes )
            setPagination( pagination )
            setLoader(false)
            props.beforeGame()
        }
    },[props.game.getSyncThemesAuth])
    //edit
    useEffect(()=>{
        if(props.game.editGameAuth){
            setLoader(true)
            props.syncThemeList('')
        }
    },[props.game.editGameAuth])

    // useEffect(()=>{
    //     if(syncThemes){
    //         setLoader(false)
    //     }
    // },[syncThemes])


    const onPageChange = (page) => {
        const filter = {}
        if (searchGameId) {
            filter.gameId = searchGameId
            localStorage.setItem('themeSyncGameId', searchGameId)
        }
        if(searchGameName){
            filter.name = searchGameName
            localStorage.setItem('themeSyncGameName' , searchGameName)
        }
        // if(searchSyncStatus !== ''){
        //     filter.themeRequest = searchSyncStatus === 'true' ? true : false
        //     localStorage.setItem('themeSyncStatus' , searchSyncStatus)
        // }

        setLoader(true)
        setPage(page)
        const qs = ENV.objectToQueryString({page: page , limit:10})
        props.syncThemeList(qs, filter)
    }

    const applyFilters = ()=>{
        setLoader(true)
        const filter = {}
        if (searchGameId) {
            filter.gameId = searchGameId
            localStorage.setItem('themeSyncGameId', searchGameId)
        }
        if(searchGameName){
            filter.name = searchGameName
            localStorage.setItem('themeSyncGameName' ,searchGameName)
        }

        // if(searchSyncStatus !== ''){
        //     filter.themeRequest = searchSyncStatus === 'true' ? true : false
        //     localStorage.setItem('themeSyncStatus' , searchSyncStatus)
        // }
        setPage(1)
        const qs = ENV.objectToQueryString({page : Page , limit : 10})
        props.syncThemeList(qs,filter);
    }

    //set modal type
    const setModal  = (type = 0 , syncThemeId = null) => {
        setSyncThemeModal(!syncThemeModal)
        setModalType(type)
        setLoader(false)

        //edit Sync Theme
        if( ( type === 2 || type === 3) && syncThemeId ){
            getSyncTheme( syncThemeId )
        }
    }


    const getSyncTheme = async ( syncThemeId ) => {
        setLoader(true)
        const syncThemeData = await syncThemes.find((elem) => String(elem._id) === String(syncThemeId))
        if(syncThemeData){
            setSyncTheme({ ...syncThemeData })
            setSyncThemeDetail({...syncThemeDetail , themeRequest: String(syncThemeData.themeRequest) , synced: syncThemeData.synced ? 'true' : 'false' })
        }
        setLoader(false)
    }

    const downloadAndroidFile = () => {

        let url = window.URL.createObjectURL(new Blob([syncTheme?.compileThemeAndroid]));
        let a = document.createElement('a');
        a.href = url;
        a.download = 'Androidtheme.json';
        a.click();

    }

    const downloadiOSFile=()=>{
        let url = window.URL.createObjectURL(  new Blob([syncTheme?.compileThemeAndroid]));
        let a = document.createElement('a');
        a.href = url;
        a.download = 'Androidtheme.json';
        a.click();
    }

    const reset = ()=>{
        setLoader(true)
        setSearchGameId('')
        setSearchGameName('')
        // setSearchSyncStatus('')
        // setSearchCreatedAtTo('')
        // setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })

        props.syncThemeList(qs);

        localStorage.removeItem('themeSyncGameId')
        localStorage.removeItem('themeSyncGameName')
        // localStorage.removeItem('themeSyncStatus')
        // localStorage.removeItem('seasonCreatedAtTo')
        // localStorage.removeItem('seasonStatus')
    }

    return(
        <>
        {
            loader ?
                <FullPageLoader/>
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
                                <Row className='align-items-baseline'>
                                    <Col xl={3} sm={6}>
                                        <Form.Group>
                                            <label style={{ color: 'white' }}>Game Id:</label>
                                            <Form.Control value={searchGameId} type="text" placeholder="Game Id" onChange={(e) => setSearchGameId(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={3} sm={6}>
                                        <Form.Group>
                                            <label style={{ color: 'white' }}>Game Name:</label>
                                            <Form.Control value={searchGameName} type="text" placeholder="Game Name" onChange={(e) => setSearchGameName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col xl={3} sm={6}>
                                    <label style={{color : 'white'}}>Sync Status</label>
                                        <Form.Group>
                                            <select value={searchSyncStatus} onChange={(e) =>  setSearchSyncStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value='true'>Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </Form.Group> 
                                    </Col> */}

                                    <Col xl={3} sm={6}>
                                        <Form.Group>
                                            <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                            <div className="d-flex justify-content-between filter-btns-holder">
                                                <Button className='m-0' variant="info"   disabled={!searchGameId && !searchGameName  } onClick={applyFilters}>Search</Button>
                                                <Button className='m-0' variant="warning"  hidden={!searchGameId && !searchGameName  } onClick={reset}>Reset</Button>
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
                    <Col md='12'>
                        <Card className="table-big-boy">
                            <Card.Header>
                            <div className='d-flex justify-content-end mb-2 pr-3'>
                                <span  style={{ color: 'white',fontWeight:'bold' }}>{`Total : ${ pagination?.total ? pagination?.total : 0}`}</span>
                            </div>
                            <div className="d-block d-md-flex align-items-center justify-content-between">
                                <Card.Title as="h4">Sync Themes </Card.Title>
                            </div>
                            </Card.Header>
                            <Card.Body className="table-full-width">
                                <div className="table-responsive">
                                    <Table className="table-bigboy sync-themes">
                                        <thead>
                                            <tr>
                                                <th className="text-center serial-col">#</th>
                                                <th className='Game-iD'>Game ID</th>
                                                <th className='Game-name'>Game Name</th>
                                                <th className="td-actions text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                syncThemes && syncThemes.length ?
                                                    syncThemes.map((item , index) => {
                                                        return(
                                                            <>
                                                                <tr key={index}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td className="">
                                                                        {item.gameId}
                                                                    </td>
                                                                    <td className="">
                                                                        {item.name}
                                                                    </td>
                                                                    {/* <td className="text-center td-actions">
                                                                        <span className={`status ${item.status? `bg-success` : `bg-danger`
                                                                            }`}>
                                                                            <span className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</span>
                                                                        </span>
                                                                    </td> */}
                                                                    <td className="td-actions text-center">
                                                                        <ul className="list-unstyled mb-0">
                                                                            {
                                                                                permissions && permissions.viewRequestSyncTheme && 
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() =>{ setModal( 2 , item._id) } }
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                            }
                                                                            {
                                                                                permissions && permissions.editRequestSyncTheme &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => setModal( 3 , item._id)}
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
                                                            </>
                                                        )
                                                    })
                                                :
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        <div className="alert alert-info" role="alert">No Sync Theme Found</div>
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
                                                current={Page > pagination.pages ? pagination.pages :  Page} // current active page
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
                    modalType === 2 && syncTheme &&

                    <Modal className="modal-primary" onHide={() => setSyncThemeModal(!syncThemeModal)} show={syncThemeModal}>
                        <Modal.Header className="justify-content-center">
                            <Row>
                                <div className="col-12">
                                    <h4 className="mb-0 mb-md-3 mt-0">
                                        View Sync Theme
                                    </h4>
                                </div>
                            </Row>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="text-left">
                                <div className="d-flex name-email">
                                    <Form.Group className="flex-fill  d-flex align-items-center">
                                        <label className="label-font mr-2">Game ID: </label><span className="field-value text-white">{syncTheme?.gameId ?  syncTheme?.gameId : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className='d-flex align-items-center'>
                                        <label className="label-font mr-2" >Game Name: </label><span className="field-value text-white">{syncTheme?.name ? syncTheme.name : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className='d-flex align-items-center'>
                                        <label className="label-font mr-2" >Game Description: </label><span className="field-value text-white">{syncTheme?.description ? syncTheme.description : 'N/A'}</span>
                                    </Form.Group>
                                </div>
                                <div className="d-flex name-email">
                                    <Form.Group className='d-flex align-items-center'>
                                        <label className="label-font mr-2" >Platform Type: </label><span className="field-value text-white">{syncTheme.platformType ? platformTypeArray[`${syncTheme.platformType}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>
                                <div className="">
                                    <Form.Group className=' d-flex align-items-center'>
                                        <label className="label-font mr-2">Development Environment: </label><span className="field-value text-white">{syncTheme.developmentEnv ? developmentEnvArray[`${syncTheme.developmentEnv}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center' >
                                        <label className="label-font mr-2">Orientation: </label><span className="field-value text-white">{syncTheme.orientation ? orientationArray[`${syncTheme.orientation}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center'>
                                        <label className="label-font mr-2">WinningScore: </label><span className="field-value text-white">{syncTheme.winningScore ? winningScoreArray[`${syncTheme.winningScore}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center'>
                                        <label className="label-font mr-2">GameFormat: </label><span className="field-value text-white">{syncTheme.gameFormat ? gameFormatArray[`${syncTheme.gameFormat}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center'>
                                        <label className="label-font mr-2">MonitizationModel: </label><span className="field-value text-white">{syncTheme.monitizationModel ? monitizationModelArray[`${syncTheme.monitizationModel}`] : 'N/A'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center' >
                                        <label className="label-font mr-2">Request Synced: </label><span className="field-value text-white">{syncTheme?.synced ? 'Synced' : 'Un-Synced'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center' >
                                        <label className="label-font mr-2">Theme Request: </label><span className="field-value text-white">{syncTheme?.themeRequest ? 'Yes' : 'No'}</span>
                                    </Form.Group>
                                </div>

                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center' >
                                        <label className="label-font mr-2">  Download Android Theme: </label><span className="field-value text-white">{syncTheme?.compileThemeAndroid ?  <Button className="btn btn-info" onClick={()=>downloadAndroidFile()}>Download</Button> : 'No'}</span>
                                    </Form.Group>
                                </div>
                                <div className="d-flex name-email">
                                    <Form.Group className=' d-flex align-items-center' >
                                        <label className="label-font mr-2"> Download ThemeOS: </label><span className="field-value text-white">{syncTheme?.compileThemeOS ? <Button className="btn btn-info"  onClick={()=>downloadiOSFile()}>Download</Button>  : 'No'}</span>
                                    </Form.Group>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="btn btn-warning"
                                onClick={() => setSyncThemeModal(!syncThemeModal)}
                            >Close</Button>
                        </Modal.Footer>
                    </Modal>
                }

                {
                    modalType === 3 &&  syncTheme &&
                    <Modal className="modal-primary" onHide={() => setSyncThemeModal(!syncThemeModal)} show={syncThemeModal} >
                        <Modal.Header className="justify-content-center">
                            <Row>
                                <div className="col-12">
                                    <h4 className="mb-0 mb-md-3 mt-0">
                                        {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''} 
                                            Sync Theme Information
                                    </h4>
                                </div>
                            </Row>
                        </Modal.Header>
                        <Modal.Body>
                            <Form className="text-left">
                                                                
                                <div className="d-flex justify-content-end">      
                                    <Button className="btn btn-info " onClick={()=> handleRejectTheme(syncTheme._id)}>Reject Theme</Button>
                                </div>
                                <Form.Group>
                                    <label> Game ID <span className="text-danger">*</span></label>
                                    <Form.Control
                                        placeholder="Enter Game Name"
                                        disabled={modalType === 3}
                                        type="text"
                                        name="gameId"
                                        // onChange={(e) => setSyncTheme( {...seasonDetail  , name: e.target.value}) }
                                        value={syncTheme.gameId}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <label> Game Name <span className="text-danger">*</span></label>
                                    <Form.Control
                                        placeholder="Enter Game Name"
                                        disabled={modalType === 3}
                                        type="text"
                                        name="name"
                                        // onChange={(e) => setSyncTheme( {...seasonDetail  , name: e.target.value}) }
                                        value={syncTheme.name}
                                        required
                                    />
                                </Form.Group>

                                {/* <Form.Group>
                                    <label> Theme Request <span className="text-danger">*</span></label>
                                    <Form.Control 
                                        as="select" 
                                        className="form-select pr-3 mr-3" 
                                        aria-label="Default select example"
                                        value={syncThemeDetail.themeRequest ? syncThemeDetail.themeRequest : ''} 
                                        onChange={(e) => setSyncThemeDetail({...syncThemeDetail , themeRequest: e.target.value})}
                                    >
                                        <option value=''>Select Theme Request</option>
                                        <option value='true'>Approved</option>
                                        <option value="false">Not Approved</option>
                                    </Form.Control>
                                </Form.Group> */}

                                <Form.Group>
                                    <label> Synced Request <span className="text-danger">*</span></label>
                                    <Form.Control 
                                        as="select" 
                                        className="form-select pr-3 mr-3" 
                                        aria-label="Default select example"
                                        value={syncThemeDetail.synced ? syncThemeDetail.synced : ''} 
                                        onChange={(e) => setSyncThemeDetail({...syncThemeDetail , synced: e.target.value})}
                                    >
                                        <option value=''>Select Synced</option>
                                        <option value='true'>Synced</option>
                                        <option value="false">Un-Synced</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="btn btn-warning"
                                onClick={() => setSyncThemeModal(!syncThemeModal)}
                            >Close</Button>
                            {
                                modalType === 1 ? '' :
                                    <Button className="btn btn-info" onClick={() => update(syncTheme._id)}>Update</Button>
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
    game: state.game,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, { beforeGame , syncThemeList , editGame, getRole})(ThemeSync);