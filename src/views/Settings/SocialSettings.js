import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { getSettings, beforeSettings, editSettings } from './settings.action';
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faExclamation
	} from '@fortawesome/free-solid-svg-icons';
var CryptoJS = require("crypto-js");
import ReactTooltip from 'react-tooltip'

// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";


const SocialSettings = (props) => {

	const [links, setLinks] = useState({
		instagram: '', 
		twitter: '',
		discord:'', 
		telegram:'',

	})
	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [msg, setMsg] = useState({
		instagram: '', 
		twitter: '',
		discord:'', 
		telegram:'',

	})

	useEffect(() => {
		window.scroll(0, 0)
		const callback=()=>{
			setLoader(false);
		}
		props.getSettings(callback)
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
		if (props.settings.settingsAuth) {
			if (props.settings.settings) {
				setLoader(false)
				setLinks({ ...links, ...props.settings.settings })
			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	function isValidURL(string) {
        var expression = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
		// var expression = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/
		var regex = new RegExp(expression);
        if(string.match(regex)){
            return true
        }else{
            return false
        }
    };

	const save = () => {
		let check = true
		let error = {}

		if(!isValidURL(links.instagram) ){
			error.instagram = 'must include https:// or http://'
			check = false
		}else{ error.instagram = ''}
		if(!isValidURL(links.twitter)){
			error.twitter = 'must include https:// or http://'
			check = false
		}else{ error.twitter = '' }
		if(!isValidURL( links.discord )){
			error.discord = 'must include https:// or http://'
			check = false
		}else{ error.discord = '' }
		if(!isValidURL( links.telegram )){
			error.telegram = 'must include https:// or http://'
			check = false
		}else{ error.telegram = ''}

		setMsg(error)
		if(check){
			setMsg({})
			let formData = new FormData()
			for (const key in links)
				formData.append(key, links[key])
			const qs = ENV.objectToQueryString({ type: '2' })
			props.editSettings(formData, qs)
			setLoader(true)
		}
	}


	return (
		<>
		{

		loader? <FullPageLoader/> : 
			<Container fluid>
				<ReactTooltip id='global' aria-haspopup='true' >must include https:// or http://</ReactTooltip>
				<Row>
					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Social Settings</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Twitter <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.twitter} onChange={(e) => setLinks({ ...links, twitter: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.twitter ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.twitter}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Instagram <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.instagram} onChange={(e) => setLinks({ ...links, instagram: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.instagram ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.instagram}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Discord <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.discord} onChange={(e) => setLinks({ ...links, discord: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.discord ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.discord}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Telegram <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.telegram} onChange={(e) => setLinks({ ...links, telegram: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.telegram ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.telegram}</label>
											</span>
										</Col>
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Settings </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>
				</Row>
			</Container>
		}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
	error: state.error,
	getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole })(SocialSettings);
