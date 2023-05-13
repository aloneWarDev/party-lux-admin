import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useParams } from "react-router"
import { useLocation } from 'react-router-dom'
import { getUserTournaments, getPlayerTournamentTransaction } from '../Tournament/Tournament.action';
import { getUserRefund } from '../UserManagement/UserManagement.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg'
import validator from 'validator';
import DatePicker from 'react-date-picker';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { resetPassword } from "views/Admin/Admin.action";
import { ENV } from "config/config";
var CryptoJS = require("crypto-js");


const PlayerParticipation = (props) => {
    let { userId } = useParams()
    const location = useLocation();

    //search
    const [searchPlayerGame , setSearchPlayerGame ] = useState('')
    const [searchPlayerTournament , setSearchPlayerTournament] = useState('')
    const [searchPlayerAmount , setSearchPlayerAmount ] = useState('')
    const [searchPlayerDate , setSearchPlayerDate ] = useState('')
    //tournament
    const [searchParticipateUsername , setSearchParticipateUsername ] = useState('')
    const [searchParticipateTournamentName , setSearchParticipateTournamentName] = useState('')
    const [searchParticipateRank , setSearchParticipateRank ] = useState('')
    const [searchParticipateDate , setSearchParticipateDate ] = useState('')
    //refund
    const [searchRefundUsername , setSearchRefundUsername] = useState('')
    const [searchRefundAmount , setSearchRefundAmount ] = useState('')

    const [loader, setLoader] = useState(true)
    const [data, setData] = useState(null)
    //General
    const [Page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)



    useEffect(() => {
        initialPath()
    }, [])

    useEffect(()=>{
        if(props.error){
            setLoader(false)
        }
    },[props.error])

    //helper
    const tournamentParticipationFilter = (filter)=>{
        if (searchParticipateUsername) {
            filter.username = searchParticipateUsername
            // localStorage.setItem('participateUsername', searchParticipateUsername)

        }
        if (searchParticipateTournamentName) {
            filter.tournamentName = searchParticipateTournamentName
            // localStorage.setItem('participateTournament', searchParticipateTournamentName)
        }
        if (searchParticipateRank) {
            filter.rank = searchParticipateRank
            // localStorage.setItem('participateRank', searchParticipateRank)

        }
        if (searchParticipateDate) {
            filter.date = new Date(searchParticipateDate)
            // localStorage.setItem('participateDate', searchParticipateDate)
        }
        return filter
    }
    //helper
    const PlayerParticipation = ( filter) => {
        if (searchPlayerGame){
            filter.gameName = searchPlayerGame
            // localStorage.setItem('playerGame', searchPlayerGame)

        }
        if (searchPlayerTournament){
            filter.tournamentName = searchPlayerTournament
            // localStorage.setItem('playerTournament', searchPlayerTournament)
        }
        if (searchPlayerAmount){
            filter.amount = searchPlayerAmount
            // localStorage.setItem('playerAmount', searchPlayerAmount)

        }
        if (searchPlayerDate) {
            filter.date = new Date(searchPlayerDate)
            // localStorage.setItem('playerDate', searchPlayerDate)
        }
        return filter
    }

    const refundFilter = (filter) => {
        if(searchRefundUsername){
            filter.username = searchRefundUsername
        }
        if(searchRefundAmount){
            filter.amount = searchRefundAmount
        }
        return filter
    }

    const initialPath = () =>{
        let qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        let filter = {}
        
        if (location.pathname.split('/')[1] === 'tournament-participation') {

            filter = tournamentParticipationFilter(filter)

            const callback = (data) => {
                
                setData(data?.userTournament)
                setPagination(data?.pagination)
                setLoader(false)
            }
           
            props.getUserTournaments( qs , userId , filter, callback)
        }
        //player-payment -> location
        if (location.pathname.split('/')[1] === 'player-participation-payment') {

            filter = PlayerParticipation(filter)

            const callback = (data) => {
                
                setData(data.transactions)
                setPagination(data.pagination)
                setLoader(false)
            }

            props.getPlayerTournamentTransaction(qs , userId , filter , callback)
        }
        if(location.pathname.split('/')[1] === 'refund'){
            filter = refundFilter(filter)

            const refundCallback = (data) => {
                setData(data?.claimedRefunds)
                setPagination(data.pagination)
                setLoader(false)
            }

            props.getUserRefund(qs , userId , filter , refundCallback )
            
        }
        
    }
    //
    const applyFilters = () => {

        let filter = {}
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })

        if( location.pathname.split('/')[1] === 'tournament-participation' ){
            filter = tournamentParticipationFilter(filter)
            
            setPage(1)
            
            const _callback = (data)=>{
                
                setData(data?.userTournament)
                setPagination(data?.pagination)
                setLoader(false)
            }
            props.getUserTournaments(qs, userId, filter , _callback)
            setLoader(true)

        }
        if(location.pathname.split('/')[1] === 'player-participation-payment'){
            filter = PlayerParticipation(filter)

            setPage(1)
            
            const callback = (data) =>{
                
                setData(data.transactions)
                setPagination(data.pagination)
                setLoader(false)
            }
            props.getPlayerTournamentTransaction(qs , userId , filter, callback)
            setLoader(true)
        }
        if(location.pathname.split('/')[1] === 'refund'){

            filter = refundFilter(filter)
            const refundCallback = (data) => {
                setData(data?.claimedRefunds)
                setPagination(data.pagination)
                setLoader(false)
            }

            props.getUserRefund(qs , userId , filter , refundCallback )
        }

        
    }

    //
    const onPageChange = async (page) => {
        let filter = {}
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        if( location.pathname.split('/')[1] === 'tournament-participation' ){

            filter = tournamentParticipationFilter(filter)

            const _callback = (data)=>{
                
                setData(data?.userTournament)
                setPagination(data?.pagination)
                setLoader(false)
            }
            props.getUserTournaments(qs, userId, filter , _callback)
            

        }
        if(location.pathname.split('/')[1] === 'player-participation-payment'){
            filter = PlayerParticipation(filter)
            const callback = (data) =>{
                
                setData(data.data?.userTournament)
                setPagination(data.data.pagination)
                setLoader(false)
            }
            
            props.getPlayerTournamentTransaction(userId, qs , filter , callback)
        }
        if(location.pathname.split('/')[1] === 'refund'){
            filter = refundFilter(filter)
            const refundCallback = (data) => {
                setData(data?.claimedRefunds)
                setPagination(data.pagination)
                setLoader(false)
            }

            props.getUserRefund(qs , userId , filter , refundCallback )
        }

    }
    const resetRefund = ( )=> {
        setSearchRefundUsername('')
        setSearchRefundAmount('')
        setLoader(true)

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        const refundCallback = (data) => {
            setData(data?.claimedRefunds)
            setLoader(false)
        }

        props.getUserRefund(qs , userId , {} , refundCallback )

    }

    const resetPlayerParticipate =() =>{
        setLoader(true)
        setSearchPlayerGame('')
        setSearchPlayerTournament('')
        setSearchPlayerAmount('')
        setSearchPlayerDate('')

        // localStorage.removeItem('playerGame')
        // localStorage.removeItem('playerTournament')
        // localStorage.removeItem('playerAmount')
        // localStorage.removeItem('playerDate')
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })

        const callback = (data) =>{
            
            setData(data.transactions)
            setPagination(data.pagination)
            setLoader(false)
        }
        props.getPlayerTournamentTransaction(qs , userId , {} , callback)



    }

    const reset =()=>{
        setLoader(true)
        setSearchParticipateUsername('')
        setSearchParticipateTournamentName('')
        setSearchParticipateRank('')
        setSearchParticipateDate('')

        // localStorage.removeItem('participateUsername')
        // localStorage.removeItem('participateTournament')
        // localStorage.removeItem('participateRank')
        // localStorage.removeItem('participateDate')

        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        
        const _callback = (data)=>{
            
            setData(data?.userTournament)
            setPagination(data?.pagination)
            setLoader(false)
        }
        props.getUserTournaments(qs, userId, {} , _callback)
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
                                            {
                                                location.pathname.split('/')[1] === 'tournament-participation' &&
                                                <>
                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <label style={{ color: 'white' }}>Username</label>
                                                            <Form.Control value={searchParticipateUsername} type="text" placeholder="John"   onChange={(e) => setSearchParticipateUsername(e.target.value)}  />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Game Tournament Name</label>
                                                        <Form.Control value={searchParticipateTournamentName} type="text" placeholder="Game Tournament Name" onChange={(e) => setSearchParticipateTournamentName(e.target.value)} />
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Rank</label>
                                                        <Form.Control value={searchParticipateRank} type="text" placeholder="Rank" onChange={(e) => setSearchParticipateRank(e.target.value)} />
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Date</label>
                                                        <Form.Group>
                                                            <DatePicker onChange={(e) => { setSearchParticipateDate(e) }} value={searchParticipateDate ? new Date(searchParticipateDate) : null}  maxDate={new Date()} minDate={new Date("1800-01-01")} />
                                                        </Form.Group>
                                                    </Col>


                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                            <div className="d-flex justify-content-between filter-btns-holder">
                                                                <Button className='m-0' variant="info" disabled={!searchParticipateUsername && !searchParticipateTournamentName && !searchParticipateRank && !searchParticipateDate } onClick={applyFilters}>Search</Button>
                                                                <Button className='m-0' variant="warning" hidden={!searchParticipateUsername && !searchParticipateTournamentName && !searchParticipateRank && !searchParticipateDate } onClick={reset}>Reset</Button>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </>
                                            }
                                            {
                                                location.pathname.split('/')[1] === 'player-participation-payment' && 
                                                <>
                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <label style={{ color: 'white' }}>Game Name</label>
                                                            <Form.Control value={searchPlayerGame} type="text" placeholder="John"  onChange={(e) => setSearchPlayerGame(e.target.value)}  />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Tournament Name</label>
                                                        <Form.Control value={searchPlayerTournament} type="text" placeholder="Tournament Name" onChange={(e) => setSearchPlayerTournament(e.target.value)}  />
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Amount</label>
                                                        <Form.Control value={searchPlayerAmount} type="text" placeholder="0.01" onChange={(e) => setSearchPlayerAmount(e.target.value)} />
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Date</label>
                                                        <Form.Group>
                                                            <DatePicker onChange={(e) => { setSearchPlayerDate(e) }} value={ searchPlayerDate ? new Date(searchPlayerDate) : null} maxDate={new Date()} minDate={new Date("1800-01-01")} />
                                                        </Form.Group>
                                                    </Col>


                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                            <div className="d-flex justify-content-between filter-btns-holder">
                                                                <Button className='m-0' variant="info" disabled={!searchPlayerGame && !searchPlayerTournament && !searchPlayerAmount && !searchPlayerDate } onClick={applyFilters}>Search</Button>
                                                                <Button className='m-0' variant="warning" hidden={!searchPlayerGame && !searchPlayerTournament && !searchPlayerAmount && !searchPlayerDate } onClick={resetPlayerParticipate}>Reset</Button>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>                                                    
                                                </>
                                            }
                                            {
                                                location.pathname.split('/')[1] === 'refund' && 
                                                <>
                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <label style={{ color: 'white' }}>Username</label>
                                                            <Form.Control value={searchRefundUsername} type="text" placeholder="John"  onChange={(e) => setSearchRefundUsername(e.target.value)}  />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <label style={{ color: 'white' }}>Amount</label>
                                                        <Form.Control value={searchRefundAmount} type="text" placeholder="0.01" onChange={(e) => setSearchRefundAmount(e.target.value)}  />
                                                    </Col>
                                                    <Col xl={3} sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                            <div className="d-flex justify-content-between filter-btns-holder">
                                                                <Button className='m-0' variant="info" disabled={!searchRefundUsername && !searchRefundAmount  } onClick={applyFilters}>Search</Button>
                                                                <Button className='m-0' variant="warning" hidden={!searchRefundUsername && !searchRefundAmount  } onClick={resetRefund}>Reset</Button>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>   
                                                </>
                                            }
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
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">{location.pathname.split('/')[1] === 'player-participation-payment' ? 'Participation Payment' : location.pathname.split('/')[1] === 'tournament-participation' && 'Tournament Participation'}</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        {
                                                            location.pathname.split('/')[1] === 'player-participation-payment' &&
                                                            <>
                                                                <th className="text-center td-start serial-col">#</th>
                                                                <th className="td-name">Game</th>
                                                                <th className="td-email">Tournament</th>
                                                                <th className="td-address">Amount</th>
                                                                <th className="td-created">Created At</th>
                                                            </>
                                                        }
                                                        {
                                                            location.pathname.split('/')[1] === 'tournament-participation' &&
                                                            <>
                                                                <th className="text-center td-start serial-col">#</th>
                                                                <th className="td-name">Username</th>
                                                                <th className="td-email">Tournament</th>
                                                                <th className="td-address">Rank</th>
                                                                <th className="td-created">Created At</th>
                                                            </>

                                                        }
                                                        {
                                                            location.pathname.split('/')[1] === 'refund' &&
                                                            <>
                                                                <th className="text-center td-start serial-col">#</th>
                                                                <th className="td-name">Username</th>
                                                                <th className="td-created">Amount</th>
                                                            </>  
                                                        }

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((user, index) => {
                                                                return (

                                                                    <tr key={index}>
                                                                        {
                                                                            location.pathname.split('/')[1] === 'player-participation-payment' &&
                                                                            <>
                                                                                <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                                <td className="td-name">
                                                                                    {user?.game.name ? user?.game.name : 'N/A'}
                                                                                </td>
                                                                                <td>
                                                                                    {user.tournament.name ? user.tournament.name : 'N/A'}
                                                                                </td>
                                                                                <td className="td-address td-address-in">
                                                                                    {user.amount > -1 ? user.amount : 'N/A'}
                                                                                </td>
                                                                                <td className="td-number">{user.date ? moment(user.date).format('DD MMM YYYY') : 'N/A'}</td>
                                                                            </>
                                                                        }
                                                                        {
                                                                            location.pathname.split('/')[1] === 'tournament-participation' &&
                                                                            <>
                                                                                <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>

                                                                                <td className="td-name">
                                                                                    {user.username ? user.username : 'N/A'}
                                                                                </td>
                                                                                <td>
                                                                                    {user.tournamentName ? user.tournamentName : 'N/A'}
                                                                                </td>
                                                                                <td className="td-address td-address-in">
                                                                                    {user.rank > -1 ? `${user.rank}th` : 'N/A'}
                                                                                </td>
                                                                                <td className="td-number">{user.date ? moment(user.date).format('DD MMM YYYY') : 'N/A'}</td>

                                                                            </>
                                                                        }
                                                                        {
                                                                            location.pathname.split('/')[1] === 'refund' && 
                                                                            <>
                                                                                <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                                <td className="td-name">
                                                                                    {user.username ? user.username : 'N/A'}
                                                                                </td>
                                                                                <td className="td-address td-address-in">
                                                                                    {user.amount > -1 ? user.amount : 'N/A'}
                                                                                </td>
                                                                            </>
                                                                        }

                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan={ location.pathname.split('/')[1] === 'refund' ? '3' : '5'} className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Item Found</div>
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

                        {/* 
                        {
                            modalType === 2 && user &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">

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
                                        <Button onClick={() => window.location.replace(`/admin/tournament-participation/${user._id}`)}>
                                            View Tournament Participation
                                        </Button>
                                        <Button onClick={() => window.location.replace(`/admin/participation-payment/${user._id}`)}>
                                            Participation Payment
                                        </Button>
                                        <Button>
                                            Refund
                                        </Button>
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

                                        <div className="d-flex name-email">
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
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        } */}

                    </Container>
            }



        </>
    )

}

const mapStateToProps = state => ({
    game: state.game,
    error: state.error,
})

export default connect(mapStateToProps, { getUserTournaments, getPlayerTournamentTransaction , getUserRefund })(PlayerParticipation)