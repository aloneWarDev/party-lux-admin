import React, { useState, useEffect } from "react"
import { connect } from 'react-redux';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import FullPageLoader from "components/FullPageLoader/FullPageLoader"
import { beforeMatchStats, getAllMatchStats } from './MatchStats.action'
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { ENV } from "config/config";
import "bootstrap/js/src/collapse.js";
import Swal from 'sweetalert2';

const MatchStats = (props) => {
    const [loader, setLoader] = useState(true)
    //Search
    const [searchTournamentName, setSearchTournamentName] = useState('')
    const [searchGameName, setSearchGameName] = useState('')
    //
    const [pagination, setPagination] = useState(null)
    const [Page, setPage] = useState(1)
    const [matchesRecord, setMatchesRecord] = useState(null)

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
        let filter = {};
        if (searchGameName !== undefined && searchGameName !== null && searchGameName !== '')
            filter.gameName = searchGameName
        if (searchTournamentName !== undefined && searchTournamentName !== null && searchTournamentName !== '')
            filter.tournamentName = searchTournamentName


        // if (searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
        //     filter.status = searchStatus === 'true' ? true : false
        props.beforeMatchStats()
        props.getAllMatchStats(qs, filter)


    }, [])

    useEffect(() => {
        if (props.matchStats.getMatchesStatsAuth) {
            const { matchesStats } = props.matchStats
            
            setMatchesRecord(matchesStats.matchesDetails)
            setPagination(matchesStats.pagination)
            props.beforeMatchStats()
            setLoader(false)
        }
    }, [props.matchStats.getMatchesStatsAuth])
    const setModal = (type = 0, matchId = null) => {

    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchGameName && searchGameName !== '') {
            filter.gameName = searchGameName
            localStorage.setItem('matchStatsGameName', searchGameName)
        }
        if (searchTournamentName && searchTournamentName !== '') {
            filter.tournamentName = searchTournamentName
            localStorage.setItem('matchStatsTourName', searchTournamentName)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getAllMatchStats(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchGameName && searchGameName !== '') {
            filter.gameName = searchGameName
            localStorage.setItem('matchStatsGameName', searchGameName)
        }
        if (searchTournamentName && searchTournamentName !== '') {
            filter.tournamentName = searchTournamentName
            localStorage.setItem('matchStatsTourName', searchTournamentName)
        }
        // if (searchStatus !== '') {
        //     filter.status = searchStatus === 'true' ? true : false
        //     localStorage.setItem('newsStatus', searchStatus)
        // }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getAllMatchStats(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchTournamentName('')
        setSearchGameName('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getAllMatchStats(qs, {})
        setLoader(true)
        localStorage.removeItem('matchStatsGameName')
        localStorage.removeItem('matchStatsTourName')
    }





    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <>
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
                                                        <label style={{ color: 'white' }}>Game Name</label>
                                                        <Form.Control type="text" value={searchGameName} placeholder="Game Name" onChange={(e) => setSearchGameName(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col xl={3} sm={6}>
                                                    <Form.Group>
                                                        <label style={{ color: 'white' }}>Tournament Name</label>
                                                        <Form.Control type="text" value={searchTournamentName} placeholder="Tournament Name" onChange={(e) => setSearchTournamentName(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                                {/* <Col xl={3} sm={6}>
                                                    <label style={{ color: 'white' }}>Status</label>
                                                    <Form.Group>
                                                        <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
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
                                                            <Button variant="info" className='m-0' disabled={!searchGameName && !searchTournamentName} onClick={applyFilters}>Search</Button>
                                                            <Button variant="warning" className='m-0' hidden={!searchGameName && !searchTournamentName} onClick={reset}>Reset</Button>
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
                                            <div className="d-block d-md-flex align-items-center justify-content-between">
                                                <Card.Title as="h4">Match Stats</Card.Title>
                                                {/* <p className="card-category">List of FAQs</p> */}
                                                {/* {
                                                    permissions && permissions.addNews && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-news`)}>
                                                        Add News
                                                    </Button>
                                                } */}
                                            </div>
                                        </Card.Header>
                                        <Card.Body className="table-full-width">
                                            <div className="table-responsive">
                                                <Table className="table-bigboy news">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center serial-col">#</th>
                                                            <th className=' text-center tournament-name'>Game Name</th>
                                                            <th className=' text-center tournament-name'>Tournament Name</th>
                                                            <th className=' text-center tournament-name'>Admin Prize</th>
                                                            <th className=' text-center tournament-name'>Developer Prize</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            matchesRecord && matchesRecord.length ?
                                                                matchesRecord.map((match, mIndex) => {
                                                                    return (
                                                                        <>
                                                                            <tr
                                                                                data-toggle="collapse"
                                                                                data-target={`.multi-collapse1${mIndex}`}
                                                                                aria-controls={`aaa${mIndex}`}
                                                                                className="matchBar collapsed"
                                                                            >
                                                                                <td className="text-center ">{mIndex + 1}</td>
                                                                                <td className="text-center ">{match?.game?.name}</td>
                                                                                <td className="text-center ">{match?.tournament?.name}</td>
                                                                                <td className="text-center ">{match?.adminPrize}</td>
                                                                                <td className="text-center ">{match?.developerPrize}</td>
                                                                                {/* <td className="text-center">{1}</td>
                                                                                <td className="text-center ">{'Games'}</td>
                                                                                <td className="text-center ">{'Tournament'}</td> */}
                                                                            </tr>
                                                                            <tr className={`collapse multi-collapse1${mIndex}`} id={`aaa${mIndex}`}>
                                                                                <td colSpan={3}>
                                                                                    <Table className="matchDetails">
                                                                                        <thead>
                                                                                             <tr>
                                                                                                <th className="text-center serial-col p-3">#</th>
                                                                                                <th className="text-center p-3">userName</th>
                                                                                                <th className=' text-center p-3'>matchScore</th>
                                                                                                <th className=' text-center p-3'>loyalty Points</th>
                                                                                                <th className=' text-center p-3'>Prize</th>
                                                                                                <th className='text-center p-3'>Result</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                           
                                                                                            {
                                                                                                match.matchplayer && match.matchplayer.length ?
                                                                                                    match.matchplayer.map((player, pIndex) => {
                                                                                                        return (
                                                                                                            <tr key={pIndex}>
                                                                                                                <td className="text-center p-3">{pIndex + 1}</td>
                                                                                                                <td className="text-center p-3">{player.username}</td>
                                                                                                                <td className="text-center p-3">{player.matchScore}</td>
                                                                                                                <td className="text-center p-3">{player.loyaltyPoints ?? 'N/A'}</td>
                                                                                                                <td className="text-center p-3">{player.busd ??'N/A'}</td>
                                                                                                                <td className="text-center ">
                                                                                                                    <span className={` status ${player.position === 1 ? `bg-success` : `bg-danger`
                                                                                                                        }`}>
                                                                                                                        <span className='lable lable-success'> {player.position === 1 ? 'Winner' : 'Looser'}</span>
                                                                                                                    </span>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    })
                                                                                                    :
                                                                                                    <>
                                                                                                        <tr>
                                                                                                            <td colSpan="5" className="text-center">
                                                                                                                <div className="alert alert-info" role="alert">No Players Record Found</div>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                            }
                                                                                        </tbody>
                                                                                    </Table>
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })
                                                                :
                                                                <tr>
                                                                    <td colSpan="3" className="text-center">
                                                                        <div className="alert alert-info" role="alert">No Match Stats Found</div>
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
                        </Container>
                    </>
            }
        </>
    )
}

const mapStateToProps = state => ({
    matchStats: state.matchStats,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
})

export default connect(mapStateToProps, { beforeMatchStats, getAllMatchStats })(MatchStats);