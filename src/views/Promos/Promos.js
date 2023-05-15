import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import {    beforePromo, getPromos, deletePromo} from './Promos.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const Promos = (props) =>{
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page , setPage] =useState(1)   
    const [permissions, setPermissions] = useState({}) 
    const [searchPromoCode, setSearchPromoCode] = useState(localStorage.getItem('promoCode') !== undefined && localStorage.getItem('promoCode') !== null? localStorage.getItem('promoCode') : '')
    const [searchPromoName, setSearchPromoName] = useState(localStorage.getItem('promoName') !== undefined && localStorage.getItem('promoName') !== null? localStorage.getItem('promoName') : '')
    const [searchDiscountType, setSearchDiscountType] = useState(localStorage.getItem('discountType') !== undefined && localStorage.getItem('discountType') !== null? localStorage.getItem('discountType') : '')

    useEffect(() => {
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
        const filter = {}
        if(searchPromoCode !== undefined && searchPromoCode !== null && searchPromoCode !== '')
            filter.code = searchPromoCode
        if(searchPromoName !== undefined && searchPromoName !== null && searchPromoName !== '')
            filter.name = searchPromoName
        if(searchDiscountType !== undefined && searchDiscountType !== null && searchDiscountType !== '')
            filter.discountType = searchDiscountType    
        props.getPromos('', filter)
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
        if (props.promos.getPromosAuth) {
          
            // 
            let { promos } = props.promos
            setData(promos.promos)
            setPagination(promos.pagination)
            props.beforePromo()
            setLoader(false)
        }
    }, [props.promos.getPromosAuth])

    useEffect(() =>{
        if(data){
            setLoader(false)
        }
    }, [data])

    useEffect(()=>{
        if(props.promos.delpromoAuth){
            let filtered = data.filter((item) => {
                if (item._id !== props.promos.promo._id)
                    return item
            })
            setData(filtered)
            const filter = {}
            if(searchPromoCode && searchPromoCode !== ''){
                filter.code = searchPromoCode
                localStorage.setItem('promoCode', searchPromoCode)
            }
            if(searchPromoName && searchPromoName !== ''){
                filter.name = searchPromoName
                localStorage.setItem('promoName', searchPromoName)
            }
            if(searchDiscountType && searchDiscountType !== ''){
                filter.discountType = searchDiscountType
                localStorage.setItem('discountType',searchDiscountType)
            }
            const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
            props.getPromos(qs, filter)
            setLoader(false)
            props.beforePromo()
        }
    }, [props.promos.delpromoAuth])

    const deletePromo = (promoId) => {
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
                props.deletePromo(promoId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if(searchPromoCode && searchPromoCode !== ''){
            filter.code = searchPromoCode
            localStorage.setItem('promoCode', searchPromoCode)
        }
        if(searchPromoName && searchPromoName !== ''){
            filter.name = searchPromoName
            localStorage.setItem('promoName', searchPromoName)
        }
        if(searchDiscountType && searchDiscountType !== ''){
            filter.discountType = searchDiscountType
            localStorage.setItem('discountType',searchDiscountType)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page:page , limit : 10 })
        props.getPromos(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchPromoCode && searchPromoCode !== ''){
            filter.code = searchPromoCode
            localStorage.setItem('promoCode', searchPromoCode)
        }
        if(searchPromoName && searchPromoName !== ''){
            filter.name = searchPromoName
            localStorage.setItem('promoName', searchPromoName)
        }
        if(searchDiscountType && searchDiscountType !== ''){
            filter.discountType = searchDiscountType
            localStorage.setItem('discountType',searchDiscountType)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        
        props.getPromos(qs, filter , true)
        setLoader(true)
    }

    const reset = () =>{
        setSearchPromoCode('')
        setSearchPromoName('')
        setSearchDiscountType('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getPromos(qs)
        setLoader(true)
        localStorage.removeItem('promoCode')
        localStorage.removeItem('promoName')
        localStorage.removeItem('discountType')


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
                                                    <label style={{ color: 'black' }}>Promo Code</label>
                                                    <Form.Control value={searchPromoCode} type="text" placeholder="Promo Code" onChange={(e) => setSearchPromoCode(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Promo Name</label>
                                                    <Form.Control type="text" value ={searchPromoName} placeholder="Name" onChange={(e) => setSearchPromoName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>                                                    
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'black' }}>Discount Type</label>
                                                    <Form.Control value={searchDiscountType} type="text" placeholder="Discount Type" onChange={(e) => setSearchDiscountType(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchPromoCode && !searchPromoName && !searchDiscountType } onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchPromoCode && !searchPromoName && !searchDiscountType } onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">Promos</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addPromos && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-promo`)}>
                                                        Add Promo
                                                    </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy promos">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='text-center'>Promo Code</th>
                                                        <th className='text-center'>Promo Name</th>
                                                        <th className='text-center'>Description</th>
                                                        <th className='text-center'>Discount Type</th>
                                                        <th className='text-center'>Discount Value</th>
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
                                                                        <td className="text-center">
                                                                            {item.code}
                                                                        </td>
                                                                        
                                                                        <td className="text-center">
                                                                            {item.name}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {item.description}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {item.discountType}
                                                                        </td>
                                                                        <td className="text-center" >
                                                                            {item.discountValue}
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.editPromos && 
                                                                                        <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-promo/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                        </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deletePromos &&
                                                                                        <li className="d-inline-block align-top">
                                                                                           <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deletePromo(item._id)}
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
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Promos Found</div>
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
  
    promos:state.promos,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps , {beforePromo, getPromos, deletePromo, getRole})(Promos);