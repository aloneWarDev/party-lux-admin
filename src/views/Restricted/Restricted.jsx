import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LogoD from "../../assets/img/d-logo.png"
import Logo from "../../assets/img/logo-teext.png"

class Restricted extends Component {
  
  render() {
    return (
        <div className="pt-3 pt-md-5">
          <Container fluid>
                {/* Card Links */}
                <Row>
                  <Col sm={12} className="text-center">
                      <span className="dlogo"><img src={LogoD} className="dlogo"  alt="Deskillz" /></span>
                      <span className="dlogo"><img src={Logo} className='textlogo'  alt="Deskillz" /></span>
                      <h2 style={{ "color":"red" }}> You don't have permission to access this page</h2>
                      <p style={{ "color":"white" }}> Contact super admin</p>
                      <a style={{ "cursor": "pointer" }} className="btn btn-danger" onClick={() => {
                        localStorage.removeItem("admin-accessToken"); 
                        window.location.replace('/admin');
                      }}>
                        <i className="nc-icon nc-button-power"></i>
                        Log out
                      </a>
                  </Col>
                </Row>
                
          </Container>
        </div>
    );
  }
}

export default Restricted;