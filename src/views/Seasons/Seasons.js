import react , { useState , useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from 'config/config';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import validator from 'validator';
import Swal from 'sweetalert2';
import moment from 'moment';
import DatePicker from 'react-datetime-picker';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { beforeSeason, getSeasons , createSeason , editSeason , deleteSeason , getAllGames , validateSeasonDate , validateSeasonDate_v2 } from './Seasons.action';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");

const Season = (props) =>{

    const [permissions, setPermissions] = useState({})
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState(null)
    const [Page , setPage] = useState(1)
    //Seasons
    const [seasons, setSeasons] = useState(null)
    const [games ,setGames] = useState([])
    const [seasonModal, setSeasonModal] = useState(false)
    const [season, setSeason] = useState(null)
    const [modalType, setModalType] = useState(0)
    //Seasons Properties
   
    const [ seasonDetail , setSeasonDetail] = useState({
        name: '',      //string
        gameId: '',    //string
        color: '',      //string
        from: '',       //Date
        to: '',         //Date
        type: '',       // 1= SandBox , 2= Production
        status: true,   // true = Active , false = InAc
    })

    //filter
    const [searchName , setSearchName] = useState(localStorage.getItem('seasonName') !== undefined && localStorage.getItem('seasonName') !== null ? localStorage.getItem('seasonName') : '' )
    const [searchEnvironmentType, setSearchEnvironmentType] = useState(localStorage.getItem('seasonEnvironmentType') !== undefined && localStorage.getItem('seasonEnvironmentType') !== null ? localStorage.getItem('seasonEnvironmentType') : '')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState(localStorage.getItem('seasonCreatedAtFrom') !== undefined && localStorage.getItem('seasonCreatedAtFrom') !== null ? new Date(localStorage.getItem('seasonCreatedAtFrom')) : null)
    const [searchAtTo, setSearchCreatedAtTo] = useState(localStorage.getItem('seasonCreatedAtTo') !== undefined && localStorage.getItem('seasonCreatedAtTo') !== null ? new Date(localStorage.getItem('seasonCreatedAtTo')) : null)
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('seasonStatus') !== undefined && localStorage.getItem('seasonStatus') !== null? localStorage.getItem('seasonStatus') : '')

    //filter-Select-options
    const [EnvironmentTypeArray, setEnvironmentTypeArray] = useState({ "1": 'Sandbox', "2": 'Production' })
    //Msg
    const [seasonMsgs , setSeasonMsgs] = useState({
        nameMsg: '',
        gameIdMsg: '',
        colorMsg: '',
        fromMsg: '',
        toMsg: '',
        typeMsg: '',
    })

    useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }

    const submit = (Id) =>{
        // 
        // 
        setLoader(true)
        let check = true;
        let error = {}

        if(validator.isEmpty(seasonDetail.name)){
            error.nameMsg = 'Name field is Required.'
            check = false
        }else{error.nameMsg = '' }

        if(validator.isEmpty(seasonDetail.color)){
            error.colorMsg = 'Color is Required.'
            check = false
        }else{ error.colorMsg = '' }

        if(validator.isEmpty(seasonDetail.gameId)){
            error.gameIdMsg = 'Game is Required.'
            check = false
        }else{ error.gameIdMsg = '' }        

        if(validator.isEmpty(seasonDetail.type+' ')){
            error.typeMsg = 'Environment Type is Required'
            check = false
        }else{ error.typeMsg =  ''}

        if(validator.isEmpty(seasonDetail.from + "") ){
            error.fromMsg = 'From Date is Required'
            check = false
        }else{ error.fromMsg = '' }

        if(validator.isEmpty(seasonDetail.to + "")){
            error.toMsg = "To Date is Required"
            check = false
        }else{ error.toMsg = ""}
        setSeasonMsgs(error)
        if(check){
            let payload = {}
            payload.status = seasonDetail.status

            if(seasonDetail.name){
                payload.name = seasonDetail.name
            }

            if(seasonDetail.gameId){
                payload.gameId = seasonDetail.gameId
            }

            if(seasonDetail.color){
                payload.color = seasonDetail.color
            }
            if(seasonDetail.from){
                payload.from = new Date(seasonDetail.from)
            }
            if(seasonDetail.to){
                payload.to = new Date(seasonDetail.to)
            }
            if(seasonDetail.type){
                payload.type = seasonDetail.type
            }
            if(modalType === 3){ // edit modal type
                props.editSeason(Id , payload)
            }
            if (modalType === 1) { // add modal type
                props.createSeason(payload);
            }
            setSeasonModal(!seasonModal)
        }
    }

    useEffect(()=>{
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = {}
        if(searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName
        if(searchEnvironmentType !== undefined && searchEnvironmentType !== null && searchEnvironmentType !== '')
            filter.type = searchEnvironmentType
        if (searchAtFrom !== undefined && searchAtFrom !== null && searchAtFrom !== '')
            filter.from = searchAtFrom
        if (searchAtTo !== undefined && searchAtTo !== null && searchAtTo !== '')
            filter.to = searchAtTo
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false  
        props.getAllGames('')      
        props.getSeasons('',filter);

        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
        
    },[])

    //sdks
    useEffect(()=>{
        if(props.seasons.getSeasonsAuth){
            const { seasons , pagination } = props.seasons;
            setSeasons(seasons)
            setPagination(pagination)
            props.beforeSeason()
        }
    },[props.seasons.getSeasonsAuth])
    //createAuth 
    useEffect(()=>{
        if(props.seasons.createAuth){
            props.getSeasons('')
        }
    },[props.seasons.createAuth])
    //editSeasonAuth
    useEffect(()=>{
        if(props.seasons.editSeasonAuth){
            props.getSeasons('')
        }
    },[props.seasons.editSeasonAuth])
    //deleteSeason
    useEffect(() => {
        if (props.seasons.deleteSeasonAuth) {
            window.scroll(0, 0)
            const qs = ENV.objectToQueryString({page: 1, limit: 10 })
            props.getSeasons(qs)
            props.beforeSeason()
        }
    }, [props.seasons.deleteSeasonAuth])

    //getAllGames
    useEffect(()=>{
        if(props.seasons.getGamesAuth){
            const { games } = props.seasons
            setGames(games)
        }
    },[props.seasons.getGamesAuth])

    //seasons
    useEffect(()=>{
        if(seasons){
            setLoader(false)
        }
    },[seasons])

    //set modal type
    const setModal  = (type = 0 , seasonId = null) => {
        setSeasonModal(!seasonModal)
        setModalType(type)
        setLoader(false)
        // setSeasonDetail
        setSeasonMsgs({nameMsg: '', gameIdMsg: '',colorMsg: '', fromMsg: '', toMsg: '',typeMsg: ''})
        //add sdk
        if(type === 1 ){
            let season = {
                name: '',      //string
                gameId: '',    //string
                color: '',      //string
                from: '',       //Date
                to: '',         //Date
                type: '',       // 1= SandBox , 2= Production
                status: true,   // true = Active , false = InAc
            }
            setSeasonDetail(season)
            setSeason(season)
        }
        //edit Sdk
        else if( ( type === 2 || type === 3) && seasonId ){
            getSeason(seasonId)
        }
    }

    const getSeason = async (seasonId) => {
        setLoader(true)
        const seasonData = await seasons.find((elem) => String(elem._id) === String(seasonId))
        if(seasonData){
            setSeason({ ...seasonData })
            setSeasonDetail({ ...seasonData })
        }
        setLoader(false)
    }


    const deleteSeason = (seasonId) => {
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
                await props.deleteSeason(seasonId)
                setLoader(false)
            }
        })
    }

    const onPageChange = (page) => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('seasonName', searchName)
        }
        if(searchEnvironmentType){
            filter.type = searchEnvironmentType
            localStorage.setItem('seasonEnvironmentType' ,searchEnvironmentType)
        }
        if(searchAtFrom){
            filter.from = searchAtFrom
            localStorage.setItem('seasonCreatedAtFrom' , searchAtFrom)
        }
        if(searchAtTo){
            filter.to = searchAtTo
            localStorage.setItem('seasonCreatedAtTo' , searchAtTo)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('seasonStatus' , searchStatus)
        }
        setLoader(true)
        setPage(page)
        const qs = ENV.objectToQueryString({page: page , limit:10})
        props.getSeasons(qs, filter)
    }
    const applyFilters = (from=true,to=true)=>{
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('seasonName', searchName)
        }
        if(searchEnvironmentType){
            filter.type = searchEnvironmentType
            localStorage.setItem('seasonEnvironmentType' ,searchEnvironmentType)
        }
        if(searchAtFrom && from){
            
            filter.from = searchAtFrom
            localStorage.setItem('seasonCreatedAtFrom' , searchAtFrom)
        }
        if(searchAtTo && to){
            
            filter.to = searchAtTo
            localStorage.setItem('seasonCreatedAtTo' , searchAtTo)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('seasonStatus' , searchStatus)
        }
        setPage(1)
        setLoader(true)
        const qs = ENV.objectToQueryString({page : Page , limit : 10})
        
        props.getSeasons(qs,filter);
    }

    const reset = ()=>{
        setLoader(true)
        setSearchName('')
        setSearchEnvironmentType('')
        setSearchCreatedAtFrom('')
        setSearchCreatedAtTo('')
        setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getSeasons(qs);


        localStorage.removeItem('seasonName')
        localStorage.removeItem('seasonEnvironmentType')
        localStorage.removeItem('seasonCreatedAtFrom')
        localStorage.removeItem('seasonCreatedAtTo')
        localStorage.removeItem('seasonStatus')
    }

    const handleDateFrom = (e) => {
        if(e){
            
          const _callback=(success,msg)=>
          {
            let condition=true
            if(seasonDetail?.to && success)
            {
              condition= moment(e).isBefore(seasonDetail?.to)
              if(!condition){
                msg="(To) Date must be before from (From) Date"
              }
              else{
                
                const __callback=(succ,message)=>{
                  if(succ)
                  {
                   return;
                  }
                  else
                  {
                    setSeasonDetail({...seasonDetail,from:''})
                    msg="From and to Time Slot conflict with other season Timeslot"
                    setSeasonMsgs({...seasonMsgs,fromMsg:msg})
                   }
                }
               props.validateSeasonDate_v2( modalType === 3 ? {gameId: seasonDetail?.gameId , seasonId: season._id ,  from:e, to: seasonDetail?.to} : {gameId: seasonDetail?.gameId ,  from:e, to: seasonDetail?.to },__callback)
              }
            }
            if(success && condition)
            {
              setSeasonDetail({...seasonDetail,from:e})
              setSeasonMsgs({...seasonMsgs,fromMsg:''})
            }
            else
            {
                setSeasonDetail({...seasonDetail , from:''})
                setSeasonMsgs({...seasonMsgs , fromMsg:msg })
            }
          }
          props.validateSeasonDate({gameId: seasonDetail?.gameId ,seasonId: modalType === 3 ? season._id : null   ,  from: e },_callback)  
        }
        else
        {
            setSeasonDetail({...seasonDetail,from:null})
        }
    }

    const handleDateTo = (e) => {
        if(e){
          
          const callback=(success,msg)=>
          {
            let condition=true
            if(seasonDetail?.from && success)
            {
              
              condition= moment(e).isAfter(seasonDetail?.from)
              if(!condition){ 
              msg="(To) Date must be after (From) Date"}
              else{
               const __callback=(succ,message)=>{
                 if(succ)
                 {
                  return;
                 }
                 else
                 {
                    setSeasonDetail({...seasonDetail , to:""})
                  msg="From and to Time Slot conflict with other season Timeslot"
                  setSeasonMsgs({...seasonMsgs , toMsg:msg})
                 }
               }
              props.validateSeasonDate_v2( modalType === 3 ? { seasonId:season._id , to: e ,  from: seasonDetail?.from } : {  gameId: seasonDetail?.gameId , to: e ,  from: seasonDetail?.from },__callback)  
            }
            }
            if(success && condition)
            {
              setSeasonDetail({...seasonDetail,to:e})
              setSeasonMsgs({...seasonMsgs,toMsg:''})
            }
            else
            {
                setSeasonDetail({...seasonDetail,to:''})
                setSeasonMsgs({...seasonMsgs ,toMsg:msg})
            }
          }
          props.validateSeasonDate(modalType === 3 ? { seasonId:season._id , to: e }: { gameId: seasonDetail?.gameId , to:e },callback)
        }
        else
        {
            setSeasonDetail({...seasonDetail ,to:null })
        }
    }

    // const handleSearchDate = (value ,num)  => {
    //     if(value === null){
    //         if(num === 1 ){//searchAtFrom
    //             applyFilters(false,true)
    //         }
    //         if(num === 2){
    //             applyFilters(true,false)
    //         }  
    //     }
    // }

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
                                    <Row>
                                        <Col xl={4} sm={6}>
                                            <label style={{ color: 'white' }}>Name</label>
                                            <Form.Control value={searchName} type="text" placeholder="Name" onChange={(e) => setSearchName(e.target.value)} />
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <Form.Group>
                                                <label style={{ color: 'white' }}>Environment Type</label>
                                                <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                    value={searchEnvironmentType} onChange={(e) => setSearchEnvironmentType(e.target.value)}
                                                >
                                                    <option value={''}>Select Environment Type</option>
                                                    {renderOption(EnvironmentTypeArray)}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <label style={{ color: 'white' }}>Start Date &amp; Time</label>
                                            <Form.Group>
                                                <DatePicker onChange={(value) => {setSearchCreatedAtFrom(value); /*handleSearchDate(value , 1)*/} } value={searchAtFrom ? searchAtFrom : null}    maxDate={ searchAtTo ? new Date(searchAtTo) : new Date("2025-01-01") } />
                                            </Form.Group>
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <label style={{ color: 'white' }}>End Date &amp; Time</label>
                                            <Form.Group>
                                                <DatePicker onChange={(val)=>{  setSearchCreatedAtTo(val); /*handleSearchDate(val , 2)*/ } }  value={searchAtTo ? searchAtTo : null} minDate={ searchAtFrom ? new Date(searchAtFrom) : new Date("1800-01-01") } />
                                            </Form.Group>
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <label style={{color : 'white'}}>Status</label>
                                            <Form.Group>
                                                <select value={searchStatus} onChange={(e) =>  setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value='true'>Active</option>
                                                    <option value='false'>Inactive</option>
                                                </select>
                                            </Form.Group> 
                                        </Col>
                                        <Col xl={4} sm={6}>
                                            <Form.Group>
                                                <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                <div className="d-flex justify-content-between filter-btns-holder">
                                                    <Button variant="info" disabled={ !searchName  && !searchEnvironmentType  && !searchAtFrom && !searchAtTo && !searchStatus } onClick={applyFilters}>Search</Button>
                                                    <Button variant="warning" hidden={ !searchName  && !searchEnvironmentType  && !searchAtFrom && !searchAtTo && !searchStatus } onClick={reset}>Reset</Button>
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
                                <span  style={{ color: 'white',fontWeight:'bold' }}> {`Total : ${pagination?.total}`}</span>
                                </div>
                                    <div className="d-block d-md-flex align-items-center justify-content-between">
                                        <Card.Title as="h4">Seasons</Card.Title>
                                        {
                                            permissions && permissions.addSeason && 
                                            <Button
                                                variant="info"
                                                className="float-sm-right"
                                                onClick={() => setModal(1)}
                                            >
                                                Add Season
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
                                                    <th className='td-name text-center'>Environment Type</th>
                                                    <th className='td-name text-center'>Game Id</th>
                                                    <th className='td-name text-center'>Game Name</th>
                                                    <th className='td-created text-center'>Start Date</th>
                                                    <th className='td-created text-center'>End Date</th>
                                                    <th className='td-name text-center '>Status</th>
                                                    <th className="td-actions text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    seasons && seasons.length ?
                                                    seasons.map((season, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination?.limit * pagination?.page) - pagination.limit) + index + 1}</td>
                                                                    <td className="td-name text-center">
                                                                        {season?.name}
                                                                    </td>
                                                                    <td className="td-name text-center">
                                                                        {season?.type ? EnvironmentTypeArray[`${ season?.type }`] : 'N/A'}
                                                                    </td>
                                                                    <td className="td-name text-center">
                                                                        {season?.gameId ? season?.game?.gameId : 'N/A'}
                                                                    </td>
                                                                    <td className="td-name text-center">
                                                                        {season?.gameId ? season?.game?.name : 'N/A'}
                                                                    </td>
                                                                    <td className="td-number text-center">
                                                                        {season?.from ? moment(season.from).format('DD MMM YYYY') : 'N/A'}
                                                                    </td>
                                                                    <td className="td-number text-center">
                                                                        {season?.to ? moment(season.to).format('DD MMM YYYY') : 'N/A'}
                                                                    </td>
                                                                    <td className="text-center td-actions">
                                                                        <span className={` status ${season?.status ? `bg-success` : `bg-danger`
                                                                            }`}>
                                                                               <span className='lable lable-success'> {season?.status ? 'Active' : 'Inactive'}</span>
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions">
                                                                        <ul className="list-unstyled mb-0">
                                                                        {
                                                                            permissions && permissions.viewSeason && 
                                                                            <li className="d-inline-block align-top">
                                                                                <div className='trigger'>
                                                                                    <Button
                                                                                        className="btn-action btn-primary"
                                                                                        type="button"
                                                                                        onClick={() => setModal(2, season?._id)}
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </Button>
                                                                                    <div className='tooltip'>View</div>
                                                                                </div>
                                                                            </li>
                                                    }
                                                    {
                                                                            permissions && permissions.editSeason && 

                                                    
                                                                            <li className="d-inline-block align-top">
                                                                                <div className='trigger' >
                                                                                    <Button
                                                                                        className="btn-action btn-warning"
                                                                                        type="button"
                                                                                        // variant="danger"
                                                                                        onClick={() => setModal(3, season?._id)}
                                                                                    >
                                                                                        <i className="fas fa-edit"></i>
                                                                                    </Button>
                                                                                    <div className='tooltip'>Edit</div>
                                                                                </div>
                                                                            </li>
                                                    }

                                                    {
                                                                            permissions && permissions.deleteSeason && 
                                                                            <li className="d-inline-block align-top">
                                                                            <div className='trigger' >
                                                                                    <Button
                                                                                        className="btn-danger btn-action"
                                                                                        type="button"
                                                                                        // variant="danger"
                                                                                        onClick={() => deleteSeason(season._id)}
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
                                                                <div className="alert alert-info" role="alert">No Season Found</div>
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
                        modalType === 2 && season &&
                        <Modal className="modal-primary" onHide={() => setSeasonModal(!seasonModal)} show={seasonModal}>
                            <Modal.Header className="justify-content-center">
                                <Row>
                                    <div className="col-12">
                                        <h4 className="mb-0 mb-md-3 mt-0">
                                            {/* {modalType === 1 ? 'Add' : modalType === 2 ? 'Edit' : ''}  */}
                                            View Season
                                        </h4>
                                    </div>
                                </Row>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="text-left">
                                    <div className="d-flex name-email">
                                        <Form.Group className="flex-fill  d-flex align-items-center">
                                            <label className="label-font mr-2">Name: </label><span className="field-value   text-white">{season?.name ?  season?.name : 'N/A'}</span>
                                        </Form.Group>
                                    </div>

                                    <div className="d-flex name-email">
                                        <Form.Group className='d-flex align-items-center'>
                                            <label className="label-font mr-2" >Environment Type: </label><span className="field-value   text-white">{season.type ? EnvironmentTypeArray[`${season.type}`] : 'N/A'}</span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex name-email">
                                        <Form.Group className=' d-flex align-items-center'>
                                            <label className="label-font mr-2">Game Name: </label>
                                            <span className="field-value   text-white">
                                                {season.gameId ? 
                                                    <Form.Control 
                                                        disabled={modalType === 2}
                                                        className="form-select pr-3 mr-3" 
                                                        aria-label="Default select example"
                                                        value={season.gameId ? season.game.name : ''} 
                                                    />
                                                    : 
                                                    'N/A'
                                                }
                                            </span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex name-email">
                                        <Form.Group className='d-flex align-items-center'>
                                            <label className="label-font mr-2" >Color: </label><span className="field-value   text-white">{season.color ? season.color : 'N/A'}</span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex name-email">
                                        <Form.Group className=' d-flex align-items-center'>
                                            <label className="label-font mr-2">From: </label>
                                            <span className="field-value   text-white">
                                                {season.from ? 
                                                    <Form.Control
                                                        disabled={modalType === 2}
                                                        type="datetime-local"
                                                        name="createdAtTo-disable"
                                                        onChange={(e) => setSeasonDetail({...seasonDetail, from: e.target.value})}
                                                        value={moment(season.from).format('YYYY-MM-DDTHH:mm')}
                                                    />
                                                    : 'N/A'}
                                            </span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex name-email">
                                        <Form.Group className=' d-flex align-items-center'>
                                            <label className="label-font mr-2">To: </label>
                                            <span className="field-value   text-white">
                                                {season.to ? 
                                                    <Form.Control
                                                        disabled={modalType === 2}
                                                        type="datetime-local"
                                                        name="createdAtTo-disable"
                                                        onChange={(e) => setSeasonDetail({...seasonDetail, to: e.target.value})}
                                                        value={moment(season.to).format('YYYY-MM-DDTHH:mm')}
                                                    />
                                                    : 'N/A'}
                                            </span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex name-email">
                                        <Form.Group className=' d-flex align-items-center' >
                                            <label className="label-font mr-2">Status: </label><span className="field-value   text-white">{season?.status ? 'Active' : 'Inactive'}</span>
                                        </Form.Group>
                                    </div>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-warning"
                                    onClick={() => setSeasonModal(!seasonModal)}
                                >Close</Button>
                            </Modal.Footer>
                        </Modal>
                    }
                    {
                        ( modalType === 1 || modalType === 3 )  && season &&
                        <Modal className="modal-primary" onHide={() => setSeasonModal(!seasonModal)} show={seasonModal}>
                            <Modal.Header className="justify-content-center">
                                <Row>
                                    <div className="col-12">
                                        <h4 className="mb-0 mb-md-3 mt-0">
                                            {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''} 
                                                Season Information
                                        </h4>
                                    </div>
                                </Row>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="text-left">
                                    <Form.Group>
                                        <label>Name <span className="text-danger">*</span></label>
                                        <Form.Control
                                            placeholder="Enter Season Name"
                                            disabled={modalType === 2}
                                            type="text"
                                            name="name"
                                            onChange={(e) => setSeasonDetail( {...seasonDetail  ,name: e.target.value}) }
                                            value={seasonDetail.name}
                                            required
                                        />
                                        <span className={seasonMsgs.nameMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{seasonMsgs.nameMsg}</label>
                                        </span>
                                    </Form.Group>
                                    <Form.Group>
                                        <label>Color <span className="text-danger">*</span></label>
                                        <Form.Control
                                            disabled={modalType === 2}
                                            type="color"
                                            name="color"
                                            onChange={(e) => setSeasonDetail({ ...seasonDetail , color: e.target.value})}
                                            value={seasonDetail?.color}
                                            required
                                        />
                                        <span className={seasonMsgs?.colorMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{seasonMsgs?.colorMsg}</label>
                                        </span>
                                    </Form.Group>
                                    <Form.Group>
                                        <label> Game <span className="text-danger">*</span></label>
                                        <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                            value={seasonDetail.gameId ? seasonDetail.gameId : ''} onChange={(e) => setSeasonDetail({ ...seasonDetail, gameId: e.target.value})}
                                        >
                                            <option value={''}>Select Game</option>
                                            { games &&
                                                games.map((u,index)=>{
                                                    return( <option  key={index} value={u._id}>{u.name}</option>)
                                                })
                                            }    
                                        </Form.Control>
                                        <span className={ seasonMsgs?.gameIdMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{ seasonMsgs?.gameIdMsg }</label>
                                        </span>
                                    </Form.Group>
                                    <Form.Group>
                                        <label>Environment Type <span className="text-danger">*</span></label>
                                        <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                            value={seasonDetail.type} onChange={(e) => setSeasonDetail({ ...seasonDetail, type: e.target.value})}
                                        >
                                            <option value={''}>Select Environment Type:</option>
                                            {renderOption(EnvironmentTypeArray)}
                                        </Form.Control>
                                        {/* typeMsg */}
                                        <span className={ seasonMsgs?.typeMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{ seasonMsgs?.typeMsg }</label>
                                        </span>
                                    </Form.Group>
                                    <div>
                                        <Form.Group className="d-flex flex-column">
                                            <label>From <span className="text-danger">*</span></label>
                                            <DatePicker 
                                                disabled={ modalType === 1 ? seasonDetail.gameId ? false : true : false }
                                                onChange={(e)=>{ handleDateFrom(e) } } 
                                                value={ seasonDetail?.from  ? new Date(seasonDetail?.from) : null  } 
                                                // minDate={ new Date() } 
                                                maxDate={ seasonDetail?.to ? new Date(seasonDetail?.to) : new Date("2099-01-31") }
                                            />
                                            <span className={ seasonMsgs?.fromMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{ seasonMsgs?.fromMsg }</label>
                                            </span>
                                        </Form.Group>                                        
                                    </div>       
                                    <div>
                                        <Form.Group className="d-flex flex-column">
                                            <label>To <span className="text-danger">*</span></label>
                                            <DatePicker 
                                                disabled={ modalType === 1 ? seasonDetail.gameId ? false : true : false }
                                                onChange={(e)=>{ handleDateTo(e) } } 
                                                value={ seasonDetail?.to  ? new Date(seasonDetail?.to) : null  } 
                                                // minDate={ seasonDetail?.from ? new Date(seasonDetail?.from) : null } 
                                            />
                                            <span className={ seasonMsgs?.toMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{ seasonMsgs?.toMsg }</label>
                                            </span>                                        
                                        </Form.Group>
                                    </div>
                                    <Form.Group>
                                        <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                        <div className="d-flex">
                                            <label className="right-label-radio mb-2 mr-2">
                                                <div className='d-flex align-items-center'>
                                                <input name="status" type="radio" checked={seasonDetail.status} value={seasonDetail.status} onChange={ (e) => { setSeasonDetail({...seasonDetail , status: true }) } } />
                                                <span className="checkmark"></span>
                                                <span className='ml-1' onChange={(e) => {
                                                    setSeasonDetail({...seasonDetail , status: true })
                                                }} ><i />Active</span>
                                                </div>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div className='d-flex align-items-center'>
                                                <input name="status" type="radio" checked={!seasonDetail.status} value={!seasonDetail.status} onChange={ (e) => { setSeasonDetail({...seasonDetail , status: false }) } } />
                                                <span className="checkmark"></span>
                                                <span className='ml-1' onChange={(e) => {
                                                    setSeasonDetail({...seasonDetail , status: false })
                                                }} ><i />Inactive</span>
                                                </div>
                                            </label>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-warning"
                                    onClick={() => setSeasonModal(!seasonModal)}
                                >Close</Button>
                                {
                                    modalType === 3 ? '' :
                                        <Button className="btn btn-info" onClick={() => submit(season._id)} /* disabled={isLoader} */>Save</Button>
                                }
                                {
                                    modalType === 1 ? '' :
                                        <Button className="btn btn-info" onClick={() => submit(season._id)} /* disabled={isLoader} */>Update</Button>
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
    seasons : state.seasons ,
    getRoleRes: state.role.getRoleRes,
    error: state.error
})
export default connect(mapStateToProps , { beforeSeason ,getSeasons , createSeason , editSeason , deleteSeason , getAllGames , validateSeasonDate , validateSeasonDate_v2, getRole})(Season);














{/* <Button className="hover-effect btn btn-playgame logout desktop-logout-btn" variant="secondary" onClick={handleCloseOneActivate}>
Cancel
</Button>
<Button className="hover-effect btn btn-playgame logout desktop-logout-btn" variant="primary" onClick={()=>{ deleteEntryPoint();handleCloseOneActivate()}}>
Delete
</Button> */}