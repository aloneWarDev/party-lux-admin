import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCategory, createFaqCategory, getListOfCategories, updateFaqCategory, deleteFaqCategory } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import validator from 'validator';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
var CryptoJS = require("crypto-js");

// react-bootstrap components
import {
    Button,
    Card,
    Form,
    Table,
    Container,
    Row,
    Col,
    OverlayTrigger,
    Tooltip,
    Modal
} from "react-bootstrap";


const FaqCategories = (props) => {

    const dispatch = useDispatch()
    const [permissions, setPermissions] = useState({})
    const [tableData, setTableData] = useState([])
    const [pagination, setPagination] = useState(null)
    const [faqCategoryModal, setFaqCategoryModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [faqCategory, setFaqCategory] = useState(null)
    const [loader, setLoader] = useState(true)
    const [Page, setPage] = useState(1)
    const [searchName, setSearchName] = useState('')
    const [name, setName] = useState('');
    // const [formValid, setFormValid] = useState(false);
    const [nameMsg, setNameMsg] = useState('');



    useEffect(() => {
        // const qs = ENV.objectToQueryString({page: 1, limit: 10 })
        const filter = {}
        reset()
        // if (searchName !== undefined && searchName !== null && searchName !== '')
        //     filter.name = searchName

        window.scroll(0, 0)
        setLoader(true)
        props.getListOfCategories('', filter)
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
        if (props.faqs.getCategoriesAuth) {

            const { category, pagination } = props.faqs.categories
            setTableData(category)
            setPagination(pagination)

            setLoader(false)
            props.beforeCategory()
        }
    }, [props.faqs.getCategoriesAuth])

    useEffect(() => {
        if (props.faqs.upsertCategoryAuth) {

            setLoader(true)
            let filtered = tableData.filter((item) => {
                if (item._id != props.faqs.category?._id) {
                    return item
                }
            })
            // 
            setTableData([...filtered, props.faqs.category])
            const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
            props.getListOfCategories(qs, {})
            setLoader(false)
            props.beforeCategory()
        }
    }, [props.faqs.upsertCategoryAuth])


    useEffect(() => {
        if (props.faqs.delCategoryAuth) {
            // let filtered = games.filter((item) => {
            //     if (item._id !== props.game.gameId)
            //         return item
            // })
            // setGames(filtered)
            // 
            const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
            window.scroll(0, 0)
            props.getListOfCategories(qs)
            props.beforeCategory()
        }
    }, [props.faqs.delCategoryAuth])

    // useEffect(() => {
    //     if (tableData) {
    //         setLoader(false)
    //         if (window.location.search) {
    //             const urlParams = new URLSearchParams(window.location.search);
    //             setModal(3, urlParams.get('CategoryId'))
    //         }
    //     }
    // }, [tableData])

    // when an error is received
    useEffect(() => {
        if (props.error.error) {
            setLoader(false)
        }
    }, [props.error.error])

    const submit = (Id) => {
        let check = true

        if (validator.isEmpty(name.trim())) {
            setNameMsg('Name field is Required.')
            check = false
        } else setNameMsg('')

        if (check) {
            // setFormValid(false)
            let payload = { name: name.trim() }
            if (modalType === 3) { // add modal type
                dispatch(updateFaqCategory(payload, Id));
            }
            // 
            if (modalType === 1) { // add modal type
                dispatch(createFaqCategory(payload));
            }
            setFaqCategoryModal(!faqCategoryModal)
        }
        // else{
        //     // $('#modal-primary').scrollTop(0, 0)
        //     setFormValid(true)
        // }

    }


    // set modal type
    const setModal = (type = 0, catId = null) => {
        setFaqCategoryModal(!faqCategoryModal)
        setModalType(type)
        setLoader(false)
        // add FaqCategory
        if (type === 1) {
            let category = {
                name: ''
            }
            setNameMsg('')
            setFaqCategory(category)
            setName('')
        }
        // edit or view FaqCategory
        else if ((type === 2 || type === 3) && catId) {
            getFaqCategory(catId)
        }

    }

    const getFaqCategory = async (catId) => {
        setLoader(true)
        const faqCategoryData = await tableData.find((elem) => String(elem._id) === String(catId))
        if (faqCategoryData) {
            setFaqCategory({ ...faqCategoryData })
            setName(faqCategoryData.name)
        }
        setLoader(false)
    }

    const onPageChange = async (page) => {
        // 
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('categoryName', searchName)

        }
        setLoader(true)
        setPage(page)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getListOfCategories(qs, filter, true)
    }

    const deleteCategory = (catId) => {
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
                await props.deleteFaqCategory(catId)
                setLoader(false)
            }
        })
    }

    const applyFilters = () => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
            localStorage.setItem('categoryName', searchName)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getListOfCategories(qs, filter, true) // (true is for search)
        setLoader(true)
    }

    const reset = () => {

        setSearchName('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getListOfCategories(qs, {})
        setLoader(true)
        localStorage.removeItem('categoryName')
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
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <label style={{ color: 'black' }}>Name</label>
                                                <Form.Control value={searchName} type="text" placeholder="Name" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchName} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchName} onClick={reset}>Reset</Button>
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
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Faq Categories</Card.Title>
                                            {
                                                permissions && permissions.addCategoryFaq &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add Faq Category
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy faq-categories">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='text-center'>Name</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        tableData && tableData.length ?
                                                            tableData.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name text-center">
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
                                                                            {/* {item.name} */}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.viewCategoryFaqs &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger'>
                                                                                            <Button
                                                                                                className="btn-action btn-primary"
                                                                                                type="button"
                                                                                                // variant="info"
                                                                                                onClick={() => setModal(2, item._id)}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>View</div>
                                                                                        </div>

                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.editCategoryFaq &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => setModal(3, item._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                            <div className='tooltip'>Edit</div>
                                                                                        </div>
                                                                                    </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteCategoryFaq &&
                                                                                    <li className="d-inline-block align-top">
                                                                                        <div className='trigger' >
                                                                                            <Button
                                                                                                className="btn-danger btn-action"
                                                                                                type="button"
                                                                                                // variant="danger"
                                                                                                onClick={() => { deleteCategory(item._id) }}
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
                                                                    <div className="alert alert-info" role="alert">No Faq Categories Found</div>
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
                        {
                            modalType === 2 && faqCategory &&
                            <Modal className="modal-primary" onHide={() => { alert(faqCategoryModal); setFaqCategoryModal(!faqCategoryModal) }} show={faqCategoryModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                View Faq Category
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill  d-flex align-items-center">
                                                <label className="label-font mr-2">Name: </label><span className="field-value text-white">{name}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setFaqCategoryModal(!faqCategoryModal)}
                                    >Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {
                            (modalType === 1 || modalType === 3) && faqCategory &&
                            <Modal className="modal-primary" onHide={() => setFaqCategoryModal(!faqCategoryModal)} show={faqCategoryModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''}
                                                Faq Categories
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label>Name <span className="text-danger">*</span></label>
                                            <Form.Control
                                                placeholder="Enter Faq Category Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="name"
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                                maxLength={50}
                                                required
                                            />
                                            <span className={nameMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{nameMsg}</label>
                                            </span>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setFaqCategoryModal(!faqCategoryModal)}
                                    >Close</Button>
                                    {
                                        modalType === 3 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(faqCategory._id)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(faqCategory._id)} /* disabled={isLoader} */>Update</Button>
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
    faqs: state.faqs,
    error: state.error,
    getRoleRes: state.role.getRoleRes,
});


export default connect(mapStateToProps, { beforeCategory, createFaqCategory, updateFaqCategory, deleteFaqCategory, getListOfCategories, getRole })(FaqCategories)
