import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { Link, useParams } from "react-router-dom";
import { beforeTheme, getThemes, deleteTheme, getGameThemes, deleteGameTheme } from './Theme.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");

const Theme = (props) => {
    //gameTheme
    const { gameId } = useParams()
    let pathname = window.location.pathname
    // 
    //
    const [permissions, setPermissions] = useState({})
    const [data, setData] = useState([])
    const [isGame, setIsGame] = useState(false)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('themeTitle') !== undefined && localStorage.getItem('themeTitle') !== null ? localStorage.getItem('themeTitle') : '')
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('themeStatus') !== undefined && localStorage.getItem('themeStatus') !== null ? localStorage.getItem('themeStatus') : '')



    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({})
        const filter = { page: currentPage, limit: 10 }
        if (searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.name = searchTitle
        if (searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false
        if (pathname === `/admin/game-theme/${gameId}`) {
            filter.gameId = gameId
            setIsGame(true)
            props.getGameThemes(qs, filter)
        } else {
            props.getThemes(qs, filter)
        }
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
        }
        props.getRole(role)

    }, [])
    //getThemesAuth
    useEffect(() => {
        if (props.themes.getThemesAuth) {
            let { themes } = props.themes
            setData(themes?.data)
            
            setLoader(false)
            setPagination(themes.pagination)
            props.beforeTheme()
        }
    }, [props.themes.getThemesAuth])
    //getGameThemesAuth
    useEffect(() => {
        if (props.themes.getGameThemesAuth) {
            setLoader(false)
            let { gameThemes } = props.themes
            
            // alert("are you in gameThemes")
            setData(gameThemes.gameThemes)
            setPagination(gameThemes.pagination)

            props.beforeTheme()

        }
    }, [props.themes.getGameThemesAuth])


    // useEffect(() => {
    //     if (data) {
    //         setLoader(false)
    //     }
    // }, [data])

    //delGameThemeAuth
    useEffect(() => {
        if (props.themes.delGameThemeAuth) {
            
            const qs = ENV.objectToQueryString({})
            props.getGameThemes(qs, { gameId: gameId })
            props.beforeTheme()
        }
    }, [props.themes.delGameThemeAuth])
    //delThemeAuth
    useEffect(() => {
        if (props.themes.delThemeAuth) {
            // 
            // let filtered = data.filter((item) => {
            //     if (item._id !== props.themes.theme.themeId)
            //         return item
            // })

            
            const filter = { page: currentPage, limit: 10 }
            if (searchTitle && searchTitle !== '') {
                filter.name = searchTitle
                localStorage.setItem('themeTitle', searchTitle)
            }
            if (searchStatus !== '') {
                filter.status = searchStatus === 'true' ? true : false
                localStorage.setItem('themeStatus', searchStatus)
            }

            // setData(filtered)
            const qs = ENV.objectToQueryString({})
            
            props.getThemes(qs, filter, false)
            // setLoader(false)
            props.beforeTheme()
        }
    }, [props.themes.delThemeAuth])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    const delTheme = (themeId) => {
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
                
                if (gameId) {
                    
                    props.deleteGameTheme(themeId)
                }
                else {
                    props.deleteTheme(themeId)
                }

            }
        })
    }

    const onPageChange = async (page) => {
        
        const filter = { page: page, limit: 10 }
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('themeTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('themeStatus', searchStatus)
        }
        setCurrentPage(page)
        setLoader(true)
        
        const qs = ENV.objectToQueryString({})
        props.getThemes(qs, filter)
    }

    const applyFilters = async () => {
        const filter = { page: 1, limit: 10 }
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('themeTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('themeStatus', searchStatus)
        }
        setCurrentPage(1)
        const qs = ENV.objectToQueryString({})
        await props.beforeTheme()
        if (isGame) {
            filter.gameId = gameId
            props.getGameThemes(qs, filter)
        }
        else {
            props.getThemes(qs, filter, true)
        }

        setLoader(true)
    }

    const reset = () => {
        setSearchTitle('')
        setSearchStatus('')
        setCurrentPage(1)
        const qs = ENV.objectToQueryString({})
        if (isGame) {
            props.getGameThemes(qs, { gameId: gameId }) //gameId is necesssary
        } else {
            props.getThemes(qs, { page: 1, limit: 10 })
        }
        setLoader(true)
        localStorage.removeItem('themeTitle')
        localStorage.removeItem('themeStatus')
        localStorage.removeItem('showthemesFilter')


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
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Title</label>
                                                    <Form.Control value={searchTitle} type="text" placeholder="Title" onChange={(e) => setSearchTitle(e.target.value)} />
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
                                                        <Button className='m-0' variant="info" disabled={!searchTitle && !searchStatus} onClick={applyFilters}>Search</Button>
                                                        <Button className='m-0' variant="warning" hidden={!searchTitle && !searchStatus} onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">{isGame ? "Game" : ''} Themes </Card.Title>
                                            {!isGame ?
                                                permissions && permissions.addTheme &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => props.history.push(`/add-theme`)}>
                                                    Add Theme
                                                </Button>
                                                : null
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy themes">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='text-center td-actions'>Title</th>
                                                        <th className='text-center td-actions'>Status</th>
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
                                                                        <td className="text-center td-actions">
                                                                            {item.name}
                                                                        </td>
                                                                        <td className="text-center td-actions">
                                                                            <span className={`status ${item.status ? `bg-success` : `bg-danger`
                                                                                }`}>
                                                                                <span className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.viewTheme &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                // variant="info"
                                                                                                onClick={() => props.history.push(`/view-theme/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.editTheme &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => { isGame ? window.location.replace(`/admin/edit-gametheme/${item._id}`) : props.history.push(`/edit-theme/${item._id}`) }}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }

                                                                                {
                                                                                    permissions && permissions.deleteTheme &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => delTheme(item._id)}
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
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Theme Found</div>
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
                                                    current={currentPage > pagination.pages ? pagination.pages : currentPage} // current active page
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
    themes: state.themes,
    getRoleRes: state.role.getRoleRes,
    error: state.error
});

export default connect(mapStateToProps, { beforeTheme, getThemes, deleteTheme, getGameThemes, deleteGameTheme, getRole })(Theme)