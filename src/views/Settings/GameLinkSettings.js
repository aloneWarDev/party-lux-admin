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


const GameLinkSettings = (props) => {

	const [links, setLinks] = useState({
		instagram: '', 
		twitter: '',
		discord:'', 
		telegram:'',
		sdkDocumentationLink:  '' ,

    	sdkViewRequirement: '' ,
    
    	sdkInstallationInstructionLinkAndriod: '' ,
    	sdkInstallationInstructionLinkiOS:  '' ,
    	sdkInstallationInstructionLinkUnity: '' ,
    
    	sdkIntegrationInstructionAndriod: '' ,
    	sdkIntegrationInstructioniOS: '' ,
    	sdkIntegrationInstructionUnity:  '' ,

    	sdkCoreLoopInstructionAndriod:  '' ,
    	sdkCoreLoopInstructioniOS:  '' ,
    	sdkCoreLoopInstructionUnity: '' ,

    	sdkFairnessinstructionAndriod: '' ,
    	sdkFairnessinstructioniOS:  '' ,
    	sdkFairnessinstructionUnity: '' ,
    
    	themeInstructionLink:  '' ,
    	tournamentInstructionLink:  '' ,

    	pushNotificationLinkAndroid: '' , 
    	pushNotificationLinkiOS: '' ,

    	monetizationAppleInstruction:  '' ,

		liveWithSkillz: '',
    
		progressionLink:  '' ,
		entryPointLink:  '' ,
		inGameItemLink: '' ,
		playerDataLink: '' ,  
		progressionDocumentation: '' ,
		playerDataApiLink: '' ,

		expertDAULink:  '' ,
		expertMonetizationLink: '' ,
		expertTipLink:  '' ,
	
	
		downloadDocumentation: '',
		documentation:'',	

	})
	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [msg, setMsg] = useState({
		instagram: '', 
		twitter: '',
		discord:'', 
		telegram:'',

		sdkDocumentationLink:  '' ,

    	sdkViewRequirement: '' ,
    
    	sdkInstallationInstructionLinkAndriod: '' ,
    	sdkInstallationInstructionLinkiOS:  '' ,
    	sdkInstallationInstructionLinkUnity: '' ,
    
    	sdkIntegrationInstructionAndriod: '' ,
    	sdkIntegrationInstructioniOS: '' ,
    	sdkIntegrationInstructionUnity:  '' ,

    	sdkCoreLoopInstructionAndriod:  '' ,
    	sdkCoreLoopInstructioniOS:  '' ,
    	sdkCoreLoopInstructionUnity: '' ,
    	sdkFairnessinstructionAndriod: '' ,

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
        // var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        var exp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
		// var exp = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/
		var regex = new RegExp(exp);
        if(string.match(regex)){
            return true
        }else{
            return false
        }
    };

	const save = () => {
		let check = true
		let error = {}

		if(!isValidURL(links.sdkDocumentationLink) ){
			error.sdkDocumentationLink = 'Invalid SDK documentation link Url. Must include https:// or http://'
		    check = false
		}else{ error.sdkDocumentationLink = ''}

		if(!isValidURL(links.sdkViewRequirement)){
			error.sdkViewRequirement = 'Invalid Sdk View Requirement Url. Must include https:// or http://'
			check = false
		}else{ error.sdkViewRequirement = '' }

		if(!isValidURL( links.sdkInstallationInstructionLinkAndriod )){
			error.sdkInstallationInstructionLinkAndriod = 'Invalid Sdk Installation Instruction Link Andriod Url. Must include https:// or http://'
			check = false
		}else{ error.sdkInstallationInstructionLinkAndriod = '' }

		if(!isValidURL( links.sdkInstallationInstructionLinkiOS )){
			error.sdkInstallationInstructionLinkiOS = 'Invalid Sdk Installation Instruction Link iOS Url. Must include https:// or http://'
			check = false
		}else{ error.sdkInstallationInstructionLinkiOS = ''}

		if(!isValidURL(links.sdkInstallationInstructionLinkUnity) ){
			error.sdkInstallationInstructionLinkUnity = 'Invalid Sdk Installation Instruction Link Unity Url. Must include https:// or http://'
			check = false
		}else{ error.sdkInstallationInstructionLinkUnity = ''}

		if(!isValidURL(links.sdkIntegrationInstructionAndriod)){
			error.sdkIntegrationInstructionAndriod = 'Invalid Sdk Integration Instruction Andriod Url. Must include https:// or http://'
			check = false
		}else{ error.sdkIntegrationInstructionAndriod = '' }

		if(!isValidURL( links.sdkIntegrationInstructioniOS )){
			error.sdkIntegrationInstructioniOS = 'Invalid Sdk Integration Instruction iOS Url. Must include https:// or http://'
			check = false
		}else{ error.sdkIntegrationInstructioniOS = '' }

		if(!isValidURL( links.sdkIntegrationInstructionUnity )){
			error.sdkIntegrationInstructionUnity = 'Invalid SdkIntegrationInstructionUnity Url'
			check = false
		}else{ error.sdkIntegrationInstructionUnity = ''}

		if(!isValidURL(links.sdkCoreLoopInstructionAndriod) ){
			error.sdkCoreLoopInstructionAndriod = 'Invalid Sdk Core-Loop Instruction Andriod Url. Must include https:// or http://'
			check = false
		}else{ error.sdkCoreLoopInstructionAndriod = ''}

		if(!isValidURL(links.sdkCoreLoopInstructioniOS)){
			error.sdkCoreLoopInstructioniOS = 'Invalid Sdk Core-Loop Instruction iOS Url. Must include https:// or http://'
			check = false
		}else{ error.sdkCoreLoopInstructioniOS = '' }

		if(!isValidURL( links.sdkCoreLoopInstructionUnity )){
			error.sdkCoreLoopInstructionUnity = 'Invalid Sdk Core-Loop Instruction Unity Url. Must include https:// or http://'
			check = false
		}else{ error.sdkCoreLoopInstructionUnity = '' }

		if(!isValidURL( links.sdkFairnessinstructionAndriod )){
			error.sdkFairnessinstructionAndriod = 'Invalid Sdk Fairness instruction Andriod Url. Must include https:// or http://'
			check = false
		}else{ error.sdkFairnessinstructionAndriod = ''}



		
		  	 	
    	  	   
    	


		if(!isValidURL(links.sdkFairnessinstructioniOS) ){
			error.sdkFairnessinstructioniOS = 'Invalid Sdk Fairness instruction iOS link Url. Must include https:// or http://'
		    check = false
		}else{ error.sdkFairnessinstructioniOS = ''}

		if(!isValidURL(links.sdkFairnessinstructionUnity)){
			error.sdkFairnessinstructionUnity = 'Invalid Sdk Fairness instruction Unity Url. Must include https:// or http://'
			check = false
		}else{ error.sdkFairnessinstructionUnity = '' }

		if(!isValidURL( links.themeInstructionLink )){
			error.themeInstructionLink = 'Invalid Theme Instruction Link Url. Must include https:// or http://'
			check = false
		}else{ error.themeInstructionLink = '' }

		if(!isValidURL( links.tournamentInstructionLink )){
			error.tournamentInstructionLink = 'Invalid Tournament Instruction Link Url. Must include https:// or http://'
			check = false
		}else{ error.tournamentInstructionLink = ''}


		if(!isValidURL( links.pushNotificationLinkAndroid )){
			error.pushNotificationLinkAndroid = 'Invalid Push Notification Link Android Url. Must include https:// or http://'
			check = false
		}else{ error.pushNotificationLinkAndroid = ''}


		if(!isValidURL( links.pushNotificationLinkiOS )){
			error.pushNotificationLinkiOS = 'Invalid Push Notification Link iOS Url. Must include https:// or http://'
			check = false
		}else{ error.pushNotificationLinkiOS = ''}


		if(!isValidURL( links.monetizationAppleInstruction )){
			error.monetizationAppleInstruction = 'Invalid Monetization Apple Instruction Url. Must include https:// or http://'
			check = false
		}else{ error.monetizationAppleInstruction = ''}


		if(!isValidURL( links.liveWithSkillz )){
			error.liveWithSkillz = 'Invalid Live With Skillz Url. Must include https:// or http://'
			check = false
		}else{ error.liveWithSkillz = ''}

		  

		  



		if(!isValidURL( links.progressionLink )){
			error.progressionLink = 'Invalid Progression Link Url. Must include https:// or http://'
			check = false
		}else{ error.progressionLink = ''}


		if(!isValidURL( links.entryPointLink )){
			error.entryPointLink = 'Invalid Entry Point Link Url. Must include https:// or http://'
			check = false
		}else{ error.entryPointLink = ''}


		if(!isValidURL( links.inGameItemLink )){
			error.inGameItemLink = 'Invalid InGame Item Link Url. Must include https:// or http://'
			check = false
		}else{ error.inGameItemLink = ''}



		if(!isValidURL( links.playerDataLink )){
			error.playerDataLink = 'Invalid Player Data Link Url. Must include https:// or http://'
			check = false
		}else{ error.playerDataLink = ''}


		if(!isValidURL( links.progressionDocumentation )){
			error.progressionDocumentation = 'Invalid Progression Documentation Url. Must include https:// or http://'
			check = false
		}else{ error.progressionDocumentation = ''}



		if(!isValidURL( links.playerDataApiLink )){
			error.playerDataApiLink = 'Invalid Player Data Api Link Url. Must include https:// or http://'
			check = false
		}else{ error.playerDataApiLink = ''}


		if(!isValidURL( links.expertDAULink )){
			error.expertDAULink = 'Invalid Expert DAU Url. Must include https:// or http://'
			check = false
		}else{ error.expertDAULink = ''}


		if(!isValidURL( links.expertMonetizationLink )){
			error.expertMonetizationLink = 'Invalid Expert Monetization Url. Must include https:// or http://'
			check = false
		}else{ error.expertMonetizationLink = ''}


		if(!isValidURL( links.expertTipLink )){
			error.expertTipLink = 'Invalid Expert Tip Url. Must include https:// or http://'
			check = false
		}else{ error.expertTipLink = ''}


		if(!isValidURL( links.downloadDocumentation )){
			error.downloadDocumentation = 'Invalid Download Documentation Url. Must include https:// or http://'
			check = false
		}else{ error.downloadDocumentation = ''}


		if(!isValidURL( links.documentation )){
			error.documentation = 'Invalid Documentation Url. Must include https:// or http://'
			check = false
		}else{ error.documentation = ''}


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
										<Card.Title as="h4">Game SDK Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">
													SDK documentation link 
													<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a>
													
												</Form.Label>
												<Form.Control type="text" value={links.sdkDocumentationLink} onChange={(e) => setLinks({ ...links, sdkDocumentationLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkDocumentationLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkDocumentationLink}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK view Requirement <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkViewRequirement} onChange={(e) => setLinks({ ...links, sdkViewRequirement: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkViewRequirement ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkViewRequirement}</label>
											</span>
										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Installation Instruction link (Andriod)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkInstallationInstructionLinkAndriod} onChange={(e) => setLinks({ ...links, sdkInstallationInstructionLinkAndriod: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkInstallationInstructionLinkAndriod ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkInstallationInstructionLinkAndriod}</label>
											</span>

										</Col>
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Integration Instruction (iOS)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkInstallationInstructionLinkiOS} onChange={(e) => setLinks({ ...links, sdkInstallationInstructionLinkiOS: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkInstallationInstructionLinkiOS ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkInstallationInstructionLinkiOS}</label>
											</span>
										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Core Loop instruction (Unity)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkInstallationInstructionLinkUnity} onChange={(e) => setLinks({ ...links, sdkInstallationInstructionLinkUnity: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkInstallationInstructionLinkUnity ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkInstallationInstructionLinkUnity}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Fairness instruction (Andriod)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkIntegrationInstructionAndriod} onChange={(e) => setLinks({ ...links, sdkIntegrationInstructionAndriod: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkIntegrationInstructionAndriod ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkIntegrationInstructionAndriod}</label>
											</span>
										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Core Loop instruction (iOS)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkIntegrationInstructioniOS} onChange={(e) => setLinks({ ...links, sdkIntegrationInstructioniOS: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkIntegrationInstructioniOS ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkIntegrationInstructioniOS}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Fairness instruction (Unity)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkIntegrationInstructionUnity} onChange={(e) => setLinks({ ...links, sdkIntegrationInstructionUnity: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkIntegrationInstructionUnity ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkIntegrationInstructionUnity}</label>
											</span>
										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Core Loop instruction (Andriod)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkCoreLoopInstructionAndriod} onChange={(e) => setLinks({ ...links, sdkCoreLoopInstructionAndriod: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkCoreLoopInstructionAndriod ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkCoreLoopInstructionAndriod}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Fairness instruction (iOS)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkCoreLoopInstructioniOS} onChange={(e) => setLinks({ ...links, sdkCoreLoopInstructioniOS: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkCoreLoopInstructioniOS ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkCoreLoopInstructioniOS}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Core Loop instruction (Unity)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkCoreLoopInstructionUnity} onChange={(e) => setLinks({ ...links, sdkCoreLoopInstructionUnity: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkCoreLoopInstructionUnity ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkCoreLoopInstructionUnity}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Fairness instruction (Andriod)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkFairnessinstructionAndriod} onChange={(e) => setLinks({ ...links, sdkFairnessinstructionAndriod: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkFairnessinstructionAndriod ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkFairnessinstructionAndriod}</label>
											</span>
										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Core Loop instruction (iOS)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkFairnessinstructioniOS} onChange={(e) => setLinks({ ...links, sdkFairnessinstructioniOS: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkFairnessinstructioniOS ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkFairnessinstructioniOS}</label>
											</span>
										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">SDK Fairness instruction (Unity)<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.sdkFairnessinstructionUnity} onChange={(e) => setLinks({ ...links, sdkFairnessinstructionUnity: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.sdkFairnessinstructionUnity ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.sdkFairnessinstructionUnity}</label>
											</span>
										</Col>

									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>





					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Theme Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Theme instruction link <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.themeInstructionLink} onChange={(e) => setLinks({ ...links, themeInstructionLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.themeInstructionLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.themeInstructionLink}</label>
											</span>

										</Col>
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>

					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Tournament Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Tournament instruction link <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.tournamentInstructionLink} onChange={(e) => setLinks({ ...links, tournamentInstructionLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.tournamentInstructionLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.tournamentInstructionLink}</label>
											</span>

										</Col>
									
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>



					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Push Notification Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Push notification link (Andriod) <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.pushNotificationLinkAndroid} onChange={(e) => setLinks({ ...links, pushNotificationLinkAndroid: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.pushNotificationLinkAndroid ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.pushNotificationLinkAndroid}</label>
											</span>

										</Col>

										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Push notification link (iOS) <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.pushNotificationLinkiOS} onChange={(e) => setLinks({ ...links, pushNotificationLinkiOS: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.pushNotificationLinkiOS ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.pushNotificationLinkiOS}</label>
											</span>

										</Col>
									
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>


					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Monetization Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Monetization Apple instruction <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.monetizationAppleInstruction} onChange={(e) => setLinks({ ...links, monetizationAppleInstruction: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.monetizationAppleInstruction ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.monetizationAppleInstruction}</label>
											</span>

										</Col>
									
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>





					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Deployment Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Live with Deskillz <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.liveWithSkillz} onChange={(e) => setLinks({ ...links, liveWithSkillz: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.liveWithSkillz ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.liveWithSkillz}</label>
											</span>

										</Col>

																
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>







					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Game Progression Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">What is Progression? <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.progressionLink} onChange={(e) => setLinks({ ...links, progressionLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.progressionLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.progressionLink}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Enter Point <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.entryPointLink} onChange={(e) => setLinks({ ...links, entryPointLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.entryPointLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.entryPointLink}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">In Game Items<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.inGameItemLink} onChange={(e) => setLinks({ ...links, inGameItemLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.inGameItemLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.inGameItemLink}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Player Data<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.playerDataLink} onChange={(e) => setLinks({ ...links, playerDataLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.playerDataLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.playerDataLink}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Progression Documentation<a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.progressionDocumentation} onChange={(e) => setLinks({ ...links, progressionDocumentation: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.progressionDocumentation ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.progressionDocumentation}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Player Data API <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.playerDataApiLink} onChange={(e) => setLinks({ ...links, playerDataApiLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.playerDataApiLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.playerDataApiLink}</label>
											</span>

										</Col>


																
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>





					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Developer Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Download Documentation Developer <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.downloadDocumentation} onChange={(e) => setLinks({ ...links, downloadDocumentation: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.downloadDocumentation ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.downloadDocumentation}</label>
											</span>

										</Col>



										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Documentation Developer <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.documentation} onChange={(e) => setLinks({ ...links, documentation: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.documentation ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.documentation}</label>
											</span>

										</Col>

																
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
												</Col>
										}
									</Row>
								</Card.Footer>
								
							</Card>
						</Form>
					</Col>


					<Col md="12">
						<Form action="" className="form-horizontal" id="TypeValidation" method="">
							<Card className="table-big-boy">
								<Card.Header>
									<div className="d-block d-md-flex align-items-center justify-content-between">
										<Card.Title as="h4">Overview Game Links</Card.Title>
									</div>
								</Card.Header>
								
									<Card.Body>
									<Row>  
										
										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Expert DAU Link <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.expertDAULink} onChange={(e) => setLinks({ ...links, expertDAULink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.expertDAULink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.expertDAULink}</label>
											</span>

										</Col>



										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Expert Monetization Link <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.expertMonetizationLink} onChange={(e) => setLinks({ ...links, expertMonetizationLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.expertMonetizationLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.expertMonetizationLink}</label>
											</span>

										</Col>


										<Col xl={4} sm={6}>
											<Form.Group>
												<Form.Label className="d-block mb-2">Expert Tip Link <a className="text-danger" data-tip data-for='global'>*<FontAwesomeIcon icon={faExclamation} /></a></Form.Label>
												<Form.Control type="text" value={links.expertTipLink} onChange={(e) => setLinks({ ...links, expertTipLink: e.target.value })}></Form.Control>
											</Form.Group>
											<span className={msg.expertTipLink ? `` : `d-none`}>
												<label className="pl-1 pt-0 text-danger">{msg.expertTipLink}</label>
											</span>

										</Col>

																
									</Row>
								</Card.Body>
								<Card.Footer>
									<Row className="float-right">
										{
											permissions && permissions.editSetting &&
												<Col sm={12}>
													<Button variant="info" onClick={save} > Save Links </Button>
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

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole })(GameLinkSettings);
