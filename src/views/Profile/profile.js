import React, { useRef, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeAdmin, getAdmin, updateAdmin, updatePassword } from '../Admin/Admin.action';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye ,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import userDefaultImg from '../../assets/img/default-profile.png'
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
var CryptoJS = require("crypto-js");
import { toast } from 'react-toastify';
import validator from 'validator';
import { ENV } from "../../config/config";

let adminId = localStorage.getItem('userID')

function Profile(props) {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    status: '',
    image: ''
  })

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
    _id: ''
  })

  const [showPass , setShowPass] =useState(
    {
      current: false,
      new: false,
      confirm: false
    }
  )

  const [pic, setPic] = useState({
    image: null,
    _id: ''
  })

  const [nameMsg, setNameMsg] = useState(false)
  const [emailMsg, setEmailMsg] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState(false)
  const [passwordMsgCheck, setPasswordMsgCheck] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    window.scroll(0, 0)
    props.beforeAdmin()
    setLoader(true)
    const callback = (data)=>{
      setLoader(false)
    }
    props.getAdmin(localStorage.getItem('userID') , callback)

    let roleEncrypted = localStorage.getItem('role');
    let role = ''
    if (roleEncrypted) {
      let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
      role = roleDecrypted
    }
    props.getRole(role)
  }, [])



  useEffect(() => {
    if (props.admin.updateAdminAuth ) {
      let { updateAdminRes } = props.admin
      localStorage.setItem('userImage', updateAdminRes.admin?.image);
    
      setAdmin({
        ...admin,
        name: updateAdminRes.admin?.name,
        email: updateAdminRes.admin?.email,
        address: updateAdminRes.admin?.address,
        phone: updateAdminRes.admin?.phone,
        image: updateAdminRes.admin?.image
      })
    }
  }, [props.admin.updateAdminAuth ])

  useEffect(() => {
    if (props.admin.getAuth) {
      const { admin } = props.admin
      setAdmin(admin)
    }
  }, [props.admin.getAuth])

  useEffect(() => {
    if (Object.keys(props.getRoleRes).length > 0) {
      setAdminRole(props.getRoleRes.role)
    }
  }, [props.getRoleRes])

  useEffect(() => {
    if (password.new === password.confirm) {
      if(!ENV.validatePassword(password.new)){
        setPasswordMsg('Password should consist of 8 character Minimum , one UpperCase Letter , one LowerCase Letter and on Special Character ')
      }
      else{
        setPasswordMsgCheck(false)
      }


    }
    else {
      setPasswordMsg('New passord & confirm password are not same.')
      setPasswordMsgCheck(true)
    }
  }, [password])

  	// when an error is received
	useEffect(() => {
		if (props.error.error)
			setLoader(false)
	}, [props.error.error])


  const submitCallBack = (e) => {
    e.preventDefault()

    if (!validator.isEmpty(admin.name.trim()) && validator.isEmail(admin.email)) {
      if (validator.isEmpty(admin.phone.trim())) {
        //Submit for empty phone field
        setNameMsg(false)
        setEmailMsg(false)
        setPhoneMsg(false)
        setLoader(true)
        const callback = (data) => {
          setLoader(false)
          toast.dismiss()
          toast.success("Profile Updated successfully")
        }
        props.updateAdmin(admin ,false, callback)

      }
      else {
        if (validator.isDecimal(admin.phone)) {
          //Submit 
          setNameMsg(false)
          setEmailMsg(false)
          setPhoneMsg(false)
          setLoader(true)
          const callback = (data) => {
            setLoader(false)
            toast.dismiss()
            toast.success("Profile Updated successfully")
          }
          props.updateAdmin(admin ,false ,callback)


        }
        else {
          //Dont submit
          setPhoneMsg(true)
        }
      }
    }
    else {
      if (validator.isEmpty(admin.name.trim())) {
        setNameMsg(true)
      }
      else {
        setNameMsg(false)
      }
      if (!validator.isEmail(admin.email)) {
        setEmailMsg(true)
      }
      else {
        setEmailMsg(false)
      }
      if (validator.isDecimal(admin.phone)) {
        setPhoneMsg(false)
      }
      else {
        setPhoneMsg(true)
      }

    }


  }

  const passwordForm = (e) => {
    e.preventDefault()

    if (!validator.isEmpty(password.current.trim()) && !validator.isEmpty(password.new.trim())
      && !validator.isEmpty(password.confirm.trim())
    ) {
      if (password.new === password.confirm) {
        if (validator.isStrongPassword(password.new)) {
          setPasswordMsgCheck(false)
          setLoader(true)
          let formData = new FormData()
          for (const key in password)
            formData.append(key, password[key])

          const callback=(data)=>{
            setLoader(false)
            toast.dismiss()
            toast.success("Password updated successfully")
          }
          props.updatePassword(formData ,false, callback)

          setPassword({
            current: '',
            new: '',
            confirm: '',
            _id: ''
          })
          e.target[0].value = ''
          e.target[1].value = ''
          e.target[2].value = ''

        }
        else {
          setPasswordMsg('Password must contain Upper Case, Lower Case, a Special Character, a Number and must be at least 8 characters in length')
          setPasswordMsgCheck(true)
        }
      }
      else {
        setPasswordMsg('New password & confirm password are not same.')
        setPasswordMsgCheck(true)
      }
    }
    else {
      setPasswordMsg('You have to fill all fields to change password.')
      setPasswordMsgCheck(true)
    }
  }

  const onFileChange = (e) => {
    let file = e.target.files[0]
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        setAdmin({ ...admin, image: reader.result })
      }
      setPic({ ...pic, image: file })
    }
  }

  const submitPic = (e) => {
    e.preventDefault()

    if (pic.image) {
      setLoader(true)
      const callback = (data)=>{
        setLoader(false)
        toast.dismiss()
        toast.success("Profile image Updated successfully")
      }
      props.updateAdmin({
        image: pic.image,
        _id: localStorage.getItem('userID')
      },false,callback)

      document.querySelector('#imageUploader').value = null
      setPic({ ...pic, image: null })
    }
    else {
      toast.error('Please upload pic before updating.')
    }

  }

  return (
    <>
      {
        loader ?
          <FullPageLoader />
          :
          <Container fluid>
            <div className="section-image" data-image="../../assets/img/bg5.jpg">
              {/* you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " */}
              <Container>
                <Row>
                  <Col md="8">
                    <Form action="" className="form" onSubmit={(e) => submitCallBack(e)}>
                      <Card className="pb-4 table-big-boy">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Profile</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Name<span className="text-danger"> *</span></label>
                                <Form.Control
                                  value={admin?.name ? admin?.name : ''}
                                  onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                                  placeholder="Company"
                                  type="text"
                                ></Form.Control>
                                <span className={nameMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Name Required</label>
                                </span>

                              </Form.Group>
                            </Col>
                            <Col className="pl-3" md="6">
                              <Form.Group>
                                <label>Email<span className="text-danger"> *</span></label>
                                <Form.Control
                                  value={admin?.email ? admin?.email : ''}
                                  placeholder="Email"
                                  type="email"
                                  disabled={true}
                                ></Form.Control>
                                <span className={emailMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Email Required</label>
                                </span>

                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <Form.Group>
                                <label>Address</label>
                                <Form.Control
                                  value={admin?.address ? admin?.address : ''}
                                  onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                                  placeholder="Address"
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Phone</label>
                                <Form.Control
                                  value={admin?.phone ? admin?.phone : ''}
                                  onChange={(e) => {
                                    if ((e.target.value).length < 21 &&  /^[0-9]*$/.test(e.target.value) ) { 
                                      //if( /^[0-9]*$/.test(e.target.value) ){
                                      setAdmin({ ...admin, phone: e.target.value })
                                    }
                                  }}
                                  type="text"
                                ></Form.Control>
                                <span className={phoneMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Phone # Required</label>
                                </span>
                              </Form.Group>
                            </Col>
                            <Col className="pl-3" md="6">
                              <Form.Group>
                                <label>Status<span className="text-danger"> *</span></label>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  className="p-1"
                                  checked={admin?.status !== undefined ? admin?.status : false}
                                  onChange={(e) => setAdmin({ ...admin, status: e.target.checked })}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Role</label>
                                <Form.Control
                                  readOnly
                                  value={adminRole?.title ? adminRole?.title : ''}
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="info"
                          >
                            Update Profile
                          </Button>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                  <Col md="4">
                    <Card className="card-user table-big-boy">
                      <Card.Header className="no-padding">
                        <div className="card-image">
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div className="author">
                          <img
                            alt="..."
                            className="avatar border-gray"
                            src={admin?.image ? admin?.image : userDefaultImg}
                          ></img>
                          <Card.Title as="h5">{admin.name}</Card.Title>
                          <p className="card-description"></p>
                        </div>
                        <Form onSubmit={(e) => submitPic(e)}>
                          <Form.Group className="pl-3 pr-3 d-flex update-select-buttons align-items-center">

                            <Form.Control
                              placeholder="Company"
                              type="file"
                              varient="info"
                              accept=".png,.jpeg,.jpg"
                              onChange={(e) => onFileChange(e)}
                              id="imageUploader"
                            ></Form.Control>
                            <div className="text-center">
                              <Button
                                className="btn-fill m-0 pull-right update-pic-btn"
                                type="submit"
                                variant="info"
                              >
                                Update Pic
                              </Button>
                            </div>
                          </Form.Group>
                        </Form>
                      </Card.Body>
                      <Card.Footer>
                        <div className="pb-2"></div>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <Form action="" className="form" onSubmit={(e) => passwordForm(e)}>
                      <Card className="table-big-boy pb-4">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Change Password</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md="4">
                              <Form.Group className='custom-input'>
                                <label>Current Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="Current Password"
                                  type={showPass.current ?  "text" : "password"}
                                  onChange={(e) => {
                                    setPassword({ ...password, current: e.target.value });
                                  }}
                                ></Form.Control>
                                {
                                  password.current ?
                                      <div className="eye-icon">
                                          <FontAwesomeIcon onClick={(e) => setShowPass({...showPass , current: !showPass.current})} icon={showPass.current ? faEyeSlash : faEye} />
                                      </div>
                                      :
                                      ""
                                }
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>New Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="New Password"
                                  type={showPass.new ? "text" : "password" }
                                  onChange={(e) => {
                                    setPassword({ ...password, new: e.target.value });
                                  }}
                                ></Form.Control>
                                {
                                  password.new ?
                                      <div className="eye-icon">
                                          <FontAwesomeIcon onClick={(e) => setShowPass({...showPass , new: !showPass.new})} icon={showPass.new ? faEyeSlash : faEye} />
                                      </div>
                                      :
                                      ""
                                }
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>Confirm Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="Confirm Password"
                                  type={showPass.confirm ?  "text" : "password" }
                                  onChange={(e) => setPassword({ ...password, confirm: e.target.value, _id: localStorage.getItem('userID') })}
                                ></Form.Control>
                                {
                                  password.confirm ?
                                      <div className="eye-icon">
                                          <FontAwesomeIcon onClick={(e) => setShowPass({...showPass , confirm: !showPass.confirm })} icon={showPass.confirm ? faEyeSlash : faEye} />
                                      </div>
                                      :
                                      ""
                                }
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Form.Group className={passwordMsgCheck ? `` : `d-none`}>
                              <label className="pl-3 text-danger">{passwordMsg}</label>
                            </Form.Group>
                          </Row>
                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="info"
                          >
                            Update Password
                          </Button>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Container>
      }
    </>
  );
}

const mapStateToProps = state => ({
  admin: state.admin,
  error: state.error,
  getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeAdmin, getAdmin, updateAdmin, updatePassword, getRole })(Profile);
