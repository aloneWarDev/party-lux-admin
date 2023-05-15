import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeReward, getRewards, deleteReward } from './Rewards.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import userDefaultImg from '../../assets/img/placeholder.jpg'
var CryptoJS = require("crypto-js");

const Rewards = (props) =>{
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page , setPage] =useState(1)
    const [permissions, setPermissions] = useState({})
    //single news Filter Handle State here
    const [searchRewardId, setSearchRewardId] = useState(localStorage.getItem('RewardId') !== undefined && localStorage.getItem('RewardId') !== null? localStorage.getItem('RewardId') : '')
    const [searchName, setSearchName] = useState(localStorage.getItem('rewardName') !== undefined && localStorage.getItem('rewardName') !== null? localStorage.getItem('rewardName') : '')
    const [searchPrice, setSearchPrice] = useState(localStorage.getItem('Price') !== undefined && localStorage.getItem('Price') !== null? localStorage.getItem('Price') : '')

    

    useEffect(() => {
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
        const filter = {}
        if(searchRewardId !== undefined && searchRewardId !== null && searchRewardId !== '')
            filter.rewardId = searchRewardId
        if(searchName !== undefined && searchName !== null && searchName !== '')
            filter.rewardName = searchName
        if(searchPrice !== undefined && searchPrice !== null && searchPrice !== '')
            filter.price = searchPrice    
        props.getRewards('', filter)
        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
    }, [])

    useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

    useEffect(() => {
        if (props.rewards.getRewardsAuth) {
            
            let { rewards } = props.rewards
            setData(rewards.reward)
            setPagination(rewards.pagination)
            props.beforeReward()
            setLoader(false)
        }
    }, [props.rewards.getRewardsAuth])

    useEffect(() =>{
        if(data){
            setLoader(false)
        }
    }, [data])

    useEffect(()=>{
        if(props.rewards.delRewardAuth){
            let filtered = data.filter((item) => {
                if (item._id !== props.rewards.reward.rewardId)
                    return item
            })
            setData(filtered)
            const filter = {}
            if(searchRewardId && searchRewardId !== ''){
                filter.rewardId = searchRewardId
                localStorage.setItem('RewardId', searchRewardId)
            }
            if(searchName && searchName !== ''){
                filter.rewardName = searchName
                localStorage.setItem('rewardName', searchName)
            }
            if(searchPrice && searchPrice !== ''){
                filter.price = searchPrice
                localStorage.setItem('Price',searchPrice)
            }
            const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
            props.getRewards(qs, filter)
            setLoader(false)
            props.beforeReward()
        }
    }, [props.rewards.delRewardAuth])

    const deleteReward = (rewardId) => {
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
                props.deleteReward(rewardId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if(searchRewardId && searchRewardId !== ''){
            filter.rewardId = searchRewardId
            localStorage.setItem('RewardId', searchRewardId)
        }
        if(searchName && searchName !== ''){
            filter.rewardName = searchName
            localStorage.setItem('rewardName', searchName)
        }
        if(searchPrice && searchPrice !== ''){
            filter.price = searchPrice
            localStorage.setItem('Price',searchPrice)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page:page , limit : 10 })
        props.getRewards(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchRewardId && searchRewardId !== ''){
            filter.rewardId = searchRewardId
            localStorage.setItem('RewardId', searchRewardId)
        }
        if(searchName && searchName !== ''){
            filter.rewardName = searchName
            localStorage.setItem('rewardName', searchName)
        }
        if(searchPrice && searchPrice !== ''){
            filter.price = searchPrice
            localStorage.setItem('Price',searchPrice)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        
        props.getRewards(qs, filter , true)
        setLoader(true)
    }

    const reset = () =>{
        setSearchRewardId('')
        setSearchName('')
        setSearchPrice('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getRewards(qs)
        setLoader(true)
        localStorage.removeItem('RewardId')
        localStorage.removeItem('rewardName')
        localStorage.removeItem('Price')
        localStorage.removeItem('showNewsFilter')


    }
    const formattedAddress = (address) => {
        return `${address.slice(0, 9)}...${address.slice(-5)}`
    }
    return(
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
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Reward ID</label>
                                                    <Form.Control value={searchRewardId} type="text" placeholder="Reward ID" onChange={(e) => setSearchRewardId(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Name</label>
                                                    <Form.Control type="text" value ={searchName} placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>                                                    
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>price</label>
                                                    <Form.Control value={searchPrice} type="text" placeholder="e.g , 0.01" onChange={(e) => setSearchPrice(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchRewardId && !searchName && !searchPrice } onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchRewardId && !searchName && !searchPrice } onClick={reset}>Reset</Button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                         
                        {/* <Row>
                            <Col>
                                <span style={{color : 'white'}}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                    <div className='d-flex justify-content-end mb-2 pr-3'>
                                    <span  style={{ color: 'black',fontWeight:'bold' }}>{`Total : ${pagination?.total}`}</span>
                                    </div>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Rewards</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addReward && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-reward`)}>
                                                        Add Reward
                                                    </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy rewards">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='text-center '>Reward Id</th>
                                                        <th className="text-center ">Image</th>
                                                        <th className='text-center '>Name</th>
                                                        <th className='text-center '>Price</th>
                                                        <th className='text-center '>Description</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-center ">
                                                                            {item.rewardId}
                                                                        </td>
                                                                        <td className="table-img-center"> 
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="User Image" src={item.image ? item.image : userDefaultImg} onError={(e)=> {e.target.onerror = null ; e.target.src = userDefaultImg}} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            {item.rewardName}
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            {`${item.price} ETH`}
                                                                        </td>
                                                                        <td className="text-center " dangerouslySetInnerHTML={{__html: formattedAddress(item.rewardDescription)}}></td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.editReward && 
                                                                                        <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-reward/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                        </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteReward &&
                                                                                        <li className="d-inline-block align-top">
                                                                                           <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteReward(item._id)}
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
                                                                <td colSpan="6" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Rewards Found</div>
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
            }
        </>
    )
}
const mapStateToProps = state => ({
    rewards: state.rewards,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps , {beforeReward, getRewards, deleteReward,getRole})(Rewards);