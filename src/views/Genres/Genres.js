import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeGenre, getGenres, addGenre, getGenre, updateGenre, deleteGenre } from './Genre.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg'
import validator from 'validator';
import Swal from 'sweetalert2';
var CryptoJS = require("crypto-js");

const Genre = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [Page, setPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')

    const [modalType, setModalType] = useState(0)
    const [genreModal, setGenreModal] = useState(false)
    const [title, setTitle] = useState('')
    const [icon, setIcon] = useState('')
    const [isImageChange, setIsImageChange] = useState(false)
    const [genreImage, setGenreImage] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [status, setStatus] = useState(false)

    const [titleMsg, setTitleMsg] = useState('')
    const [iconMsg, setIconMsg] = useState('')
    const [genreId, setGenreId] = useState()

    // set modal type
    const setModal = (type = 1, genreId = '') => {
        setModalType(type)
        setGenreModal(true)
        setEmpty()
        if (genreId) {
            setLoader(true)
            setGenreId(genreId)
            props.beforeGenre()
            props.getGenre(genreId)
        }
    }

    const onCloseHandler = () => {
        setGenreModal(!genreModal)
    }

    const fileSelectHandler = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if(files[0].type.split('/')[0] === 'image'){
                setIconMsg('')
                setIsImageChange(true)
                setPreviewImage(reader.result);                
            }
            else{
                setIconMsg('Invalid File Format')
                setPreviewImage('')
            }

        };
        reader.readAsDataURL(files[0]);
    };


    useEffect(() => {
        reset()
        window.scroll(0, 0)
        const filter = {}
        if (searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.title = searchTitle
        if (searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false

        props.getGenres('', filter, true)
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


    useEffect(() => {
        if (props.genre.updateGenreAuth) {
            const { genre } = props.genre
            
            let filteredGenres = data.filter((elem) => {
                if (elem._id !== genre._id) {
                    return elem
                }
            })
            
            setData([genre, ...filteredGenres])
            setLoader(false)
            props.beforeGenre()
        }
    }, [props.genre.updateGenreAuth])

    useEffect(() => {
        if (props.genre.getGenreAuth) {
            let { genre } = props.genre
            
            setTitle(genre.name)
            setPreviewImage(genre.icon)
            setGenreImage(genre.icon)
            setStatus(genre.status)
            props.beforeGenre()
            setLoader(false)
        }
    }, [props.genre.getGenreAuth])
    useEffect(() => {
        if (props.genre.getGenresAuth) {
            let { genres, pagination } = props.genre.genres
            setData(genres)
            setPagination(pagination)
            setLoader(false)
            props.beforeGenre()
        }
    }, [props.genre.getGenresAuth])

    useEffect(() => {
        if (props.genre.deleteGenreAuth) {
            reset()
            props.beforeGenre()
        }
    }, [props.genre.deleteGenreAuth])

    useEffect(() => {
        if (props.genre.upsertGenreAuth) {
            const { genre } = props
            // 
            props.getGenres('', {}, false)
            //getGenres
            // setPagination({...pagination , total: pagination?.total + 1 })
            if( Object.keys(genre.genre).length !== 0 ){
                setData([genre.genre, ...data])
            }

        }
    }, [props.genre.upsertGenreAuth])

    useEffect(() => {
        if (data && data.length > 0) {
            setLoader(false)
        }
    }, [data])

    // when an error is received
    useEffect(() => {
        if (props.error.error){
            setLoader(false)
        }
    }, [props.error.error])


    const onPageChange = async (page) => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.name = searchTitle
            localStorage.setItem('genreTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('genreStatus', searchStatus)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getGenres(qs, filter)
    }

    const applyFilters = () => {
        const filter = {}
        if (searchTitle && searchTitle !== '') {
            filter.title = searchTitle
            localStorage.setItem('genreTitle', searchTitle)
        }
        if (searchStatus !== '') {
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('genreStatus', searchStatus)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getGenres(qs, filter, true, true) //( true is for search)
        setLoader(true)
    }

    const reset = () => {
        setLoader(true)
        setSearchTitle('')
        setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getGenres(qs)
        localStorage.removeItem('genreTitle')
        localStorage.removeItem('genreStatus')
    }

    const submit = (e) => {
        let check = true

        if( validator.isEmpty( genreImage ? genreImage+"" : '') ){
            setIconMsg('Image is Required.')
            check = false
        }
        if (validator.isEmpty(title.trim())) {
            setTitleMsg('Title is Required.')
            check = false
        }
        if (check) {
            setLoader(true)
            let payload = { name: title, status }

            if (genreImage) {
                payload.icon = genreImage
            }

            if (modalType === 1) { // add modal type
                props.beforeGenre()
                props.addGenre(payload)
                setLoader(true)
            }
            else if (modalType === 3) { // update modal type
                payload._id = genreId
                if (!isImageChange) {
                    delete payload.icon
                }
                props.updateGenre(payload);
            }


            // reset()
            // setEmpty()
            setGenreModal(!genreModal)
        }
        else {
            // $('#modal-primary').scrollTop(0, 0)
        }
    }

    const setEmpty = () => {
        setTitle('')
        setStatus(true)
        setIcon('')
        setPreviewImage('');
        setGenreImage('');
        setIsImageChange(false)
    }

    const deleteGenre = (genreId) => {
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
                props.deleteGenre(genreId)
            }
        })


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
                                                    <label style={{ color: 'black' }}>Title</label>
                                                    <Form.Control type="text" value={searchTitle} placeholder="John" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Status</label>
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
                                            <span style={{ color: 'black', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-sm-flex align-items-center justify-content-between">
                                            <Card.Title as="h4" className='mb-2 mb-sm-0'>Genres</Card.Title>
                                            {
                                                permissions && permissions.addGenres &&
                                                <Button
                                                    onClick={() => setModal(1)}
                                                    variant="info"
                                                    className="float-sm-right mb-0">
                                                    Add Genre
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy faq-table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center td-start serial-col">#</th>
                                                        <th className=" td-description">Title</th>
                                                        <th className=" text-center td-status">Status</th>
                                                        { permissions && (permissions.editGenres || permissions.deleteGenres) ? <th className="td-actions">Actions</th>  : ''}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-description">
                                                                            {
                                                                            item.name
                                                                                ?
                                                                                item.name.length >= 29 ?
                                                                                    `${item.name.slice(0, 29)}...`
                                                                                    :
                                                                                    item.name
                                                                                :
                                                                                "N/A"
                                                                            }
                                                                        </td>
                                                                        <td className="text-center td-status">
                                                                            <span className={` status ${item.status ? `bg-success` : `bg-danger`
                                                                                }`}>
                                                                                <span className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</span>
                                                                            </span>
                                                                        </td>
                                                                        { permissions && (permissions.editGenres || permissions.deleteGenres) ?
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.editGenres &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => setModal(3, item._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteGenres &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteGenre(item._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Delete</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                        :""
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No GENRE Found</div>
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
                                                    total={pagination.pages} //) total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {
                            genreModal &&
                            <Modal className="modal-primary" id="admin-modal" onHide={() => { onCloseHandler() }} show={genreModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add New' : modalType === 2 ? 'View' : 'Edit'} Genre
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body className="modal-body">
                                    <Form>
                                        <Form.Group>
                                            <label>Genre Icon<span className="text-danger"> *</span></label>
                                            <div className='mb-4 user-view-image'>
                                                {(previewImage !== undefined || previewImage !== '') && <img src={previewImage ? previewImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />}
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <Form.Control
                                                    className='text-white'
                                                    onChange={async (e) => {
                                                        fileSelectHandler(e);
                                                        if( e.target.files[0].type.split('/')[0] === 'image'){
                                                            setGenreImage(e.target.files[0])
                                                        }
                                                        else{
                                                            setGenreImage('')
                                                        }
                                                        
                                                    }}
                                                    // placeholder="Title"
                                                    type="file"
                                                    accept="image/*"
                                                ></Form.Control>
                                            </div>
                                            <span className={ iconMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{ iconMsg }</label>
                                            </span>
                                            {/* iconMsg */}
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Title <span className="text-danger">*</span></label>
                                            <Form.Control
                                                placeholder="Enter title"
                                                disabled={modalType === 2}
                                                type="text"
                                                name="name"
                                                onChange={(e) =>{setTitleMsg(''); setTitle(e.target.value); } }
                                                value={title}
                                                maxLength={30}
                                                required
                                            />
                                            <span className={titleMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{titleMsg}</label>
                                            </span>

                                        </Form.Group>

                                        <Form.Group >
                                            <label className='d-block'>Status</label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div>
                                                    <input disabled={modalType === 2} name="status" type="checkbox" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2 d-inline-block' onChange={(e) => setStatus(true)} ><i />Active</span>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <span className="checkmark"></span>
                                                <div>
                                                    <input disabled={modalType === 2} name="status" type="checkbox" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <span className='ml-2' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                            </label>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-warning" onClick={() => { onCloseHandler() }}>Close</Button>
                                    {
                                        modalType === 2 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
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
    genre: state.genre,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeGenre, getGenres, addGenre, getGenre, getRole, updateGenre, deleteGenre })(Genre);