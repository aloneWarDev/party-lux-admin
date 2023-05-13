import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import AnnexMainLogo from "../../assets/img/part-lux-logo.png";
import './ResetPassword.css'

// react-bootstrap components
import { Button, Card, Form, Container, Col } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { beforeAdmin, resetPassword } from '../Admin/Admin.action';

import validator from 'validator';

function ResetPassword(props) {
  const [cardClasses, setCardClasses] = React.useState("card-hidden");
  const [showPass , setShowPass] = useState(false)
  const [showConfirmPass , setShowConfirmPass] = useState(false)
  const [password, setPassword] = React.useState({
    new: '',
    confirm: '',
    _id: window.location.pathname.split('/')[3],
    code: window.location.pathname.split('/')[4]
  })
  const [msg, setMsg] = React.useState({
    new: '',
    confirm: ''
  })

  const Submit = (e) => {
    e.preventDefault()
    if (!validator.isEmpty(password.new.trim()) && !validator.isEmpty(password.confirm.trim())) {
      if (password.new === password.confirm) {
        if (validator.isStrongPassword(password.new)) {
          setMsg({ new: '', confirm: '' })
          let formData = new FormData()
          for (const key in password)
            formData.append(key, password[key])
          props.resetPassword(formData)
        }
        else {
          setMsg({ new: 'Password must contain Upper Case, Lower Case, a Special Character, a Number and must be at least 8 characters in length', confirm: '' })
        }
      }
      else {
        setMsg({ new: 'New password & confirm password are not same.', confirm: '' })
      }
    }
    else {
      let passNew = '', passConf = ''
      if (validator.isEmpty(password.new.trim()) || password.new ) {
        passNew = 'New password is Required.'
      }
      if (validator.isEmpty(password.confirm.trim()) || password.confirm ) {
        passConf = "Confirm password is Required."
      }
      setMsg({ new: passNew, confirm: passConf })
    }
  }


  React.useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 500);
  });

  React.useEffect(() => {
    if (props.admin.resetPasswordAuth) {
      setPassword({...password, new: '', confirm: ''})
      props.beforeAdmin()
    }
  }, [props.admin.resetPasswordAuth])


  return (
    <>
      <div
        // className="full-page section-image"
        data-color="black"
        data-image={require("assets/img/full-screen-image-2.jpg").default}
      >
        <div className="content d-flex align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="4" md="8">
              <Form action="" className="form" method="">
                <Card className={"card-login " + cardClasses}>
                  <Card.Header className="text-center">
                    <div className=" header logo-holder d-inline-block align-top mb-3 ">
                      <img src={AnnexMainLogo} />
                    </div>
                    <h3 className="header text-white mt-3">Reset Password</h3>
                  </Card.Header>
                  <Card.Body>
                    <Card.Body>
                      <Form.Group className="custom-input">
                        <label>New Password<span className="text-danger">*</span></label>
                        <Form.Control
                          placeholder='Password'
                          value={password.new}
                          onChange={(e) =>{ setMsg({...msg , new: ''}); setPassword({ ...password, new: e.target.value }) } }
                          type={showPass ? "text" : "password"}
                          className="text-white"
                        ></Form.Control>
                       {
                        password.new ?
                            <div className="eye-icon ">
                                <FontAwesomeIcon style={{color : 'white' }} onClick={(e) => setShowPass(!showPass)} icon={showPass ? faEyeSlash : faEye} />
                            </div>
                            :
                            ""
                        }
                        <span className={msg.new ? `` : `d-none`}>
                          <label className="pl-1 text-danger">{msg.new}</label>
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <label>Confirm Password<span className="text-danger">*</span></label>
                        <Form.Control
                          placeholder="Confirm Password"
                          type={showConfirmPass ? "text" : "password"}
                          value={password.confirm}
                          onChange={(e) => { setMsg({...msg , confirm: ''}); setPassword({ ...password, confirm: e.target.value }) } }
                        ></Form.Control>
                        {
                        password.confirm ?
                            <div className="eye-icon ">
                                <FontAwesomeIcon style={{color : 'white' }} onClick={(e) => setShowConfirmPass(!showConfirmPass)} icon={showConfirmPass ? faEyeSlash : faEye} />
                            </div>
                            :
                            ""
                        }
                        <span className={msg.confirm ? `` : `d-none`}>
                          <label className="pl-1 text-danger">{msg.confirm}</label>
                        </span>
                      </Form.Group>
                      <NavLink to="/" className="btn-no-bg float-right" type="submit" variant="warning">
                        Login Page
                      </NavLink>

                    </Card.Body>
                  </Card.Body>
                  <Card.Footer className="ml-auto mr-auto">
                    <Button className="btn-wd btn-info" type="submit" variant="warning" onClick={Submit}>
                      Submit
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage:
              "url(" +
              require("assets/img/full-screen-image-2.jpg").default +
              ")",
          }}
        ></div>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  admin: state.admin,
  error: state.error
});

export default connect(mapStateToProps, { beforeAdmin, resetPassword })(ResetPassword);
