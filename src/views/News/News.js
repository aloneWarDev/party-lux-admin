import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeNew, getNews, deleteNew } from './News.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import ShowMoreText from "react-show-more-text";
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import userDefaultImg from '../../assets/img/placeholder.jpg'
var CryptoJS = require("crypto-js");

const News = (props) => {

    const [permissions, setPermissions] = useState({})
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    //single news Filter Handle State here
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')


    useEffect(() => {
        window.scroll(0, 0)
        // const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
        reset()
        const filter = {}
        // if (searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
        //     filter.title = searchTitle
        // if (searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
        //     filter.status = searchStatus === 'true' ? true : false
        props.getNews('', filter)

        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)

    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])

    // useEffect(()=>{
    //     if (Object.keys(props.getRoleRes).length > 0) {
    //         setPermissions(props.getRoleRes.role)
    //     }
    // },[props.getRoleRes])

    useEffect(() => {
        if (props.news.getNewsAuth) {
            let { news } = props.news
            setData(news.news)
            setPagination(news.pagination)
            props.beforeNew()
            setLoader(false)
        }
    }, [props.news.getNewsAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.news.delNewAuth) {
            // let filtered = data.filter((item) => {
            //     if (item._id !== props.news.new.newsId)
            //         return item
            // })
            const filter = {}
            if (searchTitle && searchTitle !== '') {
                filter.title = searchTitle
                localStorage.setItem('newsTitle', searchTitle)
            }
            if (searchStatus !== '') {
                filter.status = searchStatus === 'true' ? true : false
                localStorage.setItem('newsStatus', searchStatus)
            }
            // setData(filtered)
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getNews(qs, filter)
            setLoader(false)
            props.beforeNew()
        }
    }, [props.news.delNewAuth])

    const deleteNew = (newsId) => {
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
                props.deleteNew(newsId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('newsTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('newsStatus', searchStatus)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getNews(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.title = searchTitle
            localStorage.setItem('newsTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('newsStatus', searchStatus)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getNews(qs, filter, true)
        setLoader(true)
    }

    const reset = () => {
        setSearchTitle('')
        setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getNews(qs)
        setLoader(true)
        localStorage.removeItem('newsTitle')
        localStorage.removeItem('newsStatus')
        localStorage.removeItem('showNewsFilter')


    }
    const truncateText = (address) => {
        return `${address.slice(0, 29)}...`
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
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className='align-items-baseline'>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Title</label>
                                                    <Form.Control type="text" value={searchTitle} placeholder="Title" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'white' }}>Status</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>

                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" className='m-0' disabled={!searchTitle && !searchStatus} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" className='m-0' hidden={!searchTitle && !searchStatus} onClick={reset}>Reset</Button>
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
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4"className='mb-2 mb-sm-0'>News</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addNews &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right mb-0"
                                                    onClick={() => props.history.push(`/add-news`)}>
                                                    Add News
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy news">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className="text-center">Image</th>
                                                        <th className=' text-center'>Title</th>
                                                        <th className='text-center '>Status</th>
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
                                                                        <td className="table-img-center">
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="User Image" src={item.thumbnail ? item.thumbnail : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            {
                                                                                (item.title).length >= 29 ? 
                                                                                    truncateText(item.title)
                                                                                : 
                                                                                item.title
                                                                            }
                                                                            
                                                                        </td>
                                                                        <td className="text-center ">
                                                                            <span className={` status ${item.status ? `bg-success` : `bg-danger`
                                                                                }`}>
                                                                                <span className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.viewNews &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                // variant="info"
                                                                                                onClick={() => props.history.push(`/view-news/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.editNews &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-news/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>

                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteNews &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteNew(item._id)}
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
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No News Found</div>
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
    news: state.news,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps, { beforeNew, getNews, deleteNew, getRole })(News);