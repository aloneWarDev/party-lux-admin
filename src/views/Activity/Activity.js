import { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { beforeActivity, getActivities } from './Activity.action';
import { Button , Card, Table, Container, Row, Col, Form ,Accordion } from "react-bootstrap";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import userDefaultImg from '../../assets/img/placeholder.jpg'
import { Link } from "react-router-dom";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { ENV } from '../../config/config';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import DatePicker from 'react-date-picker';


const Activity = (props) => {

    const [activities, setActivities] = useState([])
    const [moreCheck, setMoreCheck] = useState(true)
    const [page , setPage] = useState(1)

    //
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState({})
    const [searchUsername, setSearchUsername] = useState(localStorage.getItem('activityUsername') !== undefined && localStorage.getItem('activityUsername') !== null ? localStorage.getItem('activityUsername') : '')
    const [searchActivityType, setSearchActivityType] = useState(localStorage.getItem('ActivityType') !== undefined && localStorage.getItem('ActivityType') !== null ? localStorage.getItem('ActivityType') : '')
    const [searchAtFrom, setSearchCreatedAtFrom] = useState(localStorage.getItem('activityCreatedAtFrom') !== undefined && localStorage.getItem('activityCreatedAtFrom') !== null ? new Date(localStorage.getItem('activityCreatedAtFrom')) : null)
    const [searchAtTo, setSearchCreatedAtTo] = useState(localStorage.getItem('activityCreatedAtTo') !== undefined && localStorage.getItem('activityCreatedAtTo') !== null ? new Date(localStorage.getItem('activityCreatedAtTo')) : null)

    const [activityTypeArray, setActivityTypeArray] = useState({ "1": 'login', "2": 'add', "3": 'edit' , "4":'delete' , "5":'search'})
    //Date filter
    const [minOfSearchAtTo, setMinOfSearchAtTo] = useState("")
    const [maxOfSearchAtTo, setMaxOfSearchAtTo] = useState("")

    const [minOfSearchAtFrom, setMinOfSearchAtFrom] = useState("")
    const [maxOfSearchAtFrom, setMaxOfSearchAtFrom] = useState("")
    const [isOpenCalenderFrom, setIsOpenCalenderFrom] = useState(false)
    const [isOpenCalenderAtTo, setIsOpenCalenderAtTo] = useState(false)

    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }
    
    
    useEffect(() => {
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({page:1 , limit:10})
        let filter = {}

        if (searchUsername !== undefined && searchUsername !== null && searchUsername !== '')     
            filter.username = searchUsername
        if (searchActivityType !== undefined && searchActivityType !== null && searchActivityType !== '')
            filter.type = searchActivityType
        if (searchAtFrom !== undefined && searchAtFrom !== null && searchAtFrom !== '')
            filter.createdAtFrom = searchAtFrom
        if (searchAtTo !== undefined && searchAtTo !== null && searchAtTo !== '')
            filter.createdAtTo = searchAtTo
        
        props.getActivities('' , filter)
    }, [])

    useEffect(() => {
        if (props.activity.activityAuth) {
            const { activity, pagination } = props.activity.activity

            console.log("activity: ",activity)
            if(activity.length){
                if(pagination?.page === 1){
                    setActivities(activity)
                    console.log("setMoreCheck: ",moreCheck)
                    setMoreCheck(true)
                }else{
                    setActivities([ ...activities, ...activity])
                }

            }
            else {
                // console.log("moreCheck in empty dependency [] ",moreCheck)
                
                setMoreCheck(false)
            }
            console.log("page : ",page)
            console.log("pagination: ",pagination?.page)
            setPagination( pagination )
            setPage(pagination?.page + 1 )
            setLoader(false)
            props.beforeActivity()
            // console.log("moreCheck---> ",moreCheck)
        }  
    }, [props.activity.activityAuth])

    useEffect(()=>{
        if(props.activity.searchActivityAuth){
            const { activity, pagination } = props.activity.activity
            if(activity.length){
                setActivities(activity)
            }
            else {
                console.log("moreCheck searchActivityAuth in empty dependency [] ",moreCheck)
                if(activity.length <= 0){
                    setActivities(activity)
                }

                setMoreCheck(false)
            }
            setPagination( pagination )
            setPage( pagination?.page ? pagination?.page + 1 : 1)
            props.beforeActivity()
            setLoader(false)


        }

    },[props.activity.searchActivityAuth])
    
    const fetchData = () => {
        let qs
        let filter = {}

        if (searchUsername !== undefined && searchUsername !== null && searchUsername !== '')     
            filter.username = searchUsername
        if (searchActivityType !== undefined && searchActivityType !== null && searchActivityType !== '')
            filter.type = searchActivityType
        if (searchAtFrom !== undefined && searchAtFrom !== null && searchAtFrom !== '')
            filter.createdAtFrom = searchAtFrom
        if (searchAtTo !== undefined && searchAtTo !== null && searchAtTo !== '')
            filter.createdAtTo = searchAtTo
        
        console.log("page in fetchData: ",page)
        qs = ENV.objectToQueryString({ page  , limit: 10})
        if(page <= pagination?.pages){
            props.getActivities(qs , filter )
        }else{
            setMoreCheck(false)
        }     
    }

    // useEffect(() => {
    //     if (activities) {
    //         setLoader(false)
    //     }
    // }, [activities])

    const applyFilters = () => {
        const filter = {}
        if (searchUsername) {
            filter.username = searchUsername
            localStorage.setItem('activityUsername', searchUsername)
        }
        if (searchActivityType) {
            console.log("searchActivityType: ",searchActivityType)
            filter.type = searchActivityType
            localStorage.setItem('ActivityType', searchActivityType)
        }
        if (searchAtFrom) {
            filter.createdAtFrom = new Date(searchAtFrom)
            localStorage.setItem('activityCreatedAtFrom', searchAtFrom)
        }
        if (searchAtTo) {
            filter.createdAtTo = new Date(searchAtTo) //
            localStorage.setItem('activityCreatedAtTo', searchAtTo)
        }

        const qs = ENV.objectToQueryString({page: 1, limit: 10 })
        setMoreCheck(true)
        props.getActivities(qs , filter, true) //(true is for search)
        setLoader(true)
    }

    const reset =()=>{
        setLoader(true)
        setSearchCreatedAtFrom('')
        setSearchCreatedAtTo('')

        setSearchUsername('')
        setSearchActivityType('')

        const qs = ENV.objectToQueryString({page: 1, limit: 10 })
        props.getActivities(qs)

        localStorage.removeItem('activityUsername')
        localStorage.removeItem('ActivityType')
        localStorage.removeItem('activityCreatedAtFrom')
        localStorage.removeItem('activityCreatedAtTo')
    }

    const handleDate = (e, state, num = '') => {
        // alert('in DateHandler')
        // console.log(state,num)
        // console.log(e)

        console.log(e)
        if (e) {
            // alert(e)
            // setIsOpenCalenderFrom(true)
            if (num === 1) { // From

                //minimum prop of searchAtTo
                setMinOfSearchAtFrom("")
                setMaxOfSearchAtFrom("")
                setMinOfSearchAtTo(e)
                setMaxOfSearchAtTo("")
                setIsOpenCalenderFrom(false)

            }
            if (num === 2) { //To

                //minimum prop of searchAtTo
                setMinOfSearchAtFrom("")
                setMaxOfSearchAtFrom("")
                setMinOfSearchAtTo("")
                setMaxOfSearchAtTo("")
                setIsOpenCalenderAtTo(false)
            }
            state(e)
        }
        else {
            state('')
            setMinOfSearchAtTo('')
            setIsOpenCalenderFrom(false)
        }
    }

    const style = {
        height: 96,
        border: "1px solid #dedede",
        margin: 5,
        padding: 6,
        borderRadius:4
      };
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className='pb-3'>
                            <Col sm={12}>
                                <Card className='filter-card'>
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
                                                    <label style={{ color: 'white' }}>Username</label>
                                                    <Form.Control value={searchUsername  ? searchUsername : ''} type="text" placeholder="Username" onChange={(e) => setSearchUsername(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Activity Type</label>
                                                    <Form.Control as="select" className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value={searchActivityType ? searchActivityType : ''} onChange={(e) => setSearchActivityType(e.target.value)}
                                                    >
                                                        <option value={''}>Select Activity Type</option>
                                                        {renderOption(activityTypeArray)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>


                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Created At From</label>
                                                <Form.Group>
                                                    <DatePicker onChange={(e) => { handleDate(e, setSearchCreatedAtFrom, 1) }} closeCalendar={isOpenCalenderFrom} value={searchAtFrom ? searchAtFrom : null} maxDate={searchAtTo ? new Date(searchAtTo) : new Date()} minDate={minOfSearchAtTo ? new Date(minOfSearchAtTo) : new Date("1800-01-01")} />
                                                    {/* <Form.Control value = {searchAtFrom ? searchAtFrom : ''} type="date" placeholder="mm/dd/yyyy"  onChange={(e) =>{ setSearchCreatedAtFrom(e.target.value) }}/> */}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Created At To</label>
                                                <Form.Group>
                                                    <DatePicker onChange={(e) => { handleDate(e, setSearchCreatedAtTo, 2) }} closeCalendar={isOpenCalenderAtTo} value={searchAtTo ? searchAtTo : null} maxDate={new Date()} minDate={searchAtFrom ? new Date(searchAtFrom) : new Date("1800-01-01")} />
                                                    {/* <Form.Control value = {searchAtTo  ? searchAtTo : ''} type="date" placeholder="mm/dd/yyyy"  onChange={(e) =>{ setSearchCreatedAtTo(e.target.value)}}/> */}
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchUsername && !searchActivityType && !searchAtFrom && !searchAtTo} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchUsername && !searchActivityType && !searchAtFrom && !searchAtTo} onClick={reset}>Reset</Button>
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
                            <Card>
                                    {/* title */}
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between" style={{color : 'white'}}>
                                            <Card.Title as="h4">Activities</Card.Title>
                                        </div>
                                    </Card.Header>
                                   <Card.Body>
                                        <div id="scrollableDiv" style={{ height: 300 ,overflow: "auto"}}>
                                            <InfiniteScroll
                                                dataLength={activities.length} //This is important field to render the next data
                                                next={fetchData}
                                                hasMore={moreCheck}
                                                style={{ height: "auto" ,overflow: "auto !important" }}
                                                loader={<h4 className="text-white">Loading...</h4>}
                                                endMessage={
                                                    <p style={{ textAlign: 'center' , paddingTop: '8px' }}>
                                                    <b style={{ color: "white" }}>You have seen it all</b>
                                                    </p>
                                                }
                                                scrollableTarget="scrollableDiv"
                                            >
                                                {
                                                    activities && activities.length > 0 && activities.map((item , index)=>{
                                                        return(
                                                            <>
                                                                <div  style={style} key={index} className="row m-b-25">
                                                                    <div className="col">
                                                                        {/* <h6 className="m-b-5" style={{ color: 'white' }}>{item?.admin?.name}</h6> */}
                                                                        <p className="active-paragraph m-b-0" style={{ color: 'white' }}>{ item.activityOnModule ? item.activityOnModule.toUpperCase() : ''} is {activityTypeArray[`${item.type}`]} by {item?.admin?.name}</p>
                                                                        <p className="active-paragraph m-b-0" style={{ color: 'white' }}>{ item?.createdAt ? moment(item?.createdAt).fromNow() : '' }</p>
                                                                    </div>
                                                                </div>    
                                                            </>
                                                        )
                                                    })
                                                }
                                            </InfiniteScroll>
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
    activity: state.activity,
    error: state.error
});

export default connect(mapStateToProps, { beforeActivity, getActivities })(Activity)
