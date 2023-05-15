import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeContact, getContacts, updateContact } from './Contacts.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const Contacts = (props) => {
    const [contacts, setContacts] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [contactModel, setContactModel] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [contact, setContact] = useState(null)
    const [loader, setLoader] = useState(true)
    const [title, setTitle] = useState('Select Status')
    const [permissions, setPermissions] = useState({})
    const [searchName, setSearchName] = useState(localStorage.getItem('contactName') !== undefined && localStorage.getItem('contactName') !== null? localStorage.getItem('contactName') : '')
    const [searchEmail, setSearchEmail] = useState(localStorage.getItem('contactEmail') !== undefined && localStorage.getItem('contactEmail') !== null? localStorage.getItem('contactEmail') : '')
    const [searchSubject, setSearchSubject] = useState(localStorage.getItem('contactSubject') !== undefined && localStorage.getItem('contactSubject') !== null? localStorage.getItem('contactSubject') : '')
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('contactStatus') !== undefined && localStorage.getItem('contactStatus') !== null? localStorage.getItem('contactStatus') : '')

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = {}
        if(searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName
        if(searchEmail !== undefined && searchEmail !== null && searchEmail !== '')
            filter.email = searchEmail
        if(searchSubject !== undefined && searchSubject !== null && searchSubject !== '')
            filter.subject = searchSubject
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus

        props.getContacts(qs,filter)
        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        // props.getRole(role)
        setLoader(false)
    }, [])

    useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

    useEffect(() => {
        if (props.contacts.contactsAuth) {
            // 
            const { contact, pagination } = props.contacts.contacts
            setContacts(contact)
            setPagination(pagination)
            props.beforeContact()
        }
    }, [props.contacts.contactsAuth])

    useEffect(() => {
        if (contacts) {
            setLoader(false)
        }
    }, [contacts])

    useEffect(async () => {
        if (props.contacts.updateAuth) {
            setLoader(true)
            const contactData = await contacts.find((elem) => String(elem._id) === String(contact._id))
            contactData.status = contact.status
            if (contactData)
                setContact({ ...contactData })
            setLoader(false)
            props.beforeContact()
        }
    }, [props.contacts.updateAuth])

    // set modal type
    const setModal = (type = 0, contactId = null) => {
        setContactModel(!contactModel)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && contactId)
            getContract(contactId)
    }

    const getContract = async (contactId) => {
        setLoader(true)
        const contactData = await contacts.find((elem) => String(elem._id) === String(contactId))
        if (contactData)
            setContact({ ...contactData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {}
        if(searchName){
            filter.name = searchName
            localStorage.setItem('contactName', searchName)

        }
        if(searchEmail){
            filter.email = searchEmail
            localStorage.setItem('contactEmail', searchName)

        }
        if(searchSubject){
            filter.subject = searchSubject
            localStorage.setItem('contactSubject', searchSubject)

        }
        if(searchStatus){
            filter.status = searchStatus
            localStorage.setItem('contactStatus', searchStatus)
        }

        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        props.getContacts(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchName){
            filter.name = searchName
            localStorage.setItem('contactName', searchName)

        }
        if(searchEmail){
            filter.email = searchEmail
            localStorage.setItem('contactEmail', searchEmail)

        }
        if(searchSubject){
            filter.subject = searchSubject
            localStorage.setItem('contactSubject', searchSubject)
        }
        if(searchStatus){
            filter.status = searchStatus
            localStorage.setItem('contactStatus', searchStatus)
        }
        
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getContacts(qs, filter)
        setLoader(true)
    }

    const reset = () =>{
        setSearchSubject('')
        setSearchStatus('')
        setSearchEmail('')
        setSearchName('')
        
        localStorage.removeItem('contactName')
        localStorage.removeItem('contactEmail')
        localStorage.removeItem('contactSubject')
        localStorage.removeItem('contactStatus')

        props.getContacts()
        setLoader(true)
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
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Name</label>
                                                    <Form.Control value = {searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{color : 'white'}}>Email</label>
                                                <Form.Control value = {searchEmail} type="text" placeholder="john@mail.com" onChange={(e) => setSearchEmail(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Subject</label>
                                                    <Form.Control value = {searchSubject} type="text" placeholder="Subject" onChange={(e) => setSearchSubject(e.target.value)}/* onChange={} onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{color : 'white'}}>Status</label>
                                                <select value={searchStatus} onChange={(e) =>  setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={0}>In Progress</option>
                                                    <option value={1}>Pending</option>
                                                    <option value={2}>Closed</option>

                                                </select>
                                            </Col>
                                            
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">Contacts</Card.Title>
                                            {/* <p className="card-user">List Of Contacts</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Subject</th>
                                                        <th className="text-description">Message</th>
                                                        <th>Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        contacts && contacts.length ? contacts.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td>
                                                                        {item.name}
                                                                    </td>
                                                                    <td>
                                                                        {item.email}
                                                                    </td>
                                                                    <td>
                                                                        {item.subject}
                                                                    </td>
                                                                    <td>
                                                                        {item.message}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`text-white badge p-1 ${item.status === 1 ? `badge-danger` : item.status === 0 ? `badge-warning` : item.status === 2 ? `badge-success` : ``}`}>
                                                                            {item.status === 0 ? 'In Progress' : item.status === 1 ? 'Pending' : item.status === 2 ? 'Closed' : 'N/A'}                                                                        
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions">
                                                                        <ul className="list-unstyled mb-0">
                                                                            <li className="d-inline-block align-top">
                                                                            <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">View </Tooltip>)} >
                                                                                <Button
                                                                                    className="btn-action btn-warning"
                                                                                    type="button"
                                                                                    variant="info"
                                                                                    onClick={() => setModal(2, item._id)}
                                                                                >
                                                                                    <i className="fas fa-eye"></i>
                                                                                </Button>
                                                                            </OverlayTrigger>
                                                                            </li>
                                                                            
                                                                            {
                                                                                permissions && permissions.editContact &&
                                                                                    <li className="d-inline-block align-top">
                                                                                    <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Edit</Tooltip>)} >
                                                                                        <Button
                                                                                            className="btn-action btn-warning"
                                                                                            type="button"
                                                                                            variant="success"
                                                                                            onClick={() => {
                                                                                                setModal(3, item._id);
                                                                                                setTitle("Select Status")
                                                                                            }
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-edit"></i>
                                                                                        </Button>
                                                                                    </OverlayTrigger>
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
                                                                    <div className="alert alert-info" role="alert">No Contact Found</div>
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
                                                    current={pagination.page} // current active page
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

                        {
                            modalType > 0 && contact &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setContactModel(!contactModel)} show={contactModel}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 3 ? 'Edit' : ''} Contact
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Name:</strong>
                                                    <span>{contact.name}</span>
                                                </div>
                                                {/* <label className="label-font">Name: </label><span className="ml-2">{contact.name}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Email:</strong>
                                                    <span>{contact.email}</span>
                                                </div>
                                                {/* <label className="label-font">Email: </label><span className="ml-2">{contact.email}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Subject:</strong>
                                                    <span>{contact.subject}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Subject:</strong>
                                                    <span>{contact.subject}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex align-items-center">
                                                    <strong className="mr-2">Status:</strong>
                                                    <span className={`ml-2 badge ${contact.status === 1 && modalType === 2 ? `badge-danger p-1` : contact.status === 0 && modalType === 2 ? `badge-warning p-1` : contact.status === 2 && modalType === 2 ? `badge-success p-1` :``}`}>
                                                    {modalType === 2 ?
                                                        (contact.status === 0 ? 'In Progress' : contact.status === 1 ? 'Pending' : contact.status === 2 ? 'Closed' : 'N/A')
                                                        : <InputGroup className="float-right">
                                                            <DropdownButton
                                                                variant="outline-secondary"
                                                                title={title}
                                                                id="status-dropDown"
                                                                className="status-dropDown"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    setTitle("In Progress")
                                                                    setContact({ ...contact, status: 0 })
                                                                }}>In Progress</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Pending")
                                                                        setContact({ ...contact, status: 1 })
                                                                    }
                                                                }>Pending</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Closed")
                                                                        setContact({ ...contact, status: 2 })
                                                                    }
                                                                }>Closed</Dropdown.Item>
                                                            </DropdownButton>
                                                        </InputGroup>
                                                    }</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Message:</strong>
                                                    <span>{contact.message}</span>
                                                </div>
                                            </Form.Group>
                                       </div>
                                        {/* <div className="d-flex name-email">
                                            <Form.Group>
                                                <label className="label-font mb-0">Status:</label><span className={`ml-2 d-inline-block align-top text-white ${contact.status === 1 && modalType === 2 ? `bg-danger p-1` : contact.status === 0 && modalType === 2 ? `bg-warning p-1` : contact.status === 2 && modalType === 2 ? `bg-success p-1` :``}`}>
                                                    {modalType === 2 ?
                                                        (contact.status === 0 ? 'In Progress' : contact.status === 1 ? 'Pending' : contact.status === 2 ? 'Closed' : 'N/A')
                                                        : <InputGroup className="float-right">
                                                            <DropdownButton
                                                                variant="outline-secondary"
                                                                title={title}
                                                                id="status-dropDown"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    setTitle("In Progress")
                                                                    setContact({ ...contact, status: 0 })
                                                                }}>In Progress</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Pending")
                                                                        setContact({ ...contact, status: 1 })
                                                                    }
                                                                }>Pending</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Closed")
                                                                        setContact({ ...contact, status: 2 })
                                                                    }
                                                                }>Closed</Dropdown.Item>
                                                            </DropdownButton>
                                                        </InputGroup>
                                                    }</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex">
                                            <Form.Group>
                                                <label className="label-font">Message: </label><span className="ml-2">{contact.message}</span>
                                            </Form.Group>
                                        </div>*/}
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-danger" onClick={() => setContactModel(!contactModel)}>Close</Button>
                                        {modalType === 3 ?
                                            <Button className="btn btn-info"
                                                onClick={() => {
                                                    setContactModel(!contactModel);
                                                    let formData = new FormData()
                                                    for (const key in contact)
                                                        formData.append(key, contact[key])
                                                    props.updateContact(formData);
                                                    setTitle("Select Status");
                                                }
                                                }
                                            >
                                            Update</Button>
                                            :
                                            ''
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
    contacts: state.contacts,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeContact, getContacts, updateContact, getRole })(Contacts);